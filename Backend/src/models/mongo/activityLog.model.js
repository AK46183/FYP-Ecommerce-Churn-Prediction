const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  userId: { type: Number, required: true },
  eventType: {
    type: String,
    enum: ['product_view', 'cart_add', 'cart_remove', 'checkout', 'login'],
    required: true,
  },
  productId: { type: Number },
  metadata: { type: Object },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ActivityLog', activityLogSchema);