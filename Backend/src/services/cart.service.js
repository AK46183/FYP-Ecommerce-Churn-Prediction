// Website ka cart: login customer ka cart account mein save + har item ki live check (stock / price)
const Cart = require('../models/postgres/cart.model');
const CartItem = require('../models/postgres/cartItem.model');
const Product = require('../models/postgres/product.model');
const ApiError = require('../utils/ApiError');
const { resolvePrice, findVariant } = require('./order.service');

const MAX_LINES = 50;
const MAX_QTY = 20;

const lineKey = (i) => `${i.sku}__${i.shade || ''}__${i.size || ''}`;

/** Frontend items ko saaf karo: sku, quantity 1-20, shade/size text */
const cleanItems = (items) => {
  if (!Array.isArray(items)) throw new ApiError(400, 'items must be a list');
  const merged = new Map();
  items.slice(0, MAX_LINES).forEach((i) => {
    if (!i || !i.sku) return;
    const item = {
      sku: String(i.sku),
      shade: i.shade ? String(i.shade).slice(0, 120) : null,
      size: i.size ? String(i.size).slice(0, 60) : null,
      quantity: Math.min(MAX_QTY, Math.max(1, Math.floor(Number(i.quantity) || 1))),
    };
    const key = lineKey(item);
    const prev = merged.get(key);
    merged.set(key, prev ? { ...prev, quantity: Math.min(MAX_QTY, prev.quantity + item.quantity) } : item);
  });
  return [...merged.values()];
};

/**
 * Har item ka haal: ok | low (stock kam) | soldout | unknown (database mein nahi)
 * aur abhi ki price (agar badal gayi ho).
 */
const checkItems = async (rawItems) => {
  const items = cleanItems(rawItems);
  const products = await Product.findAll({ where: { sku: [...new Set(items.map((i) => i.sku))] } });
  const bySku = new Map(products.map((p) => [p.sku, p]));

  // Ek hi product alag shades mein: stock sab mein bata hua
  const totalBySku = new Map();
  items.forEach((i) => totalBySku.set(i.sku, (totalBySku.get(i.sku) || 0) + i.quantity));

  return items.map((i) => {
    const p = bySku.get(i.sku);
    if (!p) return { ...i, status: 'unknown', message: 'This item is no longer sold' };
    const variant = findVariant(p, i.shade, i.size);
    const price = resolvePrice(p, i.shade, i.size);
    const base = {
      ...i,
      productId: p.id,
      name: p.name,
      image: p.imageUrl,
      price,
      oldPrice: variant?.price ? null : p.oldPrice,
      stock: p.stock,
    };
    if (!p.available || p.stock <= 0 || variant?.available === false) {
      return { ...base, status: 'soldout', message: 'Sold out — remove it to continue' };
    }
    if (totalBySku.get(i.sku) > p.stock) {
      return { ...base, status: 'low', message: `Only ${p.stock} left — please lower the quantity` };
    }
    if (p.stock <= 5) return { ...base, status: 'ok', message: `Hurry — only ${p.stock} left` };
    return { ...base, status: 'ok', message: null };
  });
};

const getOrCreateCart = async (userId) => {
  const [cart] = await Cart.findOrCreate({ where: { userId } });
  return cart;
};

/** Account wala cart (sku ke saath, frontend ki shape mein) */
const getCartItems = async (userId) => {
  const cart = await getOrCreateCart(userId);
  const rows = await CartItem.findAll({
    where: { cartId: cart.id },
    include: [{ model: Product, attributes: ['sku'] }],
    order: [['createdAt', 'ASC']],
  });
  const items = rows
    .filter((r) => r.Product?.sku)
    .map((r) => ({ sku: r.Product.sku, shade: r.shade, size: r.size, quantity: r.quantity }));
  return items.length ? checkItems(items) : [];
};

/** Poora cart badal do (frontend jo bheje wahi save) — phir check ke saath wapas */
const replaceCart = async (userId, rawItems) => {
  const items = cleanItems(rawItems);
  const cart = await getOrCreateCart(userId);
  const products = await Product.findAll({ where: { sku: [...new Set(items.map((i) => i.sku))] }, attributes: ['id', 'sku'] });
  const idBySku = new Map(products.map((p) => [p.sku, p.id]));

  const existing = await CartItem.findAll({ where: { cartId: cart.id } });
  const existingByKey = new Map();
  const skuById = new Map(products.map((p) => [p.id, p.sku]));
  existing.forEach((row) => {
    const sku = skuById.get(row.productId);
    if (sku) existingByKey.set(lineKey({ sku, shade: row.shade, size: row.size }), row);
  });

  let changed = false;
  const keep = new Set();
  for (const item of items) {
    const productId = idBySku.get(item.sku);
    if (!productId) continue; // database mein nahi — chhod do
    const key = lineKey(item);
    const row = existingByKey.get(key);
    if (row) {
      keep.add(row.id);
      if (row.quantity !== item.quantity) {
        await row.update({ quantity: item.quantity });
        changed = true;
      }
    } else {
      const created = await CartItem.create({
        cartId: cart.id, productId, shade: item.shade, size: item.size, quantity: item.quantity,
      });
      keep.add(created.id);
      changed = true;
    }
  }
  const toDelete = existing.filter((row) => !keep.has(row.id)).map((row) => row.id);
  if (toDelete.length) {
    await CartItem.destroy({ where: { id: toDelete } });
    changed = true;
  }

  // Cart badla to nayi reminder email ki ijazat
  if (changed) await cart.update({ reminderSentAt: null });

  return items.length ? checkItems(items) : [];
};

module.exports = { checkItems, getCartItems, replaceCart, cleanItems, lineKey };
