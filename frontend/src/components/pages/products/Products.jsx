// frontend/src/components/pages/products/Products.jsx
import React, { useState, useEffect } from 'react';
import { 
  Grid, Card, CardMedia, CardContent, 
  Typography, Button, CardActions, Box,
  Chip, Rating 
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

// Fonction pour générer une URL placeholder
const getPlaceholderUrl = (productName, category) => {
  const colors = {
    'Électronique': '1976d2',
    'Vêtements': 'e91e63',
    'Chaussures': 'ff9800',
    'Accessoires': '9c27b0',
    'Maison': '4caf50',
    'Sport': 'f44336',
    'Beauté': 'e040fb',
  };
  const color = colors[category] || '757575';
  const text = productName ? encodeURIComponent(productName.substring(0, 20)) : 'Produit';
  return `https://placehold.co/300x250/${color}/white?text=${text}`;
};

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:1709/get-products')
      .then(res => res.json())
      .then(data => {
        setProducts(data.products || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('❌ Erreur chargement produits:', err);
        setLoading(false);
      });
  }, []);

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existing = cart.find(item => item._id === product._id);
    
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('✅ Produit ajouté au panier!');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Typography variant="h6">Chargement des produits...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      <Typography variant="h3" align="center" gutterBottom fontWeight="bold">
        🛍️ Nos Produits
      </Typography>

      {products.length === 0 ? (
        <Typography align="center" color="textSecondary" sx={{ mt: 5 }}>
          Aucun produit disponible pour le moment.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {products.map((product) => {
            const imageUrl = product.image || getPlaceholderUrl(product.name, product.category);
            
            return (
              <Grid item xs={12} sm={6} md={4} key={product._id}>
                <Card sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.3s',
                  '&:hover': { transform: 'translateY(-5px)', boxShadow: 10 }
                }}>
                  <CardMedia
                    component="img"
                    height="250"
                    image={imageUrl}
                    alt={product.name}
                    sx={{ objectFit: 'cover', bgcolor: '#eee' }}
                    onError={(e) => {
                      e.target.src = getPlaceholderUrl(product.name, product.category);
                    }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Chip 
                      label={product.category} 
                      size="small" 
                      color="primary" 
                      sx={{ mb: 1 }}
                    />
                    <Typography variant="h6" gutterBottom fontWeight="medium">
                      {product.name}
                    </Typography>
                    <Typography color="textSecondary" gutterBottom>
                      {product.company}
                    </Typography>
                    <Rating value={product.rating || 4} readOnly size="small" />
                    <Typography variant="h5" color="primary" sx={{ mt: 2, fontWeight: 'bold' }}>
                      {product.price} DT
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button 
                      fullWidth 
                      variant="contained" 
                      startIcon={<ShoppingCartIcon />}
                      onClick={() => addToCart(product)}
                      sx={{ bgcolor: '#1976d2', '&:hover': { bgcolor: '#1565c0' } }}
                    >
                      Ajouter au panier
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
};

export default Products;