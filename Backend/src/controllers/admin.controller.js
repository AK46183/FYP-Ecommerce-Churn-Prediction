const orderService = require('../services/order.service');
const productService = require('../services/product.service');
const ApiResponse = require('../utils/ApiResponse');

const getAllOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getAllOrders();
    res.status(200).json(new ApiResponse(200, orders));
  } catch (error) {
    next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await orderService.updateOrderStatus(req.params.id, status);
    res.status(200).json(new ApiResponse(200, order, 'Order status updated'));
  } catch (error) {
    next(error);
  }
};

const dashboardOverview = async (req, res, next) => {
  try {
    const orders = await orderService.getAllOrders();
    const products = await productService.getAllProducts();

    const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

    res.status(200).json(new ApiResponse(200, {
      totalOrders: orders.length,
      totalRevenue,
      totalProducts: products.length,
    }));
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllOrders, updateOrderStatus, dashboardOverview };