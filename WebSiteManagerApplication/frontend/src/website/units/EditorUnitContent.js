import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsUpDownLeftRight, faTimes, faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import PropTypes from 'prop-types';

const API_URL = 'http://localhost:5000/couleurs';

export default function EditorUnitContent({ 
  unites, 
  initialPosition = { top: 0, left: 0 }, 
  initialStyles = {}, 
  onSelect, 
  onPositionChange, 
  onStyleChange 
}) {
  const [position, setPosition] = useState({
    top: initialPosition.top || 0,
    left: typeof initialPosition.left === 'number' ? initialPosition.left : 0,
  });

  // Utiliser unitData comme unique source de vérité pour les styles
  const [unitData, setUnitData] = useState(
    unites.map((unit) => ({
      ...unit,
      styles: unit.styles || {
        title: {
          color: initialStyles.title?.color || '#358dcc',
          fontSize: initialStyles.title?.fontSize || '20px',
          fontWeight: initialStyles.title?.fontWeight || '600',
        },
        description: {
          color: initialStyles.description?.color || '#666',
          fontSize: initialStyles.description?.fontSize || '18px',
        },
      },
      width: initialStyles.width || '45%',
    }))
  );

  const [isDragging, setIsDragging] = useState(false);
  const [isEditingStyles, setIsEditingStyles] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const offset = useRef({ x: 0, y: 0 });
  const pendingStyles = useRef({});
  
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
      const newPosition = {
        top: e.clientY - offset.current.y,
        left: e.clientX - offset.current.x,
      };
      setPosition(newPosition);
      if (onPositionChange) {
        onPositionChange(newPosition);
      }
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

  // Met à jour les styles de toutes les unités de unitData
  // const handleStyleChange = (property, value, subProperty) => {
  //   setUnitData((prevUnits) => {
  //     const newUnits = prevUnits.map((unit) => {
  //       const updatedStyles = {
  //         ...unit.styles,
  //         [subProperty]: {
  //           ...unit.styles[subProperty],
  //           [property]: value,
  //         },
  //       };
  //       if (unit._id) {
  //         onStyleChange?.(unit._id, updatedStyles);
  //       }
  //       return {
  //         ...unit,
  //         styles: updatedStyles,
  //       };
  //     });
  //     return newUnits;
  //   });
  // };
  const handleStyleChange = (property, value, subProperty) => {
  setUnitData((prevUnits) => {
    const newUnits = prevUnits.map((unit) => {
      let updatedStyles;
      let updatedWidth = unit.width;
      
      if (subProperty === 'width') {
        // Si c'est la largeur, on la met à jour directement
        updatedWidth = value;
        updatedStyles = { ...unit.styles };
      } else {
        // Sinon, on met à jour les styles normaux
        updatedStyles = {
          ...unit.styles,
          [subProperty]: {
            ...unit.styles[subProperty],
            [property]: value,
          },
        };
      }
      
      const unitId = unit._id || unit.id;
      if (unitId) {
        onStyleChange?.(unitId, { ...updatedStyles, width: updatedWidth });
      }
      
      return {
        ...unit,
        styles: updatedStyles,
        width: updatedWidth,
      };
    });
    return newUnits;
  });
};

  // Toggle pour le style gras, etc.
  const toggleTextStyle = (property, group, value, defaultValue) => {
    const currentValue = unitData[0]?.styles?.[group]?.[property] || defaultValue;
    handleStyleChange(property, currentValue === value ? defaultValue : value, group);
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

  // Récupérer les styles courants de la première unité pour le panneau d'édition
  const currentStyles = {
    title: unitData[0]?.styles?.title || { color: '#358dcc', fontSize: '20px', fontWeight: '600' },
    description: unitData[0]?.styles?.description || { color: '#666', fontSize: '18px' },
    width: unitData[0]?.width || '45%',
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
                        border: currentStyles.title.color === c.couleur ? '2px solid #000' : '1px solid #ccc',
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
                value={currentStyles.title.color}
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
                value={parseInt(currentStyles.title.fontSize)}
                onChange={(e) => handleStyleChange('fontSize', `${e.target.value}px`, 'title')}
              />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => toggleTextStyle('fontWeight', 'title', '700', 'normal')}
                style={{
                  padding: '5px 10px',
                  backgroundColor: currentStyles.title.fontWeight === '700' ? '#ccc' : '#fff',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                <strong>B</strong>
              </button>
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
                        border: currentStyles.description.color === c.couleur ? '2px solid #000' : '1px solid #ccc',
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
                value={currentStyles.description.color}
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
                value={parseInt(currentStyles.description.fontSize)}
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
                value={parseInt(currentStyles.width) || 45}
                onChange={(e) => handleStyleChange('width', `${e.target.value}%`, 'width')}
              />
              <span> {currentStyles.width || '45%'}</span>
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
          width: currentStyles.width || '45%',
          flex: 1,
          minWidth: '250px',
          cursor: 'pointer',
        }}
        onClick={handleElementClick}
      >
        <div>
          {unitData.length > 0 ? (
            unitData.map((unit, index) => (
              <div key={unit._id || index}>
                <h2 style={{
                  ...unit.styles.title,
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
                  ...unit.styles.description,
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

// EditorUnitContent.propTypes = {
//   unites: PropTypes.array.isRequired,
//   initialPosition: PropTypes.object,
//   initialStyles: PropTypes.object,
//   onSelect: PropTypes.func,
//   onPositionChange: PropTypes.func,
//   onStyleChange: PropTypes.func
// };