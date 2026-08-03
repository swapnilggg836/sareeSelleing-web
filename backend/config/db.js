
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Use MongoDB connection string from environment variable
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      console.error('MongoDB URI is not defined in environment variables');
      console.log('Please set MONGODB_URI in your .env file');
      console.log('Example: MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname');
      process.exit(1);
    }
    
    console.log('Connecting to MongoDB...');
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    console.log('Please check your MongoDB URI and network connection');
    console.log('Current MongoDB URI:', process.env.MONGODB_URI ? 'Set (hidden for security)' : 'Not set');
    process.exit(1);
  }
};

module.exports = connectDB;
