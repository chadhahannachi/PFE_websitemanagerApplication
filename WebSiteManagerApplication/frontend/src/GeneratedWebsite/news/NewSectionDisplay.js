

import React, { useState, useEffect } from 'react';
import '../../website/news/News.css';

import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import NewsStyleThreeDisplay from './NewsStyleThreeDisplay';
import NewsStyleOne from '../../website/news/NewsStyleOne';
import NewsStyleTwo from '../../website/news/NewsStyleTwo';

const styles = [
  { name: 'Grid with Buttons', component: NewsStyleOne },
  { name: 'Icon Cards', component: NewsStyleTwo },
  { name: 'Scrollable Cards', component: NewsStyleThreeDisplay },
];

export default function NewSectionDisplay({ styleIndex, entrepriseId }) {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userEntreprise, setUserEntreprise] = useState(null);
  const NewsComponent = styles[styleIndex]?.component || NewsStyleOne;
  console.log('StyleIndex reçu dans News:', styleIndex);

  // Récupération du token et décodage pour obtenir l'ID de l'utilisateur
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

  // Récupérer les actualités associées à l'entreprise de l'utilisateur connecté
  const fetchNews = async () => {
    if (!entrepriseId) {
      console.error("Token, User ID, or User Entreprise is missing");
      setError("Données manquantes pour récupérer les actualités.");
      setLoading(false);
      return;
    }

    try {
    //   const config = {
    //     headers: { Authorization: `Bearer ${token}` },
    //   };
      const response = await axios.get(
        `http://localhost:5000/contenus/Actualite/entreprise/${entrepriseId}`,
        // config
      );
      // Filtrer uniquement les actualités publiées et mapper les champs
      const publishedNews = response.data
        .filter(actualite => actualite.isPublished)
        .map(actualite => ({
          name: actualite.titre,
          desc: actualite.description,
          image: actualite.image || "https://via.placeholder.com/40", // Image par défaut si aucune image
        }));
      setNews(publishedNews);
    } catch (error) {
      console.error("Error fetching actualites by entreprise:", error);
      setError("Erreur lors de la récupération des actualités.");
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
      fetchNews();
    }
  }, [entrepriseId]);

  if (loading) {
    return <div>Chargement des actualités...</div>;
  }

  if (error) {
    return <div>Erreur : {error}</div>;
  }

  return (
    <section className="news">
      <div className="news-header">
        <h1>Latest News</h1>
      </div>
      {news.length > 0 ? (
        <NewsComponent news={news} entrepriseId={entrepriseId} />
      ) : (
        <p>Aucune actualité publiée pour le moment.</p>
      )}
    </section>
  );
}
