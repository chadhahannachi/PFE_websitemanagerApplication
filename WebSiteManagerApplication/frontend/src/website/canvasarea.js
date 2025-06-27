// import React from 'react';
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

// const CanvasArea = ({ styles }) => {
//   return (
//     <div>
//       <Navbar />
//       <div id="home"><Slider styleIndex={styles.sliderStyle} /></div>
//       <div id="partners"><OurPartners styleIndex={styles.partnersStyle} /></div>
//       <div id="about"><AboutUs styleIndex={styles.aboutStyle} /></div>
//       <div id="units"><Units styleIndex={styles.unitsStyle} /></div>
//       <div id="services"><OurServices styleIndex={styles.servicesStyle} /></div>
//       <div id="solutions"><OurSolutions styleIndex={styles.solutionsStyle} /></div>
//       <div id="events"><LatestEvents styleIndex={styles.eventsStyle} /></div>
//       <div id="news"><News styleIndex={styles.newsStyle} /></div>
//       <div id="testimonials"><Testimonials /></div>
//       <div id="faq"><FaqSection styleIndex={styles.faqStyle} /></div>
//       <div id="contact"><ContactUs styleIndex={styles.contactStyle} /></div>
//       <Footer />
//     </div>
//   );
// };

// export default CanvasArea;


import React from 'react';
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

const CanvasArea = ({ styles, sectionOrder, sectionVisibility, customSections = [], onOpenGenModal }) => {
  const sections = {
    home: <Slider styleIndex={styles.sliderStyle} />,
    partners: <OurPartners styleIndex={styles.partnersStyle} />,
    about: <AboutUs styleIndex={styles.aboutStyle} />,
    units: <Units styleIndex={styles.unitsStyle} />,
    services: <OurServices styleIndex={styles.servicesStyle} />,
    solutions: <OurSolutions styleIndex={styles.solutionsStyle} />,
    events: <LatestEvents styleIndex={styles.eventsStyle} />,
    news: <News styleIndex={styles.newsStyle} />,
    testimonials: <Testimonials />,
    faq: <FaqSection styleIndex={styles.faqStyle} />,
    contact: <ContactUs styleIndex={styles.contactStyle} />,
  };

  const customSectionMap = {};
  customSections.forEach(({ id, content }) => {
    customSectionMap[id] = <GeneratedContent content={content} />;
  });

  return (
    <div>
      <Navbar />
      {sectionOrder.map((sectionId) => (
        sectionVisibility[sectionId] && (
          <div key={sectionId} id={sectionId}>
            {sections[sectionId] || customSectionMap[sectionId]}
          </div>
        )
      ))}
      <div style={{ textAlign: 'center', margin: '2rem 0' }}>
        <button className="generate-content-btn" onClick={onOpenGenModal} style={{ fontSize: '1.2rem', padding: '1rem 2rem', borderRadius: 8, background: '#1976d2', color: '#fff', border: 'none', cursor: 'pointer' }}>
          + Générer du contenu
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default CanvasArea;