const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/auth.middleware');
const { logProductView } = require('../middlewares/activityLogger.middleware');
const {
  getProducts, getProduct, addProduct, editProduct, removeProduct,
} = require('../controllers/product.controller');

router.get('/', getProducts);
router.get('/:id', authMiddleware, logProductView, getProduct);
router.post('/', addProduct);
router.put('/:id', editProduct);
router.delete('/:id', removeProduct);

module.exports = router;