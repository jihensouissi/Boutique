import { AppBar, Toolbar, Typography, Button, Box, Badge, IconButton } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const cartItems = JSON.parse(localStorage.getItem('cart')) || [];

  return (
    <AppBar position="sticky" sx={{ bgcolor: '#1976d2', boxShadow: 3 }}>
      <Toolbar>
        {/* Logo */}
        <Typography 
          variant="h6" 
          component={Link} 
          to="/" 
          sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit', fontWeight: 'bold' }}
        >
          🛍️ E-Shop Pro
        </Typography>

        {/* Navigation */}
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Button color="inherit" component={Link} to="/">Produits</Button>
          
          {user ? (
            <>
              <Button color="inherit" component={Link} to="/add-product">
                Ajouter Produit
              </Button>
              
              {/* Panier avec badge */}
              <IconButton color="inherit" component={Link} to="/cart">
                <Badge badgeContent={cartItems.length} color="error">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
              
              {/* Profil utilisateur */}
              <Button 
                color="inherit" 
                startIcon={<AccountCircleIcon />}
                component={Link} 
                to="/profile"
              >
                {user.name}
              </Button>
              
              <Button 
                color="inherit" 
                onClick={() => {
                  localStorage.clear();
                  navigate('/login');
                }}
              >
                Déconnexion
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">Connexion</Button>
              <Button variant="contained" color="inherit" component={Link} to="/register">
                Inscription
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;