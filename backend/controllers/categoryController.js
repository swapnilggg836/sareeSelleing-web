
const Category = require('../models/Category');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = 'uploads/categories/';
    // Ensure directory exists
    try {
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
    } catch (e) {}
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname))
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Helper function to check if image file exists and clean up database if not
const getValidImagePath = (imagePath) => {
  if (!imagePath) return '';
  
  const fullPath = path.join(__dirname, '..', imagePath);
  if (fs.existsSync(fullPath)) {
    return imagePath;
  }
  
  // If file doesn't exist, log warning and return empty string
  console.warn(`Image file not found: ${fullPath}`);
  return '';
};

// Helper function to clean up orphaned image references
const cleanupOrphanedImages = async () => {
  try {
    const categories = await Category.find();
    let updatedCount = 0;
    
    for (const category of categories) {
      if (category.image) {
        const fullPath = path.join(__dirname, '..', category.image);
        if (!fs.existsSync(fullPath)) {
          console.log(`Cleaning up orphaned image reference for category ${category.name}: ${category.image}`);
          category.image = '';
          await category.save();
          updatedCount++;
        }
      }
    }
    
    if (updatedCount > 0) {
      console.log(`Cleaned up ${updatedCount} orphaned image references`);
    }
  } catch (error) {
    console.error('Error cleaning up orphaned images:', error);
  }
};

// @desc    Get all categories
// @route   GET /categories
// @access  Public
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ active: true });
    
    // Validate image paths for all categories
    const validatedCategories = categories.map(category => {
      const categoryObj = category.toObject();
      categoryObj.image = getValidImagePath(categoryObj.image);
      return categoryObj;
    });
    
    res.status(200).json({
      success: true,
      count: validatedCategories.length,
      data: validatedCategories
    });
  } catch (err) {
    console.error('Get categories error:', err);
    next(err);
  }
};

// @desc    Get single category
// @route   GET /categories/:id
// @access  Public
exports.getCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }
    
    const categoryObj = category.toObject();
    categoryObj.image = getValidImagePath(categoryObj.image);
    
    res.status(200).json({
      success: true,
      data: categoryObj
    });
  } catch (err) {
    console.error('Get category error:', err);
    next(err);
  }
};

// @desc    Create new category
// @route   POST /categories
// @access  Private/Admin
exports.createCategory = async (req, res, next) => {
  try {
    const { name, description, parentCategory, featured, active } = req.body;

    let imageUrl = '';
    if (req.file) {
      imageUrl = `/uploads/categories/${req.file.filename}`;
      console.log(`Category image uploaded: ${imageUrl}`);
    }

    const categoryData = {
      name,
      description,
      parentCategory: parentCategory || null,
      featured: featured === 'true',
      active: active === 'true',
      image: imageUrl
    };

    const category = await Category.create(categoryData);
    console.log(`Category created successfully: ${category.name}`);
    
    res.status(201).json({
      success: true,
      data: category
    });
  } catch (err) {
    console.error('Create category error:', err);
    next(err);
  }
};

// @desc    Update category
// @route   PUT /categories/:id
// @access  Private/Admin
exports.updateCategory = async (req, res, next) => {
  try {
    let category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }

    const { name, description, parentCategory, featured, active } = req.body;

    const updateData = {
      name,
      description,
      parentCategory: parentCategory || null,
      featured: featured === 'true',
      active: active === 'true'
    };

    if (req.file) {
      // Clean up old image if it exists
      if (category.image) {
        const oldImagePath = path.join(__dirname, '..', category.image);
        if (fs.existsSync(oldImagePath)) {
          try {
            fs.unlinkSync(oldImagePath);
            console.log(`Deleted old image: ${oldImagePath}`);
          } catch (err) {
            console.warn('Failed to delete old image file:', err);
          }
        }
      }
      
      updateData.image = `/uploads/categories/${req.file.filename}`;
      console.log(`Category image updated: ${updateData.image}`);
    }

    category = await Category.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });
    
    console.log(`Category updated successfully: ${category.name}`);
    
    res.status(200).json({
      success: true,
      data: category
    });
  } catch (err) {
    console.error('Update category error:', err);
    next(err);
  }
};

// @desc    Delete category
// @route   DELETE /categories/:id
// @access  Private/Admin
exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }
    
    // Clean up image file if it exists
    if (category.image) {
      const imagePath = path.join(__dirname, '..', category.image);
      if (fs.existsSync(imagePath)) {
        try {
          fs.unlinkSync(imagePath);
          console.log(`Deleted image file: ${imagePath}`);
        } catch (err) {
          console.warn('Failed to delete image file:', err);
        }
      }
    }
    
    await category.deleteOne();
    console.log(`Category deleted successfully: ${category.name}`);
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    console.error('Delete category error:', err);
    next(err);
  }
};

// @desc    Clean up orphaned image references
// @route   POST /categories/cleanup
// @access  Private/Admin
exports.cleanupOrphanedReferences = async (req, res, next) => {
  try {
    await cleanupOrphanedImages();
    res.status(200).json({
      success: true,
      message: 'Orphaned image references cleaned up successfully'
    });
  } catch (err) {
    console.error('Cleanup error:', err);
    next(err);
  }
};

exports.uploadCategoryImage = upload.single('image');
