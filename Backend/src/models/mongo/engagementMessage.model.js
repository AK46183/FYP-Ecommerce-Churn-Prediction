const mongoose = require('mongoose');

// At-risk customer ko bheja gaya engagement message (flowchart: "Send Engagement Message")
const engagementMessageSchema = new mongoose.Schema({
  userId: { type: Number, required: true, index: true },
  name: String,
  email: String,
  type: { type: String, enum: ['reminder', 'discount', 'support'], required: true },
  channel: String,
  message: { type: String, required: true },
  couponCode: { type: String, default: null }, // personal code jo is message mein bheja
  riskLevel: { type: String, enum: ['Low', 'Medium', 'High'] },
  churnProbability: Number,
  trigger: { type: String, enum: ['auto', 'manual'], default: 'auto' },
  status: { type: String, enum: ['sent', 'failed'], default: 'sent' },
  sentAt: { type: Date, default: Date.now, index: true },
}, {
  versionKey: false,
});

module.exports = mongoose.model('EngagementMessage', engagementMessageSchema);
