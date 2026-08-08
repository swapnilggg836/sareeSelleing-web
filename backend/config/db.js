
const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState === 1) {
    return;
  }

  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://swapnil:UaJfkMdnZtHq.62@cluster0.6obrx.mongodb.net/adminpaith?retryWrites=true&w=majority&appName=Cluster0';
    console.log('Connecting to MongoDB Atlas...');
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000
    });
    isConnected = true;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    isConnected = false;
  }
};

module.exports = connectDB;
