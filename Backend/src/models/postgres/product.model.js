const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db.postgres');
const Category = require('./category.model');

const Product = sequelize.define('Product', {
  // sku = frontend catalog ki id (maslan 'sun-001') — frontend aur backend isi se milte hain
  sku: { type: DataTypes.STRING, unique: true, allowNull: true },
  name: { type: DataTypes.STRING, allowNull: false },
  brand: { type: DataTypes.STRING },
  subCategory: { type: DataTypes.STRING },
  productType: { type: DataTypes.STRING },
  description: { type: DataTypes.TEXT },
  price: { type: DataTypes.FLOAT, allowNull: false },
  oldPrice: { type: DataTypes.FLOAT, allowNull: true },
  stock: { type: DataTypes.INTEGER, defaultValue: 0 },
  imageUrl: { type: DataTypes.STRING },
  badge: { type: DataTypes.STRING },
  available: { type: DataTypes.BOOLEAN, defaultValue: true },
  // [{ sku, shade, size, price }] — shade/size ke hisaab se alag price
  variants: { type: DataTypes.JSONB, defaultValue: [] },
}, {
  tableName: 'products',
  timestamps: true,
});

Product.belongsTo(Category, { foreignKey: 'categoryId' });
Category.hasMany(Product, { foreignKey: 'categoryId' });

module.exports = Product;
