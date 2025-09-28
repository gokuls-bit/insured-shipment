// src/middlewares/errorHandler.js
const logger = require('../utils/logger');

// Global error handler middleware
const errorHandler = (error, req, res, next) => {
  let err = { ...error };
  err.message = error.message;

  // Log error details
  logger.error('Error Handler:', {
    error: error.message,
    stack: error.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    body: req.body,
    params: req.params,
    query: req.query,
    admin: req.admin ? { id: req.admin._id, username: req.admin.username } : null
  });

  // Mongoose bad ObjectId error
  if (error.name === 'CastError') {
    const message = 'Resource not found';
    err = { 
      message, 
      statusCode: 404,
      code: 'RESOURCE_NOT_FOUND'
    };
  }

  // Mongoose duplicate key error
  if (error.code === 11000) {
    const duplicateField = Object.keys(error.keyValue)[0];
    const message = `Duplicate value for field '${duplicateField}'. This ${duplicateField} already exists.`;
    err = { 
      message, 
      statusCode: 409,
      code: 'DUPLICATE_RESOURCE',
      field: duplicateField,
      value: error.keyValue[duplicateField]
    };
  }

  // Mongoose validation error
  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map(val => ({
      field: val.path,
      message: val.message,
      value: val.value
    }));
    
    err = { 
      message: 'Validation failed',
      statusCode: 400,
      code: 'VALIDATION_ERROR',
      errors
    };
  }

  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    err = { 
      message, 
      statusCode: 401,
      code: 'INVALID_JWT'
    };
  }

  if (error.name === 'TokenExpiredError') {
    const message = 'Token expired';
    err = { 
      message, 
      statusCode: 401,
      code: 'JWT_EXPIRED',
      expiredAt: error.expiredAt
    };
  }

  // Razorpay errors
  if (error.error && error.error.code) {
    const message = error.error.description || 'Payment gateway error';
    err = {
      message,
      statusCode: 400,
      code: 'PAYMENT_GATEWAY_ERROR',
      gatewayCode: error.error.code,
      gatewayMessage: error.error.description
    };
  }

  // File upload errors
  if (error.code === 'LIMIT_FILE_SIZE') {
    const message = 'File size too large';
    err = {
      message,
      statusCode: 413,
      code: 'FILE_TOO_LARGE'
    };
  }

  if (error.code === 'LIMIT_FILE_COUNT') {
    const message = 'Too many files uploaded';
    err = {
      message,
      statusCode: 413,
      code: 'TOO_MANY_FILES'
    };
  }

  // Rate limiting errors
  if (error.message && error.message.includes('Too many requests')) {
    err = {
      message: 'Rate limit exceeded. Please try again later.',
      statusCode: 429,
      code: 'RATE_LIMIT_EXCEEDED',
      retryAfter: error.retryAfter || 900 // 15 minutes default
    };
  }

  // Database connection errors
  if (error.name === 'MongoNetworkError' || error.name === 'MongoTimeoutError') {
    const message = 'Database connection error';
    err = {
      message,
      statusCode: 503,
      code: 'DATABASE_CONNECTION_ERROR'
    };
  }

  // Permission/Authorization errors
  if (error.message && error.message.includes('permission')) {
    err = {
      message: error.message,
      statusCode: 403,
      code: 'PERMISSION_DENIED'
    };
  }

  // Network/External API errors
  if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
    const message = 'External service unavailable';
    err = {
      message,
      statusCode: 503,
      code: 'EXTERNAL_SERVICE_ERROR'
    };
  }

  // Determine final status code
  const statusCode = err.statusCode || error.statusCode || 500;
  
  // Prepare error response
  const errorResponse = {
    success: false,
    message: err.message || 'Internal Server Error',
    code: err.code || 'INTERNAL_ERROR',
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
    method: req.method
  };

  // Add additional error details in development
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = error.stack;
    errorResponse.details = {
      name: error.name,
      code: error.code,
      originalMessage: error.message
    };
  }

  // Add specific error fields if they exist
  if (err.errors) {
    errorResponse.validationErrors = err.errors;
  }
  
  if (err.field && err.value) {
    errorResponse.duplicateField = {
      field: err.field,
      value: err.value
    };
  }

  if (err.expiredAt) {
    errorResponse.expiredAt = err.expiredAt;
  }

  if (err.retryAfter) {
    errorResponse.retryAfter = err.retryAfter;
    res.set('Retry-After', err.retryAfter);
  }

  if (err.gatewayCode) {
    errorResponse.gateway = {
      code: err.gatewayCode,
      message: err.gatewayMessage
    };
  }

  // Set appropriate headers
  res.set('Content-Type', 'application/json');
  
  // Send error response
  res.status(statusCode).json(errorResponse);
};

// Async error wrapper to catch async errors in route handlers
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// 404 error handler for undefined routes
const notFound = (req, res) => {
  const message = `Route ${req.originalUrl} not found`;
  
  logger.warn('404 Route not found:', {
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  res.status(404).json({
    success: false,
    message,
    code: 'ROUTE_NOT_FOUND',
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
    method: req.method,
    availableRoutes: [
      '/api/companies',
      '/api/admin',
      '/api/payments',
      '/api/health'
    ]
  });
};

// Validation error handler for express-validator
const handleValidationErrors = (req, res, next) => {
  const { validationResult } = require('express-validator');
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(error => ({
      field: error.path || error.param,
      message: error.msg,
      value: error.value,
      location: error.location
    }));

    logger.warn('Validation errors:', {
      url: req.originalUrl,
      method: req.method,
      errors: formattedErrors,
      body: req.body,
      ip: req.ip
    });

    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      code: 'VALIDATION_ERROR',
      errors: formattedErrors,
      timestamp: new Date().toISOString(),
      path: req.originalUrl
    });
  }
  
  next();
};

module.exports = {
  errorHandler,
  asyncHandler,
  notFound,
  handleValidationErrors
};