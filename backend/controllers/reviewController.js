
const Review = require('../models/Review');
const Product = require('../models/Product');

// @desc    Get all reviews
// @route   GET /reviews
// @access  Public
exports.getReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ approved: true })
      .populate('productId', 'name')
      .populate('userId', 'name email')
      .sort('-createdAt');
    
    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (err) {
    console.error('Get reviews error:', err);
    next(err);
  }
};

// @desc    Get all reviews for admin
// @route   GET /reviews/admin
// @access  Private/Admin
exports.getAdminReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find()
      .populate('productId', 'name')
      .populate('userId', 'name email')
      .sort('-createdAt');
    
    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (err) {
    console.error('Get admin reviews error:', err);
    next(err);
  }
};

// @desc    Get single review
// @route   GET /reviews/:id
// @access  Public
exports.getReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate('productId', 'name')
      .populate('userId', 'name email');
    
    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: review
    });
  } catch (err) {
    console.error('Get review error:', err);
    next(err);
  }
};

// @desc    Create new review
// @route   POST /reviews
// @access  Private
exports.createReview = async (req, res, next) => {
  try {
    const { productId, title, comment, rating, customerName, customerLocation, approved, featured } = req.body;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    const reviewData = {
      productId,
      userId: req.user?.id, // Optional for admin-created reviews
      title,
      comment,
      rating: Number(rating),
      customerName,
      customerLocation,
      approved: approved === 'true' || approved === true,
      featured: featured === 'true' || featured === true
    };

    console.log('Creating review with data:', reviewData);
    const review = await Review.create(reviewData);
    
    res.status(201).json({
      success: true,
      data: review
    });
  } catch (err) {
    console.error('Create review error:', err);
    next(err);
  }
};

// @desc    Update review
// @route   PUT /reviews/:id
// @access  Private/Admin
exports.updateReview = async (req, res, next) => {
  try {
    let review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found'
      });
    }

    const { title, comment, rating, approved, featured, customerName, customerLocation } = req.body;

    const updateData = {
      title,
      comment,
      rating: Number(rating),
      approved: approved === 'true' || approved === true,
      featured: featured === 'true' || featured === true,
      customerName,
      customerLocation
    };

    console.log('Updating review with data:', updateData);
    review = await Review.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: review
    });
  } catch (err) {
    console.error('Update review error:', err);
    next(err);
  }
};

// @desc    Delete review
// @route   DELETE /reviews/:id
// @access  Private/Admin
exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found'
      });
    }
    
    await review.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    console.error('Delete review error:', err);
    next(err);
  }
};
