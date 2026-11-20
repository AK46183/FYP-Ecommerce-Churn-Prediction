const { Op, fn, col } = require('sequelize');
const Product = require('../models/postgres/product.model');
const Category = require('../models/postgres/category.model');
const ApiError = require('../utils/ApiError');
const { handleProductChange } = require('./productAlert.service');
const cache = require('../utils/cache');

// Products ki list (search ke baghair) 5 minute cache mein: har page par 700+ products database se dobara nahi aate.
// Admin product badle ya order stock badle to cache foran saaf (clearProductCache).
const LIST_TTL = (Number(process.env.PRODUCT_CACHE_SECONDS) || 300) * 1000;
const clearProductCache = () => cache.clear('products:');

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
  const load = () => Product.findAll({ where, include, order: [['id', 'ASC']] });
  if (search) return load(); // search ke nateeje cache nahi (bahut qism ke hote hain)
  return cache.wrap(`products:list:${category || 'all'}`, LIST_TTL, async () => (await load()).map((p) => p.toJSON()));
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
  const product = await Product.create(data);
  clearProductCache();
  return product;
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
  clearProductCache();
  // Wishlist / cart walon ko "back in stock" ya "price drop" email (intezar nahi)
  handleProductChange(before, product);
  return product;
};

const deleteProduct = async (idOrSku) => {
  const product = await findProduct(idOrSku);
  if (!product) throw new ApiError(404, 'Product not found');
  await product.destroy();
  clearProductCache();
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
  clearProductCache,
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategorySummary,
};
