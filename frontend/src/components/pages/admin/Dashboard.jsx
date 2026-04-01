import React from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const Dashboard = () => {
  const stats = {
    totalProducts: 0,
    totalUsers: 0,
    totalRevenue: 0
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        📊 Tableau de Bord
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: 'primary.main', color: 'white' }}>
            <CardContent>
              <PeopleIcon sx={{ fontSize: 40 }} />
              <Typography variant="h6">Utilisateurs</Typography>
              <Typography variant="h3">{stats.totalUsers}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: 'success.main', color: 'white' }}>
            <CardContent>
              <ShoppingCartIcon sx={{ fontSize: 40 }} />
              <Typography variant="h6">Produits</Typography>
              <Typography variant="h3">{stats.totalProducts}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: 'warning.main', color: 'white' }}>
            <CardContent>
              <AttachMoneyIcon sx={{ fontSize: 40 }} />
              <Typography variant="h6">Revenus</Typography>
              <Typography variant="h3">{stats.totalRevenue} DT</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;