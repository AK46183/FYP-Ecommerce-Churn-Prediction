const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db.postgres');
const Cart = require('./cart.model');
const Product = require('./product.model');

const CartItem = sequelize.define('CartItem', {
  quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
}, {
  tableName: 'cart_items',
  timestamps: true,
});

CartItem.belongsTo(Cart, { foreignKey: 'cartId' });
Cart.hasMany(CartItem, { foreignKey: 'cartId' });

CartItem.belongsTo(Product, { foreignKey: 'productId' });
Product.hasMany(CartItem, { foreignKey: 'productId' });

module.exports = CartItem;