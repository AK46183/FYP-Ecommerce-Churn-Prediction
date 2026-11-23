require('dotenv').config();
const { sequelize, connectPostgres } = require('../src/config/db.postgres');
const Product = require('../src/models/postgres/product.model');

(async () => {
  await connectPostgres();
  const [n] = await Product.update(
    { available: true, stock: Number(process.env.RESTOCK) || 50 },
    { where: { stock: 0 } }
  );
  console.log(`✔ ${n} products restocked`);
  await sequelize.close();
})().catch((e) => { console.error(e.message); process.exit(1); });