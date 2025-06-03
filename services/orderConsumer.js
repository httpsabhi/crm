require("dotenv").config();

const connectDB = require("../config/db");
const { redis, connectRedis } = require("../config/redis");
const Order = require("../models/Order");

async function processStream(streamName, groupName, consumerName, model) {
  try {
    try {
      await redis.xGroupCreate(streamName, groupName, '0', { MKSTREAM: true });
      console.log(`📬 Consumer group '${groupName}' ensured on stream '${streamName}'.`);
    } catch (err) {
      if (err.message.includes('BUSYGROUP')) {
        console.log(`ℹ️ Consumer group '${groupName}' already exists on stream '${streamName}'.`);
      } else {
        throw err;
      }
    }

    console.log(`⏳ Worker ${consumerName} starting to process stream '${streamName}' for group '${groupName}'...`);

    while (true) {
      try {
        const response = await redis.xReadGroup(groupName, consumerName, [
          { key: streamName, id: '>' }
        ], {
          BLOCK: 5000,
          COUNT: 10
        });

        if (response && response.length > 0) {
          for (const streamMessage of response) {
            for (const message of streamMessage.messages) {
              const dataStr = message.message.data;

              if (!dataStr) {
                console.warn(`⚠️ Message ${message.id} has no 'data'. Skipping.`);
                await redis.xAck(streamName, groupName, message.id);
                continue;
              }

              let data;
              try {
                data = JSON.parse(dataStr);
              } catch (parseError) {
                console.error(`❌ JSON parse error: ${parseError.message}`);
                continue;
              }

              try {
                const order = new model(data);
                await order.save();
                console.log(`✅ Order saved: ${order._id} (ID: ${message.id})`);
                await redis.xAck(streamName, groupName, message.id);
              } catch (dbError) {
                console.error(`❌ DB error: ${dbError.message}`);
              }
            }
          }
        }
      } catch (readError) {
        console.error(`❌ Redis read error: ${readError.message}`);
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
  } catch (err) {
    console.error(`❌ Fatal error: ${err.message}`);
    process.exit(1);
  }
}

// Main
(async () => {
  try {
    await connectDB();
    console.log("✅ MongoDB connected");

    await connectRedis();
    if (!redis.isReady) {
      console.log("⏳ Waiting for Redis...");
      await new Promise(resolve => redis.once('ready', resolve));
    }
    console.log("✅ Redis client is ready");

    const streamName = "stream:orders";
    const groupName = "order-ingestion-group";
    const consumerName = `order-consumer-${require('os').hostname()}-${process.pid}`;

    await processStream(streamName, groupName, consumerName, Order);
  } catch (err) {
    console.error("❌ Initialization error:", err.message);
    process.exit(1);
  }
})();
