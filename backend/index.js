// backend/index.js
import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import "./db/config.js";
import User from "./db/user.js";
import Product from "./db/product.js";

const app = express();
app.use(express.json());
app.use(cors());

// ============================================
// 📝 REGISTER API (avec bcrypt)
// ============================================
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    console.log("\n📥 Tentative d'inscription:");
    console.log("   Nom:", name);
    console.log("   Email:", email);

    // Vérifier si l'email existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("⚠️ Email déjà utilisé:", email);
      return res.status(200).send({ 
        success: false, 
        error: "Email is already registered" 
      });
    }

    // Vérifier la longueur du mot de passe
    if (!password || password.length < 6) {
      console.log("⚠️ Mot de passe trop court");
      return res.status(200).send({
        success: false,
        error: "Password must be at least 6 characters long",
      });
    }

    // 🔐 HASHAGE DU MOT DE PASSE AVEC BCRYPT
    console.log("🔐 Hashage du mot de passe...");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Créer et sauvegarder l'utilisateur avec mot de passe hashé
    console.log("💾 Création du nouvel utilisateur...");
    const user = new User({ 
      name, 
      email, 
      password: hashedPassword  // ← Mot de passe hashé, PAS en clair
    });
    
    console.log("📦 Sauvegarde dans MongoDB...");
    let result = await user.save();
    
    console.log("✅ Utilisateur créé avec succès! ID:", result._id);
    
    // Préparer la réponse (sans le mot de passe)
    result = result.toObject();
    delete result.password;

    res.status(201).send({
      success: true,
      message: "Registration successful",
      data: result,
    });
  } catch (error) {
    console.error("\n❌ ERREUR CRITIQUE lors de l'inscription:");
    console.error("   Message:", error.message);
    console.error("   Code:", error.code);
    
    res.status(500).send({ 
      success: false, 
      error: "Internal server error",
      details: error.message 
    });
  }
});

// ============================================
// 🔐 LOGIN API (avec bcrypt.compare)
// ============================================
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("\n🔐 Tentative de connexion:");
    console.log("   Email:", email);

    if (!email || !password) {
      console.log("⚠️ Email ou mot de passe manquant");
      return res.status(400).send({ 
        error: "Email and password are required", 
        success: false 
      });
    }

    // Rechercher l'utilisateur
    let user = await User.findOne({ email });

    if (!user) {
      console.log("❌ Aucun utilisateur trouvé avec cet email");
      return res.status(404).send({ 
        success: false, 
        error: "No user found" 
      });
    }

    // 🔐 VÉRIFICATION DU MOT DE PASSE AVEC BCRYPT
    console.log("🔐 Vérification du mot de passe...");
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      console.log("❌ Mot de passe incorrect");
      return res.status(401).send({ 
        success: false, 
        error: "Invalid credentials" 
      });
    }

    console.log("✅ Connexion réussie pour:", email);
    
    // Préparer les données utilisateur (sans le mot de passe)
    const userData = { ...user._doc };
    delete userData.password;

    res.status(200).send({ 
      success: true, 
      user: userData 
    });
  } catch (error) {
    console.error("\n❌ ERREUR lors de la connexion:", error);
    res.status(500).send({ 
      success: false, 
      error: "Server error" 
    });
  }
});

// ============================================
// ➕ ADD PRODUCT API
// ============================================
app.post("/add-product", async (req, res) => {
  try {
    const { name, price, category, userId, company, image } = req.body;

    console.log("\n📦 Ajout d'un produit:", name);

    if (!name || !price || !category || !userId || !company) {
      return res.status(400).send({ 
        success: false, 
        status: 400, 
        error: "All fields are required" 
      });
    }

    const product = new Product({ 
      name, 
      price, 
      category, 
      userId, 
      company,
      image: image || ""
    });
    const result = await product.save();

    console.log("✅ Produit ajouté avec succès! ID:", result._id);

    res.status(201).send({ 
      success: true, 
      status: 201, 
      message: "Product added successfully", 
      product: result 
    });
  } catch (error) {
    console.error("❌ Erreur lors de l'ajout du produit:", error);
    res.status(500).send({ 
      success: false, 
      status: 500, 
      error: "Internal Server Error" 
    });
  }
});

// ============================================
// 📋 GET PRODUCTS API
// ============================================
app.get('/get-products', async (req, res) => {
  try {
    console.log("\n📋 Récupération des produits...");
    
    let products = await Product.find().lean();

    if (products.length > 0) {
      console.log(`✅ ${products.length} produits trouvés`);
      return res.status(200).send({
        message: "Products fetched successfully",
        status: 200,
        products
      });
    }

    console.log("ℹ️ Aucun produit trouvé");
    return res.status(200).send({
      message: 'No products found',
      status: 200,
      products: []
    });

  } catch (error) {
    console.error("❌ Erreur lors de la récupération des produits:", error);
    return res.status(500).send({
      message: "Internal Server Error",
      status: 500,
      error: error.message
    });
  }
});

// ============================================
// 🗑️ DELETE PRODUCT API
// ============================================
app.delete('/product/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log("\n🗑️ Suppression du produit:", id);
    
    const product = await Product.findById(id);

    if (!product) {
      console.log("⚠️ Produit non trouvé");
      return res.status(200).send({ 
        success: false, 
        status: 200, 
        message: "Product not found" 
      });
    }
    
    const response = await Product.deleteOne({ _id: id });

    if (response.deletedCount === 1) {
      console.log("✅ Produit supprimé avec succès");
      res.status(200).send({ 
        success: true, 
        status: 200, 
        message: "Product deleted successfully" 
      });
    } else {
      console.log("❌ Échec de la suppression");
      res.status(400).send({ 
        success: false, 
        status: 400, 
        message: "Failed to delete product" 
      });
    }
  } catch (error) {
    console.error("❌ Erreur lors de la suppression:", error);
    res.status(500).send({ 
      success: false, 
      status: 500, 
      message: "Internal Server Error" 
    });
  }
});

// ============================================
// 🚀 START SERVER
// ============================================
const PORT = process.env.PORT || 1709;
app.listen(PORT, () => {
  console.log("\n" + "=".repeat(50));
  console.log(`🚀 Serveur démarré avec succès!`);
  console.log(`📍 Port: http://localhost:${PORT}`);
  console.log(`🔐 Sécurité: bcrypt activé pour les mots de passe`);
  console.log("=".repeat(50) + "\n");
});