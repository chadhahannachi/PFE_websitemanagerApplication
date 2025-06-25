import React, { useState, useEffect } from 'react';
import '../../website/services/OurServices.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';

export default function ServiceStyleTwoDisplay({ services = [], contentType = 'services', styleKey = 'styleTwo', entrepriseId }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [positions, setPositions] = useState({
    sectionName: { top: 0, left: 0 },
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
    serviceGrid: {
      width: 1200,
      minHeight: 440,
    },
  });
  const [texts, setTexts] = useState({
    sectionName: 'NOS SERVICES',
  });
  const [cardStyles, setCardStyles] = useState({
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
  });
  const [serviceData, setServiceData] = useState([]);
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
        `http://localhost:5000/preferences/entreprise/${entrepriseId}/preferences`,
        // {
        //   headers: { Authorization: `Bearer ${token}` },
        // }
      );
      const fetchedPreferences = response.data.preferences?.[contentType]?.[styleKey] || {};

      const newPositions = {
        sectionName: isValidPosition(fetchedPreferences.positions?.sectionName)
          ? fetchedPreferences.positions.sectionName
          : positions.sectionName,
        serviceGrid: isValidPosition(fetchedPreferences.positions?.serviceGrid)
          ? fetchedPreferences.positions.serviceGrid
          : { top: 100, left: 0 }, // Adjusted default to avoid overlap
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

  // Initialize service data with positions
  useEffect(() => {
    setServiceData(services.map((service) => ({
      ...service,
      positions: {
        image: { top: 35, left: 40 },
        shape: { top: 20, left: 20 },
        title: { top: 120, left: 20 },
        description: { top: 160, left: 20 },
        button: { top: 360, left: 20 },
      },
    })));
  }, [services]);

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

  if (!serviceData.length) {
    return <div>Aucun service disponible.</div>;
  }

  return (
    <div className="services-style-two-container" style={{ position: 'relative' }}>
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
        className="services-container style-two"
        style={{
          position: 'relative',
          width: styles.serviceGrid.width,
          minHeight: styles.serviceGrid.minHeight,
          display: 'flex',
          flexWrap: 'wrap',
          gap: '15px',
          padding: '0 15px',
        }}
      >
        {serviceData.map((service, index) => (
          <div
            key={service._id || index}
            className="service-card"
            style={{
              ...cardStyles.card,
              padding: '20px',
              position: 'relative',
              overflow: 'hidden',
              transition: 'background-color 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = cardStyles.card.hoverBackgroundColor;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = cardStyles.card.backgroundColor;
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: service.positions.shape.top,
                left: service.positions.shape.left,
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={cardStyles.shape.width}
                height={cardStyles.shape.height}
                viewBox="0 0 100 89"
                fill="none"
              >
                <path
                  d="M89.3997 20.1665C90.5806 21.4322 91.2497 23.0786 91.2607 24.7458C91.2717 26.4129 90.6237 27.965 89.4585 29.0627L82.7168 35.3787C83.8857 34.2836 85.4772 33.7354 87.141 33.8548C88.8049 33.9742 90.4049 34.7514 91.589 36.0153C92.7732 37.2792 93.4445 38.9265 93.4553 40.5946C93.4661 42.2627 92.8154 43.815 91.6465 44.9101L89.4391 46.9782C90.7021 46.1158 92.2814 45.7931 93.8594 46.075C95.4374 46.3569 96.897 47.2225 97.9445 48.4977C98.9919 49.7729 99.5496 51.363 99.5051 52.948C99.4607 54.5331 98.8175 55.9955 97.705 57.041L66.4218 86.3494C65.306 87.3914 63.8048 87.938 62.2202 87.8791C60.6357 87.8202 59.0853 87.1602 57.881 86.0319C56.6767 84.9037 55.908 83.3908 55.7294 81.7978C55.5509 80.2048 55.9757 78.6498 56.9185 77.4457L46.2874 87.4056C45.1185 88.5008 43.5271 89.0489 41.8632 88.9295C40.1994 88.8101 38.5994 88.033 37.4152 86.769C36.2311 85.5051 35.5598 83.8579 35.549 82.1898C35.5382 80.5217 36.1888 78.9693 37.3578 77.8742L42.5545 73.0055C41.5403 73.9509 40.2052 74.4903 38.7733 74.5334C37.3414 74.5764 35.8998 74.1205 34.6905 73.242C33.4812 72.3636 32.5777 71.1161 32.1318 69.7089C31.6858 68.3017 31.7245 66.8205 32.2413 65.5139L22.1964 74.9247C21.0275 76.0198 19.4361 76.5679 17.7722 76.4485C16.1084 76.3291 14.5084 75.552 13.3242 74.2881C12.1401 73.0241 11.4688 71.3769 11.458 69.7088C11.4472 68.0407 12.0978 66.4883 13.2667 65.3932L25.0674 54.3375C23.8985 55.4326 22.3071 55.9808 20.6432 55.8614C18.9794 55.742 17.3794 54.9649 16.1952 53.7009C15.0111 52.437 14.3398 50.7898 14.329 49.1217C14.3182 47.4536 14.9688 45.9012 16.1377 44.8061L11.4359 49.2111C10.267 50.3062 8.67555 50.8544 7.01169 50.735C5.34784 50.6156 3.74784 49.8384 2.56369 48.5745C1.37954 47.3106 0.708235 45.6633 0.697453 43.9952C0.686672 42.3271 1.3373 40.7748 2.5062 39.6797L35.5613 8.71135C36.7302 7.61624 38.3217 7.06808 39.9855 7.18747C41.6494 7.30686 43.2494 8.08401 44.4335 9.34795C45.6177 10.6119 46.289 12.2591 46.2998 13.9272C46.3105 15.5953 45.6599 17.1477 44.491 18.2428L61.4956 2.31173C62.6645 1.21663 64.2559 0.668477 65.9198 0.787863C67.5836 0.90725 69.1836 1.6844 70.3678 2.94834C71.5519 4.21229 72.2232 5.8595 72.234 7.5276C72.2448 9.19571 71.5942 10.7481 70.4253 11.8432L65.2285 16.7119C66.242 15.7657 67.5766 15.2252 69.0084 15.181C70.4403 15.1369 71.8821 15.5918 73.092 16.4694C74.3019 17.3471 75.2063 18.594 75.6532 20.001C76.1001 21.4079 76.0625 22.8893 75.5466 24.1964L80.5275 19.5299C81.699 18.4397 83.2895 17.8948 84.9518 18.014C86.6141 18.1333 88.2131 18.9071 89.3997 20.1665Z"
                  fill={cardStyles.shape.fill}
                />
              </svg>
            </div>
            <div
              style={{
                position: 'absolute',
                top: service.positions.image.top,
                left: service.positions.image.left,
              }}
            >
              <img
                src={service.img}
                alt={service.title}
                style={{
                  width: cardStyles.image.width,
                  height: cardStyles.image.height,
                  objectFit: 'contain',
                  borderRadius: cardStyles.image.borderRadius,
                  zIndex: 2,
                }}
              />
            </div>
            <div
              style={{
                position: 'absolute',
                top: service.positions.title.top,
                left: service.positions.title.left,
                width: parseInt(cardStyles.card.width) - 40,
              }}
            >
              <h3 style={{ ...cardStyles.title, margin: 0 }}>
                {service.title}
              </h3>
            </div>
            <div
              style={{
                position: 'absolute',
                top: service.positions.description.top,
                left: service.positions.description.left,
                width: parseInt(cardStyles.card.width) - 40,
              }}
            >
              <p style={{ ...cardStyles.description, margin: 0 }}>
                {service.description}
              </p>
            </div>
            <div
              style={{
                position: 'absolute',
                top: service.positions.button.top,
                left: service.positions.button.left,
              }}
            >
              <button
                style={{
                  ...cardStyles.button,
                  cursor: 'pointer',
                  padding: '8px 16px',
                  border: 'none',
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = cardStyles.button.hoverColor;
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = cardStyles.button.backgroundColor;
                }}
              >
                LIRE PLUS
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}