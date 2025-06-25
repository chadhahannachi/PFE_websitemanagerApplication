import React, { useState, useEffect } from 'react';
import './LatestEvents.css';
import EditorText from '../aboutus/EditorText';
import EditorEventStyleOne from './EditorEventStyleOne';
import axios from 'axios';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
 
export default function EventStyleOne({ events, contentType = 'events', styleKey = 'styleOne' }) {
  const [selectedElement, setSelectedElement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [positions, setPositions] = useState({
    sectionName: { top: 0, left: 0 },
    sectionDesc: { top: 0, left: 0 },
    eventGrid: { top: 80, left: 0 },
  });
  const [styles, setStyles] = useState({
    sectionName: {
      color: '#222',
      fontSize: '28px',
      fontFamily: 'Arial',
      fontWeight: '700',
      width: '100%',
      maxWidth: '600px',
      textAlign: 'center',
      marginBottom: '8px',
    },
    sectionDesc: {
      color: 'black',
      fontSize: '28px',
      fontFamily: 'Arial',
      fontWeight: '700',
      width: '50%',
      maxWidth: '600px',
      textAlign: 'center',
      marginBottom: '8px',
    },
    eventGrid: {
      backgroundColor: '#fff',
      borderRadius: '16px',
      padding: '24px',
      width: 1200,
    },
    eventCard: {
      backgroundColor: '#fff',
      borderRadius: '12px',
      width: 320,
      height: 220,
    },
  });
  const [texts, setTexts] = useState({
    sectionName: 'OUR LATEST EVENTS',
    sectionDesc: 'DISCOVER ALL THE NEWS AND NOVELTIES OF OUR COMPANY',
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
      setError('Erreur lors du décodage du token.');
      setLoading(false);
    }
  } else {
    setError('Token manquant. Veuillez vous connecter.');
    setLoading(false);
  }

  const fetchUserEntreprise = async () => {
    if (!token || !userId) {
      setError('Token ou ID utilisateur manquant.');
      setLoading(false);
      return;
    }
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const userResponse = await axios.get(`http://localhost:5000/auth/user/${userId}`, config);
      const user = userResponse.data;
      if (!user.entreprise) {
        setError("Entreprise de l'utilisateur non trouvée.");
        setLoading(false);
        return;
      }
      setUserEntreprise(user.entreprise);
    } catch (error) {
      setError('Erreur lors de la récupération des données utilisateur.');
      setLoading(false);
    }
  };

  // Fetch preferences
  const fetchPreferences = async () => {
    if (!userEntreprise) return;
    try {
      const response = await axios.get(
        `http://localhost:5000/preferences/entreprise/${userEntreprise}/preferences`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const fetchedPreferences = response.data.preferences?.[contentType]?.[styleKey] || {};
      const newPositions = {
        sectionName: isValidPosition(fetchedPreferences.positions?.sectionName)
          ? fetchedPreferences.positions.sectionName
          : positions.sectionName,
        sectionDesc: isValidPosition(fetchedPreferences.positions?.sectionDesc)
          ? fetchedPreferences.positions.sectionDesc
          : positions.sectionDesc,
        eventGrid: isValidPosition(fetchedPreferences.positions?.eventGrid)
          ? fetchedPreferences.positions.eventGrid
          : positions.eventGrid,
      };
      const newStyles = {
        sectionName: isValidStyle(fetchedPreferences.styles?.sectionName)
          ? fetchedPreferences.styles.sectionName
          : styles.sectionName,
        sectionDesc: isValidStyle(fetchedPreferences.styles?.sectionDesc)
          ? fetchedPreferences.styles.sectionDesc
          : styles.sectionDesc,
        eventGrid: isValidStyle(fetchedPreferences.styles?.eventGrid)
          ? fetchedPreferences.styles.eventGrid
          : styles.eventGrid,
        eventCard: isValidStyle(fetchedPreferences.styles?.eventCard)
          ? fetchedPreferences.styles.eventCard
          : styles.eventCard,
      };
      const newTexts = {
        sectionName: isValidText(fetchedPreferences.texts?.sectionName)
          ? fetchedPreferences.texts.sectionName
          : texts.sectionName,
        sectionDesc: isValidText(fetchedPreferences.texts?.sectionDesc)
          ? fetchedPreferences.texts.sectionDesc
          : texts.sectionDesc,
      };
      setPositions(newPositions);
      setStyles(newStyles);
      setTexts(newTexts);
    } catch (error) {
      toast.error('Erreur lors du chargement des préférences');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (token && userId) fetchUserEntreprise(); }, []);
  useEffect(() => { if (userEntreprise) fetchPreferences(); }, [userEntreprise]);

  const handlePositionChange = (element, newPosition) => {
    if (isValidPosition(newPosition)) {
      setPositions((prev) => ({ ...prev, [element]: newPosition }));
    }
  };
  const handleStyleChange = (element, newStyles) => {
    if (isValidStyle(newStyles)) {
      setStyles((prev) => ({ ...prev, [element]: newStyles }));
    }
  };
  const handleTextChange = (element, newText) => {
    if (isValidText(newText)) {
      setTexts((prev) => ({ ...prev, [element]: newText }));
    }
  };
  const handleEventStyleChange = (eventId, newStyles) => {
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
        return { ...prev, [eventId]: mergedStyles };
      });
    }
  };
  const handleEventPositionChange = (eventId, newPositions) => {
    if (typeof eventId === 'object' && !Array.isArray(eventId)) {
      // Cas où on reçoit un mapping { id, { index } }
      const mapping = eventId;
      setPendingEventPositions((prev) => ({ ...prev, ...mapping }));
    } else if (eventId && newPositions && typeof newPositions === 'object') {
      setPendingEventPositions((prev) => ({ ...prev, [eventId]: newPositions }));
    }
  };
  const handleCardStyleChange = (newCardStyles) => {
    setStyles((prev) => ({ ...prev, eventCard: newCardStyles }));
  };

  // Sauvegarde
  const saveAllChanges = async () => {
    if (!userEntreprise) {
      toast.error("ID de l'entreprise manquant");
      return;
    }
    try {
      await axios.post(
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
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Sauvegarde des styles individuels des events
      for (const [eventId, eventStyles] of Object.entries(pendingEventStyles)) {
        if (eventId && isValidStyle(eventStyles)) {
          try {
            await axios.patch(
              `http://localhost:5000/contenus/Evenement/${eventId}/styles`,
              eventStyles,
              { headers: { Authorization: `Bearer ${token}` } }
            );
          } catch (error) {
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
              { headers: { Authorization: `Bearer ${token}` } }
            );
          } catch (error) {
            toast.error(`Erreur lors de la sauvegarde des positions pour l'événement ${eventId}`);
          }
        }
      }
      setPendingEventStyles({});
      setPendingEventPositions({});
      toast.success('Modifications sauvegardées avec succès');
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;

  return (
    <section className="events">
      <div
        className="events-style-one-container"
        style={{ position: 'relative', height: 'auto', minHeight: 0 }}
      >
        <div style={{width: '35%'}}>
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
        <EditorText
          elementType="p"
          initialPosition={positions.sectionDesc || { top: positions.sectionName.top + 60, left: positions.sectionName.left }}
          initialStyles={styles.sectionDesc || { color: '#666', fontSize: '18px', textAlign: 'center', marginBottom: '24px', marginTop: '8px' }}
          onSelect={setSelectedElement}
          onPositionChange={(newPosition) => handlePositionChange('sectionDesc', newPosition)}
          onStyleChange={(newStyles) => handleStyleChange('sectionDesc', newStyles)}
          onTextChange={(newText) => handleTextChange('sectionDesc', newText)}
        >
          {texts.sectionDesc}
        </EditorText></div>
        <EditorEventStyleOne
          events={events}
          initialPosition={positions.eventGrid}
          initialStyles={styles.eventGrid}
          cardStyles={styles.eventCard}
          onSelect={setSelectedElement}
          onPositionChange={(newPosition) => handlePositionChange('eventGrid', newPosition)}
          onStyleChange={handleEventStyleChange}
          onUpdate={handleEventPositionChange}
          onCardStyleChange={handleCardStyleChange}
        />
        <button onClick={saveAllChanges} style={{ marginTop: 16 }}>Enregistrer les modifications</button>
      </div>
    </section>
  );
}