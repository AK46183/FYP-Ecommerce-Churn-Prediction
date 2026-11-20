// Purana (plain) personal data encrypt karo: users.phone, addresses (fullName, phone, street, postal),
// orders (phone, shippingAddress). Dobara chalane se kuch nahi bigarta: jo pehle se encrypted hai woh chhoot jata hai.
// Chalao:  node scripts/encrypt-existing-data.js
require('dotenv').config();
const { sequelize } = require('../src/config/db.postgres');
const { syncDatabase } = require('../src/config/migrate');
const { isEncrypted, getKey } = require('../src/utils/fieldCrypto');
const User = require('../src/models/postgres/user.model');
const Address = require('../src/models/postgres/address.model');
const Order = require('../src/models/postgres/order.model');

const JOBS = [
  { model: User, fields: ['phone'] },
  { model: Address, fields: ['fullName', 'phone', 'street', 'postal'] },
  { model: Order, fields: ['phone'], address: 'shippingAddress' },
];

(async () => {
  try {
    getKey();
    await sequelize.authenticate();
    await syncDatabase(sequelize); // columns ko TEXT banata hai
    for (const { model, fields, address } of JOBS) {
      const rows = await model.findAll();
      let done = 0;
      for (const row of rows) {
        let changed = false;
        for (const f of fields) {
          const raw = row.getDataValue(f);
          if (raw && !isEncrypted(raw)) {
            row.set(f, raw); // setter encrypt karta hai
            changed = true;
          }
        }
        if (address) {
          const raw = row.getDataValue(address);
          if (raw && typeof raw === 'object' && !raw.enc) {
            row.set(address, raw);
            row.changed(address, true);
            changed = true;
          }
        }
        if (changed) {
          await row.save({ silent: true, hooks: false, validate: false });
          done += 1;
        }
      }
      console.log(`${model.getTableName()}: ${done} of ${rows.length} rows encrypted`);
    }
    console.log('Done. Personal data ab encrypted hai.');
    process.exit(0);
  } catch (err) {
    console.error('Encryption failed:', err.message);
    process.exit(1);
  }
})();
