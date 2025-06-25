// // components/Slider.js
// import React, { useEffect, useRef } from 'react';
// import './Slider.css';
// import worlds from '../../images/worlds.jpg';
// import othertwenty from '../../images/Other-20.png'
// import otherseven from '../../images/Other-07.png' 
// import smartphone from '../../images/smartphone.avif'
// import otherthirteen from '../../images/Other-13.png' 
// import data from '../../images/data.jpg' 
// import othertwentytwo from '../../images/Other-22.png'

// const domains = [
//   { name: 'Gestion de Projet', image: othertwenty},
//   { name: 'Intégration des Solutions Data', image: data },
//   { name: 'Intégration des Solutions Décisionelles', image: otherthirteen },
//   { name: 'Expertise en transition Numérique', image: othertwentytwo },
//   { name: 'Développement Web', image: otherseven},
//   { name: 'Développement Mobile', image: smartphone },

// ];

// const Slider = () => {
//   const scrollRef = useRef(null);

//   // Scroll automatique vers la gauche
//   useEffect(() => {
//     const scrollContainer = scrollRef.current;
//     let scrollAmount = 0;

//     const scrollInterval = setInterval(() => {
//       if (scrollContainer) {
//         scrollContainer.scrollLeft += 1;
//         scrollAmount += 1;

//         // Si fin atteinte, recommencer
//         if (scrollAmount >= scrollContainer.scrollWidth - scrollContainer.clientWidth) {
//           scrollContainer.scrollLeft = 0;
//           scrollAmount = 0;
//         }
//       }
//     }, 30); // vitesse de défilement (plus petit = plus lent)

//     return () => clearInterval(scrollInterval);
//   }, []);

//   return (
//     <div className="slider">
//       <div className="slide">
//         <img src={worlds} alt="Website Banner" />
//         <div className="slide-content">
//           <h2>Abshore,</h2>
//           <h1>your trusted partner for digital transformation and data analytics</h1>
//         </div>

//         <div className="domain-slider" ref={scrollRef}>
//           {domains.map((domain, index) => (
//             <div className="domain-card" key={index}>
//             <img src={domain.image} alt={domain.name} />
//             <span>{domain.name}</span>
//           </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Slider;


import React from 'react';
import './Slider.css';
import SliderStyleOne from './SliderStyleOne';
import SliderStyleTwo from './SliderStyleTwo';

const styles = [
  { name: 'Classic Slider', component: SliderStyleOne },
  { name: 'Modern Slider', component: SliderStyleTwo },
];

export default function Slider({ styleIndex }) {
  const SliderComponent = styles[styleIndex]?.component || SliderStyleOne;

  return <SliderComponent />;
}