// Redis client configuration for session management and caching
// Supports high-traffic scenarios with connection pooling

import { createClient, RedisClientType } from 'redis';

interface RedisConfig {
  url: string;
  maxRetriesPerRequest: number;
  retryDelayOnFailover: number;
  enableReadyCheck: boolean;
  maxRetriesPerRequest: number;
  lazyConnect: boolean;
}

class RedisManager {
  private client: RedisClientType | null = null;
  private isConnected = false;
  private connectionAttempts = 0;
  private maxConnectionAttempts = 5;

  constructor() {
    this.initializeClient();
  }

  private async initializeClient() {
    if (!process.env.REDIS_URL) {
      console.warn('⚠️  Redis URL not configured, running without cache');
      return;
    }

    try {
      const config: RedisConfig = {
        url: process.env.REDIS_URL,
        maxRetriesPerRequest: 3,
        retryDelayOnFailover: 100,
        enableReadyCheck: true,
        lazyConnect: true
      };

      this.client = createClient({
        url: config.url,
        socket: {
          reconnectStrategy: (retries) => {
            if (retries > 10) {
              console.error('❌ Redis: Too many reconnection attempts, giving up');
              return false;
            }
            return Math.min(retries * 50, 1000);
          },
          connectTimeout: 5000,
          commandTimeout: 3000
        }
      });

      // Event listeners
      this.client.on('connect', () => {
        console.log('🔗 Redis: Connected');
        this.isConnected = true;
        this.connectionAttempts = 0;
      });

      this.client.on('error', (error) => {
        console.error('❌ Redis error:', error.message);
        this.isConnected = false;
      });

      this.client.on('disconnect', () => {
        console.warn('⚠️  Redis: Disconnected');
        this.isConnected = false;
      });

      this.client.on('reconnecting', () => {
        console.log('🔄 Redis: Reconnecting...');
      });

      // Connect to Redis
      await this.client.connect();
      
    } catch (error) {
      console.error('❌ Failed to initialize Redis client:', error);
      this.connectionAttempts++;
      
      if (this.connectionAttempts < this.maxConnectionAttempts) {
        console.log(`🔄 Retrying Redis connection in 5 seconds (attempt ${this.connectionAttempts}/${this.maxConnectionAttempts})`);
        setTimeout(() => this.initializeClient(), 5000);
      } else {
        console.error('❌ Max Redis connection attempts reached, running without cache');
      }
    }
  }

  // Get data from cache
  async get(key: string): Promise<string | null> {
    if (!this.isConnected || !this.client) {
      return null;
    }

    try {
      return await this.client.get(key);
    } catch (error) {
      console.error('❌ Redis GET error:', error);
      return null;
    }
  }

  // Set data in cache with TTL
  async set(key: string, value: string, ttlSeconds = 3600): Promise<boolean> {
    if (!this.isConnected || !this.client) {
      return false;
    }

    try {
      await this.client.setEx(key, ttlSeconds, value);
      return true;
    } catch (error) {
      console.error('❌ Redis SET error:', error);
      return false;
    }
  }

  // Delete data from cache
  async del(key: string): Promise<boolean> {
    if (!this.isConnected || !this.client) {
      return false;
    }

    try {
      await this.client.del(key);
      return true;
    } catch (error) {
      console.error('❌ Redis DEL error:', error);
      return false;
    }
  }

  // Check if key exists
  async exists(key: string): Promise<boolean> {
    if (!this.isConnected || !this.client) {
      return false;
    }

    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      console.error('❌ Redis EXISTS error:', error);
      return false;
    }
  }

  // Increment counter (useful for rate limiting)
  async incr(key: string, ttlSeconds = 3600): Promise<number | null> {
    if (!this.isConnected || !this.client) {
      return null;
    }

    try {
      const result = await this.client.incr(key);
      if (result === 1) {
        // Set TTL only on first increment
        await this.client.expire(key, ttlSeconds);
      }
      return result;
    } catch (error) {
      console.error('❌ Redis INCR error:', error);
      return null;
    }
  }

  // Get multiple keys
  async mget(keys: string[]): Promise<(string | null)[]> {
    if (!this.isConnected || !this.client || keys.length === 0) {
      return [];
    }

    try {
      return await this.client.mGet(keys);
    } catch (error) {
      console.error('❌ Redis MGET error:', error);
      return [];
    }
  }

  // Set multiple keys
  async mset(keyValues: Record<string, string>): Promise<boolean> {
    if (!this.isConnected || !this.client) {
      return false;
    }

    try {
      await this.client.mSet(keyValues);
      return true;
    } catch (error) {
      console.error('❌ Redis MSET error:', error);
      return false;
    }
  }

  // Get connection status
  isRedisConnected(): boolean {
    return this.isConnected;
  }

  // Graceful shutdown
  async disconnect(): Promise<void> {
    if (this.client) {
      try {
        await this.client.disconnect();
        console.log('✅ Redis: Disconnected gracefully');
      } catch (error) {
        console.error('❌ Error disconnecting from Redis:', error);
      }
    }
  }
}

// Create singleton instance
const redisManager = new RedisManager();

// Export the manager instance
export default redisManager;

// Helper functions for common operations
export const cache = {
  get: (key: string) => redisManager.get(key),
  set: (key: string, value: string, ttl?: number) => redisManager.set(key, value, ttl),
  del: (key: string) => redisManager.del(key),
  exists: (key: string) => redisManager.exists(key),
  incr: (key: string, ttl?: number) => redisManager.incr(key, ttl),
  isConnected: () => redisManager.isRedisConnected()
};

// Cache key generators
export const cacheKeys = {
  sanityData: (query: string) => `sanity:${Buffer.from(query).toString('base64')}`,
  userSession: (sessionId: string) => `session:${sessionId}`,
  rateLimit: (ip: string, endpoint: string) => `rate_limit:${ip}:${endpoint}`,
  apiResponse: (endpoint: string, params: string) => `api:${endpoint}:${params}`,
  pageCache: (path: string) => `page:${path}`
};

// Graceful shutdown handler
process.on('SIGTERM', async () => {
  await redisManager.disconnect();
});

process.on('SIGINT', async () => {
  await redisManager.disconnect();
});
