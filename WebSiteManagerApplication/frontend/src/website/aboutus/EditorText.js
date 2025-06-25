// import React, { useState, useRef, useEffect } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faArrowsUpDownLeftRight, faTimes, faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons';

// export default function EditorText({ elementType, initialPosition = { top: 0, left: 0 }, initialStyles = { fontSize: '1rem', width: '100%' }, children, onSelect }) {
//   const [position, setPosition] = useState({
//     top: initialPosition.top || 0,
//     left: typeof initialPosition.left === 'number' ? initialPosition.left : 0,
//   });
//   const [styles, setStyles] = useState({
//     color: initialStyles.color || '#000000',
//     fontSize: initialStyles.fontSize || '1rem',
//     fontFamily: initialStyles.fontFamily || 'Arial',
//     width: initialStyles.width || '100%',
//     maxWidth: initialStyles.maxWidth || 'none',
//     marginBottom: initialStyles.marginBottom || '0',
//     backgroundColor: initialStyles.backgroundColor || 'transparent',
//     fontWeight: initialStyles.fontWeight || 'normal',
//     fontStyle: initialStyles.fontStyle || 'normal',
//     textDecoration: initialStyles.textDecoration || 'none',
//   });
//   const [textContent, setTextContent] = useState(children || '');
//   const [isDragging, setIsDragging] = useState(false);
//   const [isEditingStyles, setIsEditingStyles] = useState(false);
//   const [isEditingText, setIsEditingText] = useState(false);
//   const [isSelected, setIsSelected] = useState(false);
//   const offset = useRef({ x: 0, y: 0 });
//   const inputRef = useRef(null);

//   useEffect(() => {
//     if (isDragging) {
//       document.addEventListener('mousemove', handleMouseMove);
//       document.addEventListener('mouseup', handleMouseUp);
//     } else {
//       document.removeEventListener('mousemove', handleMouseMove);
//       document.removeEventListener('mouseup', handleMouseUp);
//     }

//     return () => {
//       document.removeEventListener('mousemove', handleMouseMove);
//       document.removeEventListener('mouseup', handleMouseUp);
//     };
//   }, [isDragging]);

//   useEffect(() => {
//     if (isEditingText && inputRef.current) {
//       inputRef.current.focus();
//     }
//   }, [isEditingText]);

//   const handleMouseDown = (e) => {
//     e.stopPropagation();
//     offset.current = {
//       x: e.clientX - position.left,
//       y: e.clientY - position.top,
//     };
//     setIsDragging(true);
//   };

//   const handleMouseMove = (e) => {
//     if (isDragging) {
//       requestAnimationFrame(() => {
//         setPosition({
//           top: e.clientY - offset.current.y,
//           left: e.clientX - offset.current.x,
//         });
//       });
//     }
//   };

//   const handleMouseUp = () => {
//     setIsDragging(false);
//   };

//   const handleElementClick = (e) => {
//     e.stopPropagation();
//     setIsSelected(true);
//     if (onSelect) onSelect(elementType);
//   };

//   const handleTextDoubleClick = (e) => {
//     e.stopPropagation();
//     setIsEditingText(true);
//     setIsSelected(true);
//   };

//   const handleTextChange = (e) => {
//     setTextContent(e.target.value);
//   };

//   const handleTextBlur = () => {
//     setIsEditingText(false);
//   };

//   const handleTextKeyDown = (e) => {
//     if (e.key === 'Enter') {
//       setIsEditingText(false);
//     }
//   };

//   const handleStyleChange = (property, value) => {
//     setStyles((prev) => ({
//       ...prev,
//       [property]: value,
//     }));
//   };

//   const toggleBold = () => {
//     handleStyleChange('fontWeight', styles.fontWeight === 'bold' ? 'normal' : 'bold');
//   };

//   const toggleItalic = () => {
//     handleStyleChange('fontStyle', styles.fontStyle === 'italic' ? 'normal' : 'italic');
//   };

//   const toggleUnderline = () => {
//     handleStyleChange('textDecoration', styles.textDecoration === 'underline' ? 'none' : 'underline');
//   };

//   const renderControlButtons = () => {
//     if (!isSelected) return null;

//     return (
//       <div
//         className="element-controls"
//         style={{
//           position: 'absolute',
//           top: position.top - 40,
//           left: position.left,
//           display: 'flex',
//           flexDirection: 'column',
//           alignItems: 'center',
//           gap: '5px',
//           backgroundColor: '#fff',
//           padding: '8px',
//           border: '1px solid #ccc',
//           borderRadius: '4px',
//           zIndex: 1000,
//         }}
//       >
//         <button
//           onMouseDown={handleMouseDown}
//           style={{
//             cursor: 'grab',
//             fontSize: '16px',
//             color: '#000',
//             background: '#fff',
//             border: '1px solid #ccc',
//             borderRadius: '4px',
//             padding: '4px',
//           }}
//         >
//           <FontAwesomeIcon icon={faArrowsUpDownLeftRight} />
//         </button>
//         <button
//           onClick={() => setIsEditingStyles(true)}
//           style={{
//             cursor: 'pointer',
//             fontSize: '16px',
//             color: '#000',
//             background: '#fff',
//             border: '1px solid #ccc',
//             borderRadius: '4px',
//             padding: '4px',
//           }}
//         >
//           <FontAwesomeIcon icon={faWandMagicSparkles} />
//         </button>
//       </div>
//     );
//   };

//   const Tag = elementType || 'span';

//   return (
//     <div
//       onClick={() => setIsSelected(false)}
//       style={{ position: 'relative' }}
//     >
//       {renderControlButtons()}
//       {isEditingStyles && (
//         <div
//           className="style-editor-panel visible"
//           style={{
//             position: 'absolute',
//             top: `${position.top || 0}px`,
//             left: `${(position.left || 0) + 300}px`,
//             backgroundColor: 'white',
//             padding: '20px',
//             borderRadius: '8px',
//             boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
//             zIndex: 100,
//           }}
//         >
//           <button
//             onClick={() => setIsEditingStyles(false)}
//             style={{
//               position: 'absolute',
//               top: '5px',
//               right: '5px',
//               background: 'transparent',
//               border: 'none',
//               cursor: 'pointer',
//               fontSize: '16px',
//               color: '#999',
//             }}
//             aria-label="Close editor"
//           >
//             <FontAwesomeIcon icon={faTimes} />
//           </button>

//           <div className="style-controls">
//             <h3>Edit {elementType} Style</h3>
//             <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
//               <button
//                 onClick={toggleBold}
//                 style={{
//                   padding: '5px 10px',
//                   backgroundColor: styles.fontWeight === 'bold' ? '#ccc' : '#fff',
//                   border: '1px solid #ccc',
//                   borderRadius: '4px',
//                   cursor: 'pointer',
//                 }}
//               >
//                 <strong>B</strong>
//               </button>
//               <button
//                 onClick={toggleItalic}
//                 style={{
//                   padding: '5px 10px',
//                   backgroundColor: styles.fontStyle === 'italic' ? '#ccc' : '#fff',
//                   border: '1px solid #ccc',
//                   borderRadius: '4px',
//                   cursor: 'pointer',
//                 }}
//               >
//                 <em>I</em>
//               </button>
//               <button
//                 onClick={toggleUnderline}
//                 style={{
//                   padding: '5px 10px',
//                   backgroundColor: styles.textDecoration === 'underline' ? '#ccc' : '#fff',
//                   border: '1px solid #ccc',
//                   borderRadius: '4px',
//                   cursor: 'pointer',
//                 }}
//               >
//                 <u>U</u>
//               </button>
//             </div>
//             <div>
//               <label>Color: </label>
//               <input
//                 type="color"
//                 value={styles.color}
//                 onChange={(e) => handleStyleChange('color', e.target.value)}
//               />
//             </div>
//             <div>
//               <label>Font Size: </label>
//               <input
//                 type="range"
//                 min="0.5"
//                 max="3"
//                 step="0.1"
//                 value={parseFloat(styles.fontSize)}
//                 onChange={(e) => handleStyleChange('fontSize', `${e.target.value}rem`)}
//               />
//             </div>
//             <div>
//               <label>Font Family: </label>
//               <select
//                 value={styles.fontFamily}
//                 onChange={(e) => handleStyleChange('fontFamily', e.target.value)}
//               >
//                 <option value="Arial" style={{ fontFamily: 'Arial' }}>Arial</option>
//                 <option value="Times New Roman" style={{ fontFamily: 'Times New Roman' }}>Times New Roman</option>
//                 <option value="Courier New" style={{ fontFamily: 'Courier New' }}>Courier New</option>
//                 <option value="Georgia" style={{ fontFamily: 'Georgia' }}>Georgia</option>
//                 <option value="Verdana" style={{ fontFamily: 'Verdana' }}>Verdana</option>
//                 <option value="Tahoma" style={{ fontFamily: 'Tahoma' }}>Tahoma</option>
//                 <option value="Trebuchet MS" style={{ fontFamily: 'Trebuchet MS' }}>Trebuchet MS</option>
//                 <option value="Bookman" style={{ fontFamily: 'Bookman' }}>Bookman</option>
//                 <option value="Comic Sans MS" style={{ fontFamily: 'Comic Sans MS' }}>Comic Sans MS</option>
//                 <option value="Impact" style={{ fontFamily: 'Impact' }}>Impact</option>
//                 <option value="Lucida Sans Unicode" style={{ fontFamily: 'Lucida Sans Unicode' }}>Lucida Sans Unicode</option>
//                 <option value="Geneva" style={{ fontFamily: 'Geneva' }}>Geneva</option>
//                 <option value="Lucida Console" style={{ fontFamily: 'Lucida Console' }}>Lucida Console</option>
//                 <option value="Lucida Bright" style={{ fontFamily: 'Lucida Bright' }}>Lucida Bright</option>
//               </select>
//             </div>
//             {elementType === 'button' && (
//               <div>
//                 <label>Background Color: </label>
//                 <input
//                   type="color"
//                   value={styles.backgroundColor}
//                   onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
//                 />
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//       <Tag
//         style={{ ...styles, position: 'absolute', top: position.top, left: position.left, cursor: 'pointer' }}
//         onClick={handleElementClick}
//       >
//         {isEditingText ? (
//           <input
//             ref={inputRef}
//             type="text"
//             value={textContent}
//             onChange={handleTextChange}
//             onBlur={handleTextBlur}
//             onKeyDown={handleTextKeyDown}
//             onClick={(e) => e.stopPropagation()}
//             style={{
//               width: '100%',
//               fontSize: styles.fontSize,
//               fontFamily: styles.fontFamily,
//               color: styles.color,
//               fontWeight: styles.fontWeight,
//               fontStyle: styles.fontStyle,
//               textDecoration: styles.textDecoration,
//               backgroundColor: 'transparent',
//               border: '1px solid #ccc',
//               padding: '2px 4px',
//               outline: 'none',
//             }}
//           />
//         ) : (
//           <span onDoubleClick={handleTextDoubleClick}>{textContent}</span>
//         )}
//       </Tag>
//     </div>
//   );
// }



import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsUpDownLeftRight, faTimes, faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_URL = 'http://localhost:5000/couleurs';
export default function EditorText({
  elementType,
  initialPosition = { top: 0, left: 0 },
  initialStyles = { fontSize: '1rem', width: '100%' },
  children,
  onSelect,
  onPositionChange,
  onStyleChange,
  onTextChange, // New prop for text changes
}) {
  const [position, setPosition] = useState({
    top: initialPosition.top || 0,
    left: typeof initialPosition.left === 'number' ? initialPosition.left : 0,
  });
  const [styles, setStyles] = useState({
    color: initialStyles.color || '#000000',
    fontSize: initialStyles.fontSize || '1rem',
    fontFamily: initialStyles.fontFamily || 'Arial',
    width: initialStyles.width || '100%',
    maxWidth: initialStyles.maxWidth || 'none',
    marginBottom: initialStyles.marginBottom || '0',
    backgroundColor: initialStyles.backgroundColor || 'transparent',
    fontWeight: initialStyles.fontWeight || 'normal',
    fontStyle: initialStyles.fontStyle || 'normal',
    textDecoration: initialStyles.textDecoration || 'none',
  });
  const [textContent, setTextContent] = useState(children || '');
  const [isDragging, setIsDragging] = useState(false);
  const [isEditingStyles, setIsEditingStyles] = useState(false);
  const [isEditingText, setIsEditingText] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const offset = useRef({ x: 0, y: 0 });
  const inputRef = useRef(null);
  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userEntreprise, setUserEntreprise] = useState(null);

  // Notify parent of position changes
  useEffect(() => {
    if (onPositionChange) {
      // console.log(`Notifying parent of position change:`, position);
      onPositionChange(position);
    }
  }, [position, onPositionChange]);

  // Notify parent of style changes
  useEffect(() => {
    if (onStyleChange) {
      // console.log(`Notifying parent of style change:`, styles);
      onStyleChange(styles);
    }
  }, [styles, onStyleChange]);

  // Notify parent of text content changes
  useEffect(() => {
    if (onTextChange) {
      // console.log(`Notifying parent of text change:`, textContent);
      onTextChange(textContent);
    }
  }, [textContent, onTextChange]);

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

  useEffect(() => {
    if (isEditingText && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditingText]);



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
    if (onSelect) onSelect(elementType);
  };

  const handleTextDoubleClick = (e) => {
    e.stopPropagation();
    setIsEditingText(true);
    setIsSelected(true);
  };

  const handleTextChange = (e) => {
    setTextContent(e.target.value);
  };

  const handleTextBlur = () => {
    setIsEditingText(false);
  };

  const handleTextKeyDown = (e) => {
    if (e.key === 'Enter') {
      setIsEditingText(false);
    }
  };

  const handleStyleChange = (property, value) => {
    setStyles((prev) => ({
      ...prev,
      [property]: value,
    }));
  };

  const toggleBold = () => {
    handleStyleChange('fontWeight', styles.fontWeight === 'bold' ? 'normal' : 'bold');
  };

  const toggleItalic = () => {
    handleStyleChange('fontStyle', styles.fontStyle === 'italic' ? 'normal' : 'italic');
  };

  const toggleUnderline = () => {
    handleStyleChange('textDecoration', styles.textDecoration === 'underline' ? 'none' : 'underline');
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

  const Tag = elementType || 'span';

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
            <h3>Edit {elementType} Style</h3>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <button
                onClick={toggleBold}
                style={{
                  padding: '5px 10px',
                  backgroundColor: styles.fontWeight === 'bold' ? '#ccc' : '#fff',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                <strong>B</strong>
              </button>
              <button
                onClick={toggleItalic}
                style={{
                  padding: '5px 10px',
                  backgroundColor: styles.fontStyle === 'italic' ? '#ccc' : '#fff',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                <em>I</em>
              </button>
              <button
                onClick={toggleUnderline}
                style={{
                  padding: '5px 10px',
                  backgroundColor: styles.textDecoration === 'underline' ? '#ccc' : '#fff',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                <u>U</u>
              </button>
            </div>
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
                      onClick={() => handleStyleChange('color', c.couleur)}
                      style={{
                        width: '20px',
                        height: '20px',
                        backgroundColor: c.couleur,
                        border: styles.color === c.couleur ? '2px solid #000' : '1px solid #ccc',
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
                value={styles.color}
                onChange={(e) => handleStyleChange('color', e.target.value)}
              />
            </div>
            <div>
              <label>Font Size: </label>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.1"
                value={parseFloat(styles.fontSize)}
                onChange={(e) => handleStyleChange('fontSize', `${e.target.value}rem`)}
              />
            </div>
            <div>
              <label>Font Family: </label>
              <select
                value={styles.fontFamily}
                onChange={(e) => handleStyleChange('fontFamily', e.target.value)}
              >
                <option value="Arial" style={{ fontFamily: 'Arial' }}>Arial</option>
                <option value="Times New Roman" style={{ fontFamily: 'Times New Roman' }}>Times New Roman</option>
                <option value="Courier New" style={{ fontFamily: 'Courier New' }}>Courier New</option>
                <option value="Georgia" style={{ fontFamily: 'Georgia' }}>Georgia</option>
                <option value="Verdana" style={{ fontFamily: 'Verdana' }}>Verdana</option>
                <option value="Tahoma" style={{ fontFamily: 'Tahoma' }}>Tahoma</option>
                <option value="Trebuchet MS" style={{ fontFamily: 'Trebuchet MS' }}>Trebuchet MS</option>
                <option value="Bookman" style={{ fontFamily: 'Bookman' }}>Bookman</option>
                <option value="Comic Sans MS" style={{ fontFamily: 'Comic Sans MS' }}>Comic Sans MS</option>
                <option value="Impact" style={{ fontFamily: 'Impact' }}>Impact</option>
                <option value="Lucida Sans Unicode" style={{ fontFamily: 'Lucida Sans Unicode' }}>Lucida Sans Unicode</option>
                <option value="Geneva" style={{ fontFamily: 'Geneva' }}>Geneva</option>
                <option value="Lucida Console" style={{ fontFamily: 'Lucida Console' }}>Lucida Console</option>
                <option value="Lucida Bright" style={{ fontFamily: 'Lucida Bright' }}>Lucida Bright</option>
              </select>
            </div>
            {elementType === 'button' && (
              <div>
                <label>Background Color: </label>
                {/* {loading ? (
                  <span>Chargement des couleurs...</span>
                ) : error ? (
                  <span style={{ color: 'red' }}>{error}</span>
                ) : colors.length === 0 ? (
                  <span>Aucune couleur disponible.</span>
                ) : (
                  <select
                    value={styles.backgroundColor}
                    onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                    style={{ marginLeft: '10px', padding: '5px' }}
                  >
                    {colors.map((c) => (
                      <option
                        key={c._id}
                        value={c.couleur}
                        style={{ backgroundColor: c.couleur, color: '#000' }}
                      >
                        {c.couleur}
                      </option>
                    ))}
                  </select>
                )} */}
                <input
                  type="color"
                  value={styles.backgroundColor}
                  onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                />
              </div>
            )}
          </div>
        </div>
      )}
      <Tag
        style={{ ...styles, position: 'absolute', top: position.top, left: position.left, cursor: 'pointer' }}
        onClick={handleElementClick}
      >
        {isEditingText ? (
          <input
            ref={inputRef}
            type="text"
            value={textContent}
            onChange={handleTextChange}
            onBlur={handleTextBlur}
            onKeyDown={handleTextKeyDown}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              fontSize: styles.fontSize,
              fontFamily: styles.fontFamily,
              color: styles.color,
              fontWeight: styles.fontWeight,
              fontStyle: styles.fontStyle,
              textDecoration: styles.textDecoration,
              backgroundColor: 'transparent',
              border: '1px solid #ccc',
              padding: '2px 4px',
              outline: 'none',
            }}
          />
        ) : (
          <span onDoubleClick={handleTextDoubleClick}>{textContent}</span>
        )}
      </Tag>
    </div>
  );
}