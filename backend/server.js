const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');

dotenv.config();  // Carica il file .env

connectDB();  // Connessione al database

const app = express();

app.use(express.json());  // Abilita il parsing del JSON
app.use(cors());  // Abilita il CORS

// Importa le rotte
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const discenteRoutes = require('./routes/discenteRoutes'); // Nuova rotta per la gestione dei discenti

// Utilizza le rotte
app.use('/api/auth', authRoutes); // Rotta per l'autenticazione
app.use('/api/products', productRoutes); // Rotta per i prodotti
app.use('/api/orders', orderRoutes); // Rotta per gli ordini
app.use('/api/admin/orders', orderRoutes); // Rotta per gli ordini amministrativi
app.use('/api/payment', paymentRoutes); // Rotta per i pagamenti
app.use('/api/discenti', discenteRoutes); // Rotta per i discenti

// Avvio del server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
