require('./setup');
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

const { productValidation } = require('../src/validators/product.validator');
const { encrypt, decrypt, isEncrypted } = require('../src/utils/fieldCrypto');

describe('product validation (admin add product)', () => {
  test('a normal product is valid', () => {
    assert.deepEqual(productValidation({ name: 'Vitamin C Serum', price: 2499, stock: 10 }), []);
  });

  test('price can arrive as text from a form', () => {
    assert.deepEqual(productValidation({ name: 'Serum', price: '1200' }), []);
  });

  test('missing name is refused', () => {
    assert.ok(productValidation({ price: 100 }).includes('Product name is required'));
    assert.ok(productValidation({ name: '   ', price: 100 }).includes('Product name is required'));
  });

  for (const price of [undefined, -1, 'abc', '', null]) {
    test(`price ${JSON.stringify(price)} is refused`, () => {
      assert.ok(productValidation({ name: 'Serum', price }).includes('Valid price is required'));
    });
  }

  test('negative or fractional stock is refused', () => {
    assert.ok(productValidation({ name: 'Serum', price: 1, stock: -3 }).length);
    assert.ok(productValidation({ name: 'Serum', price: 1, stock: 1.5 }).length);
  });
});

describe('customer data encryption (phone / address)', () => {
  test('encrypt then decrypt gives back the same text', () => {
    const secret = encrypt('03001234567');
    assert.ok(isEncrypted(secret));
    assert.ok(!secret.includes('03001234567'));
    assert.equal(decrypt(secret), '03001234567');
  });

  test('same value encrypts differently each time (random IV)', () => {
    assert.notEqual(encrypt('Lahore'), encrypt('Lahore'));
  });

  test('tampered data is not decrypted', () => {
    const secret = encrypt('03001234567');
    const tampered = secret.slice(0, -4) + (secret.endsWith('AAAA') ? 'BBBB' : 'AAAA');
    assert.equal(decrypt(tampered), '');
  });

  test('empty and old plain values pass through unchanged', () => {
    assert.equal(encrypt(null), null);
    assert.equal(encrypt(''), '');
    assert.equal(decrypt('plain old value'), 'plain old value');
  });
});
