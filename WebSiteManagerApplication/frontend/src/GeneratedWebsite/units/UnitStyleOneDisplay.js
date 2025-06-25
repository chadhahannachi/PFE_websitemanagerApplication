import React, { useState, useEffect } from 'react';
import '../../website/units/Units.css';
import company from '../../images/company.jpg';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

export default function UnitStyleOneDisplay({ unites, contentType = 'unite', styleKey = 'styleOne', entrepriseId }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [positions, setPositions] = useState({
    sectionName: { top: 0, left: 0 },
    subtitle: { top: 60, left: 0 },
    img: { top: 160, left: '60%', marginLeft: '20px', width: '45%' },
    unitContent: { top: 120, left: 0, width: '50%' },
  });
  const [styles, setStyles] = useState({
    sectionName: { color: '#f59e0b', fontSize: '20px', fontFamily: 'inherit', fontWeight: '600' },
    subtitle: { color: '#000', fontSize: '38px', fontFamily: 'inherit', fontWeight: '600' },
    img: { width: '400px', height: 'auto', borderRadius: '0px', position: 'absolute', left: '50%' },
    unitContent: {
      title: { color: '#358dcc', fontSize: '20px', fontWeight: '600' },
      description: { color: '#666', fontSize: '18px' },
    },
  });
  const [texts, setTexts] = useState({
    sectionName: 'Our Unite',
    subtitle: 'A reliable partner to meet all your development and digital services needs.',
  });

  // Validation functions
  const isValidPosition = (pos) => pos && typeof pos === 'object' && typeof pos.top === 'number' && typeof pos.left === 'number';
  const isValidStyle = (style) => style && typeof style === 'object' && Object.keys(style).length > 0;
  const isValidText = (text) => typeof text === 'string' && text.trim().length > 0;

  // Get token and user ID
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

  // Fetch preferences
  const fetchPreferences = async () => {
    if (!entrepriseId) {
      console.log('Entreprise ID not available');
      setError('ID de l\'entreprise manquant.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:5000/preferences/entreprise/${entrepriseId}/preferences`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const fetchedPreferences = response.data.preferences?.[contentType]?.[styleKey] || {};

      const newPositions = {
        sectionName: isValidPosition(fetchedPreferences.positions?.sectionName) ? fetchedPreferences.positions.sectionName : positions.sectionName,
        subtitle: isValidPosition(fetchedPreferences.positions?.subtitle) ? fetchedPreferences.positions.subtitle : positions.subtitle,
        unitContent: isValidPosition(fetchedPreferences.positions?.unitContent) ? fetchedPreferences.positions.unitContent : positions.unitContent,
        img: isValidPosition(fetchedPreferences.positions?.img) ? fetchedPreferences.positions.img : positions.img,
      };

      const newStyles = {
        sectionName: isValidStyle(fetchedPreferences.styles?.sectionName) ? fetchedPreferences.styles.sectionName : styles.sectionName,
        subtitle: isValidStyle(fetchedPreferences.styles?.subtitle) ? fetchedPreferences.styles.subtitle : styles.subtitle,
        unitContent: isValidStyle(fetchedPreferences.styles?.unitContent) ? fetchedPreferences.styles.unitContent : styles.unitContent,
        img: isValidStyle(fetchedPreferences.styles?.img) ? fetchedPreferences.styles.img : styles.img,
      };

      const newTexts = {
        sectionName: isValidText(fetchedPreferences.texts?.sectionName) ? fetchedPreferences.texts.sectionName : texts.sectionName,
        subtitle: isValidText(fetchedPreferences.texts?.subtitle) ? fetchedPreferences.texts.subtitle : texts.subtitle,
      };

      setPositions(newPositions);
      setStyles(newStyles);
      setTexts(newTexts);
    } catch (error) {
      console.error('Error fetching preferences:', error);
      setError('Erreur lors du chargement des préférences.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && userId && entrepriseId) {
      fetchPreferences();
    }
  }, [entrepriseId]);

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>Erreur: {error}</div>;
  }

  return (
    <div className="units-wrapper" style={{ position: 'relative', maxWidth: '1400px', margin: '0 auto', padding: '40px 20px' }}>
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
        className="unit-content"
        style={{
          position: 'absolute',
          top: `${positions.unitContent.top}px`,
          left: `${positions.unitContent.left}px`,
          width: positions.unitContent.width,
          flex: 1,
          minWidth: '250px',
        }}
      >
        {Array.isArray(unites) && unites.length > 0 ? (
          unites.map((unit, index) => (
            <div key={index}>
              <h2
                style={{
                  ...styles.unitContent.title,
                  marginBottom: '20px',
                  padding: '2px 30px',
                }}
              >
                {unit.image && (
                  <img
                    src={unit.image}
                    alt={unit.titre || 'Image de l\'unité'}
                    style={{ width: '40px', height: '40px', objectFit: 'cover', marginRight: '8px', verticalAlign: 'middle' }}
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/40'; }}
                  />
                )}
                {unit.titre}
              </h2>
              <p
                style={{
                  ...styles.unitContent.description,
                  marginBottom: '20px',
                  marginTop: '1px',
                  paddingLeft: '40px',
                }}
              >
                {unit.description}
              </p>
            </div>
          ))
        ) : (
          <p>Aucune unité publiée pour le moment.</p>
        )}
      </div>
      <div className="image-content">
        <img
          src={company}
          alt="Company illustration"
          style={{
            ...styles.img,
            top: `${positions.img.top}px`,
            left: positions.img.left,
            marginLeft: positions.img.marginLeft,
            width: positions.img.width,
          }}
        />
      </div>
    </div>
  );
}