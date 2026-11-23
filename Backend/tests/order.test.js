require('./setup');
const { test, describe, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');

const { sequelize } = require('../src/config/db.postgres');
const Cart = require('../src/models/postgres/cart.model');
const CartItem = require('../src/models/postgres/cartItem.model');
const Order = require('../src/models/postgres/order.model');
const OrderItem = require('../src/models/postgres/orderItem.model');
const Product = require('../src/models/postgres/product.model');
const orderService = require('../src/services/order.service');
const { bundleDeal } = require('../src/services/bundleDeal.service');
const { orderStatusValidation } = require('../src/validators/order.validator');

const goodCheckout = () => ({
  items: [{ sku: 'MC-1', quantity: 1 }],
  customer: { name: 'Aysha', email: 'aysha@example.com', phone: '0300 1234567', street: '1 Mall Road', city: 'Lahore' },
  delivery: 'standard',
  payment: 'cod',
});

describe('quantity rules', () => {
  test('accepts whole numbers from 1 to 20', () => {
    assert.equal(orderService.parseQuantity(1), 1);
    assert.equal(orderService.parseQuantity('3'), 3);
    assert.equal(orderService.parseQuantity(20), 20);
  });

  for (const bad of [-5, 0, 2.5, 21, 'abc', null, undefined]) {
    test(`rejects ${String(bad)}`, () => {
      assert.throws(() => orderService.parseQuantity(bad), (e) => e.statusCode === 400);
    });
  }

  test('addToCart refuses a negative quantity before touching the database', async () => {
    await assert.rejects(orderService.addToCart(1, 5, -5), (e) => e.statusCode === 400);
  });
});

describe('website checkout validation', () => {
  test('a complete checkout has no errors and the phone is cleaned', () => {
    const { errors, phone } = orderService.validateCheckout(goodCheckout());
    assert.deepEqual(errors, []);
    assert.equal(phone, '03001234567');
  });

  test('empty cart is refused', () => {
    const { errors } = orderService.validateCheckout({ ...goodCheckout(), items: [] });
    assert.ok(errors.includes('Cart is empty'));
  });

  test('negative or too large quantity is refused', () => {
    for (const quantity of [-1, 0, 21]) {
      const { errors } = orderService.validateCheckout({ ...goodCheckout(), items: [{ sku: 'MC-1', quantity }] });
      assert.ok(errors.length > 0, `quantity ${quantity} should fail`);
    }
  });

  test('non-Pakistani phone number is refused', () => {
    const p = goodCheckout();
    p.customer.phone = '12345';
    assert.match(orderService.validateCheckout(p).errors[0], /Pakistani mobile/);
  });

  test('unknown delivery or payment type is refused', () => {
    assert.ok(orderService.validateCheckout({ ...goodCheckout(), delivery: 'drone' }).errors.length);
    assert.ok(orderService.validateCheckout({ ...goodCheckout(), payment: 'bitcoin' }).errors.length);
  });
});

describe('variant prices', () => {
  const product = {
    price: 1000,
    variants: [{ label: '30ml', size: '30ml', price: 1000 }, { label: '50ml', size: '50ml', price: 1500 }],
  };

  test('uses the variant price when the variant has one', () => {
    assert.equal(orderService.resolvePrice(product, null, '50ml'), 1500);
  });

  test('falls back to the main price for an unknown variant', () => {
    assert.equal(orderService.resolvePrice(product, 'Unknown', null), 1000);
  });

  test('single-variant products always use the main (admin) price', () => {
    assert.equal(orderService.resolvePrice({ price: 900, variants: [{ label: 'x', price: 5 }] }, 'x'), 900);
  });
});

describe('bundle deal (PKR 1,000 off per 3 different products)', () => {
  const line = (id, price, quantity = 1) => ({ product: { id }, price, quantity });

  test('3 different products over PKR 3,000 get PKR 1,000 off', () => {
    assert.deepEqual(bundleDeal([line(1, 1200), line(2, 1200), line(3, 1200)]), { bundles: 1, discount: 1000 });
  });

  test('3 units of the same product do not count', () => {
    assert.equal(bundleDeal([line(1, 1500, 3)]).discount, 0);
  });

  test('cheap bundles under PKR 3,000 do not count', () => {
    assert.equal(bundleDeal([line(1, 500), line(2, 500), line(3, 500)]).discount, 0);
  });

  test('6 different products over PKR 6,000 get 2 bundles', () => {
    const lines = [1, 2, 3, 4, 5, 6].map((id) => line(id, 1100));
    assert.deepEqual(bundleDeal(lines), { bundles: 2, discount: 2000 });
  });
});

describe('admin order status', () => {
  test('only known statuses are accepted', () => {
    assert.deepEqual(orderStatusValidation({ status: 'Shipped' }), []);
    assert.ok(orderStatusValidation({ status: 'stolen' }).length);
    assert.ok(orderStatusValidation({}).length);
  });
});

/* ------- Purana cart checkout (POST /api/orders/checkout): database stub ke saath ------- */
describe('legacy cart checkout (placeOrder)', () => {
  const saved = {};
  let state;

  beforeEach(() => {
    state = {
      products: [
        { id: 1, sku: 'A', name: 'Serum', price: 1000, stock: 5, available: true, imageUrl: 'a.png' },
        { id: 2, sku: 'B', name: 'Cream', price: 500, stock: 1, available: true, imageUrl: 'b.png' },
      ],
      cartItems: [],
      orders: [],
      orderItems: [],
      decrements: [],
      cartCleared: false,
    };
    Object.assign(saved, {
      transaction: sequelize.transaction,
      cartFindOne: Cart.findOne,
      cartItemFindAll: CartItem.findAll,
      cartItemDestroy: CartItem.destroy,
      productFindAll: Product.findAll,
      productDecrement: Product.decrement,
      orderCreate: Order.create,
      orderItemCreate: OrderItem.create,
    });
    sequelize.transaction = async (fn) => fn({ LOCK: { UPDATE: 'UPDATE' } });
    Cart.findOne = async () => ({ id: 10, userId: 1 });
    CartItem.findAll = async () => state.cartItems;
    CartItem.destroy = async () => { state.cartCleared = true; };
    Product.findAll = async ({ where }) => state.products.filter((p) => where.id.includes(p.id));
    Product.decrement = async (field, { by, where }) => { state.decrements.push({ id: where.id, by }); };
    Order.create = async (data) => { const o = { id: 77, ...data }; state.orders.push(o); return o; };
    OrderItem.create = async (data) => { state.orderItems.push(data); return data; };
  });

  afterEach(() => {
    sequelize.transaction = saved.transaction;
    Cart.findOne = saved.cartFindOne;
    CartItem.findAll = saved.cartItemFindAll;
    CartItem.destroy = saved.cartItemDestroy;
    Product.findAll = saved.productFindAll;
    Product.decrement = saved.productDecrement;
    Order.create = saved.orderCreate;
    OrderItem.create = saved.orderItemCreate;
  });

  test('empty cart is refused', async () => {
    await assert.rejects(orderService.placeOrder(1), /Cart is empty/);
    assert.equal(state.orders.length, 0);
  });

  test('a negative quantity already in the cart cannot create an order', async () => {
    state.cartItems = [{ productId: 1, quantity: -5 }];
    await assert.rejects(orderService.placeOrder(1), (e) => e.statusCode === 400);
    assert.equal(state.orders.length, 0);
    assert.equal(state.decrements.length, 0);
  });

  test('ordering more than the stock is refused', async () => {
    state.cartItems = [{ productId: 2, quantity: 2 }]; // stock sirf 1
    await assert.rejects(orderService.placeOrder(1), /Only 1 left of Cream/);
    assert.equal(state.orders.length, 0);
  });

  test('a good order has the right total, reduces stock and empties the cart', async () => {
    state.cartItems = [{ productId: 1, quantity: 2 }, { productId: 2, quantity: 1 }];
    const order = await orderService.placeOrder(1);
    assert.equal(order.totalAmount, 2500);
    assert.equal(state.orderItems.length, 2);
    assert.deepEqual(state.decrements, [{ id: 1, by: 2 }, { id: 2, by: 1 }]);
    assert.equal(state.cartCleared, true);
  });
});
