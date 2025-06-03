const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  orderAmount: { type: Number, required: true },
  orderDate: { type: Date, default: Date.now },
  products: [{ type: String }] 
});

module.exports = mongoose.model('Order', orderSchema);
