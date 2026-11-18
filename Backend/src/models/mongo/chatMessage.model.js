const mongoose = require('mongoose');

// Chat ka ek message. Tasveer KABHI save nahi hoti, sirf yeh ke tasveer bheji gayi thi aur scan ka natija.
const chatMessageSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, index: true },
  userId: { type: Number, default: null },
  role: { type: String, enum: ['user', 'bot'], required: true },
  text: { type: String, default: '' },
  hadImage: { type: Boolean, default: false },
  scan: { type: mongoose.Schema.Types.Mixed, default: null }, // { oiliness, acne, dark_spots, ... } ya null
  productSkus: { type: [String], default: [] }, // bot ne is jawab mein jin products ka naam liya
}, {
  timestamps: { createdAt: true, updatedAt: false },
  versionKey: false,
});

chatMessageSchema.index({ sessionId: 1, createdAt: 1 });

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
