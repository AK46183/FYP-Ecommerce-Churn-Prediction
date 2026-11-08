const mongoose = require('mongoose');

// Har scoring run mein har customer ka ek record save hota hai.
// Is history se monthly report aur trend chart bante hain.
const churnScoreSchema = new mongoose.Schema({
  userId: { type: Number, required: true, index: true },
  name: String,
  email: String,
  city: String,

  // Model ko jo features bheje gaye
  features: {
    tenure_months: Number,
    order_count: Number,
    days_since_last_order: Number,
    complain: Number,
  },

  // Model ka jawab
  churnProbability: { type: Number, required: true },
  riskLevel: { type: String, enum: ['Low', 'Medium', 'High'], required: true },

  // Admin dashboard ke liye extra info
  stats: {
    orders: Number,
    avgOrder: Number,
    lifetimeValue: Number,
    lastOrderDays: Number,
  },
  reason: String,
  action: String,
  channel: String,

  scoredAt: { type: Date, default: Date.now, index: true },
}, {
  versionKey: false,
});

module.exports = mongoose.model('ChurnScore', churnScoreSchema);
