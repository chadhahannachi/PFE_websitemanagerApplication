
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { jwtDecode } from "jwt-decode";
// import '../../website/partners/OurPartners.css';
// import PartnerStyleTwoDisplay from './PartnersStyleTwoDisplay';
// import PartnerStyleOne from '../../website/partners/PartnerStyleOne';


// // Liste des styles disponibles
// const styles = [
//   { name: 'Cards Slider', component: PartnerStyleOne },
//   { name: 'Images Slider', component: PartnerStyleTwoDisplay },
// ];

// const PartnersSectionDisplay = ({ styleIndex, entrepriseId }) => {
//   const [partenaires, setPartenaires] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Par défaut, utiliser le premier style si styleIndex n'est pas fourni
//   const PartnerComponent = styles[styleIndex]?.component || PartnerStyleOne;

//   // Récupération du token et décodage pour obtenir l'ID de l'utilisateur
// //   const token = localStorage.getItem("token");
// //   let userId = null;
// //   let decodedToken = null;

// //   if (token) {
// //     try {
// //       decodedToken = jwtDecode(token);
// //       userId = decodedToken?.sub;
// //     } catch (error) {
// //       console.error("Error decoding token:", error);
// //       setError("Erreur lors du décodage du token.");
// //       setLoading(false);
// //     }
// //   } else {
// //     console.error("Token is missing from localStorage.");
// //     setError("Token manquant. Veuillez vous connecter.");
// //     setLoading(false);
// //   }

//   // Fonction pour récupérer les partenaires de la même entreprise que l'utilisateur connecté
//   const fetchPartenairesByEntreprise = async () => {
//     // if (!token || !userId) {
//     //   console.error("Token or User ID is missing");
//     //   setError("Token ou ID utilisateur manquant.");
//     //   setLoading(false);
//     //   return;
//     // }

//     try {
//     //   const config = {
//     //     headers: { Authorization: `Bearer ${token}` },
//     //   };

//       // Récupérer les détails de l'utilisateur connecté
//     //   const userResponse = await axios.get(`http://localhost:5000/auth/user/${userId}`, config);
//     //   const user = userResponse.data;

//       if (!entrepriseId) {
//         console.error("User's company (entreprise) is missing");
//         setError("Entreprise de l'utilisateur non trouvée.");
//         setLoading(false);
//         return;
//       }

//       // Récupérer les partenaires associés à l'entreprise de l'utilisateur
//       const partenairesResponse = await axios.get(
//         `http://localhost:5000/contenus/Partenaire/entreprise/${entrepriseId}`,
//         // config
//       );

//       // Filtrer uniquement les partenaires publiés (isPublished: true)
//     //   const publishedPartenaires = partenairesResponse.data.filter(partenaire => partenaire.isPublished);
//       setPartenaires(partenairesResponse);
//     } catch (error) {
//       console.error("Error fetching partenaires:", error);
//       setError("Erreur lors de la récupération des partenaires.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Appeler fetchPartenairesByEntreprise au montage du composant
//   useEffect(() => {
    
//       fetchPartenairesByEntreprise();
    
//   });

//   // Afficher un message de chargement pendant la récupération des données
//   if (loading) {
//     return (
//       <section className="partners-section">
//         {styleIndex === 0 && (
//           <>
//             <h2 className="partners-title">Our Partners</h2>
//             <p className="partners-subtitle">Pleasure to work with</p>
//           </>
//         )}
//         <div className="slider-container">
//           <p>Chargement des partenaires...</p>
//         </div>
//       </section>
//     );
//   }

//   // Afficher un message d'erreur si la récupération échoue
//   if (error) {
//     return (
//       <section className="partners-section">
//         {styleIndex === 0 && (
//           <>
//             <h2 className="partners-title">Our Partners</h2>
//             <p className="partners-subtitle">Pleasure to work with</p>
//           </>
//         )}
//         <div className="slider-container">
//           <p>{error}</p>
//         </div>
//       </section>
//     );
//   }

//   // Si aucun partenaire n'est publié, afficher un message
//   if (partenaires.length === 0) {
//     return (
//       <section className="partners-section">
//         {styleIndex === 0 && (
//           <>
//             <h2 className="partners-title">Our Partners</h2>
//             <p className="partners-subtitle">Pleasure to work with</p>
//           </>
//         )}
//         <div className="slider-container">
//           <p>Aucun partenaire publié pour le moment.</p>
//         </div>
//       </section>
//     );
//   }

//   return (
//     <section className="partners-section">
//       {styleIndex === 0 && (
//         <>
//           <h2 className="partners-title">Our Partners</h2>
//           <p className="partners-subtitle">Pleasure to work with</p>
//         </>
//       )}
//       <PartnerComponent partenaires={partenaires}/>
//     </section>
//   );
// };

// export default PartnersSectionDisplay;