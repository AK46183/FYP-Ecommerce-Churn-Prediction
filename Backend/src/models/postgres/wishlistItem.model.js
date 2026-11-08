const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db.postgres');
const User = require('./user.model');

// Wishlist frontend ki product id (sku) save karti hai
const WishlistItem = sequelize.define('WishlistItem', {
  sku: { type: DataTypes.STRING, allowNull: false },
}, {
  tableName: 'wishlist_items',
  timestamps: true,
  indexes: [{ unique: true, fields: ['userId', 'sku'] }],
});

WishlistItem.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(WishlistItem, { foreignKey: 'userId' });

module.exports = WishlistItem;
