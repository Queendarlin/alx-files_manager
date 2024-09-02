// utils/redis.js

import redis from 'redis';
import { promisify } from 'util';

class RedisClient {
  constructor() {
    this.client = redis.createClient();

    // Handle Redis client errors
    this.client.on('error', (error) => {
      console.error(`Redis client not connected to the server: ${error.message}`);
    });

    // Promisify Redis client methods for easier use with async/await
    this.getAsync = promisify(this.client.get).bind(this.client);
    this.setAsync = promisify(this.client.set).bind(this.client);
    this.delAsync = promisify(this.client.del).bind(this.client);
  }

  isAlive() {
    return this.client.connected;
  }

  async get(key) {
    return this.getAsync(key);
  }

  async set(key, value, duration) {
    // Set the value with an expiration time in seconds
    await this.setAsync(key, value, 'EX', duration);
  }

  async del(key) {
    return this.delAsync(key);
  }
}

// Create and export an instance of RedisClient
const redisClient = new RedisClient();
export default redisClient;
