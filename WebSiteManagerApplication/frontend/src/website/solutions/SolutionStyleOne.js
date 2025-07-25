import React, { useState, useEffect, useRef } from 'react';
import './OurSolutions.css';
import EditorText from '../aboutus/EditorText';
import EditorSolutionGrid from './EditorSolutionGrid';
import axios from 'axios';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import ReactDOM from 'react-dom';

// Composant de notification de succès
const SuccessNotification = ({ show, message }) => {
  if (!show) return null;
  
  return ReactDOM.createPortal(
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      backgroundColor: '#c6c6c6',
      color: 'white',
      padding: '15px 25px',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      zIndex: 10000,
      fontSize: '16px',
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      animation: 'slideInRight 0.3s ease-out',
      border: '1px solid #c6c6c6',
      pointerEvents: 'none'
    }}>
      <div style={{
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        backgroundColor: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#c6c6c6',
        fontSize: '14px',
        fontWeight: 'bold'
      }}>
        ✓
      </div>
      {message}
    </div>,
    document.body
  );
};

export default function SolutionStyleOne({ solutions, contentType = 'solutions', styleKey = 'styleOne' }) {
  const editorSolutionGridRef = useRef(null);
  
  useEffect(() => {
    console.log('SolutionStyleOne received solutions:', solutions);
    console.log('Solutions with id:', solutions.filter(s => s.id).map(s => ({ id: s.id, title: s.title })));
  }, [solutions]);
  
  const [selectedElement, setSelectedElement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [positions, setPositions] = useState({
    sectionName: { top: 0, left: 0 },
    sectionDesc: { top: 50, left: 0 },
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
    sectionDesc: 'Découvrez nos solutions innovantes et adaptées à vos besoins',
  });
  const [pendingSolutionStyles, setPendingSolutionStyles] = useState({});
  const [pendingSolutionPositions, setPendingSolutionPositions] = useState({});
  const [userEntreprise, setUserEntreprise] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

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
        sectionDesc: isValidPosition(fetchedPreferences.positions?.sectionDesc)
          ? fetchedPreferences.positions.sectionDesc
          : positions.sectionDesc,
        solutionGrid: isValidPosition(fetchedPreferences.positions?.solutionGrid)
          ? fetchedPreferences.positions.solutionGrid
          : positions.solutionGrid,
      };

      const newStyles = {
        sectionName: isValidStyle(fetchedPreferences.styles?.sectionName)
          ? fetchedPreferences.styles.sectionName
          : styles.sectionName,
        sectionDesc: isValidStyle(fetchedPreferences.styles?.sectionDesc)
          ? fetchedPreferences.styles.sectionDesc
          : styles.sectionDesc,
        solutionGrid: isValidStyle(fetchedPreferences.styles?.solutionGrid)
          ? fetchedPreferences.styles.solutionGrid
          : styles.solutionGrid,
      };

      const newTexts = {
        sectionName: isValidText(fetchedPreferences.texts?.sectionName)
          ? fetchedPreferences.texts.sectionName
          : texts.sectionName,
          sectionDesc: isValidText(fetchedPreferences.texts?.sectionDesc)
          ? fetchedPreferences.texts.sectionDesc
          : texts.sectionDesc,
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

  // Passer les styles chargés à EditorSolutionGrid
  useEffect(() => {
    if (editorSolutionGridRef.current && styles.solutionGrid) {
      // Les styles seront automatiquement appliqués via les props initialStyles
      console.log('Styles solutionGrid loaded:', styles.solutionGrid);
    }
  }, [styles.solutionGrid]);

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
    

    if (!userEntreprise) {
      toast.error("ID de l'entreprise manquant");
      console.error('No userEntreprise provided');
      return;
    }

    if (
      !isValidPosition(positions.sectionName) ||
      !isValidPosition(positions.sectionDesc) ||
      !isValidPosition(positions.solutionGrid) ||

      !isValidStyle(styles.sectionName) ||
      !isValidStyle(styles.sectionDesc) ||
      !isValidStyle(styles.solutionGrid) ||

      !isValidText(texts.sectionName)||
      !isValidText(texts.sectionDesc)
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

      // Utiliser les styles stockés dans pendingSolutionStyles ET ceux d'EditorSolutionGrid
      const allPendingStyles = { ...pendingSolutionStyles };
      
      // Récupérer les styles d'EditorSolutionGrid via la ref
      if (editorSolutionGridRef.current && editorSolutionGridRef.current.pendingStyles) {
        const gridStyles = editorSolutionGridRef.current.pendingStyles.current || {};
        Object.assign(allPendingStyles, gridStyles);
        console.log('Styles from EditorSolutionGrid:', gridStyles);
      }
      
      // Récupérer les styles de la grille (gap, width, height des cartes)
      if (editorSolutionGridRef.current && editorSolutionGridRef.current.getGridStyles) {
        const gridStylesData = editorSolutionGridRef.current.getGridStyles();
        console.log('Grid styles data:', gridStylesData);
        
        // Mettre à jour les styles de solutionGrid avec les styles de la grille
        const updatedSolutionGridStyles = {
          ...styles.solutionGrid,
          ...gridStylesData.gridStyles,
          card: gridStylesData.cardStyles.card,
          number: gridStylesData.cardStyles.number,
          title: gridStylesData.cardStyles.title,
          description: gridStylesData.cardStyles.description,
        };
        
        setStyles(prev => ({
          ...prev,
          solutionGrid: updatedSolutionGridStyles
        }));
        
        // Mettre à jour l'objet styles pour la sauvegarde
        const updatedStyles = {
          ...styles,
          solutionGrid: updatedSolutionGridStyles
        };
        
        // Sauvegarder les styles mis à jour
        const updatedPreferencesResponse = await axios.post(
          'http://localhost:5000/preferences/entreprise',
          {
            entreprise: userEntreprise,
            preferences: {
              [contentType]: {
                [styleKey]: {
                  positions,
                  styles: updatedStyles,
                  texts,
                },
              },
            },
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log('Updated preferences saved:', updatedPreferencesResponse.data);
      }
      
      if (Object.keys(allPendingStyles).length > 0) {
        console.log('Saving solution styles');
        for (const [solutionId, solutionStyles] of Object.entries(allPendingStyles)) {
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
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
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
    <> 
    <style>
        {`
          @keyframes slideInRight {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
        `}
      </style>
      
      {/* Notification de succès rendue dans le body */}
      <SuccessNotification 
        show={showSuccessMessage} 
        message="Modifications enregistrées avec succès" 
      />
      
      <div style={{ backgroundColor: 'white', minHeight: '100vh', padding: '20px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '20px',
        padding: '15px 20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #e9ecef'
      }}>
        <span style={{ 
          fontSize: '18px', 
          fontWeight: '600', 
          color: '#495057' 
        }}>Solutions section</span> 

        
        <button 
          onClick={saveAllChanges}
          style={{
            
            padding: '8px',
            backgroundColor: '#777777',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            marginTop: '16px',
            fontSize: '16px',
            fontWeight: '500',
            transition: 'background-color 0.2s ease'
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#c6c6c6';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = '#777777';
          }}
        >
          Enregistrer les modifications
        </button>
      </div>

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
      <EditorText
        elementType="h1"
        initialPosition={positions.sectionDesc}
        initialStyles={styles.sectionDesc}
        onSelect={setSelectedElement}
        onPositionChange={(newPosition) => handlePositionChange('sectionDesc', newPosition)}
        onStyleChange={(newStyles) => handleStyleChange('sectionDesc', newStyles)}
        onTextChange={(newText) => handleTextChange('sectionDesc', newText)}
      >
        {texts.sectionDesc}
      </EditorText>
      <EditorSolutionGrid
        solutions={solutions}
        initialPosition={positions.solutionGrid}
        initialStyles={styles.solutionGrid}
        onSelect={setSelectedElement}
        onPositionChange={(newPosition) => handlePositionChange('solutionGrid', newPosition)}
        onStyleChange={handleSolutionStyleChange}
        onUpdate={handleSolutionPositionChange}
        ref={editorSolutionGridRef}
      />
      {/* <button onClick={saveAllChanges}>Enregistrer les modifications</button> */}
    </div>
    </div>
    </>
  );
}