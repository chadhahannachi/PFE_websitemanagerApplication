// import React from 'react';
// import './Units.css';
// import company from '../../images/company.jpg';

// export default function UnitStyleOne({ unites }) {
//   return (
//     <div className="units-wrapper">
//       <div className="text-content">
//         <h1>Our Units</h1>
//         <p> - A reliable partner to meet all your development and digital services needs.</p>
//         <div>
//           {unites.length > 0 ? (
//             unites.map((unit, index) => (
//               <div key={index}>
//                 <h2>
//                   {unit.image && (
//                     <img
//                       src={unit.image}
//                       alt={unit.titre || "Image de l'unité"}
//                       style={{
//                         width: '40px',
//                         height: '40px',
//                         objectFit: 'cover',
//                         marginRight: '8px',
//                         verticalAlign: 'middle',
//                       }}
//                       onError={(e) => {
//                         e.target.src = "https://via.placeholder.com/40";
//                       }}
//                     />
//                   )}
//                   {unit.titre}
//                 </h2>
//                 <p>{unit.description}</p>
//               </div>
//             ))
//           ) : (
//             <p>Aucune unité publiée pour le moment.</p>
//           )}
//         </div>
//       </div>
//       <div className="image-content">
//            <img src={company} alt="Logo" />
//       </div>
//     </div>
//   );
// }



import React, { useState, useEffect } from 'react';
import './Units.css';
import company from '../../images/company.jpg';
import EditorText from '../aboutus/EditorText';
import EditorImage from '../aboutus/EditorImage';
import EditorUnitContent from './EditorUnitContent';
import axios from 'axios';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';

export default function UnitStyleOne({ unites, contentType = 'unite', styleKey = 'styleOne'  }) {
  const [selectedElement, setSelectedElement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [positions, setPositions] = useState( {
    sectionName: { top: 0, left: 0 },
    subtitle: { top: 60, left: 0 },
    img: { 
      top: 160, 
      left: '60%',
      marginLeft: '20px',
      width: '45%'
    },
    unitContent: { 
      top: 120, 
      left: 0,
      width: '50%'
    }
  });

  // const initialPositions = {
  //   sectionName: { top: 0, left: 0 },
  //   subtitle: { top: 60, left: 0 },
  //   img: { 
  //     top: 160, 
  //     left: '60%',
  //     marginLeft: '20px',
  //     width: '45%'
  //   },
  //   unitContent: { 
  //     top: 120, 
  //     left: 0,
  //     width: '50%'
  //   }
  // };


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
    img: { 
      width: '400px', 
      height: 'auto', 
      borderRadius: '0px',
      position: 'absolute',
      left: '50%'
    },
    unitContent: {
      title: {
        color: '#358dcc',
        fontSize: '20px',
        fontWeight: '600',
      },
      description: {
        color: '#666',
        fontSize: '18px',
      }
    }
  });

  // const initialStyles = {
  //   sectionName: { 
  //     color: '#f59e0b', 
  //     fontSize: '20px', 
  //     fontFamily: 'inherit',
  //     fontWeight: '600',
  //   },
  //   subtitle: { 
  //     color: '#000', 
  //     fontSize: '38px', 
  //     fontFamily: 'inherit',
  //     fontWeight: '600',
  //   },
  //   img: { 
  //     width: '400px', 
  //     height: 'auto', 
  //     borderRadius: '0px',
  //     position: 'absolute',
  //     left: '50%'
  //   },
  //   unitContent: {
  //     title: {
  //       color: '#358dcc',
  //       fontSize: '20px',
  //       fontWeight: '600',
  //     },
  //     description: {
  //       color: '#666',
  //       fontSize: '18px',
  //     }
  //   }
  // };


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
      console.log(`Fetching preferences for entrepriseId: ${userEntreprise}`);
      const response = await axios.get(
        `http://localhost:5000/preferences/entreprise/${userEntreprise}/preferences`,
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
        unitContent: isValidPosition(fetchedPreferences.positions?.unitContent)
          ? fetchedPreferences.positions.unitContent
          : positions.unitContent,
        img: isValidPosition(fetchedPreferences.positions?.img)
          ? fetchedPreferences.positions.img
          : positions.img,
      };

      const newStyles = {
        sectionName: isValidStyle(fetchedPreferences.styles?.sectionName)
          ? fetchedPreferences.styles.sectionName
          : styles.sectionName,
        subtitle: isValidStyle(fetchedPreferences.styles?.subtitle)
          ? fetchedPreferences.styles.subtitle
          : styles.subtitle,
        unitContent: isValidStyle(fetchedPreferences.styles?.unitContent)
          ? fetchedPreferences.styles.unitContent
          : styles.unitContent,
        img: isValidStyle(fetchedPreferences.styles?.img)
          ? fetchedPreferences.styles.img
          : styles.img,
      };

      const newTexts = {
        sectionName: isValidText(fetchedPreferences.texts?.sectionName)
          ? fetchedPreferences.texts.sectionName
          : texts.sectionName,
        subtitle: isValidText(fetchedPreferences.texts?.subtitle)
          ? fetchedPreferences.texts.subtitle
          : texts.subtitle,
      };

      console.log('Applying positions:', newPositions);
      console.log('Applying styles:', newStyles);
      console.log('Applying texts:', newTexts);
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
    console.log(`Position change triggered for ${element}:`, newPosition);
    if (isValidPosition(newPosition)) {
      setPositions((prev) => {
        const newPositions = { ...prev, [element]: newPosition };
        console.log(`Updated positions state:`, newPositions);
        return newPositions;
      });
    } else {
      console.warn(`Invalid position for ${element}:`, newPosition);
    }
  };

  const handleStyleChange = (element, newStyles) => {
    console.log(`Style change triggered for ${element}:`, newStyles);
    if (isValidStyle(newStyles)) {
      setStyles((prev) => {
        const newStylesState = { ...prev, [element]: newStyles };
        console.log(`Updated styles state:`, newStylesState);
        return newStylesState;
      });
    } else {
      console.warn(`Invalid styles for ${element}:`, newStyles);
    }
  };

  const handleTextChange = (element, newText) => {
    console.log(`Text change triggered for ${element}:`, newText);
    if (isValidText(newText)) {
      setTexts((prev) => {
        const newTexts = { ...prev, [element]: newText };
        console.log(`Updated texts state:`, newTexts);
        return newTexts;
      });
    } else {
      console.warn(`Invalid text for ${element}:`, newText);
    }
  };

  const handleUnitStyleChange = (unitId, newStyles) => {
    console.log(`Unit style change triggered for unitId ${unitId}:`, newStyles);
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
    console.log('saveAllChanges called');
    console.log('userEntreprise:', userEntreprise);
    console.log('positions:', positions);
    console.log('styles:', styles);
    console.log('texts:', texts);
    console.log('pendingUnitStyles:', pendingUnitStyles);

    if (!userEntreprise) {
      toast.error("ID de l'entreprise manquant");
      console.error('No userEntreprise provided');
      return;
    }

    if (
      !isValidPosition(positions.sectionName) ||
      !isValidPosition(positions.subtitle) ||
      !isValidPosition(positions.unitContent) ||
      !isValidStyle(styles.sectionName) ||
      !isValidStyle(styles.subtitle) ||
      !isValidStyle(styles.unitContent) ||
      !isValidText(texts.sectionName) ||
      !isValidText(texts.subtitle)
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

      if (Object.keys(pendingUnitStyles).length > 0) {
        console.log('Saving Unit styles');
        for (const [unitId, unitStyles] of Object.entries(pendingUnitStyles)) {
          if (unitId && unitId !== 'undefined' && isValidStyle(unitStyles)) {
            console.log(`Sending PATCH to http://localhost:5000/contenus/Unite/${unitId}/styles`);
            const unitResponse = await axios.patch(
              `http://localhost:5000/contenus/Unite/${unitId}/styles`,
              unitStyles,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            console.log(`Unit styles saved for ${unitId}:`, unitResponse.data);
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

  if (error) {
    return <div>Erreur: {error}</div>;
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
      
      <EditorUnitContent
        unites={unites}
        initialPosition={positions.unitContent}
        initialStyles={styles.unitContent}
        onSelect={setSelectedElement}
        onPositionChange={(newPos) => handlePositionChange('unitContent', newPos)} // ✅ Ajouté
        onStyleChange={(newStyles) => {
          setStyles(prev => ({ ...prev, unitContent: newStyles }));
        }}

      />

      <div className="image-content">
        <EditorImage
          initialPosition={positions.img}
          initialStyles={styles.img}
          src={company}
          alt="FAQ illustration"
          onSelect={setSelectedElement}
        />
      </div>

            <button onClick={saveAllChanges}>Enregistrer les modifications</button>

    </div>
  );
}