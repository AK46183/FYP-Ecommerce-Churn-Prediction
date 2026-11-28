// Help Bot tests: database ke baghair (nakli deps). Chalayein: npm test
const test = require('node:test');
const assert = require('node:assert/strict');
const { createHelpbot, detectIntent, normalize, extractOrderId } = require('../src/services/helpbot.service');

const ORDERS = {
  1: [
    { id: 'MN-12', status: 'Shipped', date: 'Nov 20, 2026', total: 3400, items: [{ name: 'Matte Lipstick', quantity: 2 }] },
    { id: 'MN-9', status: 'Delivered', date: 'Nov 2, 2026', total: 1500, items: [{ name: 'Face Wash', quantity: 1 }] },
  ],
  2: [],
};

const makeBot = (overrides = {}) => {
  const calls = { saved: [], notified: [] };
  const bot = createHelpbot({
    getUserOrders: async (userId) => ORDERS[userId] || [],
    getUserOrderById: async (userId, id) => {
      const o = (ORDERS[userId] || []).find((x) => x.id === `MN-${id}`);
      if (!o) {
        const e = new Error('Order not found');
        e.statusCode = 404;
        throw e;
      }
      return o;
    },
    getUser: async (id) => ({ 1: { id: 1, name: 'Ayesha Malik', email: 'ayesha@example.com' }, 2: { id: 2, name: 'Sara', email: 'sara@example.com' } }[id] || null),
    saveComplaint: async (c) => {
      calls.saved.push(c);
      return { id: 'abc123def456' };
    },
    notifyAdmin: (n) => calls.notified.push(n),
    allowComplaint: () => true,
    ...overrides,
  });
  return { bot, calls };
};

/* ----------------------------- Intent matching ----------------------------- */

test('normalize: lowercase, punctuation aur dohraye huroof', () => {
  assert.equal(normalize('Salaaam!!  Hiii'), 'salam hi');
});

test('order number nikalna', () => {
  assert.equal(extractOrderId('where is MN-12?'), 12);
  assert.equal(extractOrderId('mn 45 kab aye ga'), 45);
  assert.equal(extractOrderId('order #7 status'), 7);
  assert.equal(extractOrderId('I want 2 lipsticks'), null);
});

const cases = [
  ['hello', 'greeting'],
  ['Assalam o alaikum', 'greeting'],
  ['where is my order', 'order_status'],
  ['mera order kahan hai', 'order_status'],
  ['MN-12', 'order_status'],
  ['how much is delivery', 'faq_delivery'],
  ['delivery kitne din mein hoti hai', 'faq_delivery'],
  ['can I get a refund', 'faq_returns'],
  ['exchange kaise karun', 'faq_returns'],
  ['do you have cash on delivery', 'faq_payment'],
  ['I want to cancel my order', 'faq_cancel'],
  ['any discount code', 'faq_offers'],
  ['I forgot my password', 'faq_account'],
  ['my lipstick arrived broken', 'complaint'],
  ['mera order kharab aya hai', 'complaint'],
  ['order nahi mila', 'complaint'],
  ['I want to talk to a real person', 'human_support'],
  ['best serum for oily skin', 'faq_skincare'],
  ['thank you so much', 'thanks'],
  ['asdfgh qwerty', 'fallback'],
  ['this', 'fallback'], // "hi" ko "this" ke andar match nahi hona chahiye
];

for (const [message, expected] of cases) {
  test(`intent: "${message}" -> ${expected}`, () => {
    assert.equal(detectIntent(message).name, expected);
  });
}

/* ------------------------------- FAQ replies ------------------------------- */

test('FAQ ka fixed jawab aur buttons', async () => {
  const { bot } = makeBot();
  const r = await bot.reply({ message: 'delivery charges?' });
  assert.equal(r.intent, 'faq_delivery');
  assert.match(r.reply, /PKR 250/);
  assert.ok(r.quickReplies.length > 0);
});

test('button (intent) seedha jawab deta hai', async () => {
  const { bot } = makeBot();
  const r = await bot.reply({ intent: 'faq_payment' });
  assert.equal(r.intent, 'faq_payment');
  assert.match(r.reply, /Cash on Delivery/);
});

test('samajh na aaye to fallback menu', async () => {
  const { bot } = makeBot();
  const r = await bot.reply({ message: 'blah blah' });
  assert.equal(r.intent, 'fallback');
  assert.ok(r.quickReplies.some((q) => q.intent === 'order_status'));
});

/* ------------------------------ Order status ------------------------------- */

test('guest ko sign in ka kehta hai', async () => {
  const { bot } = makeBot();
  const r = await bot.reply({ message: 'where is my order' });
  assert.match(r.reply, /sign in/i);
  assert.equal(r.links[0].to, '/login');
});

test('login customer: latest orders', async () => {
  const { bot } = makeBot();
  const r = await bot.reply({ message: 'track my order', userId: 1 });
  assert.match(r.reply, /MN-12 is Shipped/);
  assert.equal(r.orders.length, 2);
  assert.equal(r.orders[0].items, 2);
  assert.equal(r.orders[0].phone, undefined); // private data chat mein nahi
});

test('order number se ek order', async () => {
  const { bot } = makeBot();
  const r = await bot.reply({ message: 'status of MN-9', userId: 1 });
  assert.match(r.reply, /MN-9 is Delivered/);
  assert.equal(r.orders.length, 1);
});

test('kisi aur ka order nahi dikhta', async () => {
  const { bot } = makeBot();
  const r = await bot.reply({ message: 'MN-12', userId: 2 });
  assert.match(r.reply, /couldn't find order MN-12/);
  assert.equal(r.orders, undefined);
});

test('koi order nahi', async () => {
  const { bot } = makeBot();
  const r = await bot.reply({ message: 'my order status', userId: 2 });
  assert.match(r.reply, /haven't placed any orders/);
});

/* -------------------------------- Complaint -------------------------------- */

test('complaint (login): order -> details -> save', async () => {
  const { bot, calls } = makeBot();
  let r = await bot.reply({ message: 'my lipstick arrived broken', userId: 1 });
  assert.equal(r.state.step, 'order');
  assert.ok(r.quickReplies.some((q) => q.message === 'MN-12'));

  r = await bot.reply({ message: 'MN-12', state: r.state, userId: 1 });
  assert.equal(r.state.step, 'details');
  assert.equal(r.state.orderRef, 'MN-12');

  r = await bot.reply({ message: 'The cap was cracked and it leaked', state: r.state, userId: 1 });
  assert.equal(r.state, null);
  assert.match(r.ticket, /^C-/);
  assert.equal(calls.saved.length, 1);
  assert.equal(calls.saved[0].orderRef, 'MN-12');
  assert.equal(calls.saved[0].email, 'ayesha@example.com');
  assert.match(calls.saved[0].message, /arrived broken\nThe cap was cracked/);
  assert.equal(calls.notified[0].type, 'complaint');
});

test('complaint (guest): email maangta hai', async () => {
  const { bot, calls } = makeBot();
  let r = await bot.reply({ intent: 'complaint' });
  assert.equal(r.state.step, 'order');
  r = await bot.reply({ message: 'not about an order', state: r.state });
  assert.equal(r.state.step, 'details');
  r = await bot.reply({ message: 'Delivery rider was rude', state: r.state });
  assert.equal(r.state.step, 'email');
  r = await bot.reply({ message: 'not-an-email', state: r.state });
  assert.equal(r.state.step, 'email');
  r = await bot.reply({ message: 'guest@example.com', state: r.state });
  assert.equal(r.state, null);
  assert.equal(calls.saved[0].email, 'guest@example.com');
  assert.equal(calls.saved[0].userId, null);
});

test('complaint mein doosre customer ka order nahi lagta', async () => {
  const { bot } = makeBot();
  let r = await bot.reply({ intent: 'complaint', userId: 2 });
  r = await bot.reply({ message: 'MN-12', state: r.state, userId: 2 });
  assert.equal(r.state.step, 'order');
  assert.match(r.reply, /couldn't find order MN-12/);
});

test('complaint cancel ho sakti hai, "nahi mila" cancel nahi', async () => {
  const { bot, calls } = makeBot();
  let r = await bot.reply({ intent: 'complaint', userId: 1 });
  r = await bot.reply({ message: 'not about an order', state: r.state, userId: 1 });
  const detailsState = r.state;
  r = await bot.reply({ message: 'order nahi mila abhi tak', state: detailsState, userId: 1 });
  assert.equal(r.state, null); // save ho gayi
  assert.equal(calls.saved.length, 1);

  r = await bot.reply({ message: 'cancel', state: detailsState, userId: 1 });
  assert.equal(r.state, null);
  assert.match(r.reply, /cancelled the complaint/);
  assert.equal(calls.saved.length, 1);
});

test('chhedi hui state (galat orderRef) qubool nahi', async () => {
  const { bot, calls } = makeBot();
  await bot.reply({
    message: 'it was broken',
    state: { flow: 'complaint', step: 'details', orderRef: "MN-1'; DROP TABLE" },
    userId: 1,
  });
  assert.equal(calls.saved[0].orderRef, null);
});

test('spam limit', async () => {
  const { bot, calls } = makeBot({ allowComplaint: () => false });
  const r = await bot.reply({ message: 'it leaked badly', state: { flow: 'complaint', step: 'details' }, userId: 1 });
  assert.match(r.reply, /several complaints/);
  assert.equal(calls.saved.length, 0);
});

test('pehle message mein kisi aur ka order number: qubool nahi', async () => {
  const { bot, calls } = makeBot();
  let r = await bot.reply({ message: 'my order MN-12 arrived broken', userId: 2 });
  assert.equal(r.state.step, 'order');
  assert.match(r.reply, /couldn't find order MN-12/);
  r = await bot.reply({ message: 'my order MN-12 arrived broken', userId: 1 }); // apna order: theek
  assert.equal(r.state.step, 'details');
  assert.equal(r.state.orderRef, 'MN-12');
  assert.equal(calls.saved.length, 0);
});

test('browser ki state mein kisi aur ka orderRef: save hone se pehle hat jata hai', async () => {
  const { bot, calls } = makeBot();
  await bot.reply({ message: 'it was broken', state: { flow: 'complaint', step: 'details', orderRef: 'MN-12' }, userId: 2 });
  assert.equal(calls.saved.length, 1);
  assert.equal(calls.saved[0].orderRef, null);
});

test('complaint mein card / CNIC / OTP number save nahi hota', async () => {
  const { bot, calls } = makeBot();
  await bot.reply({
    message: 'paid with 4111 1111 1111 1111, CNIC 35202-1234567-1, otp 482913',
    state: { flow: 'complaint', step: 'details', firstMessage: 'charged twice' },
    userId: 1,
  });
  const saved = calls.saved[0].message;
  assert.doesNotMatch(saved, /4111|35202|482913/);
  assert.match(saved, /\[hidden number\]/);
  assert.match(saved, /\[hidden CNIC\]/);
  assert.doesNotMatch(calls.notified[0].body, /4111|35202|482913/);
});

test('account delete ho chuka ho to crash nahi, email maangta hai', async () => {
  const { bot, calls } = makeBot({ getUser: async () => null });
  let r = await bot.reply({ message: 'lipstick was broken', state: { flow: 'complaint', step: 'details' }, userId: 99 });
  assert.equal(r.state.step, 'email');
  assert.equal(calls.saved.length, 0);
  r = await bot.reply({ message: 'me@example.com', state: r.state });
  assert.equal(r.state, null);
  assert.equal(calls.saved[0].email, 'me@example.com');
});

/* ------------------------ Offer (chatbot-based engagement) ------------------------ */

const OFFER = { code: 'PICKS-AB12', description: '20% off your Skin Assistant picks', expiresAt: new Date('2026-12-01T00:00:00Z') };

test('at-risk customer ko greeting par us ka offer', async () => {
  const seen = [];
  const { bot } = makeBot({ getOffer: async (id) => { seen.push(id); return OFFER; } });
  const r = await bot.reply({ intent: 'greeting', userId: 1 });
  assert.deepEqual(seen, [1]);
  assert.equal(r.offer.code, 'PICKS-AB12');
  assert.equal(r.offer.validUntil, '1 Dec');
  assert.match(r.reply, /special offer/);
});

test('guest ko offer nahi (getOffer call hi nahi hota)', async () => {
  let called = false;
  const { bot } = makeBot({ getOffer: async () => { called = true; return OFFER; } });
  const r = await bot.reply({ intent: 'greeting' });
  assert.equal(called, false);
  assert.equal(r.offer, undefined);
});

test('offer na ho to aam greeting', async () => {
  const { bot } = makeBot({ getOffer: async () => null });
  const r = await bot.reply({ message: 'hello', userId: 2 });
  assert.equal(r.offer, undefined);
  assert.doesNotMatch(r.reply, /special offer/);
});

test('FAQ jawab ke saath offer nahi aata', async () => {
  const { bot } = makeBot({ getOffer: async () => OFFER });
  const r = await bot.reply({ intent: 'faq_delivery', userId: 1 });
  assert.equal(r.offer, undefined);
});
