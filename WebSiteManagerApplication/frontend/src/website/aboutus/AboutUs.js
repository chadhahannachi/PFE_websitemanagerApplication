import React from 'react';
import './AboutUs.css';
import AboutStyleOne from './AboutStyleOne';
import AboutStyleTwo from './AboutStyleTwo';

// Liste des styles disponibles
const styles = [
  { name: 'Simple Layout', component: AboutStyleOne },
  { name: 'Modern Layout', component: AboutStyleTwo },
];

export default function AboutUs({ styleIndex }) {
  // Par défaut, utiliser le premier style si styleIndex n'est pas fourni
  const AboutComponent = styles[styleIndex]?.component || AboutStyleOne;

  return (
    <section 
    // className="about-us"
    >
      {/* <AboutComponent /> */}
      <AboutStyleOne />
    </section>
  );
}