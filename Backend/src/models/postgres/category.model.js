const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db.postgres');

const Category = sequelize.define('Category', {
  name: { type: DataTypes.STRING, allowNull: false, unique: true },
}, {
  tableName: 'categories',
  timestamps: true,
});

module.exports = Category;