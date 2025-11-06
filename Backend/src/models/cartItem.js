const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name: String,
  price: Number,
  emoji: String,
  qty: Number,
  userId: { type: String, default: 'default-user' },
});

module.exports = mongoose.model('CartItem', CartItemSchema);