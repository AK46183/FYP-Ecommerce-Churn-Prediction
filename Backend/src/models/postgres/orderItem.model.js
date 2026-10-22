const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db.postgres');
const Order = require('./order.model');
const Product = require('./product.model');

const OrderItem = sequelize.define('OrderItem', {
  quantity: { type: DataTypes.INTEGER, allowNull: false },
  price: { type: DataTypes.FLOAT, allowNull: false },
}, {
  tableName: 'order_items',
  timestamps: true,
});

OrderItem.belongsTo(Order, { foreignKey: 'orderId' });
Order.hasMany(OrderItem, { foreignKey: 'orderId' });

OrderItem.belongsTo(Product, { foreignKey: 'productId' });
Product.hasMany(OrderItem, { foreignKey: 'productId' });

module.exports = OrderItem;