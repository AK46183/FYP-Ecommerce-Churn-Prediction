require('./setup');
const { test, describe, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require('../src/models/postgres/user.model');
const { authMiddleware, adminMiddleware, optionalAuth } = require('../src/middlewares/auth.middleware');
const authService = require('../src/services/auth.service');
const { registerValidation, loginValidation, passwordProblem } = require('../src/validators/auth.validator');

const realFindByPk = User.findByPk;
afterEach(() => { User.findByPk = realFindByPk; });

const sign = (payload, opts = { expiresIn: '1h' }) => jwt.sign(payload, process.env.JWT_SECRET, opts);

/** Chhota fake Express req/res */
const run = async (mw, token) => {
  const req = { headers: token ? { authorization: `Bearer ${token}` } : {} };
  const res = { statusCode: 200, body: null, status(c) { this.statusCode = c; return this; }, json(b) { this.body = b; return this; } };
  let nextCalled = false;
  let nextErr;
  await mw(req, res, (err) => { nextCalled = true; nextErr = err; });
  return { req, res, nextCalled, nextErr };
};

/** Database mein yeh user hai (findByPk stub) */
const dbHas = (user) => { User.findByPk = async (id) => (user && Number(id) === user.id ? user : null); };

describe('auth validators', () => {
  test('password rules: 8+ chars, a letter and a number', () => {
    assert.equal(passwordProblem('abc12345'), null);
    assert.match(passwordProblem('short1'), /at least 8/);
    assert.match(passwordProblem('onlyletters'), /letter and one number/);
    assert.match(passwordProblem('12345678'), /letter and one number/);
    assert.match(passwordProblem('a1'.repeat(70)), /too long/);
    assert.ok(passwordProblem(undefined));
  });

  test('register needs name, valid email and strong password', () => {
    assert.deepEqual(registerValidation({ name: 'Aysha', email: 'aysha@example.com', password: 'secret123' }), []);
    const errors = registerValidation({ name: '  ', email: 'not-an-email', password: 'x' });
    assert.equal(errors.length, 3);
    assert.ok(registerValidation({}).includes('Email is required'));
  });

  test('login needs email and password', () => {
    assert.deepEqual(loginValidation({ email: 'a@b.com', password: 'anything' }), []);
    assert.equal(loginValidation({}).length, 2);
  });
});

describe('authMiddleware', () => {
  test('rejects a request with no token', async () => {
    const { res, nextCalled } = await run(authMiddleware);
    assert.equal(res.statusCode, 401);
    assert.equal(nextCalled, false);
  });

  test('rejects a forged token (wrong secret)', async () => {
    dbHas({ id: 1, role: 'customer', tokenVersion: 0 });
    const forged = jwt.sign({ id: 1, role: 'admin', tv: 0 }, 'some-other-secret');
    const { res } = await run(authMiddleware, forged);
    assert.equal(res.statusCode, 401);
  });

  test('rejects an expired token', async () => {
    dbHas({ id: 1, role: 'customer', tokenVersion: 0 });
    const expired = sign({ id: 1, role: 'customer', tv: 0, exp: Math.floor(Date.now() / 1000) - 60 }, {});
    const { res } = await run(authMiddleware, expired);
    assert.equal(res.statusCode, 401);
  });

  test('accepts a valid token and sets req.user', async () => {
    dbHas({ id: 7, role: 'customer', tokenVersion: 0 });
    const { req, nextCalled } = await run(authMiddleware, sign({ id: 7, role: 'customer', tv: 0 }));
    assert.equal(nextCalled, true);
    assert.deepEqual(req.user, { id: 7, role: 'customer' });
  });

  test('old tokens without a version still work for users who never changed password', async () => {
    dbHas({ id: 7, role: 'customer', tokenVersion: 0 });
    const { nextCalled } = await run(authMiddleware, sign({ id: 7, role: 'customer' }));
    assert.equal(nextCalled, true);
  });

  test('role comes from the database, not the token (demoted admin loses access)', async () => {
    dbHas({ id: 3, role: 'customer', tokenVersion: 0 }); // pehle admin tha, ab customer
    const { req, nextCalled } = await run(authMiddleware, sign({ id: 3, role: 'admin', tv: 0 }));
    assert.equal(nextCalled, true);
    assert.equal(req.user.role, 'customer');

    const res = { statusCode: 200, status(c) { this.statusCode = c; return this; }, json() { return this; } };
    let passed = false;
    adminMiddleware(req, res, () => { passed = true; });
    assert.equal(passed, false);
    assert.equal(res.statusCode, 403);
  });

  test('token of a deleted user is rejected', async () => {
    dbHas(null);
    const { res } = await run(authMiddleware, sign({ id: 99, role: 'customer', tv: 0 }));
    assert.equal(res.statusCode, 401);
  });

  test('token is rejected after the password version changes', async () => {
    dbHas({ id: 5, role: 'customer', tokenVersion: 2 });
    const { res } = await run(authMiddleware, sign({ id: 5, role: 'customer', tv: 1 }));
    assert.equal(res.statusCode, 401);
  });

  test('a database error becomes a server error, not a fake 401', async () => {
    User.findByPk = async () => { throw new Error('db down'); };
    const { nextErr, res } = await run(authMiddleware, sign({ id: 5, role: 'customer', tv: 0 }));
    assert.ok(nextErr instanceof Error);
    assert.equal(res.statusCode, 200); // response abhi bheja nahi, error middleware bhejega
  });
});

describe('optionalAuth', () => {
  test('bad token -> continues as guest', async () => {
    const { req, nextCalled } = await run(optionalAuth, 'garbage.token.here');
    assert.equal(nextCalled, true);
    assert.equal(req.user, undefined);
  });

  test('good token -> sets the user', async () => {
    dbHas({ id: 8, role: 'customer', tokenVersion: 0 });
    const { req } = await run(optionalAuth, sign({ id: 8, role: 'customer', tv: 0 }));
    assert.equal(req.user.id, 8);
  });
});

describe('changePassword logs out other devices', () => {
  const makeUser = async () => ({
    id: 11,
    role: 'customer',
    tokenVersion: 0,
    password: await bcrypt.hash('oldpass123', 4),
    saved: 0,
    async save() { this.saved += 1; },
  });

  test('wrong current password is refused', async () => {
    const user = await makeUser();
    dbHas(user);
    await assert.rejects(
      authService.changePassword(11, { currentPassword: 'nope1234', newPassword: 'newpass123' }),
      /Current password is incorrect/
    );
    assert.equal(user.tokenVersion, 0);
  });

  test('old token stops working, new token works', async () => {
    const user = await makeUser();
    dbHas(user);
    const oldToken = sign({ id: 11, role: 'customer', tv: 0 });

    const result = await authService.changePassword(11, { currentPassword: 'oldpass123', newPassword: 'newpass123' });
    assert.equal(user.tokenVersion, 1);
    assert.equal(user.saved, 1);
    assert.ok(await bcrypt.compare('newpass123', user.password));
    assert.ok(result.token);

    const before = await run(authMiddleware, oldToken);
    assert.equal(before.res.statusCode, 401);
    const after = await run(authMiddleware, result.token);
    assert.equal(after.nextCalled, true);
  });
});
