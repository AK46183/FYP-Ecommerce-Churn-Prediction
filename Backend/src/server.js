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
const { mailStatus } = require('./services/mail.service');
const { ensureDefaultCoupons } = require('./services/coupon.service');
const { startCartReminderTimer } = require('./services/cartReminder.service');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
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
