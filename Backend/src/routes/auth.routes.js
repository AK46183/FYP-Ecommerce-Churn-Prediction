const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/auth.middleware');
const {
  register, login, me, updateMe, changePassword, forgotPassword, resetPassword, google,
} = require('../controllers/auth.controller');

router.post('/register', register);
router.post('/login', login);
router.post('/google', google);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

router.get('/me', authMiddleware, me);
router.patch('/me', authMiddleware, updateMe);
router.post('/change-password', authMiddleware, changePassword);

module.exports = router;
