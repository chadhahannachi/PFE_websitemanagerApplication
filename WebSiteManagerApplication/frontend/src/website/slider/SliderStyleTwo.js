// import React, { useState, useEffect } from 'react';
// import './Slider.css';
// import worlds from '../../images/worlds.jpg';
// import data from '../../images/companyone.jpeg';
// import smartphone from '../../images/company2.jpeg';

// const slides = [
//   {
//     title: 'Abshore,',
//     description: 'your trusted partner for digital transformation and data analytics',
//     image: worlds,
//   },
//   {
//     title: 'Data Solutions,',
//     description: 'integrate and analyze your data with our advanced solutions',
//     image: data,
//   },
//   {
//     title: 'Mobile Development,',
//     description: 'build seamless mobile experiences with our expertise',
//     image: smartphone,
//   },
// ];

// export default function SliderStyleTwo() {
//   const [currentSlide, setCurrentSlide] = useState(0);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
//     }, 3000); // Change slide every 3 seconds

//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div className="slider style-two">
//       {slides.map((slide, index) => (
//         <div
//           key={index}
//           className={`slide-two ${index === currentSlide ? 'active' : ''}`}
//           style={{ backgroundImage: `url(${slide.image})` }}
//         >
//           <div className="slide-content-two">
//             <h2 className={index === currentSlide ? 'focus-in-expand' : ''}>{slide.title}</h2>
//             <h1 className={index === currentSlide ? 'focus-in-expand' : ''}>{slide.description}</h1>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }


import React, { useState, useEffect } from 'react';
import './Slider.css';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { Snackbar, Alert } from '@mui/material';

export default function SliderStyleTwo() {
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [userEntreprise, setUserEntreprise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // Récupération du token et décodage pour obtenir l'ID de l'utilisateur
  const token = localStorage.getItem('token');
  let userId = null;

  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      userId = decodedToken?.sub;
    } catch (error) {
      console.error('Error decoding token:', error);
      setSnackbar({
        open: true,
        message: 'Erreur lors du décodage du token.',
        severity: 'error',
      });
      setLoading(false);
    }
  } else {
    console.error('Token is missing from localStorage.');
    setSnackbar({
      open: true,
      message: 'Token manquant. Veuillez vous connecter.',
      severity: 'error',
    });
    setLoading(false);
  }

  // Récupérer l'entreprise de l'utilisateur connecté
  const fetchUserEntreprise = async () => {
    if (!token || !userId) {
      console.error('Token or User ID is missing');
      setSnackbar({
        open: true,
        message: 'Token ou ID utilisateur manquant.',
        severity: 'error',
      });
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
        setSnackbar({
          open: true,
          message: "Entreprise de l'utilisateur non trouvée.",
          severity: 'error',
        });
        setLoading(false);
        return;
      }

      setUserEntreprise(user.entreprise);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setSnackbar({
        open: true,
        message: 'Erreur lors de la récupération des données utilisateur.',
        severity: 'error',
      });
      setLoading(false);
    }
  };

  // Récupérer les slides associées à l'entreprise de l'utilisateur connecté
  const fetchSlides = async () => {
    if (!token || !userId || !userEntreprise) {
      console.error('Token, User ID, or User Entreprise is missing');
      setSnackbar({
        open: true,
        message: 'Données manquantes pour récupérer les slides.',
        severity: 'error',
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const response = await axios.get(
        `http://localhost:5000/slides/entreprise/${userEntreprise}/slides`,
        config
      );
      // Map backend data to match expected slide structure
      const mappedSlides = response.data.map((slide) => ({
        title: slide.titre,
        description: slide.description,
        image: slide.image,
      }));
      setSlides(mappedSlides);
    } catch (error) {
      console.error('Error fetching slides by entreprise:', error);
      setSnackbar({
        open: true,
        message: 'Erreur lors de la récupération des slides.',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && userId) {
      fetchUserEntreprise();
    }
  }, []);

  // Appeler fetchSlides une fois que userEntreprise est défini
  useEffect(() => {
    if (userEntreprise) {
      fetchSlides();
    }
  }, [userEntreprise]);

  // Gestion du carrousel
  useEffect(() => {
    if (slides.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
      }, 3000); // Change slide every 3 seconds

      return () => clearInterval(interval);
    }
  }, [slides]);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // Afficher un message de chargement ou d'erreur si aucune slide n'est disponible
  if (loading) {
    return <div>Chargement des slides...</div>;
  }

  if (slides.length === 0) {
    return (
      <div>
        Aucune slide disponible pour votre entreprise.
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </div>
    );
  }

  return (
    <div className="slider style-two">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`slide-two ${index === currentSlide ? 'active' : ''}`}
          style={{ backgroundImage: `url(${slide.image})` }}
        >
          <div className="slide-content-two">
            <h2 className={index === currentSlide ? 'focus-in-expand' : ''}>{slide.title}</h2>
            <h1 className={index === currentSlide ? 'focus-in-expand' : ''}>{slide.description}</h1>
          </div>
        </div>
      ))}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}