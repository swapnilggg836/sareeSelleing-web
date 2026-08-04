
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/db');

// Load env vars - locally use config.env, on Vercel use dashboard env vars
if (process.env.NODE_ENV !== 'production') {
  const configPath = path.join(__dirname, 'config/config.env');
  if (fs.existsSync(configPath)) {
    dotenv.config({ path: configPath });
  }
}

// Connect to database
connectDB();

const app = express();

// CORS middleware
app.use(cors({
  origin: true,
  credentials: true
}));

// Body parsing middleware — MUST be before routes
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Ensure DB is connected before processing requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
  } catch (e) {
    console.error("DB Connection error in middleware:", e);
  }
  next();
});

// Create upload directories only in local dev (Vercel has read-only filesystem)
if (process.env.NODE_ENV !== 'production') {
  const uploadDirs = [
    'uploads',
    'uploads/products',
    'uploads/collections',
    'uploads/banners',
    'uploads/categories',
    'uploads/blog'
  ];
  uploadDirs.forEach(dir => {
    try {
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    } catch(e) {}
  });
}

// Static file serving
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));

// Pre-register all Mongoose models to prevent MissingSchemaError during populate calls
require('./models/User');
require('./models/Product');
require('./models/Collection');
require('./models/Banner');
require('./models/Category');
require('./models/Blog');
require('./models/Sale');
require('./models/Cart');
require('./models/Order');
require('./models/Wishlist');
require('./models/Review');
require('./models/Contact');
require('./models/Newsletter');

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

// Mount routes (with and without /api prefix to handle Vercel serverless rewrites)
const routeList = [
  ['/auth', authRoutes],
  ['/users', userRoutes],
  ['/products', productRoutes],
  ['/collections', collectionRoutes],
  ['/banners', bannerRoutes],
  ['/categories', categoryRoutes],
  ['/blog', blogRoutes],
  ['/sales', saleRoutes],
  ['/sale', saleRoutes],
  ['/cart', cartRoutes],
  ['/orders', orderRoutes],
  ['/wishlist', wishlistRoutes],
  ['/reviews', reviewRoutes],
  ['/contact', contactRoutes],
  ['/newsletter', newsletterRoutes],
  ['/admin/notifications', adminNotificationRoutes],
  ['/admin/dashboard', adminDashboardRoutes]
];

routeList.forEach(([routePath, routerModule]) => {
  app.use(`/api${routePath}`, routerModule);
  app.use(routePath, routerModule);
});

// ✅ ONE-TIME ADMIN SEED ROUTE — visit /api/seed-admin?key=swapnil2024 to create admin
app.get('/api/seed-admin', async (req, res) => {
  if (req.query.key !== 'swapnil2024') {
    return res.status(403).json({ success: false, error: 'Forbidden' });
  }
  try {
    const bcrypt = require('bcryptjs');
    const User = require('./models/User');
    const existing = await User.findOne({ email: 'swapnilg836@gmail.com' });
    if (existing) {
      if (existing.role !== 'admin') {
        await User.findByIdAndUpdate(existing._id, { role: 'admin' });
        return res.json({ success: true, message: 'User upgraded to admin!' });
      }
      return res.json({ success: true, message: 'Admin already exists!', email: existing.email });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Admin@12345', salt);
    const admin = await User.create({
      name: 'Swapnil Gaikwad',
      email: 'swapnilg836@gmail.com',
      phone: '8605887561',
      password: hashedPassword,
      role: 'admin'
    });
    res.json({ success: true, message: '🎉 Admin created!', name: admin.name, email: admin.email, role: admin.role });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Error handling middleware — always return JSON, never HTML
app.use((err, req, res, next) => {
  console.error('Server error:', err.message || err);
  const status = err.statusCode || err.status || 500;
  res.status(status).json({
    success: false,
    error: err.message || 'Server Error'
  });
});

// Export for Vercel serverless — also listen locally
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running locally on port ${PORT}`);
  });
}

module.exports = app;