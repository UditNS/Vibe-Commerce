const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const CartItem = require('../models/cartItem');

// GET /api/cart - Get cart items
router.get('/', async (req, res) => {
  try {
    const userId = 'default-user'; // Mock user
    const cartItems = await CartItem.find({ userId });
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
    res.json({ items: cartItems, total });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

// POST /api/cart - Add item to cart
router.post('/', async (req, res) => {
  try {
    const { productId, qty } = req.body;
    const userId = 'default-user';

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if item already in cart
    const existingItem = await CartItem.findOne({ productId, userId });
    if (existingItem) {
      existingItem.qty += qty;
      await existingItem.save();
      return res.json(existingItem);
    }

    // Create new cart item
    const cartItem = new CartItem({
      productId,
      name: product.name,
      price: product.price,
      emoji: product.emoji,
      qty,
      userId,
    });

    await cartItem.save();
    res.status(201).json(cartItem);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add to cart' });
  }
});

// PUT /api/cart/:id - Update cart item quantity
router.put('/:id', async (req, res) => {
  try {
    const { qty } = req.body;
    const cartItem = await CartItem.findByIdAndUpdate(
      req.params.id,
      { qty },
      { new: true }
    );
    
    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    res.json(cartItem);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update cart item' });
  }
});

// DELETE /api/cart/:id - Remove item from cart
router.delete('/:id', async (req, res) => {
  try {
    const cartItem = await CartItem.findByIdAndDelete(req.params.id);
    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }
    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove item' });
  }
});

module.exports = router;