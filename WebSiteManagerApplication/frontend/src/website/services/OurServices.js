
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import './OurServices.css';
import ServiceStyleOne from './ServiceStyleOne'; // Premier style (actuel)
import ServiceStyleTwo from './ServiceStyleTwo'; // Nouveau style (basé sur les images)

// Liste des styles disponibles
const styles = [
  { name: 'List Cards', component: ServiceStyleOne },
  { name: 'Modern Cards', component: ServiceStyleTwo },
];

export default function OurServices({ styleIndex }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userEntreprise, setUserEntreprise] = useState(null);

  // Par défaut, utiliser le premier style si styleIndex n'est pas fourni
  const ServiceComponent = styles[styleIndex]?.component || ServiceStyleOne;

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

  // Récupérer les services associés à l'entreprise de l'utilisateur connecté
  const fetchServices = async () => {
    if (!token || !userId || !userEntreprise) {
      console.error('Token, User ID, or User Entreprise is missing');
      setError('Données manquantes pour récupérer les services.');
      setLoading(false);
      return;
    }

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get(
        `http://localhost:5000/contenus/Service/entreprise/${userEntreprise}`,
        config
      );
      
      const publishedServices = response.data
        .filter((service) => service.isPublished)
        .map((service) => {
          // Styles par défaut complets
          const defaultStyles = {
            card: {
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
              width: '280px',
              height: '440px',
              hoverBackgroundColor: '#f59e0b',
            },
            title: {
              color: '#0d1b3f',
              fontSize: '25px',
              fontFamily: 'Arial',
              fontWeight: '700',
              textAlign: 'left',
              fontStyle: 'normal',
              textDecoration: 'none',
            },
            description: {
              color: '#555',
              fontSize: '18px',
              fontFamily: 'Arial',
              textAlign: 'left',
              fontWeight: 'normal',
              fontStyle: 'normal',
              textDecoration: 'none',
            },
            button: {
              backgroundColor: '#eeeeee',
              borderRadius: '10px',
              color: '#184969',
              fontSize: '14px',
              fontWeight: '700',
              hoverColor: '#014268',
            },
            image: {
              borderRadius: '0px',
              width: '60px',
              height: '60px',
            },
            shape: {
              fill: '#eeeeee',
              width: '100px',
              height: '89px',
            },
          };

          return {
            id: service._id, // Utiliser le vrai _id MongoDB
            title: service.titre,
            img: service.image || 'https://via.placeholder.com/150',
            description: service.description,
            styles: { ...defaultStyles, ...(service.styles || {}) }, // Fusion des styles
            positions: {
              image: { top: 35, left: 40 },
              shape: { top: 20, left: 20 },
              title: { top: 120, left: 20 },
              description: { top: 160, left: 20 },
              button: { top: 360, left: 20 },
              ...(service.positions || {}) // Fusion des positions existantes
            }
          };
        });
      setServices(publishedServices);
    } catch (error) {
      console.error('Error fetching services by entreprise:', error);
      setError('Erreur lors de la récupération des services.');
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
      fetchServices();
    }
  }, [userEntreprise]);

  if (loading) {
    return (
      <section className="services-section">
        <h1 className="section-title">Our Services</h1>
        <div className="cards-container">
          <p>Chargement des services...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="services-section">
        <h1 className="section-title">Our Services</h1>
        <div className="cards-container">
          <p>Erreur : {error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="services-section">
      {/* <h1 className="section-title">Our Services</h1> */}
      {/* <h1 className="section-title">NOS SERVICES</h1> */}
      {services.length > 0 ? (
        <ServiceComponent services={services} />
      ) : (
        <p>Aucun service publié pour le moment.</p>
      )}
    </section>
  );
}