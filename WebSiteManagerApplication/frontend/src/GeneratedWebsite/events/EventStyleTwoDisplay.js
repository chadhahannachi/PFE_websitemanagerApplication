import React, { useState, useEffect } from 'react';
import '../../website/events/LatestEvents.css';
import axios from 'axios';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

export default function EventStyleTwoDisplay({ events = [], contentType = 'events', styleKey = 'styleTwo', entrepriseId }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [positions, setPositions] = useState({
    sectionName: { top: 30, left: 0 },
    sectionDesc: { top: 35, left: 0 },
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
      width: 1200,
      backgroundColor: '#ffffff',
      borderRadius: '10px',
    },
    sectionDesc: {
      color: 'black',
      fontSize: '30px',
      fontFamily: 'Arial',
      fontWeight: '600',
      width: '100%',
      maxWidth: '100%',
    },
    eventCard: {
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
      width: '280px',
      height: '440px',
      hoverBackgroundColor: '#f59e0b',
    },
    title: {
      color: '#014268',
      fontSize: '25px',
      fontFamily: 'Arial',
      fontWeight: '700',
      textAlign: 'left',
      fontStyle: 'normal',
      textDecoration: 'none',
    },
    description: {
      color: '#555',
      fontSize: '18px',
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
    image: {
      borderRadius: '0px',
      width: '100%',
      height: '200px',
    },
  });
  const [texts, setTexts] = useState({
    sectionName: 'NOS ÉVÉNEMENTS',
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
          title: fetchedPreferences.styles?.title || styles.title,
          description: fetchedPreferences.styles?.description || styles.description,
          date: fetchedPreferences.styles?.date || styles.date,
          image: fetchedPreferences.styles?.image || styles.image,
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
             <h2
         style={{
           position: 'absolute',
           marginBottom: '20px',
           ...styles.sectionDesc,
           ...positions.sectionDesc,
         }}
       >
         {texts.sectionDesc}
       </h2>
      <div
        className="events-container style-two eventtwo-grid"
        style={{
          position: 'absolute',
          top: positions.eventGrid.top,
          left: positions.eventGrid.left,
          width: styles.eventGrid?.width || 1200,
          display: 'flex',
          flexWrap: 'wrap',
          gap: '15px',
          padding: '0 15px',
        }}
      >
        {events.map((event, index) => (
          <div
            key={event.id || index}
            className="event-card"
            style={{
              ...(event.styles?.card || styles.eventCard),
              padding: '0',
              position: 'relative',
              overflow: 'hidden',
              transition: 'background-color 0.3s ease',
              display: 'flex',
              flexDirection: 'column',
              height: (event.styles?.card?.height || styles.eventCard.height) || '440px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = (event.styles?.card?.hoverBackgroundColor || styles.eventCard.hoverBackgroundColor);
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = (event.styles?.card?.backgroundColor || styles.eventCard.backgroundColor);
            }}
          >
            {/* Image at the top */}
            <div
              style={{
                width: '100%',
              }}
            >
              <img
                src={event.img}
                alt={event.title}
                style={{
                  width: '100%',
                  height: '200px',
                  objectFit: 'cover',
                  borderRadius: (event.styles?.image?.borderRadius || styles.image.borderRadius),
                  display: 'block',
                }}
              />
            </div>
            
            {/* Content area with padding */}
            <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
              {/* Title */}
              <div
                style={{
                  marginBottom: '10px',
                }}
              >
                <h3 style={{ 
                  ...(event.styles?.title || styles.title), 
                  margin: 0 
                }}>
                  {event.title}
                </h3>
              </div>
              
              {/* Description */}
              <div
                style={{
                  flex: 1,
                  marginBottom: '10px',
                }}
              >
                <p style={{ 
                  ...(event.styles?.description || styles.description), 
                  margin: 0, 
                  wordWrap: 'break-word' 
                }}>
                  {event.desc}
                </p>
              </div>
              
              {/* Date at the bottom */}
              <div
                style={{
                  marginTop: 'auto',
                }}
              >
                <div
                  className="event-date"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <CalendarMonthIcon 
                    className="calendar-icon" 
                    style={{ 
                      marginRight: '5px', 
                      color: (event.styles?.date?.color || styles.date.color) 
                    }} 
                  />
                  <span style={{ ...(event.styles?.date || styles.date) }}>
                    {event.date}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 