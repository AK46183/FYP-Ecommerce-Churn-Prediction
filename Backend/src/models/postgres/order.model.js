const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db.postgres');
const User = require('./user.model');

const Order = sequelize.define('Order', {
  status: { type: DataTypes.STRING, defaultValue: 'pending' }, // pending, shipped, delivered, cancelled
  totalAmount: { type: DataTypes.FLOAT, allowNull: false },
}, {
  tableName: 'orders',
  timestamps: true,
});

Order.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Order, { foreignKey: 'userId' });

module.exports = Order;