const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const OTP = require('../models/OTP');
const sendEmail = require('../config/email');
const { generateAccessToken, sendAuthResponse } = require('../utils/tokenUtils');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Basic validation
    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all fields' });
    }

    // Check if user already exists by email or username
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User with this email or username already exists' });
    }

    // Verify email is validated via OTP
    const verificationRecord = await OTP.findOne({ email, isVerified: true });
    if (!verificationRecord) {
      return res.status(400).json({ success: false, message: 'Email has not been verified. Please verify your email first.' });
    }

    // Hash the password directly here (no Mongoose hooks)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the user. The role will default to 'student' automatically
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // Delete the verification record after successful registration
    await OTP.deleteMany({ email });

    // Generate tokens and respond
    sendAuthResponse(user, 201, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Compare password directly here (no Mongoose schema methods)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Generate tokens and respond
    sendAuthResponse(user, 200, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public
const refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ success: false, message: 'No refresh token provided' });
    }

    // Verify token
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ success: false, message: 'Invalid or expired refresh token' });
      }

      // Check if user still exists
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      // Generate new access token
      const accessToken = generateAccessToken(user);

      res.status(200).json({
        success: true,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
        accessToken,
      });
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Logout user & clear cookie
// @route   POST /api/auth/logout
// @access  Public
const logout = async (req, res) => {
  try {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Send OTP code to email
// @route   POST /api/auth/send-otp
// @access  Public
const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide an email address' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Delete any existing OTP records for this email
    await OTP.deleteMany({ email });

    // Create a new OTP record
    await OTP.create({ email, otp });

    // Send the email
    await sendEmail({
      to: email,
      subject: 'LMS - Email Verification Code',
      text: `Your email verification code is: ${otp}. It is valid for 5 minutes.`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; max-width: 500px;">
          <h2 style="color: #4f46e5; margin-bottom: 16px;">Verify Your Email</h2>
          <p>Thank you for signing up for LearnSphere LMS. Use the verification code below to complete your registration:</p>
          <div style="background-color: #f8fafc; padding: 16px; text-align: center; border-radius: 8px; margin: 24px 0;">
            <span style="font-size: 24px; font-family: monospace; font-weight: bold; letter-spacing: 4px; color: #1e1b4b;">${otp}</span>
          </div>
          <p style="color: #64748b; font-size: 14px;">This code will expire in 5 minutes. If you did not request this code, you can safely ignore this email.</p>
        </div>
      `
    });

    res.status(200).json({ 
      success: true, 
      message: 'Verification code sent to your email.',
      otp // Return OTP in response payload for easy testing
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Verify OTP code
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Please provide email and verification code' });
    }

    const otpRecord = await OTP.findOne({ email });
    if (!otpRecord) {
      return res.status(400).json({ success: false, message: 'Verification code expired or not found. Please request a new code.' });
    }

    if (otpRecord.otp !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid verification code. Please try again.' });
    }

    // Mark as verified and reset TTL countdown timer by updating updatedAt
    otpRecord.isVerified = true;
    otpRecord.updatedAt = Date.now();
    await otpRecord.save();

    res.status(200).json({ success: true, message: 'Email verified successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



// @desc    Send OTP for forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide an email address' });
    }

    // Check if user exists (unlike registration, they must exist)
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'No account found with this email address' });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Delete any existing OTP records for this email
    await OTP.deleteMany({ email });

    // Create a new OTP record
    await OTP.create({ email, otp });

    // Send the email
    await sendEmail({
      to: email,
      subject: 'LearnSphere LMS - Password Reset Code',
      text: `Your password reset code is: ${otp}. It is valid for 5 minutes.`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; max-width: 500px;">
          <h2 style="color: #4f46e5; margin-bottom: 16px;">Reset Your Password</h2>
          <p>We received a request to reset your password. Use the verification code below to proceed:</p>
          <div style="background-color: #f8fafc; padding: 16px; text-align: center; border-radius: 8px; margin: 24px 0;">
            <span style="font-size: 24px; font-family: monospace; font-weight: bold; letter-spacing: 4px; color: #1e1b4b;">${otp}</span>
          </div>
          <p style="color: #64748b; font-size: 14px;">This code will expire in 5 minutes. If you did not request a password reset, you can safely ignore this email.</p>
        </div>
      `
    });

    res.status(200).json({ 
      success: true, 
      message: 'Password reset code sent to your email.',
      otp // Return OTP in response payload for easy testing
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reset password using verified OTP
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    if (!email || !otp || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all fields' });
    }

    // Verify OTP is validated via OTP database
    const verificationRecord = await OTP.findOne({ email, isVerified: true });
    if (!verificationRecord) {
      return res.status(400).json({ success: false, message: 'Email has not been verified with OTP or code expired.' });
    }

    // Find the user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Hash the password directly here
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update password
    user.password = hashedPassword;
    await user.save();

    // Clean up OTP records
    await OTP.deleteMany({ email });

    res.status(200).json({ success: true, message: 'Password has been reset successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  register,
  login,
  refresh,
  logout,
  sendOtp,
  verifyOtp,
  forgotPassword,
  resetPassword,
};
