import React, { useState } from 'react';
import {
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material';
import axios from 'axios';

const AddCarroussel = () => {
  const [formData, setFormData] = useState({
    titre: '',
    police: '',
    code: '',
    position: '',
    styles: {},
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // For styles input, convert JSON string to object
    if (name === 'styles') {
      try {
        setFormData((prev) => ({
          ...prev,
          styles: JSON.parse(value || '{}'),
        }));
      } catch (err) {
        console.error('Invalid JSON in styles');
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Adapt the URL as needed
      await axios.post('http://localhost:5000/carroussels', formData);
      alert('Carroussel added successfully!');
      setFormData({
        titre: '',
        police: '',
        code: '',
        position: '',
        styles: {},
      });
    } catch (error) {
      console.error('Error adding carroussel:', error);
      alert('Failed to add carroussel.');
    }
  };

  return (
    <Paper elevation={3} style={{ padding: 20, maxWidth: 600, margin: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Add New Carroussel
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Titre"
              name="titre"
              fullWidth
              value={formData.titre}
              onChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Police"
              name="police"
              fullWidth
              value={formData.police}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Code"
              name="code"
              fullWidth
              value={formData.code}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Position</InputLabel>
              <Select
                name="position"
                value={formData.position}
                onChange={handleChange}
              >
                <MenuItem value="top">Top</MenuItem>
                <MenuItem value="middle">Middle</MenuItem>
                <MenuItem value="bottom">Bottom</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Styles (JSON format)"
              name="styles"
              fullWidth
              onChange={handleChange}
              placeholder='e.g. {"color":"red","fontSize":"20px"}'
            />
          </Grid>

          <Grid item xs={12}>
            <Button type="submit" variant="contained" fullWidth color="primary">
              Add Carroussel
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default AddCarroussel;
