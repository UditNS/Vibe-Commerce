const express = require("express");
const connectDB = require("./config/database");
const cors = require("cors");
require('dotenv').config()
const app = express();
const Product = require('./models/product')


app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

async function seedProducts() {
  const count = await Product.countDocuments();
  if (count === 0) {
    const products = [
      { name: 'Wireless Headphones', description: 'Premium sound quality', price: 79.99, emoji: '🎧', stock: 50 },
      { name: 'Smart Watch', description: 'Fitness tracking & notifications', price: 199.99, emoji: '⌚', stock: 30 },
      { name: 'Laptop Backpack', description: 'Durable & spacious', price: 49.99, emoji: '🎒', stock: 100 },
      { name: 'Portable Charger', description: '20000mAh power bank', price: 29.99, emoji: '🔋', stock: 75 },
      { name: 'Bluetooth Speaker', description: '360° surround sound', price: 59.99, emoji: '🔊', stock: 40 },
      { name: 'USB-C Cable', description: 'Fast charging 6ft', price: 12.99, emoji: '🔌', stock: 200 },
      { name: 'Phone Stand', description: 'Adjustable & foldable', price: 19.99, emoji: '📱', stock: 150 },
      { name: 'Webcam HD', description: '1080p with microphone', price: 69.99, emoji: '📷', stock: 45 },
      { name: 'Gaming Mouse', description: 'RGB & programmable buttons', price: 39.99, emoji: '🖱️', stock: 60 },
      { name: 'Desk Lamp', description: 'LED with touch control', price: 34.99, emoji: '💡', stock: 80 },
    ];
    await Product.insertMany(products);
    console.log('Products seeded!');
  }
}

seedProducts();

app.use('/api/cart', require('./routes/cart'));
app.use('/api/products', require('./routes/product'));
app.use('/api/checkout', require('./routes/checkout'));

const PORT = process.env.PORT || 4000;

connectDB()
  .then(() => {
    console.log("✅ MongoDB Connected");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));
