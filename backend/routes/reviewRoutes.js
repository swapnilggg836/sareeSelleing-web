
const express = require('express');
const {
  getReviews,
  getAdminReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview
} = require('../controllers/reviewController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getReviews);
router.get('/:id', getReview);

// Protected routes
router.post('/', express.json(), protect, createReview);

// Admin routes
router.get('/admin/all', protect, authorize('admin'), getAdminReviews);
router.put('/:id', express.json(), protect, authorize('admin'), updateReview);
router.delete('/:id', express.json(), protect, authorize('admin'), deleteReview);

module.exports = router;
