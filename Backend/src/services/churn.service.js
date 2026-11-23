// Churn ka poora flow:
// Customers (Postgres) -> features -> Python model -> ChurnScore (Mongo)
//   -> High/Medium risk ko engagement message -> admin report / alerts
const { Op } = require('sequelize');
const User = require('../models/postgres/user.model');
const Order = require('../models/postgres/order.model');
const ChurnScore = require('../models/mongo/churnScore.model');
const EngagementMessage = require('../models/mongo/engagementMessage.model');
const ActivityLog = require('../models/mongo/activityLog.model');
const ContactMessage = require('../models/mongo/contactMessage.model');
const ChatSession = require('../models/mongo/chatSession.model');
const ChatMessage = require('../models/mongo/chatMessage.model');
const OrderItem = require('../models/postgres/orderItem.model');
const Product = require('../models/postgres/product.model');
const { buildFeatures, predictChurn, predictMany } = require('./churnClient.service');
const { buildSuggestion, sendEngagement } = require('./engagement.service');
const ApiError = require('../utils/ApiError');

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const CHAT_DAYS = 30; // chat ke signals kitne din purane tak ginte hain (Kaggle "Complain" = last month)

/* ------------------------------------------------------------------ */
/* 0) Chat -> churn: Help Bot + Skincare Assistant ka data              */
/* ------------------------------------------------------------------ */

const emptyChat = () => ({
  complaints: 0, // Help Bot / Contact Us complaints (30 din)
  refundAsks: 0, // Help Bot mein return / refund / cancel ke sawal
  unanswered: 0, // Help Bot ko sawal samajh nahi aaya
  helpbotMessages: 0,
  skinChats: 0, // Skincare Assistant ki chats
  skinConcerns: [], // maslan ['acne', 'oily skin']
  suggested: [], // [{ sku, name }] Skin Assistant ne suggest kiye, customer ne khareede nahi
});

/**
 * Har customer ke pichle 30 din ke chat signals. Returns Map(userId -> chat).
 * Sirf login customers jurte hain (guest chat ka userId null hota hai).
 * Model ko is mein se sirf complaint jati hai; baaqi signals wajah (reason) aur offer chunne ke liye hain.
 */
const chatSignals = async (userIds, now = new Date()) => {
  const map = new Map(userIds.map((id) => [id, emptyChat()]));
  if (!userIds.length) return map;
  const since = new Date(now.getTime() - CHAT_DAYS * 24 * 60 * 60 * 1000);
  const get = (id) => map.get(id);

  const [complaints, logs, sessions, botMsgs] = await Promise.all([
    ContactMessage.find({ topic: 'complaint', userId: { $in: userIds }, createdAt: { $gte: since } }).select('userId -_id').lean(),
    ActivityLog.find({ userId: { $in: userIds }, eventType: { $in: ['chat_query', 'chat_unanswered'] }, timestamp: { $gte: since } })
      .select('userId eventType metadata -_id').lean(),
    ChatSession.find({ userId: { $in: userIds }, lastMessageAt: { $gte: since } }).select('userId concerns -_id').lean(),
    ChatMessage.find({ userId: { $in: userIds }, role: 'bot', createdAt: { $gte: since }, 'productSkus.0': { $exists: true } })
      .select('userId productSkus -_id').lean(),
  ]);

  complaints.forEach((c) => { if (get(c.userId)) get(c.userId).complaints += 1; });
  logs.forEach((l) => {
    const c = get(l.userId);
    if (!c) return;
    c.helpbotMessages += 1;
    if (l.eventType === 'chat_unanswered') c.unanswered += 1;
    else if (['faq_returns', 'faq_cancel'].includes(l.metadata?.intent)) c.refundAsks += 1;
  });
  sessions.forEach((s) => {
    const c = get(s.userId);
    if (!c) return;
    c.skinChats += 1;
    (s.concerns || []).forEach((k) => { if (!c.skinConcerns.includes(k)) c.skinConcerns.push(k); });
  });

  // Suggest kiye gaye products jo customer ne kabhi khareede nahi
  const suggestedBy = new Map();
  botMsgs.forEach((m) => {
    if (!get(m.userId)) return;
    const set = suggestedBy.get(m.userId) || new Set();
    m.productSkus.forEach((s) => set.add(s));
    suggestedBy.set(m.userId, set);
  });
  if (suggestedBy.size) {
    const bought = await OrderItem.findAll({
      attributes: ['sku'],
      include: [{ model: Order, attributes: ['userId'], where: { userId: { [Op.in]: [...suggestedBy.keys()] } } }],
    });
    bought.forEach((i) => suggestedBy.get(i.Order.userId)?.delete(i.sku));
    const allSkus = [...new Set([...suggestedBy.values()].flatMap((s) => [...s]))];
    const products = allSkus.length
      ? await Product.findAll({ where: { sku: allSkus, available: true }, attributes: ['sku', 'name'] })
      : [];
    const nameOf = new Map(products.map((p) => [p.sku, p.name]));
    suggestedBy.forEach((skus, userId) => {
      get(userId).suggested = [...skus].filter((s) => nameOf.has(s)).slice(0, 3).map((sku) => ({ sku, name: nameOf.get(sku) }));
    });
  }
  return map;
};

/** Model ke features + chat (recent complaint -> "complain") */
const featuresWithChat = (user, chat, now) =>
  buildFeatures(user, user.Orders, now, { recentComplaint: chat.complaints > 0 });

const orderStats = (orders = []) => {
  const valid = orders.filter((o) => o.status !== 'cancelled');
  const lifetimeValue = Math.round(valid.reduce((s, o) => s + Number(o.totalAmount || 0), 0));
  return {
    orders: valid.length,
    avgOrder: valid.length ? Math.round(lifetimeValue / valid.length) : 0,
    lifetimeValue,
  };
};

const toScoreDoc = (user, features, prediction, stats, scoredAt, chat = emptyChat()) => {
  const s = buildSuggestion(features, prediction.riskLevel, user.name, chat);
  return {
    userId: user.id,
    name: user.name,
    email: user.email,
    city: user.city || '',
    features,
    churnProbability: prediction.churnProbability,
    riskLevel: prediction.riskLevel,
    stats: { ...stats, lastOrderDays: features.days_since_last_order },
    chat,
    reason: s.reason,
    action: s.action,
    channel: s.channel,
    scoredAt,
  };
};

/* ------------------------------------------------------------------ */
/* 1) Scoring                                                          */
/* ------------------------------------------------------------------ */

/**
 * Saare customers ko score karta hai aur result Mongo mein save karta hai.
 * autoEngage = true -> High/Medium risk walon ko engagement message (7 din cooldown)
 */
const runScoring = async ({ autoEngage = true } = {}) => {
  const customers = await User.findAll({
    where: { role: 'customer' },
    include: [{ model: Order, attributes: ['id', 'totalAmount', 'status', 'createdAt'] }],
  });

  const scoredAt = new Date();
  if (!customers.length) {
    return { scored: 0, counts: { High: 0, Medium: 0, Low: 0 }, engagementsSent: 0, scoredAt };
  }

  const chats = await chatSignals(customers.map((u) => u.id), scoredAt);
  const featuresList = customers.map((u) => featuresWithChat(u, chats.get(u.id), scoredAt));
  const predictions = await predictMany(featuresList);

  const docs = customers.map((u, i) =>
    toScoreDoc(u, featuresList[i], predictions[i], orderStats(u.Orders), scoredAt, chats.get(u.id))
  );
  await ChurnScore.insertMany(docs);

  let engagementsSent = 0;
  if (autoEngage) {
    for (let i = 0; i < customers.length; i++) {
      // Low risk ko bhi check karte hain: chat mein complaint ki ho to support message jata hai
      const msg = await sendEngagement({
        user: customers[i],
        features: featuresList[i],
        prediction: predictions[i],
        trigger: 'auto',
        chat: chats.get(customers[i].id),
      });
      if (msg) engagementsSent++;
    }
  }

  const counts = { High: 0, Medium: 0, Low: 0 };
  predictions.forEach((p) => { counts[p.riskLevel] = (counts[p.riskLevel] || 0) + 1; });

  return { scored: customers.length, counts, engagementsSent, scoredAt };
};

/** Ek customer ka live prediction (aur save bhi) */
const scoreCustomer = async (userId) => {
  const user = await User.findByPk(userId, {
    include: [{ model: Order, attributes: ['id', 'totalAmount', 'status', 'createdAt'] }],
  });
  if (!user || user.role !== 'customer') throw new ApiError(404, 'Customer not found');

  const now = new Date();
  const chat = (await chatSignals([user.id], now)).get(user.id);
  const features = featuresWithChat(user, chat, now);
  const prediction = await predictChurn(features);
  const doc = await ChurnScore.create(
    toScoreDoc(user, features, prediction, orderStats(user.Orders), now, chat)
  );

  const history = await ChurnScore.find({ userId: user.id })
    .sort({ scoredAt: -1 }).limit(12)
    .select('churnProbability riskLevel scoredAt -_id').lean();
  const engagements = await EngagementMessage.find({ userId: user.id })
    .sort({ sentAt: -1 }).limit(10).lean();

  return { current: doc, history, engagements };
};

/* ------------------------------------------------------------------ */
/* 2) Queries                                                          */
/* ------------------------------------------------------------------ */

/** Date range mein har customer ka sab se latest score */
const latestPerUser = (from, to) => {
  const match = {};
  if (from || to) {
    match.scoredAt = {};
    if (from) match.scoredAt.$gte = from;
    if (to) match.scoredAt.$lt = to;
  }
  return ChurnScore.aggregate([
    { $match: match },
    { $sort: { scoredAt: -1 } },
    { $group: { _id: '$userId', doc: { $first: '$$ROOT' } } },
    { $replaceRoot: { newRoot: '$doc' } },
    { $sort: { churnProbability: -1 } },
  ]);
};

const monthRange = (year, monthIndex) => [
  new Date(year, monthIndex, 1),
  new Date(year, monthIndex + 1, 1),
];

const rateOf = (scores) => {
  if (!scores.length) return 0;
  const high = scores.filter((s) => s.riskLevel === 'High').length;
  return +((high / scores.length) * 100).toFixed(1);
};

/* ------------------------------------------------------------------ */
/* 3) Monthly report — shape bilkul frontend ke buildChurnMonth jaisa  */
/* ------------------------------------------------------------------ */

const initials = (name = '') => name.split(' ').filter(Boolean).map((p) => p[0].toUpperCase()).join('').slice(0, 2);

// abandoned: is mahine cart chhorne walon ka Set (na ho to cartAbandoned = null, card par nahi dikhta)
const toCustomerCard = (s, type, abandoned = null) => {
  const card = {
    id: `${type[0]}-${s.userId}`,
    userId: s.userId,
    type,
    name: s.name,
    initials: initials(s.name),
    email: s.email,
    city: s.city || '-',
    orders: s.stats?.orders ?? 0,
    avgOrder: s.stats?.avgOrder ?? 0,
    lastOrderDays: s.stats?.lastOrderDays ?? s.features?.days_since_last_order ?? 0,
    lifetimeValue: s.stats?.lifetimeValue ?? 0,
    risk: Math.round(s.churnProbability * 100), // percent
    riskLevel: s.riskLevel,
    reason: s.reason,
    action: s.action,
    channel: s.channel,
    // Card ka "Chat & cart" hissa (purane scores mein chat nahi hota -> null)
    chat: s.chat || null,
    complain: s.features?.complain === 1,
    cartAbandoned: abandoned ? abandoned.has(s.userId) : null,
  };
  if (type === 'low') {
    // Kitne hafte bina offer ke chhod sakte hain — probability jitni kam, utna zyada
    card.ignoreWeeks = s.churnProbability < 0.05 ? 8 : s.churnProbability < 0.1 ? 6 : 4;
  }
  return card;
};

/**
 * Pure function (DB nahi) — test karna aasaan.
 * scores: is mahine ke latest-per-user ChurnScore docs
 */
const buildMonthReport = ({ year, monthIndex, scores, trend = [], abandonedUserIds = new Set() }) => {
  const high = scores.filter((s) => s.riskLevel === 'High');
  const medium = scores.filter((s) => s.riskLevel === 'Medium');
  const low = scores.filter((s) => s.riskLevel === 'Low');
  const atRisk = [...high, ...medium];

  const pct = (n) => (atRisk.length ? Math.round((n / atRisk.length) * 100) : 0);
  const f = (s) => s.features || {};
  const drivers = [
    { label: 'No order in 30+ days', value: pct(atRisk.filter((s) => f(s).days_since_last_order >= 30).length) },
    { label: 'Only 1–2 orders so far', value: pct(atRisk.filter((s) => f(s).order_count <= 2).length) },
    { label: 'New customer (< 3 months)', value: pct(atRisk.filter((s) => f(s).tenure_months < 3).length) },
    { label: 'Complaint raised', value: pct(atRisk.filter((s) => f(s).complain === 1).length) },
    { label: 'Cart abandoned', value: pct(atRisk.filter((s) => abandonedUserIds.has(s.userId)).length) },
    // chat (Help Bot + Skincare Assistant) se
    { label: 'Asked about a return or refund in chat', value: pct(atRisk.filter((s) => s.chat?.refundAsks > 0).length) },
    { label: 'Chat question not answered', value: pct(atRisk.filter((s) => s.chat?.unanswered > 0).length) },
    { label: 'Liked Skin Assistant picks but did not buy', value: pct(atRisk.filter((s) => s.chat?.suggested?.length > 0).length) },
  ].sort((a, b) => b.value - a.value);

  // Revenue at risk = high-risk customers ka andaazan saal bhar ka kharcha
  const revenueAtRisk = Math.round(high.reduce((sum, s) => {
    const months = Math.max(1, s.features?.tenure_months || 1);
    return sum + ((s.stats?.lifetimeValue || 0) / months) * 12;
  }, 0));

  return {
    label: `${MONTHS[monthIndex]} ${year}`,
    year,
    month: monthIndex + 1,
    total: scores.length,
    rate: rateOf(scores),
    counts: { high: high.length, medium: medium.length, low: low.length },
    revenueAtRisk,
    high: high.slice(0, 5).map((s) => toCustomerCard(s, 'high', abandonedUserIds)),
    medium: medium.slice(0, 5).map((s) => toCustomerCard(s, 'medium', abandonedUserIds)),
    low: [...low].sort((a, b) => a.churnProbability - b.churnProbability).slice(0, 4).map((s) => toCustomerCard(s, 'low', abandonedUserIds)),
    trend,
    drivers,
    lastScoredAt: scores.reduce((d, s) => (!d || s.scoredAt > d ? s.scoredAt : d), null),
  };
};

/** Mahine mein jin customers ne cart mein daala par checkout nahi kiya */
const abandonedCartUsers = async (from, to) => {
  const logs = await ActivityLog.find({
    eventType: { $in: ['cart_add', 'checkout'] },
    timestamp: { $gte: from, $lt: to },
  }).select('userId eventType timestamp -_id').lean();

  const lastAdd = new Map();
  const lastCheckout = new Map();
  logs.forEach((l) => {
    const map = l.eventType === 'cart_add' ? lastAdd : lastCheckout;
    if (!map.has(l.userId) || l.timestamp > map.get(l.userId)) map.set(l.userId, l.timestamp);
  });

  const ids = new Set();
  lastAdd.forEach((addedAt, userId) => {
    const co = lastCheckout.get(userId);
    if (!co || co < addedAt) ids.add(userId);
  });
  return ids;
};

/** 6 mahine ka trend (is mahine samet) */
const buildTrend = async (year, monthIndex, months = 6) => {
  const points = [];
  for (let k = months - 1; k >= 0; k--) {
    const d = new Date(year, monthIndex - k, 1);
    const [from, to] = monthRange(d.getFullYear(), d.getMonth());
    const scores = await latestPerUser(from, to);
    points.push({ label: MONTHS[d.getMonth()], value: rateOf(scores) });
  }
  return points;
};

/** month: 1-12 */
const getMonthReport = async (year, month) => {
  const monthIndex = month - 1;
  const [from, to] = monthRange(year, monthIndex);
  let scores = await latestPerUser(from, to);

  // Is mahine ka abhi tak koi score nahi -> abhi chala do
  const now = new Date();
  let warning = null;
  if (!scores.length && year === now.getFullYear() && monthIndex === now.getMonth()) {
    try {
      // Sirf scoring: page kholne se customers ko emails / coupons NAHI jate. Woh admin ke "Run" button se jate hain.
      await runScoring({ autoEngage: false });
      scores = await latestPerUser(from, to);
    } catch (error) {
      // Python band ho to page crash na ho — khaali report + warning
      warning = error.message;
    }
  }

  const [trend, abandonedUserIds] = await Promise.all([
    buildTrend(year, monthIndex),
    abandonedCartUsers(from, to),
  ]);

  return { ...buildMonthReport({ year, monthIndex, scores, trend, abandonedUserIds }), warning };
};

/* ------------------------------------------------------------------ */
/* 4) Admin alerts + engagement results                                */
/* ------------------------------------------------------------------ */

/** Har customer ka latest score (risk filter optional) */
const getLatestScores = async ({ risk } = {}) => {
  const scores = await latestPerUser();
  return risk ? scores.filter((s) => s.riskLevel.toLowerCase() === String(risk).toLowerCase()) : scores;
};

/** Flowchart: "Admin Alerts & Overview — View Risks" */
const getAlerts = async () => {
  const high = await getLatestScores({ risk: 'High' });
  const userIds = high.map((s) => s.userId);
  const messages = await EngagementMessage.find({ userId: { $in: userIds } }).sort({ sentAt: -1 }).lean();

  const lastMsg = new Map();
  messages.forEach((m) => { if (!lastMsg.has(m.userId)) lastMsg.set(m.userId, m); });

  return high.map((s) => ({
    ...toCustomerCard(s, 'high'),
    scoredAt: s.scoredAt,
    lastEngagement: lastMsg.get(s.userId) || null,
  }));
};

/** Flowchart: "Monitor Action Results" — message ke baad customer ne order kiya ya nahi */
const getEngagementResults = async ({ limit = 100 } = {}) => {
  const messages = await EngagementMessage.find().sort({ sentAt: -1 }).limit(Number(limit) || 100).lean();
  if (!messages.length) {
    return { summary: { sent: 0, converted: 0, conversionRate: 0, couponsUsed: 0, byType: {} }, messages: [] };
  }

  const userIds = [...new Set(messages.map((m) => m.userId))];
  const oldest = messages.reduce((d, m) => (m.sentAt < d ? m.sentAt : d), messages[0].sentAt);
  const orders = await Order.findAll({
    where: { userId: { [Op.in]: userIds }, createdAt: { [Op.gte]: oldest }, status: { [Op.ne]: 'cancelled' } },
    attributes: ['id', 'userId', 'totalAmount', 'couponCode', 'createdAt'],
    order: [['createdAt', 'ASC']],
  });

  const rows = messages.map((m) => {
    const order = orders.find((o) => o.userId === m.userId && o.createdAt > m.sentAt);
    return {
      ...m,
      id: m._id.toString(),
      _id: undefined,
      converted: Boolean(order),
      convertedOrderId: order ? order.id : null,
      convertedAmount: order ? order.totalAmount : null,
      usedCoupon: Boolean(m.couponCode && orders.some((o) => o.userId === m.userId && o.couponCode === m.couponCode)),
    };
  });

  const byType = {};
  rows.forEach((r) => {
    byType[r.type] = byType[r.type] || { sent: 0, converted: 0 };
    byType[r.type].sent++;
    if (r.converted) byType[r.type].converted++;
  });
  const converted = rows.filter((r) => r.converted).length;
  const couponsUsed = rows.filter((r) => r.usedCoupon).length;

  return {
    summary: {
      sent: rows.length,
      converted,
      conversionRate: +((converted / rows.length) * 100).toFixed(1),
      couponsUsed,
      byType,
    },
    messages: rows,
  };
};

/** Admin ka manual "Send message" button */
const engageCustomer = async (userId) => {
  const user = await User.findByPk(userId, {
    include: [{ model: Order, attributes: ['id', 'totalAmount', 'status', 'createdAt'] }],
  });
  if (!user || user.role !== 'customer') throw new ApiError(404, 'Customer not found');

  const chat = (await chatSignals([user.id])).get(user.id);
  const features = featuresWithChat(user, chat, new Date());
  const prediction = await predictChurn(features);
  const msg = await sendEngagement({ user, features, prediction, trigger: 'manual', force: true, chat });
  if (!msg) throw new ApiError(400, 'Customer is Low risk, no engagement message needed');
  return msg;
};

module.exports = {
  runScoring,
  scoreCustomer,
  getMonthReport,
  buildMonthReport,
  getLatestScores,
  latestPerUser,
  getAlerts,
  getEngagementResults,
  engageCustomer,
  rateOf,
  chatSignals,
};
