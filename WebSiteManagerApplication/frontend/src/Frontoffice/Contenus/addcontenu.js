// src/components/AddContenu.js
import React, { useState } from 'react';
import {
  TextField,
  Button,
  MenuItem,
  Grid,
  Typography,
  Paper,
} from '@mui/material';
import axios from 'axios';
import { contenuTypes } from './contenuTypes';

const AddContenu = () => {
  const [type, setType] = useState('');
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    image: '',
    code: '',
    carroussel: '',
    datePublication: '',
    isPublished: false,
    isArchived: false,
    publisher: '',
    styles: '{}',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      styles: JSON.parse(formData.styles || '{}'),
    };

    try {
      await axios.post(`http://localhost:5000/contenus/${type}`, payload);
      alert('Contenu ajouté avec succès');
      setFormData({});
    } catch (err) {
      console.error('Erreur ajout contenu', err);
      alert('Échec de l’ajout');
    }
  };

  const commonFields = (
    <>
      <TextField label="Titre" name="titre" fullWidth onChange={handleChange} />
      <TextField label="Description" name="description" fullWidth onChange={handleChange} />
      <TextField label="Image" name="image" fullWidth onChange={handleChange} />
      <TextField label="Code HTML" name="code" fullWidth onChange={handleChange} />
      <TextField label="carroussel" name="carroussel" fullWidth onChange={handleChange} />
      <TextField label="Date de publication" name="datePublication" type="date" fullWidth onChange={handleChange} InputLabelProps={{ shrink: true }} />
      <TextField label="Styles (JSON)" name="styles" fullWidth onChange={handleChange} placeholder='{"color": "red"}' />
    </>
  );

  return (
    <Paper style={{ padding: 20, maxWidth: 800, margin: 'auto' }}>
      <Typography variant="h5" gutterBottom>Ajouter un contenu</Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              select
              label="Type de contenu"
              fullWidth
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              {Object.keys(contenuTypes).map((key) => (
                <MenuItem key={key} value={key}>
                  {contenuTypes[key].label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {commonFields && (
            <Grid item xs={12} container spacing={2}>
              {React.Children.toArray(commonFields.props.children)}
            </Grid>
          )}

          {type && contenuTypes[type].specificFields.map((field) => (
            <Grid item xs={12} key={field.name}>
              <TextField
                label={field.label}
                name={field.name}
                fullWidth
                type={field.type}
                onChange={handleChange}
              />
            </Grid>
          ))}

          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Ajouter
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default AddContenu;
