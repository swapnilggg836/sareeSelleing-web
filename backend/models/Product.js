
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a product name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please add a product price']
  },
  description: {
    type: String,
    required: [true, 'Please add a product description']
  },
  details: {
    type: String
  },
  careInstructions: {
    type: String
  },
  images: [
    {
      url: {
        type: String,
        required: true
      },
      alt: {
        type: String,
        default: 'Product Image'
      }
    }
  ],
  colors: [
    {
      name: {
        type: String,
        required: true
      },
      hex: {
        type: String,
        required: true
      },
      images: [String] // Array of image URLs for this color variant
    }
  ],
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: ['new-arrivals', 'banarasi-silk', 'kanjivaram', 'patola', 'paithani', 'bandhani']
  },
  subcategory: {
    type: String
  },
  collections: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Collection'
  }],
  inventory: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  sareeDetails: {
    fabric: String,
    blouseBorderPattern: String,
    design: String,
    dimensions: String,
    weight: String,
    blouseLength: String,
    materialType: String,
    country: {
      type: String,
      default: 'India'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', ProductSchema);
