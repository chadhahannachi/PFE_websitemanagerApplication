import React, { useState, useEffect } from 'react';
import './LatestEvents.css';
import EditorText from '../aboutus/EditorText';
import EditorEventGrid from './EditorEventGrid';
import axios from 'axios';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';

import ReactDOM from 'react-dom';


const SuccessNotification = ({ show, message }) => {
  if (!show) return null;
  
  return ReactDOM.createPortal(
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      backgroundColor: '#c6c6c6',
      color: 'white',
      padding: '15px 25px',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      zIndex: 10000,
      fontSize: '16px',
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      animation: 'slideInRight 0.3s ease-out',
      border: '1px solid #c6c6c6',
      pointerEvents: 'none'
    }}>
      <div style={{
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        backgroundColor: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#c6c6c6',
        fontSize: '14px',
        fontWeight: 'bold'
      }}>
        ✓
      </div>
      {message}
    </div>,
    document.body
  );
};

export default function EventStyleThree({ events, contentType = 'events', styleKey = 'styleThree' }) {
  const [selectedElement, setSelectedElement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [positions, setPositions] = useState({
    sectionName: { top: 0, left: 0 },
    sectionDesc: { top: 5, left: 0 },
    eventGrid: { top: 70, left: 0 },
  });
  const [styles, setStyles] = useState({
    sectionName: {
      // color: '#f59e0b',
      // fontSize: '20px',
      // fontFamily: 'Arial',
      // fontWeight: '600',
      // width: '100%',
      // maxWidth: '600px',
      color: '#000',
      fontSize: '38px',
      fontFamily: 'inherit',
      fontWeight: '600',
    },
    sectionDesc: {
      // color: '#f59e0b',
      // fontSize: '20px',
      // fontFamily: 'Arial',
      // fontWeight: '600',
      // width: '100%',
      // maxWidth: '600px',
      color: '#000',
      fontSize: '38px',
      fontFamily: 'inherit',
      fontWeight: '600',
    },
    eventGrid: {
      width: 1500,
    },
  });
  const [texts, setTexts] = useState({
    sectionName: 'NOS ÉVÉNEMENTS',
    sectionDesc: 'Découvrez nos événements innovants et adaptés à vos besoins',
  });
  const [pendingEventStyles, setPendingEventStyles] = useState({});
  const [pendingEventPositions, setPendingEventPositions] = useState({});
  const [userEntreprise, setUserEntreprise] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

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
      !isValidPosition(positions.sectionDesc) ||
      !isValidPosition(positions.eventGrid) ||
      !isValidStyle(styles.sectionName) ||
      !isValidStyle(styles.sectionDesc) ||
      !isValidStyle(styles.eventGrid) ||
      !isValidText(texts.sectionName) ||
      !isValidText(texts.sectionDesc)
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
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
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
    <>
    <style>
        {`
          @keyframes slideInRight {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
        `}
      </style>
      
      {/* Notification de succès rendue dans le body */}
      <SuccessNotification 
        show={showSuccessMessage} 
        message="Modifications enregistrées avec succès" 
      />
      
      <div style={{ backgroundColor: 'white', minHeight: '100vh', padding: '20px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '20px',
        padding: '15px 20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #e9ecef'
      }}>
        <span style={{ 
          fontSize: '18px', 
          fontWeight: '600', 
          color: '#495057' 
        }}>events section</span> 

        
        <button 
          onClick={saveAllChanges}
          style={{
            
            padding: '8px',
            backgroundColor: '#777777',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            marginTop: '16px',
            fontSize: '16px',
            fontWeight: '500',
            transition: 'background-color 0.2s ease'
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#c6c6c6';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = '#777777';
          }}
        >
          Enregistrer les modifications
        </button>
      </div>
    <section className="events">
      <div
        className="events-style-three-container"
        style={{
          position: 'relative',
          height: 'auto',
          minHeight: 0,
        }}
      >
                {/* <div style={{width: '35%'}}> */}
                
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
        {/* <EditorText
          elementType="h1"
          initialPosition={positions.sectionDesc}
          // initialStyles={styles.sectionDesc}
          initialStyles={{ ...styles.sectionDesc, border: '2px solid red', zIndex: 10 }}
          onSelect={setSelectedElement}
          onPositionChange={(newPosition) => handlePositionChange('sectionDesc', newPosition)}
          onStyleChange={(newStyles) => handleStyleChange('sectionDesc', newStyles)}
          onTextChange={(newText) => handleTextChange('sectionDesc', newText)}
        >
          {texts.sectionDesc}
        </EditorText> */}
        
        {/* </div> */}
        <EditorEventGrid
          events={events}
          initialPosition={positions.eventGrid}
          initialStyles={styles.eventGrid}
          onSelect={setSelectedElement}
          onPositionChange={(newPosition) => handlePositionChange('eventGrid', newPosition)}
          onStyleChange={handleEventStyleChange}
          onUpdate={handleEventPositionChange}
        />
        {/* <button onClick={saveAllChanges}>Enregistrer les modifications</button> */}
      </div>
    </section>
    </div>
    </>
  );
}