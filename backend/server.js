
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/db');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Connect to database
connectDB();

const app = express();

// CORS middleware
app.use(cors({
  origin: true,
  credentials: true
}));

// Create upload directories if they don't exist
const uploadDirs = [
  'uploads',
  'uploads/products',
  'uploads/collections',
  'uploads/banners',
  'uploads/categories',
  'uploads/blog'
];

uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Static file serving
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Global JSON middleware
app.use(express.json());

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const collectionRoutes = require('./routes/collectionRoutes');
const bannerRoutes = require('./routes/bannerRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const blogRoutes = require('./routes/blogRoutes');
const saleRoutes = require('./routes/saleRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const contactRoutes = require('./routes/contactRoutes');
const newsletterRoutes = require('./routes/newsletterRoutes');
const adminNotificationRoutes = require('./routes/adminNotificationRoutes');
const adminDashboardRoutes = require('./routes/adminDashboardRoutes');

// Mount routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/collections', collectionRoutes);
app.use('/banners', bannerRoutes);
app.use('/categories', categoryRoutes);
app.use('/blog', blogRoutes);
app.use('/sales', saleRoutes);
app.use('/sale', saleRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', orderRoutes);
app.use('/wishlist', wishlistRoutes);
app.use('/reviews', reviewRoutes);
app.use('/contact', contactRoutes);
app.use('/newsletter', newsletterRoutes);
app.use('/admin/notifications', adminNotificationRoutes);
app.use('/admin/dashboard', adminDashboardRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Server Error'
  });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});