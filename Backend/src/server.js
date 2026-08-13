
require('./models/postgres/user.model');
require('./models/postgres/category.model');
require('./models/postgres/product.model');

console.log('server.js file is running');
require('dotenv').config();
const app = require('./app');
const { connectPostgres, sequelize } = require('./config/db.postgres');
const connectMongo = require('./config/db.mongo');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectPostgres();
  await connectMongo();
  await sequelize.sync();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
