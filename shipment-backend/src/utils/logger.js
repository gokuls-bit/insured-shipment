// src/utils/logger.js
const winston = require('winston');
const path = require('path');

// Define log levels with priorities
const logLevels = {
  levels: {
    error: 0,
    security: 1,
    warn: 2,
    info: 3,
    http: 4,
    debug: 5
  },
  colors: {
    error: 'red',
    security: 'magenta',
    warn: 'yellow',
    info: 'blue',
    http: 'green',
    debug: 'cyan'
  }
};

// Add colors to winston
winston.addColors(logLevels.colors);

// Custom format for console output
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.colorize({ all: true }),
  winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
    let log = `${timestamp} [${level}]: ${message}`;
    
    // Add metadata if present
    if (Object.keys(meta).length > 0) {
      log += ` ${JSON.stringify(meta, null, 2)}`;
    }
    
    // Add stack trace for errors
    if (stack) {
      log += `\n${stack}`;
    }
    
    return log;
  })
);

// Custom format for file output
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Create logs directory if it doesn't exist
const fs = require('fs');
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Define transports
const transports = [];

// Console transport (only in development)
if (process.env.NODE_ENV !== 'production') {
  transports.push(
    new winston.transports.Console({
      level: process.env.LOG_LEVEL || 'debug',
      format: consoleFormat
    })
  );
}

// File transport for all logs
transports.push(
  new winston.transports.File({
    filename: path.join(logsDir, 'combined.log'),
    level: 'info',
    format: fileFormat,
    maxsize: 10 * 1024 * 1024, // 10MB
    maxFiles: 10,
    tailable: true
  })
);

// File transport for error logs
transports.push(
  new winston.transports.File({
    filename: path.join(logsDir, 'error.log'),
    level: 'error',
    format: fileFormat,
    maxsize: 10 * 1024 * 1024, // 10MB
    maxFiles: 5,
    tailable: true
  })
);

// File transport for security logs
transports.push(
  new winston.transports.File({
    filename: path.join(logsDir, 'security.log'),
    level: 'security',
    format: fileFormat,
    maxsize: 5 * 1024 * 1024, // 5MB
    maxFiles: 5,
    tailable: true
  })
);

// File transport for HTTP requests (in production)
if (process.env.NODE_ENV === 'production') {
  transports.push(
    new winston.transports.File({
      filename: path.join(logsDir, 'http.log'),
      level: 'http',
      format: fileFormat,
      maxsize: 20 * 1024 * 1024, // 20MB
      maxFiles: 7,
      tailable: true
    })
  );
}

// Create logger instance
const logger = winston.createLogger({
  levels: logLevels.levels,
  level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
  format: fileFormat,
  transports,
  exitOnError: false,
  
  // Handle uncaught exceptions and unhandled promise rejections
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(logsDir, 'exceptions.log'),
      format: fileFormat,
      maxsize: 5 * 1024 * 1024,
      maxFiles: 3
    })
  ],
  
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join(logsDir, 'rejections.log'),
      format: fileFormat,
      maxsize: 5 * 1024 * 1024,
      maxFiles: 3
    })
  ]
});

// Enhanced logging methods
logger.security = (message, meta = {}) => {
  logger.log({
    level: 'security',
    message,
    timestamp: new Date().toISOString(),
    ...meta
  });
};

logger.http = (message, meta = {}) => {
  logger.log({
    level: 'http',
    message,
    timestamp: new Date().toISOString(),
    ...meta
  });
};

// Method to log API requests
logger.logRequest = (req, res, responseTime) => {
  const logData = {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    statusCode: res.statusCode,
    responseTime: `${responseTime}ms`,
    contentLength: res.get('Content-Length') || 0
  };

  // Add user information if available
  if (req.admin) {
    logData.admin = {
      id: req.admin._id,
      username: req.admin.username,
      role: req.admin.role
    };
  }

  // Add request body for POST/PUT requests (excluding sensitive data)
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    const sanitizedBody = { ...req.body };
    
    // Remove sensitive fields
    delete sanitizedBody.password;
    delete sanitizedBody.token;
    delete sanitizedBody.signature;
    
    if (Object.keys(sanitizedBody).length > 0) {
      logData.body = sanitizedBody;
    }
  }

  const level = res.statusCode >= 400 ? 'warn' : 'http';
  logger.log({
    level,
    message: `${req.method} ${req.originalUrl} ${res.statusCode}`,
    ...logData
  });
};

// Method to log database operations
logger.logDatabase = (operation, collection, query = {}, result = {}) => {
  logger.debug('Database operation', {
    operation,
    collection,
    query: typeof query === 'object' ? JSON.stringify(query) : query,
    resultCount: result.length || (result.matchedCount || result.modifiedCount || 1),
    timestamp: new Date().toISOString()
  });
};

// Method to log payment operations
logger.logPayment = (operation, data = {}) => {
  logger.info(`Payment ${operation}`, {
    operation,
    paymentId: data.paymentId,
    orderId: data.orderId,
    amount: data.amount,
    currency: data.currency,
    status: data.status,
    companyId: data.companyId,
    timestamp: new Date().toISOString()
  });
};

// Method to log admin actions
logger.logAdminAction = (action, adminId, adminUsername, details = {}) => {
  logger.info(`Admin action: ${action}`, {
    action,
    adminId,
    adminUsername,
    ...details,
    timestamp: new Date().toISOString()
  });
};

// Method to create child logger with context
logger.child = (context) => {
  return {
    error: (message, meta = {}) => logger.error(message, { ...context, ...meta }),
    security: (message, meta = {}) => logger.security(message, { ...context, ...meta }),
    warn: (message, meta = {}) => logger.warn(message, { ...context, ...meta }),
    info: (message, meta = {}) => logger.info(message, { ...context, ...meta }),
    http: (message, meta = {}) => logger.http(message, { ...context, ...meta }),
    debug: (message, meta = {}) => logger.debug(message, { ...context, ...meta })
  };
};

// Graceful shutdown handler
process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down...');
  process.exit(0);
});

module.exports = logger;