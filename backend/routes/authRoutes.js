const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');
const router = express.Router();

// Rotta per la registrazione
router.post('/register', registerUser);

// Rotta per il login
router.post('/login', loginUser); // Assicurati che questa rotta esista

module.exports = router;
