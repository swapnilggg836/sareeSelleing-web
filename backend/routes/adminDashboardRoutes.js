const express = require('express');
const {
  getSummaryStats,
  getSalesData,
  getProductStats,
  getCategoriesData,
  getRecentOrders
} = require('../controllers/adminDashboardController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/summary', getSummaryStats);
router.get('/sales', getSalesData);
router.get('/products', getProductStats);
router.get('/categories', getCategoriesData);
router.get('/orders', getRecentOrders);

module.exports = router;
