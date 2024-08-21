const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Funzione per la registrazione dell'utente
const registerUser = async (req, res) => {
  const { firstName, lastName, username, password } = req.body;

  // Controlla se l'utente esiste già
  const userExists = await User.findOne({ username });

  if (userExists) {
    return res.status(400).json({ message: 'Username already exists' });
  }

  // Crea il nuovo utente
  const user = new User({
    firstName,
    lastName,
    username,
    password
  });

  await user.save();

  // Genera il token JWT
  const token = await user.generateAuthToken();

  res.status(201).json({
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    isAdmin: user.isAdmin,
    token,
  });
};

// Funzione per il login
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findByCredentials(username, password);
    const token = await user.generateAuthToken();

    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      isAdmin: user.isAdmin,
      token,
    });
  } catch (error) {
    res.status(401).json({ message: 'Invalid username or password' });
  }
};

// Esporta le funzioni
module.exports = { registerUser, loginUser };
