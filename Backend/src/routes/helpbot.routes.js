// /api/helpbot — rule-based Help Bot (guest bhi; login ho to order status bhi)
const express = require('express');
const router = express.Router();
const { optionalAuth } = require('../middlewares/auth.middleware');
const { rateLimit } = require('../middlewares/security.middleware');
const { sendMessage } = require('../controllers/helpbot.controller');

// har IP: 1 minute mein 30 messages
const perMinute = rateLimit({ name: 'helpbot', windowMs: 60_000, max: 30, message: 'You are sending messages too fast. Please wait a moment.' });

router.post('/message', perMinute, optionalAuth, sendMessage);

module.exports = router;
