
const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a category name'],
    unique: true,
    trim: true,
    enum: {
      values: ['new-arrivals', 'banarasi-silk', 'kanjivaram', 'patola', 'paithani', 'bandhani'],
      message: 'Category name must be one of: new-arrivals, banarasi-silk, kanjivaram, patola, paithani, bandhani'
    }
  },
  description: {
    type: String,
    required: [true, 'Please add a category description']
  },
  image: {
    type: String,
    default: ''
  },
  parentCategory: {
    type: String,
    default: null
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

module.exports = mongoose.model('Category', CategorySchema);
