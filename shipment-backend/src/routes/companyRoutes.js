// src/routes/companyRoutes.js
const express = require('express');
const { body, param, query } = require('express-validator');
const {
  getCompanies,
  submitCompany,
  trackCompanyClick,
  getFilterOptions,
  getCompanyStats,
  getCompanyById
} = require('../controllers/companyController');

const router = express.Router();

// Validation middleware for company submission
const validateCompanySubmission = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Company name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z0-9\s&.-]+$/)
    .withMessage('Company name contains invalid characters'),
    
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
    
  body('website')
    .isURL({ protocols: ['http', 'https'] })
    .withMessage('Please provide a valid website URL'),
    
  body('contact')
    .trim()
    .isLength({ min: 10, max: 50 })
    .withMessage('Contact information must be between 10 and 50 characters')
    .matches(/^[\+]?[1-9][\d\s\-\(\)]{9,}$/)
    .withMessage('Please provide a valid contact number'),
    
  body('shipmentTypes')
    .isArray({ min: 1 })
    .withMessage('At least one shipment type is required')
    .custom((types) => {
      const validTypes = ['Road', 'Rail', 'Ship', 'Air'];
      return types.every(type => validTypes.includes(type));
    })
    .withMessage('Invalid shipment type provided'),
    
  body('cargoTypes')
    .optional()
    .isArray()
    .custom((types) => {
      if (!types) return true;
      const validTypes = [
        'Electronics', 'Textiles', 'Machinery', 'Chemicals', 'Automotive',
        'Food Products', 'Pharmaceuticals', 'Oil & Gas', 'Raw Materials',
        'Mining Equipment', 'Agricultural Products', 'Bulk Commodities',
        'Consumer Goods', 'Medical Equipment', 'Hazardous Materials'
      ];
      return types.every(type => validTypes.includes(type));
    })
    .withMessage('Invalid cargo type provided'),
    
  body('routes')
    .optional()
    .isArray()
    .custom((routes) => {
      if (!routes) return true;
      return routes.every(route => /^[A-Za-z\s]+-[A-Za-z\s]+$/.test(route));
    })
    .withMessage('Routes must be in format "Origin-Destination"'),
    
  body('coverage')
    .optional()
    .isIn(['Local', 'Regional', 'National', 'International', 'Global'])
    .withMessage('Invalid coverage type'),
    
  body('established')
    .isInt({ min: 1900, max: new Date().getFullYear() })
    .withMessage('Please provide a valid establishment year'),
    
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
    
  body('submitterInfo.name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Submitter name must be between 2 and 50 characters'),
    
  body('submitterInfo.email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid submitter email address'),
    
  body('submitterInfo.phone')
    .trim()
    .matches(/^[\+]?[1-9][\d\s\-\(\)]{9,}$/)
    .withMessage('Please provide a valid phone number'),
    
  body('submitterInfo.designation')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Designation cannot exceed 50 characters')
];

// Validation for company ID parameter
const validateCompanyId = [
  param('companyId')
    .isMongoId()
    .withMessage('Invalid company ID format')
];

// Validation for tracking company interaction
const validateTrackingData = [
  body('action')
    .optional()
    .isIn(['click', 'view', 'quote'])
    .withMessage('Action must be click, view, or quote')
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
    .isIn(['rating', 'established', 'clickCount', 'createdAt', 'name'])
    .withMessage('Invalid sort field'),
    
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc'),
    
  query('minRating')
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage('Rating must be between 0 and 5'),
    
  query('cargoType')
    .optional()
    .custom((value) => {
      const validTypes = [
        'Electronics', 'Textiles', 'Machinery', 'Chemicals', 'Automotive',
        'Food Products', 'Pharmaceuticals', 'Oil & Gas', 'Raw Materials',
        'Mining Equipment', 'Agricultural Products', 'Bulk Commodities',
        'Consumer Goods', 'Medical Equipment', 'Hazardous Materials'
      ];
      return validTypes.includes(value);
    })
    .withMessage('Invalid cargo type'),
    
  query('shipmentType')
    .optional()
    .isIn(['Road', 'Rail', 'Ship', 'Air'])
    .withMessage('Invalid shipment type'),
    
  query('coverage')
    .optional()
    .isIn(['Local', 'Regional', 'National', 'International', 'Global'])
    .withMessage('Invalid coverage type')
];

// Routes

// GET /api/companies - Get companies with filtering and pagination
router.get('/', validateQueryParams, getCompanies);

// GET /api/companies/filter-options - Get available filter options
router.get('/filter-options', getFilterOptions);

// GET /api/companies/stats - Get company statistics
router.get('/stats', getCompanyStats);

// GET /api/companies/:companyId - Get specific company details
router.get('/:companyId', validateCompanyId, getCompanyById);

// POST /api/companies - Submit new company for approval
router.post('/', validateCompanySubmission, submitCompany);

// POST /api/companies/submit - Alternate endpoint for company submission
router.post('/submit', validateCompanySubmission, submitCompany);

// POST /api/companies/:companyId/track - Track company interaction
router.post('/:companyId/track', validateCompanyId, validateTrackingData, trackCompanyClick);

module.exports = router;