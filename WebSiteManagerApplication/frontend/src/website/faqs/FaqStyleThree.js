import React, { useState, useEffect } from 'react';
import './FaqSection.css';
import faqImage from '../../images/faq.webp';
import EditorText from '../aboutus/EditorText';
import EditorImage from '../aboutus/EditorImage';
import EditorFaqList from './EditorFaqList';
import axios from 'axios';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import ReactDOM from 'react-dom';

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

export default function FaqStyleThree({ faqs: initialFaqs, contentType = 'faq', styleKey = 'styleThree' }) {
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
  const [faqs, setFaqs] = useState(initialFaqs); // New state for faqs
  const [pendingFaqStyles, setPendingFaqStyles] = useState({});
  const [userEntreprise, setUserEntreprise] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [pendingImageUrl, setPendingImageUrl] = useState(null);
  const [showImage, setShowImage] = useState(true);

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

      // console.log('Applying positions:', newPositions);
      // console.log('Applying styles:', newStyles);
      // console.log('Applying texts:', newTexts);
      setPositions(newPositions);
      setStyles(newStyles);
      setTexts(newTexts);
      // Ajout récupération showImage
      if (typeof fetchedPreferences.styles?.faqList?.showImage === 'boolean') {
        setShowImage(fetchedPreferences.styles.faqList.showImage);
      }
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

  // Initialize faqs with styles
  useEffect(() => {
    const updatedFaqs = initialFaqs.map((faq) => ({
      ...faq,
      styles: faq.styles || {
        button: styles.faqList.button,
        answer: styles.faqList.answer,
      },
    }));
    setFaqs(updatedFaqs);
  }, [initialFaqs]);

  // Handlers for position, style, and text changes
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

  // const handleFaqStyleChange = (faqId, newStyles) => {
  //   if (!faqId || faqId === 'undefined') {
  //     console.warn(`Invalid faqId: ${faqId}`);
  //     return;
  //   }
  //   if (isValidStyle(newStyles)) {
  //     // Update pendingFaqStyles for saving to backend
  //     setPendingFaqStyles((prev) => ({
  //       ...prev,
  //       [faqId]: newStyles,
  //     }));
  //     // Update local faqs state for immediate UI update
  //     setFaqs((prev) =>
  //       prev.map((faq) =>
  //         faq._id === faqId
  //           ? { ...faq, styles: newStyles }
  //           : faq
  //       )
  //     );
  //     // Update parent styles.faqList for consistency
  //     setStyles((prev) => ({
  //       ...prev,
  //       faqList: {
  //         ...prev.faqList,
  //         button: newStyles.button || prev.faqList.button,
  //         answer: newStyles.answer || prev.faqList.answer,
  //       },
  //     }));
  //   } else {
  //     console.warn(`Invalid styles for faqId ${faqId}:`, newStyles);
  //   }
  // };

  const handleFaqStyleChange = (faqId, newStyles) => {
    if (!isValidStyle(newStyles)) {
      console.warn(`Invalid styles for faqId ${faqId}:`, newStyles);
      return;
    }
  
    if (faqId) {
      setPendingFaqStyles((prev) => ({
        ...prev,
        [faqId]: newStyles,
      }));
      setFaqs((prev) =>
        prev.map((faq) =>
          faq._id === faqId ? { ...faq, styles: newStyles } : faq
        )
      );
    } else {
      setStyles((prev) => ({
        ...prev,
        faqList: {
          ...prev.faqList,
          width: newStyles.width || prev.faqList.width,
          height: newStyles.height || prev.faqList.height,
          button: newStyles.button || prev.faqList.button,
          answer: newStyles.answer || prev.faqList.answer,
        },
      }));
    }
  };
  

  const handleImageChange = (urlOrFile) => {
    // Si EditorImage renvoie une URL (Cloudinary), on la stocke
    if (typeof urlOrFile === 'string') {
      setPendingImageUrl(urlOrFile);
      setStyles((prev) => ({
        ...prev,
        img: { ...prev.img, src: urlOrFile },
      }));
    } else {
      setImageFile(urlOrFile);
    }
  };

  const saveAllChanges = async () => {
    if (!userEntreprise) {
      toast.error("ID de l'entreprise manquant");
      return;
    }
    try {
      // 1. Upload image si besoin
      let imageUrl = styles.img?.src;
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
        imageUrl = imageResponse.data.imageUrl;
        setStyles((prev) => ({
          ...prev,
          img: { ...prev.img, src: imageUrl },
        }));
      } else if (pendingImageUrl) {
        imageUrl = pendingImageUrl;
      }
      // 2. Save preferences avec la bonne image
      const preferencesResponse = await axios.post(
        'http://localhost:5000/preferences/entreprise',
        {
          entreprise: userEntreprise,
          preferences: {
            [contentType]: {
              [styleKey]: {
                positions,
                styles: {
                  ...styles,
                  faqList: {
                    ...styles.faqList,
                    showImage: showImage,
                  },
                  img: { ...styles.img, src: imageUrl },
                },
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

      setPendingFaqStyles({});
      setPendingImageUrl(null);
      setImageFile(null);
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
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
          }}>FAQ section</span> 
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
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
            <button
              onClick={() => setShowImage((prev) => !prev)}
              style={{
                padding: '8px 16px',
                backgroundColor: showImage ? '#4caf50' : '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                marginTop: '16px',
                fontSize: '16px',
                fontWeight: '500',
                transition: 'background-color 0.2s ease'
              }}
            >
              {showImage ? 'With image' : 'No image'}
            </button>
          </div>
        </div>

        <div className="faq-section">
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

            {showImage && (
              <div className="faq-image-wrapper">
                <EditorImage
                  initialPosition={positions.img}
                  initialStyles={styles.img}
                  src={styles.img?.src || faqImage}
                  alt="FAQ illustration"
                  onSelect={setSelectedElement}
                  onPositionChange={(newPosition) => handlePositionChange('img', newPosition)}
                  onStyleChange={(newStyles) => handleStyleChange('img', newStyles)}
                  onImageChange={handleImageChange}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}