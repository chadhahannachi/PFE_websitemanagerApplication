
import React, { useState, useEffect } from 'react';
import '../../website/slider/Slider.css';
import axios from 'axios';

import SliderStyleTwoDisplay from './SliderStyleTwoDisplay';
import SliderStyleOne from '../../website/slider/SliderStyleOne';

const styles = [
  { name: 'Classic Slider', component: SliderStyleOne },
  { name: 'Modern Slider', component: SliderStyleTwoDisplay },
];

export default function SliderDisplay({ styleIndex, entrepriseId, sliderStyles = {} }) {
  const [hasSlides, setHasSlides] = useState(false);
  const [loading, setLoading] = useState(true);

  // Vérifier s'il y a des slides pour l'entreprise
  const checkSlides = async () => {
    if (!entrepriseId) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:5000/slides/entreprise/${entrepriseId}/slides`
      );

      // Vérifier s'il y a des slides
      setHasSlides(response.data && response.data.length > 0);
    } catch (error) {
      console.error('Error checking slides:', error);
      setHasSlides(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (entrepriseId) {
      checkSlides();
    } else {
      setLoading(false);
    }
  }, [entrepriseId]);

  // Si en cours de chargement, afficher SliderStyleOne
  if (loading) {
    return <SliderStyleOne entrepriseId={entrepriseId} />;
  }

  // Si pas de slides, afficher SliderStyleOne
  if (!hasSlides) {
    return <SliderStyleOne entrepriseId={entrepriseId} />;
  }

  // Si il y a des slides, afficher SliderStyleTwoDisplay
  return <SliderStyleTwoDisplay entrepriseId={entrepriseId} sliderStyles={sliderStyles} />;
}