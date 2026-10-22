const orderService = require('../services/order.service');
const ApiResponse = require('../utils/ApiResponse');

const checkout = async (req, res, next) => {
  try {
    const order = await orderService.placeOrder(req.user.id);
    res.status(201).json(new ApiResponse(201, order, 'Order placed successfully'));
  } catch (error) {
    next(error);
  }
};

const myOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getUserOrders(req.user.id);
    res.status(200).json(new ApiResponse(200, orders));
  } catch (error) {
    next(error);
  }
};

module.exports = { checkout, myOrders };