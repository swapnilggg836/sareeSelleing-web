const User = require('../models/User');
const path = require('path');
const fs = require('fs');

// @desc    Register user
// @route   POST /auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    console.log('Register - Request body:', req.body);
    console.log('Register - Content-Type:', req.headers['content-type']);
    
    if (!req.body) {
      return res.status(400).json({
        success: false,
        error: 'Request body is missing'
      });
    }
    
    const { name, email, password, phone } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Name, email, and password are required'
      });
    }
    
    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        error: 'Email already registered'
      });
    }
    
    // Create user
    const user = await User.create({
      name,
      email,
      password,
      phone
    });
    
    sendTokenResponse(user, 201, res);
  } catch (err) {
    console.error('Register error:', err);
    next(err);
  }
};

// @desc    Login user
// @route   POST /auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    console.log('Login - Request body:', req.body);
    console.log('Login - Content-Type:', req.headers['content-type']);
    console.log('Login - Raw body exists:', !!req.body);
    
    if (!req.body) {
      return res.status(400).json({
        success: false,
        error: 'Request body is missing'
      });
    }
    
    const { email, password } = req.body;
    
    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide email and password'
      });
    }
    
    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }
    
    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }
    
    sendTokenResponse(user, 200, res);
  } catch (err) {
    console.error('Login error:', err);
    next(err);
  }
};

// @desc    Get current logged in user
// @route   GET /auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update user profile
// @route   PUT /auth/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone
    };
    
    // Handle profile image upload
    if (req.file) {
      // Delete old profile image if exists
      if (req.user.profileImage) {
        const oldImagePath = path.join(__dirname, '../uploads', req.user.profileImage);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      
      fieldsToUpdate.profileImage = req.file.filename;
    }
    
    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
};

// Helper function to send token response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();
  
  // Remove password from response
  const userResponse = {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    profileImage: user.profileImage,
    role: user.role
  };
  
  res.status(statusCode).json({
    success: true,
    token,
    user: userResponse
  });
};
