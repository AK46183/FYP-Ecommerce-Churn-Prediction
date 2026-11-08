const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/auth.middleware');
const { checkout, createOrder, myOrders, myOrder } = require('../controllers/order.controller');

router.use(authMiddleware);
router.post('/', createOrder); // website checkout
router.post('/checkout', checkout); // purana backend-cart checkout
router.get('/', myOrders);
router.get('/:id', myOrder); // id = 12 ya MN-12

module.exports = router;
