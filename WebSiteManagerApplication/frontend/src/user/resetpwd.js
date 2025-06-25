import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Card,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
} from '@mui/material';

const RequestPasswordReset = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/auth/reset-password-request', { email });
      setMessage('Un email de réinitialisation a été envoyé.');
      setMessageType('success');
      setOpenSnackbar(true);
    } catch (error) {
      setMessage('Erreur lors de la demande. Vérifiez votre email.');
      setMessageType('error');
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container maxWidth="xs" style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Card style={{ padding: '20px' }}>
        <Typography variant="h5" align="center">Réinitialisation du mot de passe</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            variant="outlined"
            label="Entrez votre email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Envoyer
          </Button>
        </form>
        <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity={messageType} sx={{ width: '100%' }}>
            {message}
          </Alert>
        </Snackbar>
      </Card>
    </Container>
  );
};

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("Token invalide !");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/auth/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la réinitialisation");
      }

      setMessage("Mot de passe réinitialisé avec succès !");
      setMessageType("success");
      setOpenSnackbar(true);
    } catch (error) {
      console.error(error);
      setMessage("Échec de la réinitialisation du mot de passe.");
      setMessageType("error");
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container maxWidth="xs" style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Card style={{ padding: '20px' }}>
        <Typography variant="h5" align="center">Nouveau mot de passe</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            variant="outlined"
            label="Nouveau mot de passe"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" variant="contained" color="success" fullWidth>
            Réinitialiser
          </Button>
        </form>
        <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity={messageType} sx={{ width: '100%' }}>
            {message}
          </Alert>
        </Snackbar>
      </Card>
    </Container>
  );
};

export { RequestPasswordReset, ResetPassword };
