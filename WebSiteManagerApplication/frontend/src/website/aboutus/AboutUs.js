// // components/AboutUs.js 
// import React from 'react';
// import './AboutUs.css';
// import logoblack from '../../images/logo-black.png';

// const AboutUs = () => {
//   return (
//     <section className="about-us">
//       <div className="about-us-content">
//         <div className="text-content">
//           <h1>About Us</h1>
//           <h2>Abshore is a Digital Services Company.</h2>
//           <p>Since 2012, our company has been supporting our clients in the conception, development, and integration of business applications, providing personalized solutions that effectively address their unique and challenging demands. We provide end-to-end services for your projects, including needs analysis, design, development, testing, installation, and production implementation.
// We drive the digital transformation of organizations, advising and assisting our clients and partners in selecting appropriate technologies to enhance their performance.
// At ABSHOHRE, We have a multidisciplinary teams that follows international project management standards. Additionally, we provide support services to companies for their infrastructures, thanks to our specialized DevOps and SysOps teams Our project managers are certified according to PMI and ITIL standards.

// We are based in France and Tunisia, with representation offices in Benin and the Democratic Republic of the Congo (DRC).</p>
//           <button>Read More</button>
//         </div>
//         <div className="image-content">
//           <img src={logoblack} alt="Logo" />
//         </div>
//       </div>
//     </section>
//   );
// };

// export default AboutUs;

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
      <AboutComponent />
    </section>
  );
}