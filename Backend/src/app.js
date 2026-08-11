const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const errorMiddleware = require('./middlewares/error.middleware');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('FYP backend is running');
});

app.use('/api/auth', authRoutes);

app.use(errorMiddleware);

module.exports = app;