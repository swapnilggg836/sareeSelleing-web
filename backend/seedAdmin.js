/**
 * Seed script to create Swapnil Gaikwad as Admin user in MongoDB Atlas
 * Run: node backend/seedAdmin.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, 'config/config.env') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in config/config.env');
  process.exit(1);
}

// Simple User schema for seeding
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  phone: String,
  role: { type: String, default: 'user' },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

const adminData = {
  name: 'Swapnil Gaikwad',
  email: 'swapnilg836@gmail.com',
  password: 'Admin@12345',   // Change this after first login!
  phone: '8605887561',
  role: 'admin'
};

async function seedAdmin() {
  try {
    console.log('🔌 Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');

    // Check if admin already exists
    const existing = await User.findOne({ email: adminData.email });
    if (existing) {
      if (existing.role !== 'admin') {
        await User.findByIdAndUpdate(existing._id, { role: 'admin' });
        console.log('✅ Existing user upgraded to admin:', adminData.email);
      } else {
        console.log('ℹ️  Admin already exists:', adminData.email);
      }
      process.exit(0);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminData.password, salt);

    // Create admin
    const admin = await User.create({
      ...adminData,
      password: hashedPassword
    });

    console.log('🎉 Admin user created successfully!');
    console.log('   Name  :', admin.name);
    console.log('   Email :', admin.email);
    console.log('   Phone :', admin.phone);
    console.log('   Role  :', admin.role);
    console.log('   Pass  : Admin@12345  ← Change after login!');
    process.exit(0);

  } catch (err) {
    console.error('❌ Error seeding admin:', err.message);
    process.exit(1);
  }
}

seedAdmin();
