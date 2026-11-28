// Integration tests: asli Express app HTTP par (routes -> middleware -> controller -> service -> model).
// Database memory mein (tests/helpers/fakeDb.js), Stripe aur email nakli: asli Neon / Atlas / Gmail / Stripe kabhi nahi chhote.
require('./setup');
const { test, describe, before, after, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Email: nakli SMTP transport (asli Gmail tak kuch nahi jata), har email yahan jama
process.env.SMTP_USER = 'test@minaysh.test';
process.env.SMTP_PASS = 'not-a-real-password';
process.env.ADMIN_EMAIL = 'admin@minaysh.test';
const mails = [];
const nodemailer = require('nodemailer');
nodemailer.createTransport = () => ({ sendMail: async (m) => { mails.push(m); return { messageId: `m${mails.length}` }; } });

// MongoDB (activity log, email log, admin inbox): memory mein
const AdminNotification = require('../src/models/mongo/adminNotification.model');
const ActivityLog = require('../src/models/mongo/activityLog.model');
const EmailLog = require('../src/models/mongo/emailLog.model');
const notifications = [];
const mongoSaved = {
  notifCreate: AdminNotification.create, notifUpdate: AdminNotification.updateOne,
  activityCreate: ActivityLog.create, emailLogCreate: EmailLog.create,
};
AdminNotification.create = async (doc) => { notifications.push(doc); return { _id: notifications.length, ...doc }; };
AdminNotification.updateOne = async () => ({});
ActivityLog.create = async () => ({});
EmailLog.create = async () => ({});

const app = require('../src/app');
const payment = require('../src/services/payment.service');
const User = require('../src/models/postgres/user.model');
const Product = require('../src/models/postgres/product.model');
const Order = require('../src/models/postgres/order.model');
const { installFakeDb, restore, rowsOf } = require('./helpers/fakeDb');

/* ------------------------------ Nakli Stripe ------------------------------ */
const realFetch = global.fetch;
const stripe = { sessions: new Map(), calls: [] };
const stripeFetch = async (url, opts = {}) => {
  const u = String(url);
  if (!u.startsWith('https://api.stripe.com/')) return realFetch(url, opts);
  assert.match(opts.headers.authorization, /^Bearer sk_test_/); // hamesha test key
  const path = u.slice('https://api.stripe.com/v1'.length);
  stripe.calls.push({ method: opts.method, path });
  const json = (status, body) => ({ ok: status < 400, status, json: async () => body });
  if (opts.method === 'POST' && path === '/checkout/sessions') {
    const p = new URLSearchParams(opts.body);
    const id = `cs_test_${String(stripe.sessions.size + 1).padStart(12, '0')}`;
    const session = {
      id,
      url: `https://checkout.stripe.com/c/pay/${id}`,
      payment_status: 'unpaid',
      currency: p.get('line_items[0][price_data][currency]'),
      amount_total: Number(p.get('line_items[0][price_data][unit_amount]')),
      metadata: { orderId: p.get('metadata[orderId]'), userId: p.get('metadata[userId]') },
      success_url: p.get('success_url'),
    };
    stripe.sessions.set(id, session);
    return json(200, session);
  }
  const m = path.match(/^\/checkout\/sessions\/(.+)$/);
  if (opts.method === 'GET' && m) {
    const s = stripe.sessions.get(decodeURIComponent(m[1]));
    return s ? json(200, s) : json(404, { error: { message: 'No such checkout.session' } });
  }
  return json(400, { error: { message: `unexpected ${opts.method} ${path}` } });
};

/* ------------------------------ HTTP helper ------------------------------ */
let server;
let base;
const call = async (method, path, { token, body, headers = {}, raw } = {}) => {
  const res = await realFetch(`${base}${path}`, {
    method,
    headers: {
      ...(body !== undefined && !raw && { 'content-type': 'application/json' }),
      ...(token && { authorization: `Bearer ${token}` }),
      ...headers,
    },
    body: raw ?? (body !== undefined ? JSON.stringify(body) : undefined),
  });
  const text = await res.text();
  let json = null;
  try { json = JSON.parse(text); } catch { /* text */ }
  return { status: res.status, body: json, text, headers: res.headers };
};

/** email/notification async chalti hain (intezar nahi hota): thoda waqt do */
const settle = () => new Promise((r) => setTimeout(r, 30));

const checkout = (overrides = {}) => ({
  items: [{ sku: 'MC-1', quantity: 2 }],
  customer: { name: 'Aysha Khan', email: 'aysha@example.com', phone: '0300 1234567', street: '1 Mall Road', city: 'Lahore' },
  delivery: 'standard',
  payment: 'cod',
  ...overrides,
});

const stockOf = (sku) => rowsOf(Product).find((p) => p.sku === sku).stock;
const orderRow = (ref) => rowsOf(Order).find((o) => o.id === Number(String(ref).replace('MN-', '')));
const mailsTo = (to) => mails.filter((m) => m.to === to);

let adminToken;
let ayshaToken;
let sanaToken;

before(async () => {
  installFakeDb();
  global.fetch = stripeFetch;
  process.env.STRIPE_SECRET_KEY = '';
  process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test_integration';

  await Product.create({ sku: 'MC-1', name: 'Rose Lipstick', price: 1500, stock: 10, available: true });
  await Product.create({ sku: 'MC-2', name: 'Glow Serum', price: 3200, stock: 1, available: true });
  await Product.create({ sku: 'MC-3', name: 'Old Blush', price: 900, stock: 4, available: false });
  const admin = await User.create({ name: 'Admin', email: 'admin@minaysh.test', password: await bcrypt.hash('Admin12345', 4), role: 'admin' });
  adminToken = jwt.sign({ id: admin.id, role: 'admin', tv: 0 }, process.env.JWT_SECRET, { expiresIn: '1h' });

  await new Promise((resolve) => { server = app.listen(0, '127.0.0.1', resolve); });
  base = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((r) => server.close(r));
  global.fetch = realFetch;
  restore();
  AdminNotification.create = mongoSaved.notifCreate;
  AdminNotification.updateOne = mongoSaved.notifUpdate;
  ActivityLog.create = mongoSaved.activityCreate;
  EmailLog.create = mongoSaved.emailLogCreate;
  process.env.STRIPE_SECRET_KEY = '';
});

beforeEach(() => {
  mails.length = 0;
  notifications.length = 0;
});

/* ================================================================== */

describe('integration: server basics', () => {
  test('health route answers and security headers are set', async () => {
    const r = await call('GET', '/');
    assert.equal(r.status, 200);
    assert.match(r.text, /running/);
    assert.equal(r.headers.get('x-content-type-options'), 'nosniff');
    assert.equal(r.headers.get('x-powered-by'), null);
  });

  test('protected routes refuse requests without a valid token', async () => {
    assert.equal((await call('GET', '/api/orders')).status, 401);
    assert.equal((await call('GET', '/api/orders', { token: 'not.a.token' })).status, 401);
    assert.equal((await call('GET', '/api/admin/orders')).status, 401);
  });
});

describe('integration: register, login, profile', () => {
  test('register creates the account, sends welcome email and admin alert', async () => {
    const r = await call('POST', '/api/auth/register', { body: { name: 'Aysha Khan', email: 'Aysha@Example.com', password: 'secret123' } });
    assert.equal(r.status, 201);
    assert.equal(r.body.data.email, 'aysha@example.com'); // chhote huroof
    const row = rowsOf(User).find((u) => u.email === 'aysha@example.com');
    assert.notEqual(row.password, 'secret123'); // hash, saaf password nahi
    await settle();
    assert.equal(mailsTo('aysha@example.com').length, 1);
    assert.ok(notifications.some((n) => n.type === 'customer'));
  });

  test('same email cannot register twice; weak password is refused', async () => {
    assert.equal((await call('POST', '/api/auth/register', { body: { name: 'X', email: 'aysha@example.com', password: 'secret123' } })).status, 400);
    assert.equal((await call('POST', '/api/auth/register', { body: { name: 'X', email: 'new@example.com', password: 'short' } })).status, 400);
  });

  test('wrong password is refused, right password gives a working token', async () => {
    assert.equal((await call('POST', '/api/auth/login', { body: { email: 'aysha@example.com', password: 'wrong123' } })).status, 401);
    const r = await call('POST', '/api/auth/login', { body: { email: 'aysha@example.com', password: 'secret123' } });
    assert.equal(r.status, 200);
    ayshaToken = r.body.data.token;
    const me = await call('GET', '/api/auth/me', { token: ayshaToken });
    assert.equal(me.status, 200);
    assert.equal(me.body.data.role, 'customer');

    await call('POST', '/api/auth/register', { body: { name: 'Sana', email: 'sana@example.com', password: 'secret456' } });
    sanaToken = (await call('POST', '/api/auth/login', { body: { email: 'sana@example.com', password: 'secret456' } })).body.data.token;
    assert.ok(sanaToken);
  });

  test('a customer token cannot open admin routes', async () => {
    assert.equal((await call('GET', '/api/admin/orders', { token: ayshaToken })).status, 403);
  });
});

describe('integration: cash on delivery checkout', () => {
  let ref;

  test('order is created, stock goes down, email and admin alert are sent', async () => {
    const r = await call('POST', '/api/orders', { token: ayshaToken, body: checkout() });
    assert.equal(r.status, 201);
    ref = r.body.data.id;
    assert.match(ref, /^MN-\d+$/);
    assert.equal(r.body.data.payment, 'cod');
    assert.equal(r.body.data.paymentStatus, 'none');
    assert.equal(r.body.data.total, 1500 * 2 + 250); // 2 lipstick + standard shipping
    assert.equal(stockOf('MC-1'), 8);

    await settle();
    const m = mailsTo('aysha@example.com');
    assert.equal(m.length, 1);
    assert.match(m[0].subject, /confirmed/);
    assert.match(m[0].html, /Cash on Delivery/);
    assert.ok(notifications.some((n) => n.type === 'order' && n.title.includes(ref)));
  });

  test('customer sees the order in her list and details', async () => {
    const list = await call('GET', '/api/orders', { token: ayshaToken });
    assert.equal(list.status, 200);
    assert.ok(list.body.data.some((o) => o.id === ref));
    const one = await call('GET', `/api/orders/${ref}`, { token: ayshaToken });
    assert.equal(one.status, 200);
    assert.equal(one.body.data.items.length, 1);
  });

  test("another customer cannot see Aysha's order", async () => {
    assert.equal((await call('GET', `/api/orders/${ref}`, { token: sanaToken })).status, 404);
  });

  test('ordering more than the stock is refused and stock is not touched', async () => {
    const r = await call('POST', '/api/orders', { token: ayshaToken, body: checkout({ items: [{ sku: 'MC-2', quantity: 2 }] }) });
    assert.equal(r.status, 400);
    assert.match(r.body.message, /Only 1 left/);
    assert.equal(stockOf('MC-2'), 1);
  });

  test('unavailable product, empty cart and bad phone are refused', async () => {
    assert.equal((await call('POST', '/api/orders', { token: ayshaToken, body: checkout({ items: [{ sku: 'MC-3', quantity: 1 }] }) })).status, 400);
    assert.equal((await call('POST', '/api/orders', { token: ayshaToken, body: checkout({ items: [] }) })).status, 400);
    const bad = checkout();
    bad.customer.phone = '12345';
    assert.equal((await call('POST', '/api/orders', { token: ayshaToken, body: bad })).status, 400);
  });
});

describe('integration: card payment with Stripe switched off', () => {
  test('checkout says card is off and the server refuses a card order', async () => {
    process.env.STRIPE_SECRET_KEY = '';
    const s = await call('GET', '/api/payments/status');
    assert.deepEqual(s.body.data, { card: false, testMode: false });
    const before = rowsOf(Order).length;
    const r = await call('POST', '/api/orders', { token: ayshaToken, body: checkout({ payment: 'card' }) });
    assert.equal(r.status, 400);
    assert.match(r.body.message, /Card payment is not available/);
    assert.equal(rowsOf(Order).length, before); // koi order nahi bana
  });
});

describe('integration: card payment (Stripe test mode)', () => {
  let ref;
  let sessionId;

  before(() => { process.env.STRIPE_SECRET_KEY = 'sk_test_integration_fake'; });
  after(() => { process.env.STRIPE_SECRET_KEY = ''; });

  test('status shows card on in test mode', async () => {
    const s = await call('GET', '/api/payments/status');
    assert.deepEqual(s.body.data, { card: true, testMode: true });
  });

  test('card order is saved unpaid: customer gets "payment pending" email, admin is not alerted yet', async () => {
    const r = await call('POST', '/api/orders', { token: ayshaToken, body: checkout({ payment: 'card', items: [{ sku: 'MC-1', quantity: 1 }] }) });
    assert.equal(r.status, 201);
    ref = r.body.data.id;
    assert.equal(r.body.data.paymentStatus, 'unpaid');
    await settle();
    const m = mailsTo('aysha@example.com');
    assert.equal(m.length, 1);
    assert.match(m[0].subject, /payment pending/);
    assert.match(m[0].html, /Complete payment/);
    assert.match(m[0].html, new RegExp(`/checkout/payment\\?order=${ref}`));
    assert.equal(notifications.filter((n) => n.type === 'order').length, 0);
  });

  test('Stripe page is opened for the exact order amount in PKR', async () => {
    const r = await call('POST', '/api/payments/stripe/session', { token: ayshaToken, body: { orderId: ref } });
    assert.equal(r.status, 200);
    assert.match(r.body.data.url, /^https:\/\/checkout\.stripe\.com\//);
    sessionId = r.body.data.url.split('/').pop();
    const s = stripe.sessions.get(sessionId);
    assert.equal(s.currency, 'pkr');
    assert.equal(s.amount_total, (1500 + 250) * 100);
    assert.equal(orderRow(ref).stripeSessionId, sessionId);
  });

  test('another customer cannot open a payment page for this order', async () => {
    assert.equal((await call('POST', '/api/payments/stripe/session', { token: sanaToken, body: { orderId: ref } })).status, 404);
  });

  test('coming back before paying does not mark the order paid', async () => {
    const r = await call('POST', '/api/payments/stripe/confirm', { token: ayshaToken, body: { sessionId } });
    assert.equal(r.status, 200);
    assert.equal(r.body.data.paid, false);
    assert.equal(orderRow(ref).paymentStatus, 'unpaid');
  });

  test('a fake or malformed session id is refused', async () => {
    assert.equal((await call('POST', '/api/payments/stripe/confirm', { token: ayshaToken, body: { sessionId: 'hello' } })).status, 400);
    assert.equal((await call('POST', '/api/payments/stripe/confirm', { token: ayshaToken, body: { sessionId: 'cs_test_doesnotexist00' } })).status, 502);
  });

  test("Sana cannot confirm Aysha's paid session", async () => {
    stripe.sessions.get(sessionId).payment_status = 'paid';
    assert.equal((await call('POST', '/api/payments/stripe/confirm', { token: sanaToken, body: { sessionId } })).status, 404);
    assert.equal(orderRow(ref).paymentStatus, 'unpaid');
  });

  test('after paying: order is paid, "payment received" email and admin alert go once', async () => {
    const r = await call('POST', '/api/payments/stripe/confirm', { token: ayshaToken, body: { sessionId } });
    assert.equal(r.status, 200);
    assert.deepEqual(r.body.data, { paid: true, order: ref });
    assert.equal(orderRow(ref).paymentStatus, 'paid');
    assert.ok(orderRow(ref).paidAt);
    await settle();
    const m = mailsTo('aysha@example.com');
    assert.equal(m.length, 1);
    assert.match(m[0].subject, /Payment received/);
    assert.match(m[0].html, /Card \(paid\)/);
    assert.equal(notifications.filter((n) => n.type === 'order').length, 1);
  });

  test('confirming again (refresh) does not send the email twice', async () => {
    const r = await call('POST', '/api/payments/stripe/confirm', { token: ayshaToken, body: { sessionId } });
    assert.equal(r.body.data.paid, true);
    await settle();
    assert.equal(mails.length, 0);
    assert.equal(notifications.length, 0);
  });

  test('a paid order cannot be paid again', async () => {
    assert.equal((await call('POST', '/api/payments/stripe/session', { token: ayshaToken, body: { orderId: ref } })).status, 409);
  });

  test('a paid amount that does not match the order is not accepted', async () => {
    const o = await call('POST', '/api/orders', { token: ayshaToken, body: checkout({ payment: 'card', items: [{ sku: 'MC-1', quantity: 1 }] }) });
    const url = (await call('POST', '/api/payments/stripe/session', { token: ayshaToken, body: { orderId: o.body.data.id } })).body.data.url;
    const s = stripe.sessions.get(url.split('/').pop());
    s.payment_status = 'paid';
    s.amount_total = 100; // sirf PKR 1
    const r = await call('POST', '/api/payments/stripe/confirm', { token: ayshaToken, body: { sessionId: s.id } });
    assert.equal(r.body.data.paid, false);
    assert.equal(orderRow(o.body.data.id).paymentStatus, 'unpaid');
  });
});

describe('integration: Stripe webhook', () => {
  let ref;
  let session;

  before(() => { process.env.STRIPE_SECRET_KEY = 'sk_test_integration_fake'; });
  after(() => { process.env.STRIPE_SECRET_KEY = ''; });

  const signed = (payload, secret = process.env.STRIPE_WEBHOOK_SECRET, t = Math.floor(Date.now() / 1000)) => {
    const sig = crypto.createHmac('sha256', secret).update(`${t}.${payload}`).digest('hex');
    return `t=${t},v1=${sig}`;
  };
  const send = (payload, signature) => call('POST', '/api/payments/stripe/webhook', {
    raw: payload, headers: { 'content-type': 'application/json', 'stripe-signature': signature },
  });

  test('setup: an unpaid card order with a Stripe session', async () => {
    const o = await call('POST', '/api/orders', { token: ayshaToken, body: checkout({ payment: 'card', items: [{ sku: 'MC-1', quantity: 1 }] }) });
    ref = o.body.data.id;
    const url = (await call('POST', '/api/payments/stripe/session', { token: ayshaToken, body: { orderId: ref } })).body.data.url;
    session = { ...stripe.sessions.get(url.split('/').pop()), payment_status: 'paid' };
  });

  test('wrong signature, wrong secret and old timestamp are refused', async () => {
    const payload = JSON.stringify({ type: 'checkout.session.completed', data: { object: session } });
    assert.equal((await send(payload, 't=1,v1=abc')).status, 400);
    assert.equal((await send(payload, signed(payload, 'whsec_wrong'))).status, 400);
    assert.equal((await send(payload, signed(payload, undefined, Math.floor(Date.now() / 1000) - 3600))).status, 400);
    assert.equal(orderRow(ref).paymentStatus, 'unpaid');
  });

  test('a correctly signed "completed" event marks the order paid, once', async () => {
    const payload = JSON.stringify({ type: 'checkout.session.completed', data: { object: session } });
    const r = await send(payload, signed(payload));
    assert.equal(r.status, 200);
    assert.equal(orderRow(ref).paymentStatus, 'paid');
    await settle();
    assert.equal(mailsTo('aysha@example.com').length, 1);

    mails.length = 0;
    assert.equal((await send(payload, signed(payload))).status, 200); // Stripe dobara bheje
    await settle();
    assert.equal(mails.length, 0);
  });
});

describe('integration: admin and unpaid card orders', () => {
  let ref;

  before(() => { process.env.STRIPE_SECRET_KEY = 'sk_test_integration_fake'; });
  after(() => { process.env.STRIPE_SECRET_KEY = ''; });

  test('admin sees all orders with their payment status', async () => {
    const o = await call('POST', '/api/orders', { token: sanaToken, body: checkout({ payment: 'card', items: [{ sku: 'MC-1', quantity: 3 }] }) });
    ref = o.body.data.id;
    const r = await call('GET', '/api/admin/orders', { token: adminToken });
    assert.equal(r.status, 200);
    const row = r.body.data.find((x) => `MN-${x.id}` === ref);
    assert.equal(row.payment, 'card');
    assert.equal(row.paymentStatus, 'unpaid');
  });

  test('admin cannot ship an unpaid card order', async () => {
    const r = await call('PATCH', `/api/admin/orders/${orderRow(ref).id}/status`, { token: adminToken, body: { status: 'shipped' } });
    assert.equal(r.status, 400);
    assert.match(r.body.message, /not paid yet/);
    assert.equal(orderRow(ref).status, 'pending');
  });

  test('admin can cancel it: stock comes back and the customer is told', async () => {
    const before = stockOf('MC-1');
    const r = await call('PATCH', `/api/admin/orders/${orderRow(ref).id}/status`, { token: adminToken, body: { status: 'cancelled' } });
    assert.equal(r.status, 200);
    assert.equal(orderRow(ref).status, 'cancelled');
    assert.equal(stockOf('MC-1'), before + 3);
    await settle();
    const m = mailsTo(orderRow(ref).customerEmail); // email order par likhe email par jati hai
    assert.equal(m.length, 1);
    assert.match(m[0].subject, /cancelled/);
    assert.doesNotMatch(m[0].html, /45 minutes/); // admin ka cancel: "payment time khatam" wala text nahi
  });

  test('a cancelled order cannot be paid any more', async () => {
    assert.equal((await call('POST', '/api/payments/stripe/session', { token: sanaToken, body: { orderId: ref } })).status, 400);
  });

  test('COD orders can still be moved forward normally', async () => {
    const o = await call('POST', '/api/orders', { token: sanaToken, body: checkout({ items: [{ sku: 'MC-1', quantity: 1 }] }) });
    const id = orderRow(o.body.data.id).id;
    assert.equal((await call('PATCH', `/api/admin/orders/${id}/status`, { token: adminToken, body: { status: 'shipped' } })).status, 200);
    assert.equal((await call('PATCH', `/api/admin/orders/${id}/status`, { token: adminToken, body: { status: 'nonsense' } })).status, 400);
  });
});

describe('integration: unpaid card orders are cancelled after 45 minutes', () => {
  before(() => { process.env.STRIPE_SECRET_KEY = 'sk_test_integration_fake'; });
  after(() => { process.env.STRIPE_SECRET_KEY = ''; });

  test('old unpaid order is cancelled with the right email; fresh and paid orders are left alone', async () => {
    const old = (await call('POST', '/api/orders', { token: ayshaToken, body: checkout({ payment: 'card', items: [{ sku: 'MC-1', quantity: 2 }] }) })).body.data.id;
    const fresh = (await call('POST', '/api/orders', { token: ayshaToken, body: checkout({ payment: 'card', items: [{ sku: 'MC-1', quantity: 1 }] }) })).body.data.id;
    orderRow(old).createdAt = new Date(Date.now() - 50 * 60 * 1000);
    const stockBefore = stockOf('MC-1');
    mails.length = 0;

    await payment.cancelStaleCardOrders();
    assert.equal(orderRow(old).status, 'cancelled');
    assert.equal(orderRow(fresh).status, 'pending');
    assert.equal(stockOf('MC-1'), stockBefore + 2);

    await settle();
    const m = mailsTo('aysha@example.com');
    assert.equal(m.length, 1);
    assert.match(m[0].subject, /cancelled/);
    assert.match(m[0].html, /not completed within 45 minutes/);
    assert.ok(notifications.some((n) => n.type === 'cancelled' && /45 minutes/.test(n.body)));
    // paid orders (pehle wale) cancel nahi hue
    assert.ok(rowsOf(Order).filter((o) => o.paymentStatus === 'paid').every((o) => o.status !== 'cancelled'));
  });
});
