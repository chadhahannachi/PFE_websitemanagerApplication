// import React, { useState, useEffect } from 'react';
// import './FaqSection.css';
// import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
// import FaqStyleOne from './FaqStyleOne';
// import FaqStyleTwo from './FaqStyleTwo';
// import FaqStyleThree from './FaqStyleThree';
// import axios from 'axios';
// import { jwtDecode } from 'jwt-decode';

// const styles = [
//   { name: 'Accordion (Classic)', component: FaqStyleOne },
//   { name: 'Card Minimalist', component: FaqStyleTwo },
//   { name: 'style 3', component: FaqStyleThree }
// ];

// export default function FaqSection() {
//   const [faqs, setFaqs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [userEntreprise, setUserEntreprise] = useState(null);
//   const [styleIndex, setStyleIndex] = useState(0);
//   const [menuOpen, setMenuOpen] = useState(false);
//   const FaqComponent = styles[styleIndex].component;

//   // Récupération du token et décodage pour obtenir l'ID de l'utilisateur
//   const token = localStorage.getItem("token");
//   let userId = null;

//   if (token) {
//     try {
//       const decodedToken = jwtDecode(token);
//       userId = decodedToken?.sub;
//     } catch (error) {
//       console.error("Error decoding token:", error);
//       setError("Erreur lors du décodage du token.");
//       setLoading(false);
//     }
//   } else {
//     console.error("Token is missing from localStorage.");
//     setError("Token manquant. Veuillez vous connecter.");
//     setLoading(false);
//   }

//   // Récupérer l'entreprise de l'utilisateur connecté
//   const fetchUserEntreprise = async () => {
//     if (!token || !userId) {
//       console.error("Token or User ID is missing");
//       setError("Token ou ID utilisateur manquant.");
//       setLoading(false);
//       return;
//     }

//     try {
//       const config = {
//         headers: { Authorization: `Bearer ${token}` },
//       };

//       const userResponse = await axios.get(`http://localhost:5000/auth/user/${userId}`, config);
//       const user = userResponse.data;

//       if (!user.entreprise) {
//         console.error("User's company (entreprise) is missing");
//         setError("Entreprise de l'utilisateur non trouvée.");
//         setLoading(false);
//         return;
//       }

//       setUserEntreprise(user.entreprise);
//     } catch (error) {
//       console.error("Error fetching user data:", error);
//       setError("Erreur lors de la récupération des données utilisateur.");
//       setLoading(false);
//     }
//   };

//   // Récupérer les FAQs associées à l'entreprise de l'utilisateur connecté
//   const fetchFaqs = async () => {
//     if (!token || !userId || !userEntreprise) {
//       console.error("Token, User ID, or User Entreprise is missing");
//       setError("Données manquantes pour récupérer les FAQs.");
//       setLoading(false);
//       return;
//     }

//     try {
//       const config = {
//         headers: { Authorization: `Bearer ${token}` },
//       };
//       const response = await axios.get(
//         `http://localhost:5000/contenus/FAQ/entreprise/${userEntreprise}`,
//         config
//       );
//       // Filtrer uniquement les FAQs publiées et mapper les champs
//       const publishedFaqs = response.data
//         .filter(faq => faq.isPublished)
//         .map(faq => ({
//           question: faq.question,
//           answer: faq.reponse,
//         }));
//       setFaqs(publishedFaqs);
//     } catch (error) {
//       console.error("Error fetching FAQs by entreprise:", error);
//       setError("Erreur lors de la récupération des FAQs.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (token && userId) {
//       fetchUserEntreprise();
//     }
//   }, []);

//   // Appeler fetchFaqs une fois que userEntreprise est défini
//   useEffect(() => {
//     if (userEntreprise) {
//       fetchFaqs();
//     }
//   }, [userEntreprise]);

//   if (loading) {
//     return <div>Chargement des FAQs...</div>;
//   }

//   if (error) {
//     return <div>Erreur : {error}</div>;
//   }

//   return (
//     <section className="faq-section">
//       <div className="faq-header">
//         <h2 className="faq-title">Frequently Asked Questions</h2>
//         <div className="faq-style-switcher">
//           <button
//             className="menu-icon"
//             onClick={() => setMenuOpen(!menuOpen)}
//             aria-label="Change FAQ style"
//           >
//             <PlaylistAddCheckIcon size={24} />
//           </button>
//           {menuOpen && (
//             <ul className="style-menu">
//               {styles.map((style, index) => (
//                 <li
//                   key={index}
//                   onClick={() => {
//                     setStyleIndex(index);
//                     setMenuOpen(false);
//                   }}
//                 >
//                   {style.name}
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>
//       </div>
//       {faqs.length > 0 ? (
//         FaqComponent ? (
//           <FaqComponent faqs={faqs} />
//         ) : (
//           <div>Erreur : Style de composant non trouvé.</div>
//         )
//       ) : (
//         <p>Aucune FAQ publiée pour le moment.</p>
//       )}
//     </section>
//   );
// }

import React, { useState, useEffect } from 'react';
import './FaqSection.css';
import FaqStyleOne from './FaqStyleOne';
import FaqStyleTwo from './FaqStyleTwo';
import FaqStyleThree from './FaqStyleThree';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const styles = [
  { name: 'Accordion (Classic)', component: FaqStyleOne },
  { name: 'Card Minimalist', component: FaqStyleTwo },
  { name: 'style 3', component: FaqStyleThree }
];

export default function FaqSection({ styleIndex }) {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userEntreprise, setUserEntreprise] = useState(null);
  const FaqComponent = styles[styleIndex]?.component || FaqStyleOne;
  console.log('StyleIndex reçu dans FaqSection:', styleIndex);

  // Récupération du token et décodage pour obtenir l'ID de l'utilisateur
  const token = localStorage.getItem("token");
  let userId = null;

  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      userId = decodedToken?.sub;
    } catch (error) {
      console.error("Error decoding token:", error);
      setError("Erreur lors du décodage du token.");
      setLoading(false);
    }
  } else {
    console.error("Token is missing from localStorage.");
    setError("Token manquant. Veuillez vous connecter.");
    setLoading(false);
  }

  // Récupérer l'entreprise de l'utilisateur connecté
  const fetchUserEntreprise = async () => {
    if (!token || !userId) {
      console.error("Token or User ID is missing");
      setError("Token ou ID utilisateur manquant.");
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const userResponse = await axios.get(`http://localhost:5000/auth/user/${userId}`, config);
      const user = userResponse.data;

      if (!user.entreprise) {
        console.error("User's company (entreprise) is missing");
        setError("Entreprise de l'utilisateur non trouvée.");
        setLoading(false);
        return;
      }

      setUserEntreprise(user.entreprise);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError("Erreur lors de la récupération des données utilisateur.");
      setLoading(false);
    }
  };

  // Récupérer les FAQs associées à l'entreprise de l'utilisateur connecté
  const fetchFaqs = async () => {
    if (!token || !userId || !userEntreprise) {
      console.error("Token, User ID, or User Entreprise is missing");
      setError("Données manquantes pour récupérer les FAQs.");
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const response = await axios.get(
        `http://localhost:5000/contenus/FAQ/entreprise/${userEntreprise}`,
        config
      );
      // Filtrer uniquement les FAQs publiées et mapper les champs
      const publishedFaqs = response.data
  .filter(faq => faq.isPublished)
  .map(faq => {
    // Styles par défaut complets
    const defaultStyles = {
      card: { 
        backgroundColor: '#ffffff', 
        border: '1px solid #e5e7eb' 
      },
      question: {
        color: '#333333',
        fontSize: '1.125rem',
        fontFamily: 'Arial',
        fontWeight: 'normal',
        fontStyle: 'normal',
        textDecoration: 'none',
      },
      answer: {
        color: '#666666',
        fontSize: '1rem',
        fontFamily: 'Arial',
        fontWeight: 'normal',
        fontStyle: 'normal',
        textDecoration: 'none',
      },
    };

    return {
      _id: faq._id,
      question: faq.question,
      answer: faq.reponse,
      styles: { ...defaultStyles, ...(faq.styles || {}) } // Fusion des styles
    };
  });
      setFaqs(publishedFaqs);
    } catch (error) {
      console.error("Error fetching FAQs by entreprise:", error);
      setError("Erreur lors de la récupération des FAQs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && userId) {
      fetchUserEntreprise();
    }
  }, []);

  useEffect(() => {
    if (userEntreprise) {
      fetchFaqs();
    }
  }, [userEntreprise]);

  if (loading) {
    return <div>Chargement des FAQs...</div>;
  }

  if (error) {
    return <div>Erreur : {error}</div>;
  }

  return (
    <section className="faq-section">
      {faqs.length > 0 ? (
        <FaqComponent faqs={faqs} contentType="faq" styleKey={`style${styleIndex + 1}`} />
      ) : (
        <p>Aucune FAQ publiée pour le moment.</p>
      )}
    </section>
  );
}


// import React, { useState } from 'react';
// import './FaqSection.css';
// import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
// import FaqStyleOne from './FaqStyleOne';
// import FaqStyleTwo from './FaqStyleTwo';
// import FaqStyleThree from './FaqStyleThree';

// const styles = [
//   { name: 'Accordion (Classic)', component: FaqStyleOne },
//   { name: 'Card Minimalist', component: FaqStyleTwo },
//   { name: 'style 3', component: FaqStyleThree }
// ];

// const faqs = [
//   {
//     question: 'What is your return policy?',
//     answer: 'We offer a 30-day return policy with a full refund or exchange for unused items.'
//   },
//   {
//     question: 'How long does shipping take?',
//     answer: 'Standard shipping takes 3-5 business days. Express options are available at checkout.'
//   },
//   {
//     question: 'Do you offer international shipping?',
//     answer: 'Yes, we ship to most countries worldwide. Shipping times and costs vary by destination.'
//   },
//   {
//     question: 'How can I contact support?',
//     answer: 'You can contact our support team 24/7 via the contact form or by email at support@example.com.'
//   }
// ];

// export default function FaqSection() {
//   const [styleIndex, setStyleIndex] = useState(0);
//   const [menuOpen, setMenuOpen] = useState(false);
//   const FaqComponent = styles[styleIndex].component;

//   return (
//     <section className="faq-section">
//       <div className="faq-header">
//         <h2 className="faq-title">Frequently Asked Questions</h2>
//         <div className="faq-style-switcher">
//           <button
//             className="menu-icon"
//             onClick={() => setMenuOpen(!menuOpen)}
//             aria-label="Change FAQ style"
//           >
//             <PlaylistAddCheckIcon size={24} />
//           </button>
//           {menuOpen && (
//             <ul className="style-menu">
//               {styles.map((style, index) => (
//                 <li
//                   key={index}
//                   onClick={() => {
//                     setStyleIndex(index);
//                     setMenuOpen(false);
//                   }}
//                 >
//                   {style.name}
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>
//       </div>
//       <FaqComponent faqs={faqs} />
//     </section>
//   );
// }






// import React, { useState } from 'react';
// import './FaqSection.css';
// import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
// import FaqStyleOne from './FaqStyleOne';
// import FaqStyleTwo from './FaqStyleTwo';
// import FaqStyleThree from './FaqStyleThree';

// const styles = [
//   { name: 'Accordion (Classic)', component: FaqStyleOne },
//   { name: 'Card Minimalist', component: FaqStyleTwo },
//   { name: 'Grid View (Style 3)', component: FaqStyleThree }
// ];

// export default function FaqSection() {
//   const [styleIndex, setStyleIndex] = useState(0);
//   const [menuOpen, setMenuOpen] = useState(false);
//   const FaqComponent = styles[styleIndex].component;

//   const [faqs, setFaqs] = useState([
//     { question: 'What is your return policy?', answer: 'We offer a 30-day return policy with a full refund or exchange for unused items.' }
//   ]);

//   const handleFaqChange = (index, field, value) => {
//     const updatedFaqs = [...faqs];
//     updatedFaqs[index][field] = value;
//     setFaqs(updatedFaqs);
//   };

//   const addFaq = () => {
//     setFaqs([...faqs, { question: '', answer: '' }]);
//   };

//   const removeFaq = (index) => {
//     const updatedFaqs = faqs.filter((_, i) => i !== index);
//     setFaqs(updatedFaqs);
//   };

//   return (
//     <section className="faq-section">
//       <div className="faq-header">
//         <h2 className="faq-title">Frequently Asked Questions</h2>
//         <div className="faq-style-switcher">
//           <button className="menu-icon" onClick={() => setMenuOpen(!menuOpen)} aria-label="Change FAQ style">
//             <PlaylistAddCheckIcon size={24} />
//           </button>
//           {menuOpen && (
//             <ul className="style-menu">
//               {styles.map((style, index) => (
//                 <li key={index} onClick={() => { setStyleIndex(index); setMenuOpen(false); }}>
//                   {style.name}
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>
//       </div>

//       {/* Dynamic FAQ Input Fields */}
//       <div className="faq-editor">
//         {faqs.map((faq, index) => (
//           <div key={index} className="faq-edit-row">
//             <input
//               type="text"
//               placeholder="Enter question"
//               value={faq.question}
//               onChange={(e) => handleFaqChange(index, 'question', e.target.value)}
//             />
//             <textarea
//               placeholder="Enter answer"
//               value={faq.answer}
//               onChange={(e) => handleFaqChange(index, 'answer', e.target.value)}
//             />
//             <button onClick={() => removeFaq(index)} className="remove-btn">🗑️</button>
//           </div>
//         ))}
//         <button onClick={addFaq} className="add-btn">+ Add Question</button>
//       </div>

//       {/* Render Selected Style */}
//       <FaqComponent faqs={faqs} />
//     </section>
//   );
// }
