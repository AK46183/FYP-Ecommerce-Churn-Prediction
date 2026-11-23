// Chat -> churn connection ke tests (database ke baghair). Chalayein: npm test
// Models load karne ke liye ek nakli URL (koi connection nahi banta)
process.env.POSTGRES_URI = process.env.POSTGRES_URI || 'postgres://test:test@127.0.0.1:1/test';

const test = require('node:test');
const assert = require('node:assert/strict');
const { buildFeatures } = require('../src/services/churnClient.service');
const { buildSuggestion } = require('../src/services/engagement.service');
const { buildMonthReport } = require('../src/services/churn.service');

const DAY = 24 * 60 * 60 * 1000;
const now = new Date('2026-11-24T12:00:00Z');
const user = { id: 7, name: 'Sara Khan', createdAt: new Date(now - 200 * DAY), hasComplaint: false };
const orders = [{ status: 'delivered', createdAt: new Date(now - 10 * DAY) }];

const features = (over = {}) => ({ tenure_months: 6, order_count: 2, days_since_last_order: 10, complain: 0, ...over });
const chat = (over = {}) => ({ complaints: 0, refundAsks: 0, unanswered: 0, helpbotMessages: 0, skinChats: 0, skinConcerns: [], suggested: [], ...over });

/* ------------------------- complaint -> model feature ------------------------- */

test('chat ki recent complaint model ke "complain" mein jati hai', () => {
  assert.equal(buildFeatures(user, orders, now).complain, 0);
  assert.equal(buildFeatures(user, orders, now, { recentComplaint: true }).complain, 1);
});

test('admin ka hasComplaint flag pehle ki tarah chalta hai', () => {
  assert.equal(buildFeatures({ ...user, hasComplaint: true }, orders, now).complain, 1);
});

test('baaqi 3 features chat se nahi badalte', () => {
  const a = buildFeatures(user, orders, now);
  const b = buildFeatures(user, orders, now, { recentComplaint: true });
  assert.equal(a.tenure_months, b.tenure_months);
  assert.equal(a.order_count, b.order_count);
  assert.equal(a.days_since_last_order, b.days_since_last_order);
});

/* ------------------------- chat -> engagement message ------------------------- */

test('chat complaint: model Low bhi kahe to support message (safety net)', () => {
  const s = buildSuggestion(features({ complain: 1 }), 'Low', 'Sara Khan', chat({ complaints: 1 }));
  assert.equal(s.type, 'support');
  assert.match(s.reason, /complaint in chat/);
  assert.equal(s.coupon.type, 'shipping');
});

test('chat ke baghair Low risk ko kuch nahi jata (pehle jaisa)', () => {
  assert.equal(buildSuggestion(features(), 'Low', 'Sara Khan', chat()).type, null);
  assert.equal(buildSuggestion(features(), 'Low', 'Sara Khan').type, null);
});

test('return / refund poocha: discount se pehle madad', () => {
  const s = buildSuggestion(features(), 'High', 'Sara Khan', chat({ refundAsks: 2 }));
  assert.equal(s.type, 'support');
  assert.match(s.reason, /return or refund/);
  assert.equal(s.coupon, undefined);
});

test('Skin Assistant picks na khareede: unhi par 20% offer (High)', () => {
  const s = buildSuggestion(features({ days_since_last_order: 12 }), 'High', 'Sara Khan', chat({
    suggested: [{ sku: 'ser-01', name: 'Vitamin C Serum' }, { sku: 'sun-01', name: 'SPF 50 Sunscreen' }],
  }));
  assert.equal(s.type, 'discount');
  assert.match(s.message, /Vitamin C Serum and 1 more/);
  assert.equal(s.coupon.value, 20);
});

test('High risk + 30 din se order nahi: "we miss you" pehle aata hai', () => {
  const s = buildSuggestion(features({ days_since_last_order: 35 }), 'High', 'Sara Khan', chat({ suggested: [{ sku: 'x', name: 'Serum' }] }));
  assert.match(s.reason, /No order in 35 days/);
});

test('Medium: picks ka reminder, coupon nahi', () => {
  const s = buildSuggestion(features(), 'Medium', 'Sara Khan', chat({ suggested: [{ sku: 'x', name: 'Night Cream' }] }));
  assert.equal(s.type, 'reminder');
  assert.match(s.message, /Night Cream/);
  assert.equal(s.coupon, undefined);
});

test('Medium: skin concern message mein aata hai', () => {
  const s = buildSuggestion(features(), 'Medium', 'Sara Khan', chat({ skinConcerns: ['acne'] }));
  assert.match(s.message, /new arrivals for acne/);
});

test('chat ke baghair purane rules waise hi', () => {
  const s = buildSuggestion(features({ complain: 1 }), 'High', 'Sara Khan');
  assert.equal(s.reason, 'Raised a complaint recently');
});

/* ------------------------------ admin report ------------------------------ */

test('report mein chat ki wajahen (drivers)', () => {
  const score = (userId, risk, c) => ({
    userId, name: `C ${userId}`, riskLevel: risk, churnProbability: risk === 'High' ? 0.8 : risk === 'Medium' ? 0.3 : 0.05,
    features: features(), stats: { orders: 1, lifetimeValue: 1000 }, chat: c, scoredAt: now,
  });
  const report = buildMonthReport({
    year: 2026,
    monthIndex: 10,
    scores: [
      score(1, 'High', chat({ refundAsks: 1 })),
      score(2, 'High', chat({ unanswered: 2 })),
      score(3, 'Medium', chat({ suggested: [{ sku: 'x', name: 'Serum' }] })),
      score(4, 'Medium', null), // purane scores mein chat nahi hota
      score(5, 'Low', chat({ refundAsks: 1 })), // Low drivers mein nahi ginta
    ],
  });
  const d = Object.fromEntries(report.drivers.map((x) => [x.label, x.value]));
  assert.equal(d['Asked about a return or refund in chat'], 25);
  assert.equal(d['Chat question not answered'], 25);
  assert.equal(d['Liked Skin Assistant picks but did not buy'], 25);
});

test('customer card par chat + cart abandonment jata hai', () => {
  const s = {
    userId: 9, name: 'Zainab Tariq', riskLevel: 'High', churnProbability: 0.9, scoredAt: now,
    features: features({ complain: 1 }), stats: { orders: 0, lifetimeValue: 0 },
    chat: chat({ complaints: 1, suggested: [{ sku: 'x', name: 'Serum' }] }),
  };
  const report = buildMonthReport({ year: 2026, monthIndex: 10, scores: [s], abandonedUserIds: new Set([9]) });
  const card = report.high[0];
  assert.equal(card.chat.complaints, 1);
  assert.equal(card.chat.suggested[0].name, 'Serum');
  assert.equal(card.complain, true);
  assert.equal(card.cartAbandoned, true);
});

test('purane score (chat ke baghair) ka card bhi chalta hai', () => {
  const s = { userId: 3, name: 'Old Score', riskLevel: 'Low', churnProbability: 0.02, scoredAt: now, features: features(), stats: {} };
  const card = buildMonthReport({ year: 2026, monthIndex: 10, scores: [s] }).low[0];
  assert.equal(card.chat, null);
  assert.equal(card.cartAbandoned, false);
});
