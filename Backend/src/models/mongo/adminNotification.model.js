const mongoose = require('mongoose');

// Admin Inbox: naya order, delivery, naya customer, complaint, low stock ...
const adminNotificationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['order', 'delivered', 'cancelled', 'customer', 'complaint', 'message', 'subscriber', 'low_stock'],
    required: true,
    index: true,
  },
  title: { type: String, required: true },
  body: { type: String, default: '' },
  link: { type: String, default: null }, // admin page jahan detail hai
  meta: { type: Object, default: {} },
  read: { type: Boolean, default: false, index: true },
  emailed: { type: Boolean, default: false },
}, {
  timestamps: true,
  versionKey: false,
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id.toString();
      delete ret._id;
      return ret;
    },
  },
});

module.exports = mongoose.model('AdminNotification', adminNotificationSchema);
