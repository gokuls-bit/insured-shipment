// src/config/redis.js - Redis Connection Configuration
const { createClient } = require('redis');
const logger = require('../utils/logger');

let redisClient = null;

const connectRedis = async () => {
  try {
    redisClient = createClient({
      url: process.env.REDIS_URL || 'redis://127.0.0.1:6379'
    });

    redisClient.on('error', (err) => {
      logger.error(`Redis Client Error: ${err}`);
    });

    redisClient.on('connect', () => {
      logger.info('Redis Client Connected');
    });

    redisClient.on('ready', () => {
      logger.info('Redis Client Ready');
    });

    redisClient.on('end', () => {
      logger.warn('Redis Client Disconnected');
    });

    await redisClient.connect();
    
    return redisClient;
  } catch (error) {
    logger.error(`Redis connection error: ${error.message}`);
    // Don't exit process - app can run without Redis
    return null;
  }
};

const getClient = () => redisClient;

// Cache helper functions
const cacheGet = async (key) => {
  if (!redisClient || !redisClient.isOpen) return null;
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    logger.error(`Redis GET error: ${error.message}`);
    return null;
  }
};

const cacheSet = async (key, value, expiresIn = 3600) => {
  if (!redisClient || !redisClient.isOpen) return false;
  try {
    await redisClient.setEx(key, expiresIn, JSON.stringify(value));
    return true;
  } catch (error) {
    logger.error(`Redis SET error: ${error.message}`);
    return false;
  }
};

const cacheDel = async (key) => {
  if (!redisClient || !redisClient.isOpen) return false;
  try {
    await redisClient.del(key);
    return true;
  } catch (error) {
    logger.error(`Redis DEL error: ${error.message}`);
    return false;
  }
};

const cacheDelPattern = async (pattern) => {
  if (!redisClient || !redisClient.isOpen) return false;
  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
    return true;
  } catch (error) {
    logger.error(`Redis DELETE PATTERN error: ${error.message}`);
    return false;
  }
};

module.exports = connectRedis;
module.exports.getClient = getClient;
module.exports.cacheGet = cacheGet;
module.exports.cacheSet = cacheSet;
module.exports.cacheDel = cacheDel;
module.exports.cacheDelPattern = cacheDelPattern;