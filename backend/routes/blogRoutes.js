
const express = require('express');
const {
  getBlogPosts,
  getBlogPost,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  uploadBlogImage
} = require('../controllers/blogController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Routes that only need JSON parsing
router.get('/', getBlogPosts);
router.get('/:id', getBlogPost);

// Routes that handle file uploads - no JSON middleware (handled by multer)
router.post('/', protect, authorize('admin'), uploadBlogImage, createBlogPost);
router.put('/:id', protect, authorize('admin'), uploadBlogImage, updateBlogPost);
router.delete('/:id', express.json(), protect, authorize('admin'), deleteBlogPost);

module.exports = router;
