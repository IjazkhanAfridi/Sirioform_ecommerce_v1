const Order = require('../models/Order');
const User = require('../models/User');

// Funzione per creare un nuovo ordine
const createOrder = async (req, res) => {
  console.log("createOrder function invoked"); // Log
  const { userId, orderItems } = req.body;

  console.log("Order data received:", { userId, orderItems }); // Log dei dati ricevuti

  const order = new Order({
    user: userId,
    orderItems,
    orderDate: Date.now(),
  });

  try {
    const createdOrder = await order.save();
    console.log("Order created and saved:", createdOrder); // Log per confermare la creazione
    res.status(201).json(createdOrder);
  } catch (err) {
    console.error("Error during order creation:", err); // Log per errori
    res.status(500).json({ error: "Order creation failed" });
  }
};

// Funzione per visualizzare tutti gli ordini (solo per admin)
const getAllOrders = async (req, res) => {
  console.log('--- Entering getAllOrders ---');
  console.log('req.user:', req.user);

  try {
      if (req.user.isAdmin) {
          console.log('User is admin, fetching all orders...');
          const orders = await Order.find({}).populate('userId orderItems.productId', 'firstName lastName title');
          console.log('Orders fetched with populate:', orders);
          res.json(orders);
      } else {
          console.log('User is not admin, fetching orders for userId:', req.user._id);
          const orders = await Order.find({ userId: req.user._id });
          console.log('User-specific orders fetched:', orders);
          res.json(orders);
      }
  } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({ message: 'Server error' });
  }
  console.log('--- Exiting getAllOrders ---');
};

// Funzione per ottenere i prodotti acquistati dall'utente
const getProdottiAcquistati = async (req, res) => {
  try {
    // Trova tutti gli ordini dell'utente
    const orders = await Order.find({ userId: req.user._id }).populate('orderItems.productId');

    // Estrai i prodotti acquistati dall'utente con il totale delle quantità
    const prodottiAcquistati = orders.reduce((acc, order) => {
      order.orderItems.forEach((item) => {
        const prodotto = acc.find(prod => prod._id.equals(item.productId._id));
        if (prodotto) {
          prodotto.quantity += item.quantity;  // Aggiungi le quantità se il prodotto esiste già
        } else {
          acc.push({
            _id: item.productId._id,
            title: item.productId.title,
            quantity: item.quantity,  // Inizializza la quantità
          });
        }
      });
      return acc;
    }, []);

    res.status(200).json(prodottiAcquistati);
  } catch (err) {
    console.error('Errore durante il recupero dei prodotti acquistati:', err);
    res.status(500).json({ message: 'Errore durante il recupero dei prodotti acquistati' });
  }
};

module.exports = { createOrder, getAllOrders, getProdottiAcquistati }; // Aggiungi la nuova funzione
