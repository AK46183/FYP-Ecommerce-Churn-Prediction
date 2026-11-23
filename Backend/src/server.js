require('dotenv').config();

require('./models/postgres/user.model');
require('./models/postgres/category.model');
require('./models/postgres/product.model');
require('./models/postgres/cart.model');
require('./models/postgres/cartItem.model');
require('./models/postgres/order.model');
require('./models/postgres/orderItem.model');
require('./models/postgres/wishlistItem.model');
require('./models/postgres/address.model');
require('./models/postgres/coupon.model');

const app = require('./app');
const { connectPostgres, sequelize } = require('./config/db.postgres');
const connectMongo = require('./config/db.mongo');
const { syncDatabase } = require('./config/migrate');
const { getKey } = require('./utils/fieldCrypto');
const { mailStatus } = require('./services/mail.service');
const { ensureDefaultCoupons } = require('./services/coupon.service');
const { startCartReminderTimer } = require('./services/cartReminder.service');

const PORT = process.env.PORT || 5000;

// Zaroori secrets ke baghair server shuru hi na ho (warna tokens kamzor ya fail)
const checkSecrets = () => {
  const secret = process.env.JWT_SECRET || '';
  if (secret.length < 32) {
    throw new Error('JWT_SECRET .env mein kam az kam 32 characters ka hona chahiye. Bana lein: node -e "console.log(require(\'crypto\').randomBytes(48).toString(\'hex\'))"');
  }
  getKey(); // DATA_ENCRYPTION_KEY: na ho to server shuru nahi hota (phone / address encryption)
  if (!process.env.CORS_ORIGINS) console.warn('CORS_ORIGINS set nahi: sirf localhost:5173 allowed hai.');
  if (!process.env.SKINCARE_SERVICE_KEY) console.warn('SKINCARE_SERVICE_KEY set nahi: skincare-ai service bina key ke chal rahi hai.');
};

const startServer = async () => {
  checkSecrets();
  await connectPostgres();
  await connectMongo();
  await syncDatabase(sequelize);
  await ensureDefaultCoupons();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Email: ${mailStatus()}`);
    startCartReminderTimer();
  });
};

startServer().catch((error) => {
  console.error('Server start failed:', error.message);
  process.exit(1);
});
