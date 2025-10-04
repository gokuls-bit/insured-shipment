const express = require('express');
const router = express.Router();
const Company = require('../models/Company');
const User = require('../models/User');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const { successResponse } = require('../utils/responseHandler');
const { asyncHandler } = require('../middlewares/errorMiddleware');

// Dashboard stats
router.get('/dashboard/stats', protect, authorize('admin', 'moderator'), asyncHandler(async (req, res) => {
  const [
    totalCompanies,
    approvedCompanies,
    pendingCompanies,
    rejectedCompanies,
    totalUsers
  ] = await Promise.all([
    Company.countDocuments(),
    Company.countDocuments({ status: 'approved' }),
    Company.countDocuments({ status: 'pending', paymentStatus: 'completed' }),
    Company.countDocuments({ status: 'rejected' }),
    User.countDocuments()
  ]);

  const companies = await Company.find({ paymentStatus: 'completed' });
  const totalRevenue = companies.length * 15000;
  const totalClicks = companies.reduce((sum, c) => sum + (c.clicks || 0), 0);
  const totalViews = companies.reduce((sum, c) => sum + (c.views || 0), 0);
  const totalQuotes = companies.reduce((sum, c) => sum + (c.quotes || 0), 0);

  successResponse(res, {
    totalCompanies,
    approvedCompanies,
    pendingCompanies,
    rejectedCompanies,
    totalUsers,
    totalRevenue,
    totalClicks,
    totalViews,
    totalQuotes
  }, 'Dashboard stats retrieved');
}));

// Get all users
router.get('/users', protect, authorize('admin'), asyncHandler(async (req, res) => {
  const users = await User.find().select('-passwordHash -refreshToken');
  successResponse(res, users, 'Users retrieved successfully');
}));

// Update user role
router.put('/users/:id/role', protect, authorize('admin'), asyncHandler(async (req, res) => {
  const { role } = req.body;
  const user = await User.findById(req.params.id);
  
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  
  user.role = role;
  await user.save();
  
  successResponse(res, user.toSafeObject(), 'User role updated successfully');
}));

module.exports = router;

// src/routes/index.js - Main Routes Index
const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const companyRoutes = require('./companyRoutes');
const shipmentRoutes = require('./shipmentRoutes');
const policyRoutes = require('./policyRoutes');
const claimRoutes = require('./claimRoutes');
const adminRoutes = require('./adminRoutes');

router.use('/auth', authRoutes);
router.use('/companies', companyRoutes);
router.use('/shipments', shipmentRoutes);
router.use('/policies', policyRoutes);
router.use('/claims', claimRoutes);
router.use('/admin', adminRoutes);

module.exports = router;