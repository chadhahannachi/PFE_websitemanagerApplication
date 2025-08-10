// canvasarea.js
import React, { useState, useEffect } from 'react';
import Navbar from './navbar/Navbar';
import Slider from './slider/Slider';
import OurPartners from './partners/OurPartners';
import LatestEvents from './events/LatestEvents';
import AboutUs from './aboutus/AboutUs';
import ContactUs from './contactus/ContactUs';
import OurSolutions from './solutions/OurSolutions';
import News from './news/News';
import Testimonials from './testimonials/Testimonials';
import Footer from './footer/Footer';
import FaqSection from './faqs/FaqSection';
import Units from './units/Units';
import OurServices from './services/OurServices';
import GeneratedContent from '../components/ContenuGenerator/GeneratedContent.tsx';
import { Button } from '@mui/material';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import ChatbotEntreprise from '../chatbot/ChatbotEntreprise';

const CanvasArea = ({ styles, sectionOrder, sectionVisibility, customSections = [], onOpenGenModal, onOpenAIUpdate, navbarStyles, sliderStyles, onOpenSliderStyleForm, entrepriseId, chatbotLivePrefs }) => {
  
  
  const sections = {
    home: () => (
      <Slider styleIndex={styles.sliderStyle} sliderStyles={sliderStyles} onOpenSliderStyleForm={onOpenSliderStyleForm} />
    ),
    partners: () => <OurPartners styleIndex={styles.partnersStyle} />,
    about: () => <AboutUs styleIndex={styles.aboutStyle} />,
    units: () => <Units styleIndex={styles.unitsStyle} />,
    services: () => <OurServices styleIndex={styles.servicesStyle} />,
    solutions: () => <OurSolutions styleIndex={styles.solutionsStyle} />,
    events: () => <LatestEvents styleIndex={styles.eventsStyle} />,
    news: () => <News styleIndex={styles.newsStyle} />,
    testimonials: () => <Testimonials />,
    faq: () => <FaqSection styleIndex={styles.faqStyle} />,
    contact: () => <ContactUs styleIndex={styles.contactStyle} />,
  };

  const [companyLogoUrl, setCompanyLogoUrl] = useState(null);
  const [customSectionsState, setCustomSections] = useState(customSections);
  const [userEntreprise, setUserEntreprise] = useState(null);
  // Ajout pour la licence
  const [licence, setLicence] = useState(null);
  const [licenceLoading, setLicenceLoading] = useState(true);

  React.useEffect(() => {
    setCustomSections(customSections);
  }, [customSections]);

  React.useEffect(() => {
    // Récupérer l'entreprise de l'utilisateur connecté
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserEntreprise(decodedToken?.entreprise || null);
      } catch (e) {
        setUserEntreprise(null);
      }
    }
  }, []);

  // Récupérer la licence de l'entreprise
  useEffect(() => {
    if (!entrepriseId) return;
    setLicenceLoading(true);
    // On suppose que l'endpoint est le même que dans CompanyDetail
    // http://localhost:5000/licences/mongo/:entrepriseId
    import('axios').then(({ default: axios }) => {
      axios.get(`http://localhost:5000/licences/mongo/${entrepriseId}`)
        .then(res => setLicence(res.data))
        .catch(() => setLicence(null))
        .finally(() => setLicenceLoading(false));
    });
  }, [entrepriseId]);

  const customSectionMap = {};
  customSectionsState.forEach(({ id, content }) => {
    customSectionMap[id] = (
      <div style={{ position: 'relative' }}>
        <GeneratedContent
          content={content}
          onOpenAIUpdate={onOpenAIUpdate}
          onArchived={archivedId => setCustomSections(prev => prev.filter(s => s.id !== archivedId))}
        />
      </div>
    );
  });

  React.useEffect(() => {
    const fetchLogo = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      let userId = null;
      try {
        userId = jwtDecode(token)?.sub;
      } catch (e) {
        return;
      }
      try {
        const userRes = await axios.get(`http://localhost:5000/auth/user/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
        const entrepriseId = userRes.data.entreprise;
        if (!entrepriseId) return;
        const entRes = await axios.get(`http://localhost:5000/entreprises/${entrepriseId}`);
        if (entRes.data && entRes.data.logo) {
          setCompanyLogoUrl(entRes.data.logo);
        }
      } catch (e) {
        // ignore
      }
    };
    fetchLogo();
  }, []);

  return (
    <div style={{width:'1600px'}}>
      <Navbar key={JSON.stringify(navbarStyles)} sectionOrder={sectionOrder} customSections={customSectionsState} sectionVisibility={sectionVisibility} navbarStyles={navbarStyles} companyLogoUrl={companyLogoUrl} />
      {sectionOrder.map((sectionId) => (
        sectionVisibility[sectionId] && (
          <div key={sectionId} id={sectionId}>
            {sections[sectionId]
              ? sections[sectionId]()
              : customSectionMap[sectionId]}
          </div>
        )
      ))}
      {/* Afficher le bouton seulement si licence.type est 'enterprise' ou 'professional' */}
      {/* {!licenceLoading && licence && (licence.type === 'enterprise' || licence.type === 'professional') && (
        <div id="generate-content" style={{ textAlign: 'center', margin: '2rem 0' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={onOpenGenModal}
            style={{ fontSize: '1.2rem', padding: '1rem 2rem' }}
          >
            + Générer du contenu
          </Button>
        </div>
      )} */}

        <div id="generate-content" style={{ textAlign: 'center', margin: '2rem 0' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={onOpenGenModal}
            style={{ fontSize: '1.2rem', padding: '1rem 2rem' }}
          >
            + Générer du contenu
          </Button>
        </div>
     


      <Footer />
      {/* Intégration du chatbot entreprise en bas de page comme dans HomePage */}
      <div style={{ margin: '40px 0' }}>
        {entrepriseId && licence && licence.type === 'enterprise' && (
          <ChatbotEntreprise entrepriseId={entrepriseId} livePrefs={chatbotLivePrefs} />
        )}
      </div>
    </div>
  );
};

export default CanvasArea;