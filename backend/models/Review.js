
const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: [true, 'Please add a product']
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: false // Make optional for admin-created reviews
  },
  customerName: {
    type: String,
    required: [true, 'Please add customer name'],
    trim: true
  },
  customerLocation: {
    type: String,
    trim: true
  },
  title: {
    type: String,
    required: [true, 'Please add a review title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  comment: {
    type: String,
    required: [true, 'Please add a review comment']
  },
  rating: {
    type: Number,
    required: [true, 'Please add a rating'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot be more than 5']
  },
  approved: {
    type: Boolean,
    default: false
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

module.exports = mongoose.model('Review', ReviewSchema);
