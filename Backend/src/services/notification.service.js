// Admin Inbox: har zaroori waqia yahan save hota hai + admin ki email pe bhi jata hai
const AdminNotification = require('../models/mongo/adminNotification.model');
const EmailLog = require('../models/mongo/emailLog.model');
const { sendAdminAlert } = require('./mail.service');
const ApiError = require('../utils/ApiError');

// Inke liye admin ko email bhi jati hai (.env ADMIN_EMAIL_ALERTS se badal sakte hain)
const DEFAULT_EMAIL_TYPES = ['order', 'delivered', 'cancelled', 'customer', 'complaint', 'message', 'low_stock'];

const emailTypes = () =>
  process.env.ADMIN_EMAIL_ALERTS
    ? process.env.ADMIN_EMAIL_ALERTS.split(',').map((t) => t.trim()).filter(Boolean)
    : DEFAULT_EMAIL_TYPES;

/**
 * Kabhi throw nahi karta — notification fail ho to bhi order / signup chalta rahe.
 */
const notifyAdmin = async ({ type, title, body = '', link = null, meta = {} }) => {
  try {
    const doc = await AdminNotification.create({ type, title, body, link, meta });
    if (emailTypes().includes(type)) {
      const r = await sendAdminAlert({ title, body, link });
      if (r.sent) await AdminNotification.updateOne({ _id: doc._id }, { emailed: true });
    }
    return doc;
  } catch (error) {
    console.error('[notify] failed:', error.message);
    return null;
  }
};

/* ------------------------------ Admin API ------------------------------ */

const listNotifications = async ({ type, unread, limit = 100 } = {}) => {
  const where = {};
  if (type) where.type = type;
  if (unread === '1' || unread === true) where.read = false;
  return AdminNotification.find(where).sort({ createdAt: -1 }).limit(Math.min(Number(limit) || 100, 300));
};

const countUnread = async () => {
  const rows = await AdminNotification.aggregate([
    { $match: { read: false } },
    { $group: { _id: '$type', count: { $sum: 1 } } },
  ]);
  const byType = Object.fromEntries(rows.map((r) => [r._id, r.count]));
  return { total: rows.reduce((s, r) => s + r.count, 0), byType };
};

const markRead = async (id, read = true) => {
  const n = await AdminNotification.findByIdAndUpdate(id, { read }, { new: true });
  if (!n) throw new ApiError(404, 'Notification not found');
  return n;
};

const markAllRead = async () => {
  const r = await AdminNotification.updateMany({ read: false }, { read: true });
  return { updated: r.modifiedCount };
};

const listEmailLog = async ({ type, limit = 150 } = {}) => {
  const where = type ? { type } : {};
  const [emails, stats] = await Promise.all([
    EmailLog.find(where).sort({ sentAt: -1 }).limit(Math.min(Number(limit) || 150, 500)),
    EmailLog.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
  ]);
  return { emails, stats: Object.fromEntries(stats.map((s) => [s._id, s.count])) };
};

module.exports = { notifyAdmin, listNotifications, countUnread, markRead, markAllRead, listEmailLog };
