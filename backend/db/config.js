//import mongoose from "mongoose";
//mongoose.connect("mongodb://localhost:27017/e-commerce");
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ ERREUR CRITIQUE : MONGODB_URI non définie dans le fichier .env");
  console.log("💡 Vérifiez que le fichier backend/.env existe et contient MONGODB_URI=...");
  process.exit(1);
}

console.log("🔗 Tentative de connexion à MongoDB Atlas...");
console.log("📍 URI:", MONGODB_URI.replace(/:([^:@]+)@/, ':***@'));

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log("✅ Connecté à MongoDB Atlas avec succès 🎉");
  })
  .catch((err) => {
    console.error("❌ ÉCHEC de connexion à MongoDB Atlas");
    console.error("📝 Détails de l'erreur:", err.message);
    console.log("\n💡 Causes possibles:");
    console.log("   1. Mot de passe incorrect");
    console.log("   2. IP non autorisée dans Atlas (Network Access)");
    console.log("   3. Problème de connexion internet");
    console.log("   4. URI mal formée\n");
    process.exit(1);
  });

export default mongoose;