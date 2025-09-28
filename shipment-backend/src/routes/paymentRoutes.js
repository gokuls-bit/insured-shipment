// src/routes/paymentRoutes.js
const express = require('express');
const { body, param, query } = require('express-validator');
const {
  createPaymentOrder,
  verifyPayment,
  getPaymentStatus,
  handleWebhook,
  getPaymentAnalytics,
  initiateRefund
} = require('../controllers/paymentController');
const { authenticateAdmin } = require('../middlewares/authMiddleware');
const { paymentLimiter } = require('../middlewares/rateLimiter');

const router = express.Router();

// Validation for payment order creation
const validatePaymentOrder = [
  body('companyId')
    .isMongoId()
    .withMessage('Valid company ID is required'),

  body('amount')
    .optional()
    .isInt({ min: 100, max: 10000000 }) // Min ₹1, Max ₹100,000 (in paisa)
    .withMessage('Amount must be between ₹1 and ₹100,000 (in paisa)'),

  body('currency')
    .optional()
    .isIn(['INR', 'USD', 'EUR', 'GBP'])
    .withMessage('Currency must be INR, USD, EUR, or GBP')
];

// Validation for payment verification
const validatePaymentVerification = [
  body('paymentId')
    .notEmpty()
    .trim()
    .withMessage('Payment ID is required'),

  body('orderId')
    .notEmpty()
    .trim()
    .withMessage('Order ID is required'),

  body('signature')
    .notEmpty()
    .trim()
    .withMessage('Payment signature is required'),

  body('paymentMethod')
    .optional()
    .isIn(['card', 'netbanking', 'upi', 'wallet', 'emi', 'paylater'])
    .withMessage('Invalid payment method'),

  body('additionalData')
    .optional()
    .isObject()
    .withMessage('Additional data must be an object')
];

// Validation for refund initiation
const validateRefundRequest = [
  body('amount')
    .optional()
    .isInt({ min: 100 })
    .withMessage('Refund amount must be at least ₹1 (in paisa)'),

  body('reason')
    .trim()
    .isLength({ min: 10, max: 200 })
    .withMessage('Refund reason must be between 10 and 200 characters')
];

// Validation for analytics query
const validateAnalyticsQuery = [
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be in ISO 8601 format'),

  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be in ISO 8601 format'),

  query('groupBy')
    .optional()
    .isIn(['day', 'week', 'month'])
    .withMessage('Group by must be day, week, or month')
];

// Validation for payment ID parameter
const validatePaymentId = [
  param('paymentId')
    .notEmpty()
    .trim()
    .withMessage('Payment ID is required')
];

// Routes

// POST /api/payments/create-order - Create payment order
router.post('/create-order', paymentLimiter, validatePaymentOrder, createPaymentOrder);

// POST /api/payments/verify - Verify payment
router.post('/verify', paymentLimiter, validatePaymentVerification, verifyPayment);

// GET /api/payments/:paymentId/status - Get payment status
router.get('/:paymentId/status', validatePaymentId, getPaymentStatus);

// POST /api/payments/webhook - Handle Razorpay webhooks
router.post('/webhook', handleWebhook);

// Protected routes (Admin only)
router.use(authenticateAdmin);

// GET /api/payments/analytics - Get payment analytics
router.get('/analytics', validateAnalyticsQuery, getPaymentAnalytics);

// POST /api/payments/:paymentId/refund - Initiate refund
router.post('/:paymentId/refund', validatePaymentId, validateRefundRequest, initiateRefund);

module.exports = router;
