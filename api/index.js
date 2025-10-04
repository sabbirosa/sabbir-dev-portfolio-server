// Vercel serverless function handler
// This file uses CommonJS because Vercel serverless functions need it

// Load environment variables
require('dotenv').config();

const mongoose = require('mongoose');

// Import the compiled Express app
const app = require('../dist/app.js').default;

// Cache database connection for serverless
let cachedConnection = null;

// Initialize database connection
async function connectDatabase() {
  if (mongoose.connection.readyState === 1) {
    console.log('Using existing MongoDB connection');
    return;
  }

  if (mongoose.connection.readyState === 2) {
    console.log('MongoDB connection in progress, waiting...');
    await mongoose.connection.asPromise();
    return;
  }

  try {
    if (!cachedConnection) {
      const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio';
      cachedConnection = mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        maxPoolSize: 10,
        minPoolSize: 2,
      });
    }
    await cachedConnection;
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    cachedConnection = null;
    throw error;
  }
}

// Serverless function handler
module.exports = async (req, res) => {
  try {
    // Connect to database
    await connectDatabase();
    
    // Handle the request with Express app
    return app(req, res);
  } catch (error) {
    console.error('Serverless function error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

