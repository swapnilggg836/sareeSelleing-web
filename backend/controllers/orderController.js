
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Create new order
// @route   POST /orders
// @access  Private
exports.createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;
    
    console.log('Creating order with data:', req.body);
    
    // Validate required fields
    if (!items || !items.length || !shippingAddress || !paymentMethod) {
      return res.status(400).json({
        success: false,
        error: 'Missing required order information'
      });
    }
    
    // Calculate total amount
    let totalAmount = 0;
    const orderItems = [];
    
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          error: `Product not found: ${item.productId}`
        });
      }
      
      const orderItem = {
        product: item.productId,
        quantity: item.quantity,
        price: product.price,
        color: item.color
      };
      
      orderItems.push(orderItem);
      totalAmount += product.price * item.quantity;
    }
    
    // Create order
    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid'
    });
    
    // Clear user's cart after successful order
    await Cart.findOneAndUpdate(
      { user: req.user.id },
      { $set: { items: [] } }
    );
    
    console.log('Order created successfully:', order);
    
    res.status(201).json({
      success: true,
      data: order
    });
    
  } catch (error) {
    console.error('Create order error:', error);
    next(error);
  }
};

// @desc    Get user orders
// @route   GET /orders
// @access  Private
exports.getUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('items.product', 'name images')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    console.error('Get user orders error:', error);
    next(error);
  }
};

// @desc    Get single order
// @route   GET /orders/:id
// @access  Private
exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product', 'name images')
      .populate('user', 'name email');
    
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }
    
    // Check if user owns the order or is admin
    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this order'
      });
    }
    
    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Get order error:', error);
    next(error);
  }
};

// @desc    Get all orders (Admin)
// @route   GET /admin/orders
// @access  Private/Admin
exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate('items.product', 'name images')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    next(error);
  }
};

// @desc    Update order status (Admin)
// @route   PUT /admin/orders/:id
// @access  Private/Admin
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: Date.now() },
      { new: true, runValidators: true }
    ).populate('items.product', 'name images')
     .populate('user', 'name email');
    
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    next(error);
  }
};

// @desc    Track order by order number
// @route   POST /orders/track
// @access  Public
exports.trackOrder = async (req, res, next) => {
  try {
    const { orderNumber, email } = req.body;
    
    if (!orderNumber || !email) {
      return res.status(400).json({
        success: false,
        error: 'Order number and email are required'
      });
    }
    
    const order = await Order.findOne({ orderNumber })
      .populate('items.product', 'name images');
    
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }
    
    // Verify email matches
    if (order.shippingAddress.email.toLowerCase() !== email.toLowerCase()) {
      return res.status(403).json({
        success: false,
        error: 'Email does not match order records'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {
        orderNumber: order.orderNumber,
        status: order.status,
        totalAmount: order.totalAmount,
        createdAt: order.createdAt,
        items: order.items
      }
    });
  } catch (error) {
    console.error('Track order error:', error);
    next(error);
  }
};
