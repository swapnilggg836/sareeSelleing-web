
const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity cannot be less than 1']
  },
  color: {
    type: String
  },
  price: {
    type: Number,
    required: true
  }
});

const CartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  items: [CartItemSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Virtual for total price
CartSchema.virtual('totalPrice').get(function() {
  return this.items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
});

module.exports = mongoose.model('Cart', CartSchema);
