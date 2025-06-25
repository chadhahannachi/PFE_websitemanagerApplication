import React, { useState, useRef, useEffect } from 'react';
import './LatestEvents.css';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsUpDownLeftRight, faTimes, faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons';

export default function EditorEventStyleTwo({ events = [], initialPosition = { top: 0, left: 0 }, initialStyles = { width: 1200, backgroundColor: '#ffffff', borderRadius: '10px' }, cardStyles, onSelect, onPositionChange, onUpdate, onStyleChange, onCardStyleChange }) {
  const [position, setPosition] = useState(initialPosition);
  const [gridStyles, setGridStyles] = useState(initialStyles);
  const [eventData, setEventData] = useState(events);
  const [isSelected, setIsSelected] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  // const [editingEventIndex, setEditingEventIndex] = useState(null);
  // const [editingField, setEditingField] = useState(null);
  const [inputRef, setInputRef] = useState(null);
  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditingStyles, setIsEditingStyles] = useState(false);
  const [cardCustomStyles, setCardCustomStyles] = useState(cardStyles || {
    backgroundColor: '#fff',
    borderRadius: '10px',
    width: 300,
    height: 500,
  });

  // Charger les couleurs depuis l'API
  useEffect(() => {
    const fetchColors = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/couleurs', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setColors(response.data);
      } catch (error) {
        console.error('Error fetching colors:', error);
        setError('Erreur lors du chargement des couleurs');
      } finally {
        setLoading(false);
      }
    };

    fetchColors();
  }, []);

  useEffect(() => {
    setEventData(events);
  }, [events]);

  // useEffect(() => {
  //   if (inputRef && editingEventIndex !== null) {
  //     inputRef.focus();
  //   }
  // }, [editingEventIndex, editingField, inputRef]);

  useEffect(() => {
    if (cardStyles) {
      setCardCustomStyles(cardStyles);
    }
  }, [cardStyles]);

  const handleMouseDown = (e) => {
    if (e.target === e.currentTarget) {
      setIsDragging(true);
      const rect = e.currentTarget.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      e.preventDefault();
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const newPosition = {
        top: e.clientY - dragOffset.y,
        left: e.clientX - dragOffset.x,
      };
      setPosition(newPosition);
      onPositionChange?.(newPosition);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleResizeMouseDown = (handle, e) => {
    setIsResizing(true);
    e.stopPropagation();
  };

  const handleElementClick = (e) => {
    if (e.target === e.currentTarget) {
      setIsSelected(true);
      onSelect?.();
    }
  };

  // const handleEditEvent = (index, field) => {
  //   setEditingEventIndex(index);
  //   setEditingField(field);
  // };

  // const handleEventChange = (e, index, field) => {
  //   const newEventData = [...eventData];
  //   if (field === 'title') {
  //     newEventData[index].title = e.target.value;
  //   } else if (field === 'desc') {
  //     newEventData[index].desc = e.target.value;
  //   } else if (field === 'date') {
  //     newEventData[index].date = e.target.value;
  //   }
  //   setEventData(newEventData);
  // };

  const handleStyleChange = (property, value, subProperty) => {
    console.log('handleStyleChange appelé:', { property, value, subProperty });
    console.log('eventData avant modification:', eventData);
    
    setEventData((prevEvents) => {
      const newEvents = prevEvents.map((event) => {
        const updatedStyles = {
          ...event.styles,
          [subProperty]: {
            ...event.styles[subProperty],
            [property]: value,
          },
        };
        
        console.log(`Styles mis à jour pour l'événement ${event.id}:`, updatedStyles);
        
        // Appeler onStyleChange pour chaque événement
        if (event.id) {
          onStyleChange?.(event.id, updatedStyles);
        }
        
        return {
          ...event,
          styles: updatedStyles,
        };
      });
      
      console.log('eventData après modification:', newEvents);
      return newEvents;
    });
  };

  const toggleTextStyle = (property, subProperty, value, defaultValue) => {
    const firstEvent = eventData[0];
    const currentValue = firstEvent?.styles?.[subProperty]?.[property] || defaultValue;
    handleStyleChange(property, currentValue === value ? defaultValue : value, subProperty);
  };

  // const handleBlur = () => {
  //   setEditingEventIndex(null);
  //   setEditingField(null);
  // };

  // const handleKeyDown = (e) => {
  //   if (e.key === 'Enter') {
  //     handleBlur();
  //   }
  // };

  // Menu contextuel (comme EditorEventGrid)
  const renderControlButtons = () => {
    if (!isSelected) return null;
    return (
      <div
        style={{
          position: 'absolute',
          top: position.top - 50,
          left: position.left,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: '#fff',
          padding: '8px 12px',
          border: '1px solid #ccc',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
          zIndex: 1000,
        }}
      >
        <button
          onMouseDown={handleMouseDown}
          style={{
            cursor: 'grab',
            fontSize: '18px',
            color: '#333',
            background: '#fff',
            border: '1px solid #ccc',
            borderRadius: '4px',
            padding: '6px',
          }}
          title="Déplacer la grille"
        >
          <FontAwesomeIcon icon={faArrowsUpDownLeftRight} />
        </button>
        <button
          onClick={() => setIsEditingStyles(true)}
          style={{
            cursor: 'pointer',
            fontSize: '18px',
            color: '#333',
            background: '#fff',
            border: '1px solid #ccc',
            borderRadius: '4px',
            padding: '6px',
          }}
          title="Modifier le style"
        >
          <FontAwesomeIcon icon={faWandMagicSparkles} />
        </button>
      </div>
    );
  };

  const renderResizeHandles = () => {
    if (!isSelected) return null;

    return (
      <>
        <div
          style={{
            position: 'absolute',
            top: '-5px',
            left: '-5px',
            width: '10px',
            height: '10px',
            backgroundColor: '#007bff',
            cursor: 'nw-resize',
            zIndex: 1001,
          }}
          onMouseDown={(e) => handleResizeMouseDown('nw', e)}
        />
        <div
          style={{
            position: 'absolute',
            top: '-5px',
            right: '-5px',
            width: '10px',
            height: '10px',
            backgroundColor: '#007bff',
            cursor: 'ne-resize',
            zIndex: 1001,
          }}
          onMouseDown={(e) => handleResizeMouseDown('ne', e)}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-5px',
            left: '-5px',
            width: '10px',
            height: '10px',
            backgroundColor: '#007bff',
            cursor: 'sw-resize',
            zIndex: 1001,
          }}
          onMouseDown={(e) => handleResizeMouseDown('sw', e)}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-5px',
            right: '-5px',
            width: '10px',
            height: '10px',
            backgroundColor: '#007bff',
            cursor: 'se-resize',
            zIndex: 1001,
          }}
          onMouseDown={(e) => handleResizeMouseDown('se', e)}
        />
      </>
    );
  };

  // Panel d'édition contextuel (même style que EditorEventGrid)
  const renderEditPanel = () => {
    if (!isEditingStyles) return null;
    return (
      <div
        style={{
          position: 'absolute',
          top: `${Math.max(position.top, 0)}px`,
          left: `${Math.min(position.left + gridStyles.width + 20, window.innerWidth - 370)}px`,
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          zIndex: 1002,
          maxWidth: '800px',
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
          aria-label="Fermer le panneau"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <div className="style-controls">
          <h5>Style de la grille</h5>
          <div>
            <label>Largeur de la grille : </label>
            <input
              type="number"
              min="300"
              value={gridStyles.width}
              onChange={(e) => {
                const newStyles = { ...gridStyles, width: parseInt(e.target.value) };
                setGridStyles(newStyles);
                onUpdate?.(newStyles);
              }}
            />
          </div>
          
          <h5>Style des cartes</h5>
          <div>
            <label>Background Color : </label>
            <input
              type="color"
              value={cardCustomStyles.backgroundColor}
              onChange={e => setCardCustomStyles(prev => { const next = { ...prev, backgroundColor: e.target.value }; onCardStyleChange(next); return next; })}
            />
          </div>
          <div>
            <label>Border Radius : </label>
            <input
              type="range"
              min="0"
              max="50"
              step="1"
              value={parseInt(cardCustomStyles.borderRadius)}
              onChange={e => setCardCustomStyles(prev => { const next = { ...prev, borderRadius: `${e.target.value}px` }; onCardStyleChange(next); return next; })}
            />
            <span>{cardCustomStyles.borderRadius}</span>
          </div>
          <div>
            <label>Largeur : </label>
            <input
              type="number"
              min="100"
              max="600"
              value={cardCustomStyles.width}
              onChange={e => setCardCustomStyles(prev => { const next = { ...prev, width: parseInt(e.target.value) }; onCardStyleChange(next); return next; })}
            />
          </div>
          <div>
            <label>Hauteur : </label>
            <input
              type="number"
              min="100"
              max="800"
              value={cardCustomStyles.height}
              onChange={e => setCardCustomStyles(prev => { const next = { ...prev, height: parseInt(e.target.value) }; onCardStyleChange(next); return next; })}
            />
          </div>
          <h5>Title Text Style</h5>
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
                      border: (eventData[0]?.styles?.title?.color || cardCustomStyles.title.color) === c.couleur ? '2px solid #000' : '1px solid #ccc',
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
              value={eventData[0]?.styles?.title?.color || cardCustomStyles.title.color}
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
              value={parseInt(eventData[0]?.styles?.title?.fontSize || cardCustomStyles.title.fontSize)}
              onChange={(e) => handleStyleChange('fontSize', `${e.target.value}px`, 'title')}
            />
          </div>
          <div>
            <label>Font Family: </label>
            <select
              value={eventData[0]?.styles?.title?.fontFamily || cardCustomStyles.title.fontFamily}
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
              value={eventData[0]?.styles?.title?.textAlign || cardCustomStyles.title.textAlign}
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
                backgroundColor: (eventData[0]?.styles?.title?.fontWeight || cardCustomStyles.title.fontWeight) === '700' ? '#ccc' : '#fff',
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
                backgroundColor: (eventData[0]?.styles?.title?.fontStyle || cardCustomStyles.title.fontStyle) === 'italic' ? '#ccc' : '#fff',
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
                backgroundColor: (eventData[0]?.styles?.title?.textDecoration || cardCustomStyles.title.textDecoration) === 'underline' ? '#ccc' : '#fff',
                border: '1px solid #ccc',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              <u>U</u>
            </button>
          </div>
          <h5>Description Text Style</h5>
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
                      border: (eventData[0]?.styles?.description?.color || cardCustomStyles.description.color) === c.couleur ? '2px solid #000' : '1px solid #ccc',
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
              value={eventData[0]?.styles?.description?.color || cardCustomStyles.description.color}
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
              value={parseInt(eventData[0]?.styles?.description?.fontSize || cardCustomStyles.description.fontSize)}
              onChange={(e) => handleStyleChange('fontSize', `${e.target.value}px`, 'description')}
            />
          </div>
          <div>
            <label>Font Family: </label>
            <select
              value={eventData[0]?.styles?.description?.fontFamily || cardCustomStyles.description.fontFamily}
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
              value={eventData[0]?.styles?.description?.textAlign || cardCustomStyles.description.textAlign}
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
                backgroundColor: (eventData[0]?.styles?.description?.fontWeight || cardCustomStyles.description.fontWeight) === '700' ? '#ccc' : '#fff',
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
                backgroundColor: (eventData[0]?.styles?.description?.fontStyle || cardCustomStyles.description.fontStyle) === 'italic' ? '#ccc' : '#fff',
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
                backgroundColor: (eventData[0]?.styles?.description?.textDecoration || cardCustomStyles.description.textDecoration) === 'underline' ? '#ccc' : '#fff',
                border: '1px solid #ccc',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              <u>U</u>
            </button>
          </div>
          <h5>Date Text Style</h5>
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
                      border: (eventData[0]?.styles?.date?.color || cardCustomStyles.date.color) === c.couleur ? '2px solid #000' : '1px solid #ccc',
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
              value={eventData[0]?.styles?.date?.color || cardCustomStyles.date.color}
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
              value={parseInt(eventData[0]?.styles?.date?.fontSize || cardCustomStyles.date.fontSize)}
              onChange={(e) => handleStyleChange('fontSize', `${e.target.value}px`, 'date')}
            />
          </div>
          <div>
            <label>Font Family: </label>
            <select
              value={eventData[0]?.styles?.date?.fontFamily || cardCustomStyles.date.fontFamily}
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
              value={eventData[0]?.styles?.date?.textAlign || cardCustomStyles.date.textAlign}
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
                backgroundColor: (eventData[0]?.styles?.date?.fontWeight || cardCustomStyles.date.fontWeight) === '700' ? '#ccc' : '#fff',
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
                backgroundColor: (eventData[0]?.styles?.date?.fontStyle || cardCustomStyles.date.fontStyle) === 'italic' ? '#ccc' : '#fff',
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
                backgroundColor: (eventData[0]?.styles?.date?.textDecoration || cardCustomStyles.date.textDecoration) === 'underline' ? '#ccc' : '#fff',
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
    );
  };

  // Gestion du clic sur la grille (container)
  const handleGridClick = (e) => {
    e.stopPropagation();
    setIsSelected(true);
  };

  // Gestion du clic sur une carte
  const handleCardClick = (e) => {
    e.stopPropagation();
    setIsSelected(true);
  };

  return (
    <div
      style={{
        position: 'relative',
        cursor: isDragging ? 'grabbing' : 'default',
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onClick={() => setIsSelected(false)}
    >
      {renderControlButtons()}
      {renderResizeHandles()}
      {renderEditPanel()}
      <div
        className="events-container style-two"
        style={{
          position: 'relative',
          top: position.top,
          left: position.left,
          width: gridStyles.width,
          borderRadius: gridStyles.borderRadius,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '100px',
          padding: '20px',
        }}
        onClick={handleGridClick}
      >
        {eventData.map((event, index) => (
          <div
            key={event.id || index}
            className="event-item"
            style={{
              backgroundColor: cardCustomStyles.backgroundColor,
              borderRadius: cardCustomStyles.borderRadius,
              width: cardCustomStyles.width,
              height: cardCustomStyles.height,
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s ease',
              margin: 'auto',
            }}
            onClick={handleCardClick}
          >
            <img
              src={event.img}
              alt={event.title}
              className="event-image"
              style={{ width: '100%', height: '200px', objectFit: 'cover' }}
            />
            <div
              className="event-content"
              style={{
                padding: '20px',
              }}
            >
              <h3 style={{ ...event.styles.title, marginBottom: '10px' }}>
                {/* {editingEventIndex === index && editingField === 'title' ? (
                  <input
                    ref={setInputRef}
                    type="text"
                    value={event.title || ''}
                    onChange={(e) => handleEventChange(e, index, 'title')}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    style={{ width: '100%', fontSize: event.styles.title.fontSize }}
                  />
                ) : (
                  <span onClick={() => handleEditEvent(index, 'title')}>
                    {event.title}
                  </span>
                )} */}
                  {event.title}
              </h3>

              <p style={{ ...event.styles.description, marginBottom: '15px' }}>
                {/* {editingEventIndex === index && editingField === 'desc' ? (
                  <textarea
                    ref={setInputRef}
                    value={event.desc || ''}
                    onChange={(e) => handleEventChange(e, index, 'desc')}
                    onBlur={handleBlur}
                    style={{
                      width: '100%',
                      fontSize: event.styles.description.fontSize,
                      resize: 'none',
                      height: '60px',
                    }}
                  />
                ) : (
                  <span onClick={() => handleEditEvent(index, 'desc')}>
                    {event.desc}
                  </span>
                )} */}
                {event.desc}
              </p>
              <div
                className="event-date"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <CalendarMonthIcon className="calendar-icon" style={{ marginRight: '5px', color: event.styles.date.color }} />
                <span style={{ ...event.styles.date }}>
                  {/* {editingEventIndex === index && editingField === 'date' ? (
                    <input
                      ref={setInputRef}
                      type="text"
                      value={event.date || ''}
                      onChange={(e) => handleEventChange(e, index, 'date')}
                      onBlur={handleBlur}
                      onKeyDown={handleKeyDown}
                      style={{ width: '150px', fontSize: event.styles.date.fontSize }}
                    />
                  ) : (
                    <span onClick={() => handleEditEvent(index, 'date')}>
                      {event.date}
                    </span>
                  )} */}
                    {event.date}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 