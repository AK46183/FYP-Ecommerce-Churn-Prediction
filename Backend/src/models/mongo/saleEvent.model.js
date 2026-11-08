const mongoose = require('mongoose');

const saleEventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  tagline: String,
  type: { type: String, default: 'Sale' }, // Sale | Event | Product Launch | Festival
  start: { type: String, required: true }, // 'YYYY-MM-DD' (frontend isi format mein bhejta hai)
  end: String,
  discount: Number,
  categories: String,
  description: String,
  images: [String],
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

module.exports = mongoose.model('SaleEvent', saleEventSchema);
