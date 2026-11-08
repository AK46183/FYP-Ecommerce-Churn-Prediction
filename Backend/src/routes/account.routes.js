// /api/account — logged-in customer ki cheezein
const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/auth.middleware');
const c = require('../controllers/account.controller');

router.use(authMiddleware);

router.get('/wishlist', c.getWishlist);
router.post('/wishlist', c.addToWishlist); // { sku }
router.post('/wishlist/merge', c.mergeWishlist); // { skus: [] }
router.delete('/wishlist/:sku', c.removeFromWishlist);

router.get('/addresses', c.getAddresses);
router.post('/addresses', c.addAddress);
router.patch('/addresses/:id', c.updateAddress);
router.delete('/addresses/:id', c.deleteAddress);

router.post('/activity', c.trackActivity); // { eventType, sku, quantity }

module.exports = router;
