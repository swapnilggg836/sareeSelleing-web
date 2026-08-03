
const Newsletter = require('../models/Newsletter');

// @desc    Subscribe email to newsletter
// @route   POST /api/newsletter
// @access  Public
exports.subscribe = async (req, res, next) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Please provide an email'
      });
    }
    
    // Check if email already exists
    const existingSubscriber = await Newsletter.findOne({ email });
    
    if (existingSubscriber) {
      return res.status(400).json({
        success: false,
        error: 'Email already subscribed'
      });
    }
    
    const subscriber = await Newsletter.create({
      email
    });
    
    res.status(201).json({
      success: true,
      data: subscriber
    });
  } catch (err) {
    console.error('Newsletter subscription error:', err);
    next(err);
  }
};

// @desc    Get all newsletter subscribers
// @route   GET /api/newsletter
// @access  Private/Admin
exports.getAllSubscribers = async (req, res, next) => {
  try {
    const subscribers = await Newsletter.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: subscribers.length,
      data: subscribers
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete newsletter subscriber
// @route   DELETE /api/newsletter/:id
// @access  Private/Admin
exports.deleteSubscriber = async (req, res, next) => {
  try {
    const subscriber = await Newsletter.findById(req.params.id);
    
    if (!subscriber) {
      return res.status(404).json({
        success: false,
        error: 'Subscriber not found'
      });
    }
    
    await subscriber.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};
