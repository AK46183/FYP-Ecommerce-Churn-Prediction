const express = require('express');
const router = express.Router();
const { authMiddleware, adminMiddleware, optionalAuth } = require('../middlewares/auth.middleware');
const { sendMessage, resetChat, listSessions, getSession, serviceStatus, deleteSession } = require('../controllers/chatbot.controller');

// guest bhi chat kar sakta hai; login ho to session user se jur jata hai
router.post('/message', optionalAuth, sendMessage);
router.post('/reset', optionalAuth, resetChat);

// admin: save hui chats
router.get('/admin/status', authMiddleware, adminMiddleware, serviceStatus);
router.get('/admin/sessions', authMiddleware, adminMiddleware, listSessions);
router.get('/admin/sessions/:sessionId', authMiddleware, adminMiddleware, getSession);
router.delete('/admin/sessions/:sessionId', authMiddleware, adminMiddleware, deleteSession);

module.exports = router;
