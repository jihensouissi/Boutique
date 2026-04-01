// backend/middleware/auth.js
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export const authMiddleware = async (req, res, next) => {
  try {
    // Récupérer le token depuis les headers
    // Format attendu : "Bearer eyJhbGciOiJIUzI1NiIs..."
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        error: 'No token provided. Please log in.' 
      });
    }

    // Extraire le token
    const token = authHeader.split(' ')[1];

    // Vérifier et décoder le token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Ajouter l'ID utilisateur à la requête pour les routes suivantes
    req.userId = decoded.userId;
    req.userEmail = decoded.email;
    
    next(); // Continuer vers la route protégée
    
  } catch (error) {
    console.error('❌ JWT Error:', error.message);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        error: 'Token expired. Please log in again.' 
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid token. Please log in again.' 
      });
    }
    
    res.status(401).json({ 
      success: false, 
      error: 'Authentication failed' 
    });
  }
};