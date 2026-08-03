
const mongoose = require('mongoose');

const SaleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a sale title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: [true, 'Please specify discount type']
  },
  discountValue: {
    type: Number,
    required: [true, 'Please add discount value'],
    min: [1, 'Discount value must be at least 1']
  },
  startDate: {
    type: Date,
    required: [true, 'Please add start date']
  },
  endDate: {
    type: Date,
    required: [true, 'Please add end date']
  },
  active: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Sale', SaleSchema);
