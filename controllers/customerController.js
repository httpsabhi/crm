const { redis: redisClient } = require("../config/redis");
const Customer = require("../models/Customer");
const csv = require("csv-parser");
const { Readable } = require("stream");
const { ensureRedisConnected } = require('../utils/redisHelpers');

function validateCustomer(data) {
  const requiredFields = ["name", "email", "totalSpend", "visits", "lastVisit"];

  for (let field of requiredFields) {
    if (!(field in data)) {
      return `Missing required field: ${field}`;
    }
  }

  if (typeof data.name !== "string" || data.name.trim() === "") {
    return "Name must be a non-empty string";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return "Invalid email format";
  }

  // Convert to Number before checking isNaN for robustness, as isNaN(" ") is false
  const totalSpendNum = Number(data.totalSpend);
  const visitsNum = Number(data.visits);

  if (
    data.totalSpend === null ||
    data.totalSpend === undefined ||
    isNaN(totalSpendNum) ||
    totalSpendNum < 0
  ) {
    return "Total spend must be a valid non-negative number";
  }
  if (
    data.visits === null ||
    data.visits === undefined ||
    isNaN(visitsNum) ||
    visitsNum < 0
  ) {
    return "Visits must be a valid non-negative number";
  }
  if (isNaN(new Date(data.lastVisit).getTime())) {
    return "Invalid lastVisit date format";
  }

  return null;
}

// POST /api/customers
exports.createCustomer = async (req, res) => {
  const customerData = req.body;

  const validationError = validateCustomer(customerData);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  try {
    await ensureRedisConnected(); // Use helper

    const messageId = await redisClient.xAdd("stream:customers", "*", {
      data: JSON.stringify(customerData),
    });
    await redisClient.del("customerCount");
    res
      .status(202)
      .json({ message: "Customer data enqueued for ingestion.", messageId });
  } catch (err) {
    console.error("🔴 Error in createCustomer:", err.message, err.stack);
    const statusCode = err.statusCode || 500;
    const errorMessage =
      err.statusCode === 503 ? err.message : "Failed to enqueue customer data.";
    res.status(statusCode).json({ error: errorMessage });
  }
};

// GET /api/customers
exports.getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.status(200).json(customers);
  } catch (err) {
    console.error("🔴 MongoDB Error in getCustomers:", err.message, err.stack);
    res.status(500).json({ error: "Failed to fetch customers." });
  }
};

// GET /api/customers/count
exports.getCustomerCount = async (req, res) => {
  try {
    await ensureRedisConnected(); // Use helper

    const cachedCount = await redisClient.get("customerCount");

    if (cachedCount !== null) {
      console.log("Customer count served from cache.");
      return res.json({ count: parseInt(cachedCount, 10), source: "cache" });
    }

    console.log("Customer count not in cache, fetching from DB.");
    const count = await Customer.countDocuments();

    await redisClient.set("customerCount", count.toString(), {
      EX: 60,
    });
    console.log("Customer count cached in Redis.");

    return res.json({ count, source: "database" });
  } catch (err) {
    console.error("🔴 Error fetching customer count:", err.message, err.stack);
    const statusCode = err.statusCode || 500;
    let errorMessage = "Server error while fetching customer count.";
    if (err.statusCode === 503) {
      errorMessage = err.message;
    } else if (
      err.message.toLowerCase().includes("redis") ||
      err.message.toLowerCase().includes("connection")
    ) {
      return res
        .status(503)
        .json({ error: "Error communicating with caching service." });
    }
    res.status(statusCode).json({ error: errorMessage });
  }
};

// POST /api/customers/bulk-upload
exports.bulkUpload = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded." });
  }

  try {
    await ensureRedisConnected();
    const fileBuffer = req.file.buffer;
    const ext = req.file.originalname.split(".").pop()?.toLowerCase();
    let customersData = [];
    let parseError = null;

    // Parse JSON or CSV
    if (ext === "json") {
      try {
        customersData = JSON.parse(fileBuffer.toString());
        if (!Array.isArray(customersData)) {
          throw new Error("JSON must contain an array of objects.");
        }
      } catch (e) {
        parseError = `Invalid JSON: ${e.message}`;
      }
    } else if (ext === "csv") {
      customersData = await new Promise((resolve, reject) => {
        const results = [];
        Readable.from(fileBuffer)
          .pipe(
            csv({
              mapHeaders: ({ header }) => header.trim(),
              mapValues: ({ header, value }) => {
                const trimmed = value.trim();
                return ["totalSpend", "visits"].includes(header)
                  ? Number(trimmed)
                  : trimmed;
              },
            })
          )
          .on("data", (row) => results.push(row))
          .on("end", () => resolve(results))
          .on("error", (err) => reject(err));
      }).catch((e) => (parseError = e.message));
    }

    if (parseError) {
      return res.status(400).json({ error: parseError });
    }

    if (!customersData || customersData.length === 0) {
      return res.status(400).json({ error: "Empty or invalid file." });
    }

    // Validation
    const validationResults = customersData
      .map((cust, index) => {
        const err = validateCustomer(cust);
        return err ? `Row ${index + 1}: ${err}` : null;
      })
      .filter(Boolean);

    if (validationResults.length > 0) {
      return res.status(400).json({
        error: "Validation errors",
        details: validationResults.slice(0, 10),
      });
    }

    // Stream upload in batches
    let count = 0;
    for (const customer of customersData) {
      await redisClient.xAdd("stream:customers", "*", {
        data: JSON.stringify(customer),
      });
      count += 1;
    }

    await redisClient.del("customerCount");

    res.status(202).json({
      message: "Data added to stream:customers for background processing.",
      queued: count,
    });
  } catch (err) {
    console.error("❌ Bulk upload failed:", err.message);
    res.status(500).json({ error: "Internal server error." });
  }
};

exports.getNewCustomersToday = async (req, res) => {
  try {
    await ensureRedisConnected();

    const cacheKey = "newCustomersTodayCount";
    const cachedCount = await redisClient.get(cacheKey);

    if (cachedCount !== null) {
      console.log("✅ Served new customers count from Redis.");
      return res.json({ count: parseInt(cachedCount, 10), source: "cache" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1); // Start of tomorrow

    const newCustomersCount = await Customer.countDocuments({
      createdAt: { $gte: today, $lt: tomorrow },
    });

    await redisClient.set(cacheKey, newCustomersCount.toString(), {
      EX: 120, // cache for 60 seconds
    });

    console.log("🆕 New customers count cached.");
    return res.json({ count: newCustomersCount, source: "database" });
  } catch (err) {
    console.error("🔴 Error in getNewCustomersToday:", err.message);
    const statusCode = err.statusCode || 500;
    res
      .status(statusCode)
      .json({ error: "Failed to fetch new customers added today." });
  }
};