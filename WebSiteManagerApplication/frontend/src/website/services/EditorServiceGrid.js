import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsUpDownLeftRight, faTimes, faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_URL = 'http://localhost:5000/couleurs';

export default function EditorServiceGrid({ services = [], initialPosition = { top: 0, left: 0 }, initialStyles = { width: 1200, minHeight: 440 }, onSelect, onPositionChange, onUpdate, onStyleChange }) {
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
      hoverBackgroundColor: '#f59e0b', // Added hover background color
    },
    title: {
      color: '#0d1b3f',
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
    button: {
      backgroundColor: '#eeeeee',
      borderRadius: '10px',
      color: '#184969',
      fontSize: '14px',
      fontWeight: '700',
      hoverColor: '#014268',
    },
    image: {
      borderRadius: '0px',
      width: '60px',
      height: '60px',
    },
    shape: {
      fill: '#eeeeee',
      width: '100px',
      height: '89px',
    },
  });
  const [serviceData, setServiceData] = useState([]);
  const [pendingChanges, setPendingChanges] = useState({});
  const [isDragging, setIsDragging] = useState(false);
  const [isEditingStyles, setIsEditingStyles] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [resizing, setResizing] = useState(null);
  const [draggingElement, setDraggingElement] = useState(null);
  const [expandedServices, setExpandedServices] = useState({});
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
        image: { top: 35, left: 40 },
        shape: { top: 20, left: 20 },
        title: { top: 120, left: 20 },
        description: { top: 160, left: 20 },
        button: { top: 360, left: 20 },
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
        const elementWidth = parseInt(serviceData[serviceIndex].styles[element]?.width || (element === 'title' || element === 'description' ? cardWidth - 40 : 100));
        const elementHeight = parseInt(serviceData[serviceIndex].styles[element]?.height || (element === 'title' ? 30 : element === 'description' ? 60 : 30));

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
        
        // Appeler onStyleChange pour chaque service avec TOUS les styles mis à jour
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

  const toggleDescriptionExpansion = (serviceId) => {
    setExpandedServices(prev => ({
      ...prev,
      [serviceId]: !prev[serviceId]
    }));
  };

  const renderControlButtons = () => {
    if (!isSelected) return null;
    return (
      <div
        className="element-controls"
        style={{
          position: 'absolute',
          top: position.top - 40,
          left: position.left-30,
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
            <h3>Edit Service Grid Style</h3>
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
            <h3>Shape Style</h3>
            <div>
              <label>Fill Color: </label>
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
                      onClick={() => handleStyleChange('fill', c.couleur, 'shape')}
                      style={{
                        width: '20px',
                        height: '20px',
                        backgroundColor: c.couleur,
                        border: (serviceData[0]?.styles?.shape?.fill || cardStyles.shape.fill) === c.couleur ? '2px solid #000' : '1px solid #ccc',
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
                value={serviceData[0]?.styles?.shape?.fill || cardStyles.shape.fill}
                onChange={(e) => handleStyleChange('fill', e.target.value, 'shape')}
              />
            </div>
            <div>
              <label>Width: </label>
              <input
                type="number"
                min="50"
                value={parseInt(serviceData[0]?.styles?.shape?.width || cardStyles.shape.width)}
                onChange={(e) => handleStyleChange('width', `${e.target.value}px`, 'shape')}
              />
            </div>
            <div>
              <label>Height: </label>
              <input
                type="number"
                min="50"
                value={parseInt(serviceData[0]?.styles?.shape?.height || cardStyles.shape.height)}
                onChange={(e) => handleStyleChange('height', `${e.target.value}px`, 'shape')}
              />
            </div>
            <h3>Button Style</h3>
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
                      onClick={() => handleStyleChange('backgroundColor', c.couleur, 'button')}
                      style={{
                        width: '20px',
                        height: '20px',
                        backgroundColor: c.couleur,
                        border: (serviceData[0]?.styles?.button?.backgroundColor || cardStyles.button.backgroundColor) === c.couleur ? '2px solid #000' : '1px solid #ccc',
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
                value={serviceData[0]?.styles?.button?.backgroundColor || cardStyles.button.backgroundColor}
                onChange={(e) => handleStyleChange('backgroundColor', e.target.value, 'button')}
              />
            </div>
            <div>
              <label>Border Radius: </label>
              <input
                type="range"
                min="0"
                max="50"
                value={parseInt(serviceData[0]?.styles?.button?.borderRadius || cardStyles.button.borderRadius)}
                onChange={(e) => handleStyleChange('borderRadius', `${e.target.value}px`, 'button')}
              />
            </div>
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
                      onClick={() => handleStyleChange('color', c.couleur, 'button')}
                      style={{
                        width: '20px',
                        height: '20px',
                        backgroundColor: c.couleur,
                        border: (serviceData[0]?.styles?.button?.color || cardStyles.button.color) === c.couleur ? '2px solid #000' : '1px solid #ccc',
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
                value={serviceData[0]?.styles?.button?.color || cardStyles.button.color}
                onChange={(e) => handleStyleChange('color', e.target.value, 'button')}
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
                      onClick={() => handleStyleChange('hoverColor', c.couleur, 'button')}
                      style={{
                        width: '20px',
                        height: '20px',
                        backgroundColor: c.couleur,
                        border: (serviceData[0]?.styles?.button?.hoverColor || cardStyles.button.hoverColor) === c.couleur ? '2px solid #000' : '1px solid #ccc',
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
                value={serviceData[0]?.styles?.button?.hoverColor || cardStyles.button.hoverColor}
                onChange={(e) => handleStyleChange('hoverColor', e.target.value, 'button')}
              />
            </div>
            <div>
              <label>Font Size: </label>
              <input
                type="range"
                min="10"
                max="30"
                step="1"
                value={parseInt(serviceData[0]?.styles?.button?.fontSize || cardStyles.button.fontSize)}
                onChange={(e) => handleStyleChange('fontSize', `${e.target.value}px`, 'button')}
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
        className="services-container style-two"
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
        {serviceData.map((service, index) => (
          <div
            key={service.id || index}
            className="service-card"
            style={{
              ...service.styles.card,
              padding: '20px',
              position: 'relative',
              overflow: 'hidden',
              transition: 'background-color 0.3s ease', // Smooth transition for hover
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = service.styles.card.hoverBackgroundColor;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = service.styles.card.backgroundColor;
            }}
          >
            <div
              className="draggable-element"
              style={{
                position: 'absolute',
                top: service.positions.shape.top,
                left: service.positions.shape.left,
                cursor: isSelected ? 'move' : 'default',
              }}
            >
              {isSelected && (
                <div
                  className="drag-handle"
                  onMouseDown={(e) => handleElementDragStart(e, index, 'shape')}
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={service.styles.shape.width}
                height={service.styles.shape.height}
                viewBox="0 0 100 89"
                fill="none"
              >
                <path
                  d="M89.3997 20.1665C90.5806 21.4322 91.2497 23.0786 91.2607 24.7458C91.2717 26.4129 90.6237 27.965 89.4585 29.0627L82.7168 35.3787C83.8857 34.2836 85.4772 33.7354 87.141 33.8548C88.8049 33.9742 90.4049 34.7514 91.589 36.0153C92.7732 37.2792 93.4445 38.9265 93.4553 40.5946C93.4661 42.2627 92.8154 43.815 91.6465 44.9101L89.4391 46.9782C90.7021 46.1158 92.2814 45.7931 93.8594 46.075C95.4374 46.3569 96.897 47.2225 97.9445 48.4977C98.9919 49.7729 99.5496 51.363 99.5051 52.948C99.4607 54.5331 98.8175 55.9955 97.705 57.041L66.4218 86.3494C65.306 87.3914 63.8048 87.938 62.2202 87.8791C60.6357 87.8202 59.0853 87.1602 57.881 86.0319C56.6767 84.9037 55.908 83.3908 55.7294 81.7978C55.5509 80.2048 55.9757 78.6498 56.9185 77.4457L46.2874 87.4056C45.1185 88.5008 43.5271 89.0489 41.8632 88.9295C40.1994 88.8101 38.5994 88.033 37.4152 86.769C36.2311 85.5051 35.5598 83.8579 35.549 82.1898C35.5382 80.5217 36.1888 78.9693 37.3578 77.8742L42.5545 73.0055C41.5403 73.9509 40.2052 74.4903 38.7733 74.5334C37.3414 74.5764 35.8998 74.1205 34.6905 73.242C33.4812 72.3636 32.5777 71.1161 32.1318 69.7089C31.6858 68.3017 31.7245 66.8205 32.2413 65.5139L22.1964 74.9247C21.0275 76.0198 19.4361 76.5679 17.7722 76.4485C16.1084 76.3291 14.5084 75.552 13.3242 74.2881C12.1401 73.0241 11.4688 71.3769 11.458 69.7088C11.4472 68.0407 12.0978 66.4883 13.2667 65.3932L25.0674 54.3375C23.8985 55.4326 22.3071 55.9808 20.6432 55.8614C18.9794 55.742 17.3794 54.9649 16.1952 53.7009C15.0111 52.437 14.3398 50.7898 14.329 49.1217C14.3182 47.4536 14.9688 45.9012 16.1377 44.8061L11.4359 49.2111C10.267 50.3062 8.67555 50.8544 7.01169 50.735C5.34784 50.6156 3.74784 49.8384 2.56369 48.5745C1.37954 47.3106 0.708235 45.6633 0.697453 43.9952C0.686672 42.3271 1.3373 40.7748 2.5062 39.6797L35.5613 8.71135C36.7302 7.61624 38.3217 7.06808 39.9855 7.18747C41.6494 7.30686 43.2494 8.08401 44.4335 9.34795C45.6177 10.6119 46.289 12.2591 46.2998 13.9272C46.3105 15.5953 45.6599 17.1477 44.491 18.2428L61.4956 2.31173C62.6645 1.21663 64.2559 0.668477 65.9198 0.787863C67.5836 0.90725 69.1836 1.6844 70.3678 2.94834C71.5519 4.21229 72.2232 5.8595 72.234 7.5276C72.2448 9.19571 71.5942 10.7481 70.4253 11.8432L65.2285 16.7119C66.242 15.7657 67.5766 15.2252 69.0084 15.181C70.4403 15.1369 71.8821 15.5918 73.092 16.4694C74.3019 17.3471 75.2063 18.594 75.6532 20.001C76.1001 21.4079 76.0625 22.8893 75.5466 24.1964L80.5275 19.5299C81.699 18.4397 83.2895 17.8948 84.9518 18.014C86.6141 18.1333 88.2131 18.9071 89.3997 20.1665Z"
                  fill={service.styles.shape.fill}
                />
              </svg>
            </div>
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
                  width: service.styles.image.width,
                  height: service.styles.image.height,
                  objectFit: 'contain',
                  borderRadius: service.styles.image.borderRadius,
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
                width: parseInt(service.styles.card.width) - 40,
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
             

            <h3 style={{ ...service.styles.title, margin: 0 }}>
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
                width: parseInt(service.styles.card.width) - 40,
                height: expandedServices[service.id] 
                  ? parseInt(service.styles.card.height) - service.positions.description.top - 80 // Hauteur complète moins l'espace pour le bouton
                  : service.positions.button.top - service.positions.description.top - 10, // Hauteur jusqu'au bouton
                overflow: expandedServices[service.id] ? 'auto' : 'hidden',
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
                ...service.styles.description, 
                margin: 0,
                wordWrap: 'break-word',
              }}>
                {service.description}
              </p>
            </div>
            <div
              className="draggable-element"
              style={{
                position: 'absolute',
                top: service.positions.button.top,
                left: service.positions.button.left,
                cursor: isSelected ? 'move' : 'default',
              }}
            >
              {isSelected && (
                <div
                  className="drag-handle"
                  onMouseDown={(e) => handleElementDragStart(e, index, 'button')}
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
              <button
                style={{
                  ...service.styles.button,
                  cursor: 'pointer',
                  padding: '8px 16px',
                  border: 'none',
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = service.styles.button.hoverColor;
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = service.styles.button.backgroundColor;
                }}
                onClick={() => toggleDescriptionExpansion(service.id)}
              >
                {expandedServices[service.id] ? 'VOIR MOINS' : 'LIRE PLUS'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}