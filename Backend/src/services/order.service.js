const Cart = require('../models/postgres/cart.model');
const CartItem = require('../models/postgres/cartItem.model');
const Order = require('../models/postgres/order.model');
const OrderItem = require('../models/postgres/orderItem.model');
const Product = require('../models/postgres/product.model');
const ApiError = require('../utils/ApiError');

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ where: { userId } });
  if (!cart) cart = await Cart.create({ userId });
  return cart;
};

const addToCart = async (userId, productId, quantity) => {
  const cart = await getOrCreateCart(userId);
  const product = await Product.findByPk(productId);
  if (!product) throw new ApiError(404, 'Product not found');

  let item = await CartItem.findOne({ where: { cartId: cart.id, productId } });
  if (item) {
    item.quantity += quantity;
    await item.save();
  } else {
    item = await CartItem.create({ cartId: cart.id, productId, quantity });
  }
  return item;
};

const getCart = async (userId) => {
  const cart = await getOrCreateCart(userId);
  const items = await CartItem.findAll({ where: { cartId: cart.id }, include: Product });
  return items;
};

const removeFromCart = async (userId, itemId) => {
  const cart = await getOrCreateCart(userId);
  const item = await CartItem.findOne({ where: { id: itemId, cartId: cart.id } });
  if (!item) throw new ApiError(404, 'Cart item not found');
  await item.destroy();
  return true;
};

const placeOrder = async (userId) => {
  const cart = await getOrCreateCart(userId);
  const items = await CartItem.findAll({ where: { cartId: cart.id }, include: Product });

  if (!items.length) throw new ApiError(400, 'Cart is empty');

  const totalAmount = items.reduce((sum, item) => sum + item.Product.price * item.quantity, 0);

  const order = await Order.create({ userId, totalAmount, status: 'pending' });

  for (const item of items) {
    await OrderItem.create({
      orderId: order.id,
      productId: item.productId,
      quantity: item.quantity,
      price: item.Product.price,
    });
    await item.destroy();
  }

  return order;
};

const getUserOrders = async (userId) => {
  return await Order.findAll({ where: { userId }, include: OrderItem });
};

module.exports = { addToCart, getCart, removeFromCart, placeOrder, getUserOrders };