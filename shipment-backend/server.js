// server.js — Shipment Insurance Management Backend (Redis Skipped Version)
// ------------------------------------------------------------

require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const logger = require('./src/utils/logger');
const routes = require('./src/routes');
const { errorHandler, notFound } = require('./src/middlewares/errorMiddleware');
const connectDB = require('./src/config/db');

// ------------------------------------------------------------
// Global Setup
// ------------------------------------------------------------
const app = express();
const PORT = parseInt(process.env.PORT, 10) || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';
let server = null;
let shuttingDown = false;

// ------------------------------------------------------------
// Feature Status Object
// ------------------------------------------------------------
const features = {
  database: { name: 'MongoDB', status: 'pending' },
  redis: { name: 'Redis', status: 'skipped' }, // Redis skipped
  routes: [],
  services: [],
};

// ------------------------------------------------------------
// Logging Helpers
// ------------------------------------------------------------
const debug = (msg) => console.log(`[DEBUG] ${msg}`);
const success = (msg) => console.log(`✅ ${msg}`);
const info = (msg) => console.log(`📍 ${msg}`);
const warn = (msg) => console.log(`⚠️ ${msg}`);
const error = (msg) => console.error(`❌ ${msg}`);

// ------------------------------------------------------------
// Parse allowed CORS origins
// ------------------------------------------------------------
function parseOrigins(originsEnv) {
  if (!originsEnv) return ['http://localhost:5173'];
  return originsEnv.split(',').map((s) => s.trim()).filter(Boolean);
}

// ------------------------------------------------------------
// Security & Rate Limiting
// ------------------------------------------------------------
const RATE_LIMIT_WINDOW_MIN = parseInt(process.env.RATE_LIMIT_WINDOW, 10) || 15;
const RATE_LIMIT_MAX = parseInt(process.env.RATE_LIMIT_MAX, 10) || 100;

app.use(helmet());
app.use(cors({
  origin: function (origin, callback) {
    const whitelist = parseOrigins(process.env.CORS_ORIGINS);
    if (!origin || whitelist.includes(origin)) callback(null, true);
    else callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  optionsSuccessStatus: 200,
}));

app.use(rateLimit({
  windowMs: RATE_LIMIT_WINDOW_MIN * 60 * 1000,
  max: RATE_LIMIT_MAX,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(mongoSanitize());

// ------------------------------------------------------------
// Request Logging
// ------------------------------------------------------------
app.use((req, res, next) => {
  req.correlationId = `req-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  logger.info({
    msg: 'incoming_request',
    correlationId: req.correlationId,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('user-agent') || null,
  });
  next();
});

// ------------------------------------------------------------
// Health Check Endpoint
// ------------------------------------------------------------
app.get('/api/v1/health', async (req, res) => {
  try {
    const mongoose = require('mongoose');
    const health = {
      status: 'OK',
      nodeEnv: NODE_ENV,
      timestamp: new Date().toISOString(),
      services: {
        database: mongoose.connection?.readyState === 1 ? 'Connected' : 'Disconnected',
        redis: 'skipped',
      },
    };
    res.status(200).json(health);
  } catch (err) {
    logger.error('health_check_failed', { err });
    res.status(503).json({ status: 'ERROR', message: 'Health check failed' });
  }
});

// ------------------------------------------------------------
// Route Registration
// ------------------------------------------------------------
debug('Loading routes...');
features.routes = [
  '/api/companies',
  '/api/admin',
  '/api/payments',
  '/api/shipments',
  '/api/users',
];
features.routes.forEach((r) => debug(`Registering ${r} routes`));

app.use('/api/v1', routes);

app.use(notFound);
app.use(errorHandler);

// ------------------------------------------------------------
// Start Server Logic
// ------------------------------------------------------------
async function startServer() {
  try {
    debug('Initializing backend services...');

    // 1️⃣ Connect MongoDB
    debug('Connecting to MongoDB...');
    await connectDB();
    features.database.status = 'connected';
    success(`Connected to MongoDB: ${process.env.MONGO_URI.split('@').pop() || 'localhost'}`);

    // 2️⃣ Skip Redis
    warn('Redis is skipped. Server will start without Redis.');

    // 3️⃣ Start Express server
    server = app.listen(PORT, () => {
      console.log('--------------------------------------------------------');
      console.log(`🚀 Server running on port ${PORT}`);
      info(`Environment: ${NODE_ENV}`);
      info(`API Health: http://localhost:${PORT}/api/v1/health`);
      info(`API Docs:   http://localhost:${PORT}/api`);
      console.log('--------------------------------------------------------');
      logger.info(`Server started on port ${PORT}`);
    });

    // Handle signals for graceful shutdown
    process.on('SIGINT', gracefulShutdown);
    process.on('SIGTERM', gracefulShutdown);

    process.on('unhandledRejection', (reason) => {
      logger.error('unhandledRejection', { reason });
      gracefulShutdown(1, reason);
    });
    process.on('uncaughtException', (err) => {
      logger.error('uncaughtException', { err });
      gracefulShutdown(1, err);
    });
  } catch (err) {
    error(`Startup failed: ${err.message}`);
    logger.error('startup_failed', { err });
    setTimeout(() => process.exit(1), 500);
  }
}

// ------------------------------------------------------------
// Graceful Shutdown Handler
// ------------------------------------------------------------
async function gracefulShutdown(exitCode = 0, err) {
  if (shuttingDown) return;
  shuttingDown = true;
  logger.info('graceful_shutdown_initiated', { exitCode });
  console.log('🛑 Graceful shutdown initiated...');

  // Stop new connections
  if (server && server.close) {
    server.close(() => {
      logger.info('http_server_closed');
      console.log('✅ HTTP server closed');
    });
    setTimeout(() => {
      warn('Forcing process exit after timeout...');
      process.exit(exitCode);
    }, 10000).unref();
  }

  // Close MongoDB
  try {
    const mongoose = require('mongoose');
    if (mongoose.connection?.readyState === 1) {
      await mongoose.disconnect();
      success('MongoDB disconnected');
    }
  } catch (e) {
    logger.error('error_disconnecting_mongoose', { e });
  }

  if (err) logger.error('shutdown_due_to_error', { err });
  logger.info('shutdown_complete_exiting', { exitCode });
  process.exit(exitCode);
}

// ------------------------------------------------------------
// Kick off startup
// ------------------------------------------------------------
startServer();

module.exports = app;
