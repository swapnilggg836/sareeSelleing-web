
const express = require('express');
const {
  createOrder,
  getUserOrders,
  getOrder,
  getAllOrders,
  updateOrderStatus,
  trackOrder
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/track', trackOrder);

// Protected routes
router.use(protect);

router
  .route('/')
  .get(getUserOrders)
  .post(createOrder);

router.get('/:id', getOrder);

// Admin routes
router.get('/admin/all', authorize('admin'), getAllOrders);
router.put('/admin/:id', authorize('admin'), updateOrderStatus);

module.exports = router;
