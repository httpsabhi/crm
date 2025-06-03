const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  segmentName: { type: String, required: true },
  description: { type: String },
  message: { type: String },
  rules: mongoose.Schema.Types.Mixed, // JSON rules from frontend
  audienceSize: Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Campaign', campaignSchema);
