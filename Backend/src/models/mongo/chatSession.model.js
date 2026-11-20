const mongoose = require('mongoose');

// Purani chats khud mit jati hain (privacy): .env CHAT_RETENTION_DAYS (default 180 din)
const RETENTION_DAYS = Math.max(1, Number(process.env.CHAT_RETENTION_DAYS) || 180);

// Skin Assistant ki ek chat (website ke chat widget ka ek session)
const chatSessionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true, index: true },
  userId: { type: Number, default: null, index: true }, // login ho to Postgres user id, warna guest
  messageCount: { type: Number, default: 0 },
  usedScan: { type: Boolean, default: false },
  // chatbot ne jo samjha (sirf skincare ki cheezein)
  skinType: { type: String, default: null },
  concerns: { type: [String], default: [] },
  lastMessageAt: { type: Date, default: Date.now, expires: RETENTION_DAYS * 24 * 60 * 60 },
}, {
  timestamps: true,
  versionKey: false,
});

module.exports = mongoose.model('ChatSession', chatSessionSchema);
