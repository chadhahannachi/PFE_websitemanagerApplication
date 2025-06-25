import React, { useState, useEffect } from 'react';
import '../../website/events/LatestEvents.css';

import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import EventStyleThreeDisplay from './EventStyleThreeDisplay';
import EventStyleOne from '../../website/events/EventStyleOne';
import EventStyleTwo from '../../website/events/EventStyleTwo';

const styles = [
  { name: 'Intro with Cards', component: EventStyleOne },
  { name: 'Image Cards', component: EventStyleTwo },
  { name: 'Rounded Container', component: EventStyleThreeDisplay },
];

export default function LatestEventsDisplay({ styleIndex, entrepriseId }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userEntreprise, setUserEntreprise] = useState(null);
  const EventComponent = styles[styleIndex]?.component || EventStyleOne;
  console.log('StyleIndex reçu dans LatestEvents:', styleIndex);

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

  // Récupérer l'entreprise de l'utilisateur connecté
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

  // Récupérer les événements associés à l'entreprise de l'utilisateur connecté
  const fetchEvents = async () => {
    if (!entrepriseId) {
      console.error("Token, User ID, or User Entreprise is missing");
      setError("Données manquantes pour récupérer les événements.");
      setLoading(false);
      return;
    }

    try {
    //   const config = {
    //     headers: { Authorization: `Bearer ${token}` },
    //   };
      const response = await axios.get(
        `http://localhost:5000/contenus/Evenement/entreprise/${entrepriseId}`
      );
      // Filtrer uniquement les événements publiés et mapper les champs
      const publishedEvents = response.data
        .filter(event => event.isPublished)
        .map(event => ({
          title: event.titre,
          img: event.image || "https://via.placeholder.com/150", // Image par défaut si aucune image
          date: event.dateDebut ? new Date(event.dateDebut).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
          }) : 'Date non spécifiée',
          desc: event.description,
        }));
      setEvents(publishedEvents);
    } catch (error) {
      console.error("Error fetching events by entreprise:", error);
      setError("Erreur lors de la récupération des événements.");
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
      fetchEvents();
    }
  }, [entrepriseId]);

  if (loading) {
    return <div>Chargement des événements...</div>;
  }

  if (error) {
    return <div>Erreur : {error}</div>;
  }

  return (
    <section className="events">
      <div className="events-header">
        {styleIndex !== 0 && <h1>OUR LATEST EVENTS</h1>}
      </div>
      {styleIndex !== 0 && <h2>DISCOVER ALL THE NEWS AND NOVELTIES OF OUR COMPANY</h2>}
      {events.length > 0 ? (
        <EventComponent events={events} entrepriseId={entrepriseId} />
      ) : (
        <p>Aucun événement publié pour le moment.</p>
      )}
    </section>
  );
}

