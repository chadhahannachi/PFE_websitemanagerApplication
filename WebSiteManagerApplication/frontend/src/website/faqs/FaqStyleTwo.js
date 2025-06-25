 
import React, { useState, useEffect } from 'react';
import './FaqSection.css';
import EditorText from '../aboutus/EditorText';
import EditorFaqGrid from './EditorFaqGrid';
import axios from 'axios';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';

export default function FaqStyleTwo({ faqs, contentType = 'faq', styleKey = 'styleTwo' }) {
  const [selectedElement, setSelectedElement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [positions, setPositions] = useState({
    sectionName: { top: 0, left: 0 },
    subtitle: { top: 60, left: 0 },
    faqGrid: { top: 50, left: 700 },
  });
  const [styles, setStyles] = useState({
    sectionName: {
      color: '#333333',
      fontSize: '2rem',
      fontFamily: 'Arial',
      width: '100%',
      maxWidth: '600px',
    },
    subtitle: {
      color: '#666666',
      fontSize: '1rem',
      fontFamily: 'Arial',
      marginBottom: '40px',
      width: '100%',
      maxWidth: '600px',
    },
    faqGrid: {
      width: 600,
      minHeight: 400,
    },
  });
  const [texts, setTexts] = useState({
    sectionName: 'Frequently asked questions',
    subtitle: 'Lorem ipsum est, en imptimerie Lorem ipsum est, en imptimerie',
  });
  const [pendingFaqStyles, setPendingFaqStyles] = useState({});
  const [userEntreprise, setUserEntreprise] = useState(null);

  // Validation des styles, positions, et textes
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
  const fetchUserEntreprise = async () => {
    if (!token || !userId) {
      console.error('Token or User ID is missing');
      setError('Token ou ID utilisateur manquant.');
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const userResponse = await axios.get(`http://localhost:5000/auth/user/${userId}`, config);
      const user = userResponse.data;
      if (!user.entreprise) {
        console.error("User's company (entreprise) is missing");
        setError("Entreprise de l'utilisateur non trouvée.");
        setLoading(false);
        return;
      }
      setUserEntreprise(user.entreprise);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Erreur lors de la récupération des données utilisateur.');
      setLoading(false);
    }
  };

  // Récupérer les préférences de l'entreprise
  const fetchPreferences = async () => {
    if (!userEntreprise) {
      // console.log('userEntreprise not yet available');
      return;
    }

    try {
      // console.log(`Fetching preferences for entrepriseId: ${userEntreprise}`);
      const response = await axios.get(
        `http://localhost:5000/preferences/entreprise/${userEntreprise}/preferences`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // console.log('Fetched preferences:', response.data);
      const fetchedPreferences = response.data.preferences?.[contentType]?.[styleKey] || {};

      const newPositions = {
        sectionName: isValidPosition(fetchedPreferences.positions?.sectionName)
          ? fetchedPreferences.positions.sectionName
          : positions.sectionName,
        subtitle: isValidPosition(fetchedPreferences.positions?.subtitle)
          ? fetchedPreferences.positions.subtitle
          : positions.subtitle,
        faqGrid: isValidPosition(fetchedPreferences.positions?.faqGrid)
          ? fetchedPreferences.positions.faqGrid
          : positions.faqGrid,
      };

      const newStyles = {
        sectionName: isValidStyle(fetchedPreferences.styles?.sectionName)
          ? fetchedPreferences.styles.sectionName
          : styles.sectionName,
        subtitle: isValidStyle(fetchedPreferences.styles?.subtitle)
          ? fetchedPreferences.styles.subtitle
          : styles.subtitle,
        faqGrid: isValidStyle(fetchedPreferences.styles?.faqGrid)
          ? fetchedPreferences.styles.faqGrid
          : styles.faqGrid,
      };

      const newTexts = {
        sectionName: isValidText(fetchedPreferences.texts?.sectionName)
          ? fetchedPreferences.texts.sectionName
          : texts.sectionName,
        subtitle: isValidText(fetchedPreferences.texts?.subtitle)
          ? fetchedPreferences.texts.subtitle
          : texts.subtitle,
      };

      // console.log('Applying positions:', newPositions);
      // console.log('Applying styles:', newStyles);
      // console.log('Applying texts:', newTexts);
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

  useEffect(() => {
    if (token && userId) {
      fetchUserEntreprise();
    }
  }, []);

  useEffect(() => {
    if (userEntreprise) {
      fetchPreferences();
    }
  }, [userEntreprise]);

  const handlePositionChange = (element, newPosition) => {
    // console.log(`Position change triggered for ${element}:`, newPosition);
    if (isValidPosition(newPosition)) {
      setPositions((prev) => {
        const newPositions = { ...prev, [element]: newPosition };
        // console.log(`Updated positions state:`, newPositions);
        return newPositions;
      });
    } else {
      console.warn(`Invalid position for ${element}:`, newPosition);
    }
  };

  const handleStyleChange = (element, newStyles) => {
    // console.log(`Style change triggered for ${element}:`, newStyles);
    if (isValidStyle(newStyles)) {
      setStyles((prev) => {
        const newStylesState = { ...prev, [element]: newStyles };
        // console.log(`Updated styles state:`, newStylesState);
        return newStylesState;
      });
    } else {
      console.warn(`Invalid styles for ${element}:`, newStyles);
    }
  };

  const handleTextChange = (element, newText) => {
    // console.log(`Text change triggered for ${element}:`, newText);
    if (isValidText(newText)) {
      setTexts((prev) => {
        const newTexts = { ...prev, [element]: newText };
        // console.log(`Updated texts state:`, newTexts);
        return newTexts;
      });
    } else {
      console.warn(`Invalid text for ${element}:`, newText);
    }
  };

  const handleFaqStyleChange = (faqId, newStyles) => {
    // console.log(`FAQ style change triggered for faqId ${faqId}:`, newStyles);
    if (!faqId || faqId === 'undefined') {
      console.warn(`Invalid faqId: ${faqId}`);
      return;
    }
    if (isValidStyle(newStyles)) {
      setPendingFaqStyles((prev) => ({
        ...prev,
        [faqId]: newStyles,
      }));
    } else {
      console.warn(`Invalid FAQ styles for faqId ${faqId}:`, newStyles);
    }
  };

  const saveAllChanges = async () => {
    // console.log('saveAllChanges called');
    // console.log('userEntreprise:', userEntreprise);
    // console.log('positions:', positions);
    // console.log('styles:', styles);
    // console.log('texts:', texts);
    // console.log('pendingFaqStyles:', pendingFaqStyles);

    if (!userEntreprise) {
      toast.error("ID de l'entreprise manquant");
      console.error('No userEntreprise provided');
      return;
    }

    if (
      !isValidPosition(positions.sectionName) ||
      !isValidPosition(positions.subtitle) ||
      !isValidPosition(positions.faqGrid) ||
      !isValidStyle(styles.sectionName) ||
      !isValidStyle(styles.subtitle) ||
      !isValidStyle(styles.faqGrid) ||
      !isValidText(texts.sectionName) ||
      !isValidText(texts.subtitle)
    ) {
      console.error('Invalid positions, styles, or texts:', { positions, styles, texts });
      toast.error('Données de position, style ou texte invalides');
      return;
    }

    try {
      // console.log('Sending POST to http://localhost:5000/preferences/entreprise');
      const preferencesResponse = await axios.post(
        'http://localhost:5000/preferences/entreprise',
        {
          entreprise: userEntreprise,
          preferences: {
            [contentType]: {
              [styleKey]: {
                positions,
                styles,
                texts,
              },
            },
          },
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // console.log('Preferences saved:', preferencesResponse.data);

      if (Object.keys(pendingFaqStyles).length > 0) {
        // console.log('Saving FAQ styles');
        for (const [faqId, faqStyles] of Object.entries(pendingFaqStyles)) {
          if (faqId && faqId !== 'undefined' && isValidStyle(faqStyles)) {
            // console.log(`Sending PATCH to http://localhost:5000/contenus/FAQ/${faqId}/styles`);
            const faqResponse = await axios.patch(
              `http://localhost:5000/contenus/FAQ/${faqId}/styles`,
              faqStyles,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            // console.log(`FAQ styles saved for ${faqId}:`, faqResponse.data);
          } else {
            console.warn(`Skipping invalid faqId or styles: ${faqId}`, faqStyles);
          }
        }
      } else {
        console.log('No FAQ styles to save');
      }

      setPendingFaqStyles({});
      toast.success('Modifications sauvegardées avec succès');
    } catch (error) {
      console.error('Error saving changes:', error);
      if (error.response) {
        console.error('Response error:', error.response.data);
        toast.error(`Erreur: ${error.response.data.message || 'Échec de la sauvegarde'}`);
      } else {
        toast.error('Erreur réseau ou serveur indisponible');
      }
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>Erreur: {error}</div>;
  }

  return (
    <div className="faq-style-two-container">
      <EditorText
        elementType="h1"
        initialPosition={positions.sectionName}
        initialStyles={styles.sectionName}
        onSelect={setSelectedElement}
        onPositionChange={(newPosition) => handlePositionChange('sectionName', newPosition)}
        onStyleChange={(newStyles) => handleStyleChange('sectionName', newStyles)}
        onTextChange={(newText) => handleTextChange('sectionName', newText)}
      >
        {texts.sectionName}
      </EditorText>
      <EditorText
        elementType="p"
        initialPosition={positions.subtitle}
        initialStyles={styles.subtitle}
        onSelect={setSelectedElement}
        onPositionChange={(newPosition) => handlePositionChange('subtitle', newPosition)}
        onStyleChange={(newStyles) => handleStyleChange('subtitle', newStyles)}
        onTextChange={(newText) => handleTextChange('subtitle', newText)}
      >
        {texts.subtitle}
      </EditorText>
      <EditorFaqGrid
        faqs={faqs}
        initialPosition={positions.faqGrid}
        initialStyles={styles.faqGrid}
        onSelect={setSelectedElement}
        onPositionChange={(newPosition) => handlePositionChange('faqGrid', newPosition)}
        onStyleChange={handleFaqStyleChange}
      />
      <button onClick={saveAllChanges}>Enregistrer les modifications</button>
    </div>
  );
}
