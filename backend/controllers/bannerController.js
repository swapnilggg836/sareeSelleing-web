
const Banner = require('../models/Banner');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/banners/')
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

// @desc    Get all banners
// @route   GET /banners
// @access  Public
exports.getBanners = async (req, res, next) => {
  try {
    const banners = await Banner.find({ active: true });
    
    res.status(200).json({
      success: true,
      count: banners.length,
      data: banners
    });
  } catch (err) {
    console.error('Get banners error:', err);
    next(err);
  }
};

// @desc    Get single banner
// @route   GET /banners/:id
// @access  Public
exports.getBanner = async (req, res, next) => {
  try {
    const banner = await Banner.findById(req.params.id);
    
    if (!banner) {
      return res.status(404).json({
        success: false,
        error: 'Banner not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: banner
    });
  } catch (err) {
    console.error('Get banner error:', err);
    next(err);
  }
};

// @desc    Create new banner
// @route   POST /banners
// @access  Private/Admin
exports.createBanner = async (req, res, next) => {
  try {
    const { title, subtitle, position, active } = req.body;

    let imageUrl = '';
    if (req.file) {
      imageUrl = `/uploads/banners/${req.file.filename}`;
    }

    const bannerData = {
      title,
      subtitle,
      position,
      active: active === 'true',
      image: imageUrl
    };

    const banner = await Banner.create(bannerData);
    
    res.status(201).json({
      success: true,
      data: banner
    });
  } catch (err) {
    console.error('Create banner error:', err);
    next(err);
  }
};

// @desc    Update banner
// @route   PUT /banners/:id
// @access  Private/Admin
exports.updateBanner = async (req, res, next) => {
  try {
    let banner = await Banner.findById(req.params.id);
    
    if (!banner) {
      return res.status(404).json({
        success: false,
        error: 'Banner not found'
      });
    }

    const { title, subtitle, position, active } = req.body;

    const updateData = {
      title,
      subtitle,
      position,
      active: active === 'true'
    };

    if (req.file) {
      updateData.image = `/uploads/banners/${req.file.filename}`;
    }

    banner = await Banner.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: banner
    });
  } catch (err) {
    console.error('Update banner error:', err);
    next(err);
  }
};

// @desc    Delete banner
// @route   DELETE /banners/:id
// @access  Private/Admin
exports.deleteBanner = async (req, res, next) => {
  try {
    const banner = await Banner.findById(req.params.id);
    
    if (!banner) {
      return res.status(404).json({
        success: false,
        error: 'Banner not found'
      });
    }
    
    await banner.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    console.error('Delete banner error:', err);
    next(err);
  }
};

exports.uploadBannerImage = upload.single('image');
