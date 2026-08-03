
const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');

// @desc    Get user wishlist
// @route   GET /wishlist
// @access  Private
exports.getWishlist = async (req, res, next) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user.id })
      .populate('items.product', 'name price images');
    
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user.id, items: [] });
    }
    
    res.status(200).json({
      success: true,
      data: wishlist
    });
  } catch (error) {
    console.error('Get wishlist error:', error);
    next(error);
  }
};

// @desc    Add item to wishlist
// @route   POST /wishlist
// @access  Private
exports.addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;
    
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    
    let wishlist = await Wishlist.findOne({ user: req.user.id });
    
    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: req.user.id,
        items: [{ product: productId }]
      });
    } else {
      const existingItem = wishlist.items.find(
        item => item.product.toString() === productId
      );
      
      if (existingItem) {
        return res.status(400).json({
          success: false,
          error: 'Product already in wishlist'
        });
      }
      
      wishlist.items.push({ product: productId });
      wishlist.updatedAt = Date.now();
      await wishlist.save();
    }
    
    await wishlist.populate('items.product', 'name price images');
    
    res.status(200).json({
      success: true,
      data: wishlist
    });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    next(error);
  }
};

// @desc    Remove item from wishlist
// @route   DELETE /wishlist/:productId
// @access  Private
exports.removeFromWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;
    
    const wishlist = await Wishlist.findOne({ user: req.user.id });
    
    if (!wishlist) {
      return res.status(404).json({
        success: false,
        error: 'Wishlist not found'
      });
    }
    
    wishlist.items = wishlist.items.filter(
      item => item.product.toString() !== productId
    );
    
    wishlist.updatedAt = Date.now();
    await wishlist.save();
    await wishlist.populate('items.product', 'name price images');
    
    res.status(200).json({
      success: true,
      data: wishlist
    });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    next(error);
  }
};

// @desc    Clear wishlist
// @route   DELETE /wishlist
// @access  Private
exports.clearWishlist = async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findOneAndUpdate(
      { user: req.user.id },
      { items: [], updatedAt: Date.now() },
      { new: true }
    );
    
    res.status(200).json({
      success: true,
      data: wishlist
    });
  } catch (error) {
    console.error('Clear wishlist error:', error);
    next(error);
  }
};
