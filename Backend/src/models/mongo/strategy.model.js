const mongoose = require('mongoose');

const strategySchema = new mongoose.Schema({
  season: { type: String, required: true, index: true }, // spring | summer | monsoon | autumn | winter ...
  title: { type: String, required: true },
  type: String,
  target: String,
  offer: String,
  channel: String,
  uplift: String,
  custom: { type: Boolean, default: true },
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

module.exports = mongoose.model('Strategy', strategySchema);
