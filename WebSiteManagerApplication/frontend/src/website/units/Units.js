// import React, { useEffect, useState } from 'react';
// import './Units.css';
// import company from '../../images/company.jpg';
// import axios from 'axios';
// import { jwtDecode } from 'jwt-decode';

// const Units = () => {
//   const [unites, setUnites] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [userEntreprise, setUserEntreprise] = useState(null);

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

//   // Récupérer les unités associées à l'entreprise de l'utilisateur connecté
//   const fetchUnites = async () => {
//     if (!token || !userId || !userEntreprise) {
//       console.error("Token, User ID, or User Entreprise is missing");
//       setError("Données manquantes pour récupérer les unités.");
//       setLoading(false);
//       return;
//     }

//     try {
//       const config = {
//         headers: { Authorization: `Bearer ${token}` },
//       };
//       const response = await axios.get(
//         `http://localhost:5000/contenus/Unite/entreprise/${userEntreprise}`,
//         config
//       );
//       // Filtrer uniquement les unités publiées
//       const publishedUnites = response.data.filter(unite => unite.isPublished);
//       setUnites(publishedUnites);
//     } catch (error) {
//       console.error("Error fetching unites by entreprise:", error);
//       setError("Erreur lors de la récupération des unités.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (token && userId) {
//       fetchUserEntreprise();
//     }
//   }, []);

//   // Appeler fetchUnites une fois que userEntreprise est défini
//   useEffect(() => {
//     if (userEntreprise) {
//       fetchUnites();
//     }
//   }, [userEntreprise]);

//   if (loading) {
//     return <div>Chargement des unités...</div>;
//   }

//   if (error) {
//     return <div>Erreur : {error}</div>;
//   }

//   return (
//     <section className="units">
//       <div className="units-content">
//         <div className="text-content">
//           <h1>Our Units</h1>
//           <p> - A reliable partner to meet all your development and digital services needs.</p>
//           <div>
//             {unites.length > 0 ? (
//               unites.map((unit, index) => (
//                 <div key={index}>
//                   <h2>
//                     {unit.image && (
//                       <img
//                         src={unit.image}
//                         alt={unit.titre || "Image de l'unité"}
//                         style={{
//                           width: '40px',
//                           height: '40px',
//                           objectFit: 'cover',
//                           marginRight: '8px',
//                           verticalAlign: 'middle',
//                         }}
//                         onError={(e) => {
//                           e.target.src = "https://via.placeholder.com/40";
//                         }}
//                       />
//                     )}
//                     {unit.titre}
//                   </h2>
//                   <p>{unit.description}</p>
//                 </div>
//               ))
//             ) : (
//               <p>Aucune unité publiée pour le moment.</p>
//             )}
//           </div>
//         </div>
//         <div className="image-content">
//           <img src={company} alt="Logo" />
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Units;

import React, { useEffect, useState } from 'react';
import './Units.css';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import UnitStyleOne from './UnitStyleOne';
import UnitStyleTwo from './UnitStyleTwo';

// Liste des styles disponibles
const styles = [
  { name: 'Classic Layout', component: UnitStyleOne },
  { name: 'Modern Cards', component: UnitStyleTwo },
];

const Units = ({ styleIndex = 0 }) => {
  const [unites, setUnites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userEntreprise, setUserEntreprise] = useState(null);

  // Par défaut, utiliser le premier style si styleIndex n'est pas fourni
  const UnitComponent = styles[styleIndex]?.component || UnitStyleOne;

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

  // Récupérer les unités associées à l'entreprise de l'utilisateur connecté
  const fetchUnites = async () => {
    if (!token || !userId || !userEntreprise) {
      console.error("Token, User ID, or User Entreprise is missing");
      setError("Données manquantes pour récupérer les unités.");
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const response = await axios.get(
        `http://localhost:5000/contenus/Unite/entreprise/${userEntreprise}`,
        config
      );
      // Filtrer uniquement les unités publiées
      const publishedUnites = response.data.filter(unite => unite.isPublished);
      setUnites(publishedUnites);
    } catch (error) {
      console.error("Error fetching unites by entreprise:", error);
      setError("Erreur lors de la récupération des unités.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && userId) {
      fetchUserEntreprise();
    }
  }, []);

  // Appeler fetchUnites une fois que userEntreprise est défini
  useEffect(() => {
    if (userEntreprise) {
      fetchUnites();
    }
  }, [userEntreprise]);

  if (loading) {
    return <div>Chargement des unités...</div>;
  }

  if (error) {
    return <div>Erreur : {error}</div>;
  }

  return (
    <section className="units">
      <UnitComponent unites={unites} />
    </section>
  );
};

export default Units;