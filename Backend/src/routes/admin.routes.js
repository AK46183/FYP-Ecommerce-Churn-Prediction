const express = require('express');
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('../middlewares/auth.middleware');
const churnRoutes = require('./churn.routes');
const {
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
  getContactMessages,
  setContactStatus,
  getSubscribers,
  emailStatus,
  testEmail,
  getCoupons,
  createCoupon,
  updateCoupon,
  getAbandonedCarts,
  remindCarts,
  getNotifications,
  getUnreadCount,
  markNotification,
  markAllNotifications,
  getEmailLog,
} = require('../controllers/admin.controller');

// Neeche ke saare routes sirf logged-in admin ke liye
router.use(authMiddleware, adminMiddleware);

router.get('/dashboard', dashboardOverview); // ?range=7d|30d|90d

router.get('/orders', getAllOrders);
router.patch('/orders/:id/status', updateOrderStatus);

router.get('/customers', getCustomers);
router.patch('/customers/:id/complaint', setComplaint); // body: { hasComplaint: true|false }

router.use('/churn', churnRoutes);

router.get('/sales', getAllEvents);
router.get('/sales/upcoming', getUpcomingEvents);
router.post('/sales', addEvent);
router.delete('/sales/:id', deleteEvent);

router.get('/strategies', getStrategies); // ?season=summer
router.post('/strategies', addStrategy);
router.delete('/strategies/:id', deleteStrategy);

router.get('/messages', getContactMessages); // Contact Us form
router.patch('/messages/:id', setContactStatus); // { status: new|read|replied }
router.get('/subscribers', getSubscribers); // Newsletter

router.get('/notifications', getNotifications); // ?type=order&unread=1
router.get('/notifications/count', getUnreadCount);
router.post('/notifications/read-all', markAllNotifications);
router.patch('/notifications/:id', markNotification); // { read: true|false }
router.get('/emails', getEmailLog); // sent emails log ?type=

router.get('/coupons', getCoupons); // ?all=1 -> personal (engagement) codes bhi
router.post('/coupons', createCoupon);
router.patch('/coupons/:id', updateCoupon);

router.get('/carts/abandoned', getAbandonedCarts);
router.post('/carts/remind', remindCarts);

router.get('/email/status', emailStatus);
router.post('/email/test', testEmail); // { to? }

module.exports = router;
