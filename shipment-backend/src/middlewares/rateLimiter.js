// src/middlewares/rateLimiter.js
const rateLimit = require('express-rate-limit');
const logger = require('../utils/logger');

// Custom rate limit store (in-memory)
class MemoryStore {
  constructor() {
    this.hits = new Map();
    this.resetTime = new Map();
  }

  incr(key, callback) {
    const now = Date.now();
    const resetTime = this.resetTime.get(key);

    if (resetTime && now < resetTime) {
      const hits = this.hits.get(key) || 0;
      this.hits.set(key, hits + 1);
      callback(null, hits + 1, resetTime);
    } else {
      this.hits.set(key, 1);
      const newResetTime = now + (15 * 60 * 1000); // 15 minutes from now
      this.resetTime.set(key, newResetTime);
      callback(null, 1, newResetTime);
    }
  }

  decrement(key) {
    const hits = this.hits.get(key) || 0;
    if (hits > 0) {
      this.hits.set(key, hits - 1);
    }
  }

  resetKey(key) {
    this.hits.delete(key);
    this.resetTime.delete(key);
  }

  resetAll() {
    this.hits.clear();
    this.resetTime.clear();
  }
}

// Create store instance
const store = new MemoryStore();

// Custom key generator that includes user identification
const generateKey = (req) => {
  const ip = req.ip || req.connection.remoteAddress;
  const userId = req.admin?.id || 'anonymous';
  const userAgent = req.get('User-Agent') || 'unknown';
  
  // Create a more specific key for authenticated users
  if (req.admin) {
    return `${userId}-${ip}`;
  }
  
  // For anonymous users, use IP + partial user agent
  const shortAgent = userAgent.substring(0, 50);
  return `${ip}-${Buffer.from(shortAgent).toString('base64').substring(0, 10)}`;
};

// Custom handler for rate limit exceeded
const rateLimitHandler = (req, res) => {
  const key = generateKey(req);
  
  logger.warn('Rate limit exceeded', {
    key,
    ip: req.ip,
    url: req.originalUrl,
    method: req.method,
    userAgent: req.get('User-Agent'),
    admin: req.admin ? { id: req.admin._id, username: req.admin.username } : null
  });

  res.status(429).json({
    success: false,
    message: 'Too many requests from this client. Please try again later.',
    code: 'RATE_LIMIT_EXCEEDED',
    retryAfter: 900, // 15 minutes
    limit: req.rateLimit?.limit || 'unknown',
    remaining: 0,
    reset: new Date(Date.now() + 15 * 60 * 1000).toISOString()
  });
};

// General API rate limiting (more permissive)
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: (req) => {
    // Higher limits for authenticated admin users
    if (req.admin) {
      return req.admin.role === 'super_admin' ? 500 : 300;
    }
    // Lower limit for anonymous users
    return 100;
  },
  message: rateLimitHandler,
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false,
  keyGenerator: generateKey,
  store: store,
  skip: (req) => {
    // Skip rate limiting for health checks
    return req.url === '/api/health';
  },
  onLimitReached: (req, res, options) => {
    logger.warn('Rate limit reached', {
      key: generateKey(req),
      ip: req.ip,
      url: req.originalUrl,
      limit: options.max,
      windowMs: options.windowMs
    });
  }
});

// Payment API rate limiting (more restrictive)
const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: (req) => {
    // Very low limit for payment operations
    if (req.admin) {
      return 50; // Admins can make more payment-related requests
    }
    return 10; // Regular users limited to 10 payment requests
  },
  message: rateLimitHandler,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: generateKey,
  store: store,
  skipSuccessfulRequests: false, // Count all requests, not just failed ones
  skipFailedRequests: false,
  onLimitReached: (req, res, options) => {
    logger.error('Payment rate limit reached', {
      key: generateKey(req),
      ip: req.ip,
      url: req.originalUrl,
      method: req.method,
      limit: options.max,
      admin: req.admin ? req.admin.username : null
    });
  }
});

// Admin login rate limiting (very restrictive)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login attempts per windowMs
  message: (req, res) => {
    logger.security('Login rate limit exceeded', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      url: req.originalUrl,
      body: { username: req.body?.username } // Log username attempt
    });

    res.status(429).json({
      success: false,
      message: 'Too many login attempts. Please try again later.',
      code: 'LOGIN_RATE_LIMIT_EXCEEDED',
      retryAfter: 900,
      lockoutTime: '15 minutes'
    });
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Use IP + attempted username for login rate limiting
    const ip = req.ip;
    const username = req.body?.username || 'unknown';
    return `login-${ip}-${username}`;
  },
  store: store,
  skipSuccessfulRequests: true, // Don't count successful logins against the limit
  skipFailedRequests: false,
  onLimitReached: (req, res, options) => {
    logger.security('Login rate limit reached - potential brute force attack', {
      ip: req.ip,
      username: req.body?.username,
      userAgent: req.get('User-Agent'),
      limit: options.max,
      windowMs: options.windowMs
    });
  }
});

// Company submission rate limiting
const companySubmissionLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Max 3 company submissions per hour
  message: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many company submissions. You can submit maximum 3 companies per hour.',
      code: 'SUBMISSION_RATE_LIMIT',
      retryAfter: 3600,
      limit: 3,
      window: '1 hour'
    });
  },
  keyGenerator: (req) => {
    // Rate limit by email address for company submissions
    const email = req.body?.submitterInfo?.email || req.ip;
    return `company-submission-${email}`;
  },
  store: store
});

// Webhook rate limiting (for external services)
const webhookLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // Allow many webhook calls
  message: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Webhook rate limit exceeded',
      code: 'WEBHOOK_RATE_LIMIT'
    });
  },
  keyGenerator: (req) => {
    // Rate limit webhooks by origin IP
    return `webhook-${req.ip}`;
  },
  store: store,
  skip: (req) => {
    // Skip rate limiting if proper webhook signature is present
    return req.headers['x-razorpay-signature'] ? false : true;
  }
});

// Analytics/reporting rate limiting
const analyticsLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
// Analytics/reporting rate limiting
const analyticsLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: (req) => {
    if (req.admin?.role === 'super_admin') return 100;
    if (req.admin) return 50;
    return 10; // Anonymous users get very limited analytics access
  },
  message: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Analytics request limit exceeded. Please wait before making more requests.',
      code: 'ANALYTICS_RATE_LIMIT'
    });
  },
  keyGenerator: generateKey,
  store: store
});

// File upload rate limiting
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Max 20 file uploads per 15 minutes
  message: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'File upload limit exceeded. Please wait before uploading more files.',
      code: 'UPLOAD_RATE_LIMIT'
    });
  },
  keyGenerator: generateKey,
  store: store
});

// Create a dynamic rate limiter factory
const createCustomLimiter = (options) => {
  const {
    windowMs = 15 * 60 * 1000,
    max = 100,
    message = 'Rate limit exceeded',
    keyGenerator = generateKey,
    skipSuccessfulRequests = false,
    skipFailedRequests = false
  } = options;

  return rateLimit({
    windowMs,
    max,
    message: (req, res) => {
      res.status(429).json({
        success: false,
        message,
        code: 'CUSTOM_RATE_LIMIT',
        retryAfter: Math.ceil(windowMs / 1000)
      });
    },
    keyGenerator,
    store: store,
    skipSuccessfulRequests,
    skipFailedRequests,
    standardHeaders: true,
    legacyHeaders: false
  });
};

// Middleware to reset rate limit for specific user (useful for admin operations)
const resetRateLimit = (key) => {
  store.resetKey(key);
};

// Middleware to check rate limit status without incrementing
const checkRateLimit = (limiterConfig) => {
  return (req, res, next) => {
    const key = generateKey(req);
    // This is a simplified check - in production, you'd want more sophisticated logic
    next();
  };
};

// Export all limiters and utilities
module.exports = {
  generalLimiter,
  paymentLimiter,
  loginLimiter,
  companySubmissionLimiter,
  webhookLimiter,
  analyticsLimiter,
  uploadLimiter,
  createCustomLimiter,
  resetRateLimit,
  checkRateLimit,
  generateKey,
  store
}
