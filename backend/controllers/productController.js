const Product = require('../models/productModel');

// Funzione per creare un nuovo prodotto
const createProduct = async (req, res) => {
  const { code, title, description, price_1, price_2, price_3 } = req.body;

  const product = new Product({
    code,
    title,
    description,
    price_1,
    price_2,
    price_3,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
};

// Altre funzioni per la gestione dei prodotti (modifica, cancellazione, ecc.)

module.exports = { createProduct };
