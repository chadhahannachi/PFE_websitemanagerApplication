import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsUpDownLeftRight, faTimes, faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_URL = 'http://localhost:5000/couleurs';

export default function EditorServiceStyleOne({ services = [], initialPosition = { top: 0, left: 0 }, initialStyles = { width: 1400, minHeight: 400 }, onSelect, onPositionChange, onUpdate, onStyleChange }) {
  const [position, setPosition] = useState({
    top: initialPosition.top || 0,
    left: initialPosition.left || 0,
  });
  const [gridStyles, setGridStyles] = useState({
    width: parseFloat(initialStyles.width) || 1400,
    minHeight: parseFloat(initialStyles.minHeight) || 400,
  });
  const [cardStyles, setCardStyles] = useState({
    card: {
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
      width: '280px',
      height: '440px',
      padding: '10px 20px',
      transition: 'background-color 0.3s ease, color 0.3s ease, transform 0.3s ease, width 0.3s ease, height 0.3s ease',
      hoverBackgroundColor: '#f59e0b',
      hoverColor: 'white',
      hoverTransform: 'translateY(-10px)',
      hoverWidth: '450px',
      hoverHeight: 'auto',
      hoverMinHeight: '480px',
    },
    title: {
      color: '#0d1b3f',
      fontSize: '20px',
      fontFamily: 'Arial',
      fontWeight: '700',
      textAlign: 'center',
      fontStyle: 'normal',
      textDecoration: 'none',
      margin: '15px 0 10px',
    },
    description: {
      color: '#0d1b3f',
      fontSize: '15px',
      fontFamily: 'Arial',
      textAlign: 'center',
      fontWeight: 'normal',
      fontStyle: 'normal',
      textDecoration: 'none',
      lineHeight: '1.6',
      margin: '0',
      overflow: 'hidden',
      display: '-webkit-box',
      WebkitBoxOrient: 'vertical',
      WebkitLineClamp: '8',
      lineClamp: '8',
      textOverflow: 'ellipsis',
      transition: 'all 0.3s ease',
    },
    image: {
      borderRadius: '0px',
      width: '50px',
      height: '50px',
      objectFit: 'contain',
    },
  });
  const [serviceData, setServiceData] = useState([]);
  const [pendingChanges, setPendingChanges] = useState({});
  const [isDragging, setIsDragging] = useState(false);
  const [isEditingStyles, setIsEditingStyles] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [resizing, setResizing] = useState(null);
  const [draggingElement, setDraggingElement] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
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

  useEffect(() => {
    setServiceData(services.map((service) => ({
      ...service,
      positions: service.positions || {
        image: { top: 20, left: 120 },
        title: { top: 100, left: 20 },
        description: { top: 130, left: 20 },
      },
      styles: service.styles || cardStyles,
    })));
  }, [services, cardStyles]);

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
    };
  }, [isDragging, resizing, draggingElement]);

  const handleMouseDown = (e) => {
    e.stopPropagation();
    offset.current = {
      x: e.clientX - position.left,
      y: e.clientY - position.top,
    };
    setIsDragging(true);
  };

  const handleElementDragStart = (e, serviceIndex, element) => {
    e.stopPropagation();
    const card = e.currentTarget.closest('.service-card');
    const rect = card.getBoundingClientRect();
    offset.current = {
      x: e.clientX - rect.left - serviceData[serviceIndex].positions[element].left,
      y: e.clientY - rect.top - serviceData[serviceIndex].positions[element].top,
    };
    setDraggingElement({ serviceIndex, element });
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
        const { serviceIndex, element } = draggingElement;
        const card = document.getElementsByClassName('service-card')[serviceIndex];
        const rect = card.getBoundingClientRect();
        const cardWidth = parseInt(serviceData[serviceIndex].styles.card.width);
        const cardHeight = parseInt(serviceData[serviceIndex].styles.card.height);
        const elementWidth = parseInt(serviceData[serviceIndex].styles[element]?.width || (element === 'title' || element === 'description' ? cardWidth - 40 : 60));
        const elementHeight = parseInt(serviceData[serviceIndex].styles[element]?.height || (element === 'title' ? 30 : element === 'description' ? 60 : 60));

        let newLeft = e.clientX - rect.left - offset.current.x;
        let newTop = e.clientY - rect.top - offset.current.y;

        newLeft = Math.max(0, Math.min(newLeft, cardWidth - elementWidth));
        newTop = Math.max(0, Math.min(newTop, cardHeight - elementHeight));

        setServiceData((prev) => {
          const newServices = [...prev];
          newServices[serviceIndex] = {
            ...newServices[serviceIndex],
            positions: {
              ...newServices[serviceIndex].positions,
              [element]: { top: newTop, left: newLeft },
            },
          };
          if (newServices[serviceIndex].id) {
            setPendingChanges((prev) => ({
              ...prev,
              [newServices[serviceIndex].id]: {
                ...prev[newServices[serviceIndex].id],
                positions: newServices[serviceIndex].positions,
              },
            }));
            onUpdate?.(newServices[serviceIndex].id, { positions: newServices[serviceIndex].positions });
          }
          return newServices;
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
    onSelect?.('serviceGrid');
  };

  const handleImageChange = (index, file) => {
    const reader = new FileReader();
    reader.onload = () => {
      setServiceData((prev) => {
        const newServices = [...prev];
        newServices[index] = { ...newServices[index], img: reader.result };
        if (newServices[index].id) {
          setPendingChanges((prev) => ({
            ...prev,
            [newServices[index].id]: {
              ...prev[newServices[index].id],
              img: reader.result,
            },
          }));
          onUpdate?.(newServices[index].id, { img: reader.result });
        }
        return newServices;
      });
    };
    reader.readAsDataURL(file);
  };

  const handleStyleChange = (property, value, subProperty) => {
    setServiceData((prevServices) => {
      const newServices = prevServices.map((service) => {
        const updatedStyles = {
          ...service.styles,
          [subProperty]: {
            ...service.styles[subProperty],
            [property]: value,
          },
        };
        
        if (service.id) {
          onStyleChange?.(service.id, updatedStyles);
        }
        
        return {
          ...service,
          styles: updatedStyles,
        };
      });
      
      return newServices;
    });
  };

  const toggleTextStyle = (property, subProperty, value, defaultValue) => {
    const firstService = serviceData[0];
    const currentValue = firstService?.styles?.[subProperty]?.[property] || defaultValue;
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

  if (!serviceData.length) {
    return <div>Loading services...</div>;
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
            <h3>Edit Service Style One</h3>
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
                        border: (serviceData[0]?.styles?.card?.backgroundColor || cardStyles.card.backgroundColor) === c.couleur ? '2px solid #000' : '1px solid #ccc',
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
                value={serviceData[0]?.styles?.card?.backgroundColor || cardStyles.card.backgroundColor}
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
                        border: (serviceData[0]?.styles?.card?.hoverBackgroundColor || cardStyles.card.hoverBackgroundColor) === c.couleur ? '2px solid #000' : '1px solid #ccc',
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
                value={serviceData[0]?.styles?.card?.hoverBackgroundColor || cardStyles.card.hoverBackgroundColor}
                onChange={(e) => handleStyleChange('hoverBackgroundColor', e.target.value, 'card')}
              />
            </div>
            <div>
              <label>Border Radius: </label>
              <input
                type="range"
                min="0"
                max="50"
                value={parseInt(serviceData[0]?.styles?.card?.borderRadius || cardStyles.card.borderRadius)}
                onChange={(e) => handleStyleChange('borderRadius', `${e.target.value}px`, 'card')}
              />
            </div>
            <div>
              <label>Card Width: </label>
              <input
                type="number"
                min="200"
                value={parseInt(serviceData[0]?.styles?.card?.width || cardStyles.card.width)}
                onChange={(e) => handleStyleChange('width', `${e.target.value}px`, 'card')}
              />
            </div>
            <div>
              <label>Card Height: </label>
              <input
                type="number"
                min="150"
                value={parseInt(serviceData[0]?.styles?.card?.height || cardStyles.card.height)}
                onChange={(e) => handleStyleChange('height', `${e.target.value}px`, 'card')}
              />
            </div>
            <h3>Hover Effects</h3>
            <div>
              <label>Hover Width: </label>
              <input
                type="number"
                min="200"
                value={parseInt(serviceData[0]?.styles?.card?.hoverWidth || cardStyles.card.hoverWidth)}
                onChange={(e) => handleStyleChange('hoverWidth', `${e.target.value}px`, 'card')}
              />
            </div>
            <div>
              <label>Hover Height: </label>
              <input
                type="text"
                value={serviceData[0]?.styles?.card?.hoverHeight || cardStyles.card.hoverHeight}
                onChange={(e) => handleStyleChange('hoverHeight', e.target.value, 'card')}
                placeholder="auto"
              />
            </div>
            <div>
              <label>Hover Min Height: </label>
              <input
                type="number"
                min="200"
                value={parseInt(serviceData[0]?.styles?.card?.hoverMinHeight || cardStyles.card.hoverMinHeight)}
                onChange={(e) => handleStyleChange('hoverMinHeight', `${e.target.value}px`, 'card')}
              />
            </div>
            <div>
              <label>Hover Transform: </label>
              <input
                type="text"
                value={serviceData[0]?.styles?.card?.hoverTransform || cardStyles.card.hoverTransform}
                onChange={(e) => handleStyleChange('hoverTransform', e.target.value, 'card')}
                placeholder="translateY(-10px)"
              />
            </div>
            <div>
              <label>Hover Color: </label>
              <input
                type="text"
                value={serviceData[0]?.styles?.card?.hoverColor || cardStyles.card.hoverColor}
                onChange={(e) => handleStyleChange('hoverColor', e.target.value, 'card')}
                placeholder="white"
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
                      key={c._id}
                      onClick={() => handleStyleChange('color', c.couleur, 'title')}
                      style={{
                        width: '20px',
                        height: '20px',
                        backgroundColor: c.couleur,
                        border: (serviceData[0]?.styles?.title?.color || cardStyles.title.color) === c.couleur ? '2px solid #000' : '1px solid #ccc',
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
                value={serviceData[0]?.styles?.title?.color || cardStyles.title.color}
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
                value={parseInt(serviceData[0]?.styles?.title?.fontSize || cardStyles.title.fontSize)}
                onChange={(e) => handleStyleChange('fontSize', `${e.target.value}px`, 'title')}
              />
            </div>
            <div>
              <label>Font Family: </label>
              <select
                value={serviceData[0]?.styles?.title?.fontFamily || cardStyles.title.fontFamily}
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
                value={serviceData[0]?.styles?.title?.textAlign || cardStyles.title.textAlign}
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
                  backgroundColor: (serviceData[0]?.styles?.title?.fontWeight || cardStyles.title.fontWeight) === '700' ? '#ccc' : '#fff',
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
                  backgroundColor: (serviceData[0]?.styles?.title?.fontStyle || cardStyles.title.fontStyle) === 'italic' ? '#ccc' : '#fff',
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
                  backgroundColor: (serviceData[0]?.styles?.title?.textDecoration || cardStyles.title.textDecoration) === 'underline' ? '#ccc' : '#fff',
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
                        border: (serviceData[0]?.styles?.description?.color || cardStyles.description.color) === c.couleur ? '2px solid #000' : '1px solid #ccc',
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
                value={serviceData[0]?.styles?.description?.color || cardStyles.description.color}
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
                value={parseInt(serviceData[0]?.styles?.description?.fontSize || cardStyles.description.fontSize)}
                onChange={(e) => handleStyleChange('fontSize', `${e.target.value}px`, 'description')}
              />
            </div>
            <div>
              <label>Font Family: </label>
              <select
                value={serviceData[0]?.styles?.description?.fontFamily || cardStyles.description.fontFamily}
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
                value={serviceData[0]?.styles?.description?.textAlign || cardStyles.description.textAlign}
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
                  backgroundColor: (serviceData[0]?.styles?.description?.fontWeight || cardStyles.description.fontWeight) === '700' ? '#ccc' : '#fff',
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
                  backgroundColor: (serviceData[0]?.styles?.description?.fontStyle || cardStyles.description.fontStyle) === 'italic' ? '#ccc' : '#fff',
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
                  backgroundColor: (serviceData[0]?.styles?.description?.textDecoration || cardStyles.description.textDecoration) === 'underline' ? '#ccc' : '#fff',
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
                value={parseInt(serviceData[0]?.styles?.image?.borderRadius || cardStyles.image.borderRadius)}
                onChange={(e) => handleStyleChange('borderRadius', `${e.target.value}px`, 'image')}
              />
            </div>
            <div>
              <label>Width: </label>
              <input
                type="number"
                min="20"
                value={parseInt(serviceData[0]?.styles?.image?.width || cardStyles.image.width)}
                onChange={(e) => handleStyleChange('width', `${e.target.value}px`, 'image')}
              />
            </div>
            <div>
              <label>Height: </label>
              <input
                type="number"
                min="20"
                value={parseInt(serviceData[0]?.styles?.image?.height || cardStyles.image.height)}
                onChange={(e) => handleStyleChange('height', `${e.target.value}px`, 'image')}
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
      )}
      <div
        className="services-container style-one"
        style={{
          position: 'absolute',
          top: position.top,
          left: position.left,
          width: gridStyles.width,
          minHeight: gridStyles.minHeight,
          display: 'flex',
          flexWrap: 'wrap',
          gap: '20px',
          padding: '0 20px',
          justifyContent: 'center',
        }}
        onClick={handleElementClick}
      >
        {serviceData.map((service, index) => {
          const isHovered = hoveredIndex === index;
          
          // Utiliser les styles par défaut comme fallback
          const cardStyle = {
            ...cardStyles.card,
            ...service.styles.card,
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            backgroundColor: isHovered ? (service.styles.card.hoverBackgroundColor || cardStyles.card.hoverBackgroundColor) : (service.styles.card.backgroundColor || cardStyles.card.backgroundColor),
            color: isHovered ? (service.styles.card.hoverColor || cardStyles.card.hoverColor) : (service.styles.card.color || cardStyles.card.color),
            width: isHovered ? (service.styles.card.hoverWidth || cardStyles.card.hoverWidth) : (service.styles.card.width || cardStyles.card.width),
            height: isHovered ? (service.styles.card.hoverHeight || cardStyles.card.hoverHeight) : (service.styles.card.height || cardStyles.card.height),
            minHeight: isHovered ? (service.styles.card.hoverMinHeight || cardStyles.card.hoverMinHeight) : 'auto',
            transform: isHovered ? (service.styles.card.hoverTransform || cardStyles.card.hoverTransform) : 'scale(1)',
            zIndex: isHovered ? 10 : 1,
          };

          // Debug: afficher les valeurs de largeur
          console.log(`Card ${index} - isHovered: ${isHovered}`);
          console.log(`Normal width: ${service.styles.card.width || cardStyles.card.width}`);
          console.log(`Hover width: ${service.styles.card.hoverWidth || cardStyles.card.hoverWidth}`);
          console.log(`Applied width: ${cardStyle.width}`);

          const titleStyle = {
            ...cardStyles.title,
            ...service.styles.title,
            margin: 0,
            color: isHovered ? (service.styles.card.hoverColor || cardStyles.card.hoverColor) : (service.styles.title.color || cardStyles.title.color),
          };

          const descriptionStyle = {
            ...cardStyles.description,
            ...service.styles.description,
            margin: 0,
            wordWrap: 'break-word',
            color: isHovered ? (service.styles.card.hoverColor || cardStyles.card.hoverColor) : (service.styles.description.color || cardStyles.description.color),
            WebkitLineClamp: isHovered ? 'unset' : (service.styles.description.WebkitLineClamp || cardStyles.description.WebkitLineClamp),
            lineClamp: isHovered ? 'unset' : (service.styles.description.lineClamp || cardStyles.description.lineClamp),
            overflow: isHovered ? 'visible' : (service.styles.description.overflow || cardStyles.description.overflow),
            flexGrow: isHovered ? 0 : 1,
          };

          // Calculer la largeur actuelle pour les éléments
          const currentCardWidth = isHovered ? 
            parseInt(service.styles.card.hoverWidth || cardStyles.card.hoverWidth) : 
            parseInt(service.styles.card.width || cardStyles.card.width);

          return (
            <div
              key={service.id || index}
              className={`service-card ${isHovered ? 'expanded' : ''}`}
              style={cardStyle}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div
                className="draggable-element"
                style={{
                  position: 'absolute',
                  top: service.positions.image.top,
                  left: service.positions.image.left,
                  cursor: isSelected ? 'move' : 'default',
                }}
              >
                {isSelected && (
                  <div
                    className="drag-handle"
                    onMouseDown={(e) => handleElementDragStart(e, index, 'image')}
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
                <img
                  src={service.img}
                  alt={service.title}
                  style={{
                    width: service.styles.image.width || cardStyles.image.width,
                    height: service.styles.image.height || cardStyles.image.height,
                    objectFit: service.styles.image.objectFit || cardStyles.image.objectFit,
                    borderRadius: service.styles.image.borderRadius || cardStyles.image.borderRadius,
                    zIndex: 2,
                  }}
                />
              </div>
              <div
                className="draggable-element"
                style={{
                  position: 'absolute',
                  top: service.positions.title.top,
                  left: service.positions.title.left,
                  cursor: isSelected ? 'move' : 'default',
                  width: currentCardWidth - 40,
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
                <h3 style={titleStyle}>
                  {service.title}
                </h3>
              </div>
              <div
                className="draggable-element"
                style={{
                  position: 'absolute',
                  top: service.positions.description.top,
                  left: service.positions.description.left,
                  cursor: isSelected ? 'move' : 'default',
                  width: currentCardWidth - 40,
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
                <p style={descriptionStyle}>
                  {service.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 