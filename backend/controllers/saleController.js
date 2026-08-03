
const Sale = require('../models/Sale');

// @desc    Get all sales
// @route   GET /sales
// @access  Public
exports.getSales = async (req, res, next) => {
  try {
    const sales = await Sale.find({ active: true });
    
    res.status(200).json({
      success: true,
      count: sales.length,
      data: sales
    });
  } catch (err) {
    console.error('Get sales error:', err);
    next(err);
  }
};

// @desc    Get single sale
// @route   GET /sales/:id
// @access  Public
exports.getSale = async (req, res, next) => {
  try {
    const sale = await Sale.findById(req.params.id);
    
    if (!sale) {
      return res.status(404).json({
        success: false,
        error: 'Sale not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: sale
    });
  } catch (err) {
    console.error('Get sale error:', err);
    next(err);
  }
};

// @desc    Create new sale
// @route   POST /sales
// @access  Private/Admin
exports.createSale = async (req, res, next) => {
  try {
    const { title, description, discountType, discountValue, startDate, endDate, active, featured } = req.body;

    const saleData = {
      title,
      description,
      discountType,
      discountValue: Number(discountValue),
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      active: active === 'true',
      featured: featured === 'true'
    };

    const sale = await Sale.create(saleData);
    
    res.status(201).json({
      success: true,
      data: sale
    });
  } catch (err) {
    console.error('Create sale error:', err);
    next(err);
  }
};

// @desc    Update sale
// @route   PUT /sales/:id
// @access  Private/Admin
exports.updateSale = async (req, res, next) => {
  try {
    let sale = await Sale.findById(req.params.id);
    
    if (!sale) {
      return res.status(404).json({
        success: false,
        error: 'Sale not found'
      });
    }

    const { title, description, discountType, discountValue, startDate, endDate, active, featured } = req.body;

    const updateData = {
      title,
      description,
      discountType,
      discountValue: Number(discountValue),
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      active: active === 'true',
      featured: featured === 'true'
    };

    sale = await Sale.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: sale
    });
  } catch (err) {
    console.error('Update sale error:', err);
    next(err);
  }
};

// @desc    Delete sale
// @route   DELETE /sales/:id
// @access  Private/Admin
exports.deleteSale = async (req, res, next) => {
  try {
    const sale = await Sale.findById(req.params.id);
    
    if (!sale) {
      return res.status(404).json({
        success: false,
        error: 'Sale not found'
      });
    }
    
    await sale.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    console.error('Delete sale error:', err);
    next(err);
  }
};
