const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  orderId: String,
  customerName: String,
  customerEmail: String,
  items: Array,
  total: Number,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', OrderSchema);