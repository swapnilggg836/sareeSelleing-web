const Product = require('../models/Product');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const uploadDir = 'uploads/products/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/products/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname))
  }
});

const upload = multer({ 
  storage: storage,
  limits: { 
    fileSize: 10 * 1024 * 1024, // 10MB limit
    fieldSize: 25 * 1024 * 1024 // 25MB for field data (JSON strings)
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// @desc    Get all products
// @route   GET /products
// @access  Public
exports.getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find().populate('collections');
    
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (err) {
    console.error('Get all products error:', err);
    next(err);
  }
};

// @desc    Get single product
// @route   GET /products/:id
// @access  Public
exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('collections');
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: product
    });
  } catch (err) {
    console.error('Get product by ID error:', err);
    next(err);
  }
};

// @desc    Get products by category
// @route   GET /products/category/:category
// @access  Public
exports.getProductsByCategory = async (req, res, next) => {
  try {
    const products = await Product.find({ category: req.params.category }).populate('collections');
    
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (err) {
    console.error('Get products by category error:', err);
    next(err);
  }
};

// @desc    Create new product
// @route   POST /products
// @access  Private/Admin
exports.createProduct = async (req, res, next) => {
  try {
    console.log('=== CREATE PRODUCT DEBUG ===');
    console.log('Request headers:', req.headers);
    console.log('Content-Type:', req.get('Content-Type'));
    console.log('Request body exists:', !!req.body);
    console.log('Request body keys:', req.body ? Object.keys(req.body) : 'no body');
    console.log('Request files exists:', !!req.files);
    console.log('Request files keys:', req.files ? Object.keys(req.files) : 'no files');
    console.log('Full request body:', req.body);
    console.log('Request files:', req.files);

    // Check if this is a multipart form request
    const contentType = req.get('Content-Type');
    if (!contentType || !contentType.includes('multipart/form-data')) {
      return res.status(400).json({
        success: false,
        error: 'Content-Type must be multipart/form-data for file uploads'
      });
    }

    // Check if req.body exists and has data
    if (!req.body || Object.keys(req.body).length === 0) {
      console.error('Request body is empty or undefined');
      return res.status(400).json({
        success: false,
        error: 'Request body is empty. Please provide product data.'
      });
    }

    const {
      name,
      category,
      subcategory,
      price,
      inventory,
      description,
      details,
      careInstructions,
      featured,
      sareeDetails,
      colorVariants,
      existingImages
    } = req.body;

    console.log('Extracted fields:', {
      name,
      category,
      subcategory,
      price,
      inventory,
      description,
      details,
      careInstructions,
      featured,
      sareeDetails,
      colorVariants,
      existingImages
    });

    // Validate required fields
    if (!name || !category || !price || !inventory) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: name, category, price, and inventory are required.'
      });
    }

    // Parse JSON strings
    let parsedSareeDetails = {};
    let parsedColorVariants = [];
    let parsedExistingImages = [];

    try {
      if (sareeDetails) {
        parsedSareeDetails = typeof sareeDetails === 'string' ? JSON.parse(sareeDetails) : sareeDetails;
      }
      if (colorVariants) {
        parsedColorVariants = typeof colorVariants === 'string' ? JSON.parse(colorVariants) : colorVariants;
      }
      if (existingImages) {
        parsedExistingImages = typeof existingImages === 'string' ? JSON.parse(existingImages) : existingImages;
      }
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return res.status(400).json({
        success: false,
        error: 'Invalid JSON format in request data.'
      });
    }

    // Handle main product images
    const productImages = [];
    if (req.files && req.files.productImages) {
      const files = Array.isArray(req.files.productImages) ? req.files.productImages : [req.files.productImages];
      files.forEach(file => {
        productImages.push({
          url: `/uploads/products/${file.filename}`,
          alt: name || 'Product Image'
        });
      });
    }

    // Combine with existing images
    const allImages = [...parsedExistingImages, ...productImages];

    // Handle color variant images
    const processedColorVariants = parsedColorVariants.map((variant, index) => {
      const variantImages = [];
      
      // Check for variant images in req.files
      const variantKey = `variantImages_${index}`;
      if (req.files && req.files[variantKey]) {
        const files = Array.isArray(req.files[variantKey]) ? req.files[variantKey] : [req.files[variantKey]];
        files.forEach(file => {
          variantImages.push(`/uploads/products/${file.filename}`);
        });
      }

      return {
        name: variant.name,
        hex: variant.hex,
        images: variantImages
      };
    });

    const productData = {
      name,
      category,
      subcategory,
      price: parseFloat(price),
      inventory: parseInt(inventory),
      description,
      details,
      careInstructions,
      featured: featured === 'true' || featured === true,
      images: allImages,
      colors: processedColorVariants,
      sareeDetails: parsedSareeDetails
    };

    console.log('Final product data:', productData);

    const product = await Product.create(productData);
    
    res.status(201).json({
      success: true,
      data: product
    });
  } catch (err) {
    console.error('Create product error:', err);
    res.status(500).json({
      success: false,
      error: 'Server error while creating product'
    });
  }
};

// @desc    Update product
// @route   PUT /products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    const {
      name,
      category,
      subcategory,
      price,
      inventory,
      description,
      details,
      careInstructions,
      featured,
      sareeDetails,
      colorVariants,
      existingImages
    } = req.body;

    // Parse JSON strings
    let parsedSareeDetails = {};
    let parsedColorVariants = [];
    let parsedExistingImages = [];

    try {
      if (sareeDetails) {
        parsedSareeDetails = JSON.parse(sareeDetails);
      }
      if (colorVariants) {
        parsedColorVariants = JSON.parse(colorVariants);
      }
      if (existingImages) {
        parsedExistingImages = JSON.parse(existingImages);
      }
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
    }

    // Handle new product images
    const newProductImages = [];
    if (req.files && req.files.productImages) {
      const files = Array.isArray(req.files.productImages) ? req.files.productImages : [req.files.productImages];
      files.forEach(file => {
        newProductImages.push({
          url: `/uploads/products/${file.filename}`,
          alt: name || 'Product Image'
        });
      });
    }

    // Combine existing and new images
    const allImages = [...parsedExistingImages, ...newProductImages];

    // Handle color variant images
    const processedColorVariants = parsedColorVariants.map((variant, index) => {
      const variantImages = [];
      
      // Add existing variant images
      if (variant.existingImages) {
        variantImages.push(...variant.existingImages);
      }

      // Check for new variant images in req.files
      const variantKey = `variantImages_${index}`;
      if (req.files && req.files[variantKey]) {
        const files = Array.isArray(req.files[variantKey]) ? req.files[variantKey] : [req.files[variantKey]];
        files.forEach(file => {
          variantImages.push(`/uploads/products/${file.filename}`);
        });
      }

      return {
        name: variant.name,
        hex: variant.hex,
        images: variantImages
      };
    });

    const updateData = {
      name,
      category,
      subcategory,
      price: parseFloat(price),
      inventory: parseInt(inventory),
      description,
      details,
      careInstructions,
      featured: featured === 'true',
      images: allImages,
      colors: processedColorVariants,
      sareeDetails: parsedSareeDetails
    };

    product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: product
    });
  } catch (err) {
    console.error('Update product error:', err);
    next(err);
  }
};

// @desc    Delete product
// @route   DELETE /products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    
    await product.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    console.error('Delete product error:', err);
    next(err);
  }
};

// @desc    Get featured products
// @route   GET /products/featured
// @access  Public
exports.getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ featured: true }).populate('collections');
    
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (err) {
    console.error('Get featured products error:', err);
    next(err);
  }
};

// @desc    Get products stats
// @route   GET /products/stats
// @access  Private/Admin
exports.getProductStats = async (req, res, next) => {
  try {
    const totalProducts = await Product.countDocuments();
    const featuredProducts = await Product.countDocuments({ featured: true });
    const categories = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    const outOfStock = await Product.countDocuments({ inventory: 0 });
    const lowStock = await Product.countDocuments({ inventory: { $lte: 10, $gt: 0 } });

    res.status(200).json({
      success: true,
      data: {
        totalProducts,
        featuredProducts,
        categories,
        outOfStock,
        lowStock
      }
    });
  } catch (err) {
    console.error('Get product stats error:', err);
    next(err);
  }
};

// Export multer upload middleware with more comprehensive field handling
exports.uploadProductImages = upload.fields([
  { name: 'productImages', maxCount: 10 },
  { name: 'variantImages_0', maxCount: 10 },
  { name: 'variantImages_1', maxCount: 10 },
  { name: 'variantImages_2', maxCount: 10 },
  { name: 'variantImages_3', maxCount: 10 },
  { name: 'variantImages_4', maxCount: 10 },
  { name: 'variantImages_5', maxCount: 10 },
  { name: 'variantImages_6', maxCount: 10 },
  { name: 'variantImages_7', maxCount: 10 },
  { name: 'variantImages_8', maxCount: 10 },
  { name: 'variantImages_9', maxCount: 10 }
]);
