
// import React, { useRef, useState } from 'react';
// import './FaqSection.css';
// import faqImage from '../../images/faq.webp'; // Importing the image
// import EditorText from '../aboutus/EditorText';

// export default function FaqStyleThree({ faqs }) {
//   const [activeIndex, setActiveIndex] = useState(null);

//   const toggleFaq = (index) => {
//     setActiveIndex(activeIndex === index ? null : index);
//   };

//   const initialPositions = {
//     h1: { top: 50, left: 50 },
//     h2: { top: 120, left: 50 },
//     p: { top: 180, left: 50 },
//     button: { top: 350, left: 50 },
//     img: { top: 100, left: 500 },
//   };

//   const initialStyles = {
//     h1: { color: '#000000', fontSize: '2rem', fontFamily: 'Arial' },
//     h2: { color: '#333333', fontSize: '1.5rem', fontFamily: 'Arial' },
//     p: { color: '#666666', fontSize: '1rem', fontFamily: 'Arial' },
//     button: { color: '#ffffff', backgroundColor: '#000000', fontSize: '1rem', fontFamily: 'Arial', borderRadius: '0px', hoverColor: '#ff0000' },
//     img: { width: 200, height: 200, borderRadius: '0px' },

//   };

//   const [positions, setPositions] = useState(initialPositions);
//   const [imgSize, setImgSize] = useState({ width: 200, height: 200 });
//   const [selectedElement, setSelectedElement] = useState(null);
//   const [resizing, setResizing] = useState(null);
//   const offset = useRef({ x: 0, y: 0 });

//   return (
//     <div className="faq-style-three-container">
//       <div className="faq-image-wrapper">
//         <img src={faqImage} alt="FAQ illustration" className="faq-image" />
//       </div>
//       <div className="faq-style-three-wrapper">

//       {/* <EditorText
//           elementType="h2"
//           initialPosition={initialPositions.h1}
//           initialStyles={initialStyles.h1}
//           onSelect={setSelectedElement}
//         >
//           Frequently asked questions
//         </EditorText> */}

//         <h2 className="faq-title">Frequently asked questions</h2>
//         <p className="faq-subtitle">Lorem ipsum est,en imptimerie Lorem ipsum est,en imptimerie</p> 

//         {/* <EditorText
//           elementType="p"
//           initialPosition={initialPositions.p}
//           initialStyles={initialStyles.p}
//           onSelect={setSelectedElement}
//         >
//           Lorem ipsum est,en imptimerie Lorem ipsum est,en imptimerie
//         </EditorText> */}

//         <div className="faq-list">
//           {faqs.map((faq, index) => (
//             <div key={index} className={`faq-item ${activeIndex === index ? 'active' : ''}`}>
//               <button
//                 className="faq-question-btn"
//                 onClick={() => toggleFaq(index)}
//               >
//                 {faq.question}
//                 <span className="faq-toggle">{activeIndex === index ? '-' : '+'}</span>
//               </button>
//               <div className="faq-answer">
//                 <p>{faq.answer}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }



import React, { useState, useEffect } from 'react';
import './FaqSection.css';
import faqImage from '../../images/faq.webp';
import EditorText from '../aboutus/EditorText';
import EditorImage from '../aboutus/EditorImage';
import EditorFaqList from './EditorFaqList';
import axios from 'axios';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';

export default function FaqStyleThree({ faqs, contentType = 'faq', styleKey = 'styleThree' }) {
  const [selectedElement, setSelectedElement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [positions, setPositions] = useState({
    sectionName: { top: 0, left: 700 },
    subtitle: { top: 60, left: 700 },
    img: { top: 20, left: 0 },
    faqList: { top: 140, left: 700 },
  });
  const [styles, setStyles] = useState({
    sectionName: { color: '#333333', fontSize: '2rem', fontFamily: 'Arial', width: '600px' },
    subtitle: {
      color: '#666666',
      fontSize: '1rem',
      fontFamily: 'Arial',
      marginBottom: '40px',
      width: '600px',
    },
    img: {
      width: 500,
      height: 'auto',
      borderRadius: '0px',
    },
    faqList: {
      width: '600px',
      height: '400px',
      button: {
        color: '#ffffff',
        backgroundColor: '#f59e0b',
        fontSize: '0.9375rem',
        fontFamily: 'Arial',
        borderRadius: '10px',
        hoverColor: '#d97706',
      },
      answer: {
        backgroundColor: '#f59e0b',
        color: '#ffffff',
        fontSize: '15px',
        fontFamily: 'Arial',
      },
    },
  });
  const [texts, setTexts] = useState({
    sectionName: 'Frequently asked questions',
    subtitle: 'Lorem ipsum est,en imptimerie Lorem ipsum est,en imptimerie',
  });
  const [pendingFaqStyles, setPendingFaqStyles] = useState({});
  const [userEntreprise, setUserEntreprise] = useState(null);
  const [imageFile, setImageFile] = useState(null); // Ajout de l'état pour l'image
  // Validation functions
  const isValidPosition = (pos) => pos && typeof pos === 'object' && typeof pos.top === 'number' && typeof pos.left === 'number';
  const isValidStyle = (style) => style && typeof style === 'object' && Object.keys(style).length > 0;
  const isValidText = (text) => typeof text === 'string' && text.trim().length > 0;

  // Decode JWT token
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

  // Fetch user's enterprise
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
        img: isValidPosition(fetchedPreferences.positions?.img)
          ? fetchedPreferences.positions.img
          : positions.img,
        faqList: isValidPosition(fetchedPreferences.positions?.faqList)
          ? fetchedPreferences.positions.faqList
          : positions.faqList,
      };

      const newStyles = {
        sectionName: isValidStyle(fetchedPreferences.styles?.sectionName)
          ? fetchedPreferences.styles.sectionName
          : styles.sectionName,
        subtitle: isValidStyle(fetchedPreferences.styles?.subtitle)
          ? fetchedPreferences.styles.subtitle
          : styles.subtitle,
        img: isValidStyle(fetchedPreferences.styles?.img)
          ? fetchedPreferences.styles.img
          : styles.img,
        faqList: isValidStyle(fetchedPreferences.styles?.faqList)
          ? fetchedPreferences.styles.faqList
          : styles.faqList,
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

  // Handlers for position, style, and text changes
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

  // const handleFaqStyleChange = (faqId, newStyles) => {
  //   console.log(`FAQ style change triggered for faqId ${faqId}:`, newStyles);
  //   if (!faqId || faqId === 'undefined') {
  //     console.warn(`Invalid faqId: ${faqId}`);
  //     return;
  //   }
  //   if (isValidStyle(newStyles)) {
  //     setPendingFaqStyles((prev) => ({
  //       ...prev,
  //       [faqId]: newStyles,
  //     }));
  //   } else {
  //     console.warn(`Invalid FAQ styles for faqId ${faqId}:`, newStyles);
  //   }
  // };


  const handleFaqStyleChange = (faqId, newStyles) => {
  if (!faqId || faqId === 'undefined') {
    console.warn(`Invalid faqId: ${faqId}`);
    return;
  }
  if (isValidStyle(newStyles)) {
    setPendingFaqStyles((prev) => ({
      ...prev,
      [faqId]: newStyles,
    }));
    setStyles((prev) => ({
      ...prev,
      faqList: {
        ...prev.faqList,
        button: newStyles.button || prev.faqList.button,
        answer: newStyles.answer || prev.faqList.answer,
      },
    }));
  }
};

  // Save all changes to the backend
  // const saveAllChanges = async () => {
  //   console.log('saveAllChanges called');
  //   console.log('userEntreprise:', userEntreprise);
  //   console.log('positions:', positions);
  //   console.log('styles:', styles);
  //   console.log('texts:', texts);
  //   console.log('pendingFaqStyles:', pendingFaqStyles);

  //   if (!userEntreprise) {
  //     toast.error("ID de l'entreprise manquant");
  //     console.error('No userEntreprise provided');
  //     return;
  //   }

  //   if (
  //     !isValidPosition(positions.sectionName) ||
  //     !isValidPosition(positions.subtitle) ||
  //     !isValidPosition(positions.img) ||
  //     !isValidPosition(positions.faqList) ||
  //     !isValidStyle(styles.sectionName) ||
  //     !isValidStyle(styles.subtitle) ||
  //     !isValidStyle(styles.img) ||
  //     !isValidStyle(styles.faqList) ||
  //     !isValidText(texts.sectionName) ||
  //     !isValidText(texts.subtitle)
  //   ) {
  //     console.error('Invalid positions, styles, or texts:', { positions, styles, texts });
  //     toast.error('Données de position, style ou texte invalides');
  //     return;
  //   }

  //   try {
  //     console.log('Sending POST to http://localhost:5000/preferences/entreprise');
  //     const preferencesResponse = await axios.post(
  //       'http://localhost:5000/preferences/entreprise',
  //       {
  //         entreprise: userEntreprise,
  //         preferences: {
  //           [contentType]: {
  //             [styleKey]: {
  //               positions,
  //               styles,
  //               texts,
  //             },
  //           },
  //         },
  //       },
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     );
  //     console.log('Preferences saved:', preferencesResponse.data);

  //     if (Object.keys(pendingFaqStyles).length > 0) {
  //       console.log('Saving FAQ styles');
  //       for (const [faqId, faqStyles] of Object.entries(pendingFaqStyles)) {
  //         if (faqId && faqId !== 'undefined' && isValidStyle(faqStyles)) {
  //           console.log(`Sending PATCH to http://localhost:5000/contenus/FAQ/${faqId}/styles`);
  //           const faqResponse = await axios.patch(
  //             `http://localhost:5000/contenus/FAQ/${faqId}/styles`,
  //             faqStyles,
  //             {
  //               headers: { Authorization: `Bearer ${token}` },
  //             }
  //           );
  //           console.log(`FAQ styles saved for ${faqId}:`, faqResponse.data);
  //         } else {
  //           console.warn(`Skipping invalid faqId or styles: ${faqId}`, faqStyles);
  //         }
  //       }
  //     } else {
  //       console.log('No FAQ styles to save');
  //     }

  //     setPendingFaqStyles({});
  //     toast.success('Modifications sauvegardées avec succès');
  //   } catch (error) {
  //     console.error('Error saving changes:', error);
  //     if (error.response) {
  //       console.error('Response error:', error.response.data);
  //       toast.error(`Erreur: ${error.response.data.message || 'Échec de la sauvegarde'}`);
  //     } else {
  //       toast.error('Erreur réseau ou serveur indisponible');
  //     }
  //   }
  // };



  const handleImageChange = (file) => {
    setImageFile(file);
  };


  const saveAllChanges = async () => {
  if (!userEntreprise) {
    toast.error("ID de l'entreprise manquant");
    return;
  }

  try {
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

    if (Object.keys(pendingFaqStyles).length > 0) {
      for (const [faqId, faqStyles] of Object.entries(pendingFaqStyles)) {
        if (faqId && faqId !== 'undefined' && isValidStyle(faqStyles)) {
          await axios.patch(
            `http://localhost:5000/contenus/FAQ/${faqId}/styles`,
            faqStyles,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
        }
      }
    }

    if (imageFile) {
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('entreprise', userEntreprise);
      formData.append('contentType', contentType);
      formData.append('styleKey', styleKey);

      const imageResponse = await axios.post(
        'http://localhost:5000/upload/image',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setStyles((prev) => ({
        ...prev,
        img: { ...prev.img, src: imageResponse.data.imageUrl },
      }));
    }

    setPendingFaqStyles({});
    toast.success('Modifications sauvegardées avec succès');
  } catch (error) {
    console.error('Error saving changes:', error);
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
    <div className="faq-style-three-container">
      <div className="faq-content-wrapper">
        <div className="faq-text-content">
          <EditorText
            elementType="sectionName"
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
            elementType="subtitle"
            initialPosition={positions.subtitle}
            initialStyles={styles.subtitle}
            onSelect={setSelectedElement}
            onPositionChange={(newPosition) => handlePositionChange('subtitle', newPosition)}
            onStyleChange={(newStyles) => handleStyleChange('subtitle', newStyles)}
            onTextChange={(newText) => handleTextChange('subtitle', newText)}
          >
            {texts.subtitle}
          </EditorText>

          <EditorFaqList
            faqs={faqs}
            initialPosition={positions.faqList}
            initialStyles={styles.faqList}
            onSelect={setSelectedElement}
            onPositionChange={(newPosition) => handlePositionChange('faqList', newPosition)}
            onStyleChange={handleFaqStyleChange}
          />
        </div>

        <div className="faq-image-wrapper">
          <EditorImage
            initialPosition={positions.img}
            initialStyles={styles.img}
            src={faqImage}
            alt="FAQ illustration"
            onSelect={setSelectedElement}
            onPositionChange={(newPosition) => handlePositionChange('img', newPosition)}
            onStyleChange={(newStyles) => handleStyleChange('img', newStyles)}
            onImageChange={handleImageChange}
          />
        </div>
      </div>
      <button onClick={saveAllChanges}>Enregistrer les modifications</button>
    </div>
  );
}


// import React, { useState } from 'react';
// import './FaqSection.css';
// import faqImage from '../../images/faq.webp';
// import EditorText from '../aboutus/EditorText';
// import EditorImage from '../aboutus/EditorImage';

// export default function FaqStyleThree({ faqs }) {
//   const [activeIndex, setActiveIndex] = useState(null);
//   const [selectedElement, setSelectedElement] = useState(null);

//   const toggleFaq = (index) => {
//     setActiveIndex(activeIndex === index ? null : index);
//   };

//   const initialPositions = {
//     h1: { top: 50, left: 50 },
//     sectionName: { top: 120, left: 50 },
//     subtitle: { top: 180, left: 50 },
//     img: { top: 100, left: 500 },
//   };

//   const initialStyles = {
//     h1: { color: '#000000', fontSize: '2rem', fontFamily: 'Arial' },
//     sectionName: { color: '#333333', fontSize: '1.5rem', fontFamily: 'Arial' },
//     subtitle: { color: '#666666', fontSize: '1rem', fontFamily: 'Arial' },
//     img: { width: 200, height: 200, borderRadius: '0px' },
//     button: {
//       color: '#ffffff',
//       backgroundColor: '#f59e0b',
//       fontSize: '0.9375rem',
//       fontFamily: 'Arial',
//       borderRadius: '10px',
//       hoverColor: '#d97706',
//     },
//   };

//   return (
//     <div className="faq-style-three-container">
//       <div className="faq-image-wrapper">
//         <EditorImage
//           initialPosition={initialPositions.img}
//           initialStyles={initialStyles.img}
//           src={faqImage}
//           alt="FAQ illustration"
//           onSelect={setSelectedElement}
//         />
//       </div>
//       <div className="faq-style-three-wrapper">
//         <EditorText
//           elementType="sectionName"
//           initialPosition={initialPositions.sectionName}
//           initialStyles={initialStyles.sectionName}
//           onSelect={setSelectedElement}
//         >
//           Frequently asked questions
//         </EditorText>
//         <EditorText
//           elementType="subtitle"
//           initialPosition={initialPositions.subtitle}
//           initialStyles={initialStyles.subtitle}
//           onSelect={setSelectedElement}
//         >
//           Lorem ipsum est,en imptimerie Lorem ipsum est,en imptimerie
//         </EditorText>
//         <div className="faq-list">
//           {faqs.map((faq, index) => (
//             <div key={index} className={`faq-item ${activeIndex === index ? 'active' : ''}`}>
              
//               <button
//                 className="faq-question-btn"
//                 onClick={() => toggleFaq(index)}
//               >
//                 {faq.question}
//                 <span className="faq-toggle">{activeIndex === index ? '-' : '+'}</span>
//               </button>
//               <div className="faq-answer">
//                 <p>{faq.answer}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }