// Discount codes: check karna, discount nikalna, istemal count karna, aur personal codes banana
const crypto = require('crypto');
const { Op } = require('sequelize');
const Coupon = require('../models/postgres/coupon.model');
const Order = require('../models/postgres/order.model');
const ApiError = require('../utils/ApiError');

const TYPES = ['percent', 'fixed', 'shipping'];

const normalize = (code) => String(code || '').trim().toUpperCase().replace(/\s+/g, '');

const describe = (c) => {
  const min = c.minOrder > 0 ? ` on orders over PKR ${Math.round(c.minOrder).toLocaleString('en-PK')}` : '';
  if (c.type === 'percent') return `${c.value}% off${min}`;
  if (c.type === 'fixed') return `PKR ${Math.round(c.value).toLocaleString('en-PK')} off${min}`;
  return `Free delivery${min}`;
};

/** Discount kitna banta hai (shipping coupon delivery fee ke barabar) */
const discountFor = (coupon, subtotal, shippingFee = 0) => {
  if (coupon.type === 'percent') return Math.min(subtotal, Math.round((subtotal * coupon.value) / 100));
  if (coupon.type === 'fixed') return Math.min(subtotal, Math.round(coupon.value));
  if (coupon.type === 'shipping') return Math.round(shippingFee);
  return 0;
};

/**
 * Code check karo. Theek ho to { coupon, discount, description }, warna ApiError(400).
 * options.transaction: order ke andar use ho to lock ke saath
 */
const evaluate = async (code, { userId = null, subtotal = 0, shippingFee = 0, transaction } = {}) => {
  const clean = normalize(code);
  if (!clean) throw new ApiError(400, 'Enter a coupon code');

  const coupon = await Coupon.findOne({
    where: { code: clean },
    ...(transaction && { transaction, lock: transaction.LOCK.UPDATE }),
  });
  if (!coupon || !coupon.active) throw new ApiError(400, 'This code is not valid');
  if (coupon.expiresAt && coupon.expiresAt < new Date()) throw new ApiError(400, 'This code has expired');
  if (coupon.userId) {
    if (!userId) throw new ApiError(400, 'Please sign in to use this code');
    if (coupon.userId !== userId) throw new ApiError(400, 'This code belongs to another account');
  }
  if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) throw new ApiError(400, 'This code has already been used');
  if (subtotal < (coupon.minOrder || 0)) {
    throw new ApiError(400, `Add PKR ${Math.round(coupon.minOrder - subtotal).toLocaleString('en-PK')} more to use this code`);
  }
  // Public code: ek customer ek hi dafa
  if (userId && !coupon.userId) {
    const used = await Order.count({ where: { userId, couponCode: clean, status: { [Op.ne]: 'cancelled' } }, transaction });
    if (used > 0) throw new ApiError(400, 'You have already used this code');
  }

  const discount = discountFor(coupon, subtotal, shippingFee);
  return { coupon, code: clean, discount, type: coupon.type, description: coupon.description || describe(coupon) };
};

const redeem = (coupon, transaction) => coupon.increment('usedCount', { by: 1, transaction });

/* -------------------------- Personal codes --------------------------- */

const randomPart = () => crypto.randomBytes(3).toString('hex').toUpperCase().slice(0, 5);

/** Churn engagement ke liye ek customer ka apna code (ek dafa, X din) */
const createPersonalCoupon = async ({ userId, prefix, type, value, minOrder = 0, days = 7, description }) => {
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = `${prefix}-${randomPart()}`;
    try {
      return await Coupon.create({
        code,
        type,
        value,
        minOrder,
        maxUses: 1,
        userId,
        expiresAt: new Date(Date.now() + days * 24 * 60 * 60 * 1000),
        source: 'engagement',
        description,
      });
    } catch (error) {
      if (error.name !== 'SequelizeUniqueConstraintError') throw error;
    }
  }
  throw new ApiError(500, 'Could not create a coupon code');
};

/* -------------------------------- Admin ------------------------------- */

const validateAdminInput = (data, partial = false) => {
  const out = {};
  if (!partial || data.code !== undefined) {
    out.code = normalize(data.code);
    if (!/^[A-Z0-9-]{3,30}$/.test(out.code)) throw new ApiError(400, 'Code must be 3-30 letters, numbers or dashes');
  }
  if (!partial || data.type !== undefined) {
    if (!TYPES.includes(data.type)) throw new ApiError(400, 'Type must be percent, fixed or shipping');
    out.type = data.type;
  }
  if (!partial || data.value !== undefined) {
    const v = Number(data.value ?? 0);
    const type = out.type || data.type;
    if (type !== 'shipping' && !(v > 0)) throw new ApiError(400, 'Discount value must be greater than 0');
    if (type === 'percent' && v > 90) throw new ApiError(400, 'Percent discount cannot be more than 90%');
    out.value = v;
  }
  if (data.minOrder !== undefined) out.minOrder = Math.max(0, Number(data.minOrder) || 0);
  if (data.maxUses !== undefined) out.maxUses = data.maxUses === '' || data.maxUses === null ? null : Math.max(1, Number(data.maxUses));
  if (data.expiresAt !== undefined) out.expiresAt = data.expiresAt ? new Date(data.expiresAt) : null;
  if (data.active !== undefined) out.active = Boolean(data.active);
  if (data.description !== undefined) out.description = String(data.description).slice(0, 200);
  return out;
};

const listCoupons = async ({ includePersonal = false } = {}) => {
  const where = includePersonal ? {} : { userId: null };
  const rows = await Coupon.findAll({ where, order: [['createdAt', 'DESC']], limit: 300 });
  return rows.map((c) => ({ ...c.toJSON(), label: c.description || describe(c) }));
};

const createCoupon = async (data) => {
  const values = validateAdminInput(data);
  if (await Coupon.findOne({ where: { code: values.code } })) throw new ApiError(400, 'This code already exists');
  return Coupon.create({ ...values, source: 'admin' });
};

const updateCoupon = async (id, data) => {
  const coupon = await Coupon.findByPk(id);
  if (!coupon) throw new ApiError(404, 'Coupon not found');
  const values = validateAdminInput({ type: coupon.type, ...data }, true);
  delete values.code; // code badalna allowed nahi
  await coupon.update(values);
  return coupon;
};

/** Server start pe: ek public welcome code hamesha mojood ho */
const ensureDefaultCoupons = async () => {
  await Coupon.findOrCreate({
    where: { code: 'WELCOME10' },
    defaults: { type: 'percent', value: 10, minOrder: 2000, source: 'system', description: '10% off your order over PKR 2,000' },
  });
};

module.exports = {
  normalize,
  describe,
  discountFor,
  evaluate,
  redeem,
  createPersonalCoupon,
  listCoupons,
  createCoupon,
  updateCoupon,
  ensureDefaultCoupons,
  TYPES,
};
