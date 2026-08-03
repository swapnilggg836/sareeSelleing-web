const Collection = require('../models/Collection');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/collections/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname))
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// @desc    Get all collections
// @route   GET /collections
// @access  Public
exports.getCollections = async (req, res, next) => {
  try {
    const collections = await Collection.find().populate('products');
    
    res.status(200).json({
      success: true,
      count: collections.length,
      data: collections
    });
  } catch (err) {
    console.error('Get collections error:', err);
    next(err);
  }
};

// @desc    Get single collection
// @route   GET /collections/:id
// @access  Public
exports.getCollection = async (req, res, next) => {
  try {
    const collection = await Collection.findById(req.params.id).populate('products');
    
    if (!collection) {
      return res.status(404).json({
        success: false,
        error: 'Collection not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: collection
    });
  } catch (err) {
    console.error('Get collection error:', err);
    next(err);
  }
};

// @desc    Create new collection
// @route   POST /collections
// @access  Private/Admin
exports.createCollection = async (req, res, next) => {
  try {
    console.log('Creating collection with data:', req.body);
    console.log('File:', req.file);

    const { name, description, featured } = req.body;

    let imageUrl = '';
    if (req.file) {
      imageUrl = `/uploads/collections/${req.file.filename}`;
    }

    let productIds = [];
    if (req.body.products) {
      // Could be an array or CSV
      if (Array.isArray(req.body.products)) {
        productIds = req.body.products;
      } else if (typeof req.body.products === 'string') {
        productIds = req.body.products.split(',').map(id => id.trim());
      }
    }

    const collectionData = {
      name,
      description,
      featured: featured === 'true' || featured === true,
      image: imageUrl,
      products: productIds
    };

    const collection = await Collection.create(collectionData);
    
    res.status(201).json({
      success: true,
      data: await collection.populate('products')
    });
  } catch (err) {
    console.error('Create collection error:', err);
    next(err);
  }
};

// @desc    Update collection
// @route   PUT /collections/:id
// @access  Private/Admin
exports.updateCollection = async (req, res, next) => {
  try {
    let collection = await Collection.findById(req.params.id);
    
    if (!collection) {
      return res.status(404).json({
        success: false,
        error: 'Collection not found'
      });
    }

    const { name, description, featured } = req.body;

    const updateData = {
      name,
      description,
      featured: featured === 'true' || featured === true
    };

    // Update image if new file is uploaded
    if (req.file) {
      updateData.image = `/uploads/collections/${req.file.filename}`;
    }

    // Handle products update
    let productIds = [];
    if (req.body.products) {
      if (Array.isArray(req.body.products)) {
        productIds = req.body.products;
      } else if (typeof req.body.products === 'string') {
        productIds = req.body.products.split(',').map(id => id.trim());
      }
      updateData.products = productIds;
    }

    collection = await Collection.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    }).populate('products');
    
    res.status(200).json({
      success: true,
      data: collection
    });
  } catch (err) {
    console.error('Update collection error:', err);
    next(err);
  }
};

// @desc    Delete collection
// @route   DELETE /collections/:id
// @access  Private/Admin
exports.deleteCollection = async (req, res, next) => {
  try {
    const collection = await Collection.findById(req.params.id);
    
    if (!collection) {
      return res.status(404).json({
        success: false,
        error: 'Collection not found'
      });
    }
    
    await collection.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    console.error('Delete collection error:', err);
    next(err);
  }
};

// Export multer upload middleware
exports.uploadCollectionImage = upload.single('image');
