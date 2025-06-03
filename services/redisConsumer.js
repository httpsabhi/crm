require("dotenv").config(); 

const connectDB = require("../config/db"); 
const { redis, connectRedis } = require("../config/redis"); 
const Customer = require("../models/Customer"); 

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
        const response = await redis.xReadGroup(
          groupName,
          consumerName,
          [ 
            { key: streamName, id: '>' } 
          ],
          {
            BLOCK: 5000, 
            COUNT: 10    
          }
        );

        if (response && response.length > 0) {
          for (const streamMessage of response) { // response is an array of streams
            for (const message of streamMessage.messages) { 
              const dataStr = message.message.data; 

              if (!dataStr) {
                console.warn(`⚠️ Message ${message.id} in stream ${streamName} has no 'data' field. Skipping.`);
                await redis.xAck(streamName, groupName, message.id); 
                continue;
              }
              
              let data;
              try {
                data = JSON.parse(dataStr);
              } catch (parseError) {
                console.error(`❌ Error parsing JSON for message ${message.id}: ${parseError.message}. Message content: ${dataStr}. Skipping and NACKing (by not ACKing).`);
                continue; 
              }

              try {
                const customer = new model(data);
                await customer.save();
                console.log(`✅ Customer saved to MongoDB: ${data.email} (ID: ${message.id})`);
                await redis.xAck(streamName, groupName, message.id); // Acknowledge successful processing
              } catch (dbError) {
                console.error(`❌ DB Error saving customer ${data.email} (ID: ${message.id}): ${dbError.message}. Message will not be ACKed.`);
              }
            }
          }
        } else {
          // console.log("No new messages, waiting..."); 
        }
      } catch (readError) {
        console.error(`❌ Error reading from Redis stream '${streamName}': ${readError.message}`);
        await new Promise(resolve => setTimeout(resolve, 5000)); 
      }
    }
  } catch (err) {
    console.error(`❌ Stream processing setup error for '${streamName}': ${err.message}`);
    process.exit(1); 
  }
}

// Main
(async () => {
  try {
    await connectDB(); // Connect to MongoDB
    console.log("✅ MongoDB connected");

    await connectRedis(); 

    if (!redis.isReady) {
        console.log("⏳ Waiting for Redis client to be ready...");
        await new Promise(resolve => redis.once('ready', resolve));
    }
    console.log("✅ Redis client is ready for operations.");
    
    const streamName = "stream:customers";
    const groupName = "ingestion-group";
    const consumerName = `consumer-${require('os').hostname()}-${process.pid}`; // Unique consumer name

    // Start processing the stream
    await processStream(streamName, groupName, consumerName, Customer);

  } catch (err) {
    console.error("❌ Initialization error in worker:", err.message);
    process.exit(1);
  }
})();
