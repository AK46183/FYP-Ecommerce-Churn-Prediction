const express = require('express');
const cors = require('cors');
const { securityHeaders, corsOptions, limits } = require('./middlewares/security.middleware');

const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const cartRoutes = require('./routes/cart.routes');
const orderRoutes = require('./routes/order.routes');
const adminRoutes = require('./routes/admin.routes');
const accountRoutes = require('./routes/account.routes');
const supportRoutes = require('./routes/support.routes');
const couponRoutes = require('./routes/coupon.routes');
const chatbotRoutes = require('./routes/chatbot.routes');
const errorMiddleware = require('./middlewares/error.middleware');

// Compression: JSON / HTML gzip karke bhejo (products ki list ~5-8 guna chhoti). Package na ho to server phir bhi chale.
let compression = null;
try {
  compression = require('compression');
} catch {
  console.warn('compression package nahi mila: Backend folder mein "npm install compression" chalayein.');
}

const app = express();

// Proxy (Vite / Cloudflare tunnel / hosting) ke peeche asal IP pehchanne ke liye (rate limits isi par chalti hain)
app.set('trust proxy', process.env.TRUST_PROXY ? Number(process.env.TRUST_PROXY) || process.env.TRUST_PROXY : 'loopback');
app.disable('x-powered-by');
app.use(securityHeaders);
if (compression) app.use(compression({ threshold: 1024 }));
app.use(cors(corsOptions));
app.use('/api', limits.api);
// chatbot: tasveer (selfie) ke liye bara body, is liye aam express.json se pehle
app.use('/api/chatbot', express.json({ limit: '6mb' }), chatbotRoutes);
app.use(express.json({ limit: '200kb' }));

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