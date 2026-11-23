const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db.postgres');
const User = require('./user.model');
const { encryptedText } = require('../../utils/fieldCrypto');

const Address = sequelize.define('Address', {
  label: { type: DataTypes.STRING, defaultValue: 'Home' }, // Home / Office ...
  // fullName, phone, street, postal: AES-256-GCM encrypted. city / province plain (reports, delivery)
  fullName: encryptedText('fullName'),
  phone: encryptedText('phone'),
  street: encryptedText('street', { allowNull: false }),
  city: { type: DataTypes.STRING, allowNull: false },
  province: { type: DataTypes.STRING },
  postal: encryptedText('postal'),
  isDefault: { type: DataTypes.BOOLEAN, defaultValue: false },
}, {
  tableName: 'addresses',
  timestamps: true,
});

Address.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Address, { foreignKey: 'userId' });

module.exports = Address;
