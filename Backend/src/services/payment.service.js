// Card payment: Stripe Checkout (Stripe ka apna secure page).
// Card number kabhi hamare server ya database mein nahi aata; Stripe khud leta hai.
//   1) Customer card chunti hai -> order "unpaid" banta hai (stock reserve)
//   2) createSession(): Stripe page ka link -> browser wahan jata hai
//   3) Wapas aane par confirm(): server Stripe se khud poochta hai ke paise aaye -> order "paid"
//      (Deploy ke baad webhook bhi yahi karta hai, agar customer wapas na aaye)
//   4) 45 minute tak payment na ho to order cancel, stock wapas
// Koi npm package nahi: Stripe ki REST API seedha fetch se.
const crypto = require('crypto');
const { Op } = require('sequelize');
const Order = require('../models/postgres/order.model');
const ApiError = require('../utils/ApiError');
const { logActivity } = require('./activityLogger.service');

const STRIPE_API = 'https://api.stripe.com/v1';
const STALE_MINUTES = 45; // itni der unpaid card order -> cancel
const FRONTEND_URL = () => (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, '');

const secretKey = () => (process.env.STRIPE_SECRET_KEY || '').trim();
const isTestKey = () => secretKey().startsWith('sk_test_');
/** Card payment chalu? Sirf test key (FYP); asli key ke liye STRIPE_ALLOW_LIVE=true zaroori */
const isEnabled = () => isTestKey() || (secretKey().startsWith('sk_live_') && process.env.STRIPE_ALLOW_LIVE === 'true');

/** { a: { b: 1 } } -> "a[b]=1" (Stripe form encoding) */
const encode = (obj, prefix = '', out = []) => {
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === null) continue;
    const key = prefix ? `${prefix}[${k}]` : k;
    if (typeof v === 'object') encode(v, key, out);
    else out.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(v))}`);
  }
  return out.join('&');
};

const stripe = async (method, path, body) => {
  if (!isEnabled()) throw new ApiError(503, 'Card payment is not available right now. Please choose cash on delivery.');
  const res = await fetch(`${STRIPE_API}${path}`, {
    method,
    headers: {
      authorization: `Bearer ${secretKey()}`,
      'content-type': 'application/x-www-form-urlencoded',
    },
    body: body ? encode(body) : undefined,
    signal: AbortSignal.timeout(20000),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    console.warn('[stripe]', res.status, data?.error?.code || '', data?.error?.message || '');
    const err = new ApiError(502, 'The payment page could not be opened. Please try again in a moment.');
    err.stripeParam = data?.error?.param || '';
    err.stripeMessage = data?.error?.message || '';
    throw err;
  }
  return data;
};

const parseOrderId = (ref) => {
  const n = Number(String(ref || '').replace(/^MN-/i, ''));
  return Number.isInteger(n) && n > 0 ? n : null;
};

const amountOf = (order) => Math.round(Number(order.totalAmount) * 100); // PKR -> paisa

/** Login customer ka unpaid card order */
const findPayableOrder = async (userId, orderRef) => {
  const id = parseOrderId(orderRef);
  if (!id) throw new ApiError(400, 'A valid order number is required');
  const order = await Order.findOne({ where: { id, userId } });
  if (!order) throw new ApiError(404, 'Order not found');
  if (order.payment !== 'card') throw new ApiError(400, 'This order is cash on delivery');
  if (order.paymentStatus === 'paid') throw new ApiError(409, 'This order is already paid');
  if (order.status === 'cancelled') throw new ApiError(400, 'This order was cancelled. Please place a new order.');
  return order;
};

/** Stripe ka payment page banao, us ka link wapas */
const createSession = async (userId, orderRef) => {
  const order = await findPayableOrder(userId, orderRef);
  const ref = `MN-${order.id}`;
  const body = {
    mode: 'payment',
    // sirf card (Stripe ka naya naam; purana payment_method_types ab band hai)
    allowed_payment_method_types: { 0: 'card' },
    client_reference_id: String(order.id),
    customer_email: order.customerEmail || undefined,
    expires_at: Math.floor(Date.now() / 1000) + 31 * 60, // Stripe: kam az kam 30 minute
    success_url: `${FRONTEND_URL()}/checkout/payment?order=${ref}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${FRONTEND_URL()}/checkout/payment?order=${ref}&cancelled=1`,
    metadata: { orderId: order.id, userId },
    line_items: {
      0: {
        quantity: 1,
        price_data: {
          currency: 'pkr',
          unit_amount: amountOf(order),
          product_data: { name: `MINAYSH order ${ref}` },
        },
      },
    },
  };
  let session;
  try {
    session = await stripe('POST', '/checkout/sessions', body);
  } catch (err) {
    // purane Stripe account par yeh field na ho to dashboard ke default methods (card) se dobara
    if (!/allowed_payment_method_types/.test(`${err.stripeParam} ${err.stripeMessage}`)) throw err;
    delete body.allowed_payment_method_types;
    session = await stripe('POST', '/checkout/sessions', body);
  }
  await order.update({ stripeSessionId: session.id });
  return { url: session.url, order: ref };
};

/** Stripe session sach mein is order ki aur poori paid hai? Phir order paid */
const applySession = async (session, expectUserId = null) => {
  const id = Number(session?.metadata?.orderId);
  if (!id) return { paid: false };
  const order = await Order.findByPk(id);
  if (!order || (expectUserId && order.userId !== expectUserId)) throw new ApiError(404, 'Order not found');
  const ref = `MN-${order.id}`;
  if (order.paymentStatus === 'paid') return { paid: true, order: ref };

  const matches = session.payment_status === 'paid'
    && session.currency === 'pkr'
    && Number(session.amount_total) === amountOf(order)
    && String(session.metadata?.userId) === String(order.userId);
  if (!matches) return { paid: false, order: ref };
  if (order.status === 'cancelled') {
    // payment late aaya, order pehle hi cancel: admin ko refund ke liye pata chale
    console.warn(`[stripe] paid session for cancelled order ${ref}: refund needed`);
    return { paid: false, order: ref, cancelled: true };
  }

  // Sirf ek baar paid (confirm aur webhook saath aayein to email do baar na jaye)
  const [changed] = await Order.update(
    { paymentStatus: 'paid', paidAt: new Date(), stripeSessionId: session.id },
    { where: { id: order.id, paymentStatus: 'unpaid', status: { [Op.ne]: 'cancelled' } } },
  );
  if (!changed) {
    await order.reload();
    return { paid: order.paymentStatus === 'paid', order: ref };
  }
  logActivity(order.userId, 'checkout', null, { orderId: order.id, payment: 'card_paid' });
  // late require: order.service is file ko require nahi karta, phir bhi circular se bachao
  require('./order.service').announcePaidOrder(order.id);
  return { paid: true, order: ref };
};

/** Customer Stripe se wapas aayi: server khud Stripe se check karta hai (browser ki baat par yaqeen nahi) */
const confirm = async (userId, sessionId) => {
  if (typeof sessionId !== 'string' || !/^cs_[A-Za-z0-9_]{10,200}$/.test(sessionId)) {
    throw new ApiError(400, 'Invalid payment session');
  }
  const session = await stripe('GET', `/checkout/sessions/${encodeURIComponent(sessionId)}`);
  return applySession(session, userId);
};

/** Stripe webhook ka signature check (STRIPE_WEBHOOK_SECRET), phir order paid */
const handleWebhook = async (rawBody, signature) => {
  const secret = (process.env.STRIPE_WEBHOOK_SECRET || '').trim();
  if (!secret) throw new ApiError(503, 'Webhook not configured');
  const parts = Object.fromEntries(String(signature || '').split(',').map((kv) => kv.split('=')));
  const t = Number(parts.t);
  if (!t || Math.abs(Date.now() / 1000 - t) > 300) throw new ApiError(400, 'Bad signature');
  const expected = crypto.createHmac('sha256', secret).update(`${t}.${rawBody}`).digest('hex');
  const given = String(signature).split(',').filter((kv) => kv.startsWith('v1=')).map((kv) => kv.slice(3));
  const ok = given.some((g) => g.length === expected.length && crypto.timingSafeEqual(Buffer.from(g), Buffer.from(expected)));
  if (!ok) throw new ApiError(400, 'Bad signature');

  const event = JSON.parse(rawBody);
  if (['checkout.session.completed', 'checkout.session.async_payment_succeeded'].includes(event.type)) {
    await applySession(event.data?.object);
  }
  return true;
};

/** 45 minute se unpaid card orders cancel (stock wapas) */
const cancelStaleCardOrders = async () => {
  const { updateOrderStatus } = require('./order.service');
  const before = new Date(Date.now() - STALE_MINUTES * 60 * 1000);
  const stale = await Order.findAll({
    where: { payment: 'card', paymentStatus: 'unpaid', status: 'pending', createdAt: { [Op.lt]: before } },
    attributes: ['id'],
    limit: 50,
  });
  for (const o of stale) {
    try {
      await updateOrderStatus(o.id, 'cancelled', { reason: 'unpaid' });
    } catch (e) {
      console.warn('[stripe] could not cancel stale order', o.id, e.message);
    }
  }
  return stale.length;
};

const startStalePaymentTimer = () => {
  if (!isEnabled()) return null;
  const run = () => cancelStaleCardOrders().catch((e) => console.warn('[stripe] stale check failed:', e.message));
  setTimeout(run, 60 * 1000);
  return setInterval(run, 10 * 60 * 1000);
};

const status = () => ({ card: isEnabled(), testMode: isTestKey() });

module.exports = {
  isEnabled, status, createSession, confirm, handleWebhook, cancelStaleCardOrders, startStalePaymentTimer,
  encode, applySession,
};
