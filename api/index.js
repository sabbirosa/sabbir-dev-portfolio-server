// Vercel serverless function handler
// This file uses CommonJS because Vercel serverless functions need it

// Load environment variables
require('dotenv').config();

// Import the compiled Express app
const app = require('../dist/server.js').default;

// Export the serverless function handler
module.exports = app;

