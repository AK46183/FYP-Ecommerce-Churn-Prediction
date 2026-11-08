const mongoose = require('mongoose');

const contactMessageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  topic: { type: String, enum: ['general', 'order', 'product', 'complaint'], default: 'general' },
  orderRef: { type: String, default: null }, // maslan MN-12
  userId: { type: Number, default: null },
  status: { type: String, enum: ['new', 'read', 'replied'], default: 'new' },
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

module.exports = mongoose.model('ContactMessage', contactMessageSchema);
