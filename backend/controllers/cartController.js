
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Get user cart
// @route   GET /cart
// @access  Private
exports.getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate({
      path: 'items.product',
      select: 'name images'
    });
    
    if (!cart) {
      // Create empty cart if none exists
      cart = await Cart.create({
        user: req.user.id,
        items: []
      });
    }
    
    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Add item to cart
// @route   POST /cart/add
// @access  Private
exports.addToCart = async (req, res, next) => {
  try {
    console.log('Add to cart request body:', req.body);
    console.log('User:', req.user.id);
    
    const { productId, quantity, color } = req.body;
    
    if (!productId || !quantity) {
      return res.status(400).json({
        success: false,
        error: 'Product ID and quantity are required'
      });
    }
    
    // Validate product exists
    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    
    let cart = await Cart.findOne({ user: req.user.id });
    
    if (!cart) {
      // Create new cart if none exists
      cart = await Cart.create({
        user: req.user.id,
        items: []
      });
    }
    
    // Check if item already exists in cart
    const itemIndex = cart.items.findIndex(
      item => item.product.toString() === productId && item.color === color
    );
    
    if (itemIndex > -1) {
      // Update quantity if item exists
      cart.items[itemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({
        product: productId,
        quantity,
        color,
        price: product.price
      });
    }
    
    await cart.save();
    
    // Return updated cart with product details
    cart = await Cart.findById(cart._id).populate({
      path: 'items.product',
      select: 'name images'
    });
    
    console.log('Cart updated successfully:', cart);
    
    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (err) {
    console.error('Add to cart error:', err);
    next(err);
  }
};

// @desc    Update cart item
// @route   PUT /cart/:itemId
// @access  Private
exports.updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user.id });
    
    if (!cart) {
      return res.status(404).json({
        success: false,
        error: 'Cart not found'
      });
    }
    
    // Find item in cart
    const itemIndex = cart.items.findIndex(
      item => item._id.toString() === req.params.itemId
    );
    
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Item not found in cart'
      });
    }
    
    // Update quantity
    cart.items[itemIndex].quantity = quantity;
    
    await cart.save();
    
    // Return updated cart with product details
    const updatedCart = await Cart.findById(cart._id).populate({
      path: 'items.product',
      select: 'name images'
    });
    
    res.status(200).json({
      success: true,
      data: updatedCart
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Remove item from cart
// @route   DELETE /cart/:itemId
// @access  Private
exports.removeCartItem = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    
    if (!cart) {
      return res.status(404).json({
        success: false,
        error: 'Cart not found'
      });
    }
    
    // Filter out the item to be removed
    cart.items = cart.items.filter(
      item => item._id.toString() !== req.params.itemId
    );
    
    await cart.save();
    
    // Return updated cart with product details
    const updatedCart = await Cart.findById(cart._id).populate({
      path: 'items.product',
      select: 'name images'
    });
    
    res.status(200).json({
      success: true,
      data: updatedCart
    });
  } catch (err) {
    next(err);
  }
};
