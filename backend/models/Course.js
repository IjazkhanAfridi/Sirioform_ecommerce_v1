const mongoose = require('mongoose');

const giornataSchema = new mongoose.Schema({
  dataInizio: { type: Date, required: true },
  dataFine: { type: Date, required: true },
  oraInizio: { type: String, required: true },
  oraFine: { type: String, required: true },
});

const courseSchema = new mongoose.Schema({
  tipologia: { type: String, required: true },  // Tipologia del corso (es: BLS, BLSD, ecc.)
  città: { type: String, required: true },      // Città del corso
  via: { type: String, required: true },        // Via dell'indirizzo del corso
  numeroDiscenti: { type: Number, required: true },  // Numero di discenti per il corso
  istruttore: { type: String, required: true },  // Nome dell'istruttore del corso
  direttoreCorso: { type: String, required: true },  // Nome del direttore del corso
  giornate: [giornataSchema],  // Array di giornate con data inizio, data fine, ora inizio, ora fine
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Utente che ha creato il corso
}, {
  timestamps: true  // Aggiunge automaticamente campi per "createdAt" e "updatedAt"
});

module.exports = mongoose.model('Course', courseSchema);
