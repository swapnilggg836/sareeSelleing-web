
const express = require('express');
const { 
  subscribe, 
  getAllSubscribers,
  deleteSubscriber 
} = require('../controllers/newsletterController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/', subscribe);
router.get('/', protect, authorize('admin'), getAllSubscribers);
router.delete('/:id', protect, authorize('admin'), deleteSubscriber);

module.exports = router;
