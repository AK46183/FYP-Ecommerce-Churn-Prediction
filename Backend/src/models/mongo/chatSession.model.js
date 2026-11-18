const mongoose = require('mongoose');

// Skin Assistant ki ek chat (website ke chat widget ka ek session)
const chatSessionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true, index: true },
  userId: { type: Number, default: null, index: true }, // login ho to Postgres user id, warna guest
  messageCount: { type: Number, default: 0 },
  usedScan: { type: Boolean, default: false },
  // chatbot ne jo samjha (sirf skincare ki cheezein)
  skinType: { type: String, default: null },
  concerns: { type: [String], default: [] },
  lastMessageAt: { type: Date, default: Date.now },
}, {
  timestamps: true,
  versionKey: false,
});

module.exports = mongoose.model('ChatSession', chatSessionSchema);
