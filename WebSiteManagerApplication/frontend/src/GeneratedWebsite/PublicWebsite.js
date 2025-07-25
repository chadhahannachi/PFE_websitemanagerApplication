import React, { useState, useEffect } from 'react';

// import Footer from './footer/Footer';

import axios from 'axios';
import FaqSectionDisplay from './faqs/FaqSectionDisplay';
import UnitSectionDisplay from './units/UnitSectionDisplay';
import { useParams, useNavigate } from 'react-router-dom';
import ServiceSectionDisplay from './ServicesDisplay/ServiceSectionDisplay';
import LatestEventsDisplay from './events/LatestEventsDisplay';
import SolutionSectionDisplay from './solutions/SolutionSectionDisplay';
import SliderDisplay from './slider/SliderDisplay';
import NavbarDisplay from './navbar/NavbarDisplay';
import AboutUsDisplay from './aboutus/AboutUsDisplay.js';
import ContactUsDisplay from './contactus/ContactUsDisplay.js';
import GeneratedContentDisplay from './IAgeneratedComponent/GeneratedContentDisplay.tsx';
import PartnersSectionDisplay from './partners/PartnersSectionDisplay.js';
import ChatbotEntreprise from '../chatbot/ChatbotEntreprise';


const PublicWebsite = () => {
  const { entrepriseId, entrepriseName } = useParams();
  const navigate = useNavigate();

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
  // const [userEntreprise, setUserEntreprise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [navbarStyles, setNavbarStyles] = useState({});
  const [sectionOrder, setSectionOrder] = useState([
    'home', 'partners', 'about', 'units', 'services', 'solutions', 'events', 'faq', 'contact'
  ]);
  const [sectionVisibility, setSectionVisibility] = useState({
    home: true, partners: true, about: true, units: true, services: true, solutions: true, events: true, faq: true, contact: true
  });
  const [companyLogoUrl, setCompanyLogoUrl] = useState(null);
  const [sliderStyles, setSliderStyles] = useState({});
  const [isPublic, setIsPublic] = useState(true);
  const [licence, setLicence] = useState(null);
  const [licenceLoading, setLicenceLoading] = useState(true);

  // Fetch preferences
  const fetchPreferences = async () => {
    if (!entrepriseId) {
      setError('ID de l\'entreprise manquant dans l\'URL.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:5000/preferences/entreprise/${entrepriseId}/preferences`
      );
      const fetchedPreferences = response.data.preferences || {};
      setSectionOrder(fetchedPreferences.sectionOrder || sectionOrder);
      setSectionVisibility(fetchedPreferences.sectionVisibility || sectionVisibility);
      setNavbarStyles((fetchedPreferences.navbar && fetchedPreferences.navbar.styles) || {});
      setSliderStyles((fetchedPreferences.slider && fetchedPreferences.slider.styles) || {});
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
      
      
      
    } catch (error) {
      console.error('Erreur lors de la récupération des préférences:', error);
      setError('Erreur lors de la récupération des préférences.');
    } finally {
      setLoading(false);
    }
  };


  const [customSections, setCustomSections] = useState([]);

  


  const fetchCustomSections = async () => {
    if (!entrepriseId) return;
    try {
      const response = await axios.get(`http://localhost:5000/contenus/ContenuSpecifique/entreprise/${entrepriseId}`);
      setCustomSections(response.data.map(content => ({
        id: content._id,
        content
      })));
    } catch (err) {
      console.error('Erreur lors du chargement des contenus IA:', err);
    }
  };


  useEffect(() => {
    fetchPreferences();
    fetchCustomSections();

  }, [entrepriseId]);

  
  // Récupérer le logo de l'entreprise
  useEffect(() => {
    const fetchLogo = async () => {
      if (!entrepriseId) return;
      try {
        const entRes = await axios.get(`http://localhost:5000/entreprises/${entrepriseId}`);
        if (entRes.data && entRes.data.logo) {
          setCompanyLogoUrl(entRes.data.logo);
        }
      } catch (e) {
        // ignore
      }
    };
    fetchLogo();
  }, [entrepriseId]);

  // Récupérer la licence de l'entreprise
  useEffect(() => {
    if (!entrepriseId) return;
    setLicenceLoading(true);
    axios.get(`http://localhost:5000/licences/mongo/${entrepriseId}`)
      .then(res => setLicence(res.data))
      .catch(() => setLicence(null))
      .finally(() => setLicenceLoading(false));
  }, [entrepriseId]);

  // useEffect(() => {
  //   // Vérifier si l'entreprise est publique
  //   const checkIsPublic = async () => {
  //     if (!entrepriseId) return;
  //     try {
  //       const res = await axios.get(`http://localhost:5000/entreprises/${entrepriseId}`);
  //       if (res.data && typeof res.data.isPublic === 'boolean') {
  //         setIsPublic(res.data.isPublic);
  //         if (res.data.isPublic === false) {
  //           // navigate('/access-denied', { replace: true });
  //           window.location.href = 'http://localhost:3000/access-denied';
  //         }
  //       }
  //     } catch (e) {
  //       // En cas d'erreur, on laisse l'accès (ou on peut choisir de bloquer)
  //     }
  //   };
  //   checkIsPublic();
  // }, [entrepriseId, navigate]);



  useEffect(() => {
    // Vérifier si l'entreprise est publique
    const checkIsPublic = async () => {
      if (!entrepriseId) return;
      try {
        const res = await axios.get(`http://localhost:5000/entreprises/${entrepriseId}`);
        if (res.data && typeof res.data.isPublic === 'boolean') {
          setIsPublic(res.data.isPublic);
          // On ne redirige plus ici, on attend la licence
        }
      } catch (e) {
        // En cas d'erreur, on laisse l'accès (ou on peut choisir de bloquer)
      }
    };
    checkIsPublic();
  }, [entrepriseId]);

  // Redirection si non public ou licence non payée
  if (licenceLoading || loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur : {error}</div>;
  if (!isPublic || !licence || licence.status !== 'paid') {
    // window.location.href = 'http://localhost:3000/access-denied';
     navigate('/ComingSoon', { replace: true });
    return null;
  }


  // Définir les sections disponibles
  const sections = {
    home: () => <SliderDisplay styleIndex={styles.sliderStyle} entrepriseId={entrepriseId} sliderStyles={sliderStyles} />,
    partners: () => <PartnersSectionDisplay styleIndex={styles.partnersStyle} entrepriseId={entrepriseId} />,
    about: () => <AboutUsDisplay entrepriseId={entrepriseId} />,
    units: () => <UnitSectionDisplay styleIndex={styles.unitsStyle} entrepriseId={entrepriseId} />,
    services: () => <ServiceSectionDisplay styleIndex={styles.servicesStyle} entrepriseId={entrepriseId} />,
    solutions: () => <SolutionSectionDisplay styleIndex={styles.solutionsStyle} entrepriseId={entrepriseId} />,
    events: () => <LatestEventsDisplay styleIndex={styles.eventsStyle} entrepriseId={entrepriseId} />,
    faq: () => <FaqSectionDisplay styleIndex={styles.faqStyle} entrepriseId={entrepriseId} />,
    contact: () => <ContactUsDisplay styleIndex={styles.contactStyle} entrepriseId={entrepriseId} />,
  };

  // Créer un mapping pour les sections personnalisées
  const customSectionMap = {};
  customSections.forEach(({ id, content }) => {
    customSectionMap[id] = () => <GeneratedContentDisplay content={content} entrepriseId={entrepriseId} />;
  });

  return (
    <div>
      <NavbarDisplay
        sectionOrder={sectionOrder}
        sectionVisibility={sectionVisibility}
        customSections={customSections}
        navbarStyles={navbarStyles}
        companyLogoUrl={companyLogoUrl}
      />
      
      {sectionOrder.map((sectionId) => (
        sectionVisibility[sectionId] && (
          <div key={sectionId} id={sectionId}>
            {sections[sectionId]
              ? sections[sectionId]()
              : customSectionMap[sectionId]
              ? customSectionMap[sectionId]()
              : null}
          </div>
        )
      ))}
      
      {/* <Footer/> */}
      {/* Intégration du chatbot entreprise en bas de page */}
      <div style={{ margin: '40px 0' }}>
        {entrepriseId && licence && licence.type === 'enterprise' && (
          <ChatbotEntreprise entrepriseId={entrepriseId} />
        )}
      </div>
    </div>
  );
};

export default PublicWebsite;