import React, { useState, useEffect } from 'react';
import '../../website/units/Units.css';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

export default function UnitStyleTwoDisplay({ contentType = 'unite', styleKey = 'styleTwo', entrepriseId }) {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  // Récupérer les unités associées à l'entreprise
  const fetchUnits = async () => {
    if (!entrepriseId) {
      setError('ID entreprise manquant.');
      setLoading(false);
      return;
    }
    try {
      const response = await axios.get(
        `http://localhost:5000/contenus/Unite/entreprise/${entrepriseId}`
      );
      const unitData = Array.isArray(response.data) ? response.data : [];
      const publishedUnits = unitData
        // .filter(unit => unit.isPublished)
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
      setError('ID entreprise manquant.');
      setLoading(false);
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
      className="units-wrapper unittwo-responsive"
      style={{
        position: 'relative',
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '40px 20px',
        minHeight: '600px',
        overflow: 'visible',
        boxSizing: 'border-box',
        marginBottom: '100px',

      }}
    >
      <h1
        className="unittwo-stack"
        style={{
          ...styles.sectionName,
          position: 'absolute',
          top: `${positions.sectionName.top}px`,
          left: `${positions.sectionName.left}px`,
          margin: 0,
          pointerEvents: 'none',
        }}
      >
        {texts.sectionName}
      </h1>
      <p
        className="unittwo-stack"
        style={{
          ...styles.subtitle,
          position: 'absolute',
          top: `${positions.subtitle.top}px`,
          left: `${positions.subtitle.left}px`,
          margin: 0,
          pointerEvents: 'none',
        }}
      >
        {texts.subtitle}
      </p>

      <div
          className="units-container style-two unittwo-grid"
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
                </div>
              )}
              <div
                className="unit-image-container"
                style={{
                  width: '200px',
                  height: '100%',
                  borderRadius: '0px',
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