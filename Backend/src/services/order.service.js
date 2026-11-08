const Cart = require('../models/postgres/cart.model');
const CartItem = require('../models/postgres/cartItem.model');
const Order = require('../models/postgres/order.model');
const OrderItem = require('../models/postgres/orderItem.model');
const Product = require('../models/postgres/product.model');
const User = require('../models/postgres/user.model');
const { logActivity } = require('./activityLogger.service');
const ApiError = require('../utils/ApiError');
const { sequelize } = require('../config/db.postgres');
const { sendOrderConfirmation, sendOrderStatus } = require('./mail.service');
const couponService = require('./coupon.service');
const { notifyAdmin } = require('./notification.service');
const { handleProductChange, LOW_STOCK } = require('./productAlert.service');

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ where: { userId } });
  if (!cart) cart = await Cart.create({ userId });
  return cart;
};

const addToCart = async (userId, productId, quantity) => {
  const cart = await getOrCreateCart(userId);
  const product = await Product.findByPk(productId);
  if (!product) throw new ApiError(404, 'Product not found');
  logActivity(userId, 'cart_add', Number(productId), { quantity });

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
  logActivity(userId, 'cart_remove', item.productId);
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

  logActivity(userId, 'checkout', null, { orderId: order.id, totalAmount });
  return order;
};

const getAllOrders = async () => {
  return await Order.findAll({
    include: [
      { model: User, attributes: ['id', 'name', 'email'] },
      { model: OrderItem, include: [{ model: Product, attributes: ['id', 'name', 'sku'] }] },
    ],
    order: [['createdAt', 'DESC']],
  });
};

const updateOrderStatus = async (orderId, status) => {
  const order = await Order.findByPk(orderId, {
    include: [{ model: User, attributes: ['name', 'email'] }, { model: OrderItem }],
  });
  if (!order) throw new ApiError(404, 'Order not found');
  const prev = order.status;
  const next = String(status).toLowerCase();
  if (prev === next) return order;
  if (prev === 'cancelled') throw new ApiError(400, 'A cancelled order cannot be reopened');

  order.status = next;
  await order.save();

  const name = order.customerName || order.User?.name || 'Customer';
  const email = order.customerEmail || order.User?.email;

  // Cancel: stock wapas (aur jo product 0 tha uske watchers ko "back in stock")
  if (next === 'cancelled') {
    for (const item of order.OrderItems || []) {
      if (!item.productId) continue;
      const product = await Product.findByPk(item.productId);
      if (!product) continue;
      const before = { stock: product.stock, available: product.available, price: product.price };
      await product.increment('stock', { by: item.quantity });
      await product.reload();
      handleProductChange(before, product);
    }
  }

  // Customer ko status email + admin inbox
  sendOrderStatus(order, email, name);
  if (next === 'delivered') {
    notifyAdmin({
      type: 'delivered',
      title: `Order MN-${order.id} delivered to ${name}`,
      body: `${name} has received order MN-${order.id} (PKR ${Math.round(order.totalAmount).toLocaleString('en-PK')}).`,
      link: '/admin/orders',
      meta: { orderId: order.id },
    });
  } else if (next === 'cancelled') {
    notifyAdmin({
      type: 'cancelled',
      title: `Order MN-${order.id} cancelled`,
      body: `Order MN-${order.id} for ${name} was cancelled. Stock has been returned.`,
      link: '/admin/orders',
      meta: { orderId: order.id },
    });
  }
  return order;
};

/* ------------------------------------------------------------------ */
/* Website checkout (frontend cart -> asli order)                      */
/* ------------------------------------------------------------------ */

const SHIPPING = {
  standard: () => Number(process.env.SHIPPING_STANDARD) || 250,
  express: () => Number(process.env.SHIPPING_EXPRESS) || 600,
};
const PHONE_RE = /^(\+92|0)3\d{9}$/;

/** Cart ka shade / size kis variant ka hai */
const findVariant = (product, shade, size) => {
  const variants = Array.isArray(product.variants) ? product.variants : [];
  return variants.find(
    (x) => (shade && (x.label === shade || x.shade === shade || x.size === shade)) || (size && x.size === size)
  );
};

/** Shade / size ke hisaab se sahi price (kuch variants ki price alag hai) */
const resolvePrice = (product, shade, size) => {
  const v = findVariant(product, shade, size);
  return typeof v?.price === 'number' && v.price > 0 ? v.price : product.price;
};

const validateCheckout = ({ items, customer = {}, delivery, payment }) => {
  const errors = [];
  if (!Array.isArray(items) || !items.length) errors.push('Cart is empty');
  else if (items.length > 50) errors.push('Too many items in one order');
  else if (items.some((i) => !i || !i.sku || !Number.isInteger(Number(i.quantity)) || i.quantity < 1 || i.quantity > 20)) {
    errors.push('Each item needs a product and a quantity between 1 and 20');
  }
  if (!customer.name || !String(customer.name).trim()) errors.push('Name is required');
  if (!customer.email || !/^\S+@\S+\.\S+$/.test(customer.email)) errors.push('A valid email is required');
  const phone = String(customer.phone || '').replace(/[\s-]/g, '');
  if (!PHONE_RE.test(phone)) errors.push('A valid Pakistani mobile number is required, e.g. 03001234567');
  if (!customer.street || !customer.city) errors.push('Street address and city are required');
  if (delivery && !SHIPPING[delivery]) errors.push('Delivery must be standard or express');
  if (payment && !['cod', 'card'].includes(payment)) errors.push('Payment must be cod or card');
  return { errors, phone };
};

const createOrder = async (userId, payload) => {
  const { errors, phone } = validateCheckout(payload);
  if (errors.length) throw new ApiError(400, errors[0]);

  const { items, customer } = payload;
  const delivery = payload.delivery || 'standard';
  const payment = payload.payment || 'cod';

  const order = await sequelize.transaction(async (t) => {
    const skus = [...new Set(items.map((i) => String(i.sku)))];
    const products = await Product.findAll({ where: { sku: skus }, transaction: t, lock: t.LOCK.UPDATE });
    const bySku = new Map(products.map((p) => [p.sku, p]));

    // Har item check: product hai, bik sakta hai, stock hai
    const lines = items.map((i) => {
      const product = bySku.get(String(i.sku));
      if (!product) throw new ApiError(400, `Product "${i.sku}" is not in the store database. Run "npm run seed:catalog".`);
      if (!product.available) throw new ApiError(400, `${product.name} is not available right now`);
      const variant = findVariant(product, i.shade, i.size);
      if (variant && variant.available === false) {
        throw new ApiError(400, `${product.name} (${i.shade || i.size}) is sold out`);
      }
      return { product, quantity: Number(i.quantity), shade: i.shade || null, size: i.size || null };
    });

    const needed = new Map();
    lines.forEach((l) => needed.set(l.product.id, (needed.get(l.product.id) || 0) + l.quantity));
    for (const l of lines) {
      if (needed.get(l.product.id) > l.product.stock) {
        throw new ApiError(400, `Only ${l.product.stock} left of ${l.product.name}`);
      }
    }

    const priced = lines.map((l) => ({ ...l, price: resolvePrice(l.product, l.shade, l.size) }));
    const subtotal = priced.reduce((s, l) => s + l.price * l.quantity, 0);
    const shippingFee = SHIPPING[delivery]();

    // Coupon (agar diya ho) — server dobara check karta hai
    let discount = 0;
    let couponCode = null;
    if (payload.couponCode) {
      const result = await couponService.evaluate(payload.couponCode, { userId, subtotal, shippingFee, transaction: t });
      discount = result.discount;
      couponCode = result.code;
      await couponService.redeem(result.coupon, t);
    }

    const created = await Order.create({
      userId,
      status: 'pending',
      subtotal,
      shippingFee,
      discount,
      couponCode,
      totalAmount: Math.max(0, subtotal - discount + shippingFee),
      delivery,
      payment,
      customerName: String(customer.name).trim(),
      customerEmail: String(customer.email).trim(),
      phone,
      shippingAddress: {
        street: customer.street,
        city: customer.city,
        province: customer.province || '',
        postal: customer.postal || '',
      },
    }, { transaction: t });

    for (const l of priced) {
      await OrderItem.create({
        orderId: created.id,
        productId: l.product.id,
        sku: l.product.sku,
        name: l.product.name,
        image: l.product.imageUrl,
        shade: l.shade,
        size: l.size,
        quantity: l.quantity,
        price: l.price,
      }, { transaction: t });
    }
    for (const [productId, qty] of needed) {
      await Product.decrement('stock', { by: qty, where: { id: productId }, transaction: t });
    }

    // Customer ka phone / city khaali ho to bhar do (churn report mein city dikhti hai)
    const user = await User.findByPk(userId, { transaction: t });
    if (user && (!user.phone || !user.city)) {
      user.phone = user.phone || phone;
      user.city = user.city || customer.city;
      await user.save({ transaction: t });
    }

    // Account wala cart khaali (order ho gaya)
    const cart = await Cart.findOne({ where: { userId }, transaction: t });
    if (cart) {
      await CartItem.destroy({ where: { cartId: cart.id }, transaction: t });
      await cart.update({ reminderSentAt: null }, { transaction: t });
    }

    created.setDataValue('items', priced);
    return created;
  });

  logActivity(userId, 'checkout', null, { orderId: order.id, totalAmount: order.totalAmount });
  const emailItems = order.getDataValue('items').map((l) => ({
    name: l.product.name, shade: l.shade || l.size, quantity: l.quantity, price: l.price,
  }));
  sendOrderConfirmation(order, emailItems); // intezar nahi — email fail ho to bhi order ho chuka

  // Admin inbox: naya order
  const units = emailItems.reduce((n, i) => n + i.quantity, 0);
  notifyAdmin({
    type: 'order',
    title: `New order MN-${order.id} — PKR ${Math.round(order.totalAmount).toLocaleString('en-PK')}`,
    body: `${order.customerName} (${order.customerEmail}) ordered ${units} item(s):\n`
      + emailItems.map((i) => `• ${i.name}${i.shade ? ` — ${i.shade}` : ''} × ${i.quantity}`).join('\n')
      + `\nDeliver to: ${order.shippingAddress?.city || ''} · ${order.payment === 'cod' ? 'Cash on Delivery' : 'Card'}`
      + (order.couponCode ? `\nCoupon: ${order.couponCode}` : ''),
    link: '/admin/orders',
    meta: { orderId: order.id, userId },
  });

  // Admin inbox: stock kam ho gaya
  const low = LOW_STOCK();
  for (const l of order.getDataValue('items')) {
    const fresh = await Product.findByPk(l.product.id, { attributes: ['id', 'name', 'stock', 'sku'] });
    if (fresh && fresh.stock <= low && l.product.stock > low) {
      notifyAdmin({
        type: 'low_stock',
        title: fresh.stock === 0 ? `Out of stock: ${fresh.name}` : `Low stock: ${fresh.name} (${fresh.stock} left)`,
        body: `${fresh.name} (${fresh.sku}) has ${fresh.stock} unit(s) left after order MN-${order.id}.`,
        link: '/admin/inventory',
        meta: { productId: fresh.id },
      });
    }
  }

  return getUserOrderById(userId, order.id);
};

/** Frontend wali shape (pehle localStorage mein yahi save hoti thi) */
const toClientOrder = (o) => {
  const a = o.shippingAddress || {};
  return {
    id: `MN-${o.id}`,
    orderId: o.id,
    date: new Date(o.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    createdAt: o.createdAt,
    updatedAt: o.updatedAt,
    status: o.status.charAt(0).toUpperCase() + o.status.slice(1),
    items: (o.OrderItems || []).map((i) => ({
      id: i.sku || String(i.productId),
      name: i.name || i.Product?.name,
      image: i.image || i.Product?.imageUrl,
      shade: i.shade,
      size: i.size,
      quantity: i.quantity,
      price: i.price,
    })),
    subtotal: o.subtotal ?? o.totalAmount - (o.shippingFee || 0),
    shipping: o.shippingFee || 0,
    discount: o.discount || 0,
    couponCode: o.couponCode || null,
    total: o.totalAmount,
    delivery: o.delivery,
    payment: o.payment,
    customer: {
      name: o.customerName,
      email: o.customerEmail,
      phone: o.phone,
      street: a.street,
      city: a.city,
      province: a.province,
      postal: a.postal,
    },
  };
};

const parseOrderId = (id) => Number(String(id).replace(/^MN-/i, ''));

const getUserOrders = async (userId) => {
  const orders = await Order.findAll({
    where: { userId },
    include: [{ model: OrderItem, include: [{ model: Product, attributes: ['name', 'imageUrl'] }] }],
    order: [['createdAt', 'DESC']],
  });
  return orders.map(toClientOrder);
};

const getUserOrderById = async (userId, id) => {
  const order = await Order.findOne({
    where: { id: parseOrderId(id), userId },
    include: [{ model: OrderItem, include: [{ model: Product, attributes: ['name', 'imageUrl'] }] }],
  });
  if (!order) throw new ApiError(404, 'Order not found');
  return toClientOrder(order);
};

module.exports = {
  addToCart,
  getCart,
  removeFromCart,
  placeOrder,
  getUserOrders,
  getUserOrderById,
  getAllOrders,
  updateOrderStatus,
  createOrder,
  resolvePrice,
  findVariant,
  validateCheckout,
  toClientOrder,
};