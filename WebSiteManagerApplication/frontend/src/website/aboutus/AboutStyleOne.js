// import React, { useState, useEffect } from 'react';
// import './AboutUs.css';
// import logoblack from '../../images/aboutus.webp';
// import EditorText from './EditorText';
// import EditorImage from './EditorImage';
// import axios from "axios";
// import { jwtDecode } from "jwt-decode";
// import { toast } from 'react-toastify';

// export default function AboutStyleOne() {
//   const [selectedElement, setSelectedElement] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [positions, setPositions] = useState({
//     sectionName: { top: 10, left: 50 },
//   });
//   const [styles, setStyles] = useState({
//     sectionName: {
//       color: '#000000',
//       fontSize: '3rem',
//       fontFamily: 'Arial',
//       fontWeight: 'bold',
//       width: '100%',
//       maxWidth: '600px',
//       textAlign: 'center',
//     },
//   });
//   const [texts, setTexts] = useState({
//     sectionName: 'About Us',
//   });
//   const [pendingAProposStyles, setPendingAProposStyles] = useState({});
//   const [pendingAProposPositions, setPendingAProposPositions] = useState({});
//   const [apropos, setAPropos] = useState(null);
//   const [userEntreprise, setUserEntreprise] = useState(null);

//   // Validation functions
//   const isValidPosition = (pos) => pos && typeof pos === 'object' && typeof pos.top === 'number' && typeof pos.left === 'number';
//   const isValidStyle = (style) => style && typeof style === 'object' && Object.keys(style).length > 0;
//   const isValidText = (text) => typeof text === 'string' && text.trim().length > 0;

//   // Token and user ID
//   const token = localStorage.getItem("token");
//   let userId = null;
//   if (token) {
//     try {
//       const decodedToken = jwtDecode(token);
//       userId = decodedToken?.sub;
//     } catch (error) {
//       console.error("Error decoding token:", error);
//       setError('Erreur lors du décodage du token.');
//       setLoading(false);
//     }
//   } else {
//     console.error("Token is missing from localStorage.");
//     setError('Token manquant. Veuillez vous connecter.');
//     setLoading(false);
//   }

//   // Fetch user enterprise
//   const fetchUserEntreprise = async () => {
//     if (!token || !userId) {
//       console.error("Token or User ID is missing");
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
//       console.error("Error fetching user data:", error);
//       setError('Erreur lors de la récupération des données utilisateur.');
//       setLoading(false);
//     }
//   };

//   // Fetch APropos data
//   const fetchAPropos = async () => {
//     if (!token || !userId || !userEntreprise) {
//       console.error("Token, User ID, or User Entreprise is missing");
//       setError('Token, ID utilisateur ou entreprise manquant.');
//       setLoading(false);
//       return;
//     }

//     try {
//       const config = {
//         headers: { Authorization: `Bearer ${token}` },
//       };
//       const response = await axios.get(
//         `http://localhost:5000/contenus/APropos/entreprise/${userEntreprise}`,
//         config
//       );
//       const data = Array.isArray(response.data) ? response.data[0] : response.data;
//       setAPropos(data);
//     } catch (error) {
//       console.error("Error fetching apropos by entreprise:", error);
//       toast.error('Erreur lors du chargement des données À Propos');
//     }
//   };

//   // Fetch preferences
//   const fetchPreferences = async () => {
//     if (!userEntreprise) {
//       console.log('userEntreprise not yet available');
//       return;
//     }

//     try {
//       const response = await axios.get(
//         `http://localhost:5000/preferences/entreprise/${userEntreprise}/preferences`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       const fetchedPreferences = response.data.preferences?.aboutus?.styleOne || {};

//       const newPositions = {
//         sectionName: isValidPosition(fetchedPreferences.positions?.sectionName)
//           ? fetchedPreferences.positions.sectionName
//           : positions.sectionName,
//       };

//       const newStyles = {
//         sectionName: isValidStyle(fetchedPreferences.styles?.sectionName)
//           ? fetchedPreferences.styles.sectionName
//           : styles.sectionName,
//       };

//       const newTexts = {
//         sectionName: isValidText(fetchedPreferences.texts?.sectionName)
//           ? fetchedPreferences.texts.sectionName
//           : texts.sectionName,
//       };

//       setPositions(newPositions);
//       setStyles(newStyles);
//       setTexts(newTexts);
//     } catch (error) {
//       console.error('Error fetching preferences:', error);
//       toast.error('Erreur lors du chargement des préférences');
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
//       fetchAPropos();
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

//   const handleAProposStyleChange = (element, newStyles) => {
//     if (isValidStyle(newStyles)) {
//       setPendingAProposStyles((prev) => ({
//         ...prev,
//         [element]: newStyles,
//       }));
//       console.log(`Updated styles for ${element}:`, newStyles); // Debug log
//     }
//   };

//   const handleAProposPositionChange = (element, newPosition) => {
//     if (isValidPosition(newPosition)) {
//       setPendingAProposPositions((prev) => ({
//         ...prev,
//         [element]: newPosition,
//       }));
//       console.log(`Updated position for ${element}:`, newPosition); // Debug log
//     }
//   };

//   const saveAllChanges = async () => {
//     if (!userEntreprise || !apropos?._id) {
//       toast.error("ID de l'entreprise ou de la section À Propos manquant");
//       return;
//     }

//     if (
//       !isValidPosition(positions.sectionName) ||
//       !isValidStyle(styles.sectionName) ||
//       !isValidText(texts.sectionName)
//     ) {
//       toast.error('Données de position, style ou texte invalides pour sectionName');
//       return;
//     }

//     try {
//       // Save preferences
//       console.log('Saving preferences:', { positions, styles, texts }); // Debug log
//       const preferencesResponse = await axios.post(
//         'http://localhost:5000/preferences/entreprise',
//         {
//           entreprise: userEntreprise,
//           preferences: {
//             aboutus: {
//               styleOne: {
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

//       // Save APropos styles
//       if (Object.keys(pendingAProposStyles).length > 0) {
//         console.log('Saving APropos styles:', pendingAProposStyles); // Debug log
//         try {
//           await axios.patch(
//             `http://localhost:5000/contenus/APropos/${apropos._id}`,
//             { styles: pendingAProposStyles },
//             {
//               headers: { Authorization: `Bearer ${token}` },
//             }
//           );
//         } catch (error) {
//           console.error('Failed to save styles for APropos:', error.response?.status, error.response?.data);
//           toast.error('Erreur lors de la sauvegarde des styles pour À Propos');
//         }
//       }

//       // Save APropos positions
//       if (Object.keys(pendingAProposPositions).length > 0) {
//         console.log('Saving APropos positions:', pendingAProposPositions); // Debug log
//         try {
//           await axios.patch(
//             `http://localhost:5000/contenus/APropos/${apropos._id}`,
//             { positions: pendingAProposPositions },
//             {
//               headers: { Authorization: `Bearer ${token}` },
//             }
//           );
//         } catch (error) {
//           console.error('Failed to save positions for APropos:', error.response?.status, error.response?.data);
//           toast.error('Erreur lors de la sauvegarde des positions pour À Propos');
//         }
//       }

//       setPendingAProposStyles({});
//       setPendingAProposPositions({});
//       toast.success('Modifications sauvegardées avec succès');
//     } catch (error) {
//       console.error('Error saving changes:', error);
//       toast.error('Erreur lors de la sauvegarde');
//     }
//   };

//   if (loading) {
//     return <div>Chargement...</div>;
//   }

//   if (error) {
//     return <div>Erreur: {error}</div>;
//   }

//   return (
//     <div
//       className="editor-container"
//       onClick={() => setSelectedElement(null)}
//       style={{ position: 'relative', width: '100%', height: '100vh' }}
//     >
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
//         elementType="h2"
//         initialPosition={apropos?.positions?.title || { top: 80, left: 50 }}
//         initialStyles={apropos?.styles?.title || {
//           color: '#f59e0b',
//           fontSize: '1.5rem',
//           fontFamily: 'Arial',
//         }}
//         onSelect={setSelectedElement}
//         onPositionChange={(newPosition) => handleAProposPositionChange('title', newPosition)}
//         onStyleChange={(newStyles) => handleAProposStyleChange('title', newStyles)}
//       >
//         {apropos?.titre || "Abshore is a Digital Services Company."}
//       </EditorText>
//       <EditorText
//         elementType="p"
//         initialPosition={apropos?.positions?.description || { top: 140, left: 80 }}
//         initialStyles={apropos?.styles?.description || {
//           color: '#666666',
//           fontSize: '1rem',
//           fontFamily: 'Arial',
//           width: '600px',
//         }}
//         onSelect={setSelectedElement}
//         onPositionChange={(newPosition) => handleAProposPositionChange('description', newPosition)}
//         onStyleChange={(newStyles) => handleAProposStyleChange('description', newStyles)}
//       >
//         {apropos?.description || "Since 2012, our company has been supporting..."}
//       </EditorText>
//       <EditorImage
//         initialPosition={apropos?.positions?.image || { top: 60, left: 800 }}
//         initialStyles={apropos?.styles?.image || {
//           width: 600,
//           height: 600,
//           borderRadius: '0px',
//         }}
//         src={apropos?.image || logoblack}
//         alt="Logo"
//         onSelect={setSelectedElement}
//         onPositionChange={(newPosition) => handleAProposPositionChange('image', newPosition)}
//         onStyleChange={(newStyles) => handleAProposStyleChange('image', newStyles)}
//       />
//       <button onClick={saveAllChanges}>Enregistrer les modifications</button>
//     </div>
//   );
// }

import React, { useState, useEffect } from 'react';
import './AboutUs.css';
import logoblack from '../../images/aboutus.webp';
import EditorText from './EditorText';
import EditorImage from './EditorImage';
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { toast } from 'react-toastify';

export default function AboutStyleOne() {
  const [selectedElement, setSelectedElement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [positions, setPositions] = useState({
    sectionName: { top: 10, left: 50 },
  });
  const [styles, setStyles] = useState({
    sectionName: {
      color: '#000000',
      fontSize: '3rem',
      fontFamily: 'Arial',
      fontWeight: 'bold',
      width: '100%',
      maxWidth: '600px',
      textAlign: 'center',
    },
  });
  const [texts, setTexts] = useState({
    sectionName: 'About Us',
  });
  const [pendingAProposStyles, setPendingAProposStyles] = useState({});
  const [pendingAProposPositions, setPendingAProposPositions] = useState({});
  const [apropos, setAPropos] = useState(null);
  const [userEntreprise, setUserEntreprise] = useState(null);

  // Validation functions
  const isValidPosition = (pos) => pos && typeof pos === 'object' && typeof pos.top === 'number' && typeof pos.left === 'number';
  const isValidStyle = (style) => style && typeof style === 'object' && Object.keys(style).length > 0;
  const isValidText = (text) => typeof text === 'string' && text.trim().length > 0;

  // Token and user ID
  const token = localStorage.getItem("token");
  let userId = null;
  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      userId = decodedToken?.sub;
    } catch (error) {
      console.error("Error decoding token:", error);
      setError('Erreur lors du décodage du token.');
      setLoading(false);
    }
  } else {
    console.error("Token is missing from localStorage.");
    setError('Token manquant. Veuillez vous connecter.');
    setLoading(false);
  }

  // Fetch user enterprise
  const fetchUserEntreprise = async () => {
    if (!token || !userId) {
      console.error("Token or User ID is missing");
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
      console.error("Error fetching user data:", error);
      setError('Erreur lors de la récupération des données utilisateur.');
      setLoading(false);
    }
  };

  // Fetch APropos data
  const fetchAPropos = async () => {
    if (!token || !userId || !userEntreprise) {
      console.error("Token, User ID, or User Entreprise is missing");
      setError('Token, ID utilisateur ou entreprise manquant.');
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const response = await axios.get(
        `http://localhost:5000/contenus/APropos/entreprise/${userEntreprise}`,
        config
      );
      const data = Array.isArray(response.data) ? response.data[0] : response.data;
      setAPropos(data);
    } catch (error) {
      console.error("Error fetching apropos by entreprise:", error);
      toast.error('Erreur lors du chargement des données À Propos');
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
      const fetchedPreferences = response.data.preferences?.aboutus?.styleOne || {};

      const newPositions = {
        sectionName: isValidPosition(fetchedPreferences.positions?.sectionName)
          ? fetchedPreferences.positions.sectionName
          : positions.sectionName,
      };

      const newStyles = {
        sectionName: isValidStyle(fetchedPreferences.styles?.sectionName)
          ? fetchedPreferences.styles.sectionName
          : styles.sectionName,
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
      fetchAPropos();
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

  const handleAProposStyleChange = (element, newStyles) => {
    if (isValidStyle(newStyles)) {
      setPendingAProposStyles((prev) => ({
        ...prev,
        [element]: newStyles,
      }));
      console.log(`[aboutstyleone] Updated styles for ${element}:`, newStyles); // Debug log
    }
  };

  const handleAProposPositionChange = (element, newPosition) => {
    if (isValidPosition(newPosition)) {
      setPendingAProposPositions((prev) => ({
        ...prev,
        [element]: newPosition,
      }));
      console.log(`[aboutstyleone] Updated position for ${element}:`, newPosition); // Debug log
    }
  };

  const saveAllChanges = async () => {
    if (!userEntreprise || !apropos?._id) {
      toast.error("ID de l'entreprise ou de la section À Propos manquant");
      return;
    }

    if (
      !isValidPosition(positions.sectionName) ||
      !isValidStyle(styles.sectionName) ||
      !isValidText(texts.sectionName)
    ) {
      toast.error('Données de position, style ou texte invalides pour sectionName');
      return;
    }

    try {
      // Save preferences
      console.log('[aboutstyleone] Saving preferences:', { positions, styles, texts }); // Debug log
      const preferencesResponse = await axios.post(
        'http://localhost:5000/preferences/entreprise',
        {
          entreprise: userEntreprise,
          preferences: {
            aboutus: {
              styleOne: {
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

      // Save APropos styles
      if (Object.keys(pendingAProposStyles).length > 0) {
        console.log('[aboutstyleone] Saving APropos styles:', pendingAProposStyles); // Debug log
        try {
          await axios.patch(
            `http://localhost:5000/contenus/APropos/${apropos._id}`,
            { styles: pendingAProposStyles },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
        } catch (error) {
          console.error('[aboutstyleone] Failed to save styles for APropos:', error.response?.status, error.response?.data);
          toast.error('Erreur lors de la sauvegarde des styles pour À Propos');
        }
      }

      // Save APropos positions
      if (Object.keys(pendingAProposPositions).length > 0) {
        console.log('[aboutstyleone] Saving APropos positions:', pendingAProposPositions); // Debug log
        try {
          await axios.patch(
            `http://localhost:5000/contenus/APropos/${apropos._id}`,
            { positions: pendingAProposPositions },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
        } catch (error) {
          console.error('[aboutstyleone] Failed to save positions for APropos:', error.response?.status, error.response?.data);
          toast.error('Erreur lors de la sauvegarde des positions pour À Propos');
        }
      }

      setPendingAProposStyles({});
      setPendingAProposPositions({});
      toast.success('Modifications sauvegardées avec succès');
    } catch (error) {
      console.error('[aboutstyleone] Error saving changes:', error);
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>Erreur: {error}</div>;
  }

  return (
    <div
      className="editor-container"
      onClick={() => setSelectedElement(null)}
      style={{ position: 'relative', width: '100%', height: '100vh' }}
    >
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
  elementType="h2"
        initialPosition={apropos?.positions?.title || { top: 80, left: 50 }}
        initialStyles={apropos?.styles?.title || {
          color: '#f59e0b',
          fontSize: '1.5rem',
          fontFamily: 'Arial',
        }}
  onSelect={setSelectedElement}
        onPositionChange={(newPosition) => handleAProposPositionChange('title', newPosition)}
        onStyleChange={(newStyles) => handleAProposStyleChange('title', newStyles)}
>
        {apropos?.titre || "Abshore is a Digital Services Company."}
</EditorText>

<EditorText
  elementType="p"
        initialPosition={apropos?.positions?.description || { top: 140, left: 80 }}
        initialStyles={apropos?.styles?.description || {
          color: '#666666',
          fontSize: '1rem',
          fontFamily: 'Arial',
          width: '600px',
        }}
  onSelect={setSelectedElement}
        onPositionChange={(newPosition) => handleAProposPositionChange('description', newPosition)}
        onStyleChange={(newStyles) => handleAProposStyleChange('description', newStyles)}
>
        {apropos?.description || "Since 2012, our company has been supporting..."}
</EditorText>
<EditorImage
        initialPosition={apropos?.positions?.image || { top: 60, left: 800 }}
        initialStyles={apropos?.styles?.image || {
          width: 600,
          height: 600,
          borderRadius: '0px',
        }}
        src={apropos?.image || logoblack}
  alt="Logo"
  onSelect={setSelectedElement}
        onPositionChange={(newPosition) => handleAProposPositionChange('image', newPosition)}
        onStyleChange={(newStyles) => handleAProposStyleChange('image', newStyles)}
      />
      <button onClick={saveAllChanges}>Enregistrer les modifications</button>
    </div>
  );
}