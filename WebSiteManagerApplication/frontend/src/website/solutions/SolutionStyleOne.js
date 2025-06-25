import React, { useState, useEffect } from 'react';
import './OurSolutions.css';
import EditorText from '../aboutus/EditorText';
import EditorSolutionGrid from './EditorSolutionGrid';
import axios from 'axios';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
 
export default function SolutionStyleOne({ solutions, contentType = 'solutions', styleKey = 'styleOne' }) {
  useEffect(() => {
    console.log('SolutionStyleOne received solutions:', solutions);
    console.log('Solutions with id:', solutions.filter(s => s.id).map(s => ({ id: s.id, title: s.title })));
  }, [solutions]);
  
  const [selectedElement, setSelectedElement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [positions, setPositions] = useState({
    sectionName: { top: 0, left: 0 },
    solutionGrid: { top: 50, left: 0 },
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
    solutionGrid: {
      width: 1200,
      minHeight: 440,
    },
  });
  const [texts, setTexts] = useState({
    sectionName: 'NOS SOLUTIONS',
  });
  const [pendingSolutionStyles, setPendingSolutionStyles] = useState({});
  const [pendingSolutionPositions, setPendingSolutionPositions] = useState({});
  const [userEntreprise, setUserEntreprise] = useState(null);

  // Validation functions
  const isValidPosition = (pos) => pos && typeof pos === 'object' && typeof pos.top === 'number' && typeof pos.left === 'number';
  const isValidStyle = (style) => style && typeof style === 'object' && Object.keys(style).length > 0;
  const isValidText = (text) => typeof text === 'string' && text.trim().length > 0;

  // Fetch user enterprise
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
      const response = await axios.get(
        `http://localhost:5000/preferences/entreprise/${userEntreprise}/preferences`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const fetchedPreferences = response.data.preferences?.[contentType]?.[styleKey] || {};

      const newPositions = {
        sectionName: isValidPosition(fetchedPreferences.positions?.sectionName)
          ? fetchedPreferences.positions.sectionName
          : positions.sectionName,
        solutionGrid: isValidPosition(fetchedPreferences.positions?.solutionGrid)
          ? fetchedPreferences.positions.solutionGrid
          : positions.solutionGrid,
      };

      const newStyles = {
        sectionName: isValidStyle(fetchedPreferences.styles?.sectionName)
          ? fetchedPreferences.styles.sectionName
          : styles.sectionName,
        solutionGrid: isValidStyle(fetchedPreferences.styles?.solutionGrid)
          ? fetchedPreferences.styles.solutionGrid
          : styles.solutionGrid,
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
    if (isValidPosition(newPosition)) {
      setPositions((prev) => ({
        ...prev,
        [element]: newPosition,
      }));
    }
  };

  const handleStyleChange = (element, newStyles) => {
    if (isValidStyle(newStyles)) {
      setStyles((prev) => ({
        ...prev,
        [element]: newStyles,
      }));
    }
  };

  const handleTextChange = (element, newText) => {
    if (isValidText(newText)) {
      setTexts((prev) => ({
        ...prev,
        [element]: newText,
      }));
    }
  };

  const handleSolutionStyleChange = (solutionId, newStyles) => {
    console.log(`=== handleSolutionStyleChange called ===`);
    console.log(`solutionId:`, solutionId);
    console.log(`newStyles:`, newStyles);
    console.log(`typeof solutionId:`, typeof solutionId);
    console.log(`solutionId === 'undefined':`, solutionId === 'undefined');
    console.log(`isValidStyle(newStyles):`, isValidStyle(newStyles));
    
    // alert(`Style modifié pour la solution ${solutionId}! Cliquez sur "Enregistrer les modifications" pour sauvegarder.`);
    
    if (!solutionId || solutionId === 'undefined') {
      console.warn(`Invalid solutionId: ${solutionId}`);
      return;
    }
    
    if (isValidStyle(newStyles)) {
      console.log(`Before setPendingSolutionStyles:`, pendingSolutionStyles);
      setPendingSolutionStyles((prev) => {
        const newState = {
          ...prev,
          [solutionId]: newStyles,
        };
        console.log(`New pendingSolutionStyles state:`, newState);
        return newState;
      });
      console.log(`Styles ajoutés à pendingSolutionStyles pour ${solutionId}:`, newStyles);
    } else {
      console.warn(`Invalid solution styles for solutionId ${solutionId}:`, newStyles);
    }
  };

  const handleSolutionPositionChange = (solutionId, newPositions) => {
    console.log(`=== handleSolutionPositionChange called ===`);
    console.log(`solutionId:`, solutionId);
    console.log(`newPositions:`, newPositions);
    
    if (!solutionId || solutionId === 'undefined') {
      console.warn(`Invalid solutionId: ${solutionId}`);
      return;
    }
    
    if (newPositions && typeof newPositions === 'object') {
      setPendingSolutionPositions((prev) => ({
        ...prev,
        [solutionId]: newPositions,
      }));
      console.log(`Positions ajoutées à pendingSolutionPositions pour ${solutionId}:`, newPositions);
    } else {
      console.warn(`Invalid solution positions for solutionId ${solutionId}:`, newPositions);
    }
  };

  const saveAllChanges = async () => {
    console.log('saveAllChanges called');
    console.log('userEntreprise:', userEntreprise);
    console.log('positions:', positions);
    console.log('styles:', styles);
    console.log('texts:', texts);
    console.log('pendingSolutionStyles:', pendingSolutionStyles);

    if (!userEntreprise) {
      toast.error("ID de l'entreprise manquant");
      console.error('No userEntreprise provided');
      return;
    }

    if (
      !isValidPosition(positions.sectionName) ||
      !isValidPosition(positions.solutionGrid) ||
      !isValidStyle(styles.sectionName) ||
      !isValidStyle(styles.solutionGrid) ||
      !isValidText(texts.sectionName)
    ) {
      console.error('Invalid positions, styles, or texts:', { positions, styles, texts });
      toast.error('Données de position, style ou texte invalides');
      return;
    }

    try {
      console.log('Sending POST to http://localhost:5000/preferences/entreprise');
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
      console.log('Preferences saved:', preferencesResponse.data);

      if (Object.keys(pendingSolutionStyles).length > 0) {
        console.log('Saving solution styles');
        for (const [solutionId, solutionStyles] of Object.entries(pendingSolutionStyles)) {
          if (solutionId && solutionId !== 'undefined' && isValidStyle(solutionStyles)) {
            try {
              const solutionResponse = await axios.patch(
                `http://localhost:5000/contenus/Solution/${solutionId}/styles`,
                solutionStyles,
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );
              console.log(`Solution styles saved for ${solutionId}:`, solutionResponse.data);
            } catch (endpointError) {
              console.error(`Failed to save styles for solution ${solutionId}:`, endpointError.response?.status, endpointError.response?.data);
              toast.error(`Erreur lors de la sauvegarde des styles pour la solution ${solutionId}`);
            }
          } else {
            console.warn(`Skipping invalid solutionId or styles: ${solutionId}`, solutionStyles);
          }
        }
      } else {
        console.log('No solution styles to save');
      }

      if (Object.keys(pendingSolutionPositions).length > 0) {
        console.log('Saving solution positions');
        for (const [solutionId, solutionPositions] of Object.entries(pendingSolutionPositions)) {
          if (solutionId && solutionId !== 'undefined' && solutionPositions) {
            try {
              const solutionResponse = await axios.patch(
                `http://localhost:5000/contenus/Solution/${solutionId}`,
                { positions: solutionPositions },
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );
              console.log(`Solution positions saved for ${solutionId}:`, solutionResponse.data);
            } catch (endpointError) {
              console.error(`Failed to save positions for solution ${solutionId}:`, endpointError.response?.status, endpointError.response?.data);
              toast.error(`Erreur lors de la sauvegarde des positions pour la solution ${solutionId}`);
            }
          } else {
            console.warn(`Skipping invalid solutionId or positions: ${solutionId}`, solutionPositions);
          }
        }
      } else {
        console.log('No solution positions to save');
      }

      setPendingSolutionStyles({});
      setPendingSolutionPositions({});
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
    <div className="solutions-style-one-container">
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
      <EditorSolutionGrid
        solutions={solutions}
        initialPosition={positions.solutionGrid}
        initialStyles={styles.solutionGrid}
        onSelect={setSelectedElement}
        onPositionChange={(newPosition) => handlePositionChange('solutionGrid', newPosition)}
        onStyleChange={handleSolutionStyleChange}
        onUpdate={handleSolutionPositionChange}
      />
      <button onClick={saveAllChanges}>Enregistrer les modifications</button>
    </div>
  );
}