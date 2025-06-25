import React, { useState, useEffect } from 'react';
import '../../website/units/Units.css';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

export default function UnitStyleTwoDisplay({ contentType = 'unite', styleKey = 'styleTwo', entrepriseId }) {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
//   const [userEntreprise, setUserEntreprise] = useState(null);
  const [positions, setPositions] = useState({
    sectionName: { top: 0, left: 0 },
    subtitle: { top: 60, left: 0 },
    unitGrid: { top: 140, left: 0 },
  });
  const [styles, setStyles] = useState({
    sectionName: {
      color: '#f59e0b',
      fontSize: '20px',
      fontFamily: 'inherit',
      fontWeight: '600',
    },
    subtitle: {
      color: '#000',
      fontSize: '38px',
      fontFamily: 'inherit',
      fontWeight: '600',
    },
    unitGrid: {
      width: 1400,
    },
  });
  const [texts, setTexts] = useState({
    sectionName: 'Our Unite',
    subtitle: 'A reliable partner to meet all your development and digital services needs.',
  });
  const [expandedIndex, setExpandedIndex] = useState(0);

  // Validation des positions, styles et textes
  const isValidPosition = (pos) => pos && typeof pos === 'object' && typeof pos.top === 'number' && typeof pos.left === 'number';
  const isValidStyle = (style) => style && typeof style === 'object' && Object.keys(style).length > 0;
  const isValidText = (text) => typeof text === 'string' && text.trim().length > 0;

  // Récupération du token et décodage pour obtenir l'ID de l'utilisateur
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

  // Récupérer l'entreprise de l'utilisateur connecté
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

  // Récupérer les unités associées à l'entreprise
  const fetchUnits = async () => {
    if (!token || !userId || !entrepriseId) {
      console.error('Token, User ID, or User Entreprise is missing');
      setError('Données manquantes pour récupérer les unités.');
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const response = await axios.get(
        `http://localhost:5000/contenus/Unite/entreprise/${entrepriseId}`,
        config
      );
      const unitData = Array.isArray(response.data) ? response.data : [];
      const publishedUnits = unitData
        .filter(unit => unit.isPublished)
        .map(unit => ({
          _id: unit._id,
          titre: unit.titre,
          description: unit.description,
          image: unit.image,
          styles: {
            collapsed: unit.styles?.collapsed || {
              backgroundColor: 'white',
              width: '200px',
              height: '430px',
            },
            expanded: unit.styles?.expanded || {
              backgroundColor: '#014268',
              width: '800px',
            },
            title: unit.styles?.title || {
              color: 'white',
              fontSize: '38px',
              fontFamily: 'inherit',
              fontWeight: '600',
            },
            description: unit.styles?.description || {
              color: '#e0e0e0',
              fontSize: '18px',
              fontFamily: 'inherit',
            },
            button: unit.styles?.button || {
              backgroundColor: '#f59e0b',
              color: '#184969',
              fontSize: '14px',
            },
          },
        }));
      console.log('Fetched Units with styles:', publishedUnits);
      setUnits(publishedUnits);
    } catch (error) {
      console.error('Error fetching Units by entreprise:', error);
      setError('Erreur lors de la récupération des unités.');
      setUnits([]);
    }
  };

  // Récupérer les préférences de l'entreprise
  const fetchPreferences = async () => {
    if (!entrepriseId) {
      console.log('userEntreprise not yet available');
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:5000/preferences/entreprise/${entrepriseId}/preferences`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log('Fetched preferences:', response.data);
      const fetchedPreferences = response.data.preferences?.[contentType]?.[styleKey] || {};

      const newPositions = {
        sectionName: isValidPosition(fetchedPreferences.positions?.sectionName)
          ? fetchedPreferences.positions.sectionName
          : positions.sectionName,
        subtitle: isValidPosition(fetchedPreferences.positions?.subtitle)
          ? fetchedPreferences.positions.subtitle
          : positions.subtitle,
        unitGrid: isValidPosition(fetchedPreferences.positions?.unitGrid)
          ? fetchedPreferences.positions.unitGrid
          : positions.unitGrid,
      };

      const newStyles = {
        sectionName: isValidStyle(fetchedPreferences.styles?.sectionName)
          ? fetchedPreferences.styles.sectionName
          : styles.sectionName,
        subtitle: isValidStyle(fetchedPreferences.styles?.subtitle)
          ? fetchedPreferences.styles.subtitle
          : styles.subtitle,
        unitGrid: isValidStyle(fetchedPreferences.styles?.unitGrid)
          ? fetchedPreferences.styles.unitGrid
          : styles.unitGrid,
      };

      const newTexts = {
        sectionName: isValidText(fetchedPreferences.texts?.sectionName)
          ? fetchedPreferences.texts.sectionName
          : texts.sectionName,
        subtitle: isValidText(fetchedPreferences.texts?.subtitle)
          ? fetchedPreferences.texts.subtitle
          : texts.subtitle,
      };

      console.log('Applying positions in Display Mode:', newPositions);
      console.log('Applying styles in Display Mode:', newStyles);
      console.log('Applying texts in Display Mode:', newTexts);
      setPositions(newPositions);
      setStyles(newStyles);
      setTexts(newTexts);
    } catch (error) {
      console.error('Error fetching preferences:', error);
      setError('Erreur lors du chargement des préférences');
    } finally {
      setLoading(false);
    }
  };

//   useEffect(() => {
//     if (token && userId) {
//       fetchUserEntreprise();
//     }
//   }, []);

  useEffect(() => {
    if (entrepriseId) {
      fetchUnits();
      fetchPreferences();
    }
  }, [entrepriseId]);

  const handleToggle = (index) => {
    if (index === expandedIndex) return;
    setExpandedIndex(index);
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>Erreur : {error}</div>;
  }

  return (
    <div
      className="units-wrapper"
      style={{
        position: 'relative',
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '40px 20px',
        minHeight: '600px',
        overflow: 'visible',
        boxSizing: 'border-box',
      }}
    >
      <h1
        style={{
          ...styles.sectionName,
          position: 'absolute',
          top: `${positions.sectionName.top}px`,
          left: `${positions.sectionName.left}px`,
          margin: 0,
          lineHeight: '1.2',
        }}
      >
        {texts.sectionName}
      </h1>
      <p
        style={{
          ...styles.subtitle,
          position: 'absolute',
          top: `${positions.subtitle.top}px`,
          left: `${positions.subtitle.left}px`,
          margin: 0,
          lineHeight: '1.5',
          marginTop: '20px',
        }}
      >
        {texts.subtitle}
      </p>
      <div
        className="units-container style-two"
        style={{
          position: 'absolute',
          top: `${positions.unitGrid.top}px`,
          left: `${positions.unitGrid.left}px`,
          width: `${styles.unitGrid.width}px`,
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '20px',
          margin: '0 auto',
          maxWidth: '1400px',
          padding: '0 15px',
        }}
      >
        {Array.isArray(units) && units.length > 0 ? (
          units.map((unit, index) => (
            <div
              key={unit._id || index}
              className={`unit-card ${expandedIndex === index ? 'expanded' : ''}`}
              onClick={() => handleToggle(index)}
              style={{
                background: expandedIndex === index
                  ? unit.styles.expanded.backgroundColor
                  : unit.styles.collapsed.backgroundColor,
                borderRadius: '16px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                alignItems: 'center',
                width: expandedIndex === index
                  ? unit.styles.expanded.width
                  : unit.styles.collapsed.width,
                height: unit.styles.collapsed.height,
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                overflow: 'hidden',
              }}
            >
              {expandedIndex === index && (
                <div className="unit-content" style={{ flex: 1, padding: '40px' }}>
                  <h3
                    style={{
                      fontSize: unit.styles.title.fontSize,
                      fontFamily: unit.styles.title.fontFamily,
                      fontWeight: unit.styles.title.fontWeight,
                      color: unit.styles.title.color,
                      marginBottom: '30px',
                    }}
                  >
                    {unit.titre}
                  </h3>
                  <p
                    className="expanded"
                    style={{
                      fontSize: unit.styles.description.fontSize,
                      fontFamily: unit.styles.description.fontFamily,
                      color: unit.styles.description.color,
                      lineHeight: '1.8',
                    }}
                  >
                    {unit.description}
                  </p>
                  <button
                    className="read-more-btn"
                    style={{
                      backgroundColor: unit.styles.button.backgroundColor,
                      color: unit.styles.button.color,
                      fontSize: unit.styles.button.fontSize,
                      border: 'none',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      fontWeight: '700',
                      padding: '12px 20px',
                      textTransform: 'uppercase',
                      marginTop: '10px',
                    }}
                  >
                    {expandedIndex === index ? 'LIRE MOINS' : 'LIRE PLUS'}
                  </button>
                </div>
              )}
              <div
                className="unit-image-container"
                style={{
                  width: '200px',
                  height: '200px',
                  borderRadius: '10px',
                  overflow: 'hidden',
                }}
              >
                <img
                  src={unit.image || 'https://via.placeholder.com/150'}
                  alt={unit.titre}
                  className="unit-image"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </div>
            </div>
          ))
        ) : (
          <p>Aucune unité disponible.</p>
        )}
      </div>
    </div>
  );
}