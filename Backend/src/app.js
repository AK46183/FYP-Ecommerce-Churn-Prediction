const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const errorMiddleware = require('./middlewares/error.middleware');
const productRoutes = require('./routes/product.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('FYP backend is running');
});

app.use('/api/auth', authRoutes);

app.use(errorMiddleware);


app.use('/api/products', productRoutes);
module.exports = app;
