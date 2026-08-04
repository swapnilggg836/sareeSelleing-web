/**
 * Seed script to populate initial sample products, categories, collections, and banners in MongoDB Atlas
 * Run: node backend/seedDatabase.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, 'config/config.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://swapnil:UaJfkMdnZtHq.62@cluster0.6obrx.mongodb.net/adminpaith?retryWrites=true&w=majority&appName=Cluster0';

// Require all models
const Product = require('./models/Product');
const Category = require('./models/Category');
const Collection = require('./models/Collection');
const Banner = require('./models/Banner');

const sampleCategories = [
  { name: 'paithani', description: 'Traditional Paithani sarees with peacock motifs and gold borders', active: true, featured: true },
  { name: 'banarasi-silk', description: 'Royal Banarasi silk sarees with silver and gold zari work', active: true, featured: true },
  { name: 'kanjivaram', description: 'Authentic South Indian Kanjivaram silk sarees', active: true, featured: true },
  { name: 'patola', description: 'Double ikkat handwoven Patola silk sarees', active: true, featured: true },
  { name: 'bandhani', description: 'Vibrant tie-and-dye Gujarati Bandhani sarees', active: true, featured: true },
  { name: 'new-arrivals', description: 'Fresh handcrafted saree collections', active: true, featured: true }
];

const sampleCollections = [
  { name: 'Wedding Collection', description: 'Grand bridal and wedding sarees', image: 'https://images.unsplash.com/photo-1610189715216-8aa88377feb9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', featured: true },
  { name: 'Festival Collection', description: 'Festive silk sarees for grand celebrations', image: 'https://images.unsplash.com/photo-1609748340878-91065c1f02ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', featured: true },
  { name: 'Designer Collection', description: 'Exclusive designer silk sarees', image: 'https://images.unsplash.com/photo-1573566428335-4e3abe259c95?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', featured: true },
  { name: 'Traditional Collection', description: 'Heritage Paithani & silk classics', image: 'https://images.unsplash.com/photo-1602764363500-e8e8e0a38e3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', featured: true }
];

const sampleBanners = [
  {
    title: 'Elegance Woven In Every Thread',
    subtitle: 'Discover authentic Paithani sarees crafted with heritage and grace',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    active: true,
    position: 'hero'
  },
  {
    title: 'Royal Bridal Collection 2026',
    subtitle: 'Handcrafted pure silk sarees for your dream wedding',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    active: true,
    position: 'hero'
  }
];

const sampleProducts = [
  {
    name: 'Royal Crimson Paithani Silk Saree',
    price: 18999,
    description: 'Authentic pure silk Paithani saree featuring traditional handwoven peacock pallu and rich gold zari border.',
    details: 'Handwoven in Maharastra by master weavers. Pure silk threads with 100% genuine zari.',
    careInstructions: 'Dry clean only. Store wrapped in muslin cloth.',
    category: 'paithani',
    featured: true,
    inventory: 15,
    images: [{ url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', alt: 'Crimson Paithani Saree' }],
    colors: [{ name: 'Crimson Red', hex: '#9F1239' }, { name: 'Gold', hex: '#D97706' }],
    sareeDetails: { fabric: 'Pure Silk', design: 'Peacock Pallu', country: 'India' }
  },
  {
    name: 'Maharani Emerald Green Paithani',
    price: 21999,
    description: 'Stunning emerald green Paithani silk saree with vibrant lotus and parrot motifs woven in gold zari.',
    details: 'Woven with high-density pure silk warp and weft.',
    careInstructions: 'Dry clean only.',
    category: 'paithani',
    featured: true,
    inventory: 10,
    images: [{ url: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', alt: 'Emerald Paithani' }],
    colors: [{ name: 'Emerald Green', hex: '#059669' }],
    sareeDetails: { fabric: 'Pure Mulberry Silk', design: 'Lotus & Parrot Motifs', country: 'India' }
  },
  {
    name: 'Golden Banarasi Silk Brocade Saree',
    price: 15999,
    description: 'Traditional Varanasi Banarasi silk saree adorned with intricate kadwa gold zari work.',
    details: 'Woven using the traditional Kadwa technique in Banaras.',
    careInstructions: 'Dry clean only.',
    category: 'banarasi-silk',
    featured: true,
    inventory: 12,
    images: [{ url: 'https://images.unsplash.com/photo-1610222259863-8bc4e3da9139?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', alt: 'Golden Banarasi Saree' }],
    colors: [{ name: 'Gold', hex: '#F59E0B' }],
    sareeDetails: { fabric: 'Katan Silk', design: 'Kadwa Brocade', country: 'India' }
  },
  {
    name: 'Royal Purple Kanjivaram Bridal Saree',
    price: 24999,
    description: 'Heavy Kanjivaram silk saree with contrast korvai border and temple pallu in pure gold zari.',
    details: 'Pure mulberry silk woven with three-ply thread.',
    careInstructions: 'Dry clean only.',
    category: 'kanjivaram',
    featured: true,
    inventory: 8,
    images: [{ url: 'https://images.unsplash.com/photo-1603995126906-16a549b0d8a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', alt: 'Kanjivaram Saree' }],
    colors: [{ name: 'Royal Purple', hex: '#7E22CE' }],
    sareeDetails: { fabric: 'Kanchipuram Silk', design: 'Temple Border', country: 'India' }
  }
];

async function seedData() {
  try {
    console.log('🔌 Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to Atlas!');

    // Seed Categories
    console.log('Seeding categories...');
    for (const cat of sampleCategories) {
      await Category.findOneAndUpdate({ name: cat.name }, cat, { upsert: true, new: true });
    }

    // Seed Collections
    console.log('Seeding collections...');
    for (const col of sampleCollections) {
      await Collection.findOneAndUpdate({ name: col.name }, col, { upsert: true, new: true });
    }

    // Seed Banners
    console.log('Seeding banners...');
    const bannerCount = await Banner.countDocuments();
    if (bannerCount === 0) {
      await Banner.insertMany(sampleBanners);
    }

    // Seed Products
    console.log('Seeding products...');
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      await Product.insertMany(sampleProducts);
    }

    console.log('🎉 Database successfully seeded with products, categories, collections, and banners!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
}

seedData();
