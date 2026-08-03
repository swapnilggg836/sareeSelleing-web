
const mongoose = require('mongoose');

const BannerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a banner title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  subtitle: {
    type: String,
    trim: true,
    maxlength: [200, 'Subtitle cannot be more than 200 characters']
  },
  image: {
    type: String,
    required: [true, 'Please add a banner image']
  },
  position: {
    type: String,
    enum: ['hero', 'secondary', 'footer'],
    default: 'secondary'
  },
  active: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Banner', BannerSchema);
