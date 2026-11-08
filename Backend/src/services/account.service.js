// Customer account: wishlist + addresses + website activity
const WishlistItem = require('../models/postgres/wishlistItem.model');
const Address = require('../models/postgres/address.model');
const Product = require('../models/postgres/product.model');
const { logActivity } = require('./activityLogger.service');
const ApiError = require('../utils/ApiError');

/* ------------------------------ Wishlist ------------------------------ */

const getWishlist = async (userId) => {
  const rows = await WishlistItem.findAll({ where: { userId }, order: [['createdAt', 'ASC']] });
  return rows.map((r) => r.sku);
};

const addToWishlist = async (userId, sku) => {
  if (!sku) throw new ApiError(400, 'Product is required');
  await WishlistItem.findOrCreate({ where: { userId, sku: String(sku) } });
  return getWishlist(userId);
};

const removeFromWishlist = async (userId, sku) => {
  await WishlistItem.destroy({ where: { userId, sku: String(sku) } });
  return getWishlist(userId);
};

// Login ke waqt: guest wishlist (browser) + saved wishlist ko mila do
const mergeWishlist = async (userId, skus = []) => {
  const list = Array.isArray(skus) ? skus.slice(0, 200) : [];
  for (const sku of list) {
    if (sku) await WishlistItem.findOrCreate({ where: { userId, sku: String(sku) } });
  }
  return getWishlist(userId);
};

/* ------------------------------ Addresses ----------------------------- */

const ADDRESS_FIELDS = ['label', 'fullName', 'phone', 'street', 'city', 'province', 'postal', 'isDefault'];
const pick = (body = {}) => Object.fromEntries(ADDRESS_FIELDS.filter((k) => body[k] !== undefined).map((k) => [k, body[k]]));

const getAddresses = (userId) =>
  Address.findAll({ where: { userId }, order: [['isDefault', 'DESC'], ['createdAt', 'ASC']] });

const clearDefault = (userId) => Address.update({ isDefault: false }, { where: { userId } });

const addAddress = async (userId, body) => {
  const data = pick(body);
  if (!data.street || !data.city) throw new ApiError(400, 'Street and city are required');
  const count = await Address.count({ where: { userId } });
  if (count >= 10) throw new ApiError(400, 'You can save up to 10 addresses');
  if (data.isDefault || count === 0) {
    await clearDefault(userId);
    data.isDefault = true;
  }
  return Address.create({ ...data, userId });
};

const updateAddress = async (userId, id, body) => {
  const address = await Address.findOne({ where: { id, userId } });
  if (!address) throw new ApiError(404, 'Address not found');
  const data = pick(body);
  if (data.isDefault) await clearDefault(userId);
  await address.update(data);
  return address;
};

const deleteAddress = async (userId, id) => {
  const address = await Address.findOne({ where: { id, userId } });
  if (!address) throw new ApiError(404, 'Address not found');
  const wasDefault = address.isDefault;
  await address.destroy();
  if (wasDefault) {
    const next = await Address.findOne({ where: { userId }, order: [['createdAt', 'ASC']] });
    if (next) await next.update({ isDefault: true });
  }
  return true;
};

/* ------------------------------ Activity ------------------------------ */
// Website se aane wale events (cart frontend mein hai, is liye wahi batata hai)
// Churn report ka "Cart abandoned" driver inhi se banta hai.
const ALLOWED_EVENTS = ['product_view', 'cart_add', 'cart_remove'];

const trackActivity = async (userId, { eventType, sku, quantity }) => {
  if (!ALLOWED_EVENTS.includes(eventType)) throw new ApiError(400, 'Unknown event');
  const product = sku ? await Product.findOne({ where: { sku: String(sku) }, attributes: ['id'] }) : null;
  logActivity(userId, eventType, product ? product.id : null, { sku, quantity });
  return true;
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  mergeWishlist,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  trackActivity,
};
