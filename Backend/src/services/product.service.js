const { Op, fn, col } = require('sequelize');
const Product = require('../models/postgres/product.model');
const Category = require('../models/postgres/category.model');
const ApiError = require('../utils/ApiError');
const { handleProductChange } = require('./productAlert.service');

const getAllProducts = async ({ search, category } = {}) => {
  const where = {};
  if (search) {
    where[Op.or] = [
      { name: { [Op.iLike]: `%${search}%` } },
      { brand: { [Op.iLike]: `%${search}%` } },
      { sku: { [Op.iLike]: `%${search}%` } },
    ];
  }
  const include = [{ model: Category, ...(category && { where: { name: category } }) }];
  return Product.findAll({ where, include, order: [['id', 'ASC']] });
};

// id number bhi ho sakta hai (12) ya frontend ka sku ('sun-001')
const findProduct = (idOrSku) =>
  /^\d+$/.test(String(idOrSku))
    ? Product.findByPk(Number(idOrSku), { include: Category })
    : Product.findOne({ where: { sku: String(idOrSku) }, include: Category });

const getProductById = async (idOrSku) => {
  const product = await findProduct(idOrSku);
  if (!product) throw new ApiError(404, 'Product not found');
  return product;
};

const EDITABLE = ['name', 'description', 'price', 'oldPrice', 'stock', 'imageUrl', 'badge', 'available', 'brand', 'subCategory', 'categoryId'];

const createProduct = async (data) => {
  return Product.create(data);
};

const updateProduct = async (idOrSku, data = {}) => {
  const product = await findProduct(idOrSku);
  if (!product) throw new ApiError(404, 'Product not found');
  const changes = Object.fromEntries(EDITABLE.filter((k) => data[k] !== undefined).map((k) => [k, data[k]]));
  if (changes.price !== undefined && !(Number(changes.price) > 0)) throw new ApiError(400, 'Price must be greater than 0');
  if (changes.stock !== undefined && !(Number.isInteger(Number(changes.stock)) && Number(changes.stock) >= 0)) {
    throw new ApiError(400, 'Stock must be 0 or more');
  }
  const before = { stock: product.stock, available: product.available, price: product.price };
  await product.update(changes);
  // Wishlist / cart walon ko "back in stock" ya "price drop" email (intezar nahi)
  handleProductChange(before, product);
  return product;
};

const deleteProduct = async (idOrSku) => {
  const product = await findProduct(idOrSku);
  if (!product) throw new ApiError(404, 'Product not found');
  await product.destroy();
  return true;
};

// Admin Categories page: har category mein kitne products, kitne available, stock
const getCategorySummary = async () => {
  const rows = await Product.findAll({
    attributes: [
      'categoryId',
      [fn('COUNT', col('Product.id')), 'products'],
      [fn('SUM', col('stock')), 'stock'],
    ],
    include: [{ model: Category, attributes: ['name'] }],
    group: ['categoryId', 'Category.id'],
    raw: true,
  });
  const available = await Product.findAll({
    attributes: ['categoryId', [fn('COUNT', col('id')), 'count']],
    where: { available: true },
    group: ['categoryId'],
    raw: true,
  });
  const availMap = new Map(available.map((r) => [r.categoryId, Number(r.count)]));
  return rows
    .map((r) => ({
      categoryId: r.categoryId,
      name: r['Category.name'] || 'Uncategorised',
      products: Number(r.products),
      available: availMap.get(r.categoryId) || 0,
      stock: Number(r.stock) || 0,
    }))
    .sort((a, b) => b.products - a.products);
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategorySummary,
};
