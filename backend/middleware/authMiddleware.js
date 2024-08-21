const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    console.log("Token received:", token); // Log per il token ricevuto

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded); // Log del token decodificato

    const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });
    console.log("User found:", user); // Log dell'utente trovato

    if (!user) {
      console.error("User not found or token invalid");
      throw new Error();
    }

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

module.exports = auth;
