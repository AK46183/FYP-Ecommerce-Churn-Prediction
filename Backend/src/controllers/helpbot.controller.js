// POST /api/helpbot/message  -> rule-based Help Bot (FAQ, order status, complaint)
// Churn se connection:
//   - login customer ka har sawal activity log mein jata hai (chat_query / chat_unanswered / chat_complaint)
//   - complaint ContactMessage mein save hoti hai; churn scoring pichle 30 din ki complaint ko model ke "complain" feature mein daalti hai
//   - Medium / High risk customer ko greeting mein us ka personal offer (engagement coupon) dikhta hai
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const { createHelpbot, MAX_MESSAGE, INTENT_NAMES } = require('../services/helpbot.service');
const { getUserOrders, getUserOrderById } = require('../services/order.service');
const { notifyAdmin } = require('../services/notification.service');
const { logActivity } = require('../services/activityLogger.service');
const { describe: describeCoupon } = require('../services/coupon.service');
const ContactMessage = require('../models/mongo/contactMessage.model');
const ChurnScore = require('../models/mongo/churnScore.model');
const EngagementMessage = require('../models/mongo/engagementMessage.model');
const Coupon = require('../models/postgres/coupon.model');
const User = require('../models/postgres/user.model');

// Ek IP se 1 ghante mein zyada se zyada 5 complaints (spam)
const COMPLAINTS_PER_HOUR = 5;
const complaintHits = new Map(); // ip -> [timestamps]
const allowComplaint = (ip) => {
  const now = Date.now();
  const recent = (complaintHits.get(ip) || []).filter((t) => now - t < 60 * 60 * 1000);
  if (recent.length >= COMPLAINTS_PER_HOUR) {
    complaintHits.set(ip, recent);
    return false;
  }
  recent.push(now);
  complaintHits.set(ip, recent);
  if (complaintHits.size > 20000) complaintHits.delete(complaintHits.keys().next().value);
  return true;
};

/**
 * Medium / High risk customer ka abhi tak istemal na hua personal coupon (churn engagement ne banaya tha).
 * Na ho to null. Naya coupon yahan KABHI nahi banta (sirf pehle se bheja hua dikhate hain).
 */
const getOffer = async (userId) => {
  const score = await ChurnScore.findOne({ userId }).sort({ scoredAt: -1 }).select('riskLevel').lean();
  if (!score || score.riskLevel === 'Low') return null;

  const msg = await EngagementMessage.findOne({ userId, couponCode: { $ne: null }, status: 'sent' })
    .sort({ sentAt: -1 }).select('couponCode').lean();
  if (!msg) return null;

  const coupon = await Coupon.findOne({ where: { code: msg.couponCode, userId, active: true } });
  if (!coupon) return null;
  if (coupon.expiresAt && coupon.expiresAt < new Date()) return null;
  if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) return null;
  return { code: coupon.code, description: coupon.description || describeCoupon(coupon), expiresAt: coupon.expiresAt };
};

const bot = createHelpbot({
  getUserOrders,
  getUserOrderById,
  getUser: (id) => User.findByPk(id, { attributes: ['id', 'name', 'email'] }),
  saveComplaint: async ({ name, email, message, orderRef, userId }) => {
    const doc = await ContactMessage.create({
      name: String(name).slice(0, 100),
      email,
      message,
      topic: 'complaint',
      orderRef,
      userId,
      source: 'helpbot',
    });
    return { id: doc._id.toString() };
  },
  notifyAdmin,
  allowComplaint,
  getOffer: (userId) => getOffer(userId).catch(() => null), // offer na mil sake to chat phir bhi chale
});

// Log mein card / CNIC / phone jaise number na jayein
const maskNumbers = (t) => String(t || '').replace(/\d[\d\s-]{5,}\d/g, '[number]').slice(0, 120);

/** Churn ke liye: login customer ki chat activity log mein (guest ka kuch nahi) */
const logChat = (userId, message, out) => {
  if (!userId) return;
  if (out.ticket) logActivity(userId, 'chat_complaint', null, { ticket: out.ticket });
  else if (out.intent === 'fallback') logActivity(userId, 'chat_unanswered', null, { text: maskNumbers(message) });
  else logActivity(userId, 'chat_query', null, { intent: out.intent });
  if (out.offer) logActivity(userId, 'chat_offer_shown', null, { code: out.offer.code });
};

// Client ka bheja hua state: sirf chhota plain object qubool
const readState = (raw) => {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const pick = (k, max = MAX_MESSAGE) => (typeof raw[k] === 'string' ? raw[k].slice(0, max) : undefined);
  return {
    flow: pick('flow', 20),
    step: pick('step', 20),
    orderRef: pick('orderRef', 20),
    firstMessage: pick('firstMessage'),
    details: pick('details'),
  };
};

const sendMessage = async (req, res, next) => {
  try {
    const message = typeof req.body?.message === 'string' ? req.body.message.trim() : '';
    const intent = typeof req.body?.intent === 'string' ? req.body.intent : null;
    if (!message && !intent) throw new ApiError(400, 'Message is required');
    if (message.length > MAX_MESSAGE) throw new ApiError(400, `Message must be under ${MAX_MESSAGE} characters`);
    if (intent && !INTENT_NAMES.has(intent)) throw new ApiError(400, 'Unknown intent');

    const userId = req.user?.id || null;
    const out = await bot.reply({
      message,
      intent,
      state: readState(req.body?.state),
      userId,
      ip: req.ip,
    });
    logChat(userId, message, out);

    res.status(200).json(new ApiResponse(200, {
      intent: out.intent,
      reply: out.reply,
      quickReplies: out.quickReplies || [],
      links: out.links || [],
      orders: out.orders || [],
      ticket: out.ticket || null,
      offer: out.offer || null,
      state: out.state || null,
    }));
  } catch (error) {
    next(error);
  }
};

module.exports = { sendMessage, getOffer };
