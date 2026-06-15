const jwt = require('jsonwebtoken');

// Generate Access Token (short expiration, e.g., 15m)
const generateAccessToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: '15m' }
  );
};

// Generate Refresh Token (longer expiration, e.g., 7d) containing ID and Role
const generateRefreshToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
};

// Centralized helper to set refresh token cookie and send response with user info and access token
const sendAuthResponse = (user, statusCode, res) => {
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id, user.role);

  // Cookie options
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  };

  // Set the refresh token as an HTTP-only cookie
  res.cookie('refreshToken', refreshToken, cookieOptions);

  // Send access token and user info
  return res.status(statusCode).json({
    success: true,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
    accessToken,
  });
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  sendAuthResponse,
};
