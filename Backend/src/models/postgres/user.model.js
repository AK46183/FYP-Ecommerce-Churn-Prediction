const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db.postgres');

const User = sequelize.define('User', {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, defaultValue: 'customer' },
  city: { type: DataTypes.STRING, allowNull: true },
  phone: { type: DataTypes.STRING, allowNull: true },
  // Churn model ka "complain" feature yahin se aata hai (admin mark karta hai)
  hasComplaint: { type: DataTypes.BOOLEAN, defaultValue: false },
  // Google se login karne walon ke liye
  googleId: { type: DataTypes.STRING, allowNull: true },
  // Forgot password: token ka hash (asli token sirf email mein jata hai)
  resetTokenHash: { type: DataTypes.STRING, allowNull: true },
  resetTokenExpires: { type: DataTypes.DATE, allowNull: true },
}, {
  tableName: 'users',
  timestamps: true,
});

module.exports = User;
