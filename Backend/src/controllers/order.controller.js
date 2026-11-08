const orderService = require('../services/order.service');
const ApiResponse = require('../utils/ApiResponse');

// Purana flow: backend cart -> order (Postman tests ke liye rakha hai)
const checkout = async (req, res, next) => {
  try {
    const order = await orderService.placeOrder(req.user.id);
    res.status(201).json(new ApiResponse(201, order, 'Order placed successfully'));
  } catch (error) {
    next(error);
  }
};

// Website checkout: frontend cart ke items + address
const createOrder = async (req, res, next) => {
  try {
    const order = await orderService.createOrder(req.user.id, req.body || {});
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

const myOrder = async (req, res, next) => {
  try {
    const order = await orderService.getUserOrderById(req.user.id, req.params.id);
    res.status(200).json(new ApiResponse(200, order));
  } catch (error) {
    next(error);
  }
};

module.exports = { checkout, createOrder, myOrders, myOrder };
