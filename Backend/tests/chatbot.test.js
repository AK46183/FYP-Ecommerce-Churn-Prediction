require('./setup');
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

const { cleanReply, maskSensitive } = require('../src/controllers/chatbot.controller');
const { rateLimit } = require('../src/middlewares/security.middleware');

describe('chatbot reply cleaning', () => {
  test('HTML and script tags are removed from AI replies', () => {
    assert.equal(cleanReply('Hello <script>alert(1)</script><b>there</b>'), 'Hello alert(1)there');
  });

  test('long dashes are replaced', () => {
    assert.equal(cleanReply('Use sunscreen — every day'), 'Use sunscreen, every day');
  });

  test('replies are capped at 4000 characters', () => {
    assert.equal(cleanReply('x'.repeat(5000)).length, 4000);
  });

  test('empty reply is safe', () => {
    assert.equal(cleanReply(undefined), '');
  });
});

describe('sensitive data is hidden before saving chats', () => {
  test('card numbers are hidden', () => {
    assert.equal(maskSensitive('my card is 4111 1111 1111 1111'), 'my card is [hidden number]');
  });

  test('CNIC numbers are hidden', () => {
    assert.equal(maskSensitive('cnic 35202-1234567-1'), 'cnic [hidden CNIC]');
  });

  test('OTP / PIN codes are hidden', () => {
    assert.equal(maskSensitive('otp: 123456'), 'otp [hidden]');
    assert.equal(maskSensitive('my PIN 4321'), 'my PIN [hidden]');
  });

  test('normal skincare questions are not changed', () => {
    const q = 'I am 22 and have oily skin, which serum under 3000?';
    assert.equal(maskSensitive(q), q);
  });
});

describe('rate limiter (stops chat spam)', () => {
  const call = (mw, ip) => {
    const res = { statusCode: 200, headers: {}, setHeader(k, v) { this.headers[k] = v; }, status(c) { this.statusCode = c; return this; }, json() { return this; } };
    let passed = false;
    mw({ ip }, res, () => { passed = true; });
    return { passed, res };
  };

  test('allows up to the limit, then blocks with 429', () => {
    const mw = rateLimit({ name: 'test', windowMs: 60_000, max: 3 });
    assert.equal(call(mw, '1.1.1.1').passed, true);
    assert.equal(call(mw, '1.1.1.1').passed, true);
    assert.equal(call(mw, '1.1.1.1').passed, true);
    const blocked = call(mw, '1.1.1.1');
    assert.equal(blocked.passed, false);
    assert.equal(blocked.res.statusCode, 429);
    assert.ok(blocked.res.headers['Retry-After']);
  });

  test('each IP has its own limit', () => {
    const mw = rateLimit({ name: 'test2', windowMs: 60_000, max: 1 });
    assert.equal(call(mw, '2.2.2.2').passed, true);
    assert.equal(call(mw, '3.3.3.3').passed, true);
    assert.equal(call(mw, '2.2.2.2').passed, false);
  });
});
