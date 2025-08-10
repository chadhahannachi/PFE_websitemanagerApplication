import React, { useState, useEffect } from 'react';
import './OurPartners.css';
import EditorText from '../aboutus/EditorText';
import EditorPartnerStyleOne from './EditorPartnerStyleOne';
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

export default function PartnerStyleOne({ partenaires }) {
  const [selectedElement, setSelectedElement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const [positions, setPositions] = useState({
    partnersTitle: { top: 0, left: 0 },
    partnersSubtitle: { top: 50, left: 0 },
    partnerGrid: { top: 100, left: 0 },
  });
  const [styles, setStyles] = useState({
    partnersTitle: {
      color: '#000',
      fontSize: '28px',
      fontFamily: 'Arial',
      fontWeight: '700',
      width: '100%',
      maxWidth: '600px',
      textAlign: 'center',
      marginBottom: '0px',
    },
    partnersSubtitle: {
      color: '#000',
      fontSize: '18px',
      fontFamily: 'Arial',
      fontWeight: '400',
      textAlign: 'center',
      marginBottom: '0px',
    },
  });
  const [texts, setTexts] = useState({
    partnersTitle: 'Our Partners',
    partnersSubtitle: 'Pleasure to work with',
  });
  const [partnerCardsStyles, setPartnerCardsStyles] = useState({
    card: {
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      width: '150px',
      height: '100px',
      padding: '10px',
      margin: '0 10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
  const [userEntreprise, setUserEntreprise] = useState(null);

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
      const fetchedPreferences = response.data.preferences?.partners?.styleOne || {};

      setPositions({
        partnersTitle: fetchedPreferences.positions?.partnersTitle || positions.partnersTitle,
        partnersSubtitle: fetchedPreferences.positions?.partnersSubtitle || positions.partnersSubtitle,
        partnerGrid: fetchedPreferences.positions?.partnerGrid || positions.partnerGrid,
      });

      setStyles({
        partnersTitle: fetchedPreferences.styles?.partnersTitle || styles.partnersTitle,
        partnersSubtitle: fetchedPreferences.styles?.partnersSubtitle || styles.partnersSubtitle,
      });

      setTexts({
        partnersTitle: fetchedPreferences.texts?.partnersTitle || texts.partnersTitle,
        partnersSubtitle: fetchedPreferences.texts?.partnersSubtitle || texts.partnersSubtitle,
      });

      if (fetchedPreferences.partnerCards) {
        setPartnerCardsStyles(fetchedPreferences.partnerCards);
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

  const handlePositionChange = (element, newPosition) => {
    setPositions(prev => ({
      ...prev,
      [element]: newPosition,
    }));
  };

  const handleStyleChange = (element, newStyles) => {
    setStyles(prev => ({
      ...prev,
      [element]: newStyles,
    }));
  };

  const handleTextChange = (element, newText) => {
    setTexts(prev => ({
      ...prev,
      [element]: newText,
    }));
  };

  const handlePartnerCardsStyleChange = (newStyles) => {
    setPartnerCardsStyles(newStyles);
  };

  const saveAllChanges = async () => {
    if (!userEntreprise) {
      toast.error("ID de l'entreprise manquant");
      return;
    }

    try {
      const payload = {
        entreprise: userEntreprise,
        preferences: {
          partners: {
            styleOne: {
              positions,
              styles,
              texts,
              partnerCards: partnerCardsStyles,
            },
          },
        },
      };

      console.log('Saving with payload:', payload);

      const response = await axios.post(
        'http://localhost:5000/preferences/entreprise',
        payload,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          timeout: 5000
        }
      );

      if (response.data.success) {
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 3000);
        toast.success('Préférences enregistrées avec succès');
      } else {
        toast.warning('Enregistrement réussi mais le serveur a retourné un avertissement');
      }
    } catch (error) {
      console.error('Error saving changes:', {
        message: error.message,
        response: error.response?.data,
        config: error.config,
      });
      toast.error(`Erreur lors de la sauvegarde: ${error.response?.data?.message || error.message}`);
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>Erreur: {error}</div>;
  }

  return (
    <div style={{ backgroundColor: 'white', minHeight: '60vh', padding: '20px' }}>
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
        }}>Partners section</span> 
        
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

      <div className="partners-section">
        <div style={{ textAlign: 'left', maxWidth: 600, margin: '0 auto', width: '100%' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <EditorText
              elementType="h2"
              initialPosition={positions.partnersTitle}
              initialStyles={styles.partnersTitle}
              onSelect={setSelectedElement}
              onPositionChange={(newPosition) => handlePositionChange('partnersTitle', newPosition)}
              onStyleChange={(newStyles) => handleStyleChange('partnersTitle', newStyles)}
              onTextChange={(newText) => handleTextChange('partnersTitle', newText)}
            >
              {texts.partnersTitle}
            </EditorText>
          </div>
        </div>
        <div style={{ textAlign: 'left', maxWidth: 600, margin: '0 auto', width: '100%' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <EditorText
              elementType="p"
              initialPosition={positions.partnersSubtitle}
              initialStyles={styles.partnersSubtitle}
              onSelect={setSelectedElement}
              onPositionChange={(newPosition) => handlePositionChange('partnersSubtitle', newPosition)}
              onStyleChange={(newStyles) => handleStyleChange('partnersSubtitle', newStyles)}
              onTextChange={(newText) => handleTextChange('partnersSubtitle', newText)}
            >
              {texts.partnersSubtitle}
            </EditorText>
          </div>
        </div>
        <EditorPartnerStyleOne
          partenaires={partenaires}
          initialPosition={positions.partnerGrid}
          initialStyles={partnerCardsStyles}
          onSelect={setSelectedElement}
          onPositionChange={(newPosition) => handlePositionChange('partnerGrid', newPosition)}
          onStyleChange={handlePartnerCardsStyleChange}
        />
      </div>
    </div>
  );
}