const Discente = require('../models/Discente');

// Funzione per creare un nuovo discente
const createDiscente = async (req, res) => {
  const { nome, cognome, codiceFiscale, indirizzo, città, regione, email, telefono } = req.body;
  try {
    const newDiscente = new Discente({
      nome,
      cognome,
      codiceFiscale,
      indirizzo,
      città,
      regione,
      email,
      telefono,
      userId: req.user._id, // Associa il discente all'utente che lo ha creato
    });
    await newDiscente.save();
    res.status(201).json(newDiscente);
  } catch (error) {
    res.status(500).json({ message: 'Errore durante la creazione del discente' });
  }
};

// Funzione per ottenere tutti i discenti
const getAllDiscenti = async (req, res) => {
  try {
    const discenti = await Discente.find({ userId: req.user._id }); // Trova tutti i discenti associati all'utente
    res.status(200).json(discenti);
  } catch (error) {
    res.status(500).json({ message: 'Errore durante il recupero dei discenti' });
  }
};

module.exports = { createDiscente, getAllDiscenti };  // Esporta entrambe le funzioni
