
const express = require('express');
const {
  getSales,
  getSale,
  createSale,
  updateSale,
  deleteSale
} = require('../controllers/saleController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Routes that only need JSON parsing
router.get('/', getSales);
router.get('/:id', getSale);

// Routes that need JSON parsing and authentication
router.post('/', express.json(), protect, authorize('admin'), createSale);
router.put('/:id', express.json(), protect, authorize('admin'), updateSale);
router.delete('/:id', express.json(), protect, authorize('admin'), deleteSale);

module.exports = router;
