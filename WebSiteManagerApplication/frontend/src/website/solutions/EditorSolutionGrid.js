import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsUpDownLeftRight, faTimes, faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_URL = 'http://localhost:5000/couleurs';

const EditorSolutionGrid = forwardRef(({ solutions = [], initialPosition = { top: 0, left: 0 }, initialStyles = { width: 1200, minHeight: 440 }, onSelect, onPositionChange, onUpdate, onStyleChange }, ref) => {
  const [position, setPosition] = useState({
    top: initialPosition.top || 0,
    left: initialPosition.left || 0,
  });
    const [gridStyles, setGridStyles] = useState({
    width: parseFloat(initialStyles.width) || 1200,
    minHeight: parseFloat(initialStyles.minHeight) || 440,
    gap: initialStyles.gap || '15px 20px',
  });
  const [cardStyles, setCardStyles] = useState({
    card: {
      backgroundColor: initialStyles.card?.backgroundColor || '#ffffff',
      hoverBackgroundColor: initialStyles.card?.hoverBackgroundColor || '#f8f9fa',
      borderRadius: initialStyles.card?.borderRadius || '8px',
      width: initialStyles.card?.width || 300,
      minHeight: initialStyles.card?.minHeight || 150,
    },
    number: {
      color: initialStyles.number?.color || '#333333',
      fontSize: initialStyles.number?.fontSize || '24px',
    },
    title: {
      color: initialStyles.title?.color || '#333333',
      fontSize: initialStyles.title?.fontSize || '18px',
      fontFamily: initialStyles.title?.fontFamily || 'Arial',
      textAlign: initialStyles.title?.textAlign || 'left',
    },
    description: {
      color: initialStyles.description?.color || '#666666',
      fontSize: initialStyles.description?.fontSize || '14px',
      fontFamily: initialStyles.description?.fontFamily || 'Arial',
      textAlign: initialStyles.description?.textAlign || 'left',
    },
  });
  const [solutionData, setSolutionData] = useState([]);
  const [pendingChanges, setPendingChanges] = useState({});
  const [isDragging, setIsDragging] = useState(false);
  const [isEditingStyles, setIsEditingStyles] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [resizing, setResizing] = useState(null);
  // const [editingSolutionIndex, setEditingSolutionIndex] = useState(null);
  // const [editingField, setEditingField] = useState(null);
  const [draggingElement, setDraggingElement] = useState(null);
  const offset = useRef({ x: 0, y: 0 });
  // const inputRef = useRef(null);
  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userEntreprise, setUserEntreprise] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const saveTimeoutRef = useRef(null);
  const pendingStyles = useRef({});

  // Exposer pendingStyles et gridStyles au composant parent
  useImperativeHandle(ref, () => ({
    pendingStyles,
    getGridStyles: () => ({
      gridStyles,
      cardStyles
    })
  }));

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

  // Fonction pour sauvegarder les styles dans la base de données avec debounce
  const saveSolutionStyles = (solutionId, styles) => {
    if (!solutionId || !userEntreprise) {
      console.warn('ID de solution ou entreprise manquant pour la sauvegarde');
      return;
    }

    // Annuler le timeout précédent s'il existe
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    setIsSaving(true);

    // Créer un nouveau timeout pour la sauvegarde
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        const token = localStorage.getItem('token');

        await axios.patch(
          `http://localhost:5000/contenus/Solution/${solutionId}/styles`,
          styles,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log('Styles sauvegardés avec succès pour la solution:', solutionId);
      } catch (error) {
        console.error('Erreur lors de la sauvegarde des styles:', error);
        setError('Erreur lors de la sauvegarde des styles');
      } finally {
        setIsSaving(false);
      }
    }, 1000); // Délai de 1 seconde
  };

  // Fonction pour sauvegarder le contenu d'une solution
  const saveSolutionContent = async (solutionId, field, value) => {
    if (!solutionId || !userEntreprise) {
      console.warn('ID de solution ou entreprise manquant pour la sauvegarde');
      return;
    }

    try {
      const token = localStorage.getItem('token');

      await axios.patch(
        `http://localhost:5000/contenus/Solution/${solutionId}`,
        { [field]: value },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log(`${field} sauvegardé avec succès pour la solution:`, solutionId);
    } catch (error) {
      console.error(`Erreur lors de la sauvegarde du ${field}:`, error);
      setError(`Erreur lors de la sauvegarde du ${field}`);
    }
  };

  useEffect(() => {
    console.log('EditorSolutionGrid received solutions:', solutions);
    console.log('Solutions with id:', solutions.filter(s => s.id).map(s => ({ id: s.id, title: s.title })));
    
    setSolutionData(solutions.map((solution) => ({
      ...solution,
      positions: {
        number: { top: 20, left: 20 },
        title: { top: 80, left: 20 },
        description: { top: 110, left: 20 },
      },
      styles: solution.styles || {
        card: {
          backgroundColor: cardStyles.card.backgroundColor,
          hoverBackgroundColor: cardStyles.card.hoverBackgroundColor,
          borderRadius: cardStyles.card.borderRadius,
        },
        number: {
          color: cardStyles.number.color,
          fontSize: cardStyles.number.fontSize,
        },
        title: {
          color: cardStyles.title.color,
          fontSize: cardStyles.title.fontSize,
          fontFamily: cardStyles.title.fontFamily,
          textAlign: cardStyles.title.textAlign,
        },
        description: {
          color: cardStyles.description.color,
          fontSize: cardStyles.description.fontSize,
          fontFamily: cardStyles.description.fontFamily,
          textAlign: cardStyles.description.textAlign,
        },
      },
    })));
  }, [solutions, cardStyles]);

  // Mettre à jour les styles quand initialStyles change
  useEffect(() => {
    if (initialStyles) {
      console.log('Updating grid styles from initialStyles:', initialStyles);
      
      // Mettre à jour gridStyles
      setGridStyles(prev => ({
        ...prev,
        width: parseFloat(initialStyles.width) || prev.width,
        minHeight: parseFloat(initialStyles.minHeight) || prev.minHeight,
        gap: initialStyles.gap || prev.gap,
      }));
      
      // Mettre à jour cardStyles
      setCardStyles(prev => ({
        ...prev,
        card: {
          ...prev.card,
          backgroundColor: initialStyles.card?.backgroundColor || prev.card.backgroundColor,
          hoverBackgroundColor: initialStyles.card?.hoverBackgroundColor || prev.card.hoverBackgroundColor,
          borderRadius: initialStyles.card?.borderRadius || prev.card.borderRadius,
          width: initialStyles.card?.width || prev.card.width,
          minHeight: initialStyles.card?.minHeight || prev.card.minHeight,
        },
        number: {
          ...prev.number,
          color: initialStyles.number?.color || prev.number.color,
          fontSize: initialStyles.number?.fontSize || prev.number.fontSize,
        },
        title: {
          ...prev.title,
          color: initialStyles.title?.color || prev.title.color,
          fontSize: initialStyles.title?.fontSize || prev.title.fontSize,
          fontFamily: initialStyles.title?.fontFamily || prev.title.fontFamily,
          textAlign: initialStyles.title?.textAlign || prev.title.textAlign,
        },
        description: {
          ...prev.description,
          color: initialStyles.description?.color || prev.description.color,
          fontSize: initialStyles.description?.fontSize || prev.description.fontSize,
          fontFamily: initialStyles.description?.fontFamily || prev.description.fontFamily,
          textAlign: initialStyles.description?.textAlign || prev.description.textAlign,
        },
      }));
    }
  }, [initialStyles]);

  useEffect(() => {
    if (isDragging || resizing || draggingElement) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      // Nettoyer le timeout de sauvegarde
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [isDragging, resizing, draggingElement]);

  // useEffect(() => {
  //   if (editingSolutionIndex !== null && inputRef.current) {
  //     inputRef.current.focus();
  //   }
  // }, [editingSolutionIndex, editingField]);

  const handleMouseDown = (e) => {
    e.stopPropagation();
    offset.current = {
      x: e.clientX - position.left,
      y: e.clientY - position.top,
    };
    setIsDragging(true);
  };

  const handleElementDragStart = (e, solutionIndex, element) => {
    e.stopPropagation();
    const card = e.currentTarget.closest('.solution-card');
    const rect = card.getBoundingClientRect();
    offset.current = {
      x: e.clientX - rect.left - solutionData[solutionIndex].positions[element].left,
      y: e.clientY - rect.top - solutionData[solutionIndex].positions[element].top,
    };
    setDraggingElement({ solutionIndex, element });
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
    } else if (resizing) {
      const deltaX = e.clientX - offset.current.x;
      const deltaY = e.clientY - offset.current.y;
      let newWidth = gridStyles.width;
      let newMinHeight = gridStyles.minHeight;
      if (resizing === 'bottom-right') {
        newWidth = offset.current.width + deltaX;
        newMinHeight = offset.current.minHeight + deltaY;
      }
      newWidth = Math.max(newWidth, 300);
      newMinHeight = Math.max(newMinHeight, 200);
      setGridStyles((prev) => ({
        ...prev,
        width: newWidth,
        minHeight: newMinHeight,
      }));
    } else if (draggingElement) {
      requestAnimationFrame(() => {
        const { solutionIndex, element } = draggingElement;
        const card = document.getElementsByClassName('solution-card')[solutionIndex];
        const rect = card.getBoundingClientRect();
        const cardWidth = parseInt(cardStyles.card.width);
        const cardHeight = 300; // Approximate height, adjust if needed
        const elementWidth = element === 'number' ? 50 : cardWidth - 40; // Approximate width for number
        const elementHeight = element === 'number' ? 50 : (element === 'title' ? 30 : 60);

        let newLeft = e.clientX - rect.left - offset.current.x;
        let newTop = e.clientY - rect.top - offset.current.y;

        newLeft = Math.max(0, Math.min(newLeft, cardWidth - elementWidth));
        newTop = Math.max(0, Math.min(newTop, cardHeight - elementHeight));

        setSolutionData((prev) => {
          const newSolutions = [...prev];
          newSolutions[solutionIndex] = {
            ...newSolutions[solutionIndex],
            positions: {
              ...newSolutions[solutionIndex].positions,
              [element]: { top: newTop, left: newLeft },
            },
          };
          if (newSolutions[solutionIndex].id) {
            setPendingChanges((prev) => ({
              ...prev,
              [newSolutions[solutionIndex].id]: {
                ...prev[newSolutions[solutionIndex].id],
                positions: newSolutions[solutionIndex].positions,
              },
            }));
            onUpdate?.(newSolutions[solutionIndex].id, { positions: newSolutions[solutionIndex].positions });
          }
          return newSolutions;
        });
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setResizing(null);
    setDraggingElement(null);
  };

  const handleResizeMouseDown = (handle, e) => {
    e.stopPropagation();
    setResizing(handle);
    offset.current = {
      x: e.clientX,
      y: e.clientY,
      width: gridStyles.width,
      minHeight: gridStyles.minHeight,
    };
  };

  const handleElementClick = (e) => {
    e.stopPropagation();
    setIsSelected(true);
    onSelect?.('solutionGrid');
  };

  

  const handleStyleChange = (property, value, subProperty, solutionIndex) => {
    console.log(`handleStyleChange called with:`, { property, value, subProperty, solutionIndex });
    console.log('Current solutionData:', solutionData);
    
    setCardStyles((prev) => {
      const newStyles = {
        ...prev,
        [subProperty]: {
          ...prev[subProperty],
          [property]: value,
        },
      };

      // Appliquer les styles à toutes les solutions
      setSolutionData((prev) => {
        const newSolutions = [...prev];
        console.log('Applying styles to solutions:', newSolutions.length);
        
        newSolutions.forEach((solution, index) => {
          console.log(`Processing solution ${index}:`, solution);
          if (!solution.styles) {
            solution.styles = {
              card: {},
              number: {},
              title: {},
              description: {},
            };
          }
          if (!solution.styles[subProperty]) {
            solution.styles[subProperty] = {};
          }
          solution.styles[subProperty][property] = value;
          console.log(`Updated solution ${index} styles:`, solution.styles);
        });

        // Stocker les styles modifiés dans pendingStyles sans appeler onStyleChange
        newSolutions.forEach((solution, index) => {
          console.log(`Checking solution ${index} for id:`, solution.id);
          if (solution.id) {
            console.log(`Storing styles for solution ${solution.id}:`, solution.styles);
            pendingStyles.current[solution.id] = solution.styles;
            // Supprimer l'appel à onStyleChange pour éviter la boucle infinie
            // onStyleChange sera appelé seulement lors de la sauvegarde
          } else {
            console.warn(`Solution ${index} has no id:`, solution);
          }
        });

        return newSolutions;
      });

      return newStyles;
    });
  };

  const toggleTextStyle = (property, subProperty, value, defaultValue) => {
    const currentValue = solutionData[0]?.styles?.[subProperty]?.[property] || cardStyles[subProperty][property] || defaultValue;
    handleStyleChange(property, currentValue === value ? defaultValue : value, subProperty, 0);
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

  const renderResizeHandles = () => {
    if (!isSelected) return null;
    const handleSize = 8;
    const handles = [
      {
        name: 'bottom-right',
        cursor: 'nwse-resize',
        top: gridStyles.minHeight - handleSize / 2,
        left: gridStyles.width - handleSize / 2,
      },
    ];
    return handles.map((handle) => (
      <div
        key={handle.name}
        style={{
          position: 'absolute',
          top: position.top + handle.top,
          left: position.left + handle.left,
          width: handleSize,
          height: handleSize,
          backgroundColor: 'blue',
          cursor: handle.cursor,
          zIndex: 20,
        }}
        onMouseDown={(e) => handleResizeMouseDown(handle.name, e)}
      />
    ));
  };

  if (!solutionData.length) {
    return <div>Loading solutions...</div>;
  }

  return (
    <div
      onClick={() => setIsSelected(false)}
      style={{ position: 'relative' }}
    >
      {renderControlButtons()}
      {renderResizeHandles()}
      {isEditingStyles && (
        <div
          className="style-editor-panel visible"
          style={{
            position: 'absolute',
            top: `${Math.max(position.top, 0)}px`,
            left: `${Math.min(position.left + gridStyles.width + 20, window.innerWidth - 350)}px`,
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h3>Edit Solution Grid Style</h3>
              {isSaving && (
                <span style={{ color: '#007bff', fontSize: '12px' }}>
                  Sauvegarde en cours...
                </span>
              )}
            </div>
            <h3>Card Styles</h3>
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
                      key={c.id}
                      onClick={() => handleStyleChange('backgroundColor', c.couleur, 'card', 0)}
                      style={{
                        width: '20px',
                        height: '20px',
                        backgroundColor: c.couleur,
                        border: (solutionData[0]?.styles?.card?.backgroundColor || cardStyles.card.backgroundColor) === c.couleur ? '2px solid #000' : '1px solid #ccc',
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
                value={solutionData[0]?.styles?.card?.backgroundColor || cardStyles.card.backgroundColor}
                onChange={(e) => handleStyleChange('backgroundColor', e.target.value, 'card', 0)}
              />
            </div>
            <div>
              <label>Hover Background Color: </label>
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
                      key={c.id}
                      onClick={() => handleStyleChange('hoverBackgroundColor', c.couleur, 'card', 0)}
                      style={{
                        width: '20px',
                        height: '20px',
                        backgroundColor: c.couleur,
                        border: (solutionData[0]?.styles?.card?.hoverBackgroundColor || cardStyles.card.hoverBackgroundColor) === c.couleur ? '2px solid #000' : '1px solid #ccc',
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
                value={solutionData[0]?.styles?.card?.hoverBackgroundColor || cardStyles.card.hoverBackgroundColor}
                onChange={(e) => handleStyleChange('hoverBackgroundColor', e.target.value, 'card', 0)}
              />
            </div>
            <div>
              <label>Border Radius: </label>
              <input
                type="range"
                min="0"
                max="50"
                value={parseInt(solutionData[0]?.styles?.card?.borderRadius || cardStyles.card.borderRadius)}
                onChange={(e) => handleStyleChange('borderRadius', `${e.target.value}px`, 'card', 0)}
              />
            </div>
            <h3>Number Style</h3>
            <div>
              <label>Color: </label>
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
                      key={c.id}
                      onClick={() => handleStyleChange('color', c.couleur, 'number', 0)}
                      style={{
                        width: '20px',
                        height: '20px',
                        backgroundColor: c.couleur,
                        border: (solutionData[0]?.styles?.number?.color || cardStyles.number.color) === c.couleur ? '2px solid #000' : '1px solid #ccc',
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
                value={solutionData[0]?.styles?.number?.color || cardStyles.number.color}
                onChange={(e) => handleStyleChange('color', e.target.value, 'number', 0)}
              />
            </div>
            <div>
              <label>Font Size: </label>
              <input
                type="range"
                min="20"
                max="100"
                step="1"
                value={parseInt(solutionData[0]?.styles?.number?.fontSize || cardStyles.number.fontSize)}
                onChange={(e) => handleStyleChange('fontSize', `${e.target.value}px`, 'number', 0)}
              />
            </div>
            <h3>Title Text Style</h3>
            <div>
              <label>Color: </label>
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
                      key={c.id}
                      onClick={() => handleStyleChange('color', c.couleur, 'title', 0)}
                      style={{
                        width: '20px',
                        height: '20px',
                        backgroundColor: c.couleur,
                        border: (solutionData[0]?.styles?.title?.color || cardStyles.title.color) === c.couleur ? '2px solid #000' : '1px solid #ccc',
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
                value={solutionData[0]?.styles?.title?.color || cardStyles.title.color}
                onChange={(e) => handleStyleChange('color', e.target.value, 'title', 0)}
              />
            </div>
            <div>
              <label>Font Size: </label>
              <input
                type="range"
                min="10"
                max="50"
                step="1"
                value={parseInt(solutionData[0]?.styles?.title?.fontSize || cardStyles.title.fontSize)}
                onChange={(e) => handleStyleChange('fontSize', `${e.target.value}px`, 'title', 0)}
              />
            </div>
            <div>
              <label>Font Family: </label>
              <select
                value={solutionData[0]?.styles?.title?.fontFamily || cardStyles.title.fontFamily}
                onChange={(e) => handleStyleChange('fontFamily', e.target.value, 'title', 0)}
              >
                <option value="Arial">Arial</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Courier New">Courier New</option>
                <option value="Georgia">Georgia</option>
                <option value="Verdana">Verdana</option>
                <option value="Poppins">Poppins</option>
                <option value="Roboto">Roboto</option>
                <option value="Open Sans">Open Sans</option>
                <option value="Montserrat">Montserrat</option>
                <option value="Lato">Lato</option>
                <option value="Inter">Inter</option>
              </select>
            </div>
            <div>
              <label>Text Align: </label>
              <select
                value={solutionData[0]?.styles?.title?.textAlign || cardStyles.title.textAlign}
                onChange={(e) => handleStyleChange('textAlign', e.target.value, 'title', 0)}
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
                <option value="justify">Justify</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => toggleTextStyle('fontWeight', 'title', '700', 'normal')}
                style={{
                  padding: '5px 10px',
                  backgroundColor: solutionData[0]?.styles?.title?.fontWeight === '700' ? '#ccc' : '#fff',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                <strong>B</strong>
              </button>
              <button
                onClick={() => toggleTextStyle('fontStyle', 'title', 'italic', 'normal')}
                style={{
                  padding: '5px 10px',
                  backgroundColor: solutionData[0]?.styles?.title?.fontStyle === 'italic' ? '#ccc' : '#fff',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                <em>I</em>
              </button>
              <button
                onClick={() => toggleTextStyle('textDecoration', 'title', 'underline', 'none')}
                style={{
                  padding: '5px 10px',
                  backgroundColor: solutionData[0]?.styles?.title?.textDecoration === 'underline' ? '#ccc' : '#fff',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                <u>U</u>
              </button>
            </div>
            <h3>Description Text Style</h3>
            <div>
              <label>Color: </label>
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
                      key={c.id}
                      onClick={() => handleStyleChange('color', c.couleur, 'description', 0)}
                      style={{
                        width: '20px',
                        height: '20px',
                        backgroundColor: c.couleur,
                        border: (solutionData[0]?.styles?.description?.color || cardStyles.description.color) === c.couleur ? '2px solid #000' : '1px solid #ccc',
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
                value={solutionData[0]?.styles?.description?.color || cardStyles.description.color}
                onChange={(e) => handleStyleChange('color', e.target.value, 'description', 0)}
              />
            </div>
            <div>
              <label>Font Size: </label>
              <input
                type="range"
                min="10"
                max="50"
                step="1"
                value={parseInt(solutionData[0]?.styles?.description?.fontSize || cardStyles.description.fontSize)}
                onChange={(e) => handleStyleChange('fontSize', `${e.target.value}px`, 'description', 0)}
              />
            </div>
            <div>
              <label>Font Family: </label>
              <select
                value={solutionData[0]?.styles?.description?.fontFamily || cardStyles.description.fontFamily}
                onChange={(e) => handleStyleChange('fontFamily', e.target.value, 'description', 0)}
              >
                <option value="Arial">Arial</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Courier New">Courier New</option>
                <option value="Georgia">Georgia</option>
                <option value="Verdana">Verdana</option>
                <option value="Poppins">Poppins</option>
                <option value="Roboto">Roboto</option>
                <option value="Open Sans">Open Sans</option>
                <option value="Montserrat">Montserrat</option>
                <option value="Lato">Lato</option>
                <option value="Inter">Inter</option>
              </select>
            </div>
            <div>
              <label>Text Align: </label>
              <select
                value={solutionData[0]?.styles?.description?.textAlign || cardStyles.description.textAlign}
                onChange={(e) => handleStyleChange('textAlign', e.target.value, 'description', 0)}
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
                <option value="justify">Justify</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => toggleTextStyle('fontWeight', 'description', '700', 'normal')}
                style={{
                  padding: '5px 10px',
                  backgroundColor: solutionData[0]?.styles?.description?.fontWeight === '700' ? '#ccc' : '#fff',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                <strong>B</strong>
              </button>
              <button
                onClick={() => toggleTextStyle('fontStyle', 'description', 'italic', 'normal')}
                style={{
                  padding: '5px 10px',
                  backgroundColor: solutionData[0]?.styles?.description?.fontStyle === 'italic' ? '#ccc' : '#fff',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                <em>I</em>
              </button>
              <button
                onClick={() => toggleTextStyle('textDecoration', 'description', 'underline', 'none')}
                style={{
                  padding: '5px 10px',
                  backgroundColor: solutionData[0]?.styles?.description?.textDecoration === 'underline' ? '#ccc' : '#fff',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                <u>U</u>
              </button>
            </div>
            <h3>Grid Styles</h3>
            <div>
              <label>Grid Width: </label>
              <input
                type="number"
                min="300"
                value={gridStyles.width}
                onChange={(e) => setGridStyles((prev) => ({ ...prev, width: parseInt(e.target.value) }))}
              />
            </div>
            <div>
              <label>Grid Min Height: </label>
              <input
                type="number"
                min="200"
                value={gridStyles.minHeight}
                onChange={(e) => setGridStyles((prev) => ({ ...prev, minHeight: parseInt(e.target.value) }))}
              />
            </div>
            <div>
              <label>Card Width: </label>
              <input
                type="number"
                min="200"
                max="500"
                value={cardStyles.card.width || 300}
                onChange={(e) => {
                  const newWidth = parseInt(e.target.value);
                  setCardStyles((prev) => ({
                    ...prev,
                    card: { ...prev.card, width: newWidth }
                  }));
                  // Mettre à jour toutes les cartes
                  setSolutionData((prev) => 
                    prev.map(solution => ({
                      ...solution,
                      styles: {
                        ...solution.styles,
                        card: { ...solution.styles?.card, width: newWidth }
                      }
                    }))
                  );
                }}
              />
            </div>
            <div>
              <label>Card Min Height: </label>
              <input
                type="number"
                min="150"
                max="400"
                value={cardStyles.card.minHeight || 150}
                onChange={(e) => {
                  const newMinHeight = parseInt(e.target.value);
                  setCardStyles((prev) => ({
                    ...prev,
                    card: { ...prev.card, minHeight: newMinHeight }
                  }));
                  // Mettre à jour toutes les cartes
                  setSolutionData((prev) => 
                    prev.map(solution => ({
                      ...solution,
                      styles: {
                        ...solution.styles,
                        card: { ...solution.styles?.card, minHeight: newMinHeight }
                      }
                    }))
                  );
                }}
              />
            </div>
            <div>
              <label>Horizontal Gap: </label>
              <input
                type="number"
                min="5"
                max="50"
                value={parseInt(gridStyles.gap.split(' ')[1]) || 20}
                onChange={(e) => {
                  const newHorizontalGap = parseInt(e.target.value);
                  const currentVerticalGap = parseInt(gridStyles.gap.split(' ')[0]) || 15;
                  setGridStyles((prev) => ({
                    ...prev,
                    gap: `${currentVerticalGap}px ${newHorizontalGap}px`
                  }));
                }}
              />
            </div>
            <div>
              <label>Vertical Gap: </label>
              <input
                type="number"
                min="5"
                max="50"
                value={parseInt(gridStyles.gap.split(' ')[0]) || 15}
                onChange={(e) => {
                  const newVerticalGap = parseInt(e.target.value);
                  const currentHorizontalGap = parseInt(gridStyles.gap.split(' ')[1]) || 20;
                  setGridStyles((prev) => ({
                    ...prev,
                    gap: `${newVerticalGap}px ${currentHorizontalGap}px`
                  }));
                }}
              />
            </div>
          </div>
        </div>
      )}
      <div
        className="solutions-container style-one"
        style={{
          position: 'absolute',
          top: position.top,
          left: position.left,
          width: gridStyles.width,
          minHeight: gridStyles.minHeight,
          display: 'flex',
          flexWrap: 'wrap',
          gap: gridStyles.gap,
          padding: '10px 20px',
        }}
        onClick={handleElementClick}
      >
        {solutionData.map((solution, index) => (
          <div
            key={solution.id || index}
            className="solution-card"
            style={{
              backgroundColor: solution.styles?.card?.backgroundColor || cardStyles.card.backgroundColor,
              hoverBackgroundColor: solution.styles?.card?.hoverBackgroundColor || cardStyles.card.hoverBackgroundColor,
              borderRadius: solution.styles?.card?.borderRadius || cardStyles.card.borderRadius,
              padding: '30px 25px',
              position: 'relative',
              overflow: 'hidden',
              transition: 'background-color 0.3s ease',
              width: `${solution.styles?.card?.width || cardStyles.card.width || 300}px`,
              height: 'fit-content',
              minHeight: `${solution.styles?.card?.minHeight || cardStyles.card.minHeight || 150}px`,
              flex: '0 0 auto',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = solution.styles?.card?.hoverBackgroundColor || cardStyles.card.hoverBackgroundColor;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = solution.styles?.card?.backgroundColor || cardStyles.card.backgroundColor;
            }}
          >
            <div
              className="draggable-element solution-number"
              style={{
                position: 'absolute',
                top: solution.positions.number.top,
                left: solution.positions.number.left,
                cursor: isSelected ? 'move' : 'default',
                color: solution.styles?.number?.color || cardStyles.number.color,
                fontSize: solution.styles?.number?.fontSize || cardStyles.number.fontSize,
              }}
            >
              {isSelected && (
                <div
                  className="drag-handle"
                  onMouseDown={(e) => handleElementDragStart(e, index, 'number')}
                  style={{
                    position: 'absolute',
                    top: -15,
                    left: -15,
                    width: 12,
                    height: 12,
                    backgroundColor: '#fff',
                    border: '1px solid #ccc',
                    borderRadius: '50%',
                    cursor: 'move',
                    zIndex: 10,
                  }}
                >
                  <FontAwesomeIcon icon={faArrowsUpDownLeftRight} style={{ fontSize: '8px', color: '#000' }} />
                </div>
              )}
              {(index + 1).toString().padStart(2, '0')}
            </div>
            <div
              className="draggable-element"
              style={{
                position: 'absolute',
                top: solution.positions.title.top,
                left: solution.positions.title.left,
                cursor: isSelected ? 'move' : 'default',
                width: parseInt(cardStyles.card.width) - 50,
              }}
            >
              {isSelected && (
                <div
                  className="drag-handle"
                  onMouseDown={(e) => handleElementDragStart(e, index, 'title')}
                  style={{
                    position: 'absolute',
                    top: -15,
                    left: -15,
                    width: 12,
                    height: 12,
                    backgroundColor: '#fff',
                    border: '1px solid #ccc',
                    borderRadius: '50%',
                    cursor: 'move',
                    zIndex: 10,
                  }}
                >
                  <FontAwesomeIcon icon={faArrowsUpDownLeftRight} style={{ fontSize: '8px', color: '#000' }} />
                </div>
              )}
              <h3 style={{ 
                color: solution.styles?.title?.color || cardStyles.title.color,
                fontSize: solution.styles?.title?.fontSize || cardStyles.title.fontSize,
                fontFamily: solution.styles?.title?.fontFamily || cardStyles.title.fontFamily,
                textAlign: solution.styles?.title?.textAlign || cardStyles.title.textAlign,
                fontWeight: solution.styles?.title?.fontWeight || cardStyles.title.fontWeight,
                fontStyle: solution.styles?.title?.fontStyle || cardStyles.title.fontStyle,
                textDecoration: solution.styles?.title?.textDecoration || cardStyles.title.textDecoration,
                margin: 0 
              }}>
               
                {solution.title}
              </h3>
            </div>
            <div
              className="draggable-element"
              style={{
                position: 'absolute',
                top: solution.positions.description.top,
                left: solution.positions.description.left,
                cursor: isSelected ? 'move' : 'default',
                width: parseInt(cardStyles.card.width) - 50,
              }}
            >
              {isSelected && (
                <div
                  className="drag-handle"
                  onMouseDown={(e) => handleElementDragStart(e, index, 'description')}
                  style={{
                    position: 'absolute',
                    top: -15,
                    left: -15,
                    width: 12,
                    height: 12,
                    backgroundColor: '#fff',
                    border: '1px solid #ccc',
                    borderRadius: '50%',
                    cursor: 'move',
                    zIndex: 10,
                  }}
                >
                  <FontAwesomeIcon icon={faArrowsUpDownLeftRight} style={{ fontSize: '8px', color: '#000' }} />
                </div>
              )}
              <p style={{ 
                color: solution.styles?.description?.color || cardStyles.description.color,
                fontSize: solution.styles?.description?.fontSize || cardStyles.description.fontSize,
                fontFamily: solution.styles?.description?.fontFamily || cardStyles.description.fontFamily,
                textAlign: solution.styles?.description?.textAlign || cardStyles.description.textAlign,
                fontWeight: solution.styles?.description?.fontWeight || cardStyles.description.fontWeight,
                fontStyle: solution.styles?.description?.fontStyle || cardStyles.description.fontStyle,
                textDecoration: solution.styles?.description?.textDecoration || cardStyles.description.textDecoration,
                margin: 0 
              }}>
                
                {solution.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

export default EditorSolutionGrid;       