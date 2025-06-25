import React, { useState, useEffect } from 'react';
import './LatestEvents.css';
import EditorText from '../aboutus/EditorText';
import EditorEventGrid from './EditorEventGrid';
import axios from 'axios';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';

export default function EventStyleThree({ events, contentType = 'events', styleKey = 'styleThree' }) {
  const [selectedElement, setSelectedElement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [positions, setPositions] = useState({
    sectionName: { top: 0, left: 0 },
    eventGrid: { top: 50, left: 0 },
  });
  const [styles, setStyles] = useState({
    sectionName: {
      color: '#f59e0b',
      fontSize: '20px',
      fontFamily: 'Arial',
      fontWeight: '600',
      width: '100%',
      maxWidth: '600px',
    },
    eventGrid: {
      width: 1500,
    },
  });
  const [texts, setTexts] = useState({
    sectionName: 'NOS ÉVÉNEMENTS',
  });
  const [pendingEventStyles, setPendingEventStyles] = useState({});
  const [pendingEventPositions, setPendingEventPositions] = useState({});
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
        eventGrid: isValidPosition(fetchedPreferences.positions?.eventGrid)
          ? fetchedPreferences.positions.eventGrid
          : positions.eventGrid,
      };

      const newStyles = {
        sectionName: isValidStyle(fetchedPreferences.styles?.sectionName)
          ? fetchedPreferences.styles.sectionName
          : styles.sectionName,
        eventGrid: isValidStyle(fetchedPreferences.styles?.eventGrid)
          ? fetchedPreferences.styles.eventGrid
          : styles.eventGrid,
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

  const handleEventStyleChange = (eventId, newStyles) => {
    console.log('handleEventStyleChange appelé:', { eventId, newStyles });
    
    if (eventId && isValidStyle(newStyles)) {
      setPendingEventStyles((prev) => {
        const existingStyles = prev[eventId] || {};
        const mergedStyles = {
          ...existingStyles,
          ...newStyles,
          title: { ...existingStyles.title, ...newStyles.title },
          description: { ...existingStyles.description, ...newStyles.description },
          date: { ...existingStyles.date, ...newStyles.date },
        };
        
        console.log(`Styles fusionnés pour l'événement ${eventId}:`, mergedStyles);
        
        return {
          ...prev,
          [eventId]: mergedStyles,
        };
      });
    }
  };

  const handleEventPositionChange = (eventId, newPositions) => {
    if (eventId && newPositions && typeof newPositions === 'object') {
      setPendingEventPositions((prev) => ({
        ...prev,
        [eventId]: newPositions,
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
      !isValidPosition(positions.eventGrid) ||
      !isValidStyle(styles.sectionName) ||
      !isValidStyle(styles.eventGrid) ||
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

      for (const [eventId, eventStyles] of Object.entries(pendingEventStyles)) {
        if (eventId && isValidStyle(eventStyles)) {
          try {
            await axios.patch(
              `http://localhost:5000/contenus/Evenement/${eventId}/styles`,
              eventStyles,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
          } catch (error) {
            console.error(`Failed to save styles for event ${eventId}:`, error.response?.status, error.response?.data);
            toast.error(`Erreur lors de la sauvegarde des styles pour l'événement ${eventId}`);
          }
        }
      }

      for (const [eventId, eventPositions] of Object.entries(pendingEventPositions)) {
        if (eventId && eventPositions) {
          try {
            await axios.patch(
              `http://localhost:5000/contenus/Evenement/${eventId}`,
              { positions: eventPositions },
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
          } catch (error) {
            console.error(`Failed to save positions for event ${eventId}:`, error.response?.status, error.response?.data);
            toast.error(`Erreur lors de la sauvegarde des positions pour l'événement ${eventId}`);
          }
        }
      }

      setPendingEventStyles({});
      setPendingEventPositions({});
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
    <section className="events">
      <div
        className="events-style-three-container"
        style={{
          position: 'relative',
          height: 'auto',
          minHeight: 0,
        }}
      >
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
        <EditorEventGrid
          events={events}
          initialPosition={positions.eventGrid}
          initialStyles={styles.eventGrid}
          onSelect={setSelectedElement}
          onPositionChange={(newPosition) => handlePositionChange('eventGrid', newPosition)}
          onStyleChange={handleEventStyleChange}
          onUpdate={handleEventPositionChange}
        />
        <button onClick={saveAllChanges}>Enregistrer les modifications</button>
      </div>
    </section>
  );
}