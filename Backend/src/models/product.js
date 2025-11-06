const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  emoji: String,
  stock: Number,
});

module.exports = mongoose.model('Product', ProductSchema);
