const { redis: redisClient, connectRedis } = require("../config/redis");

async function ensureRedisConnected() {
  if (!redisClient.isReady) {
    console.warn("Redis client not ready, attempting to connect/wait...");
    await connectRedis(); // Attempt to connect
    if (!redisClient.isReady) {
      // Wait a bit for connection if connectRedis was just called
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    if (!redisClient.isReady) {
      const err = new Error(
        "Service temporarily unavailable, Redis not ready."
      );
      err.statusCode = 503; // Add a statusCode for easier handling
      console.error("🔴 Redis client failed to become ready.");
      throw err;
    }
    console.log("✅ Redis client is ready.");
  }
}

module.exports = { ensureRedisConnected };