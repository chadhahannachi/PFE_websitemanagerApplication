import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsUpDownLeftRight, faTimes, faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_URL = 'http://localhost:5000/couleurs';

export default function EditorUnitContent({ unites, initialPosition = { top: 0, left: 0 }, initialStyles = {}, onSelect, onStyleChange }) {
  const [position, setPosition] = useState({
    top: initialPosition.top || 0,
    left: typeof initialPosition.left === 'number' ? initialPosition.left : 0,
  });
  const [styles, setStyles] = useState({
    width: initialPosition.width || '45%',  // Ajout de la largeur
    title: {
      color: initialStyles.title?.color || '#358dcc',
      fontSize: initialStyles.title?.fontSize || '20px',
      fontFamily: initialStyles.title?.fontFamily || 'inherit',
      fontWeight: initialStyles.title?.fontWeight || '600',
    },
    description: {
      color: initialStyles.description?.color || '#666',
      fontSize: initialStyles.description?.fontSize || '18px',
      fontFamily: initialStyles.description?.fontFamily || 'inherit',
    }
  });
  const [unitData, setUnitData] = useState(unites);
  const [isDragging, setIsDragging] = useState(false);
  const [isEditingStyles, setIsEditingStyles] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const offset = useRef({ x: 0, y: 0 });

  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userEntreprise, setUserEntreprise] = useState(null);


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
    if (onSelect) onSelect('unitContent');
  };

  // const handleStyleChange = (property, value, group) => {
  //   if (group) {
  //     setStyles(prev => ({
  //       ...prev,
  //       [group]: {
  //         ...prev[group],
  //         [property]: value
  //       }
  //     }));
  //   } else {
  //     setStyles(prev => ({
  //       ...prev,
  //       [property]: value
  //     }));
  //   }
  // };

  const handleStyleChange = (property, value, group) => {
  const newStyles = { ...styles };
  if (group) newStyles[group][property] = value;
  else newStyles[property] = value;

  setStyles(newStyles);
  if (onStyleChange) onStyleChange(newStyles); 
};

  const renderControlButtons = () => {
    if (!isSelected) return null;

    return (
      <div
        className="element-controls"
        style={{
          position: 'absolute',
          top: position.top - 40,
          left: position.left,
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
      {isEditingStyles && (
        <div
          className="style-editor-panel visible"
          style={{
            position: 'absolute',
            top: `${position.top || 0}px`,
            left: `${(position.left || 0) + 300}px`,
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            zIndex: 100,
            width: '300px',
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
            <h3>Edit Unit Content Style</h3>
            
            <h4>Title Styles</h4>
            <div>
              <label>Title Color: </label>
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
                      onClick={() => handleStyleChange('color', c.couleur, 'title')}
                      style={{
                        width: '20px',
                        height: '20px',
                        backgroundColor: c.couleur,
                        border: styles.title.color === c.couleur ? '2px solid #000' : '1px solid #ccc',
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
                value={styles.title.color}
                onChange={(e) => handleStyleChange('color', e.target.value, 'title')}
              />
            </div>
            <div>
              <label>Title Font Size: </label>
              <input
                type="range"
                min="10"
                max="50"
                step="1"
                value={parseInt(styles.title.fontSize)}
                onChange={(e) => handleStyleChange('fontSize', `${e.target.value}px`, 'title')}
              />
            </div>
            <div>
              <label>Title Font Weight: </label>
              <select
                value={styles.title.fontWeight}
                onChange={(e) => handleStyleChange('fontWeight', e.target.value, 'title')}
              >
                <option value="400">Normal</option>
                <option value="600">Semi-bold</option>
                <option value="700">Bold</option>
              </select>
            </div>

            <h4>Description Styles</h4>
            <div>
              <label>Description Color: </label>
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
                      onClick={() => handleStyleChange('color', c.couleur, 'description')}
                      style={{
                        width: '20px',
                        height: '20px',
                        backgroundColor: c.couleur,
                        border: styles.description.color === c.couleur ? '2px solid #000' : '1px solid #ccc',
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
                value={styles.description.color}
                onChange={(e) => handleStyleChange('color', e.target.value, 'description')}
              />
            </div>
            <div>
              <label>Description Font Size: </label>
              <input
                type="range"
                min="10"
                max="30"
                step="1"
                value={parseInt(styles.description.fontSize)}
                onChange={(e) => handleStyleChange('fontSize', `${e.target.value}px`, 'description')}
              />
            </div>

            <div>
  <label>Content Width: </label>
  <input
    type="range"
    min="20"
    max="80"
    step="5"
    value={parseInt(styles.width)}
    onChange={(e) => handleStyleChange('width', `${e.target.value}%`)}
  />
  <span> {styles.width}</span>
</div>

          </div>
        </div>
      )}
      <div
  className="text-content"
  style={{
    position: 'absolute',
    top: position.top,
    left: position.left,
    width: styles.width,  // Utilisation de la largeur
    flex: 1,
    minWidth: '250px',
    cursor: 'pointer',
  }}
  onClick={handleElementClick}
>
        <div>
          {unitData.length > 0 ? (
            unitData.map((unit, index) => (
              <div key={index}>
                <h2 style={{
                  ...styles.title,
                  marginBottom: '20px',
                  padding: '2px 30px',
                }}>
                  {unit.image && (
                    <img
                      src={unit.image}
                      alt={unit.titre || "Image de l'unité"}
                      style={{
                        width: '40px',
                        height: '40px',
                        objectFit: 'cover',
                        marginRight: '8px',
                        verticalAlign: 'middle',
                      }}
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/40";
                      }}
                    />
                  )}
                  {unit.titre}
                </h2>
                
                <p style={{
                  ...styles.description,
                  marginBottom: '20px',
                  marginTop: '1px',
                  paddingLeft: '40px',
                }}>
                  {unit.description}
                </p>
              </div>
            ))
          ) : (
            <p>Aucune unité publiée pour le moment.</p>
          )}
        </div>
      </div>
    </div>
  );
}