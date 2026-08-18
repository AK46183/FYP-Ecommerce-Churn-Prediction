const express = require('express');
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('../middlewares/auth.middleware');
const {
  getAllOrders, updateOrderStatus, dashboardOverview,
} = require('../controllers/admin.controller');

router.use(authMiddleware, adminMiddleware);

router.get('/dashboard', dashboardOverview);
router.get('/orders', getAllOrders);
router.patch('/orders/:id/status', updateOrderStatus);

module.exports = router;