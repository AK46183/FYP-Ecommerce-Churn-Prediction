const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  userId: { type: Number, required: true },
  eventType: {
    type: String,
    enum: [
      'product_view', 'cart_add', 'cart_remove', 'checkout', 'login', 'cart_reminder',
      // Help Bot (churn ko chat ka data): sawal, jawab na mila, complaint, offer dikhaya
      'chat_query', 'chat_unanswered', 'chat_complaint', 'chat_offer_shown',
    ],
    required: true,
  },
  productId: { type: Number },
  metadata: { type: Object },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ActivityLog', activityLogSchema);