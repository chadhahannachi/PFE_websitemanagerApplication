import React, { useState, useRef, useEffect } from 'react';
import './LatestEvents.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsUpDownLeftRight, faTimes, faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

export default function EditorEventStyleOne({
  events = [],
  initialPosition = { top: 80, left: 0 },
  cardStyles = { backgroundColor: '#fff', borderRadius: '12px', width: 320, height: 220 },
  onSelect,
  onPositionChange,
  onUpdate,
  onStyleChange,
  onCardStyleChange,
}) {
  const [position, setPosition] = useState(initialPosition);
  const [eventData, setEventData] = useState(events);
  const [isSelected, setIsSelected] = useState(false);
  const [isEditingStyles, setIsEditingStyles] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [cardCustomStyles, setCardCustomStyles] = useState(cardStyles);
//   const [editingEventIndex, setEditingEventIndex] = useState(null);
//   const [editingField, setEditingField] = useState(null);
  const [inputRef, setInputRef] = useState(null);
  const [cardTextStyles, setCardTextStyles] = useState({
    title: {
      color: '#222',
      fontSize: '20px',
      fontFamily: 'Arial',
      fontWeight: '700',
      textAlign: 'left',
      fontStyle: 'normal',
      textDecoration: 'none',
    },
    description: {
      color: '#444',
      fontSize: '15px',
      fontFamily: 'Arial',
      fontWeight: 'normal',
      textAlign: 'left',
      fontStyle: 'normal',
      textDecoration: 'none',
    },
    date: {
      color: '#888',
      fontSize: '14px',
      fontFamily: 'Arial',
      fontWeight: 'normal',
      textAlign: 'left',
      fontStyle: 'normal',
      textDecoration: 'none',
    },
  });

  
  const offset = useRef({ x: 0, y: 0 });
  const [draggedCardIndex, setDraggedCardIndex] = useState(null);
  const [dragOverCardIndex, setDragOverCardIndex] = useState(null);
  const [isDraggingCard, setIsDraggingCard] = useState(false);
  const dragCardRef = useRef(null);

  const API_URL = 'http://localhost:5000/couleurs';
  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userEntreprise, setUserEntreprise] = useState(null);

  useEffect(() => { setEventData(events); }, [events]);
  useEffect(() => { if (cardStyles) setCardCustomStyles(cardStyles); }, [cardStyles]);
//   useEffect(() => { if (inputRef && editingEventIndex !== null) inputRef.focus(); }, [editingEventIndex, editingField, inputRef]);
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

  // Récupération de l'entreprise utilisateur
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
              setError('Erreur lors de la récupération des données utilisateur.');
              setLoading(false);
            });
        } else {
          setError('ID utilisateur manquant.');
          setLoading(false);
        }
      } catch (err) {
        setError('Erreur lors du décodage du token.');
        setLoading(false);
      }
    } else {
      setError('Token manquant. Veuillez vous connecter.');
      setLoading(false);
    }
  }, []);

  // Récupération des couleurs de l'entreprise
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
          setError('Erreur lors de la récupération des couleurs.');
        });
    }
  }, [userEntreprise]);

  // Drag & drop de la grille (from EditorEventGrid)
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

  // Sélection
  const handleGridClick = (e) => { e.stopPropagation(); setIsSelected(true); };
  const handleCardClick = (e) => { e.stopPropagation(); setIsSelected(true); };

  // Edition contenu
//   const handleEditEvent = (index, field) => { setEditingEventIndex(index); setEditingField(field); };
//   const handleEventChange = (e, index, field) => {
//     const newEventData = [...eventData];
//     newEventData[index][field] = e.target.value;
//     setEventData(newEventData);
//     onStyleChange?.(newEventData[index].id, { ...newEventData[index].styles, [field]: e.target.value });
//   };
//   const handleBlur = () => { setEditingEventIndex(null); setEditingField(null); };
//   const handleKeyDown = (e) => { if (e.key === 'Enter') handleBlur(); };

  // Styles cards
  const handleCardStyleChange = (next) => {
    setCardCustomStyles(next);
    onCardStyleChange?.(next);
  };

  // Drag & drop des cartes (réorganisation)
  const handleCardDragStart = (index) => {
    setDraggedCardIndex(index);
    setIsDraggingCard(true);
    dragCardRef.current = index;
  };
  const handleCardDragOver = (index) => {
    setDragOverCardIndex(index);
  };
  const handleCardDrop = (index) => {
    if (draggedCardIndex === null || draggedCardIndex === index) return;
    const newData = [...eventData];
    const [removed] = newData.splice(draggedCardIndex, 1);
    newData.splice(index, 0, removed);
    setEventData(newData);
    setDraggedCardIndex(null);
    setDragOverCardIndex(null);
    // Appelle onUpdate pour chaque carte avec son nouvel index
    newData.forEach((ev, idx) => {
      if (ev.id) onUpdate?.(ev.id, { index: idx });
    });
  };
  const handleCardDragEnd = () => {
    setDraggedCardIndex(null);
    setDragOverCardIndex(null);
  };

  // Menu contextuel
//   const renderControlButtons = () => {
//     if (!isSelected) return null;
//     return (
//       <div style={{ position: 'absolute', top: 0, left: 0, display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#fff', padding: '8px 12px', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', zIndex: 1000 }}>
//         <button onMouseDown={handleMouseDown} style={{ cursor: 'grab', fontSize: '18px', color: '#333', background: '#fff', border: '1px solid #ccc', borderRadius: '4px', padding: '6px' }} title="Déplacer la grille">
//           <FontAwesomeIcon icon={faArrowsUpDownLeftRight} />
//         </button>
//         <button onClick={() => setIsEditingStyles(true)} style={{ cursor: 'pointer', fontSize: '18px', color: '#333', background: '#fff', border: '1px solid #ccc', borderRadius: '4px', padding: '6px' }} title="Modifier le style">
//           <FontAwesomeIcon icon={faWandMagicSparkles} />
//         </button>
//       </div>
//     );
//   };

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

  // Ajoute une fonction utilitaire pour toggle les styles texte
  const toggleTextStyle = (property, subProperty, value, defaultValue) => {
    setCardTextStyles((prev) => ({
      ...prev,
      [subProperty]: {
        ...prev[subProperty],
        [property]: prev[subProperty][property] === value ? defaultValue : value,
      },
    }));
    setEventData((prev) =>
      prev.map((ev) => {
        const newStyles = {
          ...ev.styles,
          [subProperty]: {
            ...ev.styles?.[subProperty],
            [property]: ev.styles?.[subProperty]?.[property] === value ? defaultValue : value,
          },
        };
        onStyleChange?.(ev.id, newStyles);
        return { ...ev, styles: newStyles };
      })
    );
  };

  return (
    <div 
    onClick={() => setIsSelected(false)}
    style={{ position: 'relative', width: 'fit-content', margin: '0 auto' }}>
      {renderControlButtons()}
      {isEditingStyles && (
        <div 
        // style={{ position: 'absolute', top: 0, left: 0, backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', zIndex: 1002, maxWidth: '350px', maxHeight: '80vh', overflowY: 'auto' }}
        className="style-editor-panel visible"
          style={{
            position: 'absolute',
            top: `${Math.max(position.top, 0)}px`,
            left: `${Math.min(position.left + cardCustomStyles.width + 20, window.innerWidth - 350)}px`,
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
          <button onClick={() => setIsEditingStyles(false)} style={{ position: 'absolute', top: '5px', right: '5px', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '16px', color: '#999' }} aria-label="Fermer le panneau">
            <FontAwesomeIcon icon={faTimes} />
          </button>
          <div className="style-controls">
            <h5>Style des cartes</h5>
            <div>
              <label>Background Color : </label>
              <input type="color" value={cardCustomStyles.backgroundColor} onChange={e => setCardCustomStyles(prev => { const next = { ...prev, backgroundColor: e.target.value }; handleCardStyleChange(next); return next; })} />
            </div>
            <div>
              <label>Border Radius : </label>
              <input type="range" min="0" max="50" step="1" value={parseInt(cardCustomStyles.borderRadius)} onChange={e => setCardCustomStyles(prev => { const next = { ...prev, borderRadius: `${e.target.value}px` }; handleCardStyleChange(next); return next; })} />
              <span>{cardCustomStyles.borderRadius}</span>
            </div>
            <div>
              <label>Largeur : </label>
              <input type="number" min="100" max="600" value={cardCustomStyles.width} onChange={e => setCardCustomStyles(prev => { const next = { ...prev, width: parseInt(e.target.value) }; handleCardStyleChange(next); return next; })} />
            </div>
            <div>
              <label>Hauteur : </label>
              <input type="number" min="100" max="600" value={cardCustomStyles.height} onChange={e => setCardCustomStyles(prev => { const next = { ...prev, height: parseInt(e.target.value) }; handleCardStyleChange(next); return next; })} />
            </div>
            <h5>Style du titre</h5>
            <div>
              <label>Couleur : </label>
              {loading ? (
                <span>Chargement des couleurs...</span>
              ) : error ? (
                <span style={{ color: 'red' }}>{error}</span>
              ) : colors.length === 0 ? (
                <span>Aucune couleur disponible.</span>
              ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginLeft: '10px', marginTop: '5px' }}>
                  {colors.map((c) => (
                    <div
                      key={c._id}
                      onClick={() => {
                        setCardTextStyles((prev) => ({ ...prev, title: { ...prev.title, color: c.couleur } }));
                        setEventData((prev) => prev.map(ev => {
                          const newStyles = { ...ev.styles, title: { ...ev.styles?.title, color: c.couleur } };
                          onStyleChange?.(ev.id, newStyles);
                          return { ...ev, styles: newStyles };
                        }));
                      }}
                      style={{
                        width: '20px',
                        height: '20px',
                        backgroundColor: c.couleur,
                        border: (cardTextStyles.title.color === c.couleur) ? '2px solid #000' : '1px solid #ccc',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        transition: 'border 0.2s ease',
                      }}
                      title={c.couleur}
                    />
                  ))}
                </div>
              )}
              <input type="color" value={cardTextStyles.title.color} onChange={e => {
                setCardTextStyles(prev => ({ ...prev, title: { ...prev.title, color: e.target.value } }));
                setEventData(prev => prev.map(ev => {
                  const newStyles = { ...ev.styles, title: { ...ev.styles?.title, color: e.target.value } };
                  onStyleChange?.(ev.id, newStyles);
                  return { ...ev, styles: newStyles };
                }));
              }} />
            </div>
            <div>
              <label>Taille : </label>
              <input type="range" min="12" max="32" value={parseInt(cardTextStyles.title.fontSize)} onChange={e => {
                setCardTextStyles(prev => ({ ...prev, title: { ...prev.title, fontSize: `${e.target.value}px` } }));
                setEventData(prev => prev.map(ev => {
                  const newStyles = { ...ev.styles, title: { ...ev.styles?.title, fontSize: `${e.target.value}px` } };
                  onStyleChange?.(ev.id, newStyles);
                  return { ...ev, styles: newStyles };
                }));
              }} />
              <span>{cardTextStyles.title.fontSize}</span>
            </div>
            <div>
              <label>Police : </label>
              <select value={cardTextStyles.title.fontFamily} onChange={e => {
                setCardTextStyles(prev => ({ ...prev, title: { ...prev.title, fontFamily: e.target.value } }));
                setEventData(prev => prev.map(ev => {
                  const newStyles = { ...ev.styles, title: { ...ev.styles?.title, fontFamily: e.target.value } };
                  onStyleChange?.(ev.id, newStyles);
                  return { ...ev, styles: newStyles };
                }));
              }}>
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
            <div style={{ display: 'flex', gap: '10px', margin: '8px 0' }}>
              <button
                onClick={() => toggleTextStyle('fontWeight', 'title', '700', 'normal')}
                style={{
                  padding: '5px 10px',
                  backgroundColor: cardTextStyles.title.fontWeight === '700' ? '#ccc' : '#fff',
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
                  backgroundColor: cardTextStyles.title.fontStyle === 'italic' ? '#ccc' : '#fff',
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
                  backgroundColor: cardTextStyles.title.textDecoration === 'underline' ? '#ccc' : '#fff',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                <u>U</u>
              </button>
            </div>
            <h5>Style de la description</h5>
            <div>
              <label>Couleur : </label>
              {loading ? (
                <span>Chargement des couleurs...</span>
              ) : error ? (
                <span style={{ color: 'red' }}>{error}</span>
              ) : colors.length === 0 ? (
                <span>Aucune couleur disponible.</span>
              ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginLeft: '10px', marginTop: '5px' }}>
                  {colors.map((c) => (
                    <div
                      key={c._id}
                      onClick={() => {
                        setCardTextStyles((prev) => ({ ...prev, description: { ...prev.description, color: c.couleur } }));
                        setEventData((prev) => prev.map(ev => {
                          const newStyles = { ...ev.styles, description: { ...ev.styles?.description, color: c.couleur } };
                          onStyleChange?.(ev.id, newStyles);
                          return { ...ev, styles: newStyles };
                        }));
                      }}
                      style={{
                        width: '20px',
                        height: '20px',
                        backgroundColor: c.couleur,
                        border: (cardTextStyles.description.color === c.couleur) ? '2px solid #000' : '1px solid #ccc',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        transition: 'border 0.2s ease',
                      }}
                      title={c.couleur}
                    />
                  ))}
                </div>
              )}
              <input type="color" value={cardTextStyles.description.color} onChange={e => {
                setCardTextStyles(prev => ({ ...prev, description: { ...prev.description, color: e.target.value } }));
                setEventData(prev => prev.map(ev => {
                  const newStyles = { ...ev.styles, description: { ...ev.styles?.description, color: e.target.value } };
                  onStyleChange?.(ev.id, newStyles);
                  return { ...ev, styles: newStyles };
                }));
              }} />
            </div>
            <div>
              <label>Taille : </label>
              <input type="range" min="10" max="24" value={parseInt(cardTextStyles.description.fontSize)} onChange={e => {
                setCardTextStyles(prev => ({ ...prev, description: { ...prev.description, fontSize: `${e.target.value}px` } }));
                setEventData(prev => prev.map(ev => {
                  const newStyles = { ...ev.styles, description: { ...ev.styles?.description, fontSize: `${e.target.value}px` } };
                  onStyleChange?.(ev.id, newStyles);
                  return { ...ev, styles: newStyles };
                }));
              }} />
              <span>{cardTextStyles.description.fontSize}</span>
            </div>
            <div>
              <label>Police : </label>
              <select value={cardTextStyles.description.fontFamily} onChange={e => {
                setCardTextStyles(prev => ({ ...prev, description: { ...prev.description, fontFamily: e.target.value } }));
                setEventData(prev => prev.map(ev => {
                  const newStyles = { ...ev.styles, description: { ...ev.styles?.description, fontFamily: e.target.value } };
                  onStyleChange?.(ev.id, newStyles);
                  return { ...ev, styles: newStyles };
                }));
              }}>
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
            <div style={{ display: 'flex', gap: '10px', margin: '8px 0' }}>
              <button
                onClick={() => toggleTextStyle('fontWeight', 'description', '700', 'normal')}
                style={{
                  padding: '5px 10px',
                  backgroundColor: cardTextStyles.description.fontWeight === '700' ? '#ccc' : '#fff',
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
                  backgroundColor: cardTextStyles.description.fontStyle === 'italic' ? '#ccc' : '#fff',
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
                  backgroundColor: cardTextStyles.description.textDecoration === 'underline' ? '#ccc' : '#fff',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                <u>U</u>
              </button>
            </div>
            <h5>Style de la date</h5>
            <div>
              <label>Couleur : </label>
              {loading ? (
                <span>Chargement des couleurs...</span>
              ) : error ? (
                <span style={{ color: 'red' }}>{error}</span>
              ) : colors.length === 0 ? (
                <span>Aucune couleur disponible.</span>
              ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginLeft: '10px', marginTop: '5px' }}>
                  {colors.map((c) => (
                    <div
                      key={c._id}
                      onClick={() => {
                        setCardTextStyles((prev) => ({ ...prev, date: { ...prev.date, color: c.couleur } }));
                        setEventData((prev) => prev.map(ev => {
                          const newStyles = { ...ev.styles, date: { ...ev.styles?.date, color: c.couleur } };
                          onStyleChange?.(ev.id, newStyles);
                          return { ...ev, styles: newStyles };
                        }));
                      }}
                      style={{
                        width: '20px',
                        height: '20px',
                        backgroundColor: c.couleur,
                        border: (cardTextStyles.date.color === c.couleur) ? '2px solid #000' : '1px solid #ccc',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        transition: 'border 0.2s ease',
                      }}
                      title={c.couleur}
                    />
                  ))}
                </div>
              )}
              <input type="color" value={cardTextStyles.date.color} onChange={e => {
                setCardTextStyles(prev => ({ ...prev, date: { ...prev.date, color: e.target.value } }));
                setEventData(prev => prev.map(ev => {
                  const newStyles = { ...ev.styles, date: { ...ev.styles?.date, color: e.target.value } };
                  onStyleChange?.(ev.id, newStyles);
                  return { ...ev, styles: newStyles };
                }));
              }} />
            </div>
            <div>
              <label>Taille : </label>
              <input type="range" min="10" max="20" value={parseInt(cardTextStyles.date.fontSize)} onChange={e => {
                setCardTextStyles(prev => ({ ...prev, date: { ...prev.date, fontSize: `${e.target.value}px` } }));
                setEventData(prev => prev.map(ev => {
                  const newStyles = { ...ev.styles, date: { ...ev.styles?.date, fontSize: `${e.target.value}px` } };
                  onStyleChange?.(ev.id, newStyles);
                  return { ...ev, styles: newStyles };
                }));
              }} />
              <span>{cardTextStyles.date.fontSize}</span>
            </div>
            <div>
              <label>Police : </label>
              <select value={cardTextStyles.date.fontFamily} onChange={e => {
                setCardTextStyles(prev => ({ ...prev, date: { ...prev.date, fontFamily: e.target.value } }));
                setEventData(prev => prev.map(ev => {
                  const newStyles = { ...ev.styles, date: { ...ev.styles?.date, fontFamily: e.target.value } };
                  onStyleChange?.(ev.id, newStyles);
                  return { ...ev, styles: newStyles };
                }));
              }}>
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
            <div style={{ display: 'flex', gap: '10px', margin: '8px 0' }}>
              <button
                onClick={() => toggleTextStyle('fontWeight', 'date', '700', 'normal')}
                style={{
                  padding: '5px 10px',
                  backgroundColor: cardTextStyles.date.fontWeight === '700' ? '#ccc' : '#fff',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                <strong>B</strong>
              </button>
              <button
                onClick={() => toggleTextStyle('fontStyle', 'date', 'italic', 'normal')}
                style={{
                  padding: '5px 10px',
                  backgroundColor: cardTextStyles.date.fontStyle === 'italic' ? '#ccc' : '#fff',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                <em>I</em>
              </button>
              <button
                onClick={() => toggleTextStyle('textDecoration', 'date', 'underline', 'none')}
                style={{
                  padding: '5px 10px',
                  backgroundColor: cardTextStyles.date.textDecoration === 'underline' ? '#ccc' : '#fff',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                <u>U</u>
              </button>
            </div>
          </div>
        </div>
      )}
      <div
        className="events-container style-one"
        style={{
          position: 'relative',
          top: position.top,
          left: position.left,
          display: 'inline-block',
          background: 'transparent',
          padding: 0,
        }}
        onClick={handleGridClick}
      >
        <div className="events-list" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {eventData.map((event, index) => (
            <div
              className="event-item"
              key={event.id || index}
              style={{
                background: cardCustomStyles.backgroundColor,
                borderRadius: cardCustomStyles.borderRadius,
                width: cardCustomStyles.width,
                height: cardCustomStyles.height,
                margin: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                cursor: 'move',
                position: 'relative',
              }}
              onClick={handleCardClick}
            >
              <div className="event-header">
                <span className="event-date" style={event.styles?.date || cardTextStyles.date}>
                  {/* {editingEventIndex === index && editingField === 'date' ? (
                    <input
                      ref={setInputRef}
                      type="text"
                      value={event.date || ''}
                      onChange={e => handleEventChange(e, index, 'date')}
                      onBlur={handleBlur}
                      onKeyDown={handleKeyDown}
                      style={{ width: '100%' }}
                    />
                  ) : (
                    <span onClick={() => handleEditEvent(index, 'date')}>{event.date}</span>
                  )} */}
                  {event.date}
                </span>
                <h3 style={event.styles?.title || cardTextStyles.title}>
                  {/* {editingEventIndex === index && editingField === 'title' ? (
                    <input
                      ref={setInputRef}
                      type="text"
                      value={event.title || ''}
                      onChange={e => handleEventChange(e, index, 'title')}
                      onBlur={handleBlur}
                      onKeyDown={handleKeyDown}
                      style={{ width: '100%' }}
                    />
                  ) : (
                    <span onClick={() => handleEditEvent(index, 'title')}>{event.title}</span>
                  )} */}
                  {event.title}
                </h3>
              </div>
              <p style={event.styles?.description || cardTextStyles.description}>
                {/* {editingEventIndex === index && editingField === 'desc' ? (
                  <textarea
                    ref={setInputRef}
                    value={event.desc || ''}
                    onChange={e => handleEventChange(e, index, 'desc')}
                    onBlur={handleBlur}
                    style={{ width: '100%', resize: 'none', height: '60px' }}
                  />
                ) : (
                  <span onClick={() => handleEditEvent(index, 'desc')}>{event.desc}</span>
                )} */}
                {event.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}