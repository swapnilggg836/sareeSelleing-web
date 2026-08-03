
const express = require('express');
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
  cleanupOrphanedReferences
} = require('../controllers/categoryController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Routes that only need JSON parsing
router.get('/', getCategories);
router.get('/:id', getCategory);

// Routes that handle file uploads - no JSON middleware (handled by multer)
router.post('/', protect, authorize('admin'), uploadCategoryImage, createCategory);
router.put('/:id', protect, authorize('admin'), uploadCategoryImage, updateCategory);
router.delete('/:id', express.json(), protect, authorize('admin'), deleteCategory);

// Cleanup route for orphaned image references
router.post('/cleanup', express.json(), protect, authorize('admin'), cleanupOrphanedReferences);

module.exports = router;
