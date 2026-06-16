const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  otp: {
    type: String,
    required: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  updatedAt: {
    type: Date,
    default: Date.now,
    expires: 300 // TTL set to 5 minutes (300 seconds)
  }
});

const OTP = mongoose.model('OTP', otpSchema);
module.exports = OTP;
