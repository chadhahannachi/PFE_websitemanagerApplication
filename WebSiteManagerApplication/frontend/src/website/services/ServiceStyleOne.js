import React, { useState, useEffect } from 'react';
import './OurServices.css';
import EditorText from '../aboutus/EditorText';
import EditorServiceStyleOne from './EditorServiceStyleOne';
import axios from 'axios';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';

export default function ServiceStyleOne({ services, contentType = 'services', styleKey = 'styleOne' }) {
  const [selectedElement, setSelectedElement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [positions, setPositions] = useState({
    sectionName: { top: 0, left: 0 },
    serviceGrid: { top: 50, left: 0 },
  });
  const [styles, setStyles] = useState({
    sectionName: {
      color: '#000',
      fontSize: '28px',
      fontFamily: 'Arial',
      fontWeight: '700',
      width: '100%',
      maxWidth: '600px',
      textAlign: 'center',
      marginBottom: '20px',
    },
    serviceGrid: {
      width: 1400,
      minHeight: 400,
    },
  });
  const [texts, setTexts] = useState({
    sectionName: 'NOS SERVICES',
  });
  const [pendingServiceStyles, setPendingServiceStyles] = useState({});
  const [pendingServicePositions, setPendingServicePositions] = useState({});
  const [userEntreprise, setUserEntreprise] = useState(null);

  // Validation functions
  const isValidPosition = (pos) => pos && typeof pos === 'object' && typeof pos.top === 'number' && typeof pos.left === 'number';
  const isValidStyle = (style) => style && typeof style === 'object' && Object.keys(style).length > 0;
  const isValidText = (text) => typeof text === 'string' && text.trim().length > 0;

  // Fetch user enterprise
  const token = localStorage.getItem('token');
  let userId = null;
  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      userId = decodedToken?.sub;
    } catch (error) {
      console.error('Error decoding token:', error);
      setError('Erreur lors du décodage du token.');
      setLoading(false);
    }
  } else {
    console.error('Token is missing from localStorage.');
    setError('Token manquant. Veuillez vous connecter.');
    setLoading(false);
  }

  const fetchUserEntreprise = async () => {
    if (!token || !userId) {
      console.error('Token or User ID is missing');
      setError('Token ou ID utilisateur manquant.');
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
        setError("Entreprise de l'utilisateur non trouvée.");
        setLoading(false);
        return;
      }
      setUserEntreprise(user.entreprise);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Erreur lors de la récupération des données utilisateur.');
      setLoading(false);
    }
  };

  // Fetch preferences
  const fetchPreferences = async () => {
    if (!userEntreprise) {
      console.log('userEntreprise not yet available');
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:5000/preferences/entreprise/${userEntreprise}/preferences`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const fetchedPreferences = response.data.preferences?.[contentType]?.[styleKey] || {};

      const newPositions = {
        sectionName: isValidPosition(fetchedPreferences.positions?.sectionName)
          ? fetchedPreferences.positions.sectionName
          : positions.sectionName,
        serviceGrid: isValidPosition(fetchedPreferences.positions?.serviceGrid)
          ? fetchedPreferences.positions.serviceGrid
          : positions.serviceGrid,
      };

      const newStyles = {
        sectionName: isValidStyle(fetchedPreferences.styles?.sectionName)
          ? fetchedPreferences.styles.sectionName
          : styles.sectionName,
        serviceGrid: isValidStyle(fetchedPreferences.styles?.serviceGrid)
          ? fetchedPreferences.styles.serviceGrid
          : styles.serviceGrid,
      };

      const newTexts = {
        sectionName: isValidText(fetchedPreferences.texts?.sectionName)
          ? fetchedPreferences.texts.sectionName
          : texts.sectionName,
      };

      setPositions(newPositions);
      setStyles(newStyles);
      setTexts(newTexts);
    } catch (error) {
      console.error('Error fetching preferences:', error);
      toast.error('Erreur lors du chargement des préférences');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && userId) {
      fetchUserEntreprise();
    }
  }, []);

  useEffect(() => {
    if (userEntreprise) {
      fetchPreferences();
    }
  }, [userEntreprise]);

  const handlePositionChange = (element, newPosition) => {
    if (isValidPosition(newPosition)) {
      setPositions((prev) => ({
        ...prev,
        [element]: newPosition,
      }));
    }
  };

  const handleStyleChange = (element, newStyles) => {
    if (isValidStyle(newStyles)) {
      setStyles((prev) => ({
        ...prev,
        [element]: newStyles,
      }));
    }
  };

  const handleTextChange = (element, newText) => {
    if (isValidText(newText)) {
      setTexts((prev) => ({
        ...prev,
        [element]: newText,
      }));
    }
  };

  const handleServiceStyleChange = (serviceId, newStyles) => {
    if (serviceId && isValidStyle(newStyles)) {
      setPendingServiceStyles((prev) => {
        const existingStyles = prev[serviceId] || {};
        const mergedStyles = {
          ...existingStyles,
          ...newStyles,
          card: { ...existingStyles.card, ...newStyles.card },
          title: { ...existingStyles.title, ...newStyles.title },
          description: { ...existingStyles.description, ...newStyles.description },
          image: { ...existingStyles.image, ...newStyles.image },
        };
        
        return {
          ...prev,
          [serviceId]: mergedStyles,
        };
      });
    }
  };

  const handleServicePositionChange = (serviceId, newPositions) => {
    if (serviceId && newPositions && typeof newPositions === 'object') {
      setPendingServicePositions((prev) => ({
        ...prev,
        [serviceId]: newPositions,
      }));
    }
  };

  const saveAllChanges = async () => {
    if (!userEntreprise) {
      toast.error("ID de l'entreprise manquant");
      return;
    }

    if (
      !isValidPosition(positions.sectionName) ||
      !isValidPosition(positions.serviceGrid) ||
      !isValidStyle(styles.sectionName) ||
      !isValidStyle(styles.serviceGrid) ||
      !isValidText(texts.sectionName)
    ) {
      toast.error('Données de position, style ou texte invalides');
      return;
    }

    try {
      const preferencesResponse = await axios.post(
        'http://localhost:5000/preferences/entreprise',
        {
          entreprise: userEntreprise,
          preferences: {
            [contentType]: {
              [styleKey]: {
                positions,
                styles,
                texts,
              },
            },
          },
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      for (const [serviceId, serviceStyles] of Object.entries(pendingServiceStyles)) {
        if (serviceId && isValidStyle(serviceStyles)) {
          try {
            await axios.patch(
              `http://localhost:5000/contenus/Service/${serviceId}/styles`,
              serviceStyles,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
          } catch (error) {
            console.error(`Failed to save styles for service ${serviceId}:`, error.response?.status, error.response?.data);
            toast.error(`Erreur lors de la sauvegarde des styles pour le service ${serviceId}`);
          }
        }
      }

      for (const [serviceId, servicePositions] of Object.entries(pendingServicePositions)) {
        if (serviceId && servicePositions) {
          try {
            await axios.patch(
              `http://localhost:5000/contenus/Service/${serviceId}`,
              { positions: servicePositions },
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
          } catch (error) {
            console.error(`Failed to save positions for service ${serviceId}:`, error.response?.status, error.response?.data);
            toast.error(`Erreur lors de la sauvegarde des positions pour le service ${serviceId}`);
          }
        }
      }

      setPendingServiceStyles({});
      setPendingServicePositions({});
      toast.success('Modifications sauvegardées avec succès');
    } catch (error) {
      console.error('Error saving changes:', error);
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>Erreur: {error}</div>;
  }

  return (
    <div className="services-style-one-container">
      <EditorText
        elementType="h1"
        initialPosition={positions.sectionName}
        initialStyles={styles.sectionName}
        onSelect={setSelectedElement}
        onPositionChange={(newPosition) => handlePositionChange('sectionName', newPosition)}
        onStyleChange={(newStyles) => handleStyleChange('sectionName', newStyles)}
        onTextChange={(newText) => handleTextChange('sectionName', newText)}
      >
        {texts.sectionName}
      </EditorText>
      <EditorServiceStyleOne
        services={services}
        initialPosition={positions.serviceGrid}
        initialStyles={styles.serviceGrid}
        onSelect={setSelectedElement}
        onPositionChange={(newPosition) => handlePositionChange('serviceGrid', newPosition)}
        onStyleChange={handleServiceStyleChange}
        onUpdate={handleServicePositionChange}
      />
      <button onClick={saveAllChanges}>Enregistrer les modifications</button>
    </div>
  );
}