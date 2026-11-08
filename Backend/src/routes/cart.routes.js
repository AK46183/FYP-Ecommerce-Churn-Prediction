const express = require('express');
const router = express.Router();
const { authMiddleware, optionalAuth } = require('../middlewares/auth.middleware');
const { addItem, viewCart, deleteItem } = require('../controllers/cart.controller');
const cartService = require('../services/cart.service');
const ApiResponse = require('../utils/ApiResponse');

const handle = (fn) => async (req, res, next) => {
  try {
    res.status(200).json(new ApiResponse(200, await fn(req)));
  } catch (error) {
    next(error);
  }
};

// Guest bhi: cart ke items ki live check (stock / price)  body: { items: [{ sku, shade, size, quantity }] }
router.post('/check', optionalAuth, handle((req) => cartService.checkItems(req.body?.items || [])));

router.use(authMiddleware);

// Website cart (account mein save)
router.get('/items', handle((req) => cartService.getCartItems(req.user.id)));
router.put('/items', handle((req) => cartService.replaceCart(req.user.id, req.body?.items || [])));

// Purana backend cart (Postman)
router.post('/', addItem);
router.get('/', viewCart);
router.delete('/:itemId', deleteItem);

module.exports = router;
