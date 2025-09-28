// src/controllers/adminController.js
const Admin = require('../models/Admin');
const Company = require('../models/Company');
const PaymentLog = require('../models/PaymentLog');
const { validationResult } = require('express-validator');
const logger = require('../utils/logger');

// Admin login
const loginAdmin = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { username, password } = req.body;
    const ipAddress = req.ip;
    const userAgent = req.get('User-Agent');

    // Find admin with password field
    const admin = await Admin.findOne({ 
      $or: [
        { username: username.toLowerCase() },
        { email: username.toLowerCase() }
      ]
    }).select('+password');

    if (!admin) {
      logger.warn('Login attempt with non-existent username', { username, ipAddress });
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if account is locked
    if (admin.isLocked) {
      logger.warn('Login attempt on locked account', { 
        username: admin.username, 
        ipAddress,
        lockUntil: admin.lockUntil 
      });
      return res.status(423).json({
        success: false,
        message: 'Account temporarily locked due to too many failed login attempts',
        lockUntil: admin.lockUntil
      });
    }

    // Check if account is active
    if (!admin.isActive) {
      logger.warn('Login attempt on inactive account', { username: admin.username, ipAddress });
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact administrator.'
      });
    }

    // Verify password
    const isPasswordMatch = await admin.comparePassword(password);
    
    if (!isPasswordMatch) {
      logger.warn('Invalid password attempt', { username: admin.username, ipAddress });
      
      // Increment login attempts
      await admin.incLoginAttempts();
      
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Reset login attempts on successful login
    if (admin.loginAttempts > 0) {
      await admin.resetLoginAttempts();
    }

    // Record successful login
    await admin.recordLogin(ipAddress);

    // Generate JWT token
    const token = admin.getJWTToken();

    logger.info('Admin login successful', {
      adminId: admin._id,
      username: admin.username,
      role: admin.role,
      ipAddress,
      userAgent
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        firstName: admin.firstName,
        lastName: admin.lastName,
        role: admin.role,
        permissions: admin.permissions,
        lastLogin: admin.lastLogin,
        preferences: admin.preferences
      }
    });

  } catch (error) {
    logger.error('Error in loginAdmin:', error);
    res.status(500).json({
      success: false,
      message: 'Login error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    // Get comprehensive dashboard statistics
    const [
      companyStats,
      paymentStats,
      recentActivity,
      monthlyRevenue,
      topPerformingCompanies,
      adminActivity
    ] = await Promise.all([
      // Company statistics
      Company.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]),
      
      // Payment statistics
      PaymentLog.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            totalAmount: { $sum: '$amount' }
          }
        }
      ]),
      
      // Recent activity
      Company.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .select('name status paymentStatus createdAt submittedBy')
        .lean(),
      
      // Monthly revenue for the last 12 months
      PaymentLog.aggregate([
        {
          $match: {
            status: 'paid',
            paidAt: {
              $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
            }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$paidAt' },
              month: { $month: '$paidAt' }
            },
            revenue: { $sum: '$amount' },
            transactions: { $sum: 1 }
          }
        },
        {
          $sort: { '_id.year': 1, '_id.month': 1 }
        }
      ]),
      
      // Top performing companies
      Company.find({ status: 'approved', verified: true })
        .sort({ clickCount: -1, rating: -1 })
        .limit(5)
        .select('name clickCount viewCount rating quoteRequests')
        .lean(),
      
      // Admin activity stats
      Admin.aggregate([
        {
          $group: {
            _id: '$role',
            count: { $sum: 1 },
            totalActions: { $sum: '$actionsPerformed' },
            totalApprovals: { $sum: '$companiesApproved' },
            totalRejections: { $sum: '$companiesRejected' }
          }
        }
      ])
    ]);

    // Process company stats
    const processedCompanyStats = {
      total: 0,
      approved: 0,
      pending: 0,
      rejected: 0,
      suspended: 0
    };

    companyStats.forEach(stat => {
      processedCompanyStats.total += stat.count;
      processedCompanyStats[stat._id] = stat.count;
    });

    // Process payment stats
    const processedPaymentStats = {
      totalRevenue: 0,
      completedPayments: 0,
      pendingPayments: 0,
      failedPayments: 0
    };

    paymentStats.forEach(stat => {
      if (stat._id === 'paid') {
        processedPaymentStats.totalRevenue = stat.totalAmount;
        processedPaymentStats.completedPayments = stat.count;
      } else if (stat._id === 'pending') {
        processedPaymentStats.pendingPayments = stat.count;
      } else if (stat._id === 'failed') {
        processedPaymentStats.failedPayments = stat.count;
      }
    });

    // Calculate growth percentages (mock data for demo)
    const growthStats = {
      companiesGrowth: 12.5,
      revenueGrowth: 18.3,
      clicksGrowth: 7.8,
      ratingsGrowth: 3.2
    };

    res.status(200).json({
      success: true,
      data: {
        companyStats: processedCompanyStats,
        paymentStats: processedPaymentStats,
        growthStats,
        recentActivity,
        monthlyRevenue,
        topPerformingCompanies,
        adminActivity,
        lastUpdated: new Date()
      }
    });

  } catch (error) {
    logger.error('Error in getDashboardStats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Get pending company requests
const getPendingRequests = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      sortBy = 'createdAt',
      sortOrder = 'desc',
      paymentStatus,
      search 
    } = req.query;

    // Build query for pending requests
    let query = { 
      status: 'pending',
      paymentStatus: paymentStatus || 'completed'
    };

    // Add search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { 'submittedBy.name': { $regex: search, $options: 'i' } },
        { 'submittedBy.email': { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort object
    const sortObj = {};
    sortObj[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: sortObj
    };

    const [pendingRequests, totalCount] = await Promise.all([
      Company.find(query)
        .sort(sortObj)
        .limit(parseInt(limit))
        .skip((parseInt(page) - 1) * parseInt(limit))
        .lean(),
      Company.countDocuments(query)
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    res.status(200).json({
      success: true,
      data: pendingRequests,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalRequests: totalCount,
        requestsPerPage: parseInt(limit),
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      filters: {
        paymentStatus,
        search
      }
    });

  } catch (error) {
    logger.error('Error in getPendingRequests:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching pending requests',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Update company status (approve/reject)
const updateCompanyStatus = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { companyId } = req.params;
    const { status, rejectionReason } = req.body;
    const adminId = req.admin.id;

    if (!companyId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid company ID format'
      });
    }

    const company = await Company.findById(companyId);
    
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    if (company.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Company status can only be updated from pending state',
        currentStatus: company.status
      });
    }

    // Check admin permissions
    if (!req.admin.hasPermission('approve_companies')) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions to update company status'
      });
    }

    let updatedCompany;

    if (status === 'approved') {
      updatedCompany = await company.approve(adminId);
      await req.admin.recordCompanyAction('approve');
      
      logger.info('Company approved', {
        companyId,
        companyName: company.name,
        adminId,
        adminUsername: req.admin.username
      });

    } else if (status === 'rejected') {
      if (!rejectionReason) {
        return res.status(400).json({
          success: false,
          message: 'Rejection reason is required for rejecting companies'
        });
      }

      updatedCompany = await company.reject(adminId, rejectionReason);
      await req.admin.recordCompanyAction('reject');
      
      logger.info('Company rejected', {
        companyId,
        companyName: company.name,
        adminId,
        adminUsername: req.admin.username,
        rejectionReason
      });
    }

    res.status(200).json({
      success: true,
      message: `Company ${status} successfully`,
      data: updatedCompany
    });

  } catch (error) {
    logger.error('Error in updateCompanyStatus:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating company status',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Delete company
const deleteCompany = async (req, res) => {
  try {
    const { companyId } = req.params;

    if (!companyId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid company ID format'
      });
    }

    // Check admin permissions
    if (!req.admin.hasPermission('delete_companies')) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions to delete companies'
      });
    }

    const company = await Company.findById(companyId);
    
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    // Don't allow deletion of approved companies with active payments
    if (company.status === 'approved' && company.paymentStatus === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete approved companies with completed payments. Consider suspending instead.'
      });
    }

    // Also delete related payment logs
    await PaymentLog.deleteMany({ companyId });
    await Company.findByIdAndDelete(companyId);

    logger.warn('Company deleted', {
      companyId,
      companyName: company.name,
      adminId: req.admin.id,
      adminUsername: req.admin.username,
      companyStatus: company.status
    });

    res.status(200).json({
      success: true,
      message: 'Company deleted successfully',
      deletedCompany: {
        id: company._id,
        name: company.name,
        status: company.status
      }
    });

  } catch (error) {
    logger.error('Error in deleteCompany:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting company',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Get all companies (admin view with sensitive data)
const getAllCompanies = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      status,
      paymentStatus,
      verified,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    let query = {};
    
    if (status) query.status = status;
    if (paymentStatus) query.paymentStatus = paymentStatus;
    if (verified !== undefined) query.verified = verified === 'true';
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { 'submittedBy.name': { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort
    const sortObj = {};
    sortObj[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const [companies, totalCount] = await Promise.all([
      Company.find(query)
        .populate('approvedBy', 'username email')
        .sort(sortObj)
        .limit(parseInt(limit))
        .skip((parseInt(page) - 1) * parseInt(limit))
        .lean(),
      Company.countDocuments(query)
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    res.status(200).json({
      success: true,
      data: companies,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalCompanies: totalCount,
        companiesPerPage: parseInt(limit),
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      filters: {
        status,
        paymentStatus,
        verified,
        search
      }
    });

  } catch (error) {
    logger.error('Error in getAllCompanies:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching companies',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Update admin profile
const updateProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const adminId = req.admin.id;
    const updateData = req.body;

    // Remove sensitive fields that shouldn't be updated via this endpoint
    delete updateData.password;
    delete updateData.role;
    delete updateData.permissions;
    delete updateData.isActive;

    const updatedAdmin = await Admin.findByIdAndUpdate(
      adminId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedAdmin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    logger.info('Admin profile updated', {
      adminId,
      updatedFields: Object.keys(updateData)
    });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedAdmin
    });

  } catch (error) {
    logger.error('Error in updateProfile:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Get admin activity logs
const getActivityLogs = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 50,
      startDate,
      endDate 
    } = req.query;

    let dateFilter = {};
    if (startDate || endDate) {
      dateFilter.lastActivity = {};
      if (startDate) dateFilter.lastActivity.$gte = new Date(startDate);
      if (endDate) dateFilter.lastActivity.$lte = new Date(endDate);
    }

    const [admins, totalCount] = await Promise.all([
      Admin.find(dateFilter)
        .select('username email role actionsPerformed companiesApproved companiesRejected lastLogin lastActivity')
        .sort({ lastActivity: -1 })
        .limit(parseInt(limit))
        .skip((parseInt(page) - 1) * parseInt(limit))
        .lean(),
      Admin.countDocuments(dateFilter)
    ]);

    res.status(200).json({
      success: true,
      data: admins,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / limit),
        totalRecords: totalCount
      }
    });

  } catch (error) {
    logger.error('Error in getActivityLogs:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching activity logs',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

module.exports = {
  loginAdmin,
  getDashboardStats,
  getPendingRequests,
  updateCompanyStatus,
  deleteCompany,
  getAllCompanies,
  updateProfile,
  getActivityLogs
};