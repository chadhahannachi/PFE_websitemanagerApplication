
// import React, { useEffect, useState } from 'react';
// import '../../website/units/Units.css';
// import axios from 'axios';
// import { jwtDecode } from 'jwt-decode';
// import UnitStyleOne from '../../website/units/UnitStyleOne';
// import UnitStyleTwoDisplay from './UnitStyleTwoDisplay';
// import UnitStyleOneDisplay from './UnitStyleOneDisplay';

// // Liste des styles disponibles
// const styles = [
//   { name: 'Classic Layout', component: UnitStyleOneDisplay },
//   { name: 'Modern Cards', component: UnitStyleTwoDisplay },
// ];

// const UnitSectionDisplay = ({ styleIndex = 0, entrepriseId }) => {
//   const [unites, setUnites] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [userEntreprise, setUserEntreprise] = useState(null);

//   // Par défaut, utiliser le premier style si styleIndex n'est pas fourni
//   const UnitComponent = styles[styleIndex]?.component || UnitStyleOne;

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

  
//   const fetchUnites = async () => {
//     if (!token || !userId || !entrepriseId) {
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
//         `http://localhost:5000/contenus/Unite/entreprise/${entrepriseId}`,
//         config
//       );
//       // Filtrer uniquement les unités publiées
//       // const publishedUnites = response.data.filter(unite => unite.isPublished);
//       const publishedUnites = response.data;
//       setUnites(publishedUnites);
//     } catch (error) {
//       console.error("Error fetching unites by entreprise:", error);
//       setError("Erreur lors de la récupération des unités.");
//     } finally {
//       setLoading(false);
//     }
//   };

// //   useEffect(() => {
// //     if (token && userId) {
// //       fetchUserEntreprise();
// //     }
// //   }, []);

//   // Appeler fetchUnites une fois que userEntreprise est défini
//   useEffect(() => {
//     if (entrepriseId) {
//       fetchUnites();
//     }
//   }, [entrepriseId]);

//   if (loading) {
//     return <div>Chargement des unités...</div>;
//   }

//   if (error) {
//     return <div>Erreur : {error}</div>;
//   }

//   return (
//     // <section className="units">
//     <section>
//       <UnitComponent unites={unites} entrepriseId={entrepriseId} />
//     </section>
//   );
// };

// export default UnitSectionDisplay;



import React, { useEffect, useState } from 'react';
import '../../website/units/Units.css';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import UnitStyleOne from '../../website/units/UnitStyleOne';
import UnitStyleTwoDisplay from './UnitStyleTwoDisplay';
import UnitStyleOneDisplay from './UnitStyleOneDisplay';

// Liste des styles disponibles
const styles = [
  { name: 'Classic Layout', component: UnitStyleOneDisplay },
  { name: 'Modern Cards', component: UnitStyleTwoDisplay },
];

const UnitSectionDisplay = ({ styleIndex = 0, entrepriseId }) => {
  const [unites, setUnites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Par défaut, utiliser le premier style si styleIndex n'est pas fourni
  const UnitComponent = styles[styleIndex]?.component || UnitStyleOne;

  useEffect(() => {
    if (!entrepriseId) {
      setError("ID entreprise manquant.");
      setLoading(false);
      return;
    }
    // Récupérer les unités associées à l'entreprise
    const fetchUnites = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/contenus/Unite/entreprise/${entrepriseId}`
        );
        const publishedUnites = response.data;
        setUnites(publishedUnites);
      } catch (error) {
        console.error("Error fetching unites by entreprise:", error);
        setError("Erreur lors de la récupération des unités.");
      } finally {
        setLoading(false);
      }
    };
    fetchUnites();
  }, [entrepriseId]);

  if (loading) {
    return <div>Chargement des unités...</div>;
  }

  if (error) {
    return <div>Erreur : {error}</div>;
  }

  return (
    <section>
      <UnitComponent unites={unites} entrepriseId={entrepriseId} />
    </section>
  );
};

export default UnitSectionDisplay;