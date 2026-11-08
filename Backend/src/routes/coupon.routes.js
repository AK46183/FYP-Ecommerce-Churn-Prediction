// Public: POST /api/coupons/validate  { code, subtotal, shipping }
const express = require('express');
const router = express.Router();
const { optionalAuth } = require('../middlewares/auth.middleware');
const couponService = require('../services/coupon.service');
const ApiResponse = require('../utils/ApiResponse');

router.post('/validate', optionalAuth, async (req, res, next) => {
  try {
    const { code, subtotal, shipping } = req.body || {};
    const r = await couponService.evaluate(code, {
      userId: req.user?.id || null,
      subtotal: Number(subtotal) || 0,
      shippingFee: Number(shipping) || 0,
    });
    res.status(200).json(new ApiResponse(200, {
      code: r.code, type: r.type, value: r.coupon.value, minOrder: r.coupon.minOrder, discount: r.discount, description: r.description,
    }, 'Code applied'));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
