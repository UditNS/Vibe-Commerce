const express = require('express');
const router = express.Router();
const CartItem = require('../models/cartItem');
const Order = require('../models/order')
const { v4: uuidv4 } = require('uuid');

// POST /api/checkout - Process checkout
router.post('/', async (req, res) => {
  try {
    const { name, email, cartItems } = req.body;

    if (!name || !email || !cartItems || cartItems.length === 0) {
      return res.status(400).json({ error: 'Invalid checkout data' });
    }

    const total = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);

    const order = new Order({
      orderId: uuidv4().substring(0, 8).toUpperCase(),
      customerName: name,
      customerEmail: email,
      items: cartItems.map(item => ({
        name: item.name,
        price: item.price,
        qty: item.qty,
        emoji: item.emoji,
      })),
      total,
    });

    await order.save();

    // Clear cart after successful checkout
    await CartItem.deleteMany({ userId: 'default-user' });

    res.json({
      orderId: order.orderId,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      items: order.items,
      total: order.total,
      timestamp: order.timestamp,
    });
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ error: 'Checkout failed' });
  }
});

module.exports = router;