const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const auth = require('../middleware/authMiddleware');

router.post('/', auth, async (req, res) => {
  const { productIds, quantities } = req.body;

  try {
    if (!req.user || !req.user._id) {
      return res.status(400).json({ message: "User information is missing." });
    }

    const orderItems = [];
    let totalPrice = 0;

    for (let i = 0; i < productIds.length; i++) {
      const product = await Product.findById(productIds[i]);
      if (!product) {
        return res.status(404).json({ message: `Product with id ${productIds[i]} not found` });
      }

      let price;
      if (quantities[i] <= 10) {
        price = product.price1;
      } else if (quantities[i] <= 20) {
        price = product.price2;
      } else {
        price = product.price3;
      }

      orderItems.push({
        productId: productIds[i],
        quantity: quantities[i],
        price: price
      });

      totalPrice += price * quantities[i];
    }

    const newOrder = new Order({
      userId: req.user._id,
      orderItems: orderItems,
      totalPrice: totalPrice
    });

    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (err) {
    console.error("Order creation error:", err);
    res.status(500).json({ message: 'Server error, order could not be created' });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id });
    res.json(orders);
  } catch (err) {
    console.error("Fetching orders error:", err);
    res.status(500).json({ message: 'Server error, could not retrieve orders' });
  }
});

module.exports = router;
