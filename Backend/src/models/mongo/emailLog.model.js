const mongoose = require('mongoose');

// Har outgoing email ka record (admin "Sent emails" tab)
const emailLogSchema = new mongoose.Schema({
  to: { type: String, required: true },
  subject: { type: String, required: true },
  type: { type: String, default: 'general' }, // welcome, order, status, reset, contact, newsletter, engagement, cart, restock, price_drop, admin, test
  status: { type: String, enum: ['sent', 'not_configured', 'failed'], required: true },
  error: String,
  sentAt: { type: Date, default: Date.now, index: true },
}, {
  versionKey: false,
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id.toString();
      delete ret._id;
      return ret;
    },
  },
});

module.exports = mongoose.model('EmailLog', emailLogSchema);
