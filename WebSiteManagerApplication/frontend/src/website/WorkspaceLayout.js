// import React, { useState, useEffect } from 'react';
// import { ResizableBox } from 'react-resizable';
// import './WorkspaceLayout.css';
// import 'react-resizable/css/styles.css';
// import CanvasArea from './canvasarea';
// import axios from 'axios';
// import { jwtDecode } from 'jwt-decode';
// import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
// import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
// import Modal from '../charteGraphique/Modal';
// import CharteGraphique from '../charteGraphique/charteGraphique';

// const devices = [
//   { name: 'Desktop', width: 1480, minWidth: 1200 },
//   { name: 'Tablet', width: 768 },
//   { name: 'Mobile', width: 375 }
// ]; 

// const styleOptions = {
//   solutions: [
//     { name: 'Numbered Cards', value: 0 },
//     { name: 'Image Cards', value: 1 },
//     { name: 'Hover Effect', value: 2 },
//     { name: 'Image Hover Side by Side', value: 3 },
//   ],
//   events: [
//     { name: 'Intro with Cards', value: 0 },
//     { name: 'Image Cards', value: 1 },
//     { name: 'Rounded Container', value: 2 },
//   ],
//   news: [
//     { name: 'Grid with Buttons', value: 0 },
//     { name: 'Icon Cards', value: 1 },
//     { name: 'Scrollable Cards', value: 2 },
//   ],
//   faq: [
//     { name: 'Accordion (Classic)', value: 0 },
//     { name: 'Card Minimalist', value: 1 },
//     { name: 'Style 3', value: 2 },
//   ],
//   services: [
//     { name: 'List Cards', value: 0 },
//     { name: 'Modern Cards', value: 1 },
//   ],
//   partners: [
//     { name: 'Cards Slider', value: 0 },
//     { name: 'Images Slider', value: 1 },
//   ],
//   about: [
//     { name: 'Simple Layout', value: 0 },
//     { name: 'Modern Layout', value: 1 },
//   ],
//   units: [
//     { name: 'Classic Layout', value: 0 },
//     { name: 'Modern Cards', value: 1 },
//   ],
//   contact: [
//     { name: 'Classic Layout', value: 0 },
//     { name: 'Modern Layout', value: 1 },
//   ],
//   slider: [
//     { name: 'Classic Slider', value: 0 },
//     { name: 'Modern Slider', value: 1 },
//   ],
// };

// const WorkspaceLayout = () => {
//   const [selectedDevice, setSelectedDevice] = useState(devices[0]);
//   const [leftSidebarWidth] = useState(240);
//   const [rightSidebarWidth] = useState(240);
//   const [selectedTool, setSelectedTool] = useState('move');
//   const [zoom, setZoom] = useState(65);
//   const [frameWidth, setFrameWidth] = useState(selectedDevice.width);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [successMessage, setSuccessMessage] = useState(null);
//   const [userEntreprise, setUserEntreprise] = useState(null);
//   const [openPanel, setOpenPanel] = useState('solutions');

//   const [entrepriseName, setEntrepriseName] = useState(null);
//   const [styles, setStyles] = useState({
//     solutionsStyle: 0,
//     eventsStyle: 0,
//     newsStyle: 0,
//     faqStyle: 0,
//     servicesStyle: 0, 
//     partnersStyle: 0, 
//     aboutStyle: 0, 
//     unitsStyle: 0, 
//     contactStyle: 0,
//     sliderStyle: 0,
//   });

//   const [sectionOrder, setSectionOrder] = useState(Object.keys(styleOptions));
//   const [sectionTitles, setSectionTitles] = useState(
//     Object.fromEntries(Object.keys(styleOptions).map(k => [k, k.charAt(0).toUpperCase() + k.slice(1)]))
//   );
//   const [editingTitle, setEditingTitle] = useState(null);

//   // Récupérer l'entreprise de l'utilisateur
//   const fetchUserEntreprise = async () => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       setError('Token manquant. Veuillez vous connecter.');
//       setLoading(false);
//       return;
//     }

//     try {
//       const decodedToken = jwtDecode(token);
//       const userId = decodedToken?.sub;
//       const config = { headers: { Authorization: `Bearer ${token}` } };
//       const userResponse = await axios.get(`http://localhost:5000/auth/user/${userId}`, config);
//       setUserEntreprise(userResponse.data.entreprise);
//     } catch (error) {
//       console.error('Erreur lors de la récupération des données utilisateur:', error);
//       setError('Erreur lors de la récupération des données utilisateur.');
//       setLoading(false);
//     }
//   };

//   // Récupérer le nom de l'entreprise
//   const fetchEntrepriseName = async (userEntreprise) => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       setError('Token manquant pour récupérer le nom de l’entreprise.');
//       return;
//     }

//     try {
//       const config = { headers: { Authorization: `Bearer ${token}` } };
//       const entrepriseResponse = await axios.get(
//         `http://localhost:5000/entreprises/${userEntreprise}`,
//         config
//       );
//       setEntrepriseName(entrepriseResponse.data.nom || 'Unknown');
//     } catch (error) {
//       console.error('Erreur lors de la récupération du nom de l’entreprise:', error);
//       setError('Erreur lors de la récupération du nom de l’entreprise.');
//     }
//   };
  

//   // Récupérer les préférences
//   const fetchPreferences = async () => {
//     if (!userEntreprise) {
//       console.log('Entreprise non définie, annulation de fetchPreferences');
//       return;
//     }

//     try {
//       const response = await axios.get(
//         `http://localhost:5000/preferences/entreprise/${userEntreprise}/preferences`
//       );
//       const fetchedPreferences = response.data.preferences || {
//         solutionsStyle: 0,
//         eventsStyle: 0,
//         newsStyle: 0,
//         faqStyle: 0,
//         servicesStyle: 0,
//         partnersStyle: 0,
//         aboutStyle: 0,
//         unitsStyle: 0,
//         contactStyle: 0,
//         sliderStyle: 0,
//       };
//       const validPreferences = {
//         solutionsStyle: Number.isInteger(fetchedPreferences.solutionsStyle)
//           ? fetchedPreferences.solutionsStyle
//           : 0,
//         eventsStyle: Number.isInteger(fetchedPreferences.eventsStyle)
//           ? fetchedPreferences.eventsStyle
//           : 0,
//         newsStyle: Number.isInteger(fetchedPreferences.newsStyle)
//           ? fetchedPreferences.newsStyle
//           : 0,
//         faqStyle: Number.isInteger(fetchedPreferences.faqStyle)
//           ? fetchedPreferences.faqStyle
//           : 0,
//         servicesStyle: Number.isInteger(fetchedPreferences.servicesStyle)
//           ? fetchedPreferences.servicesStyle
//           : 0,
//         partnersStyle: Number.isInteger(fetchedPreferences.partnersStyle)
//           ? fetchedPreferences.partnersStyle
//           : 0,
//         aboutStyle: Number.isInteger(fetchedPreferences.aboutStyle)
//           ? fetchedPreferences.aboutStyle
//           : 0,
//         unitsStyle: Number.isInteger(fetchedPreferences.unitsStyle)
//           ? fetchedPreferences.unitsStyle
//           : 0,
//         contactStyle: Number.isInteger(fetchedPreferences.contactStyle)
//           ? fetchedPreferences.contactStyle
//           : 0,
//         sliderStyle: Number.isInteger(fetchedPreferences.sliderStyle)
//           ? fetchedPreferences.sliderStyle
//           : 0,
//       };
//       setStyles(validPreferences);
//     } catch (error) {
//       console.error('Erreur lors de la récupération des préférences:', error);
//       setError('Erreur lors de la récupération des préférences.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Sauvegarder les préférences
//   const savePreferences = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.post(
//         'http://localhost:5000/preferences/entreprise',
//         { entreprise: userEntreprise, preferences: styles },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setSuccessMessage('Préférences enregistrées avec succès !');
//       setTimeout(() => setSuccessMessage(null), 3000);
//     } catch (error) {
//       console.error('Erreur lors de la sauvegarde des préférences:', error);
//       setError('Erreur lors de la sauvegarde des préférences.');
//     }
//   };

//   // Gérer le changement de style
//   const handleStyleChange = (section, value) => {
//     const newStyles = { ...styles, [section]: value };
//     setStyles(newStyles);
//   };

//   useEffect(() => {
//     fetchUserEntreprise();
//   }, []);

//   useEffect(() => {
//     if (userEntreprise) {
//       fetchEntrepriseName(userEntreprise);
//       fetchPreferences();
//     }
//   }, [userEntreprise]);

//   const tools = [
//     { name: 'move', label: 'Move' },
//     { name: 'hand', label: 'Hand Tool' },
//     { name: 'frame', label: 'Frame' },
//     { name: 'layers', label: 'Layers' },
//   ];

//   const onResize = (event, { size }) => {
//     setFrameWidth(size.width);
//     const matchedDevice = devices.find(d => Math.abs(d.width - size.width) < 10);
//     if (matchedDevice && matchedDevice.name !== selectedDevice.name) {
//       setSelectedDevice(matchedDevice);
//     }
//   };


//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const openModal = () => {
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//   };


//   // Fonction pour gérer la prévisualisation avec l'entrepriseId dans l'URL
//   const handlePreview = () => {
//     if (userEntreprise) {
//       window.location.href = `/homepage/${userEntreprise}/${entrepriseName}`;
//     } else {
//       setError('Entreprise non trouvée. Veuillez réessayer.');
//     }
//   };


  
//   return (
//     <div className="workspace-layout">
//       {/* Top Toolbar */}
//       <div className="workspace-header">
//         <div className="header-left">
//           <div className="tools-group">
//             {tools.map((tool) => (
//               <button
//                 key={tool.name}
//                 className={`tool-button ${selectedTool === tool.name ? 'active' : ''}`}
//                 onClick={() => setSelectedTool(tool.name)}
//                 title={tool.label}
//               >
//                 {tool.name}
//               </button>
//             ))}
//           </div>
//         </div>
        
//         <div className="header-center">
//           <div className="device-selector">
//             {devices.map(device => (
//               <button
//                 key={device.name}
//                 className={`device-button ${selectedDevice.name === device.name ? 'active' : ''}`}
//                 onClick={() => {
//                   setSelectedDevice(device);
//                   setFrameWidth(device.width);
//                 }}
//               >
//                 {device.name}
//               </button>
//             ))}
//           </div>
//           <div className="frame-width-display">
//             {frameWidth}px
//           </div>
//         </div>


//         {/* <div>
//           <button className="view-button" onClick={() => window.location.href = '/homepage/'}>
//             Prévisualiser le site 
//           </button>
//         </div> */}

//          <div>
//           <button className="view-button" onClick={handlePreview}>
//             Prévisualiser le site 
//           </button>
//         </div>
        
//         <div className="header-right">
//           <div className="zoom-controls">
//             <button onClick={() => setZoom(Math.max(10, zoom - 5))}>-</button>
//             <span>{zoom}%</span>
//             <button onClick={() => setZoom(Math.min(200, zoom + 5))}>+</button>
//           </div>
//           <button className="preview-button" title="Preview">
//             on
//           </button>
//           <button className="theme-button" title="Toggle theme">
//             off
//           </button>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="workspace-content">
//         {/* Left Sidebar */}
//         <div className="workspace-sidebar" style={{ width: `${leftSidebarWidth}px` }}>
//           <div className="workspace-sidebar-content">
//             {loading ? (
//               <div className="sidebar-loading">Chargement...</div>
//             ) : error ? (
//               <div className="sidebar-error">Erreur : {error}</div>
//             ) : (
//               <>
//                 {Object.keys(styleOptions).map((section) => (
//                   <div
//                     key={section}
//                     className={`custom-panel ${openPanel === section ? 'open' : ''}`}
//                   >
//                     <div
//                       className="custom-panel-header"
//                       onClick={() => setOpenPanel(openPanel === section ? null : section)}
//                     >
//                       <span className="custom-panel-title">
//                         {section.charAt(0).toUpperCase() + section.slice(1)}
//                       </span>
//                       <span className="custom-panel-arrow">
//                         {openPanel === section ? '▾' : '▸'}
//                       </span>
//                     </div>
//                     {openPanel === section && (
//                       <div className="custom-panel-body">
//                         {styleOptions[section].map((option) => (
//                           <button
//                             key={option.value}
//                             className={`custom-style-btn${styles[`${section}Style`] == option.value ? ' active' : ''}`}
//                             onClick={() => handleStyleChange(`${section}Style`, option.value)}
//                           >
//                             {option.name}
//                           </button>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 ))}
//                 <button className="save-button" onClick={savePreferences}>
//                   Save
//                 </button>
//                 {successMessage && <div className="success-message">{successMessage}</div>}
//               </>
//             )}

            
//           </div>
//         </div>
        
//         {/* Canvas Area */}
//         <div className="workspace-main" style={{ 
//           marginLeft: `${leftSidebarWidth}px`,
//           marginRight: `${rightSidebarWidth}px`,
//           width: `calc(100% - ${leftSidebarWidth + rightSidebarWidth}px)`
//         }}>
//           <div className="canvas-container">
//             <div className="canvas-grid">
//               <ResizableBox
//                 className="canvas-frame"
//                 width={frameWidth}
//                 height={500}
//                 minConstraints={[375, 500]}
//                 maxConstraints={[2000, 500]}
//                 onResize={onResize}
//                 resizeHandles={['w', 'e']}
//                 axis="x"
//                 handle={(h, ref) => (
//                   <div
//                     className={`custom-handle custom-handle-${h}`}
//                     ref={ref}
//                   />
//                 )}
//               >
//                 <div 
//                   style={{ 
//                     transform: `scale(${zoom / 100})`,
//                     transformOrigin: 'center center',
//                     height: '100%'
//                   }}
//                 >
//                   <CanvasArea styles={styles} />
//                 </div>
//               </ResizableBox>

              
//             </div>
//           </div>
//         </div>

//         {/* Right Properties Panel */}
//         <div className="properties-panel" style={{ width: `${rightSidebarWidth}px` }}>
//           <div className="properties-header">
//             <h3>Properties</h3>
//           </div>
//           <div className="properties-content">
//             <div className="property-group">
//               <h4>Layout</h4>
//               <div className="property-row">
//                 <label>Width</label>
//                 <input 
//                   type="number" 
//                   value={frameWidth}
//                   onChange={(e) => {
//                     const value = parseInt(e.target.value) || 375;
//                     setFrameWidth(Math.max(375, Math.min(2000, value)));
//                   }}
//                 />
//               </div>
//               <div className="property-row">
//                 <label>Height</label>
//                 <input type="number" value="auto" readOnly />
//               </div>
//             </div>
//             <div className="property-group">
//               <h4>Appearance</h4>
//               <div className="property-row">
//                 <label>Opacity</label>
//                 <input type="number" defaultValue="100" />
//               </div>
//             </div>
//             <div className="property-group">
//               <h4>Charte Graphique</h4>
//               <div className="property-row">
//                 {/* <button className="view-button" onClick={() => window.location.href = '/homepage'}>
//                   Consulter La Charte 
//                 </button> */}

//                 <button className="view-button" onClick={openModal}>
//         Consulter La Charte
//       </button>
//       <Modal isOpen={isModalOpen} onClose={closeModal} className="modal">
//         <CharteGraphique />
//       </Modal>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default WorkspaceLayout;

import React, { useState, useEffect } from 'react';
import { ResizableBox } from 'react-resizable';
import './WorkspaceLayout.css';
import 'react-resizable/css/styles.css';
import CanvasArea from './canvasarea';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { FormControl, InputLabel, Select, MenuItem, Switch } from '@mui/material';
import Modal from '../charteGraphique/Modal';
import CharteGraphique from '../charteGraphique/charteGraphique';
import CustomSwitch from './CustomSwitch';

const devices = [
  { name: 'Desktop', width: 1480, minWidth: 1200 },
  { name: 'Tablet', width: 768 },
  { name: 'Mobile', width: 375 },
];

const styleOptions = {
  solutions: [
    { name: 'Numbered Cards', value: 0 },
    { name: 'Image Cards', value: 1 },
    { name: 'Hover Effect', value: 2 },
    { name: 'Image Hover Side by Side', value: 3 },
  ],
  events: [
    { name: 'Intro with Cards', value: 0 },
    { name: 'Image Cards', value: 1 },
    { name: 'Rounded Container', value: 2 },
  ],
  news: [
    { name: 'Grid with Buttons', value: 0 },
    { name: 'Icon Cards', value: 1 },
    { name: 'Scrollable Cards', value: 2 },
  ],
  faq: [
    { name: 'Accordion (Classic)', value: 0 },
    { name: 'Card Minimalist', value: 1 },
    { name: 'Style 3', value: 2 },
  ],
  services: [
    { name: 'List Cards', value: 0 },
    { name: 'Modern Cards', value: 1 },
  ],
  partners: [
    { name: 'Cards Slider', value: 0 },
    { name: 'Images Slider', value: 1 },
  ],
  about: [
    { name: 'Simple Layout', value: 0 },
    { name: 'Modern Layout', value: 1 },
  ],
  units: [
    { name: 'Classic Layout', value: 0 },
    { name: 'Modern Cards', value: 1 },
  ],
  contact: [
    { name: 'Classic Layout', value: 0 },
    { name: 'Modern Layout', value: 1 },
  ],
  slider: [
    { name: 'Classic Slider', value: 0 },
    { name: 'Modern Slider', value: 1 },
  ],
};

const WorkspaceLayout = () => {
  const [selectedDevice, setSelectedDevice] = useState(devices[0]);
  const [leftSidebarWidth] = useState(240);
  const [rightSidebarWidth] = useState(240);
  const [selectedTool, setSelectedTool] = useState('move');
  const [zoom, setZoom] = useState(65);
  const [frameWidth, setFrameWidth] = useState(selectedDevice.width);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [userEntreprise, setUserEntreprise] = useState(null);
  const [openPanel, setOpenPanel] = useState('solutions');
  const [entrepriseName, setEntrepriseName] = useState(null);
  const [styles, setStyles] = useState({
    solutionsStyle: 0,
    eventsStyle: 0,
    newsStyle: 0,
    faqStyle: 0,
    servicesStyle: 0,
    partnersStyle: 0,
    aboutStyle: 0,
    unitsStyle: 0,
    contactStyle: 0,
    sliderStyle: 0,
  });
  const [sectionOrder, setSectionOrder] = useState([
    'home',
    'partners',
    'about',
    'units',
    'services',
    'solutions',
    'events',
    'news',
    'testimonials',
    'faq',
    'contact',
  ]);
  const [draggedSection, setDraggedSection] = useState(null);
  const [sectionVisibility, setSectionVisibility] = useState({
    home: true,
    partners: true,
    about: true,
    units: true,
    services: true,
    solutions: true,
    events: true,
    news: true,
    testimonials: true,
    faq: true,
    contact: true,
  });

  const fetchUserEntreprise = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Token manquant. Veuillez vous connecter.');
      setLoading(false);
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken?.sub;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const userResponse = await axios.get(`http://localhost:5000/auth/user/${userId}`, config);
      setUserEntreprise(userResponse.data.entreprise);
    } catch (error) {
      console.error('Erreur lors de la récupération des données utilisateur:', error);
      setError('Erreur lors de la récupération des données utilisateur.');
      setLoading(false);
    }
  };

  const fetchEntrepriseName = async (userEntreprise) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Token manquant pour récupérer le nom de l’entreprise.');
      return;
    }

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const entrepriseResponse = await axios.get(
        `http://localhost:5000/entreprises/${userEntreprise}`,
        config
      );
      setEntrepriseName(entrepriseResponse.data.nom || 'Unknown');
    } catch (error) {
      console.error('Erreur lors de la récupération du nom de l’entreprise:', error);
      setError('Erreur lors de la récupération du nom de l’entreprise.');
    }
  };

  const fetchPreferences = async () => {
    if (!userEntreprise) {
      console.log('Entreprise non définie, annulation de fetchPreferences');
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:5000/preferences/entreprise/${userEntreprise}/preferences`
      );
      const fetchedPreferences = response.data.preferences || {
        solutionsStyle: 0,
        eventsStyle: 0,
        newsStyle: 0,
        faqStyle: 0,
        servicesStyle: 0,
        partnersStyle: 0,
        aboutStyle: 0,
        unitsStyle: 0,
        contactStyle: 0,
        sliderStyle: 0,
        sectionOrder: [
          'home',
          'partners',
          'about',
          'units',
          'services',
          'solutions',
          'events',
          'news',
          'testimonials',
          'faq',
          'contact',
        ],
        sectionVisibility: {
          home: true,
          partners: true,
          about: true,
          units: true,
          services: true,
          solutions: true,
          events: true,
          news: true,
          testimonials: true,
          faq: true,
          contact: true,
        },
      };
      const validPreferences = {
        solutionsStyle: Number.isInteger(fetchedPreferences.solutionsStyle)
          ? fetchedPreferences.solutionsStyle
          : 0,
        eventsStyle: Number.isInteger(fetchedPreferences.eventsStyle)
          ? fetchedPreferences.eventsStyle
          : 0,
        newsStyle: Number.isInteger(fetchedPreferences.newsStyle)
          ? fetchedPreferences.newsStyle
          : 0,
        faqStyle: Number.isInteger(fetchedPreferences.faqStyle)
          ? fetchedPreferences.faqStyle
          : 0,
        servicesStyle: Number.isInteger(fetchedPreferences.servicesStyle)
          ? fetchedPreferences.servicesStyle
          : 0,
        partnersStyle: Number.isInteger(fetchedPreferences.partnersStyle)
          ? fetchedPreferences.partnersStyle
          : 0,
        aboutStyle: Number.isInteger(fetchedPreferences.aboutStyle)
          ? fetchedPreferences.aboutStyle
          : 0,
        unitsStyle: Number.isInteger(fetchedPreferences.unitsStyle)
          ? fetchedPreferences.unitsStyle
          : 0,
        contactStyle: Number.isInteger(fetchedPreferences.contactStyle)
          ? fetchedPreferences.contactStyle
          : 0,
        sliderStyle: Number.isInteger(fetchedPreferences.sliderStyle)
          ? fetchedPreferences.sliderStyle
          : 0,
      };
      setStyles(validPreferences);
      setSectionOrder(fetchedPreferences.sectionOrder || sectionOrder);
      setSectionVisibility(fetchedPreferences.sectionVisibility || sectionVisibility);
    } catch (error) {
      console.error('Erreur lors de la récupération des préférences:', error);
      setError('Erreur lors de la récupération des préférences.');
    } finally {
      setLoading(false);
    }
  };

  const savePreferences = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/preferences/entreprise',
        { entreprise: userEntreprise, preferences: { ...styles, sectionOrder, sectionVisibility } },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccessMessage('Préférences enregistrées avec succès !');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des préférences:', error);
      setError('Erreur lors de la sauvegarde des préférences.');
    }
  };

  const handleStyleChange = (section, value) => {
    const newStyles = { ...styles, [section]: value };
    setStyles(newStyles);
  };

  const handleDragStart = (e, section) => {
    e.dataTransfer.setData('text/plain', section);
    setDraggedSection(section);
    e.currentTarget.classList.add('dragging');
  };

  const handleDragEnd = (e) => {
    e.currentTarget.classList.remove('dragging');
    setDraggedSection(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetSection) => {
    e.preventDefault();
    const dragged = e.dataTransfer.getData('text/plain');
    if (dragged) {
      const newOrder = [...sectionOrder];
      const draggedIndex = newOrder.indexOf(dragged);
      const targetIndex = newOrder.indexOf(targetSection);

      // Supprimer l'élément glissé de sa position initiale
      newOrder.splice(draggedIndex, 1);
      // Insérer l'élément à la position de la section cible
      newOrder.splice(targetIndex, 0, dragged);
      setSectionOrder(newOrder);
    }
    setDraggedSection(null);
  };

  const handleDragEnter = (e, section) => {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
  };

  const handleDragLeave = (e, section) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
  };

  const handleVisibilityChange = (section) => {
    setSectionVisibility((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  useEffect(() => {
    fetchUserEntreprise();
  }, []);

  useEffect(() => {
    if (userEntreprise) {
      fetchEntrepriseName(userEntreprise);
      fetchPreferences();
    }
  }, [userEntreprise]);

  const tools = [
    { name: 'move', label: 'Move' },
    { name: 'hand', label: 'Hand Tool' },
    { name: 'frame', label: 'Frame' },
    { name: 'layers', label: 'Layers' },
  ];

  const onResize = (event, { size }) => {
    setFrameWidth(size.width);
    const matchedDevice = devices.find((d) => Math.abs(d.width - size.width) < 10);
    if (matchedDevice && matchedDevice.name !== selectedDevice.name) {
      setSelectedDevice(matchedDevice);
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handlePreview = () => {
    if (userEntreprise) {
      window.location.href = `/homepage/${userEntreprise}/${entrepriseName}`;
    } else {
      setError('Entreprise non trouvée. Veuillez réessayer.');
    }
  };

  return (
    <div className="workspace-layout">
      <div className="workspace-header">
        <div className="header-left">
          <div className="tools-group">
            {tools.map((tool) => (
              <button
                key={tool.name}
                className={`tool-button ${selectedTool === tool.name ? 'active' : ''}`}
                onClick={() => setSelectedTool(tool.name)}
                title={tool.label}
              >
                {tool.name}
              </button>
            ))}
          </div>
        </div>

        <div className="header-center">
          <div className="device-selector">
            {devices.map((device) => (
              <button
                key={device.name}
                className={`device-button ${selectedDevice.name === device.name ? 'active' : ''}`}
                onClick={() => {
                  setSelectedDevice(device);
                  setFrameWidth(device.width);
                }}
              >
                {device.name}
              </button>
            ))}
          </div>
          <div className="frame-width-display">{frameWidth}px</div>
        </div>

        <div>
          <button className="view-button" onClick={handlePreview}>
            Prévisualiser le site
          </button>
        </div>

        <div className="header-right">
          <div className="zoom-controls">
            <button onClick={() => setZoom(Math.max(10, zoom - 5))}>-</button>
            <span>{zoom}%</span>
            <button onClick={() => setZoom(Math.min(200, zoom + 5))}>+</button>
          </div>
          <button className="preview-button" title="Preview">
            on
          </button>
          <button className="theme-button" title="Toggle theme">
            off
          </button>
        </div>
      </div>

      <div className="workspace-content">
        <div className="workspace-sidebar" style={{ width: `${leftSidebarWidth}px` }}>
          <div className="workspace-sidebar-content">
            {loading ? (
              <div className="sidebar-loading">Chargement...</div>
            ) : error ? (
              <div className="sidebar-error">Erreur : {error}</div>
            ) : (
              <>
                {sectionOrder.map((section) => (
                  <div
                    key={section}
                    className={`custom-panel ${openPanel === section ? 'open' : ''} ${!sectionVisibility[section] ? 'hidden' : ''} `}
                    draggable="true"
                    onDragStart={(e) => handleDragStart(e, section)}
                    onDragEnd={handleDragEnd}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, section)}
                    onDragEnter={(e) => handleDragEnter(e, section)}
                    onDragLeave={(e) => handleDragLeave(e, section)}
                  >
                    <div
                      className="custom-panel-header"
                      onClick={() => setOpenPanel(openPanel === section ? null : section)}
                    >
                      {/* <span className="drag-handle" draggable="true">
                        ☰
                      </span> */}
                      <span className="custom-panel-title">
                        {section.charAt(0).toUpperCase() + section.slice(1)}
                      </span>
                      <span className="custom-panel-arrow">
                        {openPanel === section ? '▾' : '▸'}
                      </span>
                    </div>
                    {openPanel === section && (
                      <div className="custom-panel-body">
                        <div 
                        // style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}
                        >
                          
                          {/* <Switch
                            checked={sectionVisibility[section]}
                            onChange={() => handleVisibilityChange(section)}
                            color="primary"
                          /> */}
                          <CustomSwitch
                            checked={sectionVisibility[section]}
                            onChange={() => handleVisibilityChange(section)}
                          />
                          {/* <span>Show Section</span> */}
                        </div>
                        {styleOptions[section]?.map((option) => (
                          <button
                            key={option.value}
                            className={`custom-style-btn${
                              styles[`${section}Style`] === option.value ? ' active' : ''
                            }`}
                            onClick={() => handleStyleChange(`${section}Style`, option.value)}
                          >
                            {option.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <button className="save-button" onClick={savePreferences}>
                  Save
                </button>
                {successMessage && <div className="success-message">{successMessage}</div>}
              </>
            )}
          </div>
        </div>

        <div
          className="workspace-main"
          style={{
            marginLeft: `${leftSidebarWidth}px`,
            marginRight: `${rightSidebarWidth}px`,
            width: `calc(100% - ${leftSidebarWidth + rightSidebarWidth}px)`,
          }}
        >
          <div className="canvas-container">
            <div className="canvas-grid">
              <ResizableBox
                className="canvas-frame"
                width={frameWidth}
                height={500}
                minConstraints={[375, 500]}
                maxConstraints={[2000, 500]}
                onResize={onResize}
                resizeHandles={['w', 'e']}
                axis="x"
                handle={(h, ref) => (
                  <div className={`custom-handle custom-handle-${h}`} ref={ref} />
                )}
              >
                <div
                  style={{
                    transform: `scale(${zoom / 100})`,
                    transformOrigin: 'center center',
                    height: '100%',
                  }}
                >
                  <CanvasArea styles={styles} sectionOrder={sectionOrder} sectionVisibility={sectionVisibility} />
                </div>
              </ResizableBox>
            </div>
          </div>
        </div>

        <div className="properties-panel" style={{ width: `${rightSidebarWidth}px` }}>
          <div className="properties-header">
            <h3>Properties</h3>
          </div>
          <div className="properties-content">
            <div className="property-group">
              <h4>Layout</h4>
              <div className="property-row">
                <label>Width</label>
                <input
                  type="number"
                  value={frameWidth}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 375;
                    setFrameWidth(Math.max(375, Math.min(2000, value)));
                  }}
                />
              </div>
              <div className="property-row">
                <label>Height</label>
                <input type="number" value="auto" readOnly />
              </div>
            </div>
            <div className="property-group">
              <h4>Appearance</h4>
              <div className="property-row">
                <label>Opacity</label>
                <input type="number" defaultValue="100" />
              </div>
            </div>
            <div className="property-group">
              <h4>Charte Graphique</h4>
              <div className="property-row">
                <button className="view-button" onClick={openModal}>
                  Consulter La Charte
                </button>
                <Modal isOpen={isModalOpen} onClose={closeModal} className="modal">
                  <CharteGraphique />
                </Modal>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceLayout;