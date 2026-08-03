
const express = require('express');
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist
} = require('../controllers/wishlistController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getWishlist)
  .post(addToWishlist)
  .delete(clearWishlist);

router.delete('/:productId', removeFromWishlist);

module.exports = router;
