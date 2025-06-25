import React, { useState, useEffect } from 'react';
import '../../website/slider/Slider.css';
import axios from 'axios';
import { Snackbar, Alert } from '@mui/material';

export default function SliderStyleTwoDisplay({ entrepriseId }) {
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // Récupération du token pour l'authentification
  const token = localStorage.getItem('token');

  // Récupérer les slides associées à l'entreprise passée en prop
  const fetchSlides = async () => {
    if (!entrepriseId) {
      console.error('Entreprise ID is missing');
      setSnackbar({
        open: true,
        message: 'ID de l’entreprise manquant pour récupérer les slides.',
        severity: 'error',
      });
      setLoading(false);
      return;
    }

    if (!token) {
      console.error('Token is missing');
      setSnackbar({
        open: true,
        message: 'Token manquant. Veuillez vous connecter.',
        severity: 'error',
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const response = await axios.get(
        `http://localhost:5000/slides/entreprise/${entrepriseId}/slides`,
        config
      );
      // Map backend data to match expected slide structure
      const mappedSlides = response.data.map((slide) => ({
        title: slide.titre,
        description: slide.description,
        image: slide.image,
      }));
      setSlides(mappedSlides);
    } catch (error) {
      console.error('Error fetching slides by entreprise:', error.response?.status, error.response?.data);
      setSnackbar({
        open: true,
        message: `Erreur lors de la récupération des slides: ${error.message}`,
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  // Appeler fetchSlides lorsque entrepriseId change
  useEffect(() => {
    if (entrepriseId) {
      fetchSlides();
    }
  }, [entrepriseId]);

  // Gestion du carrousel
  useEffect(() => {
    if (slides.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
      }, 3000); // Change slide every 3 seconds
      return () => clearInterval(interval);
    }
  }, [slides]);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // Afficher un message de chargement ou d'erreur si aucune slide n'est disponible
  if (loading) {
    return <div>Chargement des slides...</div>;
  }

  if (slides.length === 0) {
    return (
      <div>
        Aucune slide disponible pour votre entreprise.
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </div>
    );
  }

  return (
    <div className="slider style-two">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`slide-two ${index === currentSlide ? 'active' : ''}`}
          style={{ backgroundImage: `url(${slide.image})` }}
        >
          <div className="slide-content-two">
            <h2 className={index === currentSlide ? 'focus-in-expand' : ''}>{slide.title}</h2>
            <h1 className={index === currentSlide ? 'focus-in-expand' : ''}>{slide.description}</h1>
          </div>
        </div>
      ))}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}