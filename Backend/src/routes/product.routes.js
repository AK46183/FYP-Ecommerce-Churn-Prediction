const express = require('express');
const router = express.Router();
const { authMiddleware, adminMiddleware, optionalAuth } = require('../middlewares/auth.middleware');
const { logProductView } = require('../middlewares/activityLogger.middleware');
const {
  getProducts, getProduct, addProduct, editProduct, removeProduct, categorySummary,
} = require('../controllers/product.controller');

router.get('/', getProducts); // ?search=&category=
router.get('/categories/summary', authMiddleware, adminMiddleware, categorySummary);
router.get('/:id', optionalAuth, logProductView, getProduct);
router.post('/', authMiddleware, adminMiddleware, addProduct);
router.put('/:id', authMiddleware, adminMiddleware, editProduct);
router.patch('/:id', authMiddleware, adminMiddleware, editProduct); // id ya sku
router.delete('/:id', authMiddleware, adminMiddleware, removeProduct);

module.exports = router;