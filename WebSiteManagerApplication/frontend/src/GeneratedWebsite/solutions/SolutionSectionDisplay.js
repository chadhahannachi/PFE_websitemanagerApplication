import React, { useState, useEffect } from 'react';
import '../../website/solutions/OurSolutions.css';

import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
// import SolutionStyleTwo from '../../website/solutions/SolutionStyleTwo';
import SolutionStyleThree from '../../website/solutions/SolutionStyleThree';
import SolutionStyleFour from '../../website/solutions/SolutionStyleFour';
import SolutionStyleOneDisplay from './SolutionStyleOneDisplay';
import SolutionStyleThreeDisplay from './SolutionStyleThreeDisplay';
import SolutionStyleFourDisplay from './SolutionStyleFourDisplay';

const styles = [
  { name: 'Numbered Cards', component: SolutionStyleOneDisplay },
  // { name: 'Image Cards', component: SolutionStyleTwo },
  { name: 'Hover Effect', component: SolutionStyleThreeDisplay },
  { name: 'Image Hover Side by Side', component: SolutionStyleFourDisplay },
];

export default function SolutionSectionDisplay({ styleIndex, entrepriseId }) {
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userEntreprise, setUserEntreprise] = useState(null);
  const SolutionComponent = styles[styleIndex]?.component || SolutionStyleOneDisplay;
  console.log('StyleIndex reçu dans OurSolutions:', styleIndex);
  

  // Récupérer les solutions associées à l'entreprise de l'utilisateur connecté
  const fetchSolutions = async () => {
    if (!entrepriseId) {
      console.error('Token, User ID, or User Entreprise is missing');
      setError('Données manquantes pour récupérer les solutions.');
      setLoading(false);
      return;
    }

    try {
    //   const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get(
        `http://localhost:5000/contenus/Solution/entreprise/${entrepriseId}`,
        // config
      );
      const publishedSolutions = response.data
        // .filter((solution) => solution.isPublished)
        .map((solution, index) => ({
          id: (index + 1).toString().padStart(2, '0'),
          title: solution.titre,
          img: solution.image || 'https://via.placeholder.com/150',
          description: solution.description,
          styles: solution.styles,
        }));
      setSolutions(publishedSolutions);
    } catch (error) {
      console.error('Error fetching solutions by entreprise:', error);
      setError('Erreur lors de la récupération des solutions.');
    } finally {
      setLoading(false);
    }
  };

//   useEffect(() => {
//     if (token && userId) {
//       fetchUserEntreprise();
//     }
//   }, []);

  useEffect(() => {
    if (entrepriseId) {
      fetchSolutions();
    }
  }, [entrepriseId]);

  if (loading) {
    return <div>Chargement des solutions...</div>;
  }

  if (error) {
    return <div>Erreur : {error}</div>;
  }

  return (
    <section className="solutions-section">
      {/* <div>
        <h1>OUR SOLUTIONS</h1>
      </div> */}
      {/* <h2 >
         Customizable Solutions that are Easy to Adapt.
      </h2> */}
      {solutions.length > 0 ? (
        <SolutionComponent solutions={solutions} entrepriseId={entrepriseId} />
      ) : (
        <p>Aucune solution publiée pour le moment.</p>
      )}
    </section>
  );
}