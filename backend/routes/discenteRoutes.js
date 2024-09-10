const express = require('express');
const { createDiscente, getAllDiscenti } = require('../controllers/discenteController'); // Importa entrambe le funzioni
const auth = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', auth, createDiscente);
router.get('/', auth, getAllDiscenti);  // Rotta GET per ottenere tutti i discenti

module.exports = router;
