
const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a blog title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  content: {
    type: String,
    required: [true, 'Please add blog content']
  },
  excerpt: {
    type: String,
    maxlength: [500, 'Excerpt cannot be more than 500 characters']
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: ['fashion', 'sarees', 'trends', 'care']
  },
  image: {
    type: String,
    default: ''
  },
  published: {
    type: Boolean,
    default: false
  },
  featured: {
    type: Boolean,
    default: false
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Blog', BlogSchema);
