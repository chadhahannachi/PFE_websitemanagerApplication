import React, { useState, useEffect } from 'react';
import '../../website/events/LatestEvents.css';
import axios from 'axios';

export default function EventStyleOneDisplay({ events = [], contentType = 'events', styleKey = 'styleOne', entrepriseId }) {
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
          sectionDesc: fetchedPreferences.positions?.sectionDesc || positions.sectionDesc,
          eventGrid: fetchedPreferences.positions?.eventGrid || positions.eventGrid,
        });
        setStyles({
          sectionName: fetchedPreferences.styles?.sectionName || styles.sectionName,
          sectionDesc: fetchedPreferences.styles?.sectionDesc || styles.sectionDesc,
          eventGrid: fetchedPreferences.styles?.eventGrid || styles.eventGrid,
          eventCard: fetchedPreferences.styles?.eventCard || styles.eventCard,
        });
        setTexts({
          sectionName: fetchedPreferences.texts?.sectionName || texts.sectionName,
          sectionDesc: fetchedPreferences.texts?.sectionDesc || texts.sectionDesc,
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
    <div className="events" style={{ position: 'relative', minHeight: '600px' }}>
      <h1
        style={{
          position: 'relative',

          ...styles.sectionName,
          ...positions.sectionName,
          marginBottom: '20px',
        }}
      >
        {texts.sectionName}
      </h1>
      <h2
        style={{
          position: 'relative',
          ...styles.sectionDesc,
          top: positions.sectionDesc.top - 20,
          left: positions.sectionDesc.left,          marginBottom: '20px',
          width: '80%',

        }}
      >
        {texts.sectionDesc}
      </h2>
      <div
        className="events-container style-one"
        style={{
          position: 'relative',
        //   ...styles.eventGrid,
        top: positions.eventGrid.top -60,
        left: positions.eventGrid.left,          display: 'flex',
          flexWrap: 'wrap',
          gap: '40px',
          justifyContent: 'center',
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
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              padding: '20px',
            }}
          >
            <div className="event-header">
            <span className="event-date" style={event.styles?.date }>
              {event.date}
            </span>
            <h3 style={event.styles?.title }>
              {event.title}
            </h3></div>
            <p style={event.styles?.description }>
              {event.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
} 