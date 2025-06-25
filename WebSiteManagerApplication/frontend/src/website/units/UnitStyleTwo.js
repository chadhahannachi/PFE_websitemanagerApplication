// import React, { useState } from 'react';
// import './Units.css';
// import EditorText from '../aboutus/EditorText';
// import EditorUnitGrid from './EditorUnitCard';

// export default function UnitStyleTwo({ unites }) {
//   const [selectedElement, setSelectedElement] = useState(null);

//   const initialPositions = {
//     sectionName: { top: 0, left: 0 },
//     subtitle: { top: 60, left: 0 },
//     unitGrid: { top: 140, left: 0 },
//   };

//   const initialStyles = {
//     sectionName: { 
//       color: '#f59e0b', 
//       fontSize: '20px', 
//       fontFamily: 'inherit',
//       fontWeight: '600',
//     },
//     subtitle: { 
//       color: '#000', 
//       fontSize: '38px', 
//       fontFamily: 'inherit',
//       fontWeight: '600',
//     },
//     unitGrid: {
//       width: 1400,
//       header: {
//         title: {
//           color: '#f59e0b',
//           fontSize: '20px',
//           fontWeight: '600',
//         },
//         subtitle: {
//           color: '#000',
//           fontSize: '38px',
//           fontWeight: '600',
//         }
//       },
//       card: {
//         collapsed: {
//           backgroundColor: 'white',
//           width: '200px',
//           height: '430px',
//         },
//         expanded: {
//           backgroundColor: '#014268',
//           width: '800px',
//         },
//         title: {
//           color: 'white',
//           fontSize: '38px',
//           fontWeight: '600',
//         },
//         description: {
//           color: '#e0e0e0',
//           fontSize: '18px',
//         },
//         button: {
//           backgroundColor: '#f59e0b',
//           color: '#184969',
//           fontSize: '14px',
//         }
//       }
//     }
//   };

//   return (
//     <div className="units-wrapper">
//       <EditorText
//         elementType="sectionName"
//         initialPosition={initialPositions.sectionName}
//         initialStyles={initialStyles.sectionName}
//         onSelect={setSelectedElement}
//       >
//         Our Unite
//       </EditorText>
      
//       <EditorText
//         elementType="subtitle"
//         initialPosition={initialPositions.subtitle}
//         initialStyles={initialStyles.subtitle}
//         onSelect={setSelectedElement}
//       >
//         A reliable partner to meet all your development and digital services needs.
//       </EditorText>
      
//       <EditorUnitGrid
//         unites={unites}
//         initialPosition={initialPositions.unitGrid}
//         initialStyles={initialStyles.unitGrid}
//         onSelect={setSelectedElement}
//       />
//     </div>
//   );
// }


// UnitStyleTwo.js
import React, { useState, useEffect } from 'react';
import './Units.css';
import EditorText from '../aboutus/EditorText';
import EditorUnitGrid from './EditorUnitCard';
import axios from 'axios';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';

export default function UnitStyleTwo({ unites, contentType = 'unite', styleKey = 'styleTwo' }) {
  const [selectedElement, setSelectedElement] = useState(null);
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
  const [pendingUnitStyles, setPendingUnitStyles] = useState({});
  const [userEntreprise, setUserEntreprise] = useState(null);

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

  // Fetch user's entreprise
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

  // Fetch preferences
  const fetchPreferences = async () => {
    if (!userEntreprise) {
      console.log('userEntreprise not yet available');
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

  const handleUnitStyleChange = (unitId, newStyles) => {
    // console.log(`Unit style change triggered for unitId ${unitId}:`, newStyles);
    if (!unitId || unitId === 'undefined') {
      console.warn(`Invalid unitId: ${unitId}`);
      return;
    }
    if (isValidStyle(newStyles)) {
      setPendingUnitStyles((prev) => ({
        ...prev,
        [unitId]: newStyles,
      }));
    } else {
      console.warn(`Invalid unit styles for unitId ${unitId}:`, newStyles);
    }
  };

  const saveAllChanges = async () => {
    // console.log('saveAllChanges called');
    // console.log('userEntreprise:', userEntreprise);
    // console.log('positions:', positions);
    // console.log('styles:', styles);
    // console.log('texts:', texts);
    // console.log('pendingUnitStyles:', pendingUnitStyles);

    if (!userEntreprise) {
      toast.error("ID de l'entreprise manquant");
      console.error('No userEntreprise provided');
      return;
    }

    if (
      !isValidPosition(positions.sectionName) ||
      !isValidPosition(positions.subtitle) ||
      !isValidPosition(positions.unitGrid) ||
      !isValidStyle(styles.sectionName) ||
      !isValidStyle(styles.subtitle) ||
      !isValidStyle(styles.unitGrid) ||
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

      if (Object.keys(pendingUnitStyles).length > 0) {
        // console.log('Saving Unit styles');
        for (const [unitId, unitStyles] of Object.entries(pendingUnitStyles)) {
          if (unitId && unitId !== 'undefined' && isValidStyle(unitStyles)) {
            // console.log(`Sending PATCH to http://localhost:5000/contenus/Unite/${unitId}/styles`);
            const unitResponse = await axios.patch(
              `http://localhost:5000/contenus/Unite/${unitId}/styles`,
              unitStyles,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            // console.log(`Unit styles saved for ${unitId}:`, unitResponse.data);
          } else {
            console.warn(`Skipping invalid unitId or styles: ${unitId}`, unitStyles);
          }
        }
      } else {
        console.log('No Unit styles to save');
      }

      setPendingUnitStyles({});
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

  return (
    <div className="units-wrapper">
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
      <EditorUnitGrid
        unites={unites}
        initialPosition={positions.unitGrid}
        initialStyles={styles.unitGrid}
        onSelect={setSelectedElement}
        onPositionChange={(newPosition) => handlePositionChange('unitGrid', newPosition)}
        onStyleChange={handleUnitStyleChange}
      />
      <button onClick={saveAllChanges}>Enregistrer les modifications</button>
    </div>
  );
}