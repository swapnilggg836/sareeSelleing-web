
const mongoose = require('mongoose');

const CollectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a collection name'],
    unique: true,
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a collection description']
  },
  image: {
    type: String,
    required: [true, 'Please add a collection image']
  },
  featured: {
    type: Boolean,
    default: false
  },
  products: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Product'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Collection', CollectionSchema);

