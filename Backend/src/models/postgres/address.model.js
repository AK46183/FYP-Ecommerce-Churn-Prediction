const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db.postgres');
const User = require('./user.model');

const Address = sequelize.define('Address', {
  label: { type: DataTypes.STRING, defaultValue: 'Home' }, // Home / Office ...
  fullName: { type: DataTypes.STRING },
  phone: { type: DataTypes.STRING },
  street: { type: DataTypes.STRING, allowNull: false },
  city: { type: DataTypes.STRING, allowNull: false },
  province: { type: DataTypes.STRING },
  postal: { type: DataTypes.STRING },
  isDefault: { type: DataTypes.BOOLEAN, defaultValue: false },
}, {
  tableName: 'addresses',
  timestamps: true,
});

Address.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Address, { foreignKey: 'userId' });

module.exports = Address;
