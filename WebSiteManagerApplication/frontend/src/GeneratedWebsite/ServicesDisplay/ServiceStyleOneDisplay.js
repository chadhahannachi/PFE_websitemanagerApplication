import React, { useState, useEffect } from 'react';
import '../../website/services/OurServices.css';
import axios from 'axios';

export default function ServiceStyleOneDisplay({ services = [], contentType = 'services', styleKey = 'styleOne', entrepriseId }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [positions, setPositions] = useState({
    sectionName: { top: 0, left: 0 },
    sectionDesc: { top: 50, left: 0 },
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
    sectionDesc: {
      color: '#000',
      fontSize: '38px',
      fontFamily: 'inherit',
      fontWeight: '600',
    },
    serviceGrid: {
      width: 1400,
      minHeight: 400,
    },
  });
  const [texts, setTexts] = useState({
    sectionName: 'NOS SERVICES',
    sectionDesc: 'Découvrez nos services innovants et adaptés à vos besoins',
  });
  const [hoveredCard, setHoveredCard] = useState(null);

  // Validation functions
  const isValidPosition = (pos) => pos && typeof pos === 'object' && typeof pos.top === 'number' && typeof pos.left === 'number';
  const isValidStyle = (style) => style && typeof style === 'object' && Object.keys(style).length > 0;
  const isValidText = (text) => typeof text === 'string' && text.trim().length > 0;

  useEffect(() => {
    async function fetchPreferences() {
      if (!entrepriseId) {
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get(
          `http://localhost:5000/preferences/entreprise/${entrepriseId}/preferences`,
        );
        const fetchedPreferences = response.data.preferences?.[contentType]?.[styleKey] || {};
        setPositions({
          sectionName: isValidPosition(fetchedPreferences.positions?.sectionName)
            ? fetchedPreferences.positions.sectionName
            : positions.sectionName,
          sectionDesc: isValidPosition(fetchedPreferences.positions?.sectionDesc)
            ? fetchedPreferences.positions.sectionDesc
            : positions.sectionDesc,
          serviceGrid: isValidPosition(fetchedPreferences.positions?.serviceGrid)
            ? fetchedPreferences.positions.serviceGrid
            : positions.serviceGrid,
        });
        setStyles({
          sectionName: isValidStyle(fetchedPreferences.styles?.sectionName)
            ? fetchedPreferences.styles.sectionName
            : styles.sectionName,
          sectionDesc: isValidStyle(fetchedPreferences.styles?.sectionDesc)
            ? fetchedPreferences.styles.sectionDesc
            : styles.sectionDesc,
          serviceGrid: isValidStyle(fetchedPreferences.styles?.serviceGrid)
            ? fetchedPreferences.styles.serviceGrid
            : styles.serviceGrid,
        });
        setTexts({
          sectionName: isValidText(fetchedPreferences.texts?.sectionName)
            ? fetchedPreferences.texts.sectionName
            : texts.sectionName,
          sectionDesc: isValidText(fetchedPreferences.texts?.sectionDesc)
            ? fetchedPreferences.texts.sectionDesc
            : texts.sectionDesc,
        });
      } catch (error) {
        setError('Erreur lors du chargement des préférences.');
      } finally {
        setLoading(false);
      }
    }
    fetchPreferences();
    // eslint-disable-next-line
  }, [entrepriseId]);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur : {error}</div>;
  if (!services.length) return <div>Aucun service disponible.</div>;

  return (
    <div className="services-style-one-container" style={{ position: 'relative', minHeight: '600px' }} >
      <h1
        style={{
          position: 'absolute',
          ...styles.sectionName,
          ...positions.sectionName,
        }}
      >
        {texts.sectionName}
      </h1>
      <h2
        className='sectionDescStyleOne'
        style={{
          position: 'absolute',
          ...styles.sectionDesc,
          ...positions.sectionDesc,
        }}
      >
        {texts.sectionDesc}
      </h2>
      <div
        className="services-container style-one"
        style={{
          width: '100%',
          maxWidth: styles.serviceGrid.width,
          minHeight: styles.serviceGrid.minHeight,
          display: 'flex',
          flexWrap: 'wrap',
          gap: '25px',
          justifyContent: 'center',
          boxSizing: 'border-box',
          // ...positions.serviceGrid,
          top: positions.serviceGrid.top,
          left: positions.serviceGrid.left,
          position: 'relative',
          marginBottom: '100px',
        }}
      >
        {services.map((service, index) => {
          const isExpanded = hoveredCard === (service._id || index);
          return (
            <div
              key={service._id || index}
              className={`card${isExpanded ? ' expanded' : ''}`}
              style={{
                // background: service.styles?.card?.background || '#fff',
                backgroundColor: isExpanded
                ? service.styles?.card?.hoverBackgroundColor
                : service.styles?.card?.backgroundColor ,
                borderRadius: service.styles?.card?.borderRadius,
                border:  service.styles?.card?.backgroundColor,

                padding: service.styles?.card?.padding ,
                color: service.styles?.card?.color ,
                width: isExpanded
                  ? service.styles?.card?.expandedWidth 
                  : service.styles?.card?.width ,
                height: isExpanded
                  ? service.styles?.card?.expandedHeight
                  : service.styles?.card?.height ,
                minHeight: isExpanded ? service.styles?.card?.expandedMinHeight  : undefined,
                boxShadow: service.styles?.card?.boxShadow ,
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                zIndex: isExpanded ? 10 : 1,
                transform: isExpanded ? 'translateY(-10px)' : undefined,
                paddingBottom: isExpanded ? '20px' : undefined,
                transition: 'background-color 0.3s, color 0.3s, transform 0.3s, width 0.3s, height 0.3s, z-index 0s',
                ...service.positions?.card,
              }}
              onMouseEnter={() => setHoveredCard(service._id || index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <img
                src={service.img}
                alt={service.title}
                className="service-icon"
                style={{
                  height: service.styles?.image?.height || '50px',
                  objectFit: 'contain',
                  marginBottom: '3px',
                  ...service.styles?.image,
                  ...service.positions?.image,
                }}
              />
              <h2
                style={{
                  fontSize: service.styles?.title?.fontSize || '20px',
                  margin: service.styles?.title?.margin || '15px 0 10px',
                  fontWeight: service.styles?.title?.fontWeight || '700',
                  color: service.styles?.title?.color || '#0d1b3f',
                  ...service.styles?.title,
                  ...service.positions?.title,
                }}
              >
                {service.title}
              </h2>
              <p
                className={isExpanded ? 'expanded' : ''}
                style={{
                  fontSize: service.styles?.description?.fontSize || '15px',
                  lineHeight: service.styles?.description?.lineHeight || '1.6',
                  margin: 0,
                  color: service.styles?.description?.color || '#555',
                  flexGrow: 1,
                  overflow: isExpanded ? 'visible' : 'hidden',
                  display: '-webkit-box',
                  WebkitBoxOrient: 'vertical',
                  WebkitLineClamp: isExpanded ? 'unset' : 8,
                  textOverflow: 'ellipsis',
                  transition: 'all 0.3s ease',
                  ...service.styles?.description,
                  ...service.positions?.description,
                }}
              >
                {service.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
} 