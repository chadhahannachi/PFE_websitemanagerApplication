// import React, { useState } from 'react';
// import Navbar from './navbar/Navbar';
// import Slider from './slider/Slider';
// import OurPartners from './partners/OurPartners';
// import LatestEvents from './events/LatestEvents';
// import AboutUs from './aboutus/AboutUs';
// import ContactUs from './contactus/ContactUs';
// import OurSolutions from './solutions/OurSolutions';
// import News from './news/News';
// import Testimonials from './testimonials/Testimonials';
// import Footer from './footer/Footer';
// import FaqSection from './faqs/FaqSection';
// import Units from './units/Units';
// import OurServices from './services/OurServices';
// import Sidebar from './Sidebar';

// const HomePage = () => {
//   const [styles, setStyles] = useState({
//       solutionsStyle: 0,
//       eventsStyle: 0,
//       newsStyle: 0,
//       faqStyle: 0,
//       servicesStyle: 0, 
//       partnersStyle: 0, 
//       aboutStyle: 0, 
//       unitsStyle: 0, 
//       contactStyle: 0,
//       sliderStyle: 0,
//   });
//   const [sidebarWidth, setSidebarWidth] = useState(200); // Largeur initiale (expanded)

//   const handleStyleChange = (newStyles) => {
//     console.log('Nouveaux styles reçus dans HomePage:', newStyles);
//     setStyles(newStyles);
//   };

//   const handleSidebarToggle = (isExpanded) => {
//     setSidebarWidth(isExpanded ? 200 : 0); // 0px pour supprimer tout espace en mode réduit
//   };

  

//   return (
//     <div style={{ display: 'flex' }}>
//       <Sidebar onStyleChange={handleStyleChange} onToggle={handleSidebarToggle} />
//       <div style={{ marginLeft: `${sidebarWidth}px`, width: `calc(100% - ${sidebarWidth}px)`, transition: 'margin-left 0.3s ease, width 0.3s ease' }}>
//         <Navbar />
//         <div id="home"><Slider styleIndex={styles.sliderStyle} /></div>
//         <div id="partners"><OurPartners styleIndex={styles.partnersStyle} /></div>
//         <div id="about"><AboutUs styleIndex={styles.aboutStyle} /></div>
//         <div id="units"><Units styleIndex={styles.unitsStyle} /></div>
//         <div id="services"><OurServices styleIndex={styles.servicesStyle} /></div> {/* Passage de styleIndex */}
//         <div id="solutions"><OurSolutions styleIndex={styles.solutionsStyle} /></div>
//         <div id="events"><LatestEvents styleIndex={styles.eventsStyle} /></div>
//         <div id="news"><News styleIndex={styles.newsStyle} /></div>
//         <div id="testimonials"><Testimonials /></div>
//         <div id="faq"><FaqSection styleIndex={styles.faqStyle} /></div>
//         <div id="contact"><ContactUs styleIndex={styles.contactStyle} /></div>
        
//         <Footer />
//       </div>
//     </div>
//   );
// };

// export default HomePage;

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
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import FaqSectionDisplay from '../GeneratedWebsite/faqs/FaqSectionDisplay';
import UnitSectionDisplay from '../GeneratedWebsite/units/UnitSectionDisplay';
import { useParams } from 'react-router-dom';
import ServiceSectionDisplay from '../GeneratedWebsite/ServicesDisplay/ServiceSectionDisplay';
import LatestEventsDisplay from '../GeneratedWebsite/events/LatestEventsDisplay';
import SolutionSectionDisplay from '../GeneratedWebsite/solutions/SolutionSectionDisplay';
import SliderDisplay from '../GeneratedWebsite/slider/SliderDisplay';
import NewSectionDisplay from '../GeneratedWebsite/news/NewSectionDisplay';
import TestimonialsDisplay from '../GeneratedWebsite/testimonials/TestimonialsDisplay';

const HomePage = () => {
  const { entrepriseId, entrepriseName } = useParams();

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

  // Fetch user enterprise
  // const fetchUserEntreprise = async () => {
  //   const token = localStorage.getItem('token');
  //   if (!token) {
  //     setError('Token manquant. Veuillez vous connecter.');
  //     setLoading(false);
  //     return;
  //   }

  //   try {
  //     const decodedToken = jwtDecode(token);
  //     const userId = decodedToken?.sub;
  //     const config = { headers: { Authorization: `Bearer ${token}` } };
  //     const userResponse = await axios.get(`http://localhost:5000/auth/user/${userId}`, config);
  //     setUserEntreprise(userResponse.data.entreprise);
  //   } catch (error) {
  //     console.error('Erreur lors de la récupération des données utilisateur:', error);
  //     setError('Erreur lors de la récupération des données utilisateur.');
  //     setLoading(false);
  //   }
  // };

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
    } catch (error) {
      console.error('Erreur lors de la récupération des préférences:', error);
      setError('Erreur lors de la récupération des préférences.');
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   fetchUserEntreprise();
  // }, []);

  useEffect(() => {
    fetchPreferences();
  }, [entrepriseId]);

  // useEffect(() => {
  //   if (userEntreprise) {
  //     fetchPreferences();
  //   }
  // }, [userEntreprise]);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur : {error}</div>;

  return (
    <div>
      <Navbar />
      <div id="home"><SliderDisplay styleIndex={styles.sliderStyle} entrepriseId={entrepriseId}  /></div>
      <div id="partners"><OurPartners styleIndex={styles.partnersStyle} /></div>
      <div id="about"><AboutUs styleIndex={styles.aboutStyle} /></div>
      <div id="units"><UnitSectionDisplay styleIndex={styles.unitsStyle} entrepriseId={entrepriseId}  /></div>
      <div id="services"><ServiceSectionDisplay styleIndex={styles.servicesStyle} entrepriseId={entrepriseId} /></div>
      <div id="solutions"><SolutionSectionDisplay styleIndex={styles.solutionsStyle} entrepriseId={entrepriseId} /></div>
      <div id="events"><LatestEventsDisplay styleIndex={styles.eventsStyle} entrepriseId={entrepriseId}  /></div>
      <div id="news"><NewSectionDisplay styleIndex={styles.newsStyle} entrepriseId={entrepriseId} /></div>
      <div id="testimonials"><TestimonialsDisplay entrepriseId={entrepriseId} /></div>
      <div id="faq"><FaqSectionDisplay styleIndex={styles.faqStyle} entrepriseId={entrepriseId} /></div>
      <div id="contact"><ContactUs styleIndex={styles.contactStyle} /></div>
      <Footer/>
    </div>
  );
};

export default HomePage;