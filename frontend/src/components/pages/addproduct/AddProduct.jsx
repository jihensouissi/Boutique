import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Grid, Card, CardContent, MenuItem, Alert, CircularProgress } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const API_BASE = 'http://localhost:1709';

const AddProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', price: '', category: '', company: '', image: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const categories = ['Électronique', 'Vêtements', 'Chaussures', 'Accessoires', 'Maison', 'Sport', 'Beauté', 'Autre'];

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError("Connectez-vous d'abord");
      setTimeout(() => navigate('/login'), 1500);
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.category || !formData.company) {
      setError('Tous les champs sont requis');
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));
      const res = await fetch(`${API_BASE}/add-product`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ ...formData, price: parseFloat(formData.price), userId: user?._id })
      });
      const result = await res.json();
      if (result.success) {
        setSuccess('✅ Produit ajouté!');
        setFormData({ name: '', price: '', category: '', company: '', image: '' });
      } else {
        setError(result.error || 'Erreur');
      }
    } catch (err) {
      setError('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      <Card sx={{ maxWidth: 600, mx: 'auto' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/')} size="small">Retour</Button>
            <Typography variant="h5" sx={{ ml: 2, fontWeight: 'bold' }}>➕ Ajouter un Produit</Typography>
          </Box>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField fullWidth label="Nom *" name="name" value={formData.name} onChange={handleChange} required disabled={loading} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Prix (DT) *" name="price" type="number" value={formData.price} onChange={handleChange} required disabled={loading} inputProps={{ min: 0, step: 0.01 }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth select label="Catégorie *" name="category" value={formData.category} onChange={handleChange} required disabled={loading}>
                  <MenuItem value=""><em>Choisir...</em></MenuItem>
                  {categories.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Marque *" name="company" value={formData.company} onChange={handleChange} required disabled={loading} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Image URL (optionnel)" name="image" value={formData.image} onChange={handleChange} disabled={loading} placeholder="https://placehold.co/300x250" />
              </Grid>
            </Grid>
            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button type="submit" variant="contained" disabled={loading} sx={{ flexGrow: 1 }}>
                {loading ? <CircularProgress size={20} /> : 'Ajouter'}
              </Button>
              <Button type="button" variant="outlined" onClick={() => setFormData({ name: '', price: '', category: '', company: '', image: '' })} disabled={loading}>
                Reset
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AddProduct;