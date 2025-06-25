import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import '../../website/services/OurServices.css';
import ServiceStyleOne from '../../website/services/ServiceStyleOne';
import ServiceStyleTwoDisplay from './ServiceStyleTwoDisplay';

// Liste des styles disponibles
const styles = [
  { name: 'List Cards', component: ServiceStyleOne },
  { name: 'Modern Cards', component: ServiceStyleTwoDisplay },
];

export default function ServiceSectionDisplay({ styleIndex, entrepriseId }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userEntreprise, setUserEntreprise] = useState(null);

  // Par défaut, utiliser le premier style si styleIndex n'est pas fourni
  const ServiceComponent = styles[styleIndex]?.component || ServiceStyleOne;

  // Récupération du token et décodage pour obtenir l'ID de l'utilisateur
//   const token = localStorage.getItem('token');
//   let userId = null;

//   if (token) {
//     try {
//       const decodedToken = jwtDecode(token);
//       userId = decodedToken?.sub;
//     } catch (error) {
//       console.error('Error decoding token:', error);
//       setError('Erreur lors du décodage du token.');
//       setLoading(false);
//     }
//   } else {
//     console.error('Token is missing from localStorage.');
//     setError('Token manquant. Veuillez vous connecter.');
//     setLoading(false);
//   }

//   // Récupérer l'entreprise de l'utilisateur connecté
//   const fetchUserEntreprise = async () => {
//     if (!token || !userId) {
//       console.error('Token or User ID is missing');
//       setError('Token ou ID utilisateur manquant.');
//       setLoading(false);
//       return;
//     }

//     try {
//       const config = { headers: { Authorization: `Bearer ${token}` } };
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
//       console.error('Error fetching user data:', error);
//       setError('Erreur lors de la récupération des données utilisateur.');
//       setLoading(false);
//     }
//   };

  // Récupérer les services associés à l'entreprise
  const fetchServices = async () => {
    if (!entrepriseId) {
      console.error('User Entreprise is missing');
      setError('Données manquantes pour récupérer les services.');
      setLoading(false);
      return;
    }

    try {
    //   const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get(
        `http://localhost:5000/contenus/Service/entreprise/${entrepriseId}`
      );
      const publishedServices = response.data
        .filter((service) => service.isPublished)
        .map((service) => ({
          _id: service._id,
          title: service.titre,
          img: service.image || 'https://via.placeholder.com/150',
          description: service.description,
        }));
      setServices(publishedServices);
    } catch (error) {
      console.error('Error fetching services by entreprise:', error);
      setError('Erreur lors de la récupération des services.');
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
      fetchServices();
    }
  }, [entrepriseId]);

  if (loading) {
    return (
      <section className="services-section" style={{ position: 'relative', padding: '40px 0' }}>
        <h1 className="section-title">Our Services</h1>
        <div className="cards-container">
          <p>Chargement des services...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="services-section" style={{ position: 'relative', padding: '40px 0' }}>
        <h1 className="section-title">Our Services</h1>
        <div className="cards-container">
          <p>Erreur : {error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="services-section" style={{ position: 'relative', padding: '40px 0' }}>
      {/* <h1 className="section-title">Our Services</h1> */}
      {services.length > 0 ? (
        <ServiceComponent services={services} entrepriseId={entrepriseId} />
      ) : (
        <div className="cards-container">
          <p>Aucun service publié pour le moment.</p>
        </div>
      )}
    </section>
  );
}