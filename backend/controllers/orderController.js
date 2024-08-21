const Order = require('../models/orderModel');

// Funzione per creare un nuovo ordine
const createOrder = async (req, res) => {
  const { userId, orderItems } = req.body;

  const order = new Order({
    user: userId,
    orderItems,
    orderDate: Date.now(),
  });

  const createdOrder = await order.save();
  res.status(201).json(createdOrder);
};

// Altre funzioni per la gestione degli ordini (visualizzazione, ecc.)

module.exports = { createOrder };
