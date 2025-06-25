import React, { useState, useEffect } from 'react';
import '../../website/events/LatestEvents.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

export default function EventStyleThreeDisplay({ events = [], contentType = 'events', styleKey = 'styleThree', entrepriseId }) {
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
  const [cardStyles, setCardStyles] = useState({
    title: {
      color: '#014268',
      fontSize: '18px',
      fontFamily: 'Arial',
      fontWeight: '600',
      textAlign: 'left',
      fontStyle: 'normal',
      textDecoration: 'none',
    },
    description: {
      color: '#555',
      fontSize: '14px',
      fontFamily: 'Arial',
      textAlign: 'left',
      fontWeight: 'normal',
      fontStyle: 'normal',
      textDecoration: 'none',
    },
    date: {
      color: '#999',
      fontSize: '14px',
      fontFamily: 'Arial',
      textAlign: 'left',
      fontWeight: 'normal',
      fontStyle: 'normal',
      textDecoration: 'none',
    },
  });
  const [eventData, setEventData] = useState([]);
  const [userEntreprise, setUserEntreprise] = useState(null);

  // Validation functions
  const isValidPosition = (pos) => pos && typeof pos === 'object' && typeof pos.top === 'number' && typeof pos.left === 'number';
  const isValidStyle = (style) => style && typeof style === 'object' && Object.keys(style).length > 0;
  const isValidText = (text) => typeof text === 'string' && text.trim().length > 0;

  // Fetch user enterprise
//   const token = localStorage.getItem('token');
//   let userId = null;
//   if (token) {
//     try {
//       const decodedToken = jwtDecode(token);
//       userId = decodedToken?.sub;
//     } catch (error) {
//       console.error('Error decoding token:', error);
//       setError('Erreur lors du décodage du token.');
//       setLoading(false);
//     }
//   } else {
//     console.error('Token is missing from localStorage.');
//     setError('Token manquant. Veuillez vous connecter.');
//     setLoading(false);
//   }

//   const fetchUserEntreprise = async () => {
//     if (!token || !userId) {
//       console.error('Token or User ID is missing');
//       setError('Token ou ID utilisateur manquant.');
//       setLoading(false);
//       return;
//     }

//     try {
//       const config = {
//         headers: { Authorization: `Bearer ${token}` },
//       };
//       const userResponse = await axios.get(`http://localhost:5000/auth/user/${userId}`, config);
//       const user = userResponse.data;
//       if (!user.entreprise) {
//         console.error("User's company (entreprise) is missing");
//         setError("Entreprise de l'utilisateur non trouvée.");
//         setLoading(false);
//         return;
//       }
//       setUserEntreprise(user.entreprise);
//     } catch (error) {
//       console.error('Error fetching user data:', error);
//       setError('Erreur lors de la récupération des données utilisateur.');
//       setLoading(false);
//     }
//   };

  // Fetch preferences
  const fetchPreferences = async () => {
    if (!entrepriseId) {
      console.log('entrepriseId not yet available');
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:5000/preferences/entreprise/${entrepriseId}/preferences`
      );
      const fetchedPreferences = response.data.preferences?.[contentType]?.[styleKey] || {};

      const newPositions = {
        sectionName: isValidPosition(fetchedPreferences.positions?.sectionName)
          ? fetchedPreferences.positions.sectionName
          : positions.sectionName,
        eventGrid: isValidPosition(fetchedPreferences.positions?.eventGrid)
          ? fetchedPreferences.positions.eventGrid
          : { top: 100, left: 0 }, // Adjusted default to avoid overlap
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

      // Fetch event styles if available
      const eventStyles = fetchedPreferences.cardStyles || cardStyles;
      setCardStyles(eventStyles);
    } catch (error) {
      console.error('Error fetching preferences:', error);
      toast.error('Erreur lors du chargement des préférences');
    } finally {
      setLoading(false);
    }
  };

  // Initialize event data
  useEffect(() => {
    setEventData(events.map((event) => ({
      ...event,
      styles: cardStyles,
    })));
  }, [events]);

//   useEffect(() => {
//     if (token && userId) {
//       fetchUserEntreprise();
//     }
//   }, []);

  useEffect(() => {
    if (entrepriseId) {
      fetchPreferences();
    }
  }, [entrepriseId]);

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>Erreur: {error}</div>;
  }

  if (!eventData.length) {
    return <div>Aucun événement disponible.</div>;
  }

  return (
    <div className="events-style-three-container" style={{ position: 'relative' }}>
      <h1
        style={{
          position: 'relative',
          marginBottom: '20px',
          ...styles.sectionName,
        }}
      >
        {texts.sectionName}
      </h1>
      <div
        className="events-container style-three"
        style={{
          width: '100%',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 0,
          borderRadius: '20px',
          overflow: 'hidden',
        }}
      >
        {eventData.map((event, index) => (
          <div
            key={event._id || index}
            className="event-item"
            style={{
              width: 340,
              display: 'flex',
              flexDirection: 'column',
              borderRight: index < eventData.length - 1 ? '1px solid #e0e0e0' : 'none',
              border: '1px solid #e0e0e0',
              borderRadius:
                index === 0
                  ? '20px 0 0 20px'
                  : index === eventData.length - 1
                  ? '0 20px 20px 0'
                  : '0',
              backgroundColor: 'transparent',
            }}
          >
            <img
              src={event.img}
              alt={event.title}
              className="event-image"
              style={{ width: '100%', height: '180px', objectFit: 'cover' }}
            />
            <div
              className="event-content"
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '15px',
              }}
            >
              <div>
                <h3 style={{ ...cardStyles.title, marginBottom: '10px' }}>
                  {event.title}
                </h3>
                <p style={{ ...cardStyles.description, marginBottom: '15px' }}>
                  {event.desc}
                </p>
              </div>
              <div
                className="event-date"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginTop: 'auto',
                  paddingTop: '10px',
                  borderTop: '1px solid #e0e0e0',
                }}
              >
                <CalendarMonthIcon className="calendar-icon" style={{ marginRight: '5px', color: cardStyles.date.color }} />
                <span style={{ ...cardStyles.date }}>
                  {event.date}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}