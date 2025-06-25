import React, { useState, useEffect } from 'react';
import '../../website/faqs/FaqSection.css';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

export default function FaqStyleTwoDisplay({ contentType = 'faq', styleKey = 'styleTwo', entrepriseId }) {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userEntreprise, setUserEntreprise] = useState(null);
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

  // Validation des positions, styles et textes
  const isValidPosition = (pos) => pos && typeof pos === 'object' && typeof pos.top === 'number' && typeof pos.left === 'number';
  const isValidStyle = (style) => style && typeof style === 'object' && Object.keys(style).length > 0;
  const isValidText = (text) => typeof text === 'string' && text.trim().length > 0;

  // Récupération du token et décodage pour obtenir l'ID de l'utilisateur
  // const token = localStorage.getItem('token');
  // let userId = null;
  // if (token) {
  //   try {
  //     const decodedToken = jwtDecode(token);
  //     userId = decodedToken?.sub;
  //   } catch (error) {
  //     console.error('Error decoding token:', error);
  //     setError('Erreur lors du décodage du token.');
  //     setLoading(false);
  //   }
  // } else {
  //   console.error('Token is missing from localStorage.');
  //   setError('Token manquant. Veuillez vous connecter.');
  //   setLoading(false);
  // }

  // Récupérer l'entreprise de l'utilisateur connecté
  // const fetchUserEntreprise = async () => {
  //   if (!token || !userId) {
  //     console.error('Token or User ID is missing');
  //     setError('Token ou ID utilisateur manquant.');
  //     setLoading(false);
  //     return;
  //   }

  //   try {
  //     const config = {
  //       headers: { Authorization: `Bearer ${token}` },
  //     };
  //     const userResponse = await axios.get(`http://localhost:5000/auth/user/${userId}`, config);
  //     const user = userResponse.data;
  //     if (!user.entreprise) {
  //       console.error("User's company (entreprise) is missing");
  //       setError("Entreprise de l'utilisateur non trouvée.");
  //       setLoading(false);
  //       return;
  //     }
  //     setUserEntreprise(user.entreprise);
  //   } catch (error) {
  //     console.error('Error fetching user data:', error);
  //     setError('Erreur lors de la récupération des données utilisateur.');
  //     setLoading(false);
  //   }
  // };

  // Récupérer les FAQs associées à l'entreprise
  const fetchFaqs = async () => {
    if (!entrepriseId) {
      console.error('Token, User ID, or User Entreprise is missing');
      setError('Données manquantes pour récupérer les FAQs.');
      setLoading(false);
      return;
    }

    try {
      // const config = {
      //   headers: { Authorization: `Bearer ${token}` },
      // };
      const response = await axios.get(
        `http://localhost:5000/contenus/FAQ/entreprise/${entrepriseId}`
      );
      const faqData = Array.isArray(response.data) ? response.data : [];
      const publishedFaqs = faqData
        .filter(faq => faq.isPublished)
        .map(faq => ({
          _id: faq._id,
          question: faq.question,
          answer: faq.reponse,
          styles: {
            card: faq.styles?.card || {
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              padding: '15px',
              borderRadius: '8px',
              marginBottom: '15px',
            },
            question: faq.styles?.question || {
              color: '#1a202c',
              fontSize: '18px',
              fontFamily: 'Arial',
              fontWeight: 'normal',
              fontStyle: 'normal',
              textDecoration: 'none',
              margin: '0 0 10px',
            },
            answer: faq.styles?.answer || {
              color: '#4a5568',
              fontSize: '1rem',
              fontFamily: 'Arial',
              fontWeight: 'normal',
              fontStyle: 'normal',
              textDecoration: 'none',
              lineHeight: 1.6,
              margin: '0',
              backgroundColor: '#ffffff',
            },
          },
        }));
      console.log('Fetched FAQs with styles:', publishedFaqs);
      setFaqs(publishedFaqs);
    } catch (error) {
      console.error('Error fetching FAQs by entreprise:', error);
      setError('Erreur lors de la récupération des FAQs.');
      setFaqs([]);
    }
  };

  // Récupérer les préférences de l'entreprise
  const fetchPreferences = async () => {
    if (!entrepriseId) {
      console.log('userEntreprise not yet available');
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:5000/preferences/entreprise/${entrepriseId}/preferences`
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

      console.log('Applying positions in Display Mode:', newPositions);
      console.log('Applying styles in Display Mode:', newStyles);
      console.log('Applying texts in Display Mode:', newTexts);
      setPositions(newPositions);
      setStyles(newStyles);
      setTexts(newTexts);
    } catch (error) {
      console.error('Error fetching preferences:', error);
      setError('Erreur lors du chargement des préférences');
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   if (token && userId) {
  //     fetchUserEntreprise();
  //   }
  // }, []);

  useEffect(() => {
    if (entrepriseId) {
      fetchFaqs();
      fetchPreferences();
    }
  }, [entrepriseId]);

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>Erreur : {error}</div>;
  }

  return (
    <div
      className="faq-style-two-container"
      style={{
        position: 'relative',
        
      }}
    >
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
          top: `${positions.subtitle.top}px`, // Revenir à la valeur brute
          left: `${positions.subtitle.left}px`,
          margin: 0,
          lineHeight: '1.5',
          marginTop: '20px', // Ajuster la distance manuellement
        }}
      >
        {texts.subtitle}
      </p>
      <div
        className="faq-grid style-two"
        style={{
          position: 'absolute',
          top: `${positions.faqGrid.top}px`,
          left: `${positions.faqGrid.left}px`,
          width: `${styles.faqGrid.width}px`,
          minHeight: `${styles.faqGrid.minHeight}px`,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          overflow: 'visible',
        }}
      >
        {Array.isArray(faqs) && faqs.length > 0 ? (
          faqs.map((faq) => (
            <div
              key={faq._id}
              className="faq-card"
              style={{
                ...faq.styles.card,
                marginBottom: '15px',
                padding: '15px',
                borderRadius: '8px',
              }}
            >
              <h4 style={{...faq.styles.question, margin: '0 0 10px'}}>{faq.question}</h4>
              <p style={{ ...faq.styles.answer, backgroundColor: 'transparent',
                padding: '4px',
                  outline: 'none',
                  resize: 'none',
                  minHeight: '60px',
               }}>{faq.answer}</p>
            </div>
          ))
        ) : (
          <p>Aucune FAQ disponible.</p>
        )}
      </div>
    </div>
  );
}