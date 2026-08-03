
const express = require('express');
const {
  getCollections,
  getCollection,
  createCollection,
  updateCollection,
  deleteCollection,
  uploadCollectionImage
} = require('../controllers/collectionController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Routes that only need JSON parsing
router.get('/', getCollections);
router.get('/:id', getCollection);

// Routes that handle file uploads - no JSON middleware
router.post('/', protect, authorize('admin'), uploadCollectionImage, createCollection);
router.put('/:id', protect, authorize('admin'), uploadCollectionImage, updateCollection);
router.delete('/:id', express.json(), protect, authorize('admin'), deleteCollection);

module.exports = router;
