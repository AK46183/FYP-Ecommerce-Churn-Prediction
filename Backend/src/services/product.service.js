const Product = require('../models/postgres/product.model');
const Category = require('../models/postgres/category.model');
const ApiError = require('../utils/ApiError');

const getAllProducts = async () => {
  return await Product.findAll({ include: Category });
};

const getProductById = async (id) => {
  const product = await Product.findByPk(id, { include: Category });
  if (!product) throw new ApiError(404, 'Product not found');
  return product;
};

const createProduct = async (data) => {
  return await Product.create(data);
};

const updateProduct = async (id, data) => {
  const product = await Product.findByPk(id);
  if (!product) throw new ApiError(404, 'Product not found');
  await product.update(data);
  return product;
};

const deleteProduct = async (id) => {
  const product = await Product.findByPk(id);
  if (!product) throw new ApiError(404, 'Product not found');
  await product.destroy();
  return true;
};

module.exports = { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct };