// src/routes/adminRoutes.js
const express = require('express');
const { body, param, query } = require('express-validator');
const {
  loginAdmin,
  getDashboardStats,
  getPendingRequests,
  updateCompanyStatus,
  deleteCompany,
  getAllCompanies,
  updateProfile,
  getActivityLogs
} = require('../controllers/adminController');
const { authenticateAdmin, requireSuperAdmin } = require('../middlewares/authMiddleware');
const { loginLimiter } = require('../middlewares/rateLimiter');

const router = express.Router();

// Validation for admin login
const validateAdminLogin = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Username can only contain letters, numbers, underscores, and hyphens'),
    
  body('password')
    .isLength({ min: 6, max: 128 })
    .withMessage('Password must be between 6 and 128 characters')
];

// Validation for company status update
const validateStatusUpdate = [
  param('companyId')
    .isMongoId()
    .withMessage('Invalid company ID format'),
    
  body('status')
    .isIn(['approved', 'rejected', 'suspended'])
    .withMessage('Status must be approved, rejected, or suspended'),
    
  body('rejectionReason')
    .if(body('status').equals('rejected'))
    .notEmpty()
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Rejection reason is required and must be between 10 and 500 characters')
    .optional({ checkFalsy: true })
];

// Validation for profile update
const validateProfileUpdate = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('First name cannot exceed 50 characters'),
    
  body('lastName')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Last name cannot exceed 50 characters'),
    
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
    
  body('phone')
    .optional()
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Please provide a valid phone number'),
    
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Bio cannot exceed 200 characters'),
    
  body('department')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Department cannot exceed 50 characters'),
    
  body('preferences.theme')
    .optional()
    .isIn(['light', 'dark', 'auto'])
    .withMessage('Theme must be light, dark, or auto'),
    
  body('preferences.language')
    .optional()
    .isIn(['en', 'hi', 'es', 'fr', 'de'])
    .withMessage('Invalid language selection'),
    
  body('preferences.emailNotifications')
    .optional()
    .isBoolean()
    .withMessage('Email notifications must be true or false')
];

// Validation for query parameters
const validateQueryParams = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
    
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
    
  query('sortBy')
    .optional()
    .isIn(['createdAt', 'name', 'status', 'rating', 'lastActivity'])
    .withMessage('Invalid sort field'),
    
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc'),
    
  query('status')
    .optional()
    .isIn(['pending', 'approved', 'rejected', 'suspended'])
    .withMessage('Invalid status filter'),
    
  query('paymentStatus')
    .optional()
    .isIn(['pending', 'processing', 'completed', 'failed'])
    .withMessage('Invalid payment status filter'),
    
  query('verified')
    .optional()
    .isBoolean()
    .withMessage('Verified filter must be true or false')
];

// Routes

// POST /api/admin/login - Admin authentication
router.post('/login', loginLimiter, validateAdminLogin, loginAdmin);

// Protected routes (require authentication)
router.use(authenticateAdmin); // All routes below require authentication

// GET /api/admin/dashboard - Get dashboard statistics
router.get('/dashboard', getDashboardStats);

// GET /api/admin/pending-requests - Get pending company requests
router.get('/pending-requests', validateQueryParams, getPendingRequests);

// GET /api/admin/companies - Get all companies (admin view)
router.get('/companies', validateQueryParams, getAllCompanies);

// PUT /api/admin/companies/:companyId/status - Update company status
router.put('/companies/:companyId/status', validateStatusUpdate, updateCompanyStatus);

// DELETE /api/admin/companies/:companyId - Delete company
router.delete('/companies/:companyId', 
  param('companyId').isMongoId().withMessage('Invalid company ID format'),
  deleteCompany
);

// GET /api/admin/profile - Get admin profile
router.get('/profile', (req, res) => {
  res.status(200).json({
    success: true,
    data: req.admin
  });
});

// PUT /api/admin/profile - Update admin profile
router.put('/profile', validateProfileUpdate, updateProfile);

// GET /api/admin/activity-logs - Get admin activity logs
router.get('/activity-logs', 
  query('startDate').optional().isISO8601().withMessage('Invalid start date format'),
  query('endDate').optional().isISO8601().withMessage('Invalid end date format'),
  validateQueryParams,
  getActivityLogs
);

// Super admin only routes
router.use(requireSuperAdmin);

// Additional super admin routes can be added here
// For example: user management, system settings, etc.

module.exports = router;