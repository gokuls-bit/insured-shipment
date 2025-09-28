// src/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const logger = require('../utils/logger');

// Authenticate admin middleware
const authenticateAdmin = async (req, res, next) => {
  try {
    let token;

    // Get token from header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
        code: 'NO_TOKEN'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key_change_in_production');

      // Check if token has required fields
      if (!decoded.id || !decoded.username) {
        return res.status(401).json({
          success: false,
          message: 'Invalid token format',
          code: 'INVALID_TOKEN_FORMAT'
        });
      }

      // Get admin from token
      const admin = await Admin.findById(decoded.id).select('-password');

      if (!admin) {
        logger.warn('Token used for non-existent admin', { adminId: decoded.id });
        return res.status(401).json({
          success: false,
          message: 'Invalid token - admin not found',
          code: 'ADMIN_NOT_FOUND'
        });
      }

      // Check if admin account is active
      if (!admin.isActive) {
        logger.warn('Token used for inactive admin', { 
          adminId: admin._id, 
          username: admin.username 
        });
        return res.status(401).json({
          success: false,
          message: 'Account deactivated. Please contact administrator.',
          code: 'ACCOUNT_INACTIVE'
        });
      }

      // Check if admin account is locked
      if (admin.isLocked) {
        logger.warn('Token used for locked admin', { 
          adminId: admin._id, 
          username: admin.username 
        });
        return res.status(423).json({
          success: false,
          message: 'Account temporarily locked due to security reasons',
          code: 'ACCOUNT_LOCKED',
          lockUntil: admin.lockUntil
        });
      }

      // Attach admin to request object
      req.admin = admin;

      // Update last activity
      admin.lastActivity = new Date();
      await admin.save();

      next();

    } catch (jwtError) {
      logger.warn('JWT verification failed', { 
        error: jwtError.message,
        ip: req.ip 
      });

      // Handle specific JWT errors
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token has expired. Please login again.',
          code: 'TOKEN_EXPIRED',
          expiredAt: jwtError.expiredAt
        });
      } else if (jwtError.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          message: 'Invalid token format',
          code: 'INVALID_TOKEN'
        });
      } else if (jwtError.name === 'NotBeforeError') {
        return res.status(401).json({
          success: false,
          message: 'Token not active yet',
          code: 'TOKEN_NOT_ACTIVE'
        });
      } else {
        return res.status(401).json({
          success: false,
          message: 'Token verification failed',
          code: 'TOKEN_VERIFICATION_FAILED'
        });
      }
    }

  } catch (error) {
    logger.error('Authentication middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication error',
      code: 'AUTH_ERROR',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Require super admin privileges
const requireSuperAdmin = (req, res, next) => {
  try {
    if (!req.admin) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
        code: 'AUTH_REQUIRED'
      });
    }

    if (req.admin.role !== 'super_admin') {
      logger.warn('Insufficient privileges attempted', {
        adminId: req.admin._id,
        username: req.admin.username,
        role: req.admin.role,
        requiredRole: 'super_admin',
        ip: req.ip,
        endpoint: req.originalUrl
      });

      return res.status(403).json({
        success: false,
        message: 'Access denied. Super admin privileges required.',
        code: 'INSUFFICIENT_PRIVILEGES',
        required: 'super_admin',
        current: req.admin.role
      });
    }

    next();
  } catch (error) {
    logger.error('Super admin check error:', error);
    res.status(500).json({
      success: false,
      message: 'Authorization error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Require specific permission
const requirePermission = (permission) => {
  return (req, res, next) => {
    try {
      if (!req.admin) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
          code: 'AUTH_REQUIRED'
        });
      }

      // Super admins have all permissions
      if (req.admin.role === 'super_admin') {
        return next();
      }

      // Check if admin has the required permission
      if (!req.admin.hasPermission(permission)) {
        logger.warn('Permission denied', {
          adminId: req.admin._id,
          username: req.admin.username,
          role: req.admin.role,
          requiredPermission: permission,
          userPermissions: req.admin.permissions,
          ip: req.ip,
          endpoint: req.originalUrl
        });

        return res.status(403).json({
          success: false,
          message: `Access denied. Permission '${permission}' required.`,
          code: 'PERMISSION_DENIED',
          required: permission,
          userPermissions: req.admin.permissions
        });
      }

      next();
    } catch (error) {
      logger.error('Permission check error:', error);
      res.status(500).json({
        success: false,
        message: 'Authorization error',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  };
};

// Optional authentication (attach admin if token present, but don't require it)
const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key_change_in_production');
        const admin = await Admin.findById(decoded.id).select('-password');
        
        if (admin && admin.isActive && !admin.isLocked) {
          req.admin = admin;
          admin.lastActivity = new Date();
          await admin.save();
        }
      } catch (jwtError) {
        // Silently ignore JWT errors for optional auth
        logger.debug('Optional auth JWT error (ignored):', jwtError.message);
      }
    }

    next();
  } catch (error) {
    // Don't fail on optional auth errors
    logger.warn('Optional auth error (continuing):', error);
    next();
  }
};

// Middleware to check if admin can perform action on specific resource
const canAccessResource = (resourceType) => {
  return async (req, res, next) => {
    try {
      const { companyId } = req.params;
      
      // Super admins can access all resources
      if (req.admin.role === 'super_admin') {
        return next();
      }

      // Add specific resource access logic here
      // For example, checking if admin created the resource, or has department access, etc.
      
      switch (resourceType) {
        case 'company':
          // Example: Check if admin has approved this company before
          // or if they have permission to access companies from this region
          // This can be extended based on business requirements
          if (req.admin.hasPermission('view_companies')) {
            return next();
          }
          break;
          
        case 'payment':
          if (req.admin.hasPermission('view_payments')) {
            return next();
          }
          break;
          
        default:
          return next();
      }

      return res.status(403).json({
        success: false,
        message: `Access denied to ${resourceType} resource`,
        code: 'RESOURCE_ACCESS_DENIED'
      });

    } catch (error) {
      logger.error('Resource access check error:', error);
      res.status(500).json({
        success: false,
        message: 'Resource access check failed',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  };
};

// Middleware to log admin actions
const logAdminAction = (action) => {
  return (req, res, next) => {
    // Store action info for post-response logging
    req.adminAction = {
      action,
      timestamp: new Date(),
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      endpoint: req.originalUrl,
      method: req.method
    };

    // Override res.json to log after response
    const originalJson = res.json;
    res.json = function(data) {
      // Log the action
      if (req.admin && req.adminAction) {
        logger.info('Admin action logged', {
          adminId: req.admin._id,
          username: req.admin.username,
          action: req.adminAction.action,
          success: data.success !== false,
          ip: req.adminAction.ip,
          endpoint: req.adminAction.endpoint,
          method: req.adminAction.method,
          timestamp: req.adminAction.timestamp
        });
      }

      // Call original json method
      originalJson.call(this, data);
    };

    next();
  };
};

module.exports = {
  authenticateAdmin,
  requireSuperAdmin,
  requirePermission,
  optionalAuth,
  canAccessResource,
  logAdminAction
};