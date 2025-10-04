// src/controllers/authController.js - Authentication Controller
const User = require('../models/User');
const { asyncHandler } = require('../middlewares/errorMiddleware');
const { successResponse, errorResponse } = require('../utils/responseHandler');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../middlewares/authMiddleware');
const logger = require('../utils/logger');

// @desc    Register new user
// @route   POST /api/v1/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  // Validation
  if (!username || !email || !password) {
    return errorResponse(res, 'Please provide all required fields', 400);
  }

  // Check if user exists
  const userExists = await User.findOne({ $or: [{ email }, { username }] });
  if (userExists) {
    return errorResponse(res, 'User already exists with this email or username', 400);
  }

  // Create user
  const user = await User.create({
    username,
    email,
    passwordHash: password,
    role: 'user'
  });

  // Generate tokens
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // Save refresh token
  user.refreshToken = refreshToken;
  await user.save();

  logger.info(`New user registered: ${user.email}`);

  successResponse(res, {
    user: user.toSafeObject(),
    accessToken,
    refreshToken
  }, 'User registered successfully', 201);
});

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return errorResponse(res, 'Please provide email and password', 400);
  }

  // Find user
  const user = await User.findOne({ email });
  if (!user) {
    return errorResponse(res, 'Invalid credentials', 401);
  }

  // Check password
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return errorResponse(res, 'Invalid credentials', 401);
  }

  // Check if user is active
  if (!user.isActive) {
    return errorResponse(res, 'Your account has been deactivated', 403);
  }

  // Generate tokens
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // Save refresh token and last login
  user.refreshToken = refreshToken;
  user.lastLogin = new Date();
  await user.save();

  logger.info(`User logged in: ${user.email}`);

  successResponse(res, {
    user: user.toSafeObject(),
    accessToken,
    refreshToken
  }, 'Login successful');
});

// @desc    Refresh access token
// @route   POST /api/v1/auth/refresh
// @access  Public
const refreshAccessToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return errorResponse(res, 'Refresh token required', 400);
  }

  const user = await verifyRefreshToken(refreshToken);
  if (!user) {
    return errorResponse(res, 'Invalid or expired refresh token', 401);
  }

  // Generate new tokens
  const newAccessToken = generateAccessToken(user._id);
  const newRefreshToken = generateRefreshToken(user._id);

  // Update refresh token
  user.refreshToken = newRefreshToken;
  await user.save();

  successResponse(res, {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken
  }, 'Token refreshed successfully');
});

// @desc    Logout user
// @route   POST /api/v1/auth/logout
// @access  Private
const logout = asyncHandler(async (req, res) => {
  // Clear refresh token
  req.user.refreshToken = null;
  await req.user.save();

  logger.info(`User logged out: ${req.user.email}`);

  successResponse(res, null, 'Logout successful');
});

// @desc    Get current user
// @route   GET /api/v1/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  successResponse(res, req.user.toSafeObject(), 'User data retrieved');
});

// @desc    Update user profile
// @route   PUT /api/v1/auth/me
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const { username, email } = req.body;

  const user = await User.findById(req.user._id);

  if (username) user.username = username;
  if (email) user.email = email;

  await user.save();

  successResponse(res, user.toSafeObject(), 'Profile updated successfully');
});

// @desc    Change password
// @route   PUT /api/v1/auth/change-password
// @access  Private
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return errorResponse(res, 'Please provide current and new password', 400);
  }

  const user = await User.findById(req.user._id);
  const isMatch = await user.matchPassword(currentPassword);

  if (!isMatch) {
    return errorResponse(res, 'Current password is incorrect', 401);
  }

  user.passwordHash = newPassword;
  await user.save();

  logger.info(`Password changed for user: ${user.email}`);

  successResponse(res, null, 'Password changed successfully');
});

module.exports = {
  register,
  login,
  refreshAccessToken,
  logout,
  getMe,
  updateProfile,
  changePassword
};