import React, { useState, useEffect } from 'react';
import './Slider.css';
import SliderStyleOne from './SliderStyleOne';
import SliderStyleTwo from './SliderStyleTwo';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const styles = [
  { name: 'Classic Slider', component: SliderStyleOne },
  { name: 'Modern Slider', component: SliderStyleTwo },
];

export default function Slider({ styleIndex, sliderStyles, onOpenSliderStyleForm }) {
  const [hasSlides, setHasSlides] = useState(false);
  const [loading, setLoading] = useState(true);

  // Récupération du token et décodage pour obtenir l'ID de l'utilisateur
  const token = localStorage.getItem('token');
  let userId = null;

  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      userId = decodedToken?.sub;
    } catch (error) {
      console.error('Error decoding token:', error);
      setLoading(false);
    }
  }

  // Récupérer l'entreprise de l'utilisateur connecté
  const fetchUserEntreprise = async () => {
    if (!token || !userId) {
      console.error('Token or User ID is missing');
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const userResponse = await axios.get(`http://localhost:5000/auth/user/${userId}`, config);
      const user = userResponse.data;

      if (!user.entreprise) {
        console.error("User's company (entreprise) is missing");
        setLoading(false);
        return;
      }

      return user.entreprise;
    } catch (error) {
      console.error('Error fetching user data:', error);
      setLoading(false);
      return null;
    }
  };

  // Vérifier s'il y a des slides pour l'entreprise
  const checkSlides = async () => {
    if (!token || !userId) {
      setLoading(false);
      return;
    }

    try {
      const userEntreprise = await fetchUserEntreprise();
      if (!userEntreprise) {
        setLoading(false);
        return;
      }

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      
      const response = await axios.get(
        `http://localhost:5000/slides/entreprise/${userEntreprise}/slides`,
        config
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
    if (token && userId) {
      checkSlides();
    } else {
      setLoading(false);
    }
  }, []);

  // Si en cours de chargement, afficher SliderStyleOne
  if (loading) {
    return <SliderStyleOne sliderStyles={sliderStyles} onOpenSliderStyleForm={onOpenSliderStyleForm} />;
  }

  // Si pas de slides, afficher SliderStyleOne
  if (!hasSlides) {
    return <SliderStyleOne sliderStyles={sliderStyles} onOpenSliderStyleForm={onOpenSliderStyleForm} />;
  }

  // Si il y a des slides, afficher SliderStyleTwo
  return <SliderStyleTwo sliderStyles={sliderStyles} onOpenSliderStyleForm={onOpenSliderStyleForm} />;
}