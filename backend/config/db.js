const mongoose = require('mongoose');

/**
 * Connect to MongoDB Atlas (or local MongoDB in development).
 * Uses a single shared connection with recommended production options.
 */
const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error('MONGO_URI is not defined. Copy .env.example to .env and set it.');
  }

  mongoose.set('strictQuery', true);

  const conn = await mongoose.connect(uri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 15000,
  });

  console.log(`MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
  return conn;
};

module.exports = connectDB;
