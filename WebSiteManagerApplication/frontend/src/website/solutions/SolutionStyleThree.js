// // src/components/SolutionStyleThree.js
// import React, { useState, useEffect } from 'react';
// import './OurSolutions.css';
// import EditorText from '../aboutus/EditorText';
// import EditorSolutionStyleThree from './EditorSolutionStyleThree';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import { jwtDecode } from 'jwt-decode';
 
// const DESCRIPTION_LIMIT = 50;

// export default function SolutionStyleThree({ solutions, contentType = 'solutions', styleKey = 'styleThree' }) {
//   useEffect(() => {
//     console.log('SolutionStyleOne received solutions:', solutions);
//     console.log('Solutions with id:', solutions.filter(s => s.id).map(s => ({ id: s.id, title: s.title })));
//   }, [solutions]);

//   const [selectedElement, setSelectedElement] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [positions, setPositions] = useState({
//     sectionName: { top: 0, left: 0 },
//     sectionDesc: { top: 20, left: 0 },
//     solutionGrid: { top: 50, left: 0 },
//   });
//   const [styles, setStyles] = useState({
//     sectionName: {
//       color: '#f59e0b',
//       fontSize: '20px',
//       fontFamily: 'Arial',
//       fontWeight: '600',
//       width: '100%',
//       maxWidth: '600px',
//     },
//     sectionDesc: {
//       color: 'black',
//       fontSize: '30px',
//       fontFamily: 'Arial',
//       fontWeight: '600',
//       width: '100%',
//       maxWidth: '800px',
//     },
//     solutionGrid: {
//       width: 1600,
//       minHeight: 400,
//     },
//   });
//   const [texts, setTexts] = useState({
//     sectionName: 'NOS SOLUTIONS',
//     sectionDesc: 'Customizable Solutions that are Easy to Adapt',
//   });
//   const [pendingSolutionStyles, setPendingSolutionStyles] = useState({});
//   const [pendingSolutionPositions, setPendingSolutionPositions] = useState({});
//   const [userEntreprise, setUserEntreprise] = useState(null);

//   // Validation functions
//   const isValidPosition = (pos) => pos && typeof pos === 'object' && typeof pos.top === 'number' && typeof pos.left === 'number';
//   const isValidStyle = (style) => style && typeof style === 'object' && Object.keys(style).length > 0;
//   const isValidText = (text) => typeof text === 'string' && text.trim().length > 0;

  
//   // Fetch user enterprise
//   const token = localStorage.getItem('token');
//   let userId = null;
  
//   if (token) {
//     try {
//       const decodedToken = jwtDecode(token);
//       userId = decodedToken?.sub;
//     } catch (error) {
//       console.error('Error decoding token:', error);
//       // Ne pas bloquer le rendu pour une erreur de token
//     }
//   }

//   const fetchUserEntreprise = async () => {
//     if (!token || !userId) {
//       console.log('No token or userId available, skipping user enterprise fetch');
//       return;
//     }

//     try {
//       const config = {
//         headers: { Authorization: `Bearer ${token}` },
//       };
//       const userResponse = await axios.get(`http://localhost:5000/auth/user/${userId}`, config);
//       const user = userResponse.data;
//       if (user.entreprise) {
//         setUserEntreprise(user.entreprise);
//       }
//     } catch (error) {
//       console.error('Error fetching user data:', error);
//       // Ne pas bloquer le rendu pour une erreur de récupération des données utilisateur
//     }
//   };

//   // Fetch preferences
//   // const fetchPreferences = async () => {
//   //   if (!userEntreprise) {
//   //     console.log('userEntreprise not yet available, skipping preferences fetch');
//   //     return;
//   //   }

//   //   try {
//   //     const response = await axios.get(
//   //       `http://localhost:5000/preferences/entreprise/${userEntreprise}/preferences`,
//   //       {
//   //         headers: { Authorization: `Bearer ${token}` },
//   //       }
//   //     );
//   //     console.log('Réponse préférences reçue:', response.data);
//   //     const fetchedPreferences = response.data.preferences?.[contentType]?.[styleKey] || {};
//   //     console.log('Préférences extraites:', fetchedPreferences);

//   //     const newPositions = {
//   //       sectionName: isValidPosition(fetchedPreferences.positions?.sectionName)
//   //         ? fetchedPreferences.positions.sectionName
//   //         : positions.sectionName,
//   //       sectionDesc: isValidPosition(fetchedPreferences.positions?.sectionDesc)
//   //         ? fetchedPreferences.positions.sectionDesc
//   //         : positions.sectionDesc,
//   //       solutionGrid: isValidPosition(fetchedPreferences.positions?.solutionGrid)
//   //         ? fetchedPreferences.positions.solutionGrid
//   //         : positions.solutionGrid,
//   //     };

//   //     const newStyles = {
//   //       sectionName: isValidStyle(fetchedPreferences.styles?.sectionName)
//   //         ? fetchedPreferences.styles.sectionName
//   //         : styles.sectionName,
//   //       sectionDesc: isValidStyle(fetchedPreferences.styles?.sectionDesc)
//   //         ? fetchedPreferences.styles.sectionDesc
//   //         : styles.sectionDesc,
//   //       solutionGrid: isValidStyle(fetchedPreferences.styles?.solutionGrid)
//   //         ? fetchedPreferences.styles.solutionGrid
//   //         : styles.solutionGrid,
//   //     };

//   //     const newTexts = {
//   //       sectionName: isValidText(fetchedPreferences.texts?.sectionName)
//   //         ? fetchedPreferences.texts.sectionName
//   //         : texts.sectionName,
//   //       sectionDesc: isValidText(fetchedPreferences.texts?.sectionDesc)
//   //         ? fetchedPreferences.texts.sectionDesc
//   //         : texts.sectionDesc,
//   //     };

//   //     console.log('Positions restaurées:', newPositions);
//   //     console.log('Styles restaurés:', newStyles);
//   //     console.log('Texts restaurés:', newTexts);
//   //     setPositions(newPositions);
//   //     setStyles(newStyles);
//   //     setTexts(newTexts);
//   //   } catch (error) {
//   //     console.error('Error fetching preferences:', error);
//   //     // Ne pas bloquer le rendu pour une erreur de préférences
//   //   }
//   // };


//   const fetchPreferences = async () => {
//     if (!userEntreprise) {
//       console.log('userEntreprise not yet available, skipping preferences fetch');
//       return;
//     }
  
//     setLoading(true);
//     try {
//       const response = await axios.get(
//         `http://localhost:5000/preferences/entreprise/${userEntreprise}/preferences`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       console.log('Full API response:', response.data);
//       const fetchedPreferences = response.data.preferences?.[contentType]?.[styleKey] || {};
//       console.log('Extracted preferences:', fetchedPreferences);
  
//       const newPositions = {
//         sectionName: isValidPosition(fetchedPreferences.positions?.sectionName)
//           ? fetchedPreferences.positions.sectionName
//           : positions.sectionName,
//         sectionDesc: isValidPosition(fetchedPreferences.positions?.sectionDesc)
//           ? fetchedPreferences.positions.sectionDesc
//           : positions.sectionDesc,
//         solutionGrid: isValidPosition(fetchedPreferences.positions?.solutionGrid)
//           ? fetchedPreferences.positions.solutionGrid
//           : positions.solutionGrid,
//       };
  
//       const newStyles = {
//         sectionName: isValidStyle(fetchedPreferences.styles?.sectionName)
//           ? fetchedPreferences.styles.sectionName
//           : styles.sectionName,
//         sectionDesc: isValidStyle(fetchedPreferences.styles?.sectionDesc)
//           ? fetchedPreferences.styles.sectionDesc
//           : styles.sectionDesc,
//         solutionGrid: isValidStyle(fetchedPreferences.styles?.solutionGrid)
//           ? fetchedPreferences.styles.solutionGrid
//           : styles.solutionGrid,
//       };
  
//       const newTexts = {
//         sectionName: isValidText(fetchedPreferences.texts?.sectionName)
//           ? fetchedPreferences.texts.sectionName
//           : texts.sectionName,
//         sectionDesc: isValidText(fetchedPreferences.texts?.sectionDesc)
//           ? fetchedPreferences.texts.sectionDesc
//           : texts.sectionDesc,
//       };
  
//       setPositions(newPositions);
//       setStyles(newStyles);
//       setTexts(newTexts);
//     } catch (error) {
//       console.error('Error fetching preferences:', error);
//       console.error('Error response:', error.response?.data);
//       toast.error('Erreur lors du chargement des préférences');
//       setError('Erreur lors du chargement des préférences');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (token && userId) {
//       fetchUserEntreprise();
//     }
//   }, []);

//   useEffect(() => {
//     if (userEntreprise) {
//       fetchPreferences();
//     }
//   }, [userEntreprise]);

//   const handlePositionChange = (element, newPosition) => {
//     if (isValidPosition(newPosition)) {
//       setPositions((prev) => ({
//         ...prev,
//         [element]: newPosition,
//       }));
//     }
//   };

//   const handleStyleChange = (element, newStyles) => {
//     if (isValidStyle(newStyles)) {
//       setStyles((prev) => ({
//         ...prev,
//         [element]: newStyles,
//       }));
//     }
//   };

//   const handleTextChange = (element, newText) => {
//     if (isValidText(newText)) {
//       setTexts((prev) => ({
//         ...prev,
//         [element]: newText,
//       }));
//     }
//   };

//   // const handleSolutionStyleChange = (solutionId, newStyles) => {
//   //   if (solutionId && isValidStyle(newStyles)) {
//   //     setPendingSolutionStyles((prev) => {
//   //       const existingStyles = prev[solutionId] || {};
//   //       const mergedStyles = {
//   //         ...existingStyles,
//   //         ...newStyles,
//   //         card: { ...existingStyles.card, ...newStyles.card },
//   //         title: { ...existingStyles.title, ...newStyles.title },
//   //         description: { ...existingStyles.description, ...newStyles.description },
//   //         image: { ...existingStyles.image, ...newStyles.image },
//   //       };
        
//   //       return {
//   //         ...prev,
//   //         [solutionId]: mergedStyles,
//   //       };
//   //     });
//   //   }
//   // };

//   const handleSolutionStyleChange = (solutionId, newStyles) => {
//     console.log(`=== handleSolutionStyleChange called ===`);
//     console.log(`solutionId:`, solutionId);
//     console.log(`newStyles:`, newStyles);
//     console.log(`typeof solutionId:`, typeof solutionId);
//     console.log(`solutionId === 'undefined':`, solutionId === 'undefined');
//     console.log(`isValidStyle(newStyles):`, isValidStyle(newStyles));
    
//     // alert(`Style modifié pour la solution ${solutionId}! Cliquez sur "Enregistrer les modifications" pour sauvegarder.`);
    
//     if (!solutionId || solutionId === 'undefined') {
//       console.warn(`Invalid solutionId: ${solutionId}`);
//       return;
//     }
    
//     if (isValidStyle(newStyles)) {
//       console.log(`Before setPendingSolutionStyles:`, pendingSolutionStyles);
//       setPendingSolutionStyles((prev) => {
//         const newState = {
//           ...prev,
//           [solutionId]: newStyles,
//         };
//         console.log(`New pendingSolutionStyles state:`, newState);
//         return newState;
//       });
//       console.log(`Styles ajoutés à pendingSolutionStyles pour ${solutionId}:`, newStyles);
//     } else {
//       console.warn(`Invalid solution styles for solutionId ${solutionId}:`, newStyles);
//     }
//   };

//   // const handleSolutionPositionChange = (solutionId, newPositions) => {
//   //   if (solutionId && newPositions && typeof newPositions === 'object') {
//   //     setPendingSolutionPositions((prev) => ({
//   //       ...prev,
//   //       [solutionId]: newPositions,
//   //     }));
//   //   }
//   // };

//   const handleSolutionPositionChange = (solutionId, newPositions) => {
//     console.log(`=== handleSolutionPositionChange called ===`);
//     console.log(`solutionId:`, solutionId);
//     console.log(`newPositions:`, newPositions);
    
//     if (!solutionId || solutionId === 'undefined') {
//       console.warn(`Invalid solutionId: ${solutionId}`);
//       return;
//     }
    
//     if (newPositions && typeof newPositions === 'object') {
//       setPendingSolutionPositions((prev) => ({
//         ...prev,
//         [solutionId]: newPositions,
//       }));
//       console.log(`Positions ajoutées à pendingSolutionPositions pour ${solutionId}:`, newPositions);
//     } else {
//       console.warn(`Invalid solution positions for solutionId ${solutionId}:`, newPositions);
//     }
//   };

//   const saveAllChanges = async () => {
//     if (!userEntreprise) {
//       toast.error("ID de l'entreprise manquant");
//       return;
//     }

//     // Correction : autoriser la sauvegarde même si les positions sont par défaut
//     if (
//       !isValidPosition(positions.sectionName) ||
//       !isValidPosition(positions.sectionDesc) ||
//       !isValidPosition(positions.solutionGrid) ||
//       !isValidStyle(styles.sectionName) ||
//       !isValidStyle(styles.sectionDesc) ||
//       !isValidStyle(styles.solutionGrid) ||
//       !isValidText(texts.sectionName) ||
//       !isValidText(texts.sectionDesc)
//     ) {
//       toast.error('Données de position, style ou texte invalides (null/undefined)');
//       return;
//     }

//     // try {
//     //   const payload = {
//     //     entreprise: userEntreprise,
//     //     preferences: {
//     //       [contentType]: {
//     //         [styleKey]: {
//     //           positions,
//     //           styles,
//     //           texts,
//     //         },
//     //       },
//     //     },
//     //   };
//     //   console.log('Payload envoyé pour sauvegarde préférences:', payload);
//     //   const preferencesResponse = await axios.post(
//     //     'http://localhost:5000/preferences/entreprise',
//     //     payload,
//     //     {
//     //       headers: { Authorization: `Bearer ${token}` },
//     //     }
//     //   );
//     //   console.log('Réponse sauvegarde préférences:', preferencesResponse.data);

//     //   for (const [solutionId, solutionStyles] of Object.entries(pendingSolutionStyles)) {
//     //     if (solutionId && isValidStyle(solutionStyles)) {
//     //       try {
//     //         await axios.patch(
//     //           `http://localhost:5000/contenus/Solution/${solutionId}/styles`,
//     //           solutionStyles,
//     //           {
//     //             headers: { Authorization: `Bearer ${token}` },
//     //           }
//     //         );
//     //       } catch (error) {
//     //         console.error(`Failed to save styles for solution ${solutionId}:`, error.response?.status, error.response?.data);
//     //         toast.error(`Erreur lors de la sauvegarde des styles pour la solution ${solutionId}`);
//     //       }
//     //     }
//     //   }

//     //   for (const [solutionId, solutionPositions] of Object.entries(pendingSolutionPositions)) {
//     //     if (solutionId && solutionPositions) {
//     //       try {
//     //         await axios.patch(
//     //           `http://localhost:5000/contenus/Solution/${solutionId}`,
//     //           { positions: solutionPositions },
//     //           {
//     //             headers: { Authorization: `Bearer ${token}` },
//     //           }
//     //         );
//     //       } catch (error) {
//     //         console.error(`Failed to save positions for solution ${solutionId}:`, error.response?.status, error.response?.data);
//     //         toast.error(`Erreur lors de la sauvegarde des positions pour la solution ${solutionId}`);
//     //       }
//     //     }
//     //   }

//     //   setPendingSolutionStyles({});
//     //   setPendingSolutionPositions({});
//     //   toast.success('Modifications sauvegardées avec succès');
//     // }
//     try {
//       console.log('Sending POST to http://localhost:5000/preferences/entreprise');
//       const preferencesResponse = await axios.post(
//         'http://localhost:5000/preferences/entreprise',
//         {
//           entreprise: userEntreprise,
//           preferences: {
//             [contentType]: {
//               [styleKey]: {
//                 positions,
//                 styles,
//                 texts,
//               },
//             },
//           },
//         },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       console.log('Preferences saved:', preferencesResponse.data);

//       if (Object.keys(pendingSolutionStyles).length > 0) {
//         console.log('Saving solution styles');
//         for (const [solutionId, solutionStyles] of Object.entries(pendingSolutionStyles)) {
//           if (solutionId && solutionId !== 'undefined' && isValidStyle(solutionStyles)) {
//             try {
//               const solutionResponse = await axios.patch(
//                 `http://localhost:5000/contenus/Solution/${solutionId}/styles`,
//                 solutionStyles,
//                 {
//                   headers: { Authorization: `Bearer ${token}` },
//                 }
//               );
//               console.log(`Solution styles saved for ${solutionId}:`, solutionResponse.data);
//             } catch (endpointError) {
//               console.error(`Failed to save styles for solution ${solutionId}:`, endpointError.response?.status, endpointError.response?.data);
//               toast.error(`Erreur lors de la sauvegarde des styles pour la solution ${solutionId}`);
//             }
//           } else {
//             console.warn(`Skipping invalid solutionId or styles: ${solutionId}`, solutionStyles);
//           }
//         }
//       } else {
//         console.log('No solution styles to save');
//       }

//       if (Object.keys(pendingSolutionPositions).length > 0) {
//         console.log('Saving solution positions');
//         for (const [solutionId, solutionPositions] of Object.entries(pendingSolutionPositions)) {
//           if (solutionId && solutionId !== 'undefined' && solutionPositions) {
//             try {
//               const solutionResponse = await axios.patch(
//                 `http://localhost:5000/contenus/Solution/${solutionId}`,
//                 { positions: solutionPositions },
//                 {
//                   headers: { Authorization: `Bearer ${token}` },
//                 }
//               );
//               console.log(`Solution positions saved for ${solutionId}:`, solutionResponse.data);
//             } catch (endpointError) {
//               console.error(`Failed to save positions for solution ${solutionId}:`, endpointError.response?.status, endpointError.response?.data);
//               toast.error(`Erreur lors de la sauvegarde des positions pour la solution ${solutionId}`);
//             }
//           } else {
//             console.warn(`Skipping invalid solutionId or positions: ${solutionId}`, solutionPositions);
//           }
//         }
//       } else {
//         console.log('No solution positions to save');
//       }

//       setPendingSolutionStyles({});
//       setPendingSolutionPositions({});
//       toast.success('Modifications sauvegardées avec succès');
//     } catch (error) {
//       console.error('Error saving changes:', error);
//       toast.error('Erreur lors de la sauvegarde');
//     }
//   };

//   // Si pas de solutions, afficher un message
//   if (!solutions || solutions.length === 0) {
//     return (
//       <div className="solutions-style-three-container">
//         <div style={{ padding: '20px', textAlign: 'center' }}>
//           <h3>Aucune solution disponible</h3>
//           <p>Veuillez ajouter des solutions pour les afficher ici.</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="solutions-style-three-container">
//       <EditorText
//         elementType="h1"
//         initialPosition={positions.sectionName}
//         initialStyles={styles.sectionName}
//         onSelect={setSelectedElement}
//         onPositionChange={(newPosition) => handlePositionChange('sectionName', newPosition)}
//         onStyleChange={(newStyles) => handleStyleChange('sectionName', newStyles)}
//         onTextChange={(newText) => handleTextChange('sectionName', newText)}
//       >
//         {texts.sectionName}
//       </EditorText>
//       <EditorText
//         elementType="h1"
//         initialPosition={positions.sectionDesc}
//         initialStyles={styles.sectionDesc}
//         onSelect={setSelectedElement}
//         onPositionChange={(newPosition) => handlePositionChange('sectionDesc', newPosition)}
//         onStyleChange={(newStyles) => handleStyleChange('sectionDesc', newStyles)}
//         onTextChange={(newText) => handleTextChange('sectionDesc', newText)}
//       >
//         {texts.sectionDesc}
//       </EditorText>
//       <EditorSolutionStyleThree
//         solutions={solutions}
//         initialPosition={positions.solutionGrid}
//         initialStyles={styles.solutionGrid}
//         onSelect={setSelectedElement}
//         onPositionChange={(newPosition) => handlePositionChange('solutionGrid', newPosition)}
//         onStyleChange={handleSolutionStyleChange}
//         onUpdate={handleSolutionPositionChange}
//       />
//       {/* {userEntreprise && ( */}
//         <button onClick={saveAllChanges}>Enregistrer les modifications</button>
//        {/* )} */}
//     </div>
//   );
// }

import React, { useState, useEffect } from 'react';
import './OurSolutions.css';
import EditorText from '../aboutus/EditorText';
import EditorSolutionStyleThree from './EditorSolutionStyleThree';
import axios from 'axios';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';

const DESCRIPTION_LIMIT = 50;

// Définir les constantes par défaut
const defaultPositions = {
  sectionName: { top: 0, left: 0 },
  sectionDesc: { top: 20, left: 0 },
  solutionGrid: { top: 50, left: 0 },
};

const defaultStyles = {
  sectionName: {
    color: '#f59e0b',
    fontSize: '20px',
    fontFamily: 'Arial',
    fontWeight: '600',
    width: '100%',
    maxWidth: '600px',
  },
  sectionDesc: {
    color: 'black',
    fontSize: '30px',
    fontFamily: 'Arial',
    fontWeight: '600',
    width: '100%',
    maxWidth: '800px',
  },
  solutionGrid: {
    width: 1600,
    minHeight: 400,
  },
};

const defaultTexts = {
  sectionName: 'NOS SOLUTIONS',
  sectionDesc: 'Customizable Solutions that are Easy to Adapt',
};

export default function SolutionStyleThree({ solutions, contentType = 'solutions', styleKey = 'styleThree' }) {
  useEffect(() => {
    console.log('SolutionStyleThree received solutions:', solutions);
    console.log('Solutions with id:', solutions.filter(s => s.id).map(s => ({ id: s.id, title: s.title })));
  }, [solutions]);

  const [selectedElement, setSelectedElement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [positions, setPositions] = useState(defaultPositions);
  const [styles, setStyles] = useState(defaultStyles);
  const [texts, setTexts] = useState(defaultTexts);
  const [pendingSolutionStyles, setPendingSolutionStyles] = useState({});
  const [pendingSolutionPositions, setPendingSolutionPositions] = useState({});
  const [userEntreprise, setUserEntreprise] = useState(null);

  // Validation functions
  const isValidPosition = (pos) => {
    console.log('Validation position:', pos);
    return pos && typeof pos === 'object' && typeof pos.top === 'number' && typeof pos.left === 'number';
  };
  const isValidStyle = (style) => {
    console.log('Validation style:', style);
    return style && typeof style === 'object' && Object.keys(style).length > 0;
  };
  const isValidText = (text) => {
    console.log('Validation text:', text);
    return typeof text === 'string' && text.trim().length > 0;
  };

  // Fetch user enterprise
  const token = localStorage.getItem('token');
  let userId = null;

  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      userId = decodedToken?.sub;
    } catch (error) {
      console.error('Error decoding token:', error);
      setError('Erreur lors du décodage du token');
      setLoading(false);
    }
  }

  const fetchUserEntreprise = async () => {
    console.log('fetchUserEntreprise appelé avec userId:', userId);
    if (!token || !userId) {
      console.log('No token or userId available');
      setError('Token ou ID utilisateur manquant');
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const userResponse = await axios.get(`http://localhost:5000/auth/user/${userId}`, config);
      const user = userResponse.data;
      if (user.entreprise) {
        setUserEntreprise(user.entreprise);
      } else {
        setError('Entreprise non trouvée pour l\'utilisateur');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Erreur lors de la récupération des données utilisateur');
      setLoading(false);
    }
  };

  // Fetch preferences
  const fetchPreferences = async () => {
    console.log('fetchPreferences appelé avec userEntreprise:', userEntreprise);
    if (!userEntreprise) {
      console.log('userEntreprise not yet available');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/preferences/entreprise/${userEntreprise}/preferences`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log('Réponse complète de l\'API preferences:', response.data);
      const fetchedPreferences = response.data.preferences?.[contentType]?.[styleKey] || {};
      console.log('fetchedPreferences:', fetchedPreferences);

      const newPositions = {
        sectionName: isValidPosition(fetchedPreferences.positions?.sectionName)
          ? fetchedPreferences.positions.sectionName
          : defaultPositions.sectionName,
        sectionDesc: isValidPosition(fetchedPreferences.positions?.sectionDesc)
          ? fetchedPreferences.positions.sectionDesc
          : defaultPositions.sectionDesc,
        solutionGrid: isValidPosition(fetchedPreferences.positions?.solutionGrid)
          ? fetchedPreferences.positions.solutionGrid
          : defaultPositions.solutionGrid,
      };

      const newStyles = {
        sectionName: isValidStyle(fetchedPreferences.styles?.sectionName)
          ? fetchedPreferences.styles.sectionName
          : defaultStyles.sectionName,
        sectionDesc: isValidStyle(fetchedPreferences.styles?.sectionDesc)
          ? fetchedPreferences.styles.sectionDesc
          : defaultStyles.sectionDesc,
        solutionGrid: isValidStyle(fetchedPreferences.styles?.sectionGrid)
          ? fetchedPreferences.styles.solutionGrid
          : defaultStyles.solutionGrid,
      };

      const newTexts = {
        sectionName: isValidText(fetchedPreferences.texts?.sectionName)
          ? fetchedPreferences.texts.sectionName
          : defaultTexts.sectionName,
        sectionDesc: isValidText(fetchedPreferences.texts?.sectionDesc)
          ? fetchedPreferences.texts.sectionDesc
          : defaultTexts.sectionDesc,
      };

      console.log('Nouvelles positions:', newPositions);
      console.log('Nouveaux styles:', newStyles);
      console.log('Nouveaux textes:', newTexts);

      setPositions(newPositions);
      setStyles(newStyles);
      setTexts(newTexts);
    } catch (error) {
      console.error('Erreur lors de la récupération des préférences:', error);
      console.error('Réponse erreur:', error.response?.data);
      toast.error('Erreur lors du chargement des préférences');
      setError('Erreur lors du chargement des préférences');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && userId) {
      fetchUserEntreprise();
    }
  }, [token, userId]);

  useEffect(() => {
    if (userEntreprise) {
      fetchPreferences();
    }
  }, [userEntreprise]);

  useEffect(() => {
    console.log('État positions:', positions);
    console.log('État styles:', styles);
    console.log('État texts:', texts);
  }, [positions, styles, texts]);

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
      !isValidPosition(positions.sectionDesc) ||
      !isValidPosition(positions.solutionGrid) ||
      !isValidStyle(styles.sectionName) ||
      !isValidStyle(styles.sectionDesc) ||
      !isValidStyle(styles.solutionGrid) ||
      !isValidText(texts.sectionName) ||
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
      console.error('Response error:', error.response?.data);
      toast.error(`Erreur: ${error.response?.data?.message || 'Échec de la sauvegarde'}`);
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>Erreur: {error}</div>;
  }

  if (!solutions || solutions.length === 0) {
    return (
      <div className="solutions-style-three-container">
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h3>Aucune solution disponible</h3>
          <p>Veuillez ajouter des solutions pour les afficher ici.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="solutions-style-three-container">
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
      <EditorSolutionStyleThree
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