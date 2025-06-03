// config/redis.js
const { createClient } = require("redis");

// Ensure process.env.REDIS_URL is available when createClient is called.
// This means dotenv.config() must be called at the very top of your application's entry point (e.g., server.js, worker.js)
// BEFORE this file is imported.
const redisClient = createClient({
  url: process.env.REDIS_URL,
  // It's good practice to add some socket configuration for production
  // socket: {
  //   keepAlive: true, // Enable TCP keep-alive
  //   reconnectStrategy: retries => Math.min(retries * 50, 3000) // Example reconnect strategy
  // }
});

redisClient.on("error", (err) => console.error("🔴 Redis Client Error:", err));
redisClient.on("connect", () => console.log("🟢 Redis Client Connected"));
redisClient.on("ready", () => console.log("🔵 Redis Client Ready"));
redisClient.on("end", () => console.log("⚪ Redis Client Connection Closed"));
redisClient.on("reconnecting", () => console.log("🟠 Redis Client Reconnecting"));


let isConnected = false; // To track initial connection attempt

async function connectRedis() {
  // The client itself handles reconnection. This function primarily ensures the initial connect() call is made.
  // The `isOpen` property can also be checked: if (!redisClient.isOpen)
  if (!isConnected && !redisClient.isOpen) { // Check both custom flag and client's state
    try {
      await redisClient.connect();
      isConnected = true; // Mark that an attempt to connect (and likely success) has occurred
      // Note: 'connect' and 'ready' events will fire from the client.
    } catch (err) {
      console.error("❌ Failed to connect to Redis during connectRedis():", err);
      // Depending on your app's needs, you might want to throw this error
      // or handle it to allow the app to start in a degraded mode.
      // For this example, we'll let it propagate if called during startup.
      throw err;
    }
  }
}

// Removed connectRedis() call from here.
// It should be called explicitly in your main application files (server.js, worker.js)
// after dotenv.config() and before Redis is needed.

module.exports = {
  redis: redisClient, // Export the client instance directly
  connectRedis,
};
