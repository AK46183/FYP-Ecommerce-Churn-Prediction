// /api/payments  (webhook app.js mein alag, raw body ke saath)
const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/auth.middleware');
const { rateLimit } = require('../middlewares/security.middleware');
const { status, createSession, confirm } = require('../controllers/payment.controller');

// ek IP: 10 minute mein 20 payment page / confirm
const payLimit = rateLimit({ name: 'payments', windowMs: 10 * 60_000, max: 20, message: 'Too many payment attempts. Please wait a few minutes.' });

router.get('/status', status);
router.post('/stripe/session', payLimit, authMiddleware, createSession);
router.post('/stripe/confirm', payLimit, authMiddleware, confirm);

module.exports = router;
