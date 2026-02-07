require('dotenv').config();
const mongoose = require('mongoose');

function connectDB() {
  const uri = (process.env.MONGO_CONNECTION_URL || '').trim();
  if (!uri || !uri.startsWith('mongodb')) {
    console.error('MONGO_CONNECTION_URL is missing or invalid.');
    process.exit(1);
  }
  mongoose.connect(uri);
  mongoose.connection
    .once('open', () => console.log('Database connected'))
    .on('error', (err) => {
      console.error('Connection failed:', err.message);
      process.exit(1);
    });
}

module.exports = connectDB;
