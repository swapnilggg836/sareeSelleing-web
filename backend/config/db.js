
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      console.error('MongoDB URI is not defined in environment variables');
      if (process.env.NODE_ENV !== 'production') process.exit(1);
      return;
    }

    console.log('Connecting to MongoDB...');
    const conn = await mongoose.connect(mongoURI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    if (process.env.NODE_ENV !== 'production') process.exit(1);
  }
};

module.exports = connectDB;
