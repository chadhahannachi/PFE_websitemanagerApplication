import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsUpDownLeftRight, faTimes, faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_URL = 'http://localhost:5000/couleurs';

export default function EditorPartnerStyleOne({ 
  partenaires = [], 
  initialPosition = { top: 0, left: 0 }, 
  initialStyles = { card: {} }, 
  onSelect, 
  onPositionChange, 
  onStyleChange 
}) {
  const [position, setPosition] = useState(initialPosition);
  const [cardStyles, setCardStyles] = useState({
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
      ...initialStyles.card,
    },
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isEditingStyles, setIsEditingStyles] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const offset = useRef({ x: 0, y: 0 });

  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userEntreprise, setUserEntreprise] = useState(null);

  // Fetch user enterprise
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken?.sub;
        if (userId) {
          axios
            .get(`http://localhost:5000/auth/user/${userId}`, {
              headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
              setUserEntreprise(response.data.entreprise);
              setLoading(false);
            })
            .catch((err) => {
              console.error('Error fetching user data:', err);
              setError('Erreur lors de la récupération des données utilisateur.');
              setLoading(false);
            });
        } else {
          setError('ID utilisateur manquant.');
          setLoading(false);
        }
      } catch (err) {
        console.error('Error decoding token:', err);
        setError('Erreur lors du décodage du token.');
        setLoading(false);
      }
    } else {
      console.error('Token is missing from localStorage.');
      setError('Token manquant. Veuillez vous connecter.');
      setLoading(false);
    }
  }, []);

  // Fetch company colors
  useEffect(() => {
    if (userEntreprise) {
      axios
        .get(`${API_URL}/entreprise/${userEntreprise}/couleurs`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        .then((res) => {
          setColors(res.data);
        })
        .catch((err) => {
          console.error('Erreur lors de la récupération des couleurs:', err);
          setError('Erreur lors de la récupération des couleurs.');
        });
    }
  }, [userEntreprise]);

  // Update card styles when initialStyles change
  useEffect(() => {
    if (initialStyles && initialStyles.card) {
      setCardStyles(prev => ({
        card: {
          ...prev.card,
          ...initialStyles.card
        }
      }));
    }
  }, [initialStyles]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const handleMouseDown = (e) => {
    e.stopPropagation();
    offset.current = {
      x: e.clientX - position.left,
      y: e.clientY - position.top,
    };
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      requestAnimationFrame(() => {
        const newPosition = {
          top: e.clientY - offset.current.y,
          left: e.clientX - offset.current.x,
        };
        setPosition(newPosition);
        onPositionChange?.(newPosition);
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleStyleChange = (property, value) => {
    const newStyles = {
      card: {
        ...cardStyles.card,
        [property]: value
      }
    };
    
    setCardStyles(newStyles);
    onStyleChange?.(newStyles);
  };

  const handleElementClick = (e) => {
    e.stopPropagation();
    setIsSelected(true);
    onSelect?.('partnerGrid');
  };

  const renderControlButtons = () => {
    if (!isSelected) return null;
    return (
      <div
        className="element-controls"
        style={{
          position: 'absolute',
          top: position.top - 40,
          left: position.left - 30,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '5px',
          backgroundColor: '#fff',
          padding: '8px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          zIndex: 1000,
        }}
      >
        <button
          onMouseDown={handleMouseDown}
          style={{
            cursor: 'grab',
            fontSize: '16px',
            color: '#000',
            background: '#fff',
            border: '1px solid #ccc',
            borderRadius: '4px',
            padding: '4px',
          }}
        >
          <FontAwesomeIcon icon={faArrowsUpDownLeftRight} />
        </button>
        <button
          onClick={() => setIsEditingStyles(true)}
          style={{
            cursor: 'pointer',
            fontSize: '16px',
            color: '#000',
            background: '#fff',
            border: '1px solid #ccc',
            borderRadius: '4px',
            padding: '4px',
          }}
        >
          <FontAwesomeIcon icon={faWandMagicSparkles} />
        </button>
      </div>
    );
  };

  return (
    <div
      onClick={() => setIsSelected(false)}
      style={{ position: 'relative' }}
    >
      {renderControlButtons()}
      {isEditingStyles && (
        <div
          className="style-editor-panel visible"
          style={{
            position: 'absolute',
            top: `${Math.max(position.top, 0)}px`,
            left: `${Math.min(position.left + 300 + 20, window.innerWidth - 350)}px`,
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            zIndex: 100,
            maxWidth: '350px',
            maxHeight: '80vh',
            overflowY: 'auto',
          }}
        >
          <button
            onClick={() => setIsEditingStyles(false)}
            style={{
              position: 'absolute',
              top: '5px',
              right: '5px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px',
              color: '#999',
            }}
            aria-label="Close editor"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
          <div className="style-controls">
            <h3>Edit Partner Card Styles</h3>
            <div>
              <label>Background Color: </label>
              {loading ? (
                <span>Chargement des couleurs...</span>
              ) : error ? (
                <span style={{ color: 'red' }}>{error}</span>
              ) : colors.length === 0 ? (
                <span>Aucune couleur disponible.</span>
              ) : (
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px',
                    marginLeft: '10px',
                    marginTop: '5px',
                  }}
                >
                  {colors.map((c) => (
                    <div
                      key={c._id}
                      onClick={() => handleStyleChange('backgroundColor', c.couleur)}
                      style={{
                        width: '20px',
                        height: '20px',
                        backgroundColor: c.couleur,
                        border: cardStyles.card.backgroundColor === c.couleur ? '2px solid #000' : '1px solid #ccc',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        transition: 'border 0.2s ease',
                      }}
                      title={c.couleur}
                    />
                  ))}
                </div>
              )}
              <input
                type="color"
                value={cardStyles.card.backgroundColor}
                onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
              />
            </div>
            <div>
              <label>Border Radius: </label>
              <input
                type="range"
                min="0"
                max="50"
                value={parseInt(cardStyles.card.borderRadius)}
                onChange={(e) => handleStyleChange('borderRadius', `${e.target.value}px`)}
              />
            </div>
            <div>
              <label>Card Width: </label>
              <input
                type="number"
                min="100"
                value={parseInt(cardStyles.card.width)}
                onChange={(e) => handleStyleChange('width', `${e.target.value}px`)}
              />
            </div>
            <div>
              <label>Card Height: </label>
              <input
                type="number"
                min="50"
                value={parseInt(cardStyles.card.height)}
                onChange={(e) => handleStyleChange('height', `${e.target.value}px`)}
              />
            </div>
          </div>
        </div>
      )}
      <div
        className="slider-container"
        style={{
          position: 'absolute',
          top: position.top,
          left: position.left,
          width: '100%',
          overflow: 'hidden',
        }}
        onClick={handleElementClick}
      >
        <div className="slider-track">
          {[...partenaires, ...partenaires, ...partenaires].map((partenaire, index) => (
            <div 
              className="partner-logo-card" 
              key={`${partenaire._id}-${index}`}
              style={cardStyles.card}
            >
              <img
                src={partenaire.image}
                alt={partenaire.titre || "Logo partenaire"}
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/150";
                }}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain'
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}