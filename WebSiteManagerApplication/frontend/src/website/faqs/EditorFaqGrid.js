import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsUpDownLeftRight, faTimes, faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_URL = 'http://localhost:5000/couleurs';

export default function EditorFaqGrid({ faqs, initialPosition = { top: 0, left: 0 }, initialStyles = { width: 600, minHeight: 400 }, onSelect, onPositionChange, onStyleChange }) {
  const [position, setPosition] = useState({
    top: initialPosition.top || 0,
    left: typeof initialPosition.left === 'number' ? initialPosition.left : 0,
  });
  const [styles, setStyles] = useState({
    width: parseFloat(initialStyles.width) || 600,
    minHeight: parseFloat(initialStyles.minHeight) || 400,
  });
  const [faqData, setFaqData] = useState(faqs);
  const [isDragging, setIsDragging] = useState(false);
  const [isEditingStyles, setIsEditingStyles] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [resizing, setResizing] = useState(null);
  // const [editingFaqIndex, setEditingFaqIndex] = useState(null);
  // const [editingField, setEditingField] = useState(null);
  const offset = useRef({ x: 0, y: 0 });
  // const inputRef = useRef(null);
  const pendingStyles = useRef({}); // Stocke les styles en attente par FAQ

  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userEntreprise, setUserEntreprise] = useState(null);

useEffect(() => {
    const updatedFaqs = faqs.map((faq, index) => {
      // Utiliser les styles initiaux comme valeurs par défaut
      const defaultStyles = {
        card: {
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
        },
        question: {
          color: '#333333',
          fontSize: '1.125rem',
          fontFamily: 'Arial',
          fontWeight: 'normal',
          fontStyle: 'normal',
          textDecoration: 'none',
        },
        answer: {
          color: '#666666',
          fontSize: '1rem',
          fontFamily: 'Arial',
          fontWeight: 'normal',
          fontStyle: 'normal',
          textDecoration: 'none',
        },
      };

      return {
        ...faq,
        styles: faq.styles || defaultStyles,
      };
    });
    setFaqData(updatedFaqs);
  }, [faqs]);


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

  // useEffect(() => {
  //   if (editingFaqIndex !== null && inputRef.current) {
  //     inputRef.current.focus();
  //   }
  // }, [editingFaqIndex, editingField]);

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
        if (onPositionChange) {
          onPositionChange(newPosition);
        }
      });
    } else if (resizing) {
      const deltaX = e.clientX - offset.current.x;
      const deltaY = e.clientY - offset.current.y;

      let newWidth = styles.width;
      let newMinHeight = styles.minHeight;

      if (resizing === 'bottom-right') {
        newWidth = offset.current.width + deltaX;
        newMinHeight = offset.current.minHeight + deltaY;
      }

      newWidth = Math.max(newWidth, 300);
      newMinHeight = Math.max(newMinHeight, 200);

      setStyles((prev) => {
        const newStyles = {
          ...prev,
          width: newWidth,
          minHeight: newMinHeight,
        };
        pendingStyles.current = newStyles;
        return newStyles;
      });
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
      width: styles.width,
      minHeight: styles.minHeight,
    };
  };

  const handleElementClick = (e) => {
    e.stopPropagation();
    setIsSelected(true);
    if (onSelect) onSelect('faqGrid');
  };

  // const handleEditFaq = (index, field) => {
  //   setEditingFaqIndex(index);
  //   setEditingField(field);
  // };

  // const handleFaqChange = (e, index, field) => {
  //   const newFaqs = [...faqData];
  //   newFaqs[index] = { ...newFaqs[index], [field]: e.target.value };
  //   setFaqData(newFaqs);
  // };

  // const handleBlur = () => {
  //   setEditingFaqIndex(null);
  //   setEditingField(null);
  // };

  // const handleKeyDown = (e) => {
  //   if (e.key === 'Enter') {
  //     handleBlur();
  //   }
  // };


const handleStyleChange = (property, value, subProperty, faqIndex) => {
    setFaqData((prev) => {
      const newFaqs = [...prev];
      // Appliquer le style à toutes les FAQs
      newFaqs.forEach((faq) => {
        if (!faq.styles) {
          faq.styles = {
            card: {},
            question: {},
            answer: {},
          };
        }
        if (!faq.styles[subProperty]) {
          faq.styles[subProperty] = {};
        }
        faq.styles[subProperty][property] = value;
      });

      // Notifier le changement de style pour chaque FAQ
      newFaqs.forEach((faq) => {
        if (faq._id) {
          pendingStyles.current[faq._id] = faq.styles;
          if (onStyleChange) {
            onStyleChange(faq._id, faq.styles);
          }
        }
      });

      return newFaqs;
    });
  };

  const toggleTextStyle = (property, subProperty, value, defaultValue, faqIndex) => {
    const faq = faqData[faqIndex];
    const currentValue = faq.styles[subProperty][property] || defaultValue;
    handleStyleChange(property, currentValue === value ? defaultValue : value, subProperty, faqIndex);
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
        top: styles.minHeight - handleSize / 2,
        left: styles.width - handleSize / 2,
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
      {renderResizeHandles()}
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
            <h3>Edit FAQ Grid Style</h3>
            {faqData.map((faq, index) => (
              <div key={faq._id || index}>
                <h4>FAQ {index + 1}: {faq.question}</h4>
                <div>
                  <label>Card Background Color: </label>
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
                      onClick={() => handleStyleChange('backgroundColor', c.couleur, 'card', index )}
                      style={{
                        width: '20px',
                        height: '20px',
                        backgroundColor: c.couleur,
                        border: faq.styles.card.backgroundColor === c.couleur ? '2px solid #000' : '1px solid #ccc',
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
                    value={faq.styles.card.backgroundColor || '#ffffff'}
                    onChange={(e) => handleStyleChange('backgroundColor', e.target.value, 'card', index)}
                  />
                </div>
                <div>
                  <label>Card Border: </label>
                  <input
                    type="text"
                    value={faq.styles.card.border || '1px solid #e5e7eb'}
                    onChange={(e) => handleStyleChange('border', e.target.value, 'card', index)}
                    placeholder="e.g., 1px solid #e5e7eb"
                  />
                </div>
                <h5>Question Text Style</h5>
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
                      onClick={() => handleStyleChange('color', c.couleur, 'question', index)}
                      style={{
                        width: '20px',
                        height: '20px',
                        backgroundColor: c.couleur,
                        border: faq.styles.question.color === c.couleur ? '2px solid #000' : '1px solid #ccc',
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
                    value={faq.styles.question.color || '#333333'}
                    onChange={(e) => handleStyleChange('color', e.target.value, 'question', index)}
                  />
                </div>
                <div>
                  <label>Font Size: </label>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={parseFloat(faq.styles.question.fontSize || '1.125')}
                    onChange={(e) => handleStyleChange('fontSize', `${e.target.value}rem`, 'question', index)}
                  />
                </div>
                <div>
                  <label>Font Family: </label>
                  <select
                    value={faq.styles.question.fontFamily || 'Arial'}
                    onChange={(e) => handleStyleChange('fontFamily', e.target.value, 'question', index)}
                  >
                    <option value="Arial" style={{ fontFamily: 'Arial' }}>Arial</option>
                    <option value="Times New Roman" style={{ fontFamily: 'Times New Roman' }}>Times New Roman</option>
                    <option value="Courier New" style={{ fontFamily: 'Courier New' }}>Courier New</option>
                    <option value="Georgia" style={{ fontFamily: 'Georgia' }}>Georgia</option>
                    <option value="Verdana" style={{ fontFamily: 'Verdana' }}>Verdana</option>
                    <option value="Poppins" style={{ fontFamily: 'Poppins' }}>Poppins</option>
                    <option value="Roboto" style={{ fontFamily: 'Roboto' }}>Roboto</option>
                    <option value="Open Sans" style={{ fontFamily: 'Open Sans' }}>Open Sans</option>
                    <option value="Montserrat" style={{ fontFamily: 'Montserrat' }}>Montserrat</option>
                    <option value="Lato" style={{ fontFamily: 'Lato' }}>Lato</option>
                    <option value="Inter" style={{ fontFamily: 'Inter' }}>Inter</option>
                  </select>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => toggleTextStyle('fontWeight', 'question', 'bold', 'normal', index)}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: faq.styles.question.fontWeight === 'bold' ? '#ccc' : '#fff',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    <strong>B</strong>
                  </button>
                  <button
                    onClick={() => toggleTextStyle('fontStyle', 'question', 'italic', 'normal', index)}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: faq.styles.question.fontStyle === 'italic' ? '#ccc' : '#fff',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    <em>I</em>
                  </button>
                  <button
                    onClick={() => toggleTextStyle('textDecoration', 'question', 'underline', 'none', index)}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: faq.styles.question.textDecoration === 'underline' ? '#ccc' : '#fff',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    <u>U</u>
                  </button>
                </div>
                <h5>Answer Text Style</h5>
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
                      onClick={() => handleStyleChange('color', c.couleur, 'answer', index)}
                      style={{
                        width: '20px',
                        height: '20px',
                        backgroundColor: c.couleur,
                        border: faq.styles.answer.color === c.couleur ? '2px solid #000' : '1px solid #ccc',
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
                    value={faq.styles.answer.color || '#666666'}
                    onChange={(e) => handleStyleChange('color', e.target.value, 'answer', index)}
                  />
                </div>
                <div>
                  <label>Font Size: </label>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={parseFloat(faq.styles.answer.fontSize || '1')}
                    onChange={(e) => handleStyleChange('fontSize', `${e.target.value}rem`, 'answer', index)}
                  />
                </div>
                <div>
                  <label>Font Family: </label>
                  <select
                    value={faq.styles.answer.fontFamily || 'Arial'}
                    onChange={(e) => handleStyleChange('fontFamily', e.target.value, 'answer', index)}
                  >
                    <option value="Arial" style={{ fontFamily: 'Arial' }}>Arial</option>
                    <option value="Times New Roman" style={{ fontFamily: 'Times New Roman' }}>Times New Roman</option>
                    <option value="Courier New" style={{ fontFamily: 'Courier New' }}>Courier New</option>
                    <option value="Georgia" style={{ fontFamily: 'Georgia' }}>Georgia</option>
                    <option value="Verdana" style={{ fontFamily: 'Verdana' }}>Verdana</option>
                    <option value="Poppins" style={{ fontFamily: 'Poppins' }}>Poppins</option>
                    <option value="Roboto" style={{ fontFamily: 'Roboto' }}>Roboto</option>
                    <option value="Open Sans" style={{ fontFamily: 'Open Sans' }}>Open Sans</option>
                    <option value="Montserrat" style={{ fontFamily: 'Montserrat' }}>Montserrat</option>
                    <option value="Lato" style={{ fontFamily: 'Lato' }}>Lato</option>
                    <option value="Inter" style={{ fontFamily: 'Inter' }}>Inter</option>
                  </select>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => toggleTextStyle('fontWeight', 'answer', 'bold', 'normal', index)}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: faq.styles.answer.fontWeight === 'bold' ? '#ccc' : '#fff',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    <strong>B</strong>
                  </button>
                  <button
                    onClick={() => toggleTextStyle('fontStyle', 'answer', 'italic', 'normal', index)}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: faq.styles.answer.fontStyle === 'italic' ? '#ccc' : '#fff',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    <em>I</em>
                  </button>
                  <button
                    onClick={() => toggleTextStyle('textDecoration', 'answer', 'underline', 'none', index)}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: faq.styles.answer.textDecoration === 'underline' ? '#ccc' : '#fff',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    <u>U</u>
                  </button>
                </div>
              </div>
            ))}
            <div>
              <label>Grid Width: </label>
              <input
                type="number"
                min="300"
                value={styles.width}
                onChange={(e) => {
                  const newWidth = parseInt(e.target.value);
                  setStyles((prev) => ({ ...prev, width: newWidth }));
                  pendingStyles.current = { ...styles, width: newWidth };
                }}
              />
            </div>
            <div>
              <label>Grid Min Height: </label>
              <input
                type="number"
                min="200"
                value={styles.minHeight}
                onChange={(e) => {
                  const newMinHeight = parseInt(e.target.value);
                  setStyles((prev) => ({ ...prev, minHeight: newMinHeight }));
                  pendingStyles.current = { ...styles, minHeight: newMinHeight };
                }}
              />
            </div>
          </div>
        </div>
      )}
      


      <div
        className="faq-grid style-two"
        style={{
          position: 'absolute',
          top: position.top,
          left: position.left,
          width: styles.width,
          minHeight: styles.minHeight,
          cursor: 'pointer',
        }}
        onClick={handleElementClick}
      >
        {faqData.map((faq, index) => (
          <div
            key={faq._id || index}
            className="faq-card"
            style={{
              backgroundColor: faq.styles?.card?.backgroundColor || '#ffffff',
              border: faq.styles?.card?.border || '1px solid #e5e7eb',
              marginBottom: '15px',
              padding: '15px',
              borderRadius: '8px',
            }}
          >
            {/* {editingFaqIndex === index && editingField === 'question' ? (
              <input
                ref={inputRef}
                type="text"
                value={faq.question}
                onChange={(e) => handleFaqChange(e, index, 'question')}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                style={{
                  width: '100%',
                  fontSize: faq.styles?.question?.fontSize || '1.125rem',
                  fontFamily: faq.styles?.question?.fontFamily || 'Arial',
                  color: faq.styles?.question?.color || '#333333',
                  fontWeight: faq.styles?.question?.fontWeight || 'normal',
                  fontStyle: faq.styles?.question?.fontStyle || 'normal',
                  textDecoration: faq.styles?.question?.textDecoration || 'none',
                  padding: '4px',
                  border: '1px solid #ccc',
                  outline: 'none',
                }}
              />
            ) : (
              <h4
                onClick={() => handleEditFaq(index, 'question')}
                style={{
                  fontSize: faq.styles?.question?.fontSize || '1.125rem',
                  fontFamily: faq.styles?.question?.fontFamily || 'Arial',
                  color: faq.styles?.question?.color || '#333333',
                  fontWeight: faq.styles?.question?.fontWeight || 'normal',
                  fontStyle: faq.styles?.question?.fontStyle || 'normal',
                  textDecoration: faq.styles?.question?.textDecoration || 'none',
                  margin: '0 0 10px',
                  cursor: 'pointer',
                }}
              >
                {faq.question}
              </h4>
            )} */}

              <h4
                // onClick={() => handleEditFaq(index, 'question')}
                style={{
                  fontSize: faq.styles?.question?.fontSize || '1.125rem',
                  fontFamily: faq.styles?.question?.fontFamily || 'Arial',
                  color: faq.styles?.question?.color || '#333333',
                  fontWeight: faq.styles?.question?.fontWeight || 'normal',
                  fontStyle: faq.styles?.question?.fontStyle || 'normal',
                  textDecoration: faq.styles?.question?.textDecoration || 'none',
                  margin: '0 0 10px',
                  cursor: 'pointer',
                }}
              >
                {faq.question}
              </h4>

            {/* {editingFaqIndex === index && editingField === 'answer' ? (
              <textarea
                ref={inputRef}
                value={faq.answer}
                onChange={(e) => handleFaqChange(e, index, 'answer')}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                style={{
                  width: '100%',
                  fontSize: faq.styles?.answer?.fontSize || '1rem',
                  fontFamily: faq.styles?.answer?.fontFamily || 'Arial',
                  color: faq.styles?.answer?.color || '#666666',
                  fontWeight: faq.styles?.answer?.fontWeight || 'normal',
                  fontStyle: faq.styles?.answer?.fontStyle || 'normal',
                  textDecoration: faq.styles?.answer?.textDecoration || 'none',
                  padding: '4px',
                  border: '1px solid #ccc',
                  outline: 'none',
                  resize: 'none',
                  minHeight: '60px',
                }}
              />
            ) : (
              <p
                onClick={() => handleEditFaq(index, 'answer')}
                style={{
                  fontSize: faq.styles?.answer?.fontSize || '1rem',
                  fontFamily: faq.styles?.answer?.fontFamily || 'Arial',
                  color: faq.styles?.answer?.color || '#666666',
                  fontWeight: faq.styles?.answer?.fontWeight || 'normal',
                  fontStyle: faq.styles?.answer?.fontStyle || 'normal',
                  textDecoration: faq.styles?.answer?.textDecoration || 'none',
                  margin: '0',
                  cursor: 'pointer',
                }}
              >
                {faq.answer}
              </p>
            )} */}
            <p
                // onClick={() => handleEditFaq(index, 'answer')}
                style={{
                  fontSize: faq.styles?.answer?.fontSize || '1rem',
                  fontFamily: faq.styles?.answer?.fontFamily || 'Arial',
                  color: faq.styles?.answer?.color || '#666666',
                  fontWeight: faq.styles?.answer?.fontWeight || 'normal',
                  fontStyle: faq.styles?.answer?.fontStyle || 'normal',
                  textDecoration: faq.styles?.answer?.textDecoration || 'none',
                  margin: '0',
                  cursor: 'pointer',
                }}
              >
                {faq.answer}
              </p>
          </div>
        ))}
      </div>
    </div>
  );
}