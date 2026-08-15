const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db.postgres');
const User = require('./user.model');

const Cart = sequelize.define('Cart', {}, {
  tableName: 'carts',
  timestamps: true,
});

Cart.belongsTo(User, { foreignKey: 'userId' });
User.hasOne(Cart, { foreignKey: 'userId' });

module.exports = Cart;