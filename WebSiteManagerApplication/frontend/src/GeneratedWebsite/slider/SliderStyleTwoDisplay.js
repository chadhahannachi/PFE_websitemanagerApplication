import React, { useState, useEffect } from 'react';
import '../../website/slider/Slider.css';
import axios from 'axios';
import { Snackbar, Alert } from '@mui/material';

export default function SliderStyleTwoDisplay({ entrepriseId, sliderStyles = {} }) {
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

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

    try {
      const response = await axios.get(
        `http://localhost:5000/slides/entreprise/${entrepriseId}/slides`
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

  // Styles dynamiques pour le titre
  const titleStyle = {
    color: sliderStyles.titleColor,
    fontFamily: sliderStyles.titleFont,
    fontWeight: sliderStyles.titleBold ,
    fontStyle: sliderStyles.titleItalic ,
    textDecoration: sliderStyles.titleUnderline ,
    transition: 'color 0.2s, font-family 0.2s, text-align 0.2s, font-weight 0.2s, font-style 0.2s, text-decoration 0.2s',
    textAlign: sliderStyles.titlePosition ,
    width: sliderStyles.titlePosition ,
    marginLeft: sliderStyles.titlePosition ,
    marginRight: sliderStyles.titlePosition ,
  };

  // Styles dynamiques pour la description
  const descStyle = {
    color: sliderStyles.descColor,
    fontFamily: sliderStyles.descFont,
    fontWeight: sliderStyles.descBold ? 'bold' : 'normal',
    fontStyle: sliderStyles.descItalic ? 'italic' : 'normal',
    textDecoration: sliderStyles.descUnderline ? 'underline' : 'none',
    transition: 'color 0.2s, font-family 0.2s, text-align 0.2s, font-weight 0.2s, font-style 0.2s, text-decoration 0.2s',
    textAlign: sliderStyles.descPosition === 'center' ? 'center' : 'left',
    width: sliderStyles.descPosition === 'left' ? '50%' : sliderStyles.descPosition === 'right' ? '50%' : '100%',
    marginLeft: sliderStyles.descPosition === 'right' ? '50%' : '0',
    marginRight: sliderStyles.descPosition === 'left' ? '50%' : '0',
  };

  // Style d'alignement global du bloc
  const sectionAlignStyle = {
    textAlign: sliderStyles.sectionAlign === 'center' ? 'center' : 'left',
    width: sliderStyles.sectionAlign === 'left' ? '50%' : sliderStyles.sectionAlign === 'right' ? '50%' : '100%',
    marginLeft: sliderStyles.sectionAlign === 'right' ? '50%' : '0',
    marginRight: sliderStyles.sectionAlign === 'left' ? '50%' : '0',
    display: 'block',
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
          <div className="slide-content-two" style={sectionAlignStyle}>
            <h2
              className={index === currentSlide ? 'focus-in-expand' : ''}
              style={titleStyle}
            >
              {slide.title}
            </h2>
            <h1
              className={index === currentSlide ? 'focus-in-expand' : ''}
              style={descStyle}
            >
              {slide.description}
            </h1>
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