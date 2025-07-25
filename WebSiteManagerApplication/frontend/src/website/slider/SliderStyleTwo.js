// import React, { useState, useEffect } from 'react';
// import './Slider.css';
// import axios from 'axios';
// import { jwtDecode } from 'jwt-decode';
// import { Snackbar, Alert } from '@mui/material';

// export default function SliderStyleTwo({ sliderStyles = {}, onOpenSliderStyleForm }) {
//   const [slides, setSlides] = useState([]);
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const [userEntreprise, setUserEntreprise] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: '',
//     severity: 'success',
//   });

//   // Récupération du token et décodage pour obtenir l'ID de l'utilisateur
//   const token = localStorage.getItem('token');
//   let userId = null;

//   if (token) {
//     try {
//       const decodedToken = jwtDecode(token);
//       userId = decodedToken?.sub;
//     } catch (error) {
//       console.error('Error decoding token:', error);
//       setSnackbar({
//         open: true,
//         message: 'Erreur lors du décodage du token.',
//         severity: 'error',
//       });
//       setLoading(false);
//     }
//   } else {
//     console.error('Token is missing from localStorage.');
//     setSnackbar({
//       open: true,
//       message: 'Token manquant. Veuillez vous connecter.',
//       severity: 'error',
//     });
//     setLoading(false);
//   }

//   // Récupérer l'entreprise de l'utilisateur connecté
//   const fetchUserEntreprise = async () => {
//     if (!token || !userId) {
//       console.error('Token or User ID is missing');
//       setSnackbar({
//         open: true,
//         message: 'Token ou ID utilisateur manquant.',
//         severity: 'error',
//       });
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
//         setSnackbar({
//           open: true,
//           message: "Entreprise de l'utilisateur non trouvée.",
//           severity: 'error',
//         });
//         setLoading(false);
//         return;
//       }

//       setUserEntreprise(user.entreprise);
//     } catch (error) {
//       console.error('Error fetching user data:', error);
//       setSnackbar({
//         open: true,
//         message: 'Erreur lors de la récupération des données utilisateur.',
//         severity: 'error',
//       });
//       setLoading(false);
//     }
//   };

//   // Récupérer les slides associées à l'entreprise de l'utilisateur connecté
//   const fetchSlides = async () => {
//     if (!token || !userId || !userEntreprise) {
//       console.error('Token, User ID, or User Entreprise is missing');
//       setSnackbar({
//         open: true,
//         message: 'Données manquantes pour récupérer les slides.',
//         severity: 'error',
//       });
//       setLoading(false);
//       return;
//     }

//     try {
//       const config = {
//         headers: { Authorization: `Bearer ${token}` },
//       };
//       const response = await axios.get(
//         `http://localhost:5000/slides/entreprise/${userEntreprise}/slides`,
//         config
//       );
//       // Map backend data to match expected slide structure
//       const mappedSlides = response.data.map((slide) => ({
//         title: slide.titre,
//         description: slide.description,
//         image: slide.image,
//       }));
//       console.log('Slides récupérés et mappés:', mappedSlides);
//       setSlides(mappedSlides);
//     } catch (error) {
//       console.error('Error fetching slides by entreprise:', error);
//       setSnackbar({
//         open: true,
//         message: 'Erreur lors de la récupération des slides.',
//         severity: 'error',
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (token && userId) {
//       fetchUserEntreprise();
//     }
//   }, []);

//   // Appeler fetchSlides une fois que userEntreprise est défini
//   useEffect(() => {
//     if (userEntreprise) {
//       fetchSlides();
//     }
//   }, [userEntreprise]);

//   // Gestion du carrousel
//   useEffect(() => {
//     if (slides.length > 0) {
//       const interval = setInterval(() => {
//         setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
//       }, 3000); // Change slide every 3 seconds

//       return () => clearInterval(interval);
//     }
//   }, [slides]);

//   const handleCloseSnackbar = (event, reason) => {
//     if (reason === 'clickaway') {
//       return;
//     }
//     setSnackbar((prev) => ({ ...prev, open: false }));
//   };

//   // Styles dynamiques pour le titre et la description
//   const titleStyle = {
//     color: sliderStyles.titleColor,
//     fontFamily: sliderStyles.titleFont,
//     fontWeight: sliderStyles.titleBold ? 'bold' : 'normal',
//     fontStyle: sliderStyles.titleItalic ? 'italic' : 'normal',
//     textDecoration: sliderStyles.titleUnderline ? 'underline' : 'none',
//     cursor: onOpenSliderStyleForm ? 'pointer' : undefined,
//     transition: 'color 0.2s, font-family 0.2s, text-align 0.2s, font-weight 0.2s, font-style 0.2s, text-decoration 0.2s',
//   };
//   const descStyle = {
//     color: sliderStyles.descColor,
//     fontFamily: sliderStyles.descFont,
//     fontWeight: sliderStyles.descBold ? 'bold' : 'normal',
//     fontStyle: sliderStyles.descItalic ? 'italic' : 'normal',
//     textDecoration: sliderStyles.descUnderline ? 'underline' : 'none',
//     cursor: onOpenSliderStyleForm ? 'pointer' : undefined,
//     transition: 'color 0.2s, font-family 0.2s, text-align 0.2s, font-weight 0.2s, font-style 0.2s, text-decoration 0.2s',
//   };
//   // Style d'alignement global du bloc
//   const sectionAlignStyle = {
//     textAlign: sliderStyles.sectionAlign || 'center',
//     width: '100%',
//     display: 'block',
//   };

//   // Afficher un message de chargement ou d'erreur si aucune slide n'est disponible
//   if (loading) {
//     return <div>Chargement des slides...</div>;
//   }

//   if (slides.length === 0) {
//     return (
//       <div>
//         Aucune slide disponible pour votre entreprise.
//         <Snackbar
//           open={snackbar.open}
//           autoHideDuration={6000}
//           onClose={handleCloseSnackbar}
//           anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
//         >
//           <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
//             {snackbar.message}
//           </Alert>
//         </Snackbar>
//       </div>
//     );
//   }

//   return (
//     <div className="slider style-two">
//       {slides.map((slide, index) => (
//         <div
//           key={index}
//           className={`slide-two ${index === currentSlide ? 'active' : ''}`}
//           style={{ backgroundImage: `url(${slide.image})` }}
//         >
//           <div className="slide-content-two" style={sectionAlignStyle}>
//             <h2
//               className={index === currentSlide ? 'focus-in-expand' : ''}
//               style={titleStyle}
//               onClick={onOpenSliderStyleForm ? () => onOpenSliderStyleForm() : undefined}
//             >
//               {slide.title}
//             </h2>
//             <h1
//               className={index === currentSlide ? 'focus-in-expand' : ''}
//               style={descStyle}
//               onClick={onOpenSliderStyleForm ? () => onOpenSliderStyleForm() : undefined}
//             >
//               {slide.description}
//             </h1>
//           </div>
//         </div>
//       ))}
//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={6000}
//         onClose={handleCloseSnackbar}
//         anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
//       >
//         <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </div>
//   );
// }

import React, { useState, useEffect } from 'react';
import './Slider.css';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { Snackbar, Alert } from '@mui/material';

export default function SliderStyleTwo({ sliderStyles = {}, onOpenSliderStyleForm }) {
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
      console.log('Slides récupérés et mappés:', mappedSlides);
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

  // Styles dynamiques pour le titre
  const titleStyle = {
    color: sliderStyles.titleColor,
    fontFamily: sliderStyles.titleFont,
    fontWeight: sliderStyles.titleBold ? 'bold' : 'normal',
    fontStyle: sliderStyles.titleItalic ? 'italic' : 'normal',
    textDecoration: sliderStyles.titleUnderline ? 'underline' : 'none',
    cursor: onOpenSliderStyleForm ? 'pointer' : undefined,
    transition: 'color 0.2s, font-family 0.2s, text-align 0.2s, font-weight 0.2s, font-style 0.2s, text-decoration 0.2s',
    textAlign: sliderStyles.titlePosition === 'center' ? 'center' : 'left',
    width: sliderStyles.titlePosition === 'left' ? '50%' : sliderStyles.titlePosition === 'right' ? '50%' : '100%',
    marginLeft: sliderStyles.titlePosition === 'right' ? '50%' : '0',
    marginRight: sliderStyles.titlePosition === 'left' ? '50%' : '0',
  };

  // Styles dynamiques pour la description
  const descStyle = {
    color: sliderStyles.descColor,
    fontFamily: sliderStyles.descFont,
    fontWeight: sliderStyles.descBold ? 'bold' : 'normal',
    fontStyle: sliderStyles.descItalic ? 'italic' : 'normal',
    textDecoration: sliderStyles.descUnderline ? 'underline' : 'none',
    cursor: onOpenSliderStyleForm ? 'pointer' : undefined,
    transition: 'color 0.2s, font-family 0.2s, text-align 0.2s, font-weight 0.2s, font-style 0.2s, text-decoration 0.2s',
    textAlign: sliderStyles.descPosition === 'center' ? 'center' : 'left',
    width: sliderStyles.descPosition === 'left' ? '50%' : sliderStyles.descPosition === 'right' ? '50%' : '100%',
    marginLeft: sliderStyles.descPosition === 'right' ? '50%' : '0',
    marginRight: sliderStyles.descPosition === 'left' ? '50%' : '0',
  };

  // Style d'alignement global du bloc
  const sectionAlignStyle = {
    textAlign: sliderStyles.sectionAlign === 'center' ? 'center' : 'left',
    width: sliderStyles.sectionAlign === 'left' ? '50%' : sliderStyles.sectionAlign === 'right' ? '50%' : '100%',
    marginLeft: sliderStyles.sectionAlign === 'right' ? '50%' : '0',
    marginRight: sliderStyles.sectionAlign === 'left' ? '50%' : '0',
    display: 'block',
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
          <div className="slide-content-two" style={sectionAlignStyle}>
            <h2
              className={index === currentSlide ? 'focus-in-expand' : ''}
              style={titleStyle}
              onClick={onOpenSliderStyleForm ? () => onOpenSliderStyleForm() : undefined}
            >
              {slide.title}
            </h2>
            <h1
              className={index === currentSlide ? 'focus-in-expand' : ''}
              style={descStyle}
              onClick={onOpenSliderStyleForm ? () => onOpenSliderStyleForm() : undefined}
            >
              {slide.description}
            </h1>
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