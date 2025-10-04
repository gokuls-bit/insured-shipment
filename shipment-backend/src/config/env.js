import dotenv from 'dotenv';
dotenv.config();

/**
 * Environment configuration with validation
 * All sensitive values should be stored in environment variables or secret managers
 * In production, use AWS Secrets Manager, HashiCorp Vault, or similar
 */
export const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT, 10) || 5000,
  HOST: process.env.HOST || '0.0.0.0',
  
  // Database
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/shipment-insurance',
  
  // Redis
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
  REDIS_PASSWORD: process.env.REDIS_PASSWORD || '',
  REDIS_TTL: parseInt(process.env.REDIS_TTL, 10) || 3600,
  
  // JWT (SENSITIVE - Use strong secrets)
  JWT_SECRET: process.env.JWT_SECRET || 'dev-secret-change-in-production',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '15m',
  JWT_REFRESH_EXPIRE: process.env.JWT_REFRESH_EXPIRE || '7d',
  
  // CORS
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
  
  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 900000,
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100,
  
  // Email
  SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
  SMTP_PORT: parseInt(process.env.SMTP_PORT, 10) || 587,
  SMTP_SECURE: process.env.SMTP_SECURE === 'true',
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASSWORD: process.env.SMTP_PASSWORD || '',
  EMAIL_FROM: process.env.EMAIL_FROM || 'noreply@shipmentinsurance.com',
  
  // File Upload
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE, 10) || 5242880, // 5MB
  UPLOAD_DIR: process.env.UPLOAD_DIR || './uploads',
  
  // Admin Seeds
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@shipmentinsurance.com',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'AdminSecure123!',
  MODERATOR_EMAIL: process.env.MODERATOR_EMAIL || 'moderator@shipmentinsurance.com',
  MODERATOR_PASSWORD: process.env.MODERATOR_PASSWORD || 'ModSecure123!'
};

// Validate critical environment variables
const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0 && ENV.NODE_ENV === 'production') {
  throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
}
*/
