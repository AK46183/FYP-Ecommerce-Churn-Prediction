const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const { addItem, viewCart, deleteItem } = require('../controllers/cart.controller');

router.use(authMiddleware);
router.post('/', addItem);
router.get('/', viewCart);
router.delete('/:itemId', deleteItem);

module.exports = router;