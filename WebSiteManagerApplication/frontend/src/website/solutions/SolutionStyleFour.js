// import React, { useState, useRef, useEffect } from 'react';
// import './OurSolutions.css';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faWandMagicSparkles, faTimes, faArrowsUpDownLeftRight } from '@fortawesome/free-solid-svg-icons';
// import EditorText from '../aboutus/EditorText';
// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
// import axios from 'axios';
// import { jwtDecode } from 'jwt-decode';

// const API_URL = 'http://localhost:5000/couleurs';

// export default function SolutionStyleFour({ solutions }) {
//   // States pour l'édition
//   const [showEditor, setShowEditor] = useState(false);
//   const [texts, setTexts] = useState({
//     sectionName: 'NOS SOLUTIONS',
//     sectionDesc: 'Customizable Solutions that are Easy to Adapt',
//   });
//   const [styles, setStyles] = useState({
//     overlayColor: 'rgba(1, 66, 104, 0.6)',
//     cardWidth: 400,
//     cardHeight: 300,
//     cardRadius: 15,
//     title: {
//       color: '#fff',
//       fontSize: '24px',
//       fontWeight: '600',
//       fontFamily: 'Arial',
//       textAlign: 'left',
//       fontStyle: 'normal',
//       textDecoration: 'none',
//       marginRight: 20,
//     },
//     desc: {
//       color: '#fff',
//       fontSize: '15px',
//       fontWeight: 'normal',
//       fontFamily: 'Arial',
//       textAlign: 'left',
//       fontStyle: 'normal',
//       textDecoration: 'none',
//       lineHeight: 1.5,
//     },
//     grid: {
//       width: 1600,
//       minHeight: 400,
//       top: 0,
//       left: 0,
//     },
//   });
//   const [cardOrder, setCardOrder] = useState(solutions.map((_, i) => i));
//   const [overlayAlpha, setOverlayAlpha] = useState(parseFloat(styles.overlayColor.split(',')[3]) || 0.6);
//   const [isSelected, setIsSelected] = useState(false);
//   const [isDragging, setIsDragging] = useState(false);
//   const [resizing, setResizing] = useState(null);
//   const offset = useRef({ x: 0, y: 0 });
//   const [colors, setColors] = useState([]);
//   const [userEntreprise, setUserEntreprise] = useState(null);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);

//    // Fetch user enterprise
//    useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       try {
//         const decodedToken = jwtDecode(token);
//         const userId = decodedToken?.sub;
//         if (userId) {
//           axios
//             .get(`http://localhost:5000/auth/user/${userId}`, {
//               headers: { Authorization: `Bearer ${token}` },
//             })
//             .then((response) => {
//               setUserEntreprise(response.data.entreprise);
//               setLoading(false);
//             })
//             .catch((err) => {
//               console.error('Error fetching user data:', err);
//               setError('Erreur lors de la récupération des données utilisateur.');
//               setLoading(false);
//             });
//         } else {
//           setError('ID utilisateur manquant.');
//           setLoading(false);
//         }
//       } catch (err) {
//         console.error('Error decoding token:', err);
//         setError('Erreur lors du décodage du token.');
//         setLoading(false);
//       }
//     } else {
//       console.log('Token is missing from localStorage, continuing without authentication');
//       setLoading(false);
//     }
//   }, []);

//   // Fetch company colors
//   useEffect(() => {
//     if (userEntreprise) {
//       axios
//         .get(`${API_URL}/entreprise/${userEntreprise}/couleurs`, {
//           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//         })
//         .then((res) => {
//           setColors(res.data);
//         })
//         .catch((err) => {
//           console.error('Erreur lors de la récupération des couleurs:', err);
//           setError('Erreur lors de la récupération des couleurs.');
//         });
//     }
//   }, [userEntreprise]);


//   // Mock colors for the color palette (since no API)
//   // const colors = [
//   //   { _id: '1', couleur: '#ffffff' },
//   //   { _id: '2', couleur: '#000000' },
//   //   { _id: '3', couleur: '#014268' },
//   //   { _id: '4', couleur: '#f59f0b' },
//   //   { _id: '5', couleur: '#555555' },
//   //   { _id: '6', couleur: '#2196f3' },
//   // ];

//   // Handlers édition
//   const handleTextChange = (key, value) => {
//     setTexts((prev) => ({ ...prev, [key]: value }));
//   };
//   const handleStyleChange = (key, value) => {
//     setStyles((prev) => ({ ...prev, [key]: value }));
//   };
//   const handleTitleStyleChange = (key, value) => {
//     setStyles((prev) => ({ ...prev, title: { ...prev.title, [key]: value } }));
//   };
//   const handleDescStyleChange = (key, value) => {
//     setStyles((prev) => ({ ...prev, desc: { ...prev.desc, [key]: value } }));
//   };
//   const handleGridStyleChange = (key, value) => {
//     setStyles((prev) => ({ ...prev, grid: { ...prev.grid, [key]: value } }));
//   };
//   const toggleTextStyle = (property, subProperty, value, defaultValue) => {
//     const currentValue = styles[subProperty][property] || defaultValue;
//     if (subProperty === 'title') {
//       handleTitleStyleChange(property, currentValue === value ? defaultValue : value);
//     } else {
//       handleDescStyleChange(property, currentValue === value ? defaultValue : value);
//     }
//   };

//   // Drag & drop handler
//   const onDragEnd = (result) => {
//     if (!result.destination) return;
//     const newOrder = Array.from(cardOrder);
//     const [removed] = newOrder.splice(result.source.index, 1);
//     newOrder.splice(result.destination.index, 0, removed);
//     setCardOrder(newOrder);
//   };

//   // Overlay color/alpha handler
//   const handleOverlayColorChange = (color) => {
//     const rgba = styles.overlayColor.startsWith('rgba') ? styles.overlayColor.match(/rgba?\(([^)]+)\)/)[1].split(',') : [1, 66, 104, overlayAlpha];
//     setStyles((prev) => ({
//       ...prev,
//       overlayColor: `rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, ${overlayAlpha})`,
//     }));
//   };
//   const handleOverlayAlphaChange = (alpha) => {
//     setOverlayAlpha(alpha);
//     const rgba = styles.overlayColor.startsWith('rgba') ? styles.overlayColor.match(/rgba?\(([^)]+)\)/)[1].split(',') : [1, 66, 104, alpha];
//     setStyles((prev) => ({
//       ...prev,
//       overlayColor: `rgba(${rgba[0]}, ${rgba[1]}, ${rgba[2]}, ${alpha})`,
//     }));
//   };

//   // Drag and resize handlers
//   const handleMouseDown = (e) => {
//     e.stopPropagation();
//     offset.current = {
//       x: e.clientX - styles.grid.left,
//       y: e.clientY - styles.grid.top,
//     };
//     setIsDragging(true);
//   };

//   const handleMouseMove = (e) => {
//     if (isDragging) {
//       requestAnimationFrame(() => {
//         const newPosition = {
//           top: e.clientY - offset.current.y,
//           left: e.clientX - offset.current.x,
//         };
//         setStyles((prev) => ({
//           ...prev,
//           grid: { ...prev.grid, ...newPosition },
//         }));
//       });
//     } else if (resizing) {
//       const deltaX = e.clientX - offset.current.x;
//       const deltaY = e.clientY - offset.current.y;
//       let newWidth = styles.grid.width;
//       let newMinHeight = styles.grid.minHeight;
//       if (resizing === 'bottom-right') {
//         newWidth = offset.current.width + deltaX;
//         newMinHeight = offset.current.minHeight + deltaY;
//       }
//       newWidth = Math.max(newWidth, 300);
//       newMinHeight = Math.max(newMinHeight, 200);
//       setStyles((prev) => ({
//         ...prev,
//         grid: { ...prev.grid, width: newWidth, minHeight: newMinHeight },
//       }));
//     }
//   };

//   const handleMouseUp = () => {
//     setIsDragging(false);
//     setResizing(null);
//   };

//   const handleResizeMouseDown = (handle, e) => {
//     e.stopPropagation();
//     setResizing(handle);
//     offset.current = {
//       x: e.clientX,
//       y: e.clientY,
//       width: styles.grid.width,
//       minHeight: styles.grid.minHeight,
//     };
//   };

//   const handleElementClick = (e) => {
//     e.stopPropagation();
//     setIsSelected(true);
//   };

//   useEffect(() => {
//     if (isDragging || resizing) {
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
//   }, [isDragging, resizing]);

//   const renderControlButtons = () => {
//     if (!isSelected) return null;
//     return (
//       <div
//         className="element-controls"
//         style={{
//           position: 'absolute',
//           top: styles.grid.top,
//           left: styles.grid.left,
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
//             background: 'white',
//             border: '1px solid #ccc',
//             borderRadius: '4px',
//             padding: '4px',
//           }}
//           title="Déplacer la grille"
//         >
//           <FontAwesomeIcon icon={faArrowsUpDownLeftRight} />
//         </button>
//         <button
//           onClick={() => setShowEditor(true)}
//           style={{
//             cursor: 'pointer',
//             fontSize: '16px',
//             color: '#000',
//             background: 'white',
//             border: '1px solid #ccc',
//             borderRadius: '4px',
//             padding: '4px',
//           }}
//           title="Éditer la section"
//         >
//           <FontAwesomeIcon icon={faWandMagicSparkles} />
//         </button>
//       </div>
//     );
//   };

//   const renderResizeHandles = () => {
//     if (!isSelected) return null;
//     const handleSize = 8;
//     const handles = [
//       {
//         name: 'bottom-right',
//         cursor: 'nwse-resize',
//         top: styles.grid.minHeight - handleSize / 2,
//         left: styles.grid.width - handleSize / 2,
//       },
//     ];
//     return handles.map((handle) => (
//       <div
//         key={handle.name}
//         style={{
//           position: 'absolute',
//           top: styles.grid.top + handle.top,
//           left: styles.grid.left + handle.left,
//           width: handleSize,
//           height: handleSize,
//           backgroundColor: 'blue',
//           cursor: handle.cursor,
//           zIndex: 20,
//         }}
//         onMouseDown={(e) => handleResizeMouseDown(handle.name, e)}
//       />
//     ));
//   };

//   return (
//     <div
//       className="solutions-style-four-container"
//       style={{ position: 'relative', padding: '30px 0' }}
//       onClick={() => setIsSelected(false)}
//     >
//       {renderControlButtons()}
//       {renderResizeHandles()}
//       {/* Panneau d'édition */}
//       {showEditor && (
//         <div
//           className="style-editor-panel visible"
//           style={{
//             position: 'absolute',
//             top: `${Math.max(styles.grid.top, 0)}px`,
//             left: `${Math.min(styles.grid.left + styles.grid.width + 20, window.innerWidth - 350)}px`,
//             backgroundColor: 'white',
//             padding: '20px',
//             borderRadius: '8px',
//             boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
//             zIndex: 100,
//             maxWidth: '350px',
//             maxHeight: '80vh',
//             overflowY: 'auto',
//           }}
//         >
//           <button
//             onClick={() => setShowEditor(false)}
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
//             <h3>Edit Solution Style Four</h3>
//             <h3>Overlay Styles</h3>
//             <div>
//               <label>Overlay Color: </label>
//               <div
//                 style={{
//                   display: 'flex',
//                   flexWrap: 'wrap',
//                   gap: '8px',
//                   marginLeft: '10px',
//                   marginTop: '5px',
//                 }}
//               >
//                 {colors.map((c) => (
//                   <div
//                     key={c._id}
//                     onClick={() => handleOverlayColorChange(c.couleur)}
//                     style={{
//                       width: '20px',
//                       height: '20px',
//                       backgroundColor: c.couleur,
//                       border: styles.overlayColor.includes(c.couleur) ? '2px solid #000' : '1px solid #ccc',
//                       borderRadius: '4px',
//                       cursor: 'pointer',
//                       transition: 'border 0.2s ease',
//                     }}
//                     title={c.couleur}
//                   />
//                 ))}
//               </div>
//               <input
//                 type="color"
//                 value={styles.overlayColor.startsWith('rgba') ? '#014268' : styles.overlayColor}
//                 onChange={(e) => handleOverlayColorChange(e.target.value)}
//               />
//             </div>
//             <div>
//               <label>Overlay Transparency: </label>
//               <input
//                 type="range"
//                 min={0}
//                 max={1}
//                 step={0.01}
//                 value={overlayAlpha}
//                 onChange={(e) => handleOverlayAlphaChange(parseFloat(e.target.value))}
//                 style={{ width: 80, marginLeft: 8 }}
//               />
//               <span style={{ marginLeft: 8 }}>{overlayAlpha}</span>
//             </div>
//             <h3>Card Styles</h3>
//             <div>
//               <label>Card Width (px): </label>
//               <input
//                 type="number"
//                 min={200}
//                 max={800}
//                 value={styles.cardWidth}
//                 onChange={(e) => handleStyleChange('cardWidth', parseInt(e.target.value))}
//                 style={{ width: 80 }}
//               />
//             </div>
//             <div>
//               <label>Card Height (px): </label>
//               <input
//                 type="number"
//                 min={100}
//                 max={800}
//                 value={styles.cardHeight}
//                 onChange={(e) => handleStyleChange('cardHeight', parseInt(e.target.value))}
//                 style={{ width: 80 }}
//               />
//             </div>
//             <div>
//               <label>Card Border Radius (px): </label>
//               <input
//                 type="range"
//                 min={0}
//                 max={50}
//                 value={styles.cardRadius}
//                 onChange={(e) => handleStyleChange('cardRadius', parseInt(e.target.value))}
//                 style={{ width: 80 }}
//               />
//             </div>
//             <h3>Title Text Style</h3>
//             <div>
//               <label>Color: </label>
//               <div
//                 style={{
//                   display: 'flex',
//                   flexWrap: 'wrap',
//                   gap: '8px',
//                   marginLeft: '10px',
//                   marginTop: '5px',
//                 }}
//               >
//                 {colors.map((c) => (
//                   <div
//                     key={c._id}
//                     onClick={() => handleTitleStyleChange('color', c.couleur)}
//                     style={{
//                       width: '20px',
//                       height: '20px',
//                       backgroundColor: c.couleur,
//                       border: styles.title.color === c.couleur ? '2px solid #000' : '1px solid #ccc',
//                       borderRadius: '4px',
//                       cursor: 'pointer',
//                       transition: 'border 0.2s ease',
//                     }}
//                     title={c.couleur}
//                   />
//                 ))}
//               </div>
//               <input
//                 type="color"
//                 value={styles.title.color}
//                 onChange={(e) => handleTitleStyleChange('color', e.target.value)}
//               />
//             </div>
//             <div>
//               <label>Font Size: </label>
//               <input
//                 type="range"
//                 min={10}
//                 max={50}
//                 step={1}
//                 value={parseInt(styles.title.fontSize)}
//                 onChange={(e) => handleTitleStyleChange('fontSize', `${e.target.value}px`)}
//                 style={{ width: 80 }}
//               />
//             </div>
//             <div>
//               <label>Font Family: </label>
//               <select
//                 value={styles.title.fontFamily}
//                 onChange={(e) => handleTitleStyleChange('fontFamily', e.target.value)}
//               >
//                 <option value="Arial">Arial</option>
//                 <option value="Times New Roman">Times New Roman</option>
//                 <option value="Courier New">Courier New</option>
//                 <option value="Georgia">Georgia</option>
//                 <option value="Verdana">Verdana</option>
//                 <option value="Poppins">Poppins</option>
//                 <option value="Roboto">Roboto</option>
//                 <option value="Open Sans">Open Sans</option>
//                 <option value="Montserrat">Montserrat</option>
//                 <option value="Lato">Lato</option>
//                 <option value="Inter">Inter</option>
//               </select>
//             </div>
//             <div>
//               <label>Text Align: </label>
//               <select
//                 value={styles.title.textAlign}
//                 onChange={(e) => handleTitleStyleChange('textAlign', e.target.value)}
//               >
//                 <option value="left">Left</option>
//                 <option value="center">Center</option>
//                 <option value="right">Right</option>
//                 <option value="justify">Justify</option>
//               </select>
//             </div>
//             <div style={{ display: 'flex', gap: '10px' }}>
//               <button
//                 onClick={() => toggleTextStyle('fontWeight', 'title', '700', 'normal')}
//                 style={{
//                   padding: '5px 10px',
//                   backgroundColor: styles.title.fontWeight === '700' ? '#ccc' : '#fff',
//                   border: '1px solid #ccc',
//                   borderRadius: '4px',
//                   cursor: 'pointer',
//                 }}
//               >
//                 <strong>B</strong>
//               </button>
//               <button
//                 onClick={() => toggleTextStyle('fontStyle', 'title', 'italic', 'normal')}
//                 style={{
//                   padding: '5px 10px',
//                   backgroundColor: styles.title.fontStyle === 'italic' ? '#ccc' : '#fff',
//                   border: '1px solid #ccc',
//                   borderRadius: '4px',
//                   cursor: 'pointer',
//                 }}
//               >
//                 <em>I</em>
//               </button>
//               <button
//                 onClick={() => toggleTextStyle('textDecoration', 'title', 'underline', 'none')}
//                 style={{
//                   padding: '5px 10px',
//                   backgroundColor: styles.title.textDecoration === 'underline' ? '#ccc' : '#fff',
//                   border: '1px solid #ccc',
//                   borderRadius: '4px',
//                   cursor: 'pointer',
//                 }}
//               >
//                 <u>U</u>
//               </button>
//             </div>
//             <h3>Description Text Style</h3>
//             <div>
//               <label>Color: </label>
//               <div
//                 style={{
//                   display: 'flex',
//                   flexWrap: 'wrap',
//                   gap: '8px',
//                   marginLeft: '10px',
//                   marginTop: '5px',
//                 }}
//               >
//                 {colors.map((c) => (
//                   <div
//                     key={c._id}
//                     onClick={() => handleDescStyleChange('color', c.couleur)}
//                     style={{
//                       width: '20px',
//                       height: '20px',
//                       backgroundColor: c.couleur,
//                       border: styles.desc.color === c.couleur ? '2px solid #000' : '1px solid #ccc',
//                       borderRadius: '4px',
//                       cursor: 'pointer',
//                       transition: 'border 0.2s ease',
//                     }}
//                     title={c.couleur}
//                   />
//                 ))}
//               </div>
//               <input
//                 type="color"
//                 value={styles.desc.color}
//                 onChange={(e) => handleDescStyleChange('color', e.target.value)}
//               />
//             </div>
//             <div>
//               <label>Font Size: </label>
//               <input
//                 type="range"
//                 min={10}
//                 max={50}
//                 step={1}
//                 value={parseInt(styles.desc.fontSize)}
//                 onChange={(e) => handleDescStyleChange('fontSize', `${e.target.value}px`)}
//                 style={{ width: 80 }}
//               />
//             </div>
//             <div>
//               <label>Font Family: </label>
//               <select
//                 value={styles.desc.fontFamily}
//                 onChange={(e) => handleDescStyleChange('fontFamily', e.target.value)}
//               >
//                 <option value="Arial">Arial</option>
//                 <option value="Times New Roman">Times New Roman</option>
//                 <option value="Courier New">Courier New</option>
//                 <option value="Georgia">Georgia</option>
//                 <option value="Verdana">Verdana</option>
//                 <option value="Poppins">Poppins</option>
//                 <option value="Roboto">Roboto</option>
//                 <option value="Open Sans">Open Sans</option>
//                 <option value="Montserrat">Montserrat</option>
//                 <option value="Lato">Lato</option>
//                 <option value="Inter">Inter</option>
//               </select>
//             </div>
//             <div>
//               <label>Text Align: </label>
//               <select
//                 value={styles.desc.textAlign}
//                 onChange={(e) => handleDescStyleChange('textAlign', e.target.value)}
//               >
//                 <option value="left">Left</option>
//                 <option value="center">Center</option>
//                 <option value="right">Right</option>
//                 <option value="justify">Justify</option>
//               </select>
//             </div>
//             <div style={{ display: 'flex', gap: '10px' }}>
//               <button
//                 onClick={() => toggleTextStyle('fontWeight', 'desc', '700', 'normal')}
//                 style={{
//                   padding: '5px 10px',
//                   backgroundColor: styles.desc.fontWeight === '700' ? '#ccc' : '#fff',
//                   border: '1px solid #ccc',
//                   borderRadius: '4px',
//                   cursor: 'pointer',
//                 }}
//               >
//                 <strong>B</strong>
//               </button>
//               <button
//                 onClick={() => toggleTextStyle('fontStyle', 'desc', 'italic', 'normal')}
//                 style={{
//                   padding: '5px 10px',
//                   backgroundColor: styles.desc.fontStyle === 'italic' ? '#ccc' : '#fff',
//                   border: '1px solid #ccc',
//                   borderRadius: '4px',
//                   cursor: 'pointer',
//                 }}
//               >
//                 <em>I</em>
//               </button>
//               <button
//                 onClick={() => toggleTextStyle('textDecoration', 'desc', 'underline', 'none')}
//                 style={{
//                   padding: '5px 10px',
//                   backgroundColor: styles.desc.textDecoration === 'underline' ? '#ccc' : '#fff',
//                   border: '1px solid #ccc',
//                   borderRadius: '4px',
//                   cursor: 'pointer',
//                 }}
//               >
//                 <u>U</u>
//               </button>
//             </div>
//             <h3>Grid Styles</h3>
//             <div>
//               <label>Grid Width (px): </label>
//               <input
//                 type="number"
//                 min={300}
//                 value={styles.grid.width}
//                 onChange={(e) => handleGridStyleChange('width', parseInt(e.target.value))}
//                 style={{ width: 80 }}
//               />
//             </div>
//             <div>
//               <label>Grid Min Height (px): </label>
//               <input
//                 type="number"
//                 min={200}
//                 value={styles.grid.minHeight}
//                 onChange={(e) => handleGridStyleChange('minHeight', parseInt(e.target.value))}
//                 style={{ width: 80 }}
//               />
//             </div>
//           </div>
//         </div>
//       )}
//       {/* Section name & desc */}
//       <div style={{ marginBottom: 24, marginLeft: 10 }}>
//         <EditorText
//           elementType="h1"
//           initialStyles={{ color: '#f59e0b', fontSize: '22px', fontWeight: 600, marginBottom: 6 }}
//           onTextChange={(val) => handleTextChange('sectionName', val)}
//         >
//           {texts.sectionName}
//         </EditorText>
//         <EditorText
//           elementType="h2"
//           initialStyles={{ color: '#222', fontSize: '28px', fontWeight: 600, margin: 0 }}
//           onTextChange={(val) => handleTextChange('sectionDesc', val)}
//         >
//           {texts.sectionDesc}
//         </EditorText>
//       </div>
//       {/* Grille des cartes */}
//       <DragDropContext onDragEnd={onDragEnd}>
//         <Droppable droppableId="solution-cards" direction="horizontal">
//           {(provided) => (
//             <div
//               className="solutions-container style-four"
//               ref={provided.innerRef}
//               {...provided.droppableProps}
//               style={{
//                 position: 'relative',
//                 top: styles.grid.top,
//                 left: styles.grid.left,
//                 width: styles.grid.width,
//                 minHeight: styles.grid.minHeight,
//                 display: 'flex',
//                 flexWrap: 'wrap',
//                 gap: '20px',
//                 padding: '0 20px',
//                 justifyContent: 'center',
//               }}
//               onClick={handleElementClick}
//             >
//               {cardOrder.map((cardIdx, index) => {
//                 const solution = solutions[cardIdx];
//                 return (
//                   <Draggable key={cardIdx} draggableId={`card-${cardIdx}`} index={index}>
//                     {(dragProvided) => (
//                       <div
//                         className="solution-card"
//                         ref={dragProvided.innerRef}
//                         {...dragProvided.draggableProps}
//                         {...dragProvided.dragHandleProps}
//                         style={{
//                           ...dragProvided.draggableProps.style,
//                           width: styles.cardWidth,
//                           height: styles.cardHeight,
//                           borderRadius: styles.cardRadius,
//                           overflow: 'hidden',
//                           position: 'relative',
//                           boxShadow: 'none',
//                           padding: 0,
//                         }}
//                       >
//                         <div
//                           className="solution-thumb"
//                           style={{ width: '100%', height: '100%', position: 'relative' }}
//                         >
//                           <img
//                             src={solution.img}
//                             alt={solution.title}
//                             className="solution-image"
//                             style={{
//                               width: '100%',
//                               height: '100%',
//                               objectFit: 'cover',
//                               borderRadius: styles.cardRadius,
//                               transition: 'all 0.4s ease-out',
//                             }}
//                           />
//                           <div
//                             className="solution-overlay"
//                             style={{
//                               position: 'absolute',
//                               top: 0,
//                               left: 0,
//                               width: '100%',
//                               height: '100%',
//                               background: styles.overlayColor,
//                               borderRadius: styles.cardRadius,
//                               opacity: 0,
//                               visibility: 'hidden',
//                               transition: 'all 0.4s ease-out',
//                               display: 'flex',
//                               alignItems: 'center',
//                               justifyContent: 'center',
//                               pointerEvents: 'none',
//                             }}
//                           >
//                             <div
//                               className="solution-content"
//                               style={{
//                                 display: 'flex',
//                                 alignItems: 'center',
//                                 justifyContent: 'space-between',
//                                 padding: 20,
//                                 width: '100%',
//                                 height: '100%',
//                               }}
//                             >
//                               <h3 style={{ ...styles.title }}>{solution.title}</h3>
//                               <p style={{ ...styles.desc }}>{solution.description}</p>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     )}
//                   </Draggable>
//                 );
//               })}
//               {provided.placeholder}
//             </div>
//           )}
//         </Droppable>
//       </DragDropContext>
//       {/* Style pour hover overlay */}
//       <style>{`
//         .style-four .solution-card:hover .solution-overlay {
//           opacity: 1 !important;
//           visibility: visible !important;
//           pointerEvents: auto !important;
//         }
//       `}</style>
//     </div>
//   );
// }

import React, { useState, useRef, useEffect } from 'react';
import './OurSolutions.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWandMagicSparkles, faTimes, faArrowsUpDownLeftRight } from '@fortawesome/free-solid-svg-icons';
import EditorText from '../aboutus/EditorText';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';

import ReactDOM from 'react-dom';

// Composant de notification de succès
const SuccessNotification = ({ show, message }) => {
  if (!show) return null;
  
  return ReactDOM.createPortal(
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      backgroundColor: '#c6c6c6',
      color: 'white',
      padding: '15px 25px',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      zIndex: 10000,
      fontSize: '16px',
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      animation: 'slideInRight 0.3s ease-out',
      border: '1px solid #c6c6c6',
      pointerEvents: 'none'
    }}>
      <div style={{
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        backgroundColor: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#c6c6c6',
        fontSize: '14px',
        fontWeight: 'bold'
      }}>
        ✓
      </div>
      {message}
    </div>,
    document.body
  );
};


const API_URL = 'http://localhost:5000/couleurs';
const PREFERENCES_API_URL = 'http://localhost:5000/preferences/entreprise';
const CONTENT_API_URL = 'http://localhost:5000/contenus/Solution';

// Définir les constantes par défaut
const defaultPositions = {
  sectionName: { top: 0, left: 10 },
  sectionDesc: { top: 30, left: 10 },
  solutionGrid: { top: 70, left: 0 },
};

const defaultStyles = {
  sectionName: {
    color: '#f59e0b',
    fontSize: '22px',
    fontWeight: '600',
    fontFamily: 'Arial',
    marginBottom: '6px',
  },
  sectionDesc: {
    // color: '#222',
    // fontSize: '28px',
    // fontWeight: '600',
    // fontFamily: 'Arial',
    // margin: '0',
    color: '#000',
      fontSize: '38px',
      fontFamily: 'inherit',
      fontWeight: '600',
  },
  solutionGrid: {
    width: 1600,
    minHeight: 400,
    overlayColor: 'rgba(1, 66, 104, 0.6)',
    cardWidth: 400,
    cardHeight: 300,
    cardRadius: 15,
    title: {
      color: '#fff',
      fontSize: '24px',
      fontWeight: '600',
      fontFamily: 'Arial',
      textAlign: 'left',
      fontStyle: 'normal',
      textDecoration: 'none',
      marginRight: 20,
    },
    desc: {
      color: '#fff',
      fontSize: '15px',
      fontWeight: 'normal',
      fontFamily: 'Arial',
      textAlign: 'left',
      fontStyle: 'normal',
      textDecoration: 'none',
      lineHeight: 1.5,
    },
  },
};

const defaultTexts = {
  sectionName: 'NOS SOLUTIONS',
  sectionDesc: 'Customizable Solutions that are Easy to Adapt',
};

const defaultCardOrder = [];

export default function SolutionStyleFour({ solutions, contentType = 'solutions', styleKey = 'styleFour' }) {
  const [positions, setPositions] = useState(defaultPositions);
  const [styles, setStyles] = useState(defaultStyles);
  const [texts, setTexts] = useState(defaultTexts);
  const [cardOrder, setCardOrder] = useState(defaultCardOrder);
  const [overlayAlpha, setOverlayAlpha] = useState(0.6);
  const [showEditor, setShowEditor] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [resizing, setResizing] = useState(null);
  const [colors, setColors] = useState([]);
  const [userEntreprise, setUserEntreprise] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pendingSolutionStyles, setPendingSolutionStyles] = useState({});
  const offset = useRef({ x: 0, y: 0 });
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Validation functions
  const isValidPosition = (pos) => pos && typeof pos === 'object' && typeof pos.top === 'number' && typeof pos.left === 'number';
  const isValidStyle = (style) => style && typeof style === 'object' && Object.keys(style).length > 0;
  const isValidText = (text) => typeof text === 'string' && text.trim().length > 0;
  const isValidCardOrder = (order) => Array.isArray(order) && order.every((idx) => typeof idx === 'number' && idx >= 0 && idx < solutions.length);

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
        .then((res) => setColors(res.data))
        .catch((err) => {
          console.error('Erreur lors de la récupération des couleurs:', err);
          setError('Erreur lors de la récupération des couleurs.');
        });
    }
  }, [userEntreprise]);

  // Fetch preferences
  useEffect(() => {
    if (userEntreprise) {
      const fetchPreferences = async () => {
        try {
          const response = await axios.get(
            `${PREFERENCES_API_URL}/${userEntreprise}/preferences`,
            { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
          );
          const fetchedPreferences = response.data.preferences?.[contentType]?.[styleKey] || {};

          setPositions({
            sectionName: isValidPosition(fetchedPreferences.positions?.sectionName)
              ? fetchedPreferences.positions.sectionName
              : defaultPositions.sectionName,
            sectionDesc: isValidPosition(fetchedPreferences.positions?.sectionDesc)
              ? fetchedPreferences.positions.sectionDesc
              : defaultPositions.sectionDesc,
            solutionGrid: isValidPosition(fetchedPreferences.positions?.solutionGrid)
              ? fetchedPreferences.positions.solutionGrid
              : defaultPositions.solutionGrid,
          });

          setStyles({
            sectionName: isValidStyle(fetchedPreferences.styles?.sectionName)
              ? fetchedPreferences.styles.sectionName
              : defaultStyles.sectionName,
            sectionDesc: isValidStyle(fetchedPreferences.styles?.sectionDesc)
              ? fetchedPreferences.styles.sectionDesc
              : defaultStyles.sectionDesc,
            solutionGrid: isValidStyle(fetchedPreferences.styles?.solutionGrid)
              ? fetchedPreferences.styles.solutionGrid
              : defaultStyles.solutionGrid,
          });

          setTexts({
            sectionName: isValidText(fetchedPreferences.texts?.sectionName)
              ? fetchedPreferences.texts.sectionName
              : defaultTexts.sectionName,
            sectionDesc: isValidText(fetchedPreferences.texts?.sectionDesc)
              ? fetchedPreferences.texts.sectionDesc
              : defaultTexts.sectionDesc,
          });

          setCardOrder(isValidCardOrder(fetchedPreferences.cardOrder)
            ? fetchedPreferences.cardOrder
            : solutions.map((_, i) => i));

          setOverlayAlpha(parseFloat(fetchedPreferences.styles?.solutionGrid?.overlayColor?.split(',')[3]) || 0.6);
        } catch (error) {
          console.error('Erreur lors de la récupération des préférences:', error);
          toast.error('Erreur lors du chargement des préférences');
          setError('Erreur lors du chargement des préférences');
        } finally {
          setLoading(false);
        }
      };
      fetchPreferences();
    }
  }, [userEntreprise, solutions, contentType, styleKey]);

  // Handlers
  const handlePositionChange = (element, newPosition) => {
    if (isValidPosition(newPosition)) {
      setPositions((prev) => ({ ...prev, [element]: newPosition }));
    }
  };

  const handleStyleChange = (element, newStyles) => {
    if (isValidStyle(newStyles)) {
      setStyles((prev) => ({ ...prev, [element]: newStyles }));
    }
  };

  const handleTextChange = (element, newText) => {
    if (isValidText(newText)) {
      setTexts((prev) => ({ ...prev, [element]: newText }));
    }
  };

  const handleSolutionStyleChange = (solutionId, newStyles) => {
    if (solutionId && solutionId !== 'undefined' && isValidStyle(newStyles)) {
      setPendingSolutionStyles((prev) => ({
        ...prev,
        [solutionId]: newStyles,
      }));
    }
  };

  const handleOverlayColorChange = (color) => {
    const rgba = styles.solutionGrid.overlayColor?.startsWith('rgba')
      ? styles.solutionGrid.overlayColor.match(/rgba?\(([^)]+)\)/)[1].split(',')
      : [1, 66, 104, overlayAlpha];
    const newOverlayColor = `rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, ${overlayAlpha})`;
    setStyles((prev) => ({
      ...prev,
      solutionGrid: { ...prev.solutionGrid, overlayColor: newOverlayColor },
    }));
  };

  const handleOverlayAlphaChange = (alpha) => {
    setOverlayAlpha(alpha);
    const rgba = styles.solutionGrid.overlayColor?.startsWith('rgba')
      ? styles.solutionGrid.overlayColor.match(/rgba?\(([^)]+)\)/)[1].split(',')
      : [1, 66, 104, alpha];
    setStyles((prev) => ({
      ...prev,
      solutionGrid: { ...prev.solutionGrid, overlayColor: `rgba(${rgba[0]}, ${rgba[1]}, ${rgba[2]}, ${alpha})` },
    }));
  };

  const handleGridStyleChange = (key, value) => {
    setStyles((prev) => ({
      ...prev,
      solutionGrid: { ...prev.solutionGrid, [key]: value },
    }));
  };

  const handleTitleStyleChange = (key, value) => {
    setStyles((prev) => ({
      ...prev,
      solutionGrid: {
        ...prev.solutionGrid,
        title: { ...prev.solutionGrid.title, [key]: value },
      },
    }));
    solutions.forEach((solution) => {
      if (solution.id) {
        handleSolutionStyleChange(solution.id, {
          title: { ...styles.solutionGrid.title, [key]: value },
          desc: styles.solutionGrid.desc,
        });
      }
    });
  };

  const handleDescStyleChange = (key, value) => {
    setStyles((prev) => ({
      ...prev,
      solutionGrid: {
        ...prev.solutionGrid,
        desc: { ...prev.solutionGrid.desc, [key]: value },
      },
    }));
    solutions.forEach((solution) => {
      if (solution.id) {
        handleSolutionStyleChange(solution.id, {
          title: styles.solutionGrid.title,
          desc: { ...styles.solutionGrid.desc, [key]: value },
        });
      }
    });
  };

  const toggleTextStyle = (property, subProperty, value, defaultValue) => {
    const currentValue = styles.solutionGrid[subProperty][property] || defaultValue;
    if (subProperty === 'title') {
      handleTitleStyleChange(property, currentValue === value ? defaultValue : value);
    } else {
      handleDescStyleChange(property, currentValue === value ? defaultValue : value);
    }
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const newOrder = Array.from(cardOrder);
    const [removed] = newOrder.splice(result.source.index, 1);
    newOrder.splice(result.destination.index, 0, removed);
    setCardOrder(newOrder);
  };

  const handleMouseDown = (e) => {
    e.stopPropagation();
    offset.current = {
      x: e.clientX - positions.solutionGrid.left,
      y: e.clientY - positions.solutionGrid.top,
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
        setPositions((prev) => ({ ...prev, solutionGrid: newPosition }));
      });
    } else if (resizing) {
      const deltaX = e.clientX - offset.current.x;
      const deltaY = e.clientY - offset.current.y;
      let newWidth = styles.solutionGrid.width;
      let newMinHeight = styles.solutionGrid.minHeight;
      if (resizing === 'bottom-right') {
        newWidth = offset.current.width + deltaX;
        newMinHeight = offset.current.minHeight + deltaY;
      }
      newWidth = Math.max(newWidth, 300);
      newMinHeight = Math.max(newMinHeight, 200);
      setStyles((prev) => ({
        ...prev,
        solutionGrid: { ...prev.solutionGrid, width: newWidth, minHeight: newMinHeight },
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
      width: styles.solutionGrid.width,
      minHeight: styles.solutionGrid.minHeight,
    };
  };

  const handleElementClick = (e) => {
    e.stopPropagation();
    setIsSelected(true);
  };

  const saveAllChanges = async () => {
    if (!userEntreprise) {
      toast.error("ID de l'entreprise manquant");
      return;
    }

    if (
      !isValidPosition(positions.sectionName) ||
      !isValidPosition(positions.sectionDesc) ||
      !isValidPosition(positions.solutionGrid) ||
      !isValidStyle(styles.sectionName) ||
      !isValidStyle(styles.sectionDesc) ||
      !isValidStyle(styles.solutionGrid) ||
      !isValidText(texts.sectionName) ||
      !isValidText(texts.sectionDesc) ||
      !isValidCardOrder(cardOrder)
    ) {
      toast.error('Données de position, style, texte ou ordre des cartes invalides');
      return;
    }

    try {
      // Save preferences
      await axios.post(
        PREFERENCES_API_URL,
        {
          entreprise: userEntreprise,
          preferences: {
            [contentType]: {
              [styleKey]: {
                positions,
                styles,
                texts,
                cardOrder,
              },
            },
          },
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );

      // Save solution styles
      for (const [solutionId, solutionStyles] of Object.entries(pendingSolutionStyles)) {
        if (solutionId && solutionId !== 'undefined' && isValidStyle(solutionStyles)) {
          await axios.patch(
            `${CONTENT_API_URL}/${solutionId}/styles`,
            solutionStyles,
            { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
          );
        }
      }

      setPendingSolutionStyles({});
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
      toast.success('Modifications sauvegardées avec succès');
    } catch (error) {
      console.error('Error saving changes:', error);
      toast.error(`Erreur: ${error.response?.data?.message || 'Échec de la sauvegarde'}`);
    }
  };

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

  const renderControlButtons = () => {
    if (!isSelected) return null;
    return (
      <div
        className="element-controls"
        style={{
          position: 'absolute',
          top: positions.solutionGrid.top,
          left: positions.solutionGrid.left,
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
          style={{ cursor: 'grab', fontSize: '16px', color: '#000', background: 'white', border: '1px solid #ccc', borderRadius: '4px', padding: '4px' }}
          title="Déplacer la grille"
        >
          <FontAwesomeIcon icon={faArrowsUpDownLeftRight} />
        </button>
        <button
          onClick={() => setShowEditor(true)}
          style={{ cursor: 'pointer', fontSize: '16px', color: '#000', background: 'white', border: '1px solid #ccc', borderRadius: '4px', padding: '4px' }}
          title="Éditer la section"
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
        top: styles.solutionGrid.minHeight - handleSize / 2,
        left: styles.solutionGrid.width - handleSize / 2,
      },
    ];
    return handles.map((handle) => (
      <div
        key={handle.name}
        style={{
          position: 'absolute',
          top: positions.solutionGrid.top + handle.top,
          left: positions.solutionGrid.left + handle.left,
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

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;
  if (!solutions || solutions.length === 0) {
    return (
      <div className="solutions-style-four-container">
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h3>Aucune solution disponible</h3>
          <p>Veuillez ajouter des solutions pour les afficher ici.</p>
        </div>
      </div>
    );
  }

  return (
    <>
        <style>
        {`
          @keyframes slideInRight {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
        `}
      </style>
      
      {/* Notification de succès rendue dans le body */}
      <SuccessNotification 
        show={showSuccessMessage} 
        message="Modifications enregistrées avec succès" 
      />
      
      <div style={{ backgroundColor: 'white', minHeight: '100vh', padding: '20px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '20px',
        padding: '15px 20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #e9ecef'
      }}>
        <span style={{ 
          fontSize: '18px', 
          fontWeight: '600', 
          color: '#495057' 
        }}>Solutions section</span> 

        
        <button 
          onClick={saveAllChanges}
          style={{
            
            padding: '8px',
            backgroundColor: '#777777',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            marginTop: '16px',
            fontSize: '16px',
            fontWeight: '500',
            transition: 'background-color 0.2s ease'
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#c6c6c6';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = '#777777';
          }}
        >
          Enregistrer les modifications
        </button>
      </div>

    <div className="solutions-container style-four" style={{ position: 'relative', padding: '30px 0' }} onClick={() => setIsSelected(false)}>
      {renderControlButtons()}
      {renderResizeHandles()}
      {showEditor && (
        <div
          className="style-editor-panel visible"
          style={{
            position: 'absolute',
            top: `${Math.max(positions.solutionGrid.top, 0)}px`,
            left: `${Math.min(positions.solutionGrid.left + styles.solutionGrid.width + 20, window.innerWidth - 350)}px`,
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
            onClick={() => setShowEditor(false)}
            style={{ position: 'absolute', top: '5px', right: '5px', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '16px', color: '#999' }}
            aria-label="Close editor"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
          <div className="style-controls">
            <h3>Edit Solution Style Four</h3>
            <h3>Overlay Styles</h3>
            <div>
              <label>Overlay Color: </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginLeft: '10px', marginTop: '5px' }}>
                {colors.map((c) => (
                  <div
                    key={c._id}
                    onClick={() => handleOverlayColorChange(c.couleur)}
                    style={{
                      width: '20px',
                      height: '20px',
                      backgroundColor: c.couleur,
                      border: styles.solutionGrid.overlayColor.includes(c.couleur) ? '2px solid #000' : '1px solid #ccc',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      transition: 'border 0.2s ease',
                    }}
                    title={c.couleur}
                  />
                ))}
              </div>
              <input
                type="color"
                value={styles.solutionGrid.overlayColor.startsWith('rgba') ? '#014268' : styles.solutionGrid.overlayColor}
                onChange={(e) => handleOverlayColorChange(e.target.value)}
              />
            </div>
            <div>
              <label>Overlay Transparency: </label>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={overlayAlpha}
                onChange={(e) => handleOverlayAlphaChange(parseFloat(e.target.value))}
                style={{ width: 80, marginLeft: 8 }}
              />
              <span style={{ marginLeft: 8 }}>{overlayAlpha}</span>
            </div>
            <h3>Card Styles</h3>
            <div>
              <label>Card Width (px): </label>
              <input
                type="number"
                min={200}
                max={800}
                value={styles.solutionGrid.cardWidth}
                onChange={(e) => handleGridStyleChange('cardWidth', parseInt(e.target.value))}
                style={{ width: 80 }}
              />
            </div>
            <div>
              <label>Card Height (px): </label>
              <input
                type="number"
                min={100}
                max={800}
                value={styles.solutionGrid.cardHeight}
                onChange={(e) => handleGridStyleChange('cardHeight', parseInt(e.target.value))}
                style={{ width: 80 }}
              />
            </div>
            <div>
              <label>Card Border Radius (px): </label>
              <input
                type="range"
                min={0}
                max={50}
                value={styles.solutionGrid.cardRadius}
                onChange={(e) => handleGridStyleChange('cardRadius', parseInt(e.target.value))}
                style={{ width: 80 }}
              />
            </div>
            <h3>Title Text Style</h3>
            <div>
              <label>Color: </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginLeft: '10px', marginTop: '5px' }}>
                {colors.map((c) => (
                  <div
                    key={c._id}
                    onClick={() => handleTitleStyleChange('color', c.couleur)}
                    style={{
                      width: '20px',
                      height: '20px',
                      backgroundColor: c.couleur,
                      border: styles.solutionGrid.title.color === c.couleur ? '2px solid #000' : '1px solid #ccc',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      transition: 'border 0.2s ease',
                    }}
                    title={c.couleur}
                  />
                ))}
              </div>
              <input
                type="color"
                value={styles.solutionGrid.title.color}
                onChange={(e) => handleTitleStyleChange('color', e.target.value)}
              />
            </div>
            <div>
              <label>Font Size: </label>
              <input
                type="range"
                min={10}
                max={50}
                step={1}
                value={parseInt(styles.solutionGrid.title.fontSize)}
                onChange={(e) => handleTitleStyleChange('fontSize', `${e.target.value}px`)}
                style={{ width: 80 }}
              />
            </div>
            <div>
              <label>Font Family: </label>
              <select
                value={styles.solutionGrid.title.fontFamily}
                onChange={(e) => handleTitleStyleChange('fontFamily', e.target.value)}
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
                value={styles.solutionGrid.title.textAlign}
                onChange={(e) => handleTitleStyleChange('textAlign', e.target.value)}
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
                  backgroundColor: styles.solutionGrid.title.fontWeight === '700' ? '#ccc' : '#fff',
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
                  backgroundColor: styles.solutionGrid.title.fontStyle === 'italic' ? '#ccc' : '#fff',
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
                  backgroundColor: styles.solutionGrid.title.textDecoration === 'underline' ? '#ccc' : '#fff',
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
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginLeft: '10px', marginTop: '5px' }}>
                {colors.map((c) => (
                  <div
                    key={c._id}
                    onClick={() => handleDescStyleChange('color', c.couleur)}
                    style={{
                      width: '20px',
                      height: '20px',
                      backgroundColor: c.couleur,
                      border: styles.solutionGrid.desc.color === c.couleur ? '2px solid #000' : '1px solid #ccc',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      transition: 'border 0.2s ease',
                    }}
                    title={c.couleur}
                  />
                ))}
              </div>
              <input
                type="color"
                value={styles.solutionGrid.desc.color}
                onChange={(e) => handleDescStyleChange('color', e.target.value)}
              />
            </div>
            <div>
              <label>Font Size: </label>
              <input
                type="range"
                min={10}
                max={50}
                step={1}
                value={parseInt(styles.solutionGrid.desc.fontSize)}
                onChange={(e) => handleDescStyleChange('fontSize', `${e.target.value}px`)}
                style={{ width: 80 }}
              />
            </div>
            <div>
              <label>Font Family: </label>
              <select
                value={styles.solutionGrid.desc.fontFamily}
                onChange={(e) => handleDescStyleChange('fontFamily', e.target.value)}
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
                value={styles.solutionGrid.desc.textAlign}
                onChange={(e) => handleDescStyleChange('textAlign', e.target.value)}
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
                <option value="justify">Justify</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => toggleTextStyle('fontWeight', 'desc', '700', 'normal')}
                style={{
                  padding: '5px 10px',
                  backgroundColor: styles.solutionGrid.desc.fontWeight === '700' ? '#ccc' : '#fff',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                <strong>B</strong>
              </button>
              <button
                onClick={() => toggleTextStyle('fontStyle', 'desc', 'italic', 'normal')}
                style={{
                  padding: '5px 10px',
                  backgroundColor: styles.solutionGrid.desc.fontStyle === 'italic' ? '#ccc' : '#fff',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                <em>I</em>
              </button>
              <button
                onClick={() => toggleTextStyle('textDecoration', 'desc', 'underline', 'none')}
                style={{
                  padding: '5px 10px',
                  backgroundColor: styles.solutionGrid.desc.textDecoration === 'underline' ? '#ccc' : '#fff',
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
              <label>Grid Width (px): </label>
              <input
                type="number"
                min={300}
                value={styles.solutionGrid.width}
                onChange={(e) => handleGridStyleChange('width', parseInt(e.target.value))}
                style={{ width: 80 }}
              />
            </div>
            <div>
              <label>Grid Min Height (px): </label>
              <input
                type="number"
                min={200}
                value={styles.solutionGrid.minHeight}
                onChange={(e) => handleGridStyleChange('minHeight', parseInt(e.target.value))}
                style={{ width: 80 }}
              />
            </div>
          </div>
        </div>
      )}
      <div>
        
        {/* <button
      
          onClick={saveAllChanges}
          // style={{ cursor: 'pointer', fontSize: '16px', color: '#000', background: 'white', border: '1px solid #ccc', borderRadius: '4px', padding: '4px' }}
          title="Enregistrer les modifications"
        >
          Enregistrer les modifications
        </button> */}
      <div style={{ position: 'relative', marginBottom: 24 }}>
        <EditorText
          elementType="h1"
          initialPosition={positions.sectionName}
          initialStyles={styles.sectionName}
          onPositionChange={(newPosition) => handlePositionChange('sectionName', newPosition)}
          onStyleChange={(newStyles) => handleStyleChange('sectionName', newStyles)}
          onTextChange={(newText) => handleTextChange('sectionName', newText)}
        >
          {texts.sectionName}
        </EditorText>
        <EditorText
          elementType="h2"
          initialPosition={positions.sectionDesc}
          initialStyles={styles.sectionDesc}
          onPositionChange={(newPosition) => handlePositionChange('sectionDesc', newPosition)}
          onStyleChange={(newStyles) => handleStyleChange('sectionDesc', newStyles)}
          onTextChange={(newText) => handleTextChange('sectionDesc', newText)}
        >
          {texts.sectionDesc}
        </EditorText>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="solution-cards" direction="horizontal">
          {(provided) => (
            <div
              className="solutions-container style-four"
              ref={provided.innerRef}
              {...provided.droppableProps}
              style={{
                position: 'relative',
                top: positions.solutionGrid.top,
                left: positions.solutionGrid.left,
                width: styles.solutionGrid.width,
                minHeight: styles.solutionGrid.minHeight,
                display: 'flex',
                flexWrap: 'wrap',
                gap: '20px',
                padding: '0 20px',
                justifyContent: 'center',
              }}
              onClick={handleElementClick}
            >
              {cardOrder.map((cardIdx, index) => {
                const solution = solutions[cardIdx];
                return (
                  <Draggable key={cardIdx} draggableId={`card-${cardIdx}`} index={index}>
                    {(dragProvided) => (
                      <div
                        className="solution-card"
                        ref={dragProvided.innerRef}
                        {...dragProvided.draggableProps}
                        {...dragProvided.dragHandleProps}
                        style={{
                          ...dragProvided.draggableProps.style,
                          width: styles.solutionGrid.cardWidth,
                          height: styles.solutionGrid.cardHeight,
                          borderRadius: styles.solutionGrid.cardRadius,
                          overflow: 'hidden',
                          position: 'relative',
                          boxShadow: 'none',
                          padding: 0,
                        }}
                      >
                        <div className="solution-thumb" style={{ width: '100%', height: '100%', position: 'relative' }}>
                          <img
                            src={solution.img}
                            alt={solution.title}
                            className="solution-image"
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              borderRadius: styles.solutionGrid.cardRadius,
                              transition: 'all 0.4s ease-out',
                            }}
                          />
                          <div
                            className="solution-overlay"
                            style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: '100%',
                              background: styles.solutionGrid.overlayColor,
                              borderRadius: styles.solutionGrid.cardRadius,
                              opacity: 0,
                              visibility: 'hidden',
                              transition: 'all 0.4s ease-out',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              pointerEvents: 'none',
                            }}
                          >
                            <div
                              className="solution-content"
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: 20,
                                width: '100%',
                                height: '100%',
                              }}
                            >
                              <h3 style={{ ...styles.solutionGrid.title }}>{solution.title}</h3>
                              <p style={{ ...styles.solutionGrid.desc }}>{solution.description}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      </div>
      <style>{`
        .style-four .solution-card:hover .solution-overlay {
          opacity: 1 !important;
          visibility: visible !important;
          pointerEvents: auto !important;
        }
      `}</style>

      

    </div></div></>
  );
}