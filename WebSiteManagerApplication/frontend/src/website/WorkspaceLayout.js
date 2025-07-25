import React, { useState, useEffect, useRef } from 'react';
import { ResizableBox } from 'react-resizable';
import './WorkspaceLayout.css';
import 'react-resizable/css/styles.css';
import CanvasArea from './canvasarea';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { FormControl, InputLabel, Select, MenuItem, Switch, Slider } from '@mui/material';
import ModalCharte from '../charteGraphique/Modal';
import CharteGraphique from '../charteGraphique/charteGraphique';
import CustomSwitch from './CustomSwitch';
import GeneratedContent from '../components/ContenuGenerator/GeneratedContent.tsx';
import { ContenuGeneratorForm } from '../components/ContenuGenerator/ContenuGeneratorForm.tsx';
import AIUpdateForm from '../components/ContenuGenerator/AIUpdateForm.tsx';
import Modal from '@mui/material/Modal';
import { SketchPicker } from 'react-color';
import ChatbotStyleEditor from '../chatbot/ChatbotStyleEditor';
import { useTour } from '@reactour/tour';

const devices = [
  // { name: 'Desktop', width: 1550, minWidth: 1200 },
  { name: 'Desktop', width: 3000 },
  { name: 'Tablet', width: 768 },
  { name: 'Mobile', width: 375 },
];

const styleOptions = {
  solutions: [
    { name: 'Numbered Cards', value: 0 },
    // { name: 'Image Cards', value: 1 },
    { name: 'Hover Effect', value: 1 },
    { name: 'Image Hover Side by Side', value: 2 },
  ],
  events: [
    { name: 'Intro with Cards', value: 0 },
    { name: 'Image Cards', value: 1 },
    { name: 'Rounded Container', value: 2 },
  ],
  // news: [
  //   { name: 'Grid with Buttons', value: 0 },
  //   { name: 'Icon Cards', value: 1 },
  //   { name: 'Scrollable Cards', value: 2 },
  // ],
  faq: [
    // { name: 'Accordion (Classic)', value: 0 },
    { name: 'Card Minimalist', value: 0 },
    { name: 'Style 3', value: 1 },
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

const defaultNavbarStyles = {
  navLinkColor: '#ffffff',
  navLinkFont: 'Roboto',
  buttonBg: 'rgba(46,204,113,1)',
  buttonRadius: 8,
  buttonTextColor: '#ffffff',
  dropdownPanelBg: 'rgba(34,34,34,1)',
  dropdownNavlinkColor: '#ffffff',
  navbarBgColor: 'rgba(34,34,34,1)',
};

const defaultSliderStyles = {
  titleColor: '#ffffff',
  titleFont: 'Roboto',
  titleBold: false,
  titleItalic: false,
  titleUnderline: false,
  descColor: '#ffffff',
  descFont: 'Roboto',
  descBold: false,
  descItalic: false,
  descUnderline: false,
  sectionAlign: 'center',
  titlePosition: 'center',
  descPosition: 'center',
};

const fontOptions = [
  'Roboto',
  'Montserrat',
  'Open Sans',
  'Lato',
  'Poppins',
  'Oswald',
  'Raleway',
  'Nunito',
  'Merriweather',
  'Arial',
  'sans-serif',
];

const WorkspaceLayout = () => {
  const [selectedDevice, setSelectedDevice] = useState(devices[0]);
  const [leftSidebarWidth] = useState(240);
  const [rightSidebarWidth] = useState(240);
  const [selectedTool, setSelectedTool] = useState('move');
  const [zoom, setZoom] = useState(60);
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
    // newsStyle: 0,
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
    // 'news',
    // 'testimonials',
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
    // news: true,
    // testimonials: true,
    faq: true,
    contact: true,
  });
  const [customSections, setCustomSections] = useState([]);
  const [isGenModalOpen, setIsGenModalOpen] = useState(false);
  const [selectedContentForUpdate, setSelectedContentForUpdate] = useState(null);
  const [rightSidebarContent, setRightSidebarContent] = useState('properties');
  const [navbarStyles, setNavbarStyles] = useState(defaultNavbarStyles);
  const [sliderStyles, setSliderStyles] = useState(defaultSliderStyles);
  const [sliderStyleTarget, setSliderStyleTarget] = useState(null);
  const [sliderStylePanelOpen, setSliderStylePanelOpen] = useState(false);
  // Ajout état pour afficher/masquer la palette de couleurs
  const [colorPickerOpen, setColorPickerOpen] = useState({
    title: false,
    desc: false,
    navLink: false,
    buttonBg: false,
    buttonText: false,
    dropdownPanel: false,
    dropdownNavlink: false,
    navbarBg: false,
  });
  const colorPickerAnchor = useRef({});
  const [isChatbotStyleModalOpen, setIsChatbotStyleModalOpen] = useState(false);
  const [showChatbotStylePanel, setShowChatbotStylePanel] = useState(false);
  const [chatbotLivePrefs, setChatbotLivePrefs] = useState(null);
  const [licence, setLicence] = useState(null);
  const [licenceLoading, setLicenceLoading] = useState(true);
  const { setIsOpen } = useTour();

  // Démarrage automatique du tour la première fois
  useEffect(() => {
    const tourLaunched = localStorage.getItem('tourLaunched');
    if (!tourLaunched) {
      setIsOpen(true);
      localStorage.setItem('tourLaunched', 'true');
    }
  }, [setIsOpen]);

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
      setError('Token manquant pour récupérer le nom de l entreprise.');
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
      console.error('Erreur lors de la récupération du nom de l entreprise:', error);
      setError('Erreur lors de la récupération du nom de l entreprise.');
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
        // newsStyle: 0,
        faqStyle: 0,
        servicesStyle: 0,
        partnersStyle: 0,
        aboutStyle: 0,
        unitsStyle: 0,
        contactStyle: 0,
        sliderStyle: 0,
        navbar: { styles: defaultNavbarStyles },
        slider: { styles: defaultSliderStyles },
        sectionOrder: [
          'home',
          'partners',
          'about',
          'units',
          'services',
          'solutions',
          'events',
          // 'news',
          // 'testimonials',
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
          // news: true,
          // testimonials: true,
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
        // newsStyle: Number.isInteger(fetchedPreferences.newsStyle)
        //   ? fetchedPreferences.newsStyle
        //   : 0,
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
      let newSectionOrder = fetchedPreferences.sectionOrder || sectionOrder;
      if (!newSectionOrder.includes('home')) {
        newSectionOrder = ['home', ...newSectionOrder];
      }
      setStyles(validPreferences);
      setSectionOrder(newSectionOrder);
      setSectionVisibility(fetchedPreferences.sectionVisibility || sectionVisibility);
      setNavbarStyles(fetchedPreferences.navbar?.styles || defaultNavbarStyles);
      setSliderStyles({
        ...defaultSliderStyles,
        ...(fetchedPreferences.slider?.styles || {}),
      });
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
      newOrder.splice(draggedIndex, 1);
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

  const fetchCustomSections = async () => {
    if (!userEntreprise) return;
    try {
      const response = await axios.get(`http://localhost:5000/contenus/ContenuSpecifique/entreprise/${userEntreprise}`);
      const sections = response.data.map((content) => ({
        id: content._id,
        content,
      }));
      setCustomSections(sections);
      setSectionOrder((prev) => {
        const customIds = sections.map(s => s.id);
        const cleaned = prev.filter(id => styleOptions[id] || customIds.includes(id));
        const missingCustom = customIds.filter(id => !cleaned.includes(id));
        let newOrder = [...cleaned, ...missingCustom];
        if (!newOrder.includes('home')) {
          newOrder = ['home', ...newOrder];
        }
        return newOrder;
      });
      setSectionVisibility((prev) => {
        const updated = { ...prev };
        sections.forEach(({ id }) => {
          if (!(id in updated)) updated[id] = true;
        });
        return updated;
      });
    } catch (err) {
      console.error('Erreur lors du chargement des contenus IA:', err);
    }
  };

  useEffect(() => {
    fetchUserEntreprise();
  }, []);

  useEffect(() => {
    if (userEntreprise) {
      fetchEntrepriseName(userEntreprise);
      fetchPreferences();
      fetchCustomSections();
    }
  }, [userEntreprise]);

  // Récupérer la licence de l'entreprise
  useEffect(() => {
    if (!userEntreprise) return;
    setLicenceLoading(true);
    import('axios').then(({ default: axios }) => {
      axios.get(`http://localhost:5000/licences/mongo/${userEntreprise}`)
        .then(res => setLicence(res.data))
        .catch(() => setLicence(null))
        .finally(() => setLicenceLoading(false));
    });
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

  const handleContentGenerated = async () => {
    setIsGenModalOpen(false);
    await fetchCustomSections();
  };

  const handleOpenAIUpdate = (content) => {
    setSelectedContentForUpdate(content);
    setRightSidebarContent('ai-update');
  };

  const handleCloseAIUpdate = () => {
    setSelectedContentForUpdate(null);
    setRightSidebarContent('properties');
  };

  const handleContentUpdated = async (updatedContent) => {
    setCustomSections(prev =>
      prev.map(section =>
        section.id === updatedContent._id
          ? { ...section, content: updatedContent }
          : section
      )
    );
    handleCloseAIUpdate();
  };

  const openNavbarStylePanel = () => setRightSidebarContent('navbar-style');
  const closeNavbarStylePanel = () => setRightSidebarContent('properties');
  const saveNavbarStyles = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/preferences/entreprise',
        { entreprise: userEntreprise, preferences: { navbar: { styles: navbarStyles } } },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const response = await axios.get(
        `http://localhost:5000/preferences/entreprise/${userEntreprise}/preferences`
      );
      if (response.data.preferences && response.data.preferences.navbar && response.data.preferences.navbar.styles) {
        setNavbarStyles(response.data.preferences.navbar.styles);
      }
      setSuccessMessage('Styles de la navbar enregistrés !');
      setTimeout(() => setSuccessMessage(null), 3000);
      setRightSidebarContent('properties');
    } catch (error) {
      setError('Erreur lors de la sauvegarde des styles navbar.');
    }
  };

  const saveSliderStyles = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/preferences/entreprise',
        { entreprise: userEntreprise, preferences: { slider: { styles: sliderStyles } } },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const response = await axios.get(
        `http://localhost:5000/preferences/entreprise/${userEntreprise}/preferences`
      );
      if (response.data.preferences && response.data.preferences.slider && response.data.preferences.slider.styles) {
        setSliderStyles({ ...defaultSliderStyles, ...response.data.preferences.slider.styles });
      }
      setSuccessMessage('Styles du slider enregistrés !');
      setTimeout(() => setSuccessMessage(null), 3000);
      setRightSidebarContent('properties');
      setSliderStylePanelOpen(false);
    } catch (error) {
      setError('Erreur lors de la sauvegarde des styles slider.');
    }
  };

  const openSliderStylePanel = () => {
    setSliderStylePanelOpen(true);
    setRightSidebarContent('slider-style');
  };

  const closeSliderStylePanel = () => {
    setSliderStylePanelOpen(false);
    setRightSidebarContent('properties');
  };

  return (
    <div className="workspace-layout">
      <div className="workspace-header">
        <div className="header-left">
          {/* <div className="tools-group">
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
          </div> */}

        <div>
          <img alt="profile-user" width="100px" height="100px" src={`../../assets/logo-white.png`} style={{ cursor: "pointer"}}/>
        </div>
</div>
        <div className="header-center">
          {/* <div className="device-selector">
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
          </div> */}
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
          {/* <button className="preview-button" title="Preview">
            on
          </button>
          <button className="theme-button" title="Toggle theme">
            off
          </button> */}
        </div>
        {/* Ajout du bouton pour démarrer le tour */}
        <div style={{ marginBottom: 16 }}>
          <button className="save-button" onClick={() => setIsOpen(true)}>
            Démarrer le guide d'utilisation
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
                {sectionOrder
                  .filter(section =>
                    styleOptions[section] || customSections.find(s => s.id === section)
                  )
                  .map((section) => (
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
                        <span className="custom-panel-title">
                          {customSections.find(s => s.id === section)
                            ? customSections.find(s => s.id === section).content.titre
                            : section.charAt(0).toUpperCase() + section.slice(1)}
                        </span>
                        <span className="custom-panel-arrow">
                          {openPanel === section ? '▾' : '▸'}
                        </span>
                      </div>
                      {openPanel === section && (
                        <div className="custom-panel-body">
                          <CustomSwitch
                            checked={sectionVisibility[section]}
                            onChange={() => handleVisibilityChange(section)}
                          />
                          {!customSections.find(s => s.id === section) && styleOptions[section]?.map((option) => (
                            <button
                              key={option.value}
                              className={`custom-style-btn${styles[`${section}Style`] === option.value ? ' active' : ''}`}
                              onClick={() => handleStyleChange(`${section}Style`, option.value)}
                            >
                              {option.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                <button className="save-button" id='save-preferences' onClick={savePreferences}>
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
                maxConstraints={[3000, 500]}
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
                  <CanvasArea
                    styles={styles}
                    sectionOrder={sectionOrder}
                    sectionVisibility={sectionVisibility}
                    customSections={customSections}
                    onOpenGenModal={() => setIsGenModalOpen(true)}
                    onOpenAIUpdate={handleOpenAIUpdate}
                    navbarStyles={navbarStyles}
                    sliderStyles={sliderStyles}
                    onOpenSliderStyleForm={openSliderStylePanel}
                    entrepriseId={userEntreprise}
                    chatbotLivePrefs={chatbotLivePrefs}
                    onLiveChange={setChatbotLivePrefs}
                  />
                </div>
              </ResizableBox>
            </div>
          </div>
        </div>

        <div className="properties-panel" style={{ width: `${rightSidebarWidth}px` }}>
          {rightSidebarContent === 'navbar-style' ? (
            <div className="navbar-style-panel" style={{ padding: '5px', position: 'relative' }}>
              <div className="ai-update-header" style={{ marginBottom: '10px' }}>
                <h3>Personnaliser la Navbar</h3>
                <button className="close-button" onClick={closeNavbarStylePanel} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#666' }}>×</button>
              </div>
              {/* Couleur des liens */}
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16, position: 'relative' }}>
                <InputLabel style={{ color: 'white', marginRight: 10 }}>Couleur des liens</InputLabel>
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 4,
                    background: navbarStyles.navLinkColor,
                    border: '1px solid #ccc',
                    cursor: 'pointer',
                    marginRight: 8,
                    boxShadow: '0 1px 4px rgba(0,0,0,0.12)'
                  }}
                  onClick={() => setColorPickerOpen(o => ({ ...o, navLink: !o.navLink }))}
                  ref={el => (colorPickerAnchor.current.navLink = el)}
                />
                {colorPickerOpen.navLink && (
                  <div style={{ position: 'absolute', zIndex: 10010, top: 32, left: 0 }}>
                    <div style={{ position: 'fixed', inset: 0 }} onClick={() => setColorPickerOpen(o => ({ ...o, navLink: false }))} />
                    <SketchPicker
                      color={navbarStyles.navLinkColor}
                      onChange={color => setNavbarStyles(s => ({ ...s, navLinkColor: color.hex }))}
                      disableAlpha
                    />
                  </div>
                )}
              </div>
              {/* Police des liens */}
              <div style={{ marginBottom: 16}}>
              <InputLabel style={{ color: 'white', marginBottom: 10, marginTop: 16 }}>Police des liens</InputLabel>

                <FormControl fullWidth>
                  
                  {/* <InputLabel style={{ color: 'white' , marginBottom: 10}}>Police des liens</InputLabel> */}
                  <Select
                    value={navbarStyles.navLinkFont}
                    label="Police des liens"
                    onChange={e => setNavbarStyles(s => ({ ...s, navLinkFont: e.target.value }))}
                    size="small"
                    sx={{
                      backgroundColor: '#777777',
                      color: '#222',
                      borderRadius: 2,
                    
                    }}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          backgroundColor: '#fff',
                          color: '#222',
                        },
                      },
                    }}
                  >
                    {fontOptions.map(font => (
                      <MenuItem key={font} value={font} style={{ fontFamily: font }}>{font}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              {/* Couleur de fond du bouton */}
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16, position: 'relative' }}>
                <InputLabel style={{ color: 'white', marginRight: 10 }}>Couleur de fond du bouton</InputLabel>
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 4,
                    background: navbarStyles.buttonBg,
                    border: '1px solid #ccc',
                    cursor: 'pointer',
                    marginRight: 8,
                    boxShadow: '0 1px 4px rgba(0,0,0,0.12)'
                  }}
                  onClick={() => setColorPickerOpen(o => ({ ...o, buttonBg: !o.buttonBg }))}
                  ref={el => (colorPickerAnchor.current.buttonBg = el)}
                />
                {colorPickerOpen.buttonBg && (
                  <div style={{ position: 'absolute', zIndex: 10010, top: 32, left: 0 }}>
                    <div style={{ position: 'fixed', inset: 0 }} onClick={() => setColorPickerOpen(o => ({ ...o, buttonBg: false }))} />
                    <SketchPicker
                      color={navbarStyles.buttonBg}
                      onChange={color => setNavbarStyles(s => ({ ...s, buttonBg: color.rgb ? `rgba(${color.rgb.r},${color.rgb.g},${color.rgb.b},${color.rgb.a})` : color.hex }))}
                    />
                  </div>
                )}
              </div>
              {/* Couleur du texte du bouton */}
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16, position: 'relative' }}>
                <InputLabel style={{ color: 'white', marginRight: 10 }}>Couleur du texte du bouton</InputLabel>
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 4,
                    background: navbarStyles.buttonTextColor,
                    border: '1px solid #ccc',
                    cursor: 'pointer',
                    marginRight: 8,
                    boxShadow: '0 1px 4px rgba(0,0,0,0.12)'
                  }}
                  onClick={() => setColorPickerOpen(o => ({ ...o, buttonText: !o.buttonText }))}
                  ref={el => (colorPickerAnchor.current.buttonText = el)}
                />
                {colorPickerOpen.buttonText && (
                  <div style={{ position: 'absolute', zIndex: 10010, top: 32, left: 0 }}>
                    <div style={{ position: 'fixed', inset: 0 }} onClick={() => setColorPickerOpen(o => ({ ...o, buttonText: false }))} />
                    <SketchPicker
                      color={navbarStyles.buttonTextColor}
                      onChange={color => setNavbarStyles(s => ({ ...s, buttonTextColor: color.hex }))}
                      disableAlpha
                    />
                  </div>
                )}
              </div>
              {/* Border radius du bouton */}
              <div style={{ marginBottom: 16 }}>
                <InputLabel style={{ color: 'white' , marginBottom: 10}}>Border radius du bouton</InputLabel>
                <Slider
                  value={navbarStyles.buttonRadius}
                  min={0}
                  max={32}
                  step={1}
                  onChange={(_, v) => setNavbarStyles(s => ({ ...s, buttonRadius: v }))}
                  valueLabelDisplay="auto"
                />
              </div>
              {/* Background du panel du dropdown */}
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16, position: 'relative' }}>
                <InputLabel style={{ color: 'white', marginRight: 10 }}>Background du panel du dropdown</InputLabel>
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 4,
                    background: navbarStyles.dropdownPanelBg,
                    border: '1px solid #ccc',
                    cursor: 'pointer',
                    marginRight: 8,
                    boxShadow: '0 1px 4px rgba(0,0,0,0.12)'
                  }}
                  onClick={() => setColorPickerOpen(o => ({ ...o, dropdownPanel: !o.dropdownPanel }))}
                  ref={el => (colorPickerAnchor.current.dropdownPanel = el)}
                />
                {colorPickerOpen.dropdownPanel && (
                  <div style={{ position: 'absolute', zIndex: 10010, top: 32, left: 0 }}>
                    <div style={{ position: 'fixed', inset: 0 }} onClick={() => setColorPickerOpen(o => ({ ...o, dropdownPanel: false }))} />
                    <SketchPicker
                      color={navbarStyles.dropdownPanelBg}
                      onChange={color => setNavbarStyles(s => ({
                        ...s,
                        dropdownPanelBg: color.rgb ? `rgba(${color.rgb.r},${color.rgb.g},${color.rgb.b},${color.rgb.a})` : color.hex
                      }))}
                    />
                  </div>
                )}
              </div>
              {/* Couleur des liens du dropdown */}
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16, position: 'relative' }}>
                <InputLabel style={{ color: 'white', marginRight: 10 }}>Couleur des liens du dropdown</InputLabel>
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 4,
                    background: navbarStyles.dropdownNavlinkColor,
                    border: '1px solid #ccc',
                    cursor: 'pointer',
                    marginRight: 8,
                    boxShadow: '0 1px 4px rgba(0,0,0,0.12)'
                  }}
                  onClick={() => setColorPickerOpen(o => ({ ...o, dropdownNavlink: !o.dropdownNavlink }))}
                  ref={el => (colorPickerAnchor.current.dropdownNavlink = el)}
                />
                {colorPickerOpen.dropdownNavlink && (
                  <div style={{ position: 'absolute', zIndex: 10010, top: 32, left: 0 }}>
                    <div style={{ position: 'fixed', inset: 0 }} onClick={() => setColorPickerOpen(o => ({ ...o, dropdownNavlink: false }))} />
                    <SketchPicker
                      color={navbarStyles.dropdownNavlinkColor}
                      onChange={color => setNavbarStyles(s => ({ ...s, dropdownNavlinkColor: color.hex }))}
                      disableAlpha
                    />
                  </div>
                )}
              </div>
              {/* Background de la navbar */}
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 5, position: 'relative' }}>
                <InputLabel style={{ color: 'white', marginRight: 10 }}>Background de la navbar</InputLabel>
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 4,
                    background: navbarStyles.navbarBgColor,
                    border: '1px solid #ccc',
                    cursor: 'pointer',
                    marginRight: 8,
                    boxShadow: '0 1px 4px rgba(0,0,0,0.12)'
                  }}
                  onClick={() => setColorPickerOpen(o => ({ ...o, navbarBg: !o.navbarBg }))}
                  ref={el => (colorPickerAnchor.current.navbarBg = el)}
                />
                {colorPickerOpen.navbarBg && (
                  <div style={{ position: 'absolute', zIndex: 10010, top: 32, left: 0 }}>
                    <div style={{ position: 'fixed', inset: 0 }} onClick={() => setColorPickerOpen(o => ({ ...o, navbarBg: false }))} />
                    <SketchPicker
                      color={navbarStyles.navbarBgColor}
                      onChange={color => setNavbarStyles(s => ({
                        ...s,
                        navbarBgColor: color.rgb ? `rgba(${color.rgb.r},${color.rgb.g},${color.rgb.b},${color.rgb.a})` : color.hex
                      }))}
                    />
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', gap: 8, marginBottom: '50px' }}>
                <button className="save-button" onClick={saveNavbarStyles}>Save</button>
                <button className="save-button" style={{ background: '#aaa' }} onClick={closeNavbarStylePanel}>Annuler</button>
              </div>
              {successMessage && <div className="success-message">{successMessage}</div>}
            </div>
          ) : rightSidebarContent === 'properties' && !showChatbotStylePanel ? (
            <>
              <div className="properties-header">
                <h3>Properties</h3>
              </div>
              <div className="properties-content">


                {/* <div className="property-group">
                  <h4>Layout</h4>
                  <div className="property-row">
                    <label>Width</label>
                    <input
                      type="number"
                      value={frameWidth}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 375;
                        setFrameWidth(Math.max(375, Math.min(3000, value)));
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
                </div> */}


                


                <div className="property-group">
                  <h4>Gestion des couleurs</h4>
                  <div className="property-row">
                    <button className="save-button" id="afficher-couleurs" style={{ margin: '6px 0' }} onClick={openModal}>
                      Afficher les couleurs 
                    </button>
                    <ModalCharte isOpen={isModalOpen} onClose={closeModal} className="modal">
                      <CharteGraphique />
                    </ModalCharte>
                  </div>
                </div>

                <div className="property-group">
                  <h4>Gestion du Navbar</h4>
                  <div className="property-row">
                  <button className="save-button" id="personnaliser-navbar" style={{ margin: '6px 0' }} onClick={openNavbarStylePanel}>Personnaliser Navbar</button>
                  </div>
                </div>

                {licence && licence.type === 'enterprise' && (
                  <div className="property-group">
                    <h4>Gestion des styles du Chatbot </h4>
                    <div className="property-row">
                      <button className="save-button" id="personnaliser-chatbot" style={{ margin: '6px 0' }} onClick={() => setShowChatbotStylePanel(true)}>
                        Personnaliser Chatbot
                      </button>
                    </div>
                  </div>
                )}


                {/* <button className="save-button" style={{ margin: '16px 0' }} onClick={openNavbarStylePanel}>Personnaliser Navbar</button> */}
                {/* <button className="save-button" style={{ margin: '16px 0', background: '#007bff', color: '#fff' }} onClick={() => setShowChatbotStylePanel(true)}>
                  Personnaliser Chatbot
                </button> */}
              </div>
            </>
          ) : showChatbotStylePanel ? (
            <div style={{ padding: 0, height: '100%', background: 'none', border: 'none', minWidth: 200 }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px 0 16px',
                borderBottom: '1px solid #333',
                marginBottom: 12
              }}>
                <h3 style={{ color: '#fff', fontSize: 15, margin: 0, marginBottom: 12 }}>Personnaliser le Chatbot</h3>
                <button
                  className="close-button"
                  onClick={() => setShowChatbotStylePanel(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '1.8rem',
                    cursor: 'pointer',
                    color: '#fff',
                    lineHeight: 1,
                    padding: 0,
                    marginLeft: 8, 
                    marginBottom: 12
                  }}
                  aria-label="Fermer l'édition du chatbot"
                >
                  ×
                </button>
              </div>
              <div style={{ padding: '0 16px 16px 16px' }}>
                <ChatbotStyleEditor entrepriseId={userEntreprise} onSaved={() => {}} livePrefs={chatbotLivePrefs} onLiveChange={setChatbotLivePrefs} />
              </div>
            </div>
          ) : rightSidebarContent === 'slider-style' && sliderStylePanelOpen ? (
            <div className="slider-style-panel" style={{ padding: '5px', position: 'relative' }}>
              <div className="ai-update-header" style={{ marginBottom: '10px' }}>
                <h3>Personnaliser le style du Slider</h3>
                <button
                  className="close-button"
                  onClick={closeSliderStylePanel}
                  style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#666' }}
                >
                  ×
                </button>
              </div>
              {/* Alignement global ... */}
              <InputLabel style={{ color: 'white', marginBottom: 10 }}>Alignement du bloc titre+description</InputLabel>
              <Select
                value={sliderStyles.sectionAlign}
                fullWidth
                onChange={e => setSliderStyles(s => ({ ...s, sectionAlign: e.target.value }))}
                style={{ marginBottom: 16 }}
                size="small"
                sx={{
                  backgroundColor: '#777777',
                  color: '#222',
                  borderRadius: 2,
                  
                }}
                MenuProps={{
                  PaperProps: {
                    style: {
                      backgroundColor: '#fff',
                      color: '#222',
                    },
                  },
                }}
              >
                <MenuItem value="left">Gauche</MenuItem>
                <MenuItem value="center">Centré</MenuItem>
                <MenuItem value="right">Droite</MenuItem>
              </Select>
              {/* Titre - couleur avec carré cliquable */}
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                <InputLabel style={{ color: 'white', marginRight: 10 }}>Couleur du titre</InputLabel>
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 4,
                    background: sliderStyles.titleColor,
                    border: '1px solid #ccc',
                    cursor: 'pointer',
                    marginRight: 8,
                    boxShadow: '0 1px 4px rgba(0,0,0,0.12)'
                  }}
                  onClick={() => setColorPickerOpen(o => ({ ...o, title: !o.title }))}
                  ref={el => (colorPickerAnchor.current.title = el)}
                />
                {colorPickerOpen.title && (
                  <div style={{ position: 'absolute', zIndex: 10010, top: 32, left: 0 }}>
                    <div style={{ position: 'fixed', inset: 0 }} onClick={() => setColorPickerOpen(o => ({ ...o, title: false }))} />
                    <SketchPicker
                      color={sliderStyles.titleColor}
                      onChange={color => setSliderStyles(s => ({ ...s, titleColor: color.hex }))}
                    />
                  </div>
                )}
              </div>
              {/* Police du titre ... */}
              <InputLabel style={{ color: 'white', marginBottom: 10, marginTop: 16 }}>Police du titre</InputLabel>
              <Select
                value={sliderStyles.titleFont}
                fullWidth
                onChange={e => setSliderStyles(s => ({ ...s, titleFont: e.target.value }))}
                size="small"
                sx={{
                  backgroundColor: '#777777',
                  color: '#222',
                  borderRadius: 2,
                  
                }}
                MenuProps={{
                  PaperProps: {
                    style: {
                      backgroundColor: '#fff',
                      color: '#222',
                    },
                  },
                }}
              >
                {fontOptions.map(font => (
                  <MenuItem key={font} value={font} style={{ fontFamily: font }}>{font}</MenuItem>
                ))}
              </Select>
              <div style={{ display: 'flex', gap: 16, margin: '12px 0' }}>
                <label style={{ color: 'white' }}><input type="checkbox" checked={sliderStyles.titleBold} onChange={e => setSliderStyles(s => ({ ...s, titleBold: e.target.checked }))}/> Gras</label>
                <label style={{ color: 'white' }}><input type="checkbox" checked={sliderStyles.titleItalic} onChange={e => setSliderStyles(s => ({ ...s, titleItalic: e.target.checked }))}/> Italique</label>
                <label style={{ color: 'white' }}><input type="checkbox" checked={sliderStyles.titleUnderline} onChange={e => setSliderStyles(s => ({ ...s, titleUnderline: e.target.checked }))}/> Souligné</label>
              </div>
              {/* Description - couleur avec carré cliquable */}
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10, marginTop: 16 }}>
                <InputLabel style={{ color: 'white', marginRight: 10 }}>Couleur de la description</InputLabel>
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 4,
                    background: sliderStyles.descColor,
                    border: '1px solid #ccc',
                    cursor: 'pointer',
                    marginRight: 8,
                    boxShadow: '0 1px 4px rgba(0,0,0,0.12)'
                  }}
                  onClick={() => setColorPickerOpen(o => ({ ...o, desc: !o.desc }))}
                  ref={el => (colorPickerAnchor.current.desc = el)}
                />
                {colorPickerOpen.desc && (
                  <div style={{ position: 'absolute', zIndex: 10010, top: 32, left: 0 }}>
                    <div style={{ position: 'fixed', inset: 0 }} onClick={() => setColorPickerOpen(o => ({ ...o, desc: false }))} />
                    <SketchPicker
                      color={sliderStyles.descColor}
                      onChange={color => setSliderStyles(s => ({ ...s, descColor: color.hex }))}
                    />
                  </div>
                )}
              </div>
              {/* Police de la description ... */}
              <InputLabel style={{ color: 'white', marginBottom: 10, marginTop: 16 }}>Police de la description</InputLabel>
              <Select
                value={sliderStyles.descFont}
                fullWidth
                onChange={e => setSliderStyles(s => ({ ...s, descFont: e.target.value }))}
                size="small"
                sx={{
                  backgroundColor: '#777777',
                  color: '#222',
                  borderRadius: 2,
                  
                  
                }}
                MenuProps={{
                  PaperProps: {
                    style: {
                      backgroundColor: '#fff',
                      color: '#222',
                    },
                  },
                }}
              >
                {fontOptions.map(font => (
                  <MenuItem key={font} value={font} style={{ fontFamily: font }}>{font}</MenuItem>
                ))}
              </Select>
              <div style={{ display: 'flex', gap: 16, margin: '12px 0' }}>
                <label style={{ color: 'white' }}><input type="checkbox" checked={sliderStyles.descBold} onChange={e => setSliderStyles(s => ({ ...s, descBold: e.target.checked }))}/> Gras</label>
                <label style={{ color: 'white' }}><input type="checkbox" checked={sliderStyles.descItalic} onChange={e => setSliderStyles(s => ({ ...s, descItalic: e.target.checked }))}/> Italique</label>
                <label style={{ color: 'white' }}><input type="checkbox" checked={sliderStyles.descUnderline} onChange={e => setSliderStyles(s => ({ ...s, descUnderline: e.target.checked }))}/> Souligné</label>
              </div>
              {/* ... suite inchangée ... */}
              <div style={{ display: 'flex', gap: 8, marginBottom: '55px' }}>
                <button className="save-button" onClick={saveSliderStyles}>Save</button>
                <button className="save-button" style={{ background: '#aaa' }} onClick={closeSliderStylePanel}>Annuler</button>
              </div>
            </div>
          ) : (
            <div className="ai-update-panel">
              <div className="ai-update-header">
                <h3>Modifier avec l'IA</h3>
                <button
                  className="close-button"
                  onClick={handleCloseAIUpdate}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    color: '#666'
                  }}
                >
                  ×
                </button>
              </div>
              <div className="ai-update-content">
                {selectedContentForUpdate && (
                  <AIUpdateForm
                    content={selectedContentForUpdate}
                    onUpdate={handleContentUpdated}
                    onCancel={handleCloseAIUpdate}
                  />
                )}
              </div>
            </div>
          )}
        </div>
        {/* Modale édition style chatbot */}
        {isChatbotStyleModalOpen && (
          <Modal open={isChatbotStyleModalOpen} onClose={() => setIsChatbotStyleModalOpen(false)}>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: '#fff', padding: 32, borderRadius: 8, maxWidth: 400, width: '90%' }}>
              <ChatbotStyleEditor
                entrepriseId={userEntreprise}
                onClose={() => setIsChatbotStyleModalOpen(false)}
                onSaved={() => { setIsChatbotStyleModalOpen(false); window.location.reload(); }}
              />
            </div>
          </Modal>
        )}
      </div>
      <Modal open={isGenModalOpen} onClose={() => setIsGenModalOpen(false)}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: '#fff', padding: 32, borderRadius: 8, maxWidth: 900, width: '90%', maxHeight: '90vh', overflow: 'auto' }}>
          <ContenuGeneratorForm
            entrepriseId={userEntreprise}
            onContentGenerated={handleContentGenerated}
          />
        </div>
      </Modal>
    </div>
  );
};

export default WorkspaceLayout;