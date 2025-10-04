/*
import { getRedisClient } from '../config/redis.js';
import { ENV } from '../config/env.js';
import logger from './logger.js';

/**
 * Cache service with Redis
 * Implements caching strategies for frequently accessed data
 */
class CacheService {
  /**
   * Get cached value
   */
  async get(key) {
    try {
      const redis = getRedisClient();
      const value = await redis.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      logger.error('Cache get error', { key, error: error.message });
      return null;
    }
  }
  
  /**
   * Set cache value with TTL
   */
  async set(key, value, ttl = ENV.REDIS_TTL) {
    try {
      const redis = getRedisClient();
      await redis.setex(key, ttl, JSON.stringify(value));
      return true;
    } catch (error) {
      logger.error('Cache set error', { key, error: error.message });
      return false;
    }
  }
  
  /**
   * Delete cached value
   */
  async del(key) {
    try {
      const redis = getRedisClient();
      await redis.del(key);
      return true;
    } catch (error) {
      logger.error('Cache delete error', { key, error: error.message });
      return false;
    }
  }
  
  /**
   * Delete all keys matching pattern
   */
  async delPattern(pattern) {
    try {
      const redis = getRedisClient();
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
      return true;
    } catch (error) {
      logger.error('Cache pattern delete error', { pattern, error: error.message });
      return false;
    }
  }
  
  /**
   * Cache invalidation for related entities
   */
  async invalidateShipmentCache(shipmentId) {
    await this.delPattern(`shipment:${shipmentId}:*`);
    await this.delPattern('shipments:list:*');
  }
  
  async invalidatePolicyCache(policyId) {
    await this.delPattern(`policy:${policyId}:*`);
    await this.delPattern('policies:list:*');
  }
  
  async invalidateCompanyCache(companyId) {
    await this.delPattern(`company:${companyId}:*`);
    await this.delPattern('companies:list:*');
  }
}

export default new CacheService();
