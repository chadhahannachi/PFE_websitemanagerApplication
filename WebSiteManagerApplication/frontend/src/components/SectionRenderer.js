import React, { useState } from 'react';

// Import all your section components
import Navbar from './sections/Navbar';
import CoverSection from './sections/CoverSection';
import AboutSection from './sections/AboutSection';
import ContactUs from './sections/ContactUs';
import FAQSection from './sections/FAQSection';
import PartnersSection from './sections/PartnersSection';
import ServicesSection from './sections/ServicesSection';
import ArticlesSection from './sections/ArticlesSection';
import EventsSection from './sections/EventsSection';
import ModalComponent from './ModalComponent';

const sectionComponents = {
  "Navbar": Navbar,
  "Cover Section": CoverSection,
  "About Section": AboutSection,
  "Contact Us": ContactUs,
  "FAQ Section": FAQSection,
  "Partners Section": PartnersSection,
  "Services Section": ServicesSection,
  "Articles Section": ArticlesSection,
  "Events Section": EventsSection,
};

const SectionRenderer = () => {
  const [sections, setSections] = useState([]);
  
  const addSection = (sectionName) => {
    // Add the section by its name (e.g., "Cover Section", "About Section")
    if (sectionComponents[sectionName]) {
      setSections((prevSections) => [
        ...prevSections,
        { name: sectionName, component: sectionComponents[sectionName] },
      ]);
    }
  };

  return (
    <div>
      {/* Add buttons or modal to add different sections */}
      {/* <button onClick={() => addSection('Cover Section')}>Add Cover Section</button>
      <button onClick={() => addSection('About Section')}>Add About Section</button>
      <button onClick={() => addSection('Contact Us')}>Add Contact Us Section</button> */}

      {/* Render the sections dynamically */}
      <div>
        {sections.length > 0 ? (
          sections.map((section, index) => {
            const SectionComponent = section.component; // Dynamically get the component
            return (
              <div key={index}>
                {/* <h2>{section.name}</h2> */}
                <SectionComponent /> {/* Render the corresponding component */}
              </div>
            );
          })
        ) : (
          <p>No sections available</p>
        )}
      </div>
      <ModalComponent addSection={addSection} />
    </div>
  );
};

export default SectionRenderer;
