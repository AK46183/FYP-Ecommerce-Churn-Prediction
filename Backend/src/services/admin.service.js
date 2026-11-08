// Admin dashboard ke numbers — shape frontend ke adminApi.js (mockDashboard) jaisi
const { Op } = require('sequelize');
const User = require('../models/postgres/user.model');
const Order = require('../models/postgres/order.model');
const OrderItem = require('../models/postgres/orderItem.model');
const Product = require('../models/postgres/product.model');
const SaleEvent = require('../models/mongo/saleEvent.model');
const Strategy = require('../models/mongo/strategy.model');
const { latestPerUser, rateOf } = require('./churn.service');
const ApiError = require('../utils/ApiError');

const DAY_MS = 24 * 60 * 60 * 1000;
const RANGES = { '7d': 7, '30d': 30, '90d': 90 };
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const sum = (orders) => orders.reduce((s, o) => s + Number(o.totalAmount || 0), 0);
const change = (now, before) => (before ? +(((now - before) / before) * 100).toFixed(1) : now ? 100 : 0);
const capital = (s = '') => s.charAt(0).toUpperCase() + s.slice(1);

/* ------------------------------ Dashboard ------------------------------ */

const revenueBars = (orders, from, days) => {
  // Hamesha 7 bars: 7d = har din, 30d/90d = 7 barabar hisse
  const bucketMs = (days * DAY_MS) / 7;
  const bars = Array.from({ length: 7 }, (_, i) => {
    const start = new Date(from.getTime() + i * bucketMs);
    return {
      label: days === 7 ? WEEKDAYS[start.getDay()] : `${start.getDate()} ${MONTHS[start.getMonth()]}`,
      value: 0,
    };
  });
  orders.forEach((o) => {
    const idx = Math.min(6, Math.floor((new Date(o.createdAt) - from) / bucketMs));
    if (idx >= 0) bars[idx].value += Number(o.totalAmount || 0);
  });
  bars.forEach((b) => { b.value = Math.round(b.value); });
  return bars;
};

const topProducts = async (from, to) => {
  const items = await OrderItem.findAll({
    include: [
      { model: Order, attributes: [], where: { createdAt: { [Op.gte]: from, [Op.lt]: to }, status: { [Op.ne]: 'cancelled' } } },
      { model: Product, attributes: ['name'] },
    ],
    attributes: ['productId', 'quantity', 'price'],
  });

  const map = new Map();
  items.forEach((it) => {
    const key = it.productId;
    const row = map.get(key) || { name: it.Product?.name || `Product #${key}`, sold: 0, revenue: 0 };
    row.sold += it.quantity;
    row.revenue += it.quantity * it.price;
    map.set(key, row);
  });

  const list = [...map.values()]
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 4)
    .map((p) => ({ ...p, revenue: Math.round(p.revenue) }));

  // Frontend topProducts[0].name parhta hai — khaali array pe page crash na ho
  return list.length ? list : [{ name: 'No sales yet', sold: 0, revenue: 0 }];
};

const churnTrend = async (months = 9) => {
  const now = new Date();
  const points = [];
  for (let k = months - 1; k >= 0; k--) {
    const from = new Date(now.getFullYear(), now.getMonth() - k, 1);
    const to = new Date(now.getFullYear(), now.getMonth() - k + 1, 1);
    points.push(rateOf(await latestPerUser(from, to)));
  }
  return points;
};

const getDashboard = async (range = '30d') => {
  const days = RANGES[range] || 30;
  const to = new Date();
  const from = new Date(to.getTime() - days * DAY_MS);
  const prevFrom = new Date(from.getTime() - days * DAY_MS);

  const [orders, prevOrders, totalCustomers, newCustomers, prevNewCustomers, scores, trend, top, recent] =
    await Promise.all([
      Order.findAll({ where: { createdAt: { [Op.gte]: from, [Op.lt]: to } } }),
      Order.findAll({ where: { createdAt: { [Op.gte]: prevFrom, [Op.lt]: from } } }),
      User.count({ where: { role: 'customer' } }),
      User.count({ where: { role: 'customer', createdAt: { [Op.gte]: from } } }),
      User.count({ where: { role: 'customer', createdAt: { [Op.gte]: prevFrom, [Op.lt]: from } } }),
      latestPerUser(),
      churnTrend(),
      topProducts(from, to),
      Order.findAll({
        include: [{ model: User, attributes: ['name'] }, { model: OrderItem, attributes: ['quantity'] }],
        order: [['createdAt', 'DESC']],
        limit: 5,
      }),
    ]);

  const valid = orders.filter((o) => o.status !== 'cancelled');
  const prevValid = prevOrders.filter((o) => o.status !== 'cancelled');
  const revenue = sum(valid);
  const delivered = valid.filter((o) => o.status === 'delivered').length;

  return {
    range,
    revenue: {
      total: Math.round(revenue),
      change: change(revenue, sum(prevValid)),
      bars: revenueBars(valid, from, days),
    },
    orders: {
      total: orders.length,
      change: change(orders.length, prevOrders.length),
      fulfilled: valid.length ? Math.round((delivered / valid.length) * 100) : 0,
    },
    customers: {
      total: totalCustomers,
      newThisPeriod: newCustomers,
      change: change(newCustomers, prevNewCustomers),
    },
    churn: {
      highRisk: scores.filter((s) => s.riskLevel === 'High').length,
      mediumRisk: scores.filter((s) => s.riskLevel === 'Medium').length,
      lowRisk: scores.filter((s) => s.riskLevel === 'Low').length,
      rate: rateOf(scores),
      trend,
    },
    avgOrderValue: {
      value: valid.length ? Math.round(revenue / valid.length) : 0,
      target: Number(process.env.AOV_TARGET) || 7000,
    },
    topProducts: top,
    recentOrders: recent.map((o) => ({
      id: `MN-${o.id}`,
      orderId: o.id,
      customer: o.User?.name || 'Guest',
      items: (o.OrderItems || []).reduce((s, i) => s + i.quantity, 0),
      total: Math.round(o.totalAmount),
      status: capital(o.status),
      date: o.createdAt,
    })),
  };
};

/* ------------------------------ Customers ------------------------------ */

const getCustomers = async () => {
  const [users, scores] = await Promise.all([
    User.findAll({
      where: { role: 'customer' },
      attributes: ['id', 'name', 'email', 'city', 'phone', 'hasComplaint', 'createdAt'],
      include: [{ model: Order, attributes: ['totalAmount', 'status', 'createdAt'] }],
      order: [['createdAt', 'DESC']],
    }),
    latestPerUser(),
  ]);
  const scoreMap = new Map(scores.map((s) => [s.userId, s]));

  return users.map((u) => {
    const valid = u.Orders.filter((o) => o.status !== 'cancelled');
    const last = valid.reduce((d, o) => (!d || o.createdAt > d ? o.createdAt : d), null);
    const s = scoreMap.get(u.id);
    return {
      id: u.id,
      name: u.name,
      email: u.email,
      city: u.city,
      phone: u.phone,
      hasComplaint: u.hasComplaint,
      joinedAt: u.createdAt,
      orders: valid.length,
      totalSpent: Math.round(sum(valid)),
      lastOrderAt: last,
      churn: s ? { probability: s.churnProbability, riskLevel: s.riskLevel, scoredAt: s.scoredAt } : null,
    };
  });
};

const setComplaint = async (userId, hasComplaint) => {
  const user = await User.findByPk(userId);
  if (!user || user.role !== 'customer') throw new ApiError(404, 'Customer not found');
  user.hasComplaint = Boolean(hasComplaint);
  await user.save();
  return { id: user.id, name: user.name, hasComplaint: user.hasComplaint };
};

/* ---------------------------- Sales / Events --------------------------- */

const getUpcomingEvents = async () => {
  const now = new Date();
  const from = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
  const to = `${now.getFullYear()}-12-31`;
  const events = await SaleEvent.find({ start: { $lte: to } }).sort({ start: 1 });
  return events.filter((e) => (e.end || e.start) >= from);
};

const getAllEvents = () => SaleEvent.find().sort({ start: 1 });

const addEvent = async (data) => {
  if (!data.name || !data.start) throw new ApiError(400, 'Event name and start date are required');
  return SaleEvent.create(data);
};

const deleteEvent = async (id) => {
  const ev = await SaleEvent.findByIdAndDelete(id);
  if (!ev) throw new ApiError(404, 'Event not found');
  return true;
};

/* ------------------------------ Strategies ----------------------------- */

const getStrategies = (season) => Strategy.find(season ? { season } : {}).sort({ createdAt: -1 });

const addStrategy = async (data) => {
  if (!data.season || !data.title) throw new ApiError(400, 'Season and title are required');
  return Strategy.create(data);
};

const deleteStrategy = async (id) => {
  const s = await Strategy.findByIdAndDelete(id);
  if (!s) throw new ApiError(404, 'Strategy not found');
  return true;
};

module.exports = {
  getDashboard,
  getCustomers,
  setComplaint,
  getUpcomingEvents,
  getAllEvents,
  addEvent,
  deleteEvent,
  getStrategies,
  addStrategy,
  deleteStrategy,
  revenueBars, // test ke liye
};
