const orderService = require('../services/order.service');
const ApiResponse = require('../utils/ApiResponse');

const addItem = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const item = await orderService.addToCart(req.user.id, productId, quantity || 1);
    res.status(201).json(new ApiResponse(201, item, 'Item added to cart'));
  } catch (error) {
    next(error);
  }
};

const viewCart = async (req, res, next) => {
  try {
    const items = await orderService.getCart(req.user.id);
    res.status(200).json(new ApiResponse(200, items));
  } catch (error) {
    next(error);
  }
};

const deleteItem = async (req, res, next) => {
  try {
    await orderService.removeFromCart(req.user.id, req.params.itemId);
    res.status(200).json(new ApiResponse(200, null, 'Item removed from cart'));
  } catch (error) {
    next(error);
  }
};

module.exports = { addItem, viewCart, deleteItem };