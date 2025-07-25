import React, { useState, useEffect } from 'react';
import './OurSolutions.css';
import SolutionStyleOne from './SolutionStyleOne';
import SolutionStyleTwo from './SolutionStyleTwo';
import SolutionStyleThree from './SolutionStyleThree';
import SolutionStyleFour from './SolutionStyleFour';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const styles = [
  { name: 'Numbered Cards', component: SolutionStyleOne },
  // { name: 'Image Cards', component: SolutionStyleTwo },
  { name: 'Hover Effect', component: SolutionStyleThree },
  { name: 'Image Hover Side by Side', component: SolutionStyleFour },
];

export default function OurSolutions({ styleIndex }) {
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userEntreprise, setUserEntreprise] = useState(null);
  const SolutionComponent = styles[styleIndex]?.component || SolutionStyleOne;
  // console.log('StyleIndex reçu dans OurSolutions:', styleIndex);
  
  // Récupération du token et décodage pour obtenir l'ID de l'utilisateur
  const token = localStorage.getItem('token');
  let userId = null;

  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      userId = decodedToken?.sub;
    } catch (error) {
      console.error('Error decoding token:', error);
      setError('Erreur lors du décodage du token.');
      setLoading(false);
    }
  } else {
    console.error('Token is missing from localStorage.');
    setError('Token manquant. Veuillez vous connecter.');
    setLoading(false);
  }

  // Récupérer l'entreprise de l'utilisateur connecté
  const fetchUserEntreprise = async () => {
    if (!token || !userId) {
      console.error('Token or User ID is missing');
      setError('Token ou ID utilisateur manquant.');
      setLoading(false);
      return;
    }

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
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
      console.error('Error fetching user data:', error);
      setError('Erreur lors de la récupération des données utilisateur.');
      setLoading(false);
    }
  };

  // Récupérer les solutions associées à l'entreprise de l'utilisateur connecté
  const fetchSolutions = async () => {
    if (!token || !userId || !userEntreprise) {
      console.error('Token, User ID, or User Entreprise is missing');
      setError('Données manquantes pour récupérer les solutions.');
      setLoading(false);
      return;
    }

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get(
        `http://localhost:5000/contenus/Solution/entreprise/${userEntreprise}`,
        config
      );
      const publishedSolutions = response.data
        // .filter((solution) => solution.isPublished)
        .map((solution, index) => {
          // Styles par défaut complets
          const defaultStyles = {
            card: {
              backgroundColor: '#ffffff',
              hoverBackgroundColor: '#f8f9fa',
              borderRadius: '8px',
            },
            number: {
              color: '#333333',
              fontSize: '24px',
            },
            title: {
              color: '#333333',
              fontSize: '18px',
              fontFamily: 'Arial',
              textAlign: 'left',
            },
            description: {
              color: '#666666',
              fontSize: '14px',
              fontFamily: 'Arial',
              textAlign: 'left',
            },
          };

          return {
            id: solution._id, // Utiliser le vrai _id MongoDB
            title: solution.titre,
            img: solution.image || 'https://via.placeholder.com/150',
            description: solution.description,
            styles: { ...defaultStyles, ...(solution.styles || {}) }, // Fusion des styles
            positions: {
              number: { top: 20, left: 20 },
              title: { top: 80, left: 20 },
              description: { top: 110, left: 20 },
              ...(solution.positions || {}) // Fusion des positions existantes
            }
          };
        });
      setSolutions(publishedSolutions);
    } catch (error) {
      console.error('Error fetching solutions by entreprise:', error);
      setError('Erreur lors de la récupération des solutions.');
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
      fetchSolutions();
    }
  }, [userEntreprise]);

  if (loading) {
    return <div>Chargement des solutions...</div>;
  }

  if (error) {
    return <div>Erreur : {error}</div>;
  }

  return (
    <section className="solutions-section"> 
      
      {solutions.length > 0 ? (
        <SolutionComponent solutions={solutions} />
      ) : (
        <p>Aucune solution publiée pour le moment.</p>
      )}
    </section>
  );
}