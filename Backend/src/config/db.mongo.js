const dns = require('dns');
// Kuch internet providers MongoDB Atlas ka address resolve nahi karte — Google/Cloudflare DNS use karo
dns.setServers(['8.8.8.8', '1.1.1.1']);

const mongoose = require('mongoose');
require('dotenv').config();

const connectMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('Unable to connect to MongoDB:', error.message);
  }
};

module.exports = connectMongo;