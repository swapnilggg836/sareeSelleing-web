
const express = require('express');
const {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem
} = require('../controllers/cartController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Add JSON middleware for all cart routes
router.use(express.json());
router.use(protect);

router.get('/', getCart);
router.post('/add', addToCart);
router.put('/:itemId', updateCartItem);
router.delete('/:itemId', removeCartItem);

module.exports = router;
