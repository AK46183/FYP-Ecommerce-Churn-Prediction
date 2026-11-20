// Seed ke demo products (jin ka SKU nahi) theek karta hai. Inhein DELETE nahi karte,
// kyun ke demo ke 70 orders inhi products se bane hain (delete karne se orders aur reports toot jate).
// SKU bhi nahi dete, taake yeh website par na aayein (website sirf SKU wale products dikhati hai).
//   - jis ki category nahi (Leather Wallet) use Accessories milti hai  -> "Uncategorised" khatam
//   - brand khali ho to MINAYSH
// Chalao:  node scripts/fix-demo-products.js
require('dotenv').config();
const { sequelize, connectPostgres } = require('../src/config/db.postgres');
const Category = require('../src/models/postgres/category.model');
const Product = require('../src/models/postgres/product.model');

(async () => {
  await connectPostgres();
  const list = await Product.findAll({ where: { sku: null }, order: [['id', 'ASC']] });
  if (!list.length) console.log('Koi bina-SKU product nahi mila. Kuch karne ki zaroorat nahi.');
  const accessories = await Category.findOne({ where: { name: 'Accessories' } });
  for (const p of list) {
    const changes = {};
    if (!p.categoryId && accessories) changes.categoryId = accessories.id;
    if (!p.brand) changes.brand = 'MINAYSH';
    if (Object.keys(changes).length) await p.update(changes);
    console.log(`✔ ${p.name}${changes.categoryId ? ' -> category: Accessories' : ''}${changes.brand ? ' -> brand: MINAYSH' : ''}`);
  }
  await sequelize.close();
})().catch((e) => { console.error(e.message); process.exit(1); });
