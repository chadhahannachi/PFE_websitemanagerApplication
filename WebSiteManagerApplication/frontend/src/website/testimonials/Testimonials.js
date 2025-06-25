// import React from 'react';
// import Slider from 'react-slick';
// import Avatar from '@mui/material/Avatar';
// import './Testimonials.css';
// import 'slick-carousel/slick/slick.css';
// import 'slick-carousel/slick/slick-theme.css';

// const testimonials = [
//   {
//     name: 'Maria Menounos',
//     role: 'Actress & TV Host',
//     quote: 'I feel on top of the world. I feel incredibly motivated. I feel empowered. I am the master of my own destiny.',
//     avatar: 'https://i.pravatar.cc/100?img=1'
//   },
//   {
//     name: 'Serena Williams',
//     role: 'American Professional Tennis Player',
//     quote: "Tony Robbins helped me discover what I am really made of. With Tony’s help, I’ve set new standards for myself.",
//     avatar: 'https://i.pravatar.cc/100?img=2'
//   },
//   {
//     name: 'Marc Benioff',
//     role: 'CEO of Salesforce',
//     quote: "Tony’s tools have been critical to our success. He’s helped shape our culture and values deeply.",
//     avatar: 'https://i.pravatar.cc/100?img=3'
//   }
// ];

// const Testimonials = () => {
//   const settings = {
//     dots: true,
//     infinite: true,
//     centerMode: true,
//     centerPadding: '60px',
//     slidesToShow: 1,
//     arrows: true,
//     autoplay: true,
//     speed: 500
//   };

//   return (
//     <section className="testimonials-section">
//       <h2 className="section-title">Our Trusted Clients</h2>
//       <Slider {...settings} className="testimonial-slider">
//         {testimonials.map((item, index) => (
//           <div className="testimonial-slide" key={index}>
//             <div className="testimonial-card">
//               <Avatar
//                 alt={item.name}
//                 src={item.avatar}
//                 sx={{ width: 80, height: 80 }}
//                 className="avatar"
//               />
//               <h4 className="name">{item.name}</h4>
//               <p className="role">{item.role}</p>
//               <p className="quote">"{item.quote}"</p>
//             </div>
//           </div>
//         ))}
//       </Slider>
//     </section>
//   );
// };

// export default Testimonials;


// import React, { useState, useEffect } from 'react';
// import Slider from 'react-slick';
// import Avatar from '@mui/material/Avatar';
// import './Testimonials.css';
// import 'slick-carousel/slick/slick.css';
// import 'slick-carousel/slick/slick-theme.css';
// import axios from 'axios';
// import { jwtDecode } from 'jwt-decode';

// const Testimonials = () => {
//   const [testimonials, setTestimonials] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [userEntreprise, setUserEntreprise] = useState(null);

//   const settings = {
//     dots: true,
//     infinite: true,
//     centerMode: true,
//     centerPadding: '60px',
//     slidesToShow: 1,
//     arrows: true,
//     autoplay: true,
//     speed: 500
//   };

//   // Récupération du token et décodage pour obtenir l'ID de l'utilisateur
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

//   // Récupérer les témoignages associés à l'entreprise de l'utilisateur connecté
//   const fetchTestimonials = async () => {
//     if (!token || !userId || !userEntreprise) {
//       console.error("Token, User ID, or User Entreprise is missing");
//       setError("Données manquantes pour récupérer les témoignages.");
//       setLoading(false);
//       return;
//     }

//     try {
//       const config = {
//         headers: { Authorization: `Bearer ${token}` },
//       };
//       const response = await axios.get(
//         `http://localhost:5000/contenus/Temoignage/entreprise/${userEntreprise}`,
//         config
//       );
//       // Filtrer uniquement les témoignages publiés et mapper les champs
//       const publishedTestimonials = response.data
//         .filter(temoignage => temoignage.isPublished)
//         .map(temoignage => ({
//           name: temoignage.auteur,
//           role: "Client", // Le modèle n'a pas de champ "role", donc on utilise une valeur par défaut
//           quote: temoignage.description,
//           avatar: temoignage.image || "https://via.placeholder.com/80", // Image par défaut si aucune image
//         }));
//       setTestimonials(publishedTestimonials);
//     } catch (error) {
//       console.error("Error fetching temoignages by entreprise:", error);
//       setError("Erreur lors de la récupération des témoignages.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (token && userId) {
//       fetchUserEntreprise();
//     }
//   }, []);

//   // Appeler fetchTestimonials une fois que userEntreprise est défini
//   useEffect(() => {
//     if (userEntreprise) {
//       fetchTestimonials();
//     }
//   }, [userEntreprise]);

//   if (loading) {
//     return <div>Chargement des témoignages...</div>;
//   }

//   if (error) {
//     return <div>Erreur : {error}</div>;
//   }

//   return (
//     <section className="testimonials-section">
//       <h2 className="section-title">Our Trusted Clients</h2>
//       {testimonials.length > 0 ? (
//         <Slider {...settings} className="testimonial-slider">
//           {testimonials.map((item, index) => (
//             <div className="testimonial-slide" key={index}>
//               <div className="testimonial-card">
//                 <Avatar
//                   alt={item.name}
//                   src={item.avatar}
//                   sx={{ width: 80, height: 80 }}
//                   className="avatar"
//                 />
//                 <h4 className="name">{item.name}</h4>
//                 <p className="quote">"{item.quote}"</p>
//               </div>
//             </div>
//           ))}
//         </Slider>
//       ) : (
//         <p>Aucun témoignage publié pour le moment.</p>
//       )}
//     </section>
//   );
// };

// export default Testimonials;

import React, { useState, useEffect, useRef } from 'react';
import Slider from 'react-slick';
import Avatar from '@mui/material/Avatar';
import './Testimonials.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userEntreprise, setUserEntreprise] = useState(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const sliderRef = useRef(null);

  const settings = {
    dots: true,
    infinite: true,
    centerMode: true,
    centerPadding: '20px',
    slidesToShow: 3,
    arrows: true,
    autoplay: !isHovering, // Désactiver l'autoplay lors du survol
    speed: 500,
    beforeChange: (current, next) => setActiveSlide(next),
  };

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

  // Récupérer les témoignages associés à l'entreprise de l'utilisateur connecté
  const fetchTestimonials = async () => {
    if (!token || !userId || !userEntreprise) {
      console.error("Token, User ID, or User Entreprise is missing");
      setError("Données manquantes pour récupérer les témoignages.");
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const response = await axios.get(
        `http://localhost:5000/contenus/Temoignage/entreprise/${userEntreprise}`,
        config
      );
      const publishedTestimonials = response.data
        .filter(temoignage => temoignage.isPublished)
        .map(temoignage => ({
          name: temoignage.auteur,
          role: "Client",
          quote: temoignage.description,
          avatar: temoignage.image || "https://via.placeholder.com/80",
        }));
      setTestimonials(publishedTestimonials);
    } catch (error) {
      console.error("Error fetching temoignages by entreprise:", error);
      setError("Erreur lors de la récupération des témoignages.");
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
      fetchTestimonials();
    }
  }, [userEntreprise]);

  const handleMouseEnter = (index) => {
    setIsHovering(true);
    setActiveSlide(index);
    if (sliderRef.current) {
      sliderRef.current.slickGoTo(index); // Changer le slide actif lors du survol
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  if (loading) {
    return <div>Chargement des témoignages...</div>;
  }

  if (error) {
    return <div>Erreur : {error}</div>;
  }

  return (
    <section className="testimonials-section">
      <h2 className="section-title">Our Trusted Clients</h2>
      {testimonials.length > 0 ? (
        <Slider {...settings} className="testimonial-slider" ref={sliderRef}>
          {testimonials.map((item, index) => (
            <div
              className={`testimonial-slide ${activeSlide === index ? 'active' : ''}`}
              key={index}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
            >
              <div className="testimonial-card">
                <Avatar
                  alt={item.name}
                  src={item.avatar}
                  sx={{ width: 80, height: 80 }}
                  className="avatar"
                />
                <h4 className="name">{item.name}</h4>
                <p className="quote">"{item.quote}"</p>
              </div>
            </div>
          ))}
        </Slider>
      ) : (
        <p>Aucun témoignage publié pour le moment.</p>
      )}
    </section>
  );
};

export default Testimonials;