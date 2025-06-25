import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsUpDownLeftRight, faTimes, faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_URL = 'http://localhost:5000/couleurs';

export default function EditorFaqList({
  faqs: initialFaqs,
  initialPosition,
  initialStyles,
  onSelect,
  onPositionChange,
  onStyleChange,
}) {
  const [position, setPosition] = useState(initialPosition || { top: 0, left: 0 });
  const [styles, setStyles] = useState(
    initialStyles || {
      button: {
        color: '#ffffff',
        backgroundColor: '#f59e0b',
        fontSize: '0.9375rem',
        fontFamily: 'Arial',
        borderRadius: '10px',
        hoverColor: '#d97706',
      },
      answer: {
        backgroundColor: '#f59e0b',
        color: '#ffffff',
        fontSize: '15px',
        fontFamily: 'Arial',
      },
      width: '600px',
      height: '400px',
    }
  );
  const [isDragging, setIsDragging] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [resizing, setResizing] = useState(null);
  const [faqs, setFaqs] = useState(initialFaqs);
  const [activeIndex, setActiveIndex] = useState(null);
  // const [editIndex, setEditIndex] = useState(null);
  // const [editField, setEditField] = useState(null);
  const offset = useRef({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userEntreprise, setUserEntreprise] = useState(null);


  useEffect(() => {
    // Initialize FAQ styles
    const updatedFaqs = initialFaqs.map((faq) => ({
      ...faq,
      styles: faq.styles || {
        button: styles.button,
        answer: styles.answer,
      },
    }));
    setFaqs(updatedFaqs);
  }, [initialFaqs, styles.button, styles.answer]);

  useEffect(() => {
    if (isDragging || resizing) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    } else {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
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

  const handleGlobalMouseMove = (e) => {
    if (isDragging) {
      const newPosition = {
        top: e.clientY - offset.current.y,
        left: e.clientX - offset.current.x,
      };
      setPosition(newPosition);
      if (onPositionChange) {
        onPositionChange(newPosition);
      }
    } else if (resizing) {
      const deltaX = e.clientX - offset.current.x;
      const deltaY = e.clientY - offset.current.y;

      let newWidth = styles.width || containerRef.current.offsetWidth;
      let newHeight = styles.height || containerRef.current.offsetHeight;

      if (resizing === 'bottom-right') {
        newWidth = offset.current.width + deltaX;
        newHeight = offset.current.height + deltaY;
      } else if (resizing === 'bottom-left') {
        newWidth = offset.current.width - deltaX;
        newHeight = offset.current.height + deltaY;
      } else if (resizing === 'top-right') {
        newWidth = offset.current.width + deltaX;
        newHeight = offset.current.height - deltaY;
      } else if (resizing === 'top-left') {
        newWidth = offset.current.width - deltaX;
        newHeight = offset.current.height - deltaY;
      }

      newWidth = Math.max(newWidth, 200);
      newHeight = Math.max(newHeight, 100);

      setStyles((prev) => {
        const newStyles = { ...prev, width: newWidth, height: newHeight };
        return newStyles;
      });
    }
  };

  const handleGlobalMouseUp = () => {
    setIsDragging(false);
    setResizing(null);
  };

  const handleResizeMouseDown = (handle, e) => {
    e.stopPropagation();
    setResizing(handle);
    offset.current = {
      x: e.clientX,
      y: e.clientY,
      width: styles.width || containerRef.current.offsetWidth,
      height: styles.height || containerRef.current.offsetHeight,
    };
  };

  const handleElementClick = (e) => {
    e.stopPropagation();
    setIsSelected(true);
    if (onSelect) onSelect('faqList');
  };

  const toggleFaq = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  // const handleEditFaq = (index, field, e) => {
  //   e.stopPropagation();
  //   setEditIndex(index);
  //   setEditField(field);
  // };

  // const handleFaqChange = (e) => {
  //   const newFaqs = [...faqs];
  //   newFaqs[editIndex] = {
  //     ...newFaqs[editIndex],
  //     [editField]: e.target.value,
  //   };
  //   setFaqs(newFaqs);
  // };

  // const handleBlur = () => {
  //   setEditIndex(null);
  //   setEditField(null);
  // };

  



  const handleStyleChange = (property, value, type) => {
  setStyles((prev) => {
    const newStyles = {
      ...prev,
      [type]: {
        ...prev[type],
        [property]: value,
      },
    };
    const updatedFaqs = faqs.map((faq) => ({
      ...faq,
      styles: {
        button: newStyles.button,
        answer: newStyles.answer,
      },
    }));
    setFaqs(updatedFaqs);
    updatedFaqs.forEach((faq) => {
      if (faq._id && onStyleChange) {
        onStyleChange(faq._id, faq.styles);
      }
    });
    return newStyles;
  });
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
          style={{ cursor: 'pointer', fontSize: '20px', color: 'black' }}
        >
          <FontAwesomeIcon icon={faWandMagicSparkles} />
        </button>
      </div>
    );
  };

  const renderResizeHandles = () => {
    if (!isSelected) return null;

    const handleSize = 8;
    const currentWidth = styles.width || containerRef.current?.offsetWidth || 600;
    const currentHeight = styles.height || containerRef.current?.offsetHeight || 400;

    const handles = [
      { name: 'top-left', cursor: 'nwse-resize', top: -handleSize / 2, left: -handleSize / 2 },
      { name: 'top-right', cursor: 'nesw-resize', top: -handleSize / 2, left: currentWidth - handleSize / 2 },
      { name: 'bottom-left', cursor: 'nesw-resize', top: currentHeight - handleSize / 2, left: -handleSize / 2 },
      { name: 'bottom-right', cursor: 'nwse-resize', top: currentHeight - handleSize / 2, left: currentWidth - handleSize / 2 },
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
      {isEditing && (
        <div
          className="style-editor-panel visible"
          style={{
            position: 'absolute',
            top: `${position.top || 0}px`,
            left: `${(position.left || 0) + (parseFloat(styles.width) || 600) + 20}px`,
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            zIndex: 100,
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
            <h3>Edit FAQ List Style</h3>

            <h4>Question Button</h4>
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
                        border: styles.button.color === c.couleur ? '2px solid #000' : '1px solid #ccc',
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
                value={styles.button.color}
                onChange={(e) => handleStyleChange('color', e.target.value, 'button')}
              />
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
                      onClick={() => handleStyleChange('backgroundColor', c.couleur, 'button')}
                      style={{
                        width: '20px',
                        height: '20px',
                        backgroundColor: c.couleur,
                        border: styles.button.backgroundColor === c.couleur ? '2px solid #000' : '1px solid #ccc',
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
                value={styles.button.backgroundColor}
                onChange={(e) => handleStyleChange('backgroundColor', e.target.value, 'button')}
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
                        border: styles.button.hoverColor === c.couleur ? '2px solid #000' : '1px solid #ccc',
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
                value={styles.button.hoverColor}
                onChange={(e) => handleStyleChange('hoverColor', e.target.value, 'button')}
              />
            </div>
            <div>
              <label>Font Size: </label>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.1"
                value={parseFloat(styles.button.fontSize)}
                onChange={(e) => handleStyleChange('fontSize', `${e.target.value}rem`, 'button')}
              />
            </div>
            <div>
              <label>Border Radius: </label>
              <input
                type="range"
                min="0"
                max="50"
                step="1"
                value={parseInt(styles.button.borderRadius || 0)}
                onChange={(e) => handleStyleChange('borderRadius', `${e.target.value}px`, 'button')}
              />
            </div>

            <h4>Answer Section</h4>
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
                      onClick={() => handleStyleChange('backgroundColor', c.couleur, 'answer')}
                      style={{
                        width: '20px',
                        height: '20px',
                        backgroundColor: c.couleur,
                        border: styles.answer.backgroundColor === c.couleur ? '2px solid #000' : '1px solid #ccc',
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
                value={styles.answer.backgroundColor}
                onChange={(e) => handleStyleChange('backgroundColor', e.target.value, 'answer')}
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
                      onClick={() => handleStyleChange('color', c.couleur, 'answer')}
                      style={{
                        width: '20px',
                        height: '20px',
                        backgroundColor: c.couleur,
                        border: styles.answer.color === c.couleur ? '2px solid #000' : '1px solid #ccc',
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
                value={styles.answer.color}
                onChange={(e) => handleStyleChange('color', e.target.value, 'answer')}
              />
            </div>
            <div>
              <label>Font Size: </label>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.1"
                value={parseFloat(styles.answer.fontSize)}
                onChange={(e) => handleStyleChange('fontSize', `${e.target.value}rem`, 'answer')}
              />
            </div>
          </div>
        </div>
      )}
      <div
        ref={containerRef}
        className="faq-list-container"
        style={{
          position: 'absolute',
          top: position.top,
          left: position.left,
          width: styles.width || 'auto',
          height: styles.height || 'auto',
          minWidth: '300px',
          minHeight: '200px',
          cursor: 'pointer',
        }}
        onClick={handleElementClick}
      >
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div key={faq._id || index} className={`faq-item ${activeIndex === index ? 'active' : ''}`}>
              <button
                className="faq-question-btn"
                onClick={() => toggleFaq(index)}
                style={{
                  color: faq.styles?.button?.color || styles.button.color,
                  backgroundColor: faq.styles?.button?.backgroundColor || styles.button.backgroundColor,
                  fontSize: faq.styles?.button?.fontSize || styles.button.fontSize,
                  fontFamily: faq.styles?.button?.fontFamily || styles.button.fontFamily,
                  borderRadius: faq.styles?.button?.borderRadius || styles.button.borderRadius,
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor =
                    faq.styles?.button?.hoverColor || styles.button.hoverColor;
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor =
                    faq.styles?.button?.backgroundColor || styles.button.backgroundColor;
                }}
              >
                {/* {editIndex === index && editField === 'question' ? (
                  <input
                    type="text"
                    value={faq.question}
                    onChange={handleFaqChange}
                    onBlur={handleBlur}
                    onClick={(e) => e.stopPropagation()}
                    autoFocus
                  />
                ) : (
                  <span onClick={(e) => handleEditFaq(index, 'question', e)}>{faq.question}</span>
                )} */}
                  <span 
                  // onClick={(e) => handleEditFaq(index, 'question', e)}
                    >{faq.question}</span>
                <span className="faq-toggle">{activeIndex === index ? '-' : '+'}</span>
              </button>
              <div
                className="faq-answer"
                style={{
                  backgroundColor: faq.styles?.answer?.backgroundColor || styles.answer.backgroundColor,
                  color: faq.styles?.answer?.color || styles.answer.color,
                  fontSize: faq.styles?.answer?.fontSize || styles.answer.fontSize,
                  fontFamily: faq.styles?.answer?.fontFamily || styles.answer.fontFamily,
                }}
              >
                {/* {editIndex === index && editField === 'answer' ? (
                  <textarea
                    value={faq.answer}
                    onChange={handleFaqChange}
                    onBlur={handleBlur}
                    onClick={(e) => e.stopPropagation()}
                    autoFocus
                    style={{
                      width: '100%',
                      minHeight: '100px',
                      backgroundColor: 'transparent',
                      color: 'inherit',
                      border: 'none',
                      outline: 'none',
                      resize: 'vertical',
                    }}
                  />
                ) : (
                  <p onClick={(e) => handleEditFaq(index, 'answer', e)}>{faq.answer}</p>
                )} */}
                  <p 
                  // onClick={(e) => handleEditFaq(index, 'answer', e)}
                  >{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}