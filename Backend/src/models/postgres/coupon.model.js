const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db.postgres');
const User = require('./user.model');

// Discount codes — admin banata hai (Promotions page) ya churn engagement khud banata hai
const Coupon = sequelize.define('Coupon', {
  code: { type: DataTypes.STRING, allowNull: false, unique: true }, // hamesha UPPERCASE
  description: { type: DataTypes.STRING },
  // percent = % off subtotal | fixed = PKR off | shipping = delivery free
  type: { type: DataTypes.STRING, allowNull: false, defaultValue: 'percent' },
  value: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
  minOrder: { type: DataTypes.FLOAT, defaultValue: 0 },
  maxUses: { type: DataTypes.INTEGER, allowNull: true }, // null = unlimited
  usedCount: { type: DataTypes.INTEGER, defaultValue: 0 },
  expiresAt: { type: DataTypes.DATE, allowNull: true },
  active: { type: DataTypes.BOOLEAN, defaultValue: true },
  source: { type: DataTypes.STRING, defaultValue: 'admin' }, // admin | engagement | system
}, {
  tableName: 'coupons',
  timestamps: true,
});

// userId ho to code sirf usi customer ka (personal code)
Coupon.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Coupon, { foreignKey: 'userId' });

module.exports = Coupon;
