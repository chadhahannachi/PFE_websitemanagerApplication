
import React, { useState, useEffect } from 'react';
import '../../website/faqs/FaqSection.css';
import FaqStyleOne from '../../website/faqs/FaqStyleOne';
import FaqStyleTwo from '../../website/faqs/FaqStyleTwo';
import FaqStyleThree from '../../website/faqs/FaqStyleThree';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import FaqStyleTwoDisplay from './FaqStyleTwoDisplay';

const styles = [
  { name: 'Accordion (Classic)', component: FaqStyleOne },
  { name: 'Card Minimalist', component: FaqStyleTwoDisplay },
  { name: 'style 3', component: FaqStyleThree }
];

export default function FaqSectionDisplay({ styleIndex, entrepriseId }) {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userEntreprise, setUserEntreprise] = useState(null);
  const FaqComponent = styles[styleIndex]?.component || FaqStyleOne;
  console.log('StyleIndex reçu dans FaqSection:', styleIndex);

  // Récupération du token et décodage pour obtenir l'ID de l'utilisateur
  // const token = localStorage.getItem("token");
  // let userId = null;

  // if (token) {
  //   try {
  //     const decodedToken = jwtDecode(token);
  //     userId = decodedToken?.sub;
  //   } catch (error) {
  //     console.error("Error decoding token:", error);
  //     setError("Erreur lors du décodage du token.");
  //     setLoading(false);
  //   }
  // } else {
  //   console.error("Token is missing from localStorage.");
  //   setError("Token manquant. Veuillez vous connecter.");
  //   setLoading(false);
  // }

  // // Récupérer l'entreprise de l'utilisateur connecté
  // const fetchUserEntreprise = async () => {
  //   if (!token || !userId) {
  //     console.error("Token or User ID is missing");
  //     setError("Token ou ID utilisateur manquant.");
  //     setLoading(false);
  //     return;
  //   }

  //   try {
  //     const config = {
  //       headers: { Authorization: `Bearer ${token}` },
  //     };

  //     const userResponse = await axios.get(`http://localhost:5000/auth/user/${userId}`, config);
  //     const user = userResponse.data;

  //     if (!user.entreprise) {
  //       console.error("User's company (entreprise) is missing");
  //       setError("Entreprise de l'utilisateur non trouvée.");
  //       setLoading(false);
  //       return;
  //     }

  //     setUserEntreprise(user.entreprise);
  //   } catch (error) {
  //     console.error("Error fetching user data:", error);
  //     setError("Erreur lors de la récupération des données utilisateur.");
  //     setLoading(false);
  //   }
  // };

  // Récupérer les FAQs associées à l'entreprise de l'utilisateur connecté
  const fetchFaqs = async () => {
    if (!entrepriseId) {
      console.error("Token, User ID, or User Entreprise is missing");
      setError("Données manquantes pour récupérer les FAQs.");
      setLoading(false);
      return;
    }

    try {
      // const config = {
      //   headers: { Authorization: `Bearer ${token}` },
      // };
      const response = await axios.get(
        `http://localhost:5000/contenus/FAQ/entreprise/${entrepriseId}`
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

  // useEffect(() => {
  //   if (token && userId) {
  //     fetchUserEntreprise();
  //   }
  // }, []);

  useEffect(() => {
    if (entrepriseId) {
      fetchFaqs();
    }
  }, [entrepriseId]);

  if (loading) {
    return <div>Chargement des FAQs...</div>;
  }

  if (error) {
    return <div>Erreur : {error}</div>;
  }

  return (
    <section className="faq-section">
      {faqs.length > 0 ? (
        <FaqComponent faqs={faqs} contentType="faq" styleKey={`style${styleIndex + 1}`} entrepriseId={entrepriseId} />
      ) : (
        <p>Aucune FAQ publiée pour le moment.</p>
      )}
    </section>
  );
}

