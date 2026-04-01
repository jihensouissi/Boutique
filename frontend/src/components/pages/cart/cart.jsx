import { useState, useEffect } from 'react';
import { 
  Box, Typography, Button, Card, CardContent, 
  Grid, IconButton, Divider 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(items);
    const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setTotal(totalPrice);
  }, []);

  const updateQuantity = (id, delta) => {
    const updated = cartItems.map(item => {
      if (item._id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    });
    setCartItems(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  const removeFromCart = (id) => {
    const updated = cartItems.filter(item => item._id !== id);
    setCartItems(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        🛒 Votre Panier
      </Typography>

      {cartItems.length === 0 ? (
        <Typography color="textSecondary">Votre panier est vide</Typography>
      ) : (
        <>
          <Grid container spacing={3}>
            {cartItems.map((item) => (
              <Grid item xs={12} key={item._id}>
                <Card sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                  <CardContent sx={{ flex: 1 }}>
                    <Typography variant="h6">{item.name}</Typography>
                    <Typography color="textSecondary">{item.category}</Typography>
                    <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                      {item.price} DT
                    </Typography>
                  </CardContent>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <IconButton onClick={() => updateQuantity(item._id, -1)}>
                      <RemoveIcon />
                    </IconButton>
                    <Typography>{item.quantity}</Typography>
                    <IconButton onClick={() => updateQuantity(item._id, 1)}>
                      <AddIcon />
                    </IconButton>
                  </Box>

                  <IconButton onClick={() => removeFromCart(item._id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Divider sx={{ my: 3 }} />
          
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="h5" gutterBottom>
              Total: <strong>{total} DT</strong>
            </Typography>
            <Button variant="contained" size="large" sx={{ mt: 2 }}>
              Passer la commande
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default Cart;