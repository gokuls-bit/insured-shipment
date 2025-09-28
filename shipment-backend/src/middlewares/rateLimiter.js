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
      const newResetTime = now + (15 * 60 * 1000); // 15 minutes
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

// Custom key generator
const generateKey = (req) => {
  const ip = req.ip || req.connection.remoteAddress;
  const userId = req.admin?.id || 'anonymous';
  const userAgent = req.get('User-Agent') || 'unknown';

  if (req.admin) {
    return `${userId}-${ip}`;
  }

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
    retryAfter: 900,
    limit: req.rateLimit?.limit || 'unknown',
    remaining: 0,
    reset: new Date(Date.now() + 15 * 60 * 1000).toISOString()
  });
};

// Login-specific response helper so handler and message can reuse the same behavior
const loginRateLimitResponse = (req, res) => {
  logger.security('Login rate limit exceeded', {
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    url: req.originalUrl,
    body: { username: req.body?.username }
  });

  res.status(429).json({
    success: false,
    message: 'Too many login attempts. Please try again later.',
    code: 'LOGIN_RATE_LIMIT_EXCEEDED',
    retryAfter: 900,
    lockoutTime: '15 minutes'
  });
};

// General API limiter
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: (req) => {
    if (req.admin) {
      return req.admin.role === 'super_admin' ? 500 : 300;
    }
    return 100;
  },
  message: rateLimitHandler,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: generateKey,
  store: store,
  skip: (req) => req.url === '/api/health',
  handler: (req, res, next, options) => {
    logger.warn('Rate limit reached', {
      key: generateKey(req),
      ip: req.ip,
      url: req.originalUrl,
      limit: options?.max,
      windowMs: options?.windowMs
    });

    // reuse configured response handler
    return rateLimitHandler(req, res);
  }
});

// Payment API limiter
const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: (req) => (req.admin ? 50 : 10),
  message: rateLimitHandler,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: generateKey,
  store: store,
  skipSuccessfulRequests: false,
  skipFailedRequests: false,
  handler: (req, res, next, options) => {
    logger.error('Payment rate limit reached', {
      key: generateKey(req),
      ip: req.ip,
      url: req.originalUrl,
      method: req.method,
      limit: options?.max,
      admin: req.admin ? req.admin.username : null
    });

    return rateLimitHandler(req, res);
  }
});

// Login limiter
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: (req, res) => {
    logger.security('Login rate limit exceeded', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      url: req.originalUrl,
      body: { username: req.body?.username }
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
    const ip = req.ip;
    const username = req.body?.username || 'unknown';
    return `login-${ip}-${username}`;
  },
  store: store,
  skipSuccessfulRequests: true,
  skipFailedRequests: false,
  // When login attempts exceed the limit, log a security warning then send the
  // same response defined in `loginRateLimitResponse`.
  handler: (req, res, next, options) => {
    logger.security('Login rate limit reached - potential brute force', {
      ip: req.ip,
      username: req.body?.username,
      userAgent: req.get('User-Agent'),
      limit: options?.max,
      windowMs: options?.windowMs
    });

    return loginRateLimitResponse(req, res);
  },
  message: loginRateLimitResponse,
});

// Company submission limiter
const companySubmissionLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many company submissions. Max 3 per hour allowed.',
      code: 'SUBMISSION_RATE_LIMIT',
      retryAfter: 3600,
      limit: 3,
      window: '1 hour'
    });
  },
  keyGenerator: (req) => {
    const email = req.body?.submitterInfo?.email || req.ip;
    return `company-submission-${email}`;
  },
  store: store
});

// Webhook limiter
const webhookLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  message: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Webhook rate limit exceeded',
      code: 'WEBHOOK_RATE_LIMIT'
    });
  },
  keyGenerator: (req) => `webhook-${req.ip}`,
  store: store,
  skip: (req) => !req.headers['x-razorpay-signature']
});

// Analytics limiter
const analyticsLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: (req) => {
    if (req.admin?.role === 'super_admin') return 100;
    if (req.admin) return 50;
    return 10;
  },
  message: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Analytics request limit exceeded. Please wait before retrying.',
      code: 'ANALYTICS_RATE_LIMIT'
    });
  },
  keyGenerator: generateKey,
  store: store
});

// Upload limiter
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'File upload limit exceeded. Please wait before uploading again.',
      code: 'UPLOAD_RATE_LIMIT'
    });
  },
  keyGenerator: generateKey,
  store: store
});

// Custom limiter factory
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

// Reset and check helpers
const resetRateLimit = (key) => {
  store.resetKey(key);
};

const checkRateLimit = (limiterConfig) => {
  return (req, res, next) => {
    const key = generateKey(req);
    // TODO: implement inspection without incrementing
    next();
  };
};

// Export
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
};
Invoke-WebRequest -UseBasicParsing -Uri 'http://localhost:5000/api/health' | Select-Object -ExpandProperty ContentInvoke-WebRequest -UseBasicParsing -Uri 'http://localhost:5000/api/health' | Select-Object -ExpandProperty Content
