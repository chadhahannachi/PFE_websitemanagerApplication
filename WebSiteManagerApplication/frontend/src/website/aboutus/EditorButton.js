import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsUpDownLeftRight, faTimes, faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_URL = 'http://localhost:5000/couleurs';

export default function EditorButton({ initialPosition, initialStyles, children, onSelect }) {
  const [position, setPosition] = useState(initialPosition);
  const [styles, setStyles] = useState(initialStyles);
  const [isDragging, setIsDragging] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const offset = useRef({ x: 0, y: 0 });

  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userEntreprise, setUserEntreprise] = useState(null);

  useEffect(() => {
    // Ajouter les écouteurs globaux lorsqu'on commence à draguer
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      // Supprimer les écouteurs globaux lorsque le drag est terminé
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      // Nettoyer les écouteurs lors du démontage du composant
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
        setPosition({
          top: e.clientY - offset.current.y,
          left: e.clientX - offset.current.x,
        });
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleElementClick = (e) => {
    e.stopPropagation();
    setIsSelected(true);
    if (onSelect) onSelect('button');
  };

  const handleStyleChange = (property, value) => {
    setStyles((prev) => ({
      ...prev,
      [property]: value,
    }));
  };

  const renderControlButtons = () => {
    if (!isSelected) return null;

    return (
      <div
        className="element-controls"
        style={{
          position: 'absolute',
          top: position.top,
          left: position.left,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '5px',
          zIndex: 10,
        }}
      >
        <button
          onMouseDown={handleMouseDown}
          style={{ cursor: 'grab', fontSize: '20px', color: 'black' }}
        >
          <FontAwesomeIcon icon={faArrowsUpDownLeftRight} />
        </button>
        <button
          onClick={() => setIsEditing(true)}
          style={{ cursor: 'grab', fontSize: '20px', color: 'black' }}
        >
          <FontAwesomeIcon icon={faWandMagicSparkles} />
        </button>
      </div>
    );
  };

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


  return (
    <div
      onClick={() => setIsSelected(false)}
      style={{ position: 'relative' }}
    >
      {renderControlButtons()}
      {isEditing && (
        <div
          className="style-editor-panel visible"
          style={{
            position: 'absolute',
            top: `${position.top || 0}px`,
            left: `${(position.left || 0) + 300}px`,
          }}
        >
          <button
            onClick={() => setIsEditing(false)}
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
            <h3>Edit Button Style</h3>
            <div>
              <label>Text Color: </label>
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
                      onClick={() => handleStyleChange('color', c.couleur)}
                      style={{
                        width: '20px',
                        height: '20px',
                        backgroundColor: c.couleur,
                        border: styles.color === c.couleur ? '2px solid #000' : '1px solid #ccc',
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
                value={styles.color}
                onChange={(e) => handleStyleChange('color', e.target.value)}
              />
            </div>
            <div>
              <label>Font Size: </label>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.1"
                value={parseFloat(styles.fontSize)}
                onChange={(e) => handleStyleChange('fontSize', `${e.target.value}rem`)}
              />
            </div>
            <div>
              <label>Font Family: </label>
              <select
                value={styles.fontFamily}
                onChange={(e) => handleStyleChange('fontFamily', e.target.value)}
              >
                <option value="Arial" style={{ fontFamily: 'Arial' }}>Arial</option>
                <option value="Times New Roman" style={{ fontFamily: 'Times New Roman' }}>Times New Roman</option>
                <option value="Courier New" style={{ fontFamily: 'Courier New' }}>Courier New</option>
                <option value="Georgia" style={{ fontFamily: 'Georgia' }}>Georgia</option>
                <option value="Verdana" style={{ fontFamily: 'Verdana' }}>Verdana</option>
                <option value="Tahoma" style={{ fontFamily: 'Tahoma' }}>Tahoma</option>
                <option value="Trebuchet MS" style={{ fontFamily: 'Trebuchet MS' }}>Trebuchet MS</option>
                <option value="Bookman" style={{ fontFamily: 'Bookman' }}>Bookman</option>
                <option value="Comic Sans MS" style={{ fontFamily: 'Comic Sans MS' }}>Comic Sans MS</option>
                <option value="Impact" style={{ fontFamily: 'Impact' }}>Impact</option>
                <option value="Lucida Sans Unicode" style={{ fontFamily: 'Lucida Sans Unicode' }}>Lucida Sans Unicode</option>
                <option value="Geneva" style={{ fontFamily: 'Geneva' }}>Geneva</option>
                <option value="Lucida Console" style={{ fontFamily: 'Lucida Console' }}>Lucida Console</option>
                <option value="Lucida Bright" style={{ fontFamily: 'Lucida Bright' }}>Lucida Bright</option>
              </select>
            </div>
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
                        border: styles.backgroundColor === c.couleur ? '2px solid #000' : '1px solid #ccc',
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
                value={styles.backgroundColor}
                onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
              />
            </div>
            <div>
              <label>Border Radius: </label>
              <input
                type="range"
                min="0"
                max="50"
                step="1"
                value={parseInt(styles.borderRadius || 0)}
                onChange={(e) => handleStyleChange('borderRadius', `${e.target.value}px`)}
              />
            </div>
            <div>
              <label>Hover Color: </label>
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
                      onClick={() => handleStyleChange('hoverColor', c.couleur)}
                      style={{
                        width: '20px',
                        height: '20px',
                        backgroundColor: c.couleur,
                        border: styles.hoverColor === c.couleur ? '2px solid #000' : '1px solid #ccc',
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
                value={styles.hoverColor || '#000000'}
                onChange={(e) => handleStyleChange('hoverColor', e.target.value)}
              />
            </div>
          </div>
        </div>
      )}
      <button
        style={{
          ...styles,
          position: 'absolute',
          top: position.top,
          left: position.left,
          cursor: 'pointer',
          borderRadius: styles.borderRadius || '0px',
        }}
        onClick={handleElementClick}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = styles.hoverColor || '#000000';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = styles.backgroundColor || '#000000';
        }}
      >
        {children}
      </button>
    </div>
  );
}