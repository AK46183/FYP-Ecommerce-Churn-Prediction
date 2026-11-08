// Frontend ke saare products (data/catalog.json) database mein daalta / update karta hai.
// Chalayein:  npm run seed:catalog
// Dobara chalana safe hai: price/naam update hote hain, STOCK nahi chheda jata
// (naye products ko default stock milta hai).
//
// Frontend mein products badlein to pehle catalog dobara banayein (minaysh frontend folder se):
//   node scripts/export-catalog.mjs ../Backend/data/catalog.json
require('dotenv').config();
const path = require('path');
const fs = require('fs');
const { sequelize, connectPostgres } = require('../src/config/db.postgres');
const { syncDatabase } = require('../src/config/migrate');
const Category = require('../src/models/postgres/category.model');
const Product = require('../src/models/postgres/product.model');
require('../src/models/postgres/user.model');
require('../src/models/postgres/order.model');
require('../src/models/postgres/orderItem.model');
require('../src/models/postgres/cart.model');
require('../src/models/postgres/cartItem.model');
require('../src/models/postgres/wishlistItem.model');
require('../src/models/postgres/address.model');
require('../src/models/postgres/coupon.model');

const DEFAULT_STOCK = Number(process.env.SEED_STOCK) || 50;

const CATEGORY_NAMES = {
  skinCare: 'Skincare',
  sunCare: 'Sun Care',
  makeup: 'Makeup',
  hair: 'Hair',
  fragrances: 'Fragrances',
  accessories: 'Accessories',
};

async function run() {
  const file = path.join(__dirname, '..', 'data', 'catalog.json');
  if (!fs.existsSync(file)) throw new Error(`${file} nahi mili`);
  const catalog = JSON.parse(fs.readFileSync(file, 'utf8'));

  await connectPostgres();
  await syncDatabase(sequelize);

  // Categories
  const categoryIds = {};
  for (const key of [...new Set(catalog.map((p) => p.category).filter(Boolean))]) {
    const name = CATEGORY_NAMES[key] || key;
    const [cat] = await Category.findOrCreate({ where: { name } });
    categoryIds[key] = cat.id;
  }

  const rows = catalog
    .filter((p) => p.sku && p.name && p.price > 0)
    .map((p) => ({
      sku: p.sku,
      name: p.name.slice(0, 255),
      brand: p.brand,
      subCategory: p.subCategory,
      productType: p.productType,
      price: p.price,
      oldPrice: p.oldPrice,
      imageUrl: p.image,
      badge: p.badge,
      available: p.available,
      variants: p.variants || [],
      categoryId: categoryIds[p.category] || null,
      stock: p.available ? DEFAULT_STOCK : 0, // sirf NAYE products pe lagta hai
    }));

  const before = await Product.count({ where: { sku: rows.map((r) => r.sku) } });

  // 100-100 ke batch: naya ho to insert, pehle se ho to update (stock chhod kar)
  for (let i = 0; i < rows.length; i += 100) {
    await Product.bulkCreate(rows.slice(i, i + 100), {
      conflictAttributes: ['sku'],
      updateOnDuplicate: [
        'name', 'brand', 'subCategory', 'productType', 'price', 'oldPrice',
        'imageUrl', 'badge', 'available', 'variants', 'categoryId', 'updatedAt',
      ],
    });
    process.stdout.write(`\r  ${Math.min(i + 100, rows.length)}/${rows.length}`);
  }

  console.log(`\n✔ Catalog synced: ${rows.length} products (${rows.length - before} new, ${before} updated)`);
  console.log(`✔ Categories: ${Object.keys(categoryIds).map((k) => CATEGORY_NAMES[k] || k).join(', ')}`);
  await sequelize.close();
}

run().catch((err) => {
  console.error('\nCatalog seed failed:', err.message);
  process.exit(1);
});
