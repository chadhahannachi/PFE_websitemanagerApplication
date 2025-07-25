import React, { useState, useEffect } from 'react';
import '../../website/services/OurServices.css';
import axios from 'axios';

export default function ServiceStyleTwoDisplay({ services = [], contentType = 'services', styleKey = 'styleTwo', entrepriseId }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [positions, setPositions] = useState({
    sectionName: { top: 0, left: 0 },
    sectionDesc: { top: 50, left: 0 },
    serviceGrid: { top: 50, left: 0 },
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
    sectionDesc: {
      color: '#000',
      fontSize: '38px',
      fontFamily: 'inherit',
      fontWeight: '600',
    },
    serviceGrid: {
      width: 1200,
      minHeight: 440,
    },
  });
  const [texts, setTexts] = useState({
    sectionName: 'NOS SERVICES',
    sectionDesc: 'Découvrez nos services innovants et adaptés à vos besoins',
  });
  const [expandedServices, setExpandedServices] = useState({});
  const cardStyles = {
    card: {
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
      width: '280px',
      height: '440px',
      hoverBackgroundColor: '#f59e0b',
    },
    title: {
      color: '#0d1b3f',
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
    button: {
      backgroundColor: '#eeeeee',
      borderRadius: '10px',
      color: '#184969',
      fontSize: '14px',
      fontWeight: '700',
      hoverColor: '#014268',
    },
    image: {
      borderRadius: '0px',
      width: '60px',
      height: '60px',
    },
    shape: {
      fill: '#eeeeee',
      width: '100px',
      height: '89px',
    },
  };

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

  const toggleDescriptionExpansion = (serviceId) => {
    setExpandedServices(prev => ({
      ...prev,
      [serviceId]: !prev[serviceId]
    }));
  };

  // Responsive marginLeft for small screens
  const isSmallScreen = typeof window !== 'undefined' && window.innerWidth < 1400;

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur : {error}</div>;
  if (!services.length) return <div>Aucun service disponible.</div>;

  return (
    <div className="services-style-two-container servicetwo-responsive" style={{ position: 'relative', minHeight: '600px' }}>
      <h1
        className="servicetwo-stack"
        style={{
          position: 'absolute',
          ...styles.sectionName,
          ...positions.sectionName,
        }}
      >
        {texts.sectionName}
      </h1>
      <h2
        className='sectionDesc servicetwo-stack'
        style={{
          position: 'absolute',
          ...styles.sectionDesc,
          ...positions.sectionDesc,
          // marginRight: isSmallScreen ? '100px' : undefined,
        }}
      >
        {texts.sectionDesc}
      </h2>
      <div
        className="services-container style-two servicetwo-grid"
        style={{
          width: '100%',
          maxWidth: styles.serviceGrid.width,
          minHeight: styles.serviceGrid.minHeight,
          display: 'flex',
          flexWrap: 'wrap',
          gap: '15px',
          overflow: 'hidden',
          justifyContent: 'center',
          top: positions.serviceGrid.top,
          left: positions.serviceGrid.left,
          position: 'relative',
          marginBottom: '200px',
          marginLeft: isSmallScreen ? '-100px' : undefined,
          // marginBottom: isSmallScreen ? '200px' : 'undefined',

        }}
      >
        {services.map((service, index) => {
          const isExpanded = expandedServices[service._id || index];
          return (
            <div
              key={service._id || index}
              className="service-card"
              style={{
                ...cardStyles.card,
                ...service.styles?.card,
                backgroundColor: service.styles?.card?.backgroundColor || cardStyles.card.backgroundColor,
                padding: '20px',
                position: 'relative',
                overflow: 'hidden',
                transition: 'background-color 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = service.styles?.card?.hoverBackgroundColor || cardStyles.card.hoverBackgroundColor;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = service.styles?.card?.backgroundColor || cardStyles.card.backgroundColor;
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: service.positions?.shape?.top || 20,
                  left: service.positions?.shape?.left || 20,
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={service.styles?.shape?.width || cardStyles.shape.width}
                  height={service.styles?.shape?.height || cardStyles.shape.height}
                  viewBox="0 0 100 89"
                  fill="none"
                >
                  <path
                    d="M89.3997 20.1665C90.5806 21.4322 91.2497 23.0786 91.2607 24.7458C91.2717 26.4129 90.6237 27.965 89.4585 29.0627L82.7168 35.3787C83.8857 34.2836 85.4772 33.7354 87.141 33.8548C88.8049 33.9742 90.4049 34.7514 91.589 36.0153C92.7732 37.2792 93.4445 38.9265 93.4553 40.5946C93.4661 42.2627 92.8154 43.815 91.6465 44.9101L89.4391 46.9782C90.7021 46.1158 92.2814 45.7931 93.8594 46.075C95.4374 46.3569 96.897 47.2225 97.9445 48.4977C98.9919 49.7729 99.5496 51.363 99.5051 52.948C99.4607 54.5331 98.8175 55.9955 97.705 57.041L66.4218 86.3494C65.306 87.3914 63.8048 87.938 62.2202 87.8791C60.6357 87.8202 59.0853 87.1602 57.881 86.0319C56.6767 84.9037 55.908 83.3908 55.7294 81.7978C55.5509 80.2048 55.9757 78.6498 56.9185 77.4457L46.2874 87.4056C45.1185 88.5008 43.5271 89.0489 41.8632 88.9295C40.1994 88.8101 38.5994 88.033 37.4152 86.769C36.2311 85.5051 35.5598 83.8579 35.549 82.1898C35.5382 80.5217 36.1888 78.9693 37.3578 77.8742L42.5545 73.0055C41.5403 73.9509 40.2052 74.4903 38.7733 74.5334C37.3414 74.5764 35.8998 74.1205 34.6905 73.242C33.4812 72.3636 32.5777 71.1161 32.1318 69.7089C31.6858 68.3017 31.7245 66.8205 32.2413 65.5139L22.1964 74.9247C21.0275 76.0198 19.4361 76.5679 17.7722 76.4485C16.1084 76.3291 14.5084 75.552 13.3242 74.2881C12.1401 73.0241 11.4688 71.3769 11.458 69.7088C11.4472 68.0407 12.0978 66.4883 13.2667 65.3932L25.0674 54.3375C23.8985 55.4326 22.3071 55.9808 20.6432 55.8614C18.9794 55.742 17.3794 54.9649 16.1952 53.7009C15.0111 52.437 14.3398 50.7898 14.329 49.1217C14.3182 47.4536 14.9688 45.9012 16.1377 44.8061L11.4359 49.2111C10.267 50.3062 8.67555 50.8544 7.01169 50.735C5.34784 50.6156 3.74784 49.8384 2.56369 48.5745C1.37954 47.3106 0.708235 45.6633 0.697453 43.9952C0.686672 42.3271 1.3373 40.7748 2.5062 39.6797L35.5613 8.71135C36.7302 7.61624 38.3217 7.06808 39.9855 7.18747C41.6494 7.30686 43.2494 8.08401 44.4335 9.34795C45.6177 10.6119 46.289 12.2591 46.2998 13.9272C46.3105 15.5953 45.6599 17.1477 44.491 18.2428L61.4956 2.31173C62.6645 1.21663 64.2559 0.668477 65.9198 0.787863C67.5836 0.90725 69.1836 1.6844 70.3678 2.94834C71.5519 4.21229 72.2232 5.8595 72.234 7.5276C72.2448 9.19571 71.5942 10.7481 70.4253 11.8432L65.2285 16.7119C66.242 15.7657 67.5766 15.2252 69.0084 15.181C70.4403 15.1369 71.8821 15.5918 73.092 16.4694C74.3019 17.3471 75.2063 18.594 75.6532 20.001C76.1001 21.4079 76.0625 22.8893 75.5466 24.1964L80.5275 19.5299C81.699 18.4397 83.2895 17.8948 84.9518 18.014C86.6141 18.1333 88.2131 18.9071 89.3997 20.1665Z"
                    fill={service.styles?.shape?.fill || cardStyles.shape.fill}
                  />
                </svg>
              </div>
              <div
                style={{
                  position: 'absolute',
                  top: service.positions?.image?.top || 35,
                  left: service.positions?.image?.left || 40,
                }}
              >
                <img
                  src={service.img}
                  alt={service.title}
                  style={{
                    width: service.styles?.image?.width || cardStyles.image.width,
                    height: service.styles?.image?.height || cardStyles.image.height,
                    objectFit: 'contain',
                    borderRadius: service.styles?.image?.borderRadius || cardStyles.image.borderRadius,
                    zIndex: 2,
                  }}
                />
              </div>
              <div
                style={{
                  position: 'absolute',
                  top: service.positions?.title?.top || 120,
                  left: service.positions?.title?.left || 20,
                  width: (parseInt(service.styles?.card?.width) || parseInt(cardStyles.card.width)) - 40,
                }}
              >
                <h3 style={{ ...cardStyles.title, ...(service.styles?.title || {}), margin: 0 }}>
                  {service.title}
                </h3>
              </div>
              <div
                style={{
                  position: 'absolute',
                  top: service.positions?.description?.top || 160,
                  left: service.positions?.description?.left || 20,
                  width: (parseInt(service.styles?.card?.width) || parseInt(cardStyles.card.width)) - 40,
                  height: isExpanded
                    ? (parseInt(service.styles?.card?.height) || parseInt(cardStyles.card.height)) - (service.positions?.description?.top || 160) - 80
                    : (service.positions?.button?.top || 360) - (service.positions?.description?.top || 160) - 10,
                  overflow: isExpanded ? 'auto' : 'hidden',
                  transition: 'height 0.3s',
                }}
              >
                <p style={{ ...cardStyles.description, ...(service.styles?.description || {}), margin: 0 }}>
                  {service.description}
                </p>
              </div>
              <div
                style={{
                  position: 'absolute',
                  top: service.positions?.button?.top || 360,
                  left: service.positions?.button?.left || 20,
                }}
              >
                <button
                  style={{
                    ...cardStyles.button,
                    ...service.styles?.button,
                    backgroundColor: service.styles?.button?.backgroundColor || cardStyles.button.backgroundColor,
                    cursor: 'pointer',
                    padding: '8px 16px',
                    border: 'none',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = service.styles?.button?.hoverColor || cardStyles.button.hoverColor;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = service.styles?.button?.backgroundColor || cardStyles.button.backgroundColor;
                  }}
                  onClick={() => toggleDescriptionExpansion(service._id || index)}
                >
                  {isExpanded ? 'VOIR MOINS' : 'LIRE PLUS'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}  