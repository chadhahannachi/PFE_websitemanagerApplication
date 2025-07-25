// import React, { useState, useRef, useEffect } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faArrowsUpDownLeftRight, faTimes, faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons';
// import axios from 'axios';
// import { jwtDecode } from 'jwt-decode';

// const API_URL = 'http://localhost:5000/couleurs';

// const DESCRIPTION_LIMIT = 50;

// export default function EditorSolutionStyleThree({ solutions = [], initialPosition = { top: 0, left: 0 }, initialStyles = { width: 1600, minHeight: 400 }, onSelect, onPositionChange, onUpdate, onStyleChange }) {
//   const [position, setPosition] = useState({
//     top: initialPosition.top || 0,
//     left: initialPosition.left || 0,
//   });
//   const [gridStyles, setGridStyles] = useState({
//     width: parseFloat(initialStyles.width) || 1600,
//     minHeight: parseFloat(initialStyles.minHeight) || 400,
//   });
//   const [cardStyles, setCardStyles] = useState({
//     card: {
//       backgroundColor: '#ffffff',
//       borderRadius: '10px',
//       boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
//       width: '300px',
//       height: '350px',
//       padding: '20px',
//       transition: 'all 0.3s ease',
//       hoverBackgroundColor: '#f8f9fa',
//       hoverTransform: 'translateY(-5px)',
//       hoverBoxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
//     },
//     title: {
//       color: '#014268',
//       fontSize: '18px',
//       fontFamily: 'Arial',
//       fontWeight: '600',
//       textAlign: 'left',
//       fontStyle: 'normal',
//       textDecoration: 'none',
//       marginBottom: '10px',
//     },
//     description: {
//       color: '#555',
//       fontSize: '14px',
//       fontFamily: 'Arial',
//       textAlign: 'left',
//       fontWeight: 'normal',
//       fontStyle: 'normal',
//       textDecoration: 'none',
//       lineHeight: '1.5',
//       margin: 0,
//     },
//     image: {
//       borderRadius: '8px',
//       width: '100%',
//       height: '150px',
//       objectFit: 'contain',
//       marginBottom: '15px',
//       transition: 'opacity 0.3s ease',
//     },
//     readMore: {
//       color: '#2196f3',
//       fontSize: '14px',
//       fontFamily: 'Arial',
//       fontWeight: 'normal',
//       textDecoration: 'none',
//       cursor: 'pointer',
//     },
//   });
//   const [solutionData, setSolutionData] = useState([]);
//   const [pendingChanges, setPendingChanges] = useState({});
//   const [isDragging, setIsDragging] = useState(false);
//   const [isEditingStyles, setIsEditingStyles] = useState(false);
//   const [isSelected, setIsSelected] = useState(false);
//   const [resizing, setResizing] = useState(null);
//   const [draggingElement, setDraggingElement] = useState(null);
//   const [hoveredIndex, setHoveredIndex] = useState(null);
//   const offset = useRef({ x: 0, y: 0 });

//   const [colors, setColors] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [userEntreprise, setUserEntreprise] = useState(null);

//   // Fetch user enterprise
//   useEffect(() => {
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

//   useEffect(() => {
//     if (solutions && solutions.length > 0) {
//       setSolutionData(solutions.map((solution, index) => {
//         // Fusionner les styles sauvegardés avec les styles par défaut
//         const mergedStyles = {
//           card: { ...cardStyles.card, ...solution.styles?.card },
//           title: { ...cardStyles.title, ...solution.styles?.title },
//           description: { ...cardStyles.description, ...solution.styles?.description },
//           image: { ...cardStyles.image, ...solution.styles?.image },
//           readMore: { ...cardStyles.readMore, ...solution.styles?.readMore },
//         };

//         return {
//           ...solution,
//           id: solution.id || `temp-${index}`, // Assurer qu'il y a toujours un ID
//           positions: solution.positions || {
//             image: { top: 20, left: 20 },
//             title: { top: 20, left: 100 },
//             description: { top: 50, left: 100 },
//           },
//           styles: mergedStyles,
//         };
//       }));
//     } else {
//       setSolutionData([]);
//     }
//   }, [solutions, cardStyles]);

//   useEffect(() => {
//     if (isDragging || resizing || draggingElement) {
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
//   }, [isDragging, resizing, draggingElement]);

//   const handleMouseDown = (e) => {
//     e.stopPropagation();
//     offset.current = {
//       x: e.clientX - position.left,
//       y: e.clientY - position.top,
//     };
//     setIsDragging(true);
//   };

//   const handleElementDragStart = (e, solutionIndex, element) => {
//     e.stopPropagation();
//     const card = e.currentTarget.closest('.solution-card');
//     const rect = card.getBoundingClientRect();
//     const currentPositions = solutionData[solutionIndex]?.positions || {};
//     const elementPositions = currentPositions[element] || { top: 0, left: 0 };
    
//     offset.current = {
//       x: e.clientX - rect.left - elementPositions.left,
//       y: e.clientY - rect.top - elementPositions.top,
//     };
//     setDraggingElement({ solutionIndex, element });
//   };

//   const handleMouseMove = (e) => {
//     if (isDragging) {
//       requestAnimationFrame(() => {
//         const newPosition = {
//           top: e.clientY - offset.current.y,
//           left: e.clientX - offset.current.x,
//         };
//         setPosition(newPosition);
//         onPositionChange?.(newPosition);
//       });
//     } else if (resizing) {
//       const deltaX = e.clientX - offset.current.x;
//       const deltaY = e.clientY - offset.current.y;
//       let newWidth = gridStyles.width;
//       let newMinHeight = gridStyles.minHeight;
//       if (resizing === 'bottom-right') {
//         newWidth = offset.current.width + deltaX;
//         newMinHeight = offset.current.minHeight + deltaY;
//       }
//       newWidth = Math.max(newWidth, 300);
//       newMinHeight = Math.max(newMinHeight, 200);
//       setGridStyles((prev) => ({
//         ...prev,
//         width: newWidth,
//         minHeight: newMinHeight,
//       }));
//     } else if (draggingElement) {
//       requestAnimationFrame(() => {
//         const { solutionIndex, element } = draggingElement;
//         const card = document.getElementsByClassName('solution-card')[solutionIndex];
//         if (!card) return;
        
//         const rect = card.getBoundingClientRect();
//         const solution = solutionData[solutionIndex];
//         const cardWidth = parseInt(solution?.styles?.card?.width || cardStyles.card.width);
//         const cardHeight = parseInt(solution?.styles?.card?.height || cardStyles.card.height);
//         const elementWidth = parseInt(solution?.styles?.[element]?.width || (element === 'title' || element === 'description' ? cardWidth - 120 : 60));
//         const elementHeight = parseInt(solution?.styles?.[element]?.height || (element === 'title' ? 30 : element === 'description' ? 60 : 60));

//         let newLeft = e.clientX - rect.left - offset.current.x;
//         let newTop = e.clientY - rect.top - offset.current.y;

//         newLeft = Math.max(0, Math.min(newLeft, cardWidth - elementWidth));
//         newTop = Math.max(0, Math.min(newTop, cardHeight - elementHeight));

//         setSolutionData((prev) => {
//           try {
//             const newSolutions = [...prev];
//             newSolutions[solutionIndex] = {
//               ...newSolutions[solutionIndex],
//               positions: {
//                 ...newSolutions[solutionIndex].positions,
//                 [element]: { top: newTop, left: newLeft },
//               },
//             };
//             if (newSolutions[solutionIndex].id && !newSolutions[solutionIndex].id.startsWith('temp-')) {
//               setPendingChanges((prev) => ({
//                 ...prev,
//                 [newSolutions[solutionIndex].id]: {
//                   ...prev[newSolutions[solutionIndex].id],
//                   positions: newSolutions[solutionIndex].positions,
//                 },
//               }));
//               onUpdate?.(newSolutions[solutionIndex].id, { positions: newSolutions[solutionIndex].positions });
//             }
//             return newSolutions;
//           } catch (error) {
//             console.error('Error updating solution positions:', error);
//             return prev;
//           }
//         });
//       });
//     }
//   };

//   const handleMouseUp = () => {
//     setIsDragging(false);
//     setResizing(null);
//     setDraggingElement(null);
//   };

//   const handleResizeMouseDown = (handle, e) => {
//     e.stopPropagation();
//     setResizing(handle);
//     offset.current = {
//       x: e.clientX,
//       y: e.clientY,
//       width: gridStyles.width,
//       minHeight: gridStyles.minHeight,
//     };
//   };

//   const handleElementClick = (e) => {
//     e.stopPropagation();
//     setIsSelected(true);
//     onSelect?.('solutionGrid');
//   };

//   const handleImageChange = (index, file) => {
//     const reader = new FileReader();
//     reader.onload = () => {
//       setSolutionData((prev) => {
//         const newSolutions = [...prev];
//         newSolutions[index] = { ...newSolutions[index], img: reader.result };
//         if (newSolutions[index].id) {
//           setPendingChanges((prev) => ({
//             ...prev,
//             [newSolutions[index].id]: {
//               ...prev[newSolutions[index].id],
//               img: reader.result,
//             },
//           }));
//           onUpdate?.(newSolutions[index].id, { img: reader.result });
//         }
//         return newSolutions;
//       });
//     };
//     reader.readAsDataURL(file);
//   };

//   const handleStyleChange = (property, value, subProperty) => {
//     try {
//       setSolutionData((prevSolutions) => {
//         const newSolutions = prevSolutions.map((solution) => {
//           const updatedStyles = {
//             ...solution.styles,
//             [subProperty]: {
//               ...solution.styles[subProperty],
//               [property]: value,
//             },
//           };
          
//           if (solution.id && !solution.id.startsWith('temp-')) {
//             onStyleChange?.(solution.id, updatedStyles);
//           }
          
//           return {
//             ...solution,
//             styles: updatedStyles,
//           };
//         });
        
//         return newSolutions;
//       });
//     } catch (error) {
//       console.error('Error in handleStyleChange:', error);
//     }
//   };

//   const toggleTextStyle = (property, subProperty, value, defaultValue) => {
//     const firstSolution = solutionData[0];
//     const currentValue = firstSolution?.styles?.[subProperty]?.[property] || defaultValue;
//     handleStyleChange(property, currentValue === value ? defaultValue : value, subProperty);
//   };

//   const renderControlButtons = () => {
//     if (!isSelected) return null;
//     return (
//       <div
//         className="element-controls"
//         style={{
//           position: 'absolute',
//           top: position.top - 40,
//           left: position.left - 30,
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

//   const renderResizeHandles = () => {
//     if (!isSelected) return null;
//     const handleSize = 8;
//     const handles = [
//       {
//         name: 'bottom-right',
//         cursor: 'nwse-resize',
//         top: gridStyles.minHeight - handleSize / 2,
//         left: gridStyles.width - handleSize / 2,
//       },
//     ];
//     return handles.map((handle) => (
//       <div
//         key={handle.name}
//         style={{
//           position: 'absolute',
//           top: position.top + handle.top,
//           left: position.left + handle.left,
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

//   if (!solutionData.length) {
//     return (
//       <div style={{ padding: '20px', textAlign: 'center' }}>
//         <p>Chargement des solutions...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
//         <p>Erreur: {error}</p>
//         <p>Le composant continuera de fonctionner sans les fonctionnalités d'authentification.</p>
//       </div>
//     );
//   }

//   return (
//     <div
//       onClick={() => setIsSelected(false)}
//       style={{ position: 'relative' }}
//     >
//       {renderControlButtons()}
//       {renderResizeHandles()}
//       {isEditingStyles && (
//         <div
//           className="style-editor-panel visible"
//           style={{
//             position: 'absolute',
//             top: `${Math.max(position.top, 0)}px`,
//             left: `${Math.min(position.left + gridStyles.width + 20, window.innerWidth - 350)}px`,
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
//             <h3>Edit Solution Style Three</h3>
//             <h3>Card Styles</h3>
//             <div>
//               <label>Background Color: </label>
//               {loading ? (
//                 <span>Chargement des couleurs...</span>
//               ) : error ? (
//                 <span style={{ color: 'red' }}>{error}</span>
//               ) : colors.length === 0 ? (
//                 <span>Aucune couleur disponible.</span>
//               ) : (
//                 <div
//                   style={{
//                     display: 'flex',
//                     flexWrap: 'wrap',
//                     gap: '8px',
//                     marginLeft: '10px',
//                     marginTop: '5px',
//                   }}
//                 >
//                   {colors.map((c) => (
//                     <div
//                       key={c._id}
//                       onClick={() => handleStyleChange('backgroundColor', c.couleur, 'card')}
//                       style={{
//                         width: '20px',
//                         height: '20px',
//                         backgroundColor: c.couleur,
//                         border: (solutionData[0]?.styles?.card?.backgroundColor || cardStyles.card.backgroundColor) === c.couleur ? '2px solid #000' : '1px solid #ccc',
//                         borderRadius: '4px',
//                         cursor: 'pointer',
//                         transition: 'border 0.2s ease',
//                       }}
//                       title={c.couleur}
//                     />
//                   ))}
//                 </div>
//               )}
//               <input
//                 type="color"
//                 value={solutionData[0]?.styles?.card?.backgroundColor || cardStyles.card.backgroundColor}
//                 onChange={(e) => handleStyleChange('backgroundColor', e.target.value, 'card')}
//               />
//             </div>
//             <div>
//               <label>Hover Background Color: </label>
//               {loading ? (
//                 <span>Chargement des couleurs...</span>
//               ) : error ? (
//                 <span style={{ color: 'red' }}>{error}</span>
//               ) : colors.length === 0 ? (
//                 <span>Aucune couleur disponible.</span>
//               ) : (
//                 <div
//                   style={{
//                     display: 'flex',
//                     flexWrap: 'wrap',
//                     gap: '8px',
//                     marginLeft: '10px',
//                     marginTop: '5px',
//                   }}
//                 >
//                   {colors.map((c) => (
//                     <div
//                       key={c._id}
//                       onClick={() => handleStyleChange('hoverBackgroundColor', c.couleur, 'card')}
//                       style={{
//                         width: '20px',
//                         height: '20px',
//                         backgroundColor: c.couleur,
//                         border: (solutionData[0]?.styles?.card?.hoverBackgroundColor || cardStyles.card.hoverBackgroundColor) === c.couleur ? '2px solid #000' : '1px solid #ccc',
//                         borderRadius: '4px',
//                         cursor: 'pointer',
//                         transition: 'border 0.2s ease',
//                       }}
//                       title={c.couleur}
//                     />
//                   ))}
//                 </div>
//               )}
//               <input
//                 type="color"
//                 value={solutionData[0]?.styles?.card?.hoverBackgroundColor || cardStyles.card.hoverBackgroundColor}
//                 onChange={(e) => handleStyleChange('hoverBackgroundColor', e.target.value, 'card')}
//               />
//             </div>
//             <div>
//               <label>Hover Box Shadow: </label>
//               <input
//                 type="text"
//                 value={solutionData[0]?.styles?.card?.hoverBoxShadow || cardStyles.card.hoverBoxShadow}
//                 onChange={(e) => handleStyleChange('hoverBoxShadow', e.target.value, 'card')}
//                 placeholder="0 8px 16px rgba(0, 0, 0, 0.2)"
//               />
//             </div>
//             <div>
//               <label>Hover Transform: </label>
//               <input
//                 type="text"
//                 value={solutionData[0]?.styles?.card?.hoverTransform || cardStyles.card.hoverTransform}
//                 onChange={(e) => handleStyleChange('hoverTransform', e.target.value, 'card')}
//                 placeholder="translateY(-5px)"
//               />
//             </div>
//             <div>
//               <label>Border Radius: </label>
//               <input
//                 type="range"
//                 min="0"
//                 max="50"
//                 value={parseInt(solutionData[0]?.styles?.card?.borderRadius || cardStyles.card.borderRadius)}
//                 onChange={(e) => handleStyleChange('borderRadius', `${e.target.value}px`, 'card')}
//               />
//             </div>
//             <div>
//               <label>Card Width: </label>
//               <input
//                 type="number"
//                 min="200"
//                 value={parseInt(solutionData[0]?.styles?.card?.width || cardStyles.card.width)}
//                 onChange={(e) => handleStyleChange('width', `${e.target.value}px`, 'card')}
//               />
//             </div>
//             <div>
//               <label>Card Height: </label>
//               <input
//                 type="number"
//                 min="150"
//                 value={parseInt(solutionData[0]?.styles?.card?.height || cardStyles.card.height)}
//                 onChange={(e) => handleStyleChange('height', `${e.target.value}px`, 'card')}
//               />
//             </div>
//             <h3>Title Text Style</h3>
//             <div>
//               <label>Color: </label>
//               {loading ? (
//                 <span>Chargement des couleurs...</span>
//               ) : error ? (
//                 <span style={{ color: 'red' }}>{error}</span>
//               ) : colors.length === 0 ? (
//                 <span>Aucune couleur disponible.</span>
//               ) : (
//                 <div
//                   style={{
//                     display: 'flex',
//                     flexWrap: 'wrap',
//                     gap: '8px',
//                     marginLeft: '10px',
//                     marginTop: '5px',
//                   }}
//                 >
//                   {colors.map((c) => (
//                     <div
//                       key={c._id}
//                       onClick={() => handleStyleChange('color', c.couleur, 'title')}
//                       style={{
//                         width: '20px',
//                         height: '20px',
//                         backgroundColor: c.couleur,
//                         border: (solutionData[0]?.styles?.title?.color || cardStyles.title.color) === c.couleur ? '2px solid #000' : '1px solid #ccc',
//                         borderRadius: '4px',
//                         cursor: 'pointer',
//                         transition: 'border 0.2s ease',
//                       }}
//                       title={c.couleur}
//                     />
//                   ))}
//                 </div>
//               )}
//               <input
//                 type="color"
//                 value={solutionData[0]?.styles?.title?.color || cardStyles.title.color}
//                 onChange={(e) => handleStyleChange('color', e.target.value, 'title')}
//               />
//             </div>
//             <div>
//               <label>Font Size: </label>
//               <input
//                 type="range"
//                 min="10"
//                 max="50"
//                 step="1"
//                 value={parseInt(solutionData[0]?.styles?.title?.fontSize || cardStyles.title.fontSize)}
//                 onChange={(e) => handleStyleChange('fontSize', `${e.target.value}px`, 'title')}
//               />
//             </div>
//             <div>
//               <label>Font Family: </label>
//               <select
//                 value={solutionData[0]?.styles?.title?.fontFamily || cardStyles.title.fontFamily}
//                 onChange={(e) => handleStyleChange('fontFamily', e.target.value, 'title')}
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
//                 value={solutionData[0]?.styles?.title?.textAlign || cardStyles.title.textAlign}
//                 onChange={(e) => handleStyleChange('textAlign', e.target.value, 'title')}
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
//                   backgroundColor: (solutionData[0]?.styles?.title?.fontWeight || cardStyles.title.fontWeight) === '700' ? '#ccc' : '#fff',
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
//                   backgroundColor: (solutionData[0]?.styles?.title?.fontStyle || cardStyles.title.fontStyle) === 'italic' ? '#ccc' : '#fff',
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
//                   backgroundColor: (solutionData[0]?.styles?.title?.textDecoration || cardStyles.title.textDecoration) === 'underline' ? '#ccc' : '#fff',
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
//               {loading ? (
//                 <span>Chargement des couleurs...</span>
//               ) : error ? (
//                 <span style={{ color: 'red' }}>{error}</span>
//               ) : colors.length === 0 ? (
//                 <span>Aucune couleur disponible.</span>
//               ) : (
//                 <div
//                   style={{
//                     display: 'flex',
//                     flexWrap: 'wrap',
//                     gap: '8px',
//                     marginLeft: '10px',
//                     marginTop: '5px',
//                   }}
//                 >
//                   {colors.map((c) => (
//                     <div
//                       key={c._id}
//                       onClick={() => handleStyleChange('color', c.couleur, 'description')}
//                       style={{
//                         width: '20px',
//                         height: '20px',
//                         backgroundColor: c.couleur,
//                         border: (solutionData[0]?.styles?.description?.color || cardStyles.description.color) === c.couleur ? '2px solid #000' : '1px solid #ccc',
//                         borderRadius: '4px',
//                         cursor: 'pointer',
//                         transition: 'border 0.2s ease',
//                       }}
//                       title={c.couleur}
//                     />
//                   ))}
//                 </div>
//               )}
//               <input
//                 type="color"
//                 value={solutionData[0]?.styles?.description?.color || cardStyles.description.color}
//                 onChange={(e) => handleStyleChange('color', e.target.value, 'description')}
//               />
//             </div>
//             <div>
//               <label>Font Size: </label>
//               <input
//                 type="range"
//                 min="10"
//                 max="50"
//                 step="1"
//                 value={parseInt(solutionData[0]?.styles?.description?.fontSize || cardStyles.description.fontSize)}
//                 onChange={(e) => handleStyleChange('fontSize', `${e.target.value}px`, 'description')}
//               />
//             </div>
//             <div>
//               <label>Font Family: </label>
//               <select
//                 value={solutionData[0]?.styles?.description?.fontFamily || cardStyles.description.fontFamily}
//                 onChange={(e) => handleStyleChange('fontFamily', e.target.value, 'description')}
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
//                 value={solutionData[0]?.styles?.description?.textAlign || cardStyles.description.textAlign}
//                 onChange={(e) => handleStyleChange('textAlign', e.target.value, 'description')}
//               >
//                 <option value="left">Left</option>
//                 <option value="center">Center</option>
//                 <option value="right">Right</option>
//                 <option value="justify">Justify</option>
//               </select>
//             </div>
//             <div style={{ display: 'flex', gap: '10px' }}>
//               <button
//                 onClick={() => toggleTextStyle('fontWeight', 'description', '700', 'normal')}
//                 style={{
//                   padding: '5px 10px',
//                   backgroundColor: (solutionData[0]?.styles?.description?.fontWeight || cardStyles.description.fontWeight) === '700' ? '#ccc' : '#fff',
//                   border: '1px solid #ccc',
//                   borderRadius: '4px',
//                   cursor: 'pointer',
//                 }}
//               >
//                 <strong>B</strong>
//               </button>
//               <button
//                 onClick={() => toggleTextStyle('fontStyle', 'description', 'italic', 'normal')}
//                 style={{
//                   padding: '5px 10px',
//                   backgroundColor: (solutionData[0]?.styles?.description?.fontStyle || cardStyles.description.fontStyle) === 'italic' ? '#ccc' : '#fff',
//                   border: '1px solid #ccc',
//                   borderRadius: '4px',
//                   cursor: 'pointer',
//                 }}
//               >
//                 <em>I</em>
//               </button>
//               <button
//                 onClick={() => toggleTextStyle('textDecoration', 'description', 'underline', 'none')}
//                 style={{
//                   padding: '5px 10px',
//                   backgroundColor: (solutionData[0]?.styles?.description?.textDecoration || cardStyles.description.textDecoration) === 'underline' ? '#ccc' : '#fff',
//                   border: '1px solid #ccc',
//                   borderRadius: '4px',
//                   cursor: 'pointer',
//                 }}
//               >
//                 <u>U</u>
//               </button>
//             </div>
//             <h3>Image Style</h3>
//             <div>
//               <label>Border Radius: </label>
//               <input
//                 type="range"
//                 min="0"
//                 max="50"
//                 value={parseInt(solutionData[0]?.styles?.image?.borderRadius || cardStyles.image.borderRadius)}
//                 onChange={(e) => handleStyleChange('borderRadius', `${e.target.value}px`, 'image')}
//               />
//             </div>
//             <div>
//               <label>Width: </label>
//               <input
//                 type="number"
//                 min="20"
//                 value={parseInt(solutionData[0]?.styles?.image?.width || cardStyles.image.width)}
//                 onChange={(e) => handleStyleChange('width', `${e.target.value}px`, 'image')}
//               />
//             </div>
//             <div>
//               <label>Height: </label>
//               <input
//                 type="number"
//                 min="20"
//                 value={parseInt(solutionData[0]?.styles?.image?.height || cardStyles.image.height)}
//                 onChange={(e) => handleStyleChange('height', `${e.target.value}px`, 'image')}
//               />
//             </div>
//             <h3>Read More Style</h3>
//             <div>
//               <label>Color: </label>
//               {loading ? (
//                 <span>Chargement des couleurs...</span>
//               ) : error ? (
//                 <span style={{ color: 'red' }}>{error}</span>
//               ) : colors.length === 0 ? (
//                 <span>Aucune couleur disponible.</span>
//               ) : (
//                 <div
//                   style={{
//                     display: 'flex',
//                     flexWrap: 'wrap',
//                     gap: '8px',
//                     marginLeft: '10px',
//                     marginTop: '5px',
//                   }}
//                 >
//                   {colors.map((c) => (
//                     <div
//                       key={c._id}
//                       onClick={() => handleStyleChange('color', c.couleur, 'readMore')}
//                       style={{
//                         width: '20px',
//                         height: '20px',
//                         backgroundColor: c.couleur,
//                         border: (solutionData[0]?.styles?.readMore?.color || cardStyles.readMore.color) === c.couleur ? '2px solid #000' : '1px solid #ccc',
//                         borderRadius: '4px',
//                         cursor: 'pointer',
//                         transition: 'border 0.2s ease',
//                       }}
//                       title={c.couleur}
//                     />
//                   ))}
//                 </div>
//               )}
//               <input
//                 type="color"
//                 value={solutionData[0]?.styles?.readMore?.color || cardStyles.readMore.color}
//                 onChange={(e) => handleStyleChange('color', e.target.value, 'readMore')}
//               />
//             </div>
//             <div>
//               <label>Font Size: </label>
//               <input
//                 type="range"
//                 min="10"
//                 max="30"
//                 step="1"
//                 value={parseInt(solutionData[0]?.styles?.readMore?.fontSize || cardStyles.readMore.fontSize)}
//                 onChange={(e) => handleStyleChange('fontSize', `${e.target.value}px`, 'readMore')}
//               />
//             </div>
//             <h3>Grid Styles</h3>
//             <div>
//               <label>Grid Width: </label>
//               <input
//                 type="number"
//                 min="300"
//                 value={gridStyles.width}
//                 onChange={(e) => setGridStyles((prev) => ({ ...prev, width: parseInt(e.target.value) }))}
//               />
//             </div>
//             <div>
//               <label>Grid Min Height: </label>
//               <input
//                 type="number"
//                 min="200"
//                 value={gridStyles.minHeight}
//                 onChange={(e) => setGridStyles((prev) => ({ ...prev, minHeight: parseInt(e.target.value) }))}
//               />
//             </div>
//           </div>
//         </div>
//       )}
//       <div
//         className="solutions-container style-three"
//         style={{
//           position: 'absolute',
//           top: position.top,
//           left: position.left,
//           width: gridStyles.width,
//           minHeight: gridStyles.minHeight,
//           display: 'flex',
//           flexWrap: 'wrap',
//           gap: '20px',
//           padding: '0 20px',
//           justifyContent: 'center',
//           // position: 'relative',
//           // width: '100%',
//           // minHeight: 'unset',
//           // alignItems: 'stretch',
//         }}
//         onClick={handleElementClick}
//       >
//         {solutionData.map((solution, index) => {
//           const isHovered = hoveredIndex === index;
//           const description = solution.description || '';
//           const isDescriptionLong = description.length > DESCRIPTION_LIMIT;
//           const truncatedDescription =
//             isDescriptionLong && !isHovered
//               ? `${description.substring(0, DESCRIPTION_LIMIT)}...`
//               : description;

//           return (
//             <div
//               key={solution.id || index}
//               className="solution-card"
//               style={{
//                 ...solution.styles?.card,
//                 position: 'relative',
//                 overflow: 'hidden',
//                 transition: 'all 0.3s ease',
//                 transform: isHovered ? (solution.styles?.card?.hoverTransform || cardStyles.card.hoverTransform) : 'translateY(0)',
//                 boxShadow: isHovered ? (solution.styles?.card?.hoverBoxShadow || cardStyles.card.hoverBoxShadow) : (solution.styles?.card?.boxShadow || cardStyles.card.boxShadow),
//                 backgroundColor: isHovered ? (solution.styles?.card?.hoverBackgroundColor || cardStyles.card.hoverBackgroundColor) : (solution.styles?.card?.backgroundColor || cardStyles.card.backgroundColor),
//               }}
//               onMouseEnter={() => setHoveredIndex(index)}
//               onMouseLeave={() => setHoveredIndex(null)}
//             >
//               <div
//                 className="draggable-element"
//                 style={{
//                   position: 'absolute',
//                   top: solution.positions?.image?.top || 20,
//                   left: solution.positions?.image?.left || 20,
//                   cursor: isSelected ? 'move' : 'default',
//                   width: '100%',
//                 }}
//               >
//                 {isSelected && (
//                   <div
//                     className="drag-handle"
//                     onMouseDown={(e) => handleElementDragStart(e, index, 'image')}
//                     style={{
//                       position: 'absolute',
//                       top: -15,
//                       left: -15,
//                       width: 12,
//                       height: 12,
//                       backgroundColor: '#fff',
//                       border: '1px solid #ccc',
//                       borderRadius: '50%',
//                       cursor: 'move',
//                       zIndex: 10,
//                     }}
//                   >
//                     <FontAwesomeIcon icon={faArrowsUpDownLeftRight} style={{ fontSize: '8px', color: '#000' }} />
//                   </div>
//                 )}
//                 <img
//                   src={solution.img}
//                   alt={solution.title}
//                   style={{
//                     width: solution.styles?.image?.width || cardStyles.image.width,
//                     height: solution.styles?.image?.height || cardStyles.image.height,
//                     objectFit: solution.styles?.image?.objectFit || cardStyles.image.objectFit,
//                     borderRadius: solution.styles?.image?.borderRadius || cardStyles.image.borderRadius,
//                     marginBottom: solution.styles?.image?.marginBottom || cardStyles.image.marginBottom,
//                     transition: solution.styles?.image?.transition || cardStyles.image.transition,
//                     opacity: isHovered ? 0 : 1,
//                     zIndex: 2,
//                   }}
//                 />
//               </div>
//               <div
//                 className="draggable-element"
//                 style={{
//                   position: 'absolute',
//                   top: solution.positions?.title?.top || 20,
//                   left: solution.positions?.title?.left || 100,
//                   cursor: isSelected ? 'move' : 'default',
//                   width: '100%',
//                 }}
//               >
//                 {isSelected && (
//                   <div
//                     className="drag-handle"
//                     onMouseDown={(e) => handleElementDragStart(e, index, 'title')}
//                     style={{
//                       position: 'absolute',
//                       top: -15,
//                       left: -15,
//                       width: 12,
//                       height: 12,
//                       backgroundColor: '#fff',
//                       border: '1px solid #ccc',
//                       borderRadius: '50%',
//                       cursor: 'move',
//                       zIndex: 10,
//                     }}
//                   >
//                     <FontAwesomeIcon icon={faArrowsUpDownLeftRight} style={{ fontSize: '8px', color: '#000' }} />
//                   </div>
//                 )}
//                 <h3 style={{ 
//                   ...solution.styles?.title,
//                   margin: 0,
//                 }}>
//                   {solution.title}
//                 </h3>
//               </div>
//               <div
//                 className="draggable-element"
//                 style={{
//                   position: 'absolute',
//                   top: solution.positions?.description?.top || 50,
//                   left: solution.positions?.description?.left || 100,
//                   cursor: isSelected ? 'move' : 'default',
//                   width: '100%',
//                 }}
//               >
//                 {isSelected && (
//                   <div
//                     className="drag-handle"
//                     onMouseDown={(e) => handleElementDragStart(e, index, 'description')}
//                     style={{
//                       position: 'absolute',
//                       top: -15,
//                       left: -15,
//                       width: 12,
//                       height: 12,
//                       backgroundColor: '#fff',
//                       border: '1px solid #ccc',
//                       borderRadius: '50%',
//                       cursor: 'move',
//                       zIndex: 10,
//                     }}
//                   >
//                     <FontAwesomeIcon icon={faArrowsUpDownLeftRight} style={{ fontSize: '8px', color: '#000' }} />
//                   </div>
//                 )}
//                 <p style={{ 
//                   ...solution.styles?.description,
//                   margin: 0,
//                 }}>
//                   {truncatedDescription}{' '}
//                   {isDescriptionLong && !isHovered && (
//                     <span style={{ 
//                       ...solution.styles?.readMore,
//                       cursor: 'pointer',
//                     }}>
//                       Read more
//                     </span>
//                   )}
//                 </p>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// } 
import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsUpDownLeftRight, faTimes, faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_URL = 'http://localhost:5000/couleurs';

const DESCRIPTION_LIMIT = 50;

export default function EditorSolutionStyleThree({ solutions = [], initialPosition = { top: 0, left: 0 }, initialStyles = { width: 1600, minHeight: 400 }, onSelect, onPositionChange, onUpdate, onStyleChange }) {
  const [position, setPosition] = useState({
    top: initialPosition.top || 0,
    left: initialPosition.left || 0,
  });
  const [gridStyles, setGridStyles] = useState({
    width: parseFloat(initialStyles.width) || 1600,
    minHeight: parseFloat(initialStyles.minHeight) || 400,
  });
  const [cardStyles, setCardStyles] = useState({
    card: {
      backgroundColor: '#ffffff',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      width: '300px',
      height: '350px',
      padding: '20px',
      transition: 'all 0.3s ease',
      hoverBackgroundColor: '#f8f9fa',
      hoverTransform: 'translateY(-5px)',
      hoverBoxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
    },
    title: {
      color: '#014268',
      fontSize: '27px',
      fontFamily: 'Arial',
      fontWeight: '600',
      textAlign: 'left',
      fontStyle: 'normal',
      textDecoration: 'none',
      // marginBottom: '10px',
      transition: 'transform 0.3s ease', // Ajout de la transition pour le glissement
    },
    description: {
      color: '#555',
      fontSize: '23px',
      fontFamily: 'Arial',
      textAlign: 'left',
      fontWeight: 'normal',
      fontStyle: 'normal',
      textDecoration: 'none',
      // lineHeight: '2',
      // margin: 0,
      transition: 'transform 0.3s ease', // Ajout de la transition pour le glissement
    },
    image: {
      borderRadius: '8px',
      width: '100%',
      height: '150px',
      objectFit: 'contain',
      marginBottom: '15px',
      transition: 'opacity 0.3s ease',
    },
    readMore: {
      color: '#2196f3',
      fontSize: '14px',
      fontFamily: 'Arial',
      fontWeight: 'normal',
      textDecoration: 'none',
      cursor: 'pointer',
    },
  });
  const [solutionData, setSolutionData] = useState([]);
  const [pendingChanges, setPendingChanges] = useState({});
  const [isDragging, setIsDragging] = useState(false);
  const [isEditingStyles, setIsEditingStyles] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [resizing, setResizing] = useState(null);
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
      console.log('Token is missing from localStorage, continuing without authentication');
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
    if (solutions && solutions.length > 0) {
      setSolutionData(solutions.map((solution, index) => {
        // Fusionner les styles sauvegardés avec les styles par défaut
        const mergedStyles = {
          card: { ...cardStyles.card, ...solution.styles?.card },
          title: { ...cardStyles.title, ...solution.styles?.title },
          description: { ...cardStyles.description, ...solution.styles?.description },
          image: { ...cardStyles.image, ...solution.styles?.image },
          readMore: { ...cardStyles.readMore, ...solution.styles?.readMore },
        };

        return {
          ...solution,
          id: solution.id || `temp-${index}`, // Assurer qu'il y a toujours un ID
          styles: mergedStyles,
        };
      }));
    } else {
      setSolutionData([]);
    }
  }, [solutions, cardStyles]);

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
    onSelect?.('solutionGrid');
  };

  const handleImageChange = (index, file) => {
    const reader = new FileReader();
    reader.onload = () => {
      setSolutionData((prev) => {
        const newSolutions = [...prev];
        newSolutions[index] = { ...newSolutions[index], img: reader.result };
        if (newSolutions[index].id) {
          setPendingChanges((prev) => ({
            ...prev,
            [newSolutions[index].id]: {
              ...prev[newSolutions[index].id],
              img: reader.result,
            },
          }));
          onUpdate?.(newSolutions[index].id, { img: reader.result });
        }
        return newSolutions;
      });
    };
    reader.readAsDataURL(file);
  };

  const handleStyleChange = (property, value, subProperty) => {
    try {
      setSolutionData((prevSolutions) => {
        const newSolutions = prevSolutions.map((solution) => {
          const updatedStyles = {
            ...solution.styles,
            [subProperty]: {
              ...solution.styles[subProperty],
              [property]: value,
            },
          };
          
          if (solution.id && !solution.id.startsWith('temp-')) {
            onStyleChange?.(solution.id, updatedStyles);
          }
          
          return {
            ...solution,
            styles: updatedStyles,
          };
        });
        
        return newSolutions;
      });
    } catch (error) {
      console.error('Error in handleStyleChange:', error);
    }
  };

  const toggleTextStyle = (property, subProperty, value, defaultValue) => {
    const firstSolution = solutionData[0];
    const currentValue = firstSolution?.styles?.[subProperty]?.[property] || defaultValue;
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

  if (!solutionData.length) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Chargement des solutions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
        <p>Erreur: {error}</p>
        <p>Le composant continuera de fonctionner sans les fonctionnalités d'authentification.</p>
      </div>
    );
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
            <h3>Edit Solution Style Three</h3>
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
                onChange={(e) => handleStyleChange('hoverBackgroundColor', e.target.value, 'card')}
              />
            </div>
            <div>
              <label>Hover Box Shadow: </label>
              <input
                type="text"
                value={solutionData[0]?.styles?.card?.hoverBoxShadow || cardStyles.card.hoverBoxShadow}
                onChange={(e) => handleStyleChange('hoverBoxShadow', e.target.value, 'card')}
                placeholder="0 8px 16px rgba(0, 0, 0, 0.2)"
              />
            </div>
            <div>
              <label>Hover Transform: </label>
              <input
                type="text"
                value={solutionData[0]?.styles?.card?.hoverTransform || cardStyles.card.hoverTransform}
                onChange={(e) => handleStyleChange('hoverTransform', e.target.value, 'card')}
                placeholder="translateY(-5px)"
              />
            </div>
            <div>
              <label>Border Radius: </label>
              <input
                type="range"
                min="0"
                max="50"
                value={parseInt(solutionData[0]?.styles?.card?.borderRadius || cardStyles.card.borderRadius)}
                onChange={(e) => handleStyleChange('borderRadius', `${e.target.value}px`, 'card')}
              />
            </div>
            <div>
              <label>Card Width: </label>
              <input
                type="number"
                min="200"
                value={parseInt(solutionData[0]?.styles?.card?.width || cardStyles.card.width)}
                onChange={(e) => handleStyleChange('width', `${e.target.value}px`, 'card')}
              />
            </div>
            <div>
              <label>Card Height: </label>
              <input
                type="number"
                min="150"
                value={parseInt(solutionData[0]?.styles?.card?.height || cardStyles.card.height)}
                onChange={(e) => handleStyleChange('height', `${e.target.value}px`, 'card')}
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
                value={parseInt(solutionData[0]?.styles?.title?.fontSize || cardStyles.title.fontSize)}
                onChange={(e) => handleStyleChange('fontSize', `${e.target.value}px`, 'title')}
              />
            </div>
            <div>
              <label>Font Family: </label>
              <select
                value={solutionData[0]?.styles?.title?.fontFamily || cardStyles.title.fontFamily}
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
                value={solutionData[0]?.styles?.title?.textAlign || cardStyles.title.textAlign}
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
                  backgroundColor: (solutionData[0]?.styles?.title?.fontWeight || cardStyles.title.fontWeight) === '700' ? '#ccc' : '#fff',
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
                  backgroundColor: (solutionData[0]?.styles?.title?.fontStyle || cardStyles.title.fontStyle) === 'italic' ? '#ccc' : '#fff',
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
                  backgroundColor: (solutionData[0]?.styles?.title?.textDecoration || cardStyles.title.textDecoration) === 'underline' ? '#ccc' : '#fff',
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
                value={parseInt(solutionData[0]?.styles?.description?.fontSize || cardStyles.description.fontSize)}
                onChange={(e) => handleStyleChange('fontSize', `${e.target.value}px`, 'description')}
              />
            </div>
            <div>
              <label>Font Family: </label>
              <select
                value={solutionData[0]?.styles?.description?.fontFamily || cardStyles.description.fontFamily}
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
                value={solutionData[0]?.styles?.description?.textAlign || cardStyles.description.textAlign}
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
                  backgroundColor: (solutionData[0]?.styles?.description?.fontWeight || cardStyles.description.fontWeight) === '700' ? '#ccc' : '#fff',
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
                  backgroundColor: (solutionData[0]?.styles?.description?.fontStyle || cardStyles.description.fontStyle) === 'italic' ? '#ccc' : '#fff',
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
                  backgroundColor: (solutionData[0]?.styles?.description?.textDecoration || cardStyles.description.textDecoration) === 'underline' ? '#ccc' : '#fff',
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
                value={parseInt(solutionData[0]?.styles?.image?.borderRadius || cardStyles.image.borderRadius)}
                onChange={(e) => handleStyleChange('borderRadius', `${e.target.value}px`, 'image')}
              />
            </div>
            <div>
              <label>Width: </label>
              <input
                type="number"
                min="20"
                value={parseInt(solutionData[0]?.styles?.image?.width || cardStyles.image.width)}
                onChange={(e) => handleStyleChange('width', `${e.target.value}px`, 'image')}
              />
            </div>
            <div>
              <label>Height: </label>
              <input
                type="number"
                min="20"
                value={parseInt(solutionData[0]?.styles?.image?.height || cardStyles.image.height)}
                onChange={(e) => handleStyleChange('height', `${e.target.value}px`, 'image')}
              />
            </div>
            <h3>Read More Style</h3>
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
                      onClick={() => handleStyleChange('color', c.couleur, 'readMore')}
                      style={{
                        width: '20px',
                        height: '20px',
                        backgroundColor: c.couleur,
                        border: (solutionData[0]?.styles?.readMore?.color || cardStyles.readMore.color) === c.couleur ? '2px solid #000' : '1px solid #ccc',
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
                value={solutionData[0]?.styles?.readMore?.color || cardStyles.readMore.color}
                onChange={(e) => handleStyleChange('color', e.target.value, 'readMore')}
              />
            </div>
            <div>
              <label>Font Size: </label>
              <input
                type="range"
                min="10"
                max="30"
                step="1"
                value={parseInt(solutionData[0]?.styles?.readMore?.fontSize || cardStyles.readMore.fontSize)}
                onChange={(e) => handleStyleChange('fontSize', `${e.target.value}px`, 'readMore')}
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
        className="solutions-container style-three"
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
        {solutionData.map((solution, index) => {
          const isHovered = hoveredIndex === index;
          const description = solution.description || '';
          const isDescriptionLong = description.length > DESCRIPTION_LIMIT;
          const truncatedDescription =
            isDescriptionLong && !isHovered
              ? `${description.substring(0, DESCRIPTION_LIMIT)}...`
              : description;

          return (
            <div
              key={solution.id || index}
              className="solution-card"
              style={{
                ...solution.styles?.card,
                transition: 'all 0.3s ease',
                transform: isHovered ? (solution.styles?.card?.hoverTransform || cardStyles.card.hoverTransform) : 'translateY(0)',
                boxShadow: isHovered ? (solution.styles?.card?.hoverBoxShadow || cardStyles.card.hoverBoxShadow) : (solution.styles?.card?.boxShadow || cardStyles.card.boxShadow),
                backgroundColor: isHovered ? (solution.styles?.card?.hoverBackgroundColor || cardStyles.card.hoverBackgroundColor) : (solution.styles?.card?.backgroundColor || cardStyles.card.backgroundColor),
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <img
                src={solution.img}
                alt={solution.title}
                style={{
                  ...solution.styles?.image,
                  zIndex: 2,
                  opacity: isHovered ? 0 : 1, // Disparition de l'image au survol
                }}
              />
              <h3 style={{ 
                ...solution.styles?.title,
                marginBottom: '10px',
                transform: isHovered ? 'translateY(-150px)' : 'translateY(0)', // Glissement vers le haut
              }}>
                {solution.title}
              </h3>
              <p style={{ 
                ...solution.styles?.description,
                margin: 5,
                transform: isHovered ? 'translateY(-150px)' : 'translateY(0)', // Glissement vers le haut
              }}>
                {truncatedDescription}{' '}
                {isDescriptionLong && !isHovered && (
                  <span style={{ 
                    ...solution.styles?.readMore,
                    cursor: 'pointer',
                  }}>
                    Read more
                  </span>
                )}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}