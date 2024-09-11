const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const auth = require('../middleware/authMiddleware');
const { getAllOrders, getProdottiAcquistati } = require('../controllers/orderController'); // Importa getProdottiAcquistati
const isAdmin = require('../middleware/isAdmin');

let globalProgressiveCounter = 1; // Global progressive counter
const extractProgressiveNumber = (progressiveNumber) => {
  const parts = progressiveNumber.split('-');
  return parseInt(parts[1], 10); // Extract the number after the year prefix
};

// Route to create an order
router.post('/', auth, async (req, res) => {
  console.log("POST /api/orders - Order creation started"); // Log
  const { productIds, quantities } = req.body;

  try {
    if (!req.user || !req.user._id) {
      console.log("User information missing during order creation");
      return res.status(400).json({ message: "User information is missing." });
    }

    const orders = await Order.find();
    let maxProgressiveNumber = 0;

    orders.forEach(order => {
      order.orderItems.forEach(item => {
        item.progressiveNumbers.forEach(pn => {
          const num = extractProgressiveNumber(pn);
          if (num > maxProgressiveNumber) {
            maxProgressiveNumber = num;
          }
        });
      });
    });

    console.log(`Max progressive number found: ${maxProgressiveNumber}`);

    const orderItems = [];
    let totalPrice = 0;
    const currentYear = new Date().getFullYear().toString().slice(-2); // Get last two digits of the year

    for (let i = 0; i < productIds.length; i++) {
      console.log(`Processing productId: ${productIds[i]} with quantity: ${quantities[i]}`); // Log
      const product = await Product.findById(productIds[i]);
      if (!product) {
        console.log(`Product not found: ${productIds[i]}`); // Log
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
      console.log(`Price determined for productId ${productIds[i]}: ${price}`); 

      // Generate progressive numbers
      const progressiveNumbers = [];
      for (let j = 0; j < quantities[i]; j++) {
        maxProgressiveNumber++;
        progressiveNumbers.push(`${currentYear}-${String(maxProgressiveNumber).padStart(7, '0')}`);
      }

      orderItems.push({
        productId: productIds[i],
        quantity: quantities[i],
        price: price,
        progressiveNumbers: progressiveNumbers
      });

      totalPrice += price * quantities[i];
    }

    const newOrder = new Order({
      userId: req.user._id,
      orderItems: orderItems,
      totalPrice: totalPrice
    });

    const savedOrder = await newOrder.save();
    console.log("Order successfully created:", savedOrder); // Log
    res.status(201).json(savedOrder);
  } catch (err) {
    console.error("Order creation error:", err);
    res.status(500).json({ message: 'Server error, order could not be created' });
  }
});

// Route to get user-specific orders
router.get('/', auth, async (req, res) => {
  console.log("GET /api/orders - Fetching user orders"); // Log
  try {
    const orders = await Order.find({ userId: req.user._id }).populate('orderItems.productId', 'title');
    console.log("User orders fetched:", orders); // Log fetched orders
    res.json(orders);
  } catch (err) {
    console.error("Fetching orders error:", err);
    res.status(500).json({ message: 'Server error, could not retrieve orders' });
  }
});

// Route to get all orders (admin only)
router.get('/admin/orders', auth, isAdmin, getAllOrders);

// Nuova rotta per ottenere i prodotti acquistati
router.get('/acquistati', auth, getProdottiAcquistati);  // Aggiungi questa rotta

module.exports = router;
