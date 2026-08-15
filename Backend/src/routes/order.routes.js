const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const { checkout, myOrders } = require('../controllers/order.controller');

router.use(authMiddleware);
router.post('/checkout', checkout);
router.get('/', myOrders);

module.exports = router;