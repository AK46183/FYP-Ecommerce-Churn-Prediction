const orderService = require('../services/order.service');
const adminService = require('../services/admin.service');
const supportService = require('../services/support.service');
const couponService = require('../services/coupon.service');
const notificationService = require('../services/notification.service');
const cartReminder = require('../services/cartReminder.service');
const { sendMail, layout, mailStatus, isConfigured } = require('../services/mail.service');
const { orderStatusValidation } = require('../validators/order.validator');
const ApiResponse = require('../utils/ApiResponse');

// wrapper: har handler ka try/catch ek jagah
const handle = (fn, status = 200, message) => async (req, res, next) => {
  try {
    const data = await fn(req);
    res.status(status).json(new ApiResponse(status, data, message));
  } catch (error) {
    next(error);
  }
};

/* Dashboard */
const dashboardOverview = handle((req) => adminService.getDashboard(req.query.range));

/* Orders */
const getAllOrders = handle(() => orderService.getAllOrders());

const updateOrderStatus = async (req, res, next) => {
  try {
    const errors = orderStatusValidation(req.body);
    if (errors.length) return res.status(400).json({ success: false, errors });
    const order = await orderService.updateOrderStatus(req.params.id, req.body.status);
    res.status(200).json(new ApiResponse(200, order, 'Order status updated'));
  } catch (error) {
    next(error);
  }
};

/* Customers */
const getCustomers = handle(() => adminService.getCustomers());
const setComplaint = handle(
  (req) => adminService.setComplaint(Number(req.params.id), req.body?.hasComplaint !== false),
  200,
  'Complaint flag updated'
);

/* Sales / events */
const getUpcomingEvents = handle(() => adminService.getUpcomingEvents());
const getAllEvents = handle(() => adminService.getAllEvents());
const addEvent = handle((req) => adminService.addEvent(req.body || {}), 201, 'Event added');
const deleteEvent = handle((req) => adminService.deleteEvent(req.params.id), 200, 'Event deleted');

/* Marketing strategies */
const getStrategies = handle((req) => adminService.getStrategies(req.query.season));
const addStrategy = handle((req) => adminService.addStrategy(req.body || {}), 201, 'Strategy saved');
const deleteStrategy = handle((req) => adminService.deleteStrategy(req.params.id), 200, 'Strategy deleted');

/* Contact messages + newsletter */
const getContactMessages = handle(() => supportService.getContactMessages());
const setContactStatus = handle((req) => supportService.setContactStatus(req.params.id, req.body?.status), 200, 'Updated');
const getSubscribers = handle(() => supportService.getSubscribers());

/* Email test: POST /api/admin/email/test { to } */
const emailStatus = handle(() => ({ configured: isConfigured(), status: mailStatus() }));
const testEmail = handle(async (req) => {
  const to = req.body?.to || process.env.ADMIN_EMAIL || process.env.SMTP_USER;
  const result = await sendMail({
    to,
    type: 'test',
    subject: 'MINAYSH test email ✦',
    text: 'If you can read this, email sending works.',
    html: layout('Email is working!', '<p>If you can read this, your MINAYSH backend can send emails.</p>'),
  });
  return { to, ...result };
});

/* Coupons (Promotions page) */
const getCoupons = handle((req) => couponService.listCoupons({ includePersonal: req.query.all === '1' }));
const createCoupon = handle((req) => couponService.createCoupon(req.body || {}), 201, 'Coupon created');
const updateCoupon = handle((req) => couponService.updateCoupon(Number(req.params.id), req.body || {}), 200, 'Coupon updated');

/* Abandoned carts */
const getAbandonedCarts = handle(() => cartReminder.listAbandoned());
const remindCarts = handle(() => cartReminder.sendCartReminders(), 200, 'Reminders processed');

/* Admin Inbox + sent emails */
const getNotifications = handle((req) => notificationService.listNotifications(req.query));
const getUnreadCount = handle(() => notificationService.countUnread());
const markNotification = handle((req) => notificationService.markRead(req.params.id, req.body?.read !== false));
const markAllNotifications = handle(() => notificationService.markAllRead());
const getEmailLog = handle((req) => notificationService.listEmailLog(req.query));

module.exports = {
  getNotifications,
  getUnreadCount,
  markNotification,
  markAllNotifications,
  getEmailLog,
  getCoupons,
  createCoupon,
  updateCoupon,
  getAbandonedCarts,
  remindCarts,
  getContactMessages,
  setContactStatus,
  getSubscribers,
  emailStatus,
  testEmail,
  dashboardOverview,
  getAllOrders,
  updateOrderStatus,
  getCustomers,
  setComplaint,
  getUpcomingEvents,
  getAllEvents,
  addEvent,
  deleteEvent,
  getStrategies,
  addStrategy,
  deleteStrategy,
};
