import React, { useState, useRef, useEffect } from 'react';
import './LatestEvents.css';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsUpDownLeftRight, faTimes, faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons';
import { jwtDecode } from 'jwt-decode';

const API_URL = 'http://localhost:5000/couleurs';

export default function EditorEventStyleTwo({ events = [], initialPosition = { top: 0, left: 0 }, initialStyles = { width: 1200, minHeight: 440 }, onSelect, onPositionChange, onUpdate, onStyleChange }) {
  const [position, setPosition] = useState({
    top: initialPosition.top || 0,
    left: initialPosition.left || 0,
  });
  const [gridStyles, setGridStyles] = useState({
    width: parseFloat(initialStyles.width) || 1200,
    minHeight: parseFloat(initialStyles.minHeight) || 440,
  });
  const [cardStyles, setCardStyles] = useState({
    card: {
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
      width: '280px',
      height: '440px',
      hoverBackgroundColor: '#f59e0b',
    },
    title: {
      color: '#014268',
      fontSize: '25px',
      fontFamily: 'Arial',
      fontWeight: '700',
      textAlign: 'left',
      fontStyle: 'normal',
      textDecoration: 'none',
    },
    description: {
      color: '#555',
      fontSize: '18px',
      fontFamily: 'Arial',
      textAlign: 'left',
      fontWeight: 'normal',
      fontStyle: 'normal',
      textDecoration: 'none',
    },
    date: {
      color: '#999',
      fontSize: '14px',
      fontFamily: 'Arial',
      textAlign: 'left',
      fontWeight: 'normal',
      fontStyle: 'normal',
      textDecoration: 'none',
    },
    image: {
      borderRadius: '0px',
      width: '100%',
      height: '200px',
    },

  });
  const [eventData, setEventData] = useState([]);
  const [pendingChanges, setPendingChanges] = useState({});
  const [isDragging, setIsDragging] = useState(false);
  const [isEditingStyles, setIsEditingStyles] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [resizing, setResizing] = useState(null);
  // Removed draggingElement state since drag functionality is removed
  const offset = useRef({ x: 0, y: 0 });
  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userEntreprise, setUserEntreprise] = useState(null);

  // Default positions for event elements (not used in new layout)
  const defaultPositions = {
    image: { top: 0, left: 0 },
    title: { top: 0, left: 0 },
    description: { top: 0, left: 0 },
    date: { top: 0, left: 0 },
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

  // Initialize eventData with validated events
  useEffect(() => {
    if (!Array.isArray(events) || events.length === 0) {
      console.warn('Events prop is empty or not an array:', events);
      setEventData([]);
      return;
    }

    const validatedEvents = events.map((event, index) => {
      // Ensure event has required properties
      const validatedEvent = {
        id: event.id || `event-${index}`,
        title: event.title || 'Untitled Event',
        desc: event.desc || 'No description available',
        date: event.date || 'No date available',
        img: event.img || 'default-image.jpg',
        positions: event.positions || defaultPositions,
        styles: event.styles || cardStyles,
      };

      // Ensure all position properties exist (not used in new layout but kept for compatibility)
      validatedEvent.positions = {
        image: {
          top: validatedEvent.positions.image?.top ?? defaultPositions.image.top,
          left: validatedEvent.positions.image?.left ?? defaultPositions.image.left,
        },
        title: {
          top: validatedEvent.positions.title?.top ?? defaultPositions.title.top,
          left: validatedEvent.positions.title?.left ?? defaultPositions.title.left,
        },
        description: {
          top: validatedEvent.positions.description?.top ?? defaultPositions.description.top,
          left: validatedEvent.positions.description?.left ?? defaultPositions.description.left,
        },
        date: {
          top: validatedEvent.positions.date?.top ?? defaultPositions.date.top,
          left: validatedEvent.positions.date?.left ?? defaultPositions.date.left,
        },
      };

      // Ensure styles are valid
      validatedEvent.styles = {
        card: { ...cardStyles.card, ...validatedEvent.styles.card },
        title: { ...cardStyles.title, ...validatedEvent.styles.title },
        description: { ...cardStyles.description, ...validatedEvent.styles.description },
        date: { ...cardStyles.date, ...validatedEvent.styles.date },
        image: { ...cardStyles.image, ...validatedEvent.styles.image },
      };

      return validatedEvent;
    });

    setEventData(validatedEvents);
  }, [events, cardStyles]);

  useEffect(() => {
    if (isDragging || resizing) {
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
  }, [isDragging, resizing]);

  const handleMouseDown = (e) => {
    e.stopPropagation();
    offset.current = {
      x: e.clientX - position.left,
      y: e.clientY - position.top,
    };
    setIsDragging(true);
  };

  // Removed drag functionality for internal elements

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
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setResizing(null);
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
    onSelect?.('eventGrid');
  };

  const handleImageChange = (index, file) => {
    const reader = new FileReader();
    reader.onload = () => {
      setEventData((prev) => {
        const newEvents = [...prev];
        newEvents[index] = { ...newEvents[index], img: reader.result };
        if (newEvents[index].id) {
          setPendingChanges((prev) => ({
            ...prev,
            [newEvents[index].id]: {
              ...prev[newEvents[index].id],
              img: reader.result,
            },
          }));
          onUpdate?.(newEvents[index].id, { img: reader.result });
        }
        return newEvents;
      });
    };
    reader.readAsDataURL(file);
  };

  const handleStyleChange = (property, value, subProperty) => {
    setEventData((prevEvents) => {
      const newEvents = prevEvents.map((event) => {
        const updatedStyles = {
          ...event.styles,
          [subProperty]: {
            ...event.styles[subProperty],
            [property]: value,
          },
        };
        if (event.id) {
          onStyleChange?.(event.id, updatedStyles);
        }
        return {
          ...event,
          styles: updatedStyles,
        };
      });
      return newEvents;
    });
  };

  const toggleTextStyle = (property, subProperty, value, defaultValue) => {
    const firstEvent = eventData[0];
    const currentValue = firstEvent?.styles?.[subProperty]?.[property] || defaultValue;
    handleStyleChange(property, currentValue === value ? defaultValue : value, subProperty);
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

  const renderEditPanel = () => {
    if (!isEditingStyles) return null;
    return (
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
          <h3>Edit Event Grid Style</h3>
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
                    key={c._id}
                    onClick={() => handleStyleChange('backgroundColor', c.couleur, 'card')}
                    style={{
                      width: '20px',
                      height: '20px',
                      backgroundColor: c.couleur,
                      border: (eventData[0]?.styles?.card?.backgroundColor || cardStyles.card.backgroundColor) === c.couleur ? '2px solid #000' : '1px solid #ccc',
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
              value={eventData[0]?.styles?.card?.backgroundColor || cardStyles.card.backgroundColor}
              onChange={(e) => handleStyleChange('backgroundColor', e.target.value, 'card')}
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
                    key={c._id}
                    onClick={() => handleStyleChange('hoverBackgroundColor', c.couleur, 'card')}
                    style={{
                      width: '20px',
                      height: '20px',
                      backgroundColor: c.couleur,
                      border: (eventData[0]?.styles?.card?.hoverBackgroundColor || cardStyles.card.hoverBackgroundColor) === c.couleur ? '2px solid #000' : '1px solid #ccc',
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
              value={eventData[0]?.styles?.card?.hoverBackgroundColor || cardStyles.card.hoverBackgroundColor}
              onChange={(e) => handleStyleChange('hoverBackgroundColor', e.target.value, 'card')}
            />
          </div>
          <div>
            <label>Border Radius: </label>
            <input
              type="range"
              min="0"
              max="50"
              value={parseInt(eventData[0]?.styles?.card?.borderRadius || cardStyles.card.borderRadius)}
              onChange={(e) => handleStyleChange('borderRadius', `${e.target.value}px`, 'card')}
            />
          </div>
          <div>
            <label>Card Width: </label>
            <input
              type="number"
              min="200"
              max="500"
              step="10"
              value={parseInt(eventData[0]?.styles?.card?.width || cardStyles.card.width)}
              onChange={(e) => handleStyleChange('width', `${e.target.value}px`, 'card')}
            />
            <span style={{ marginLeft: '5px', fontSize: '12px', color: '#666' }}>px</span>
          </div>
          <div>
            <label>Card Height: </label>
            <input
              type="number"
              min="300"
              max="800"
              step="10"
              value={parseInt(eventData[0]?.styles?.card?.height || cardStyles.card.height)}
              onChange={(e) => handleStyleChange('height', `${e.target.value}px`, 'card')}
            />
            <span style={{ marginLeft: '5px', fontSize: '12px', color: '#666' }}>px</span>
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
                    key={c._id}
                    onClick={() => handleStyleChange('color', c.couleur, 'title')}
                    style={{
                      width: '20px',
                      height: '20px',
                      backgroundColor: c.couleur,
                      border: (eventData[0]?.styles?.title?.color || cardStyles.title.color) === c.couleur ? '2px solid #000' : '1px solid #ccc',
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
              value={eventData[0]?.styles?.title?.color || cardStyles.title.color}
              onChange={(e) => handleStyleChange('color', e.target.value, 'title')}
            />
          </div>
          <div>
            <label>Font Size: </label>
            <input
              type="range"
              min="10"
              max="50"
              step="1"
              value={parseInt(eventData[0]?.styles?.title?.fontSize || cardStyles.title.fontSize)}
              onChange={(e) => handleStyleChange('fontSize', `${e.target.value}px`, 'title')}
            />
          </div>
          <div>
            <label>Font Family: </label>
            <select
              value={eventData[0]?.styles?.title?.fontFamily || cardStyles.title.fontFamily}
              onChange={(e) => handleStyleChange('fontFamily', e.target.value, 'title')}
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
              value={eventData[0]?.styles?.title?.textAlign || cardStyles.title.textAlign}
              onChange={(e) => handleStyleChange('textAlign', e.target.value, 'title')}
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
                backgroundColor: (eventData[0]?.styles?.title?.fontWeight || cardStyles.title.fontWeight) === '700' ? '#ccc' : '#fff',
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
                backgroundColor: (eventData[0]?.styles?.title?.fontStyle || cardStyles.title.fontStyle) === 'italic' ? '#ccc' : '#fff',
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
                backgroundColor: (eventData[0]?.styles?.title?.textDecoration || cardStyles.title.textDecoration) === 'underline' ? '#ccc' : '#fff',
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
                    key={c._id}
                    onClick={() => handleStyleChange('color', c.couleur, 'description')}
                    style={{
                      width: '20px',
                      height: '20px',
                      backgroundColor: c.couleur,
                      border: (eventData[0]?.styles?.description?.color || cardStyles.description.color) === c.couleur ? '2px solid #000' : '1px solid #ccc',
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
              value={eventData[0]?.styles?.description?.color || cardStyles.description.color}
              onChange={(e) => handleStyleChange('color', e.target.value, 'description')}
            />
          </div>
          <div>
            <label>Font Size: </label>
            <input
              type="range"
              min="10"
              max="50"
              step="1"
              value={parseInt(eventData[0]?.styles?.description?.fontSize || cardStyles.description.fontSize)}
              onChange={(e) => handleStyleChange('fontSize', `${e.target.value}px`, 'description')}
            />
          </div>
          <div>
            <label>Font Family: </label>
            <select
              value={eventData[0]?.styles?.description?.fontFamily || cardStyles.description.fontFamily}
              onChange={(e) => handleStyleChange('fontFamily', e.target.value, 'description')}
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
              value={eventData[0]?.styles?.description?.textAlign || cardStyles.description.textAlign}
              onChange={(e) => handleStyleChange('textAlign', e.target.value, 'description')}
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
                backgroundColor: (eventData[0]?.styles?.description?.fontWeight || cardStyles.description.fontWeight) === '700' ? '#ccc' : '#fff',
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
                backgroundColor: (eventData[0]?.styles?.description?.fontStyle || cardStyles.description.fontStyle) === 'italic' ? '#ccc' : '#fff',
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
                backgroundColor: (eventData[0]?.styles?.description?.textDecoration || cardStyles.description.textDecoration) === 'underline' ? '#ccc' : '#fff',
                border: '1px solid #ccc',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              <u>U</u>
            </button>
          </div>
          <h3>Date Text Style</h3>
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
                    key={c._id}
                    onClick={() => handleStyleChange('color', c.couleur, 'date')}
                    style={{
                      width: '20px',
                      height: '20px',
                      backgroundColor: c.couleur,
                      border: (eventData[0]?.styles?.date?.color || cardStyles.date.color) === c.couleur ? '2px solid #000' : '1px solid #ccc',
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
              value={eventData[0]?.styles?.date?.color || cardStyles.date.color}
              onChange={(e) => handleStyleChange('color', e.target.value, 'date')}
            />
          </div>
          <div>
            <label>Font Size: </label>
            <input
              type="range"
              min="10"
              max="50"
              step="1"
              value={parseInt(eventData[0]?.styles?.date?.fontSize || cardStyles.date.fontSize)}
              onChange={(e) => handleStyleChange('fontSize', `${e.target.value}px`, 'date')}
            />
          </div>
          <div>
            <label>Font Family: </label>
            <select
              value={eventData[0]?.styles?.date?.fontFamily || cardStyles.date.fontFamily}
              onChange={(e) => handleStyleChange('fontFamily', e.target.value, 'date')}
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
              value={eventData[0]?.styles?.date?.textAlign || cardStyles.date.textAlign}
              onChange={(e) => handleStyleChange('textAlign', e.target.value, 'date')}
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
              <option value="justify">Justify</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => toggleTextStyle('fontWeight', 'date', '700', 'normal')}
              style={{
                padding: '5px 10px',
                backgroundColor: (eventData[0]?.styles?.date?.fontWeight || cardStyles.date.fontWeight) === '700' ? '#ccc' : '#fff',
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
                backgroundColor: (eventData[0]?.styles?.date?.fontStyle || cardStyles.date.fontStyle) === 'italic' ? '#ccc' : '#fff',
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
                backgroundColor: (eventData[0]?.styles?.date?.textDecoration || cardStyles.date.textDecoration) === 'underline' ? '#ccc' : '#fff',
                border: '1px solid #ccc',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              <u>U</u>
            </button>
          </div>
          <h3>Image Style</h3>
          <div>
            <label>Border Radius: </label>
            <input
              type="range"
              min="0"
              max="50"
              value={parseInt(eventData[0]?.styles?.image?.borderRadius || cardStyles.image.borderRadius)}
              onChange={(e) => handleStyleChange('borderRadius', `${e.target.value}px`, 'image')}
            />
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
        </div>
      </div>
    );
  };

  if (loading) {
    return <div>Loading events...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!eventData.length) {
    return <div>No events available to display.</div>;
  }

  return (
    <div
      onClick={() => setIsSelected(false)}
      style={{ position: 'relative' }}
    >
      {renderControlButtons()}
      {renderResizeHandles()}
      {renderEditPanel()}
      <div
        className="events-container style-two"
        style={{
          position: 'absolute',
          top: position.top,
          left: position.left,
          width: gridStyles.width,
          minHeight: gridStyles.minHeight,
          display: 'flex',
          flexWrap: 'wrap',
          gap: '15px',
          padding: '0 15px',
        }}
        onClick={handleElementClick}
      >
        {eventData.map((event, index) => (
          <div
            key={event.id || index}
            className="event-card"
            style={{
              ...event.styles.card,
              padding: '0',
              position: 'relative',
              overflow: 'hidden',
              transition: 'background-color 0.3s ease',
              display: 'flex',
              flexDirection: 'column',
              height: event.styles.card.height || '440px', // Dynamic height from styles
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = event.styles.card.hoverBackgroundColor;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = event.styles.card.backgroundColor;
            }}
          >
            {/* Image at the top */}
            <div
              style={{
                width: '100%',
              }}
            >
              <img
                src={event.img}
                alt={event.title}
                style={{
                  width: '100%',
                  height: '200px',
                  objectFit: 'cover',
                  borderRadius: event.styles.image.borderRadius,
                  display: 'block',
                }}
              />
            </div>
            
            {/* Content area with padding */}
            <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
              {/* Title */}
              <div
                style={{
                  marginBottom: '10px',
                }}
              >
                <h3 style={{ ...event.styles.title, margin: 0 }}>
                  {event.title}
                </h3>
              </div>
              
              {/* Description */}
              <div
                style={{
                  flex: 1,
                  marginBottom: '10px',
                }}
              >
                <p style={{ ...event.styles.description, margin: 0, wordWrap: 'break-word' }}>
                  {event.desc}
                </p>
              </div>
              
              {/* Date at the bottom */}
              <div
                style={{
                  marginTop: 'auto',
                }}
              >
                <div
                  className="event-date"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <CalendarMonthIcon className="calendar-icon" style={{ marginRight: '5px', color: event.styles.date.color }} />
                  <span style={{ ...event.styles.date }}>
                    {event.date}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}