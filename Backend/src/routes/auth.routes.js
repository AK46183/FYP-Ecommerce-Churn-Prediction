const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/auth.middleware');
const { limits } = require('../middlewares/security.middleware');
const {
  register, login, me, updateMe, changePassword, forgotPassword, resetPassword, google,
} = require('../controllers/auth.controller');

router.post('/register', limits.auth, register);
router.post('/login', limits.auth, login);
router.post('/google', limits.auth, google);
router.post('/forgot-password', limits.reset, forgotPassword);
router.post('/reset-password', limits.reset, resetPassword);

router.get('/me', authMiddleware, me);
router.patch('/me', authMiddleware, updateMe);
router.post('/change-password', authMiddleware, limits.auth, changePassword);

module.exports = router;
