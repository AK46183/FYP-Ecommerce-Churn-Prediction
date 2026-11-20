const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db.postgres');
const User = require('./user.model');
const { encryptedText, encryptedAddress } = require('../../utils/fieldCrypto');

const Order = sequelize.define('Order', {
  status: { type: DataTypes.STRING, defaultValue: 'pending' }, // pending, processing, shipped, delivered, cancelled
  totalAmount: { type: DataTypes.FLOAT, allowNull: false },
  subtotal: { type: DataTypes.FLOAT, allowNull: true },
  shippingFee: { type: DataTypes.FLOAT, defaultValue: 0 },
  discount: { type: DataTypes.FLOAT, defaultValue: 0 },
  couponCode: { type: DataTypes.STRING, allowNull: true },
  delivery: { type: DataTypes.STRING, defaultValue: 'standard' }, // standard | express
  payment: { type: DataTypes.STRING, defaultValue: 'cod' }, // cod | card
  customerName: { type: DataTypes.STRING },
  customerEmail: { type: DataTypes.STRING },
  phone: encryptedText('phone'), // AES-256-GCM encrypted
  // { street, city, province, postal }: poora encrypted, sirf city plain (reports)
  shippingAddress: encryptedAddress('shippingAddress', { allowNull: true }),
}, {
  tableName: 'orders',
  timestamps: true,
});

Order.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Order, { foreignKey: 'userId' });

module.exports = Order;
