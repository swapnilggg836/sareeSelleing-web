
const express = require('express');
const {
  getBanners,
  getBanner,
  createBanner,
  updateBanner,
  deleteBanner,
  uploadBannerImage
} = require('../controllers/bannerController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Routes that only need JSON parsing
router.get('/', getBanners);
router.get('/:id', getBanner);

// Routes that handle file uploads - no JSON middleware
router.post('/', protect, authorize('admin'), uploadBannerImage, createBanner);
router.put('/:id', protect, authorize('admin'), uploadBannerImage, updateBanner);
router.delete('/:id', express.json(), protect, authorize('admin'), deleteBanner);

module.exports = router;
