const { redis: redisClient } = require("../config/redis");
const { ensureRedisConnected } = require("../utils/redisHelpers");
const Order = require("../models/Order");
const { parseUploadedFile } = require("../utils/fileParser");

const validateOrder = (order) => {
  if (!order.customer) return "Missing customer";
  if (!order.orderDate) return "Missing orderDate";
  return null;
};

exports.createOrder = async (req, res) => {
  try {
    await ensureRedisConnected();

    const orderData = req.body;

    await redisClient.xAdd("stream:orders", "*", {
      data: JSON.stringify(orderData),
    });

    res
      .status(202)
      .json({ message: "Order received and queued for processing" });
  } catch (err) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({ error: err.message });
  }
};

// GET /api/orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("customer");
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.bulkUpload = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded." });
  }

  try {
    await ensureRedisConnected();
    const fileBuffer = req.file.buffer;
    const ext = req.file.originalname.split(".").pop()?.toLowerCase();

    const { parsedData: ordersData, parseError } = await parseUploadedFile(
      fileBuffer,
      ext
    );

    if (parseError) {
      return res.status(400).json({ error: parseError });
    }

    if (!ordersData || ordersData.length === 0) {
      return res.status(400).json({ error: "Empty or invalid file." });
    }

    // Validation
    const validationResults = ordersData
      .map((order, index) => {
        const err = validateOrder(order);
        return err ? `Row ${index + 1}: ${err}` : null;
      })
      .filter(Boolean);

    if (validationResults.length > 0) {
      return res.status(400).json({
        error: "Validation errors",
        details: validationResults.slice(0, 10),
      });
    }

    // Stream to Redis
    let count = 0;
    for (const order of ordersData) {
      await redisClient.xAdd("stream:orders", "*", {
        data: JSON.stringify(order),
      });
      count++;
    }

    res.status(202).json({
      message: "Data added to stream:orders for background processing.",
      queued: count,
    });
  } catch (err) {
    console.error("❌ Order bulk upload failed:", err.message);
    res.status(500).json({ error: "Internal server error." });
  }
};
