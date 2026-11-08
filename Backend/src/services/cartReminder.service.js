// Abandoned cart: customer ne cart mein cheezein chhodi aur X ghante tak order nahi kiya
// -> ek reminder email (har cart change ke baad sirf ek dafa)
const { Op, fn, col } = require('sequelize');
const Cart = require('../models/postgres/cart.model');
const CartItem = require('../models/postgres/cartItem.model');
const Product = require('../models/postgres/product.model');
const User = require('../models/postgres/user.model');
const Order = require('../models/postgres/order.model');
const { sendCartReminder } = require('./mail.service');
const { logActivity } = require('./activityLogger.service');

const hours = () => Number(process.env.CART_REMINDER_HOURS) || 24;

/** Woh carts jin pe reminder banta hai */
const findAbandonedCarts = async ({ includeReminded = false } = {}) => {
  const cutoff = new Date(Date.now() - hours() * 60 * 60 * 1000);

  // Har cart ka aakhri change
  const lastChange = await CartItem.findAll({
    attributes: ['cartId', [fn('MAX', col('updatedAt')), 'lastAt'], [fn('SUM', col('quantity')), 'units']],
    group: ['cartId'],
    raw: true,
  });
  const stale = lastChange.filter((r) => new Date(r.lastAt) < cutoff);
  if (!stale.length) return [];

  const carts = await Cart.findAll({
    where: { id: stale.map((r) => r.cartId) },
    include: [{ model: User, attributes: ['id', 'name', 'email', 'role'] }],
  });
  const lastMap = new Map(stale.map((r) => [r.cartId, new Date(r.lastAt)]));

  const result = [];
  for (const cart of carts) {
    const lastAt = lastMap.get(cart.id);
    if (!cart.User || cart.User.role !== 'customer') continue;
    if (!includeReminded && cart.reminderSentAt && cart.reminderSentAt > lastAt) continue; // pehle hi bhej chuke
    const ordered = await Order.count({ where: { userId: cart.userId, createdAt: { [Op.gt]: lastAt } } });
    if (ordered) continue;
    result.push({ cart, lastAt });
  }
  return result;
};

/** Admin page ke liye list */
const listAbandoned = async () => {
  const rows = await findAbandonedCarts({ includeReminded: true });
  const out = [];
  for (const { cart, lastAt } of rows) {
    const items = await CartItem.findAll({
      where: { cartId: cart.id },
      include: [{ model: Product, attributes: ['name', 'price'] }],
    });
    out.push({
      cartId: cart.id,
      userId: cart.userId,
      name: cart.User.name,
      email: cart.User.email,
      lastChangedAt: lastAt,
      reminderSentAt: cart.reminderSentAt,
      items: items.map((i) => ({ name: i.Product?.name, quantity: i.quantity, shade: i.shade || i.size })),
      value: Math.round(items.reduce((s, i) => s + (i.Product?.price || 0) * i.quantity, 0)),
    });
  }
  return out;
};

/** Reminder emails bhejo. @returns { checked, sent } */
const sendCartReminders = async () => {
  const rows = await findAbandonedCarts();
  let sent = 0;
  for (const { cart } of rows) {
    const items = await CartItem.findAll({
      where: { cartId: cart.id },
      include: [{ model: Product, attributes: ['name', 'price', 'imageUrl'] }],
    });
    if (!items.length) continue;
    await sendCartReminder(cart.User, items.map((i) => ({
      name: i.Product?.name, shade: i.shade || i.size, quantity: i.quantity, price: i.Product?.price || 0,
    })));
    await cart.update({ reminderSentAt: new Date() });
    logActivity(cart.userId, 'cart_reminder', null, { items: items.length });
    sent++;
  }
  return { checked: rows.length, sent };
};

/** Server chalte hue har ghante khud check */
const startCartReminderTimer = () => {
  const run = () =>
    sendCartReminders()
      .then((r) => r.sent && console.log(`[cart-reminder] sent ${r.sent} reminder email(s)`))
      .catch((e) => console.error('[cart-reminder]', e.message));
  setTimeout(run, 60 * 1000); // start ke 1 minute baad
  return setInterval(run, 60 * 60 * 1000);
};

module.exports = { findAbandonedCarts, listAbandoned, sendCartReminders, startCartReminderTimer };
