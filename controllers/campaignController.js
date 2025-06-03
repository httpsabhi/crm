const Campaign = require("../models/Campaign");
const CommunicationLog = require("../models/CommunicationLog");
const Customer = require("../models/Customer");
const { simulateVendorAPI } = require("../services/vendorService");
const { buildMongoQuery } = require("../utils/evaluateRules");
const { redis: redisClient } = require("../config/redis");
const { ensureRedisConnected } = require("../utils/redisHelpers");
const Mustache = require("mustache");

exports.createCampaign = async (req, res) => {
  try {
    const { rules, message, segmentName, description } = req.body;

    await ensureRedisConnected();

    const mongoQuery = buildMongoQuery(rules);

    const cacheKey = `segment:${segmentName}`;
    let matchedCustomers;

    const cached = await redisClient.get(cacheKey);
    if (cached) {
      matchedCustomers = JSON.parse(cached);
    } else {
      matchedCustomers = await Customer.find(mongoQuery).lean(); // lean() for plain JS objects
      await redisClient.setEx(cacheKey, 3600, JSON.stringify(matchedCustomers));
    }

    if (!matchedCustomers.length) {
      return res.status(404).json({ message: "No matching customers found" });
    }

    const audienceSize = matchedCustomers.length;

    const campaign = await Campaign.create({
      segmentName,
      description,
      message,
      rules,
      audienceSize,
    });

    matchedCustomers.forEach((customer) => {
      const personalizedMessage = Mustache.render(message, customer); // Use customer data in template
      simulateVendorAPI(customer, personalizedMessage, campaign._id);
    });

    res.status(201).json({
      campaignId: campaign._id,
      message: "Campaign created and messages are being processed",
      count: audienceSize,
    });
  } catch (err) {
    console.error("Error creating campaign:", err);
    res.status(500).json({ error: err.message });
  }
};

// GET /api/campaigns
exports.getAllCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find().sort({ createdAt: -1 });
    res.status(200).json(campaigns);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/campaigns/delivery-receipt
exports.handleDeliveryReceipt = async (req, res) => {
  try {
    const { customerId, campaignId, status } = req.body;

    await CommunicationLog.create({
      campaign: campaignId,
      customer: customerId,
      status,
    });

    res.status(200).json({ message: "Delivery status logged" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.previewAudience = async (req, res) => {
  try {
    const { rules, logic } = req.body;

    const mongoQuery = buildMongoQuery({ rules, logic });
    // console.log("MongoDB Query:", JSON.stringify(mongoQuery, null, 2));
    // console.log("Query Type:", typeof mongoQuery.lastVisit?.$lt);
    const count = await Customer.countDocuments(mongoQuery);

    res.status(200).json({ count });
  } catch (err) {
    console.error("Error previewing audience:", err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.getCampaignId = async (req, res) => {
  const { id } = req.params;

  try {
    const logs = await CommunicationLog.find({ campaign: id })
      .populate("customer", "name email")
      .populate("campaign", "segmentName message rules")
      .sort({ timestamp: -1 });

    res.status(200).json({ logs });
  } catch (error) {
    console.error("Error fetching communication logs:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
