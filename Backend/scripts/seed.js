// Demo data: admin + mukhtalif qisam ke customers aur purani dates wale orders,
// taake churn model Low / Medium / High teeno levels de.
//
// Chalayein:  npm run seed
// Dobara chalane pe pehle se maujood emails skip ho jati hain.
require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, connectPostgres } = require('../src/config/db.postgres');
const User = require('../src/models/postgres/user.model');
const Category = require('../src/models/postgres/category.model');
const Product = require('../src/models/postgres/product.model');
const Order = require('../src/models/postgres/order.model');
const OrderItem = require('../src/models/postgres/orderItem.model');
const { syncDatabase } = require('../src/config/migrate');
require('../src/models/postgres/cart.model');
require('../src/models/postgres/cartItem.model');
require('../src/models/postgres/wishlistItem.model');
require('../src/models/postgres/address.model');
require('../src/models/postgres/coupon.model');

const DAY = 24 * 60 * 60 * 1000;
const daysAgo = (n) => new Date(Date.now() - n * DAY);

const ADMIN = { name: 'Minaysh Admin', email: 'admin@minaysh.pk', password: 'Admin@123' };
const CUSTOMER_PASSWORD = 'Customer@123';

const PRODUCTS = [
  { name: 'Vitamin C Glow Serum', price: 3000, category: 'Skincare' },
  { name: 'Hydra Gel Moisturizer', price: 2500, category: 'Skincare' },
  { name: 'SPF 50 Sun Shield', price: 2200, category: 'Skincare' },
  { name: 'Gentle Foam Face Wash', price: 1400, category: 'Skincare' },
  { name: 'Matte Velvet Lipstick', price: 1500, category: 'Makeup' },
  { name: 'Second Skin Foundation', price: 3400, category: 'Makeup' },
];

// joinedDaysAgo = tenure, orderDays = har order kitne din pehle hua
const CUSTOMERS = [
  // Loyal / low risk
  { name: 'Ayesha Malik', city: 'Lahore', joinedDaysAgo: 720, orderDays: [2, 16, 30, 45, 61, 80, 95, 120, 150, 180, 210, 260, 300, 360], complaint: false },
  { name: 'Sara Khan', city: 'Karachi', joinedDaysAgo: 540, orderDays: [4, 20, 38, 55, 75, 100, 130, 170, 220, 280], complaint: false },
  { name: 'Fatima Noor', city: 'Islamabad', joinedDaysAgo: 600, orderDays: [6, 25, 50, 70, 95, 140, 200, 260, 330, 400, 480], complaint: false },
  { name: 'Hira Qureshi', city: 'Lahore', joinedDaysAgo: 450, orderDays: [3, 21, 40, 66, 90, 130, 190, 250], complaint: false },
  { name: 'Maryam Javed', city: 'Rawalpindi', joinedDaysAgo: 400, orderDays: [8, 30, 60, 95, 140, 200], complaint: false },
  // Medium
  { name: 'Hina Raza', city: 'Faisalabad', joinedDaysAgo: 210, orderDays: [25, 70, 130], complaint: false },
  { name: 'Iqra Shah', city: 'Multan', joinedDaysAgo: 150, orderDays: [20, 90], complaint: false },
  { name: 'Areeba Ali', city: 'Lahore', joinedDaysAgo: 120, orderDays: [15, 60, 100], complaint: false },
  { name: 'Komal Iqbal', city: 'Karachi', joinedDaysAgo: 300, orderDays: [40, 110, 200], complaint: false },
  // High risk
  { name: 'Zainab Tariq', city: 'Lahore', joinedDaysAgo: 45, orderDays: [40], complaint: true },
  { name: 'Mahnoor Aslam', city: 'Islamabad', joinedDaysAgo: 30, orderDays: [28], complaint: true },
  { name: 'Sana Butt', city: 'Karachi', joinedDaysAgo: 20, orderDays: [], complaint: false },
  { name: 'Laiba Hassan', city: 'Multan', joinedDaysAgo: 60, orderDays: [55], complaint: true },
  { name: 'Rabia Anwar', city: 'Faisalabad', joinedDaysAgo: 15, orderDays: [12], complaint: false },
  { name: 'Alina Saeed', city: 'Lahore', joinedDaysAgo: 90, orderDays: [85], complaint: true },
];

const STATUSES_OLD = ['delivered', 'delivered', 'delivered', 'shipped'];

const setCreatedAt = (table, id, date) =>
  sequelize.query(`UPDATE "${table}" SET "createdAt" = :date, "updatedAt" = :date WHERE id = :id`, {
    replacements: { date, id },
  });

const emailFor = (name) => `${name.toLowerCase().replace(/[^a-z]+/g, '.')}@example.com`;

async function seed() {
  await connectPostgres();
  await syncDatabase(sequelize);

  // Categories + products
  const categories = {};
  for (const name of [...new Set(PRODUCTS.map((p) => p.category))]) {
    [categories[name]] = await Category.findOrCreate({ where: { name } });
  }
  const products = [];
  for (const p of PRODUCTS) {
    const [prod] = await Product.findOrCreate({
      where: { name: p.name },
      defaults: { price: p.price, stock: 100, categoryId: categories[p.category].id },
    });
    products.push(prod);
  }
  console.log(`✔ ${products.length} products ready`);

  // Admin
  const [admin, adminCreated] = await User.findOrCreate({
    where: { email: ADMIN.email },
    defaults: { name: ADMIN.name, password: await bcrypt.hash(ADMIN.password, 10), role: 'admin' },
  });
  if (!adminCreated && admin.role !== 'admin') {
    admin.role = 'admin';
    await admin.save();
  }
  console.log(`✔ Admin: ${ADMIN.email} / ${ADMIN.password}`);

  // Customers + orders
  const hash = await bcrypt.hash(CUSTOMER_PASSWORD, 10);
  let created = 0;
  for (let i = 0; i < CUSTOMERS.length; i++) {
    const c = CUSTOMERS[i];
    const email = emailFor(c.name);
    if (await User.findOne({ where: { email } })) continue;

    const user = await User.create({
      name: c.name, email, password: hash, role: 'customer', city: c.city, hasComplaint: c.complaint,
    });
    await setCreatedAt('users', user.id, daysAgo(c.joinedDaysAgo));

    for (let k = 0; k < c.orderDays.length; k++) {
      const d = c.orderDays[k];
      const picks = [products[(i + k) % products.length], products[(i + k + 2) % products.length]];
      const qty = [1, 1 + (k % 2)];
      const total = picks[0].price * qty[0] + picks[1].price * qty[1];

      const status = d <= 3 ? 'processing' : d <= 7 ? 'shipped' : STATUSES_OLD[k % STATUSES_OLD.length];
      const order = await Order.create({
        userId: user.id, totalAmount: total + 250, subtotal: total, shippingFee: 250, status,
        customerName: c.name, customerEmail: email, phone: '03001234567',
        shippingAddress: { street: 'House 1, Main Boulevard', city: c.city, province: 'Punjab', postal: '' },
      });
      for (let j = 0; j < 2; j++) {
        const item = await OrderItem.create({
          orderId: order.id, productId: picks[j].id, quantity: qty[j], price: picks[j].price,
          name: picks[j].name, sku: picks[j].sku,
        });
        await setCreatedAt('order_items', item.id, daysAgo(d));
      }
      await setCreatedAt('orders', order.id, daysAgo(d));
    }
    created++;
  }
  console.log(`✔ ${created} new customers seeded (password: ${CUSTOMER_PASSWORD})`);
  console.log('Next: npm run seed:catalog (512 store products), then npm run dev');

  await sequelize.close();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
