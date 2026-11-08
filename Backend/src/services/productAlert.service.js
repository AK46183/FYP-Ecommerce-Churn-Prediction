// Jis product ko customer ne like (wishlist) kiya ya cart mein rakha,
// woh wapas stock mein aaye ya sasta ho to customer ko email.
const { Op } = require('sequelize');
const WishlistItem = require('../models/postgres/wishlistItem.model');
const CartItem = require('../models/postgres/cartItem.model');
const Cart = require('../models/postgres/cart.model');
const User = require('../models/postgres/user.model');
const EmailLog = require('../models/mongo/emailLog.model');
const { sendProductAlert } = require('./mail.service');

const LOW_STOCK = () => Number(process.env.LOW_STOCK_LEVEL) || 5;

/** Product ke "watchers": wishlist + cart wale customers (ek user ek dafa) */
const findWatchers = async (product) => {
  const [wish, carts] = await Promise.all([
    product.sku ? WishlistItem.findAll({ where: { sku: product.sku }, attributes: ['userId'] }) : [],
    CartItem.findAll({
      where: { productId: product.id },
      include: [{ model: Cart, attributes: ['userId'] }],
      attributes: ['id'],
    }),
  ]);
  const from = new Map();
  wish.forEach((w) => w.userId && from.set(w.userId, 'wishlist'));
  carts.forEach((c) => c.Cart?.userId && from.set(c.Cart.userId, 'cart')); // cart ko tarjeeh
  if (!from.size) return [];

  const users = await User.findAll({
    where: { id: { [Op.in]: [...from.keys()] }, role: 'customer' },
    attributes: ['id', 'name', 'email'],
  });
  return users.map((u) => ({ user: u, from: from.get(u.id) }));
};

// 24 ghante mein same product ki same alert dobara nahi
const alreadyAlerted = async (email, type, productName) => {
  try {
    return await EmailLog.exists({
      to: email,
      type,
      subject: { $regex: productName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') },
      sentAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    });
  } catch {
    return false;
  }
};

/**
 * kind: 'restock' | 'price_drop'
 * @returns {Promise<number>} kitni emails gayi
 */
const notifyWatchers = async (product, { kind, oldPrice } = {}) => {
  try {
    const watchers = await findWatchers(product);
    let sent = 0;
    for (const { user, from } of watchers) {
      const type = kind === 'restock' ? 'restock' : 'price_drop';
      if (await alreadyAlerted(user.email, type, product.name)) continue;
      await sendProductAlert({ user, product, kind, oldPrice, from });
      sent++;
    }
    if (sent) console.log(`[alerts] ${kind} "${product.name}" -> ${sent} customer(s)`);
    return sent;
  } catch (error) {
    console.error('[alerts] failed:', error.message);
    return 0;
  }
};

/**
 * Product update ke baad bulayein: purani aur nayi halat compare karke sahi alert.
 * before = { stock, available, price }
 */
const handleProductChange = (before, product) => {
  const wasOut = before.stock <= 0 || before.available === false;
  const nowIn = product.stock > 0 && product.available !== false;
  if (wasOut && nowIn) return notifyWatchers(product, { kind: 'restock' });
  if (nowIn && Number(product.price) < Number(before.price)) {
    return notifyWatchers(product, { kind: 'price_drop', oldPrice: before.price });
  }
  return Promise.resolve(0);
};

module.exports = { notifyWatchers, handleProductChange, findWatchers, LOW_STOCK };
