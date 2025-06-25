import React, { useState, useEffect, useRef } from 'react';
import Slider from 'react-slick';
import Avatar from '@mui/material/Avatar';
import '../../website/testimonials/Testimonials.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import axios from 'axios';

const TestimonialsDisplay = ({ entrepriseId }) => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
    autoplay: !isHovering,
    speed: 500,
    beforeChange: (current, next) => setActiveSlide(next),
  };

  // Récupérer les témoignages associés à l'entreprise passée en prop
  const fetchTestimonials = async () => {
    if (!entrepriseId) {
      console.error('Entreprise ID is missing');
      setError('ID de l’entreprise manquant pour récupérer les témoignages.');
      setLoading(false);
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token is missing');
      setError('Token manquant. Veuillez vous connecter.');
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const response = await axios.get(
        `http://localhost:5000/contenus/Temoignage/entreprise/${entrepriseId}`,
        config
      );
      const publishedTestimonials = response.data
        .filter(temoignage => temoignage.isPublished)
        .map(temoignage => ({
          name: temoignage.auteur,
          role: 'Client',
          quote: temoignage.description,
          avatar: temoignage.image || 'https://via.placeholder.com/80',
        }));
      setTestimonials(publishedTestimonials);
    } catch (error) {
      console.error('Error fetching temoignages by entreprise:', error.response?.status, error.response?.data);
      setError(`Erreur lors de la récupération des témoignages: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (entrepriseId) {
      fetchTestimonials();
    }
  }, [entrepriseId]);

  const handleMouseEnter = (index) => {
    setIsHovering(true);
    setActiveSlide(index);
    if (sliderRef.current) {
      sliderRef.current.slickGoTo(index);
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

export default TestimonialsDisplay;