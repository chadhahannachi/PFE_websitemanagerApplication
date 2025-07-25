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
      // const publishedUnites = response.data.filter(unite => unite.isPublished);
      const publishedUnites = response.data
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
    // <section className="units">
<section>
    <UnitComponent unites={unites} />
    </section>
  );
};

export default Units;