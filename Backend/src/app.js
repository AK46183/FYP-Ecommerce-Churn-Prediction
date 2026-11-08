const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const cartRoutes = require('./routes/cart.routes');
const orderRoutes = require('./routes/order.routes');
const adminRoutes = require('./routes/admin.routes');
const accountRoutes = require('./routes/account.routes');
const supportRoutes = require('./routes/support.routes');
const couponRoutes = require('./routes/coupon.routes');
const errorMiddleware = require('./middlewares/error.middleware');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('FYP backend is running');
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/account', accountRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api', supportRoutes); // /api/contact, /api/newsletter

app.use(errorMiddleware);

module.exports = app;