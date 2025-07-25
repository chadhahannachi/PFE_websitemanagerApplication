import React, { useState, useEffect } from 'react';
import '../../website/events/LatestEvents.css';
import axios from 'axios';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

export default function EventStyleTwoDisplay({ events = [], contentType = 'events', styleKey = 'styleTwo', entrepriseId }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [positions, setPositions] = useState({
    sectionName: { top: 30, left: 0 },
    // description: { top: 35, left: 0 },
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
    // description: {
    //   color: 'black',
    //   fontSize: '30px',
    //   fontFamily: 'Arial',
    //   fontWeight: '600',
    //   width: '100%',
    //   maxWidth: '100%',
    // },
    eventGrid: {
      width: 1200,
      backgroundColor: '#ffffff',
      borderRadius: '10px',
    },
    eventCard: {
      backgroundColor: '#fff',
      borderRadius: '10px',
      width: 300,
      height: 350,
    },
  });
  const [texts, setTexts] = useState({
    sectionName: 'NOS ÉVÉNEMENTS',
    // description: 'DISCOVER ALL THE NEWS AND NOVELTIES OF OUR COMPANY',
  });

  useEffect(() => {
    async function fetchPreferences() {
      if (!entrepriseId) return;
      try {
        const response = await axios.get(
          `http://localhost:5000/preferences/entreprise/${entrepriseId}/preferences`
        );
        const fetchedPreferences = response.data.preferences?.[contentType]?.[styleKey] || {};
        setPositions({
          sectionName: fetchedPreferences.positions?.sectionName || positions.sectionName,
          // description: fetchedPreferences.positions?.description || positions.description,
          eventGrid: fetchedPreferences.positions?.eventGrid || positions.eventGrid,
        });
        setStyles({
          sectionName: fetchedPreferences.styles?.sectionName || styles.sectionName,
          // description: fetchedPreferences.styles?.description || styles.description,
        //   eventGrid: fetchedPreferences.styles?.eventGrid || styles.eventGrid,
          eventCard: fetchedPreferences.styles?.eventCard || styles.eventCard,
        });
        setTexts({
          sectionName: fetchedPreferences.texts?.sectionName || texts.sectionName,
          // description: fetchedPreferences.texts?.description || texts.description,
        });
      } catch (err) {
        setError('Erreur lors du chargement des préférences.');
      }
      setLoading(false);
    }
    fetchPreferences();
    // eslint-disable-next-line
  }, [entrepriseId]); 

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur : {error}</div>;

  return (
    <div className="events eventtwo-responsive" style={{ position: 'relative' }}>
      <h1
        className="eventtwo-stack"
        style={{
          position: 'absolute',
          ...styles.sectionName,
          ...positions.sectionName,
        }}
      >
        {texts.sectionName}
      </h1>
      {/* <h2
        style={{
          // position: 'absolute',
          marginBottom: '20px',
          ...styles.description,
          ...positions.description,
        }}
      >
        {texts.description}
      </h2> */}
      <div
        className="events-container style-two eventtwo-grid"
        style={{
          position: 'absolute',
          top: positions.eventGrid.top,
          left: positions.eventGrid.left,
          width: styles.eventGrid?.width || 1200,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '5px',
          padding: '20px',
        }}
      >
        {events.map((event, index) => (
          <div
            key={event.id || index}
            className="event-item"
            style={{
              ...(event.styles?.card || styles.eventCard),
              margin: 'auto',
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s ease',
            }}
          >
            <img
              src={event.img}
              alt={event.title}
              className="event-image"
              style={{ width: '100%', height: '200px', objectFit: 'cover' }}
            />
            <div className="event-content" style={{ padding: '20px' }}>
              <h3 style={{
                ...(event.styles?.title || styles.eventCard?.title || {}),
                marginBottom: '10px',
              }}>{event.title}</h3>
              <p style={{
                ...(event.styles?.description || styles.eventCard?.description || {}),
                marginBottom: '15px',
              }}>{event.desc}</p>
              <div className="event-date" style={{ display: 'flex', alignItems: 'center' }}>
                <CalendarMonthIcon className="calendar-icon" style={{ marginRight: '5px', color: (event.styles?.date?.color || styles.eventCard?.date?.color || '#999') }} />
                <span style={{ ...(event.styles?.date || styles.eventCard?.date || {}) }}>{event.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 