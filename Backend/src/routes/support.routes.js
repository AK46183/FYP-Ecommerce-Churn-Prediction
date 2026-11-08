// Public: /api/contact, /api/newsletter
const express = require('express');
const router = express.Router();
const { optionalAuth } = require('../middlewares/auth.middleware');
const support = require('../services/support.service');
const ApiResponse = require('../utils/ApiResponse');

router.post('/contact', optionalAuth, async (req, res, next) => {
  try {
    const data = await support.submitContact(req.body || {}, req.user?.id || null);
    res.status(201).json(new ApiResponse(201, data, 'Message received'));
  } catch (error) {
    next(error);
  }
});

router.post('/newsletter', async (req, res, next) => {
  try {
    const data = await support.subscribe(req.body || {});
    res.status(201).json(new ApiResponse(201, data, data.alreadySubscribed ? 'Already subscribed' : 'Subscribed'));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
