import React, { useState, useEffect } from 'react';
import './Sidebar.css';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// MUI Components
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const styleOptions = {
  solutions: [
    { name: 'Numbered Cards', value: 0 },
    { name: 'Image Cards', value: 1 },
    { name: 'Hover Effect', value: 2 },
    { name: 'Image Hover Side by Side', value: 3 },
  ],
  events: [
    { name: 'Intro with Cards', value: 0 },
    { name: 'Image Cards', value: 1 },
    { name: 'Rounded Container', value: 2 },
  ],
  news: [
    { name: 'Grid with Buttons', value: 0 },
    { name: 'Icon Cards', value: 1 },
    { name: 'Scrollable Cards', value: 2 },
  ],
  faq: [
    { name: 'Accordion (Classic)', value: 0 },
    { name: 'Card Minimalist', value: 1 },
    { name: 'Style 3', value: 2 },
  ],
  services: [
    { name: 'List Cards', value: 0 },
    { name: 'Modern Cards', value: 1 },
  ],
  partners: [
    { name: 'Cards Slider', value: 0 },
    { name: 'Images Slider', value: 1 },
  ],
  about: [
    { name: 'Simple Layout', value: 0 },
    { name: 'Modern Layout', value: 1 },
  ],
  units: [
    { name: 'Classic Layout', value: 0 },
    { name: 'Modern Cards', value: 1 },
  ],
  contact: [
    { name: 'Classic Layout', value: 0 },
    { name: 'Modern Layout', value: 1 },
  ],
  slider: [
    { name: 'Classic Slider', value: 0 },
    { name: 'Modern Slider', value: 1 },
  ],
};

export default function LeftSidebar({ onStyleChange, onToggle }) {
  const [userEntreprise, setUserEntreprise] = useState(null);
  const [preferences, setPreferences] = useState({
    solutionsStyle: 0,
    eventsStyle: 0,
    newsStyle: 0,
    faqStyle: 0,
    servicesStyle: 0,
    partnersStyle: 0,
    aboutStyle: 0,
    unitsStyle: 0,
    contactStyle: 0,
    sliderStyle: 0,
  });
  const [tempPreferences, setTempPreferences] = useState(preferences);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isExpanded, setIsExpanded] = useState(true);

  // Récupérer l'entreprise de l'utilisateur
  const fetchUserEntreprise = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Token manquant. Veuillez vous connecter.');
      setLoading(false);
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken?.sub;
      console.log('User ID décodé:', userId);
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const userResponse = await axios.get(`http://localhost:5000/auth/user/${userId}`, config);
      console.log('Réponse utilisateur:', userResponse.data);
      setUserEntreprise(userResponse.data.entreprise);
    } catch (error) {
      console.error('Erreur lors de la récupération des données utilisateur:', error);
      setError('Erreur lors de la récupération des données utilisateur.');
      setLoading(false);
    }
  };

  // Récupérer les préférences
  const fetchPreferences = async () => {
    if (!userEntreprise) {
      console.log('Entreprise non définie, annulation de fetchPreferences');
      return;
    }

    try {
      console.log('Récupération des préférences pour entreprise:', userEntreprise);
      const response = await axios.get(
        `http://localhost:5000/preferences/entreprise/${userEntreprise}/preferences`
      );
      // console.log('Réponse des préférences:', response.data);
      const fetchedPreferences = response.data.preferences || {
        solutionsStyle: 0,
        eventsStyle: 0,
        newsStyle: 0,
        faqStyle: 0,
        servicesStyle: 0,
        partnersStyle: 0,
        aboutStyle: 0,
        unitsStyle: 0,
        contactStyle: 0,
        sliderStyle: 0,
      };
      const validPreferences = {
        solutionsStyle: Number.isInteger(fetchedPreferences.solutionsStyle)
          ? fetchedPreferences.solutionsStyle
          : 0,
        eventsStyle: Number.isInteger(fetchedPreferences.eventsStyle)
          ? fetchedPreferences.eventsStyle
          : 0,
        newsStyle: Number.isInteger(fetchedPreferences.newsStyle)
          ? fetchedPreferences.newsStyle
          : 0,
        faqStyle: Number.isInteger(fetchedPreferences.faqStyle)
          ? fetchedPreferences.faqStyle
          : 0,
        servicesStyle: Number.isInteger(fetchedPreferences.servicesStyle)
          ? fetchedPreferences.servicesStyle
          : 0,
        partnersStyle: Number.isInteger(fetchedPreferences.partnersStyle)
          ? fetchedPreferences.partnersStyle
          : 0,
        aboutStyle: Number.isInteger(fetchedPreferences.aboutStyle)
          ? fetchedPreferences.aboutStyle
          : 0,
        unitsStyle: Number.isInteger(fetchedPreferences.unitsStyle)
          ? fetchedPreferences.unitsStyle
          : 0,
        contactStyle: Number.isInteger(fetchedPreferences.contactStyle)
          ? fetchedPreferences.contactStyle
          : 0,
        sliderStyle: Number.isInteger(fetchedPreferences.sliderStyle)
          ? fetchedPreferences.sliderStyle
          : 0,
      };
      console.log('Préférences validées:', validPreferences);
      setPreferences(validPreferences);
      setTempPreferences(validPreferences);
      onStyleChange(validPreferences);
    } catch (error) {
      console.error('Erreur lors de la récupération des préférences:', error);
      setError('Erreur lors de la récupération des préférences.');
    } finally {
      setLoading(false);
    }
  };

  // Sauvegarder les préférences dans la base de données
  const savePreferences = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Sauvegarde des préférences:', tempPreferences);
      const response = await axios.post(
        'http://localhost:5000/preferences/entreprise',
        { entreprise: userEntreprise, preferences: tempPreferences },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Réponse de la sauvegarde:', response.data);
      setPreferences(tempPreferences);
      onStyleChange(tempPreferences);
      setSuccessMessage('Préférences enregistrées avec succès !');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des préférences:', error);
      setError('Erreur lors de la sauvegarde des préférences.');
    }
  };

  // Gérer le changement de style temporaire
  const handleStyleChange = (section, value) => {
    console.log(`Changement de style pour ${section}:`, value);
    const newTempPreferences = { ...tempPreferences, [section]: value };
    setTempPreferences(newTempPreferences);
    onStyleChange(newTempPreferences);
  };

  // Basculer entre état élargi et réduit
  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
    onToggle(!isExpanded);
  };

  useEffect(() => {
    fetchUserEntreprise();
  }, []);

  useEffect(() => {
    if (userEntreprise) {
      fetchPreferences();
    }
  }, [userEntreprise]);

  return (
    <div className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <button className="toggle-button" onClick={toggleSidebar}>
        {isExpanded ? <ChevronLeftIcon size={24} /> : <ChevronRightIcon size={24} />}
      </button>
      {isExpanded && (
        <>
          {loading ? (
            <div className="sidebar-loading">Chargement...</div>
          ) : error ? (
            <div className="sidebar-error">Erreur : {error}</div>
          ) : (
            <>
              {Object.keys(styleOptions).map((section) => (
                <div key={section} className="sidebar-section">
                  <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                    <InputLabel id={`${section}-select-label`}>
                      {section.charAt(0).toUpperCase() + section.slice(1)}
                    </InputLabel>
                    <Select
                      labelId={`${section}-select-label`}
                      id={`${section}-select`}
                      // value={tempPreferences[`${section}Style`]}
                      onChange={(e) => handleStyleChange(`${section}Style`, e.target.value)}
                      label={section.charAt(0).toUpperCase() + section.slice(1)}
                    >
                      {styleOptions[section].map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              ))}
              <button className="save-button" onClick={savePreferences}>
                Save
              </button>
              {successMessage && <div className="success-message">{successMessage}</div>}
            </>
          )}
        </>
      )}
    </div>
  );
}