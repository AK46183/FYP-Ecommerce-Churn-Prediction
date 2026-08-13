const { productValidation } = require('../validators/product.validator');
const productService = require('../services/product.service');
const ApiResponse = require('../utils/ApiResponse');

const getProducts = async (req, res, next) => {
  try {
    const products = await productService.getAllProducts();
    res.status(200).json(new ApiResponse(200, products));
  } catch (error) {
    next(error);
  }
};

const getProduct = async (req, res, next) => {
  try {
    const product = await productService.getProductById(req.params.id);
    res.status(200).json(new ApiResponse(200, product));
  } catch (error) {
    next(error);
  }
};

const addProduct = async (req, res, next) => {
  try {
    const errors = productValidation(req.body);
    if (errors.length) return res.status(400).json({ errors });

    const product = await productService.createProduct(req.body);
    res.status(201).json(new ApiResponse(201, product, 'Product created successfully'));
  } catch (error) {
    next(error);
  }
};

const editProduct = async (req, res, next) => {
  try {
    const product = await productService.updateProduct(req.params.id, req.body);
    res.status(200).json(new ApiResponse(200, product, 'Product updated successfully'));
  } catch (error) {
    next(error);
  }
};

const removeProduct = async (req, res, next) => {
  try {
    await productService.deleteProduct(req.params.id);
    res.status(200).json(new ApiResponse(200, null, 'Product deleted successfully'));
  } catch (error) {
    next(error);
  }
};

module.exports = { getProducts, getProduct, addProduct, editProduct, removeProduct };