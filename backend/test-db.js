// backend/test-db.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

console.log("🔍 Tentative de connexion avec l'URI :");
console.log(process.env.MONGODB_URI?.replace(/:([^:@]+)@/, ':***@')); // Masque le mdp

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ SUCCÈS : Connecté à MongoDB Atlas !");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ ÉCHEC :", err.message);
    process.exit(1);
  });