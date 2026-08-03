
const express = require('express');
const {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getProductStats,
  uploadProductImages
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Routes that only need JSON parsing
router.get('/', getAllProducts);
router.get('/featured', getFeaturedProducts);
router.get('/stats', express.json(), protect, authorize('admin'), getProductStats);
router.get('/:id', getProductById);
router.get('/category/:category', getProductsByCategory);

// Test route to debug middleware
router.post('/test', (req, res) => {
  console.log('Test route - Headers:', req.headers);
  console.log('Test route - Body:', req.body);
  console.log('Test route - Files:', req.files);
  res.json({
    success: true,
    message: 'Test route working',
    hasBody: !!req.body,
    bodyKeys: req.body ? Object.keys(req.body) : [],
    hasFiles: !!req.files,
    fileKeys: req.files ? Object.keys(req.files) : []
  });
});

// Routes that handle file uploads - multer will handle the form data parsing
router.post('/', protect, authorize('admin'), uploadProductImages, createProduct);
router.put('/:id', protect, authorize('admin'), uploadProductImages, updateProduct);
router.delete('/:id', express.json(), protect, authorize('admin'), deleteProduct);

module.exports = router;
