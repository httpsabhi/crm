const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      tlsAllowInvalidCertificates: true,
    }); // Removed deprecated options
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('DB Connection Failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;