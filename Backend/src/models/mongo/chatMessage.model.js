const mongoose = require('mongoose');

// Purani chats khud mit jati hain (privacy): .env CHAT_RETENTION_DAYS (default 180 din)
const RETENTION_DAYS = Math.max(1, Number(process.env.CHAT_RETENTION_DAYS) || 180);

// Chat ka ek message. Tasveer KABHI save nahi hoti, sirf yeh ke tasveer bheji gayi thi aur scan ka natija.
const chatMessageSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, index: true },
  userId: { type: Number, default: null },
  role: { type: String, enum: ['user', 'bot'], required: true },
  text: { type: String, default: '' },
  hadImage: { type: Boolean, default: false },
  scan: { type: mongoose.Schema.Types.Mixed, default: null }, // { oiliness, acne, dark_spots, ... } ya null
  productSkus: { type: [String], default: [] }, // bot ne is jawab mein jin products ka naam liya
  sources: { type: [{ title: String, source: String, sha256: String, _id: false }], default: [] }, // jawab kin knowledge files se bana
}, {
  timestamps: { createdAt: true, updatedAt: false },
  versionKey: false,
});

chatMessageSchema.index({ sessionId: 1, createdAt: 1 });
chatMessageSchema.index({ createdAt: 1 }, { expireAfterSeconds: RETENTION_DAYS * 24 * 60 * 60 });

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
