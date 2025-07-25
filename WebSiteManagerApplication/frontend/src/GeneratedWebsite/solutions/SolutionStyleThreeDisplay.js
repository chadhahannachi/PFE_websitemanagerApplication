import React, { useState, useEffect } from 'react';
import '../../website/solutions/OurSolutions.css';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function SolutionStyleThreeDisplay({ solutions = [], contentType = 'solutions', styleKey = 'styleThree', entrepriseId }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [positions, setPositions] = useState({
    sectionName: { top: 0, left: 0 },
    sectionDesc: { top: 20, left: 0 },
    solutionGrid: { top: 50, left: 0 },
  });
  const [styles, setStyles] = useState({
    sectionName: {
      color: '#f59e0b',
      fontSize: '20px',
      fontFamily: 'Arial',
      fontWeight: '600',
      width: '100%',
      maxWidth: '600px',
    },
    sectionDesc: {
      color: 'black',
      fontSize: '30px',
      fontFamily: 'Arial',
      fontWeight: '600',
      width: '100%',
      maxWidth: '800px',
    },
    solutionGrid: {
      width: 1600,
      minHeight: 400,
    },
  });
  const [texts, setTexts] = useState({
    sectionName: 'NOS SOLUTIONS',
    sectionDesc: 'Customizable Solutions that are Easy to Adapt',
  });
  const [solutionData, setSolutionData] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Validation functions
  const isValidPosition = (pos) => pos && typeof pos === 'object' && typeof pos.top === 'number' && typeof pos.left === 'number';
  const isValidStyle = (style) => style && typeof style === 'object' && Object.keys(style).length > 0;
  const isValidText = (text) => typeof text === 'string' && text.trim().length > 0;

  // Fetch preferences
  const fetchPreferences = async () => {
    if (!entrepriseId) {
      return;
    }
    try {
      const response = await axios.get(
        `http://localhost:5000/preferences/entreprise/${entrepriseId}/preferences`
      );
      const fetchedPreferences = response.data.preferences?.[contentType]?.[styleKey] || {};
      const newPositions = {
        sectionName: isValidPosition(fetchedPreferences.positions?.sectionName)
          ? fetchedPreferences.positions.sectionName
          : positions.sectionName,
        sectionDesc: isValidPosition(fetchedPreferences.positions?.sectionDesc)
          ? fetchedPreferences.positions.sectionDesc
          : positions.sectionDesc,
        solutionGrid: isValidPosition(fetchedPreferences.positions?.solutionGrid)
          ? fetchedPreferences.positions.solutionGrid
          : positions.solutionGrid,
      };
      const newStyles = {
        sectionName: isValidStyle(fetchedPreferences.styles?.sectionName)
          ? fetchedPreferences.styles.sectionName
          : styles.sectionName,
        sectionDesc: isValidStyle(fetchedPreferences.styles?.sectionDesc)
          ? fetchedPreferences.styles.sectionDesc
          : styles.sectionDesc,
        solutionGrid: isValidStyle(fetchedPreferences.styles?.solutionGrid)
          ? fetchedPreferences.styles.solutionGrid
          : styles.solutionGrid,
      };
      const newTexts = {
        sectionName: isValidText(fetchedPreferences.texts?.sectionName)
          ? fetchedPreferences.texts.sectionName
          : texts.sectionName,
        sectionDesc: isValidText(fetchedPreferences.texts?.sectionDesc)
          ? fetchedPreferences.texts.sectionDesc
          : texts.sectionDesc,
      };
      setPositions(newPositions);
      setStyles(newStyles);
      setTexts(newTexts);
    } catch (error) {
      console.error('Error fetching preferences:', error);
      toast.error('Erreur lors du chargement des préférences');
    } finally {
      setLoading(false);
    }
  };

  // Initialize solution data
  useEffect(() => {
    setSolutionData(solutions.map((solution, index) => {
      // Fusionner les styles sauvegardés avec les styles par défaut
      const cardStyles = {
        card: {
          backgroundColor: '#ffffff',
          borderRadius: '10px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          width: '300px',
          height: '350px',
          padding: '20px',
          transition: 'all 0.3s ease',
          hoverBackgroundColor: '#f8f9fa',
          hoverTransform: 'translateY(-5px)',
          hoverBoxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
        },
        title: {
          color: '#014268',
          fontSize: '27px',
          fontFamily: 'Arial',
          fontWeight: '600',
          textAlign: 'left',
          fontStyle: 'normal',
          textDecoration: 'none',
          marginBottom: '10px',
          transition: 'transform 0.3s ease',
        },
        description: {
          color: '#555',
          fontSize: '23px',
          fontFamily: 'Arial',
          textAlign: 'left',
          fontWeight: 'normal',
          fontStyle: 'normal',
          textDecoration: 'none',
          lineHeight: '1.5',
          margin: 0,
          transition: 'transform 0.3s ease',
        },
        image: {
          borderRadius: '8px',
          width: '100%',
          height: '150px',
          objectFit: 'contain',
          marginBottom: '15px',
          transition: 'opacity 0.3s ease',
        },
        readMore: {
          color: '#2196f3',
          fontSize: '14px',
          fontFamily: 'Arial',
          fontWeight: 'normal',
          textDecoration: 'none',
          cursor: 'pointer',
        },
      };
      const mergedStyles = {
        card: { ...cardStyles.card, ...solution.styles?.card },
        title: { ...cardStyles.title, ...solution.styles?.title },
        description: { ...cardStyles.description, ...solution.styles?.description },
        image: { ...cardStyles.image, ...solution.styles?.image },
        readMore: { ...cardStyles.readMore, ...solution.styles?.readMore },
      };
      return {
        ...solution,
        id: solution.id || (index + 1).toString().padStart(2, '0'),
        styles: mergedStyles,
      };
    }));
  }, [solutions]);

  useEffect(() => {
    if (entrepriseId) {
      fetchPreferences();
    }
  }, [entrepriseId]);

  if (loading) {
    return <div>Chargement...</div>;
  }
  if (error) {
    return <div>Erreur: {error}</div>;
  }
  if (!solutionData.length) {
    return <div>Aucune solution disponible.</div>;
  }

  const DESCRIPTION_LIMIT = 50;

  return (
    <div className="solutions-style-three-container solutionthree-responsive" style={{ position: 'relative', minHeight: '600px' }}>
      <h1
        className="solutionthree-stack"
        style={{
          position: 'relative',
          ...styles.sectionName,
          ...positions.sectionName,
            // top: positions.sectionName.top,
            // left: positions.sectionName.left,
            width: '80%',
        }}
      >
        {texts.sectionName}
      </h1>
      <h1
        className="solutionthree-stack"
        style={{
            position: 'relative',
          ...styles.sectionDesc,
        //   ...positions.sectionDesc,
        top: positions.sectionDesc.top - 20,
        left: positions.sectionDesc.left,
        width: '80%',

        }}
      >
        {texts.sectionDesc}
      </h1>
      <div
        className="solutions-container style-three solutionthree-grid"
        style={{
          minHeight: styles.solutionGrid.minHeight,
          display: 'flex',
          flexWrap: 'wrap',
          gap: '20px',
          justifyContent: 'center',
        //   ...positions.solutionGrid,
        position: 'relative',
        top: positions.solutionGrid.top -60,
        left: positions.solutionGrid.left,
        marginBottom: '80px',
        }}
      >
        {solutionData.map((solution, index) => {
          const description = solution.description || '';
          const isHovered = hoveredIndex === index;
          const isDescriptionLong = description.length > DESCRIPTION_LIMIT;
          const truncatedDescription =
            isDescriptionLong && !isHovered ? `${description.substring(0, DESCRIPTION_LIMIT)}...` : description;
          return (
            <div
              key={solution.id || index}
              className="solution-card"
              style={{
                ...solution.styles?.card,
                transition: 'all 0.3s ease',
                backgroundColor: isHovered ? (solution.styles?.card?.hoverBackgroundColor || solution.styles?.card?.backgroundColor) : (solution.styles?.card?.backgroundColor),
                boxShadow: isHovered ? (solution.styles?.card?.hoverBoxShadow || solution.styles?.card?.boxShadow) : (solution.styles?.card?.boxShadow),
                transform: isHovered ? (solution.styles?.card?.hoverTransform || 'translateY(-5px)') : 'translateY(0)',
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {solution.img && (
                <img
                  src={solution.img}
                  alt={solution.title}
                  style={{
                    ...solution.styles?.image,
                    zIndex: 2,
                    opacity: isHovered ? 0 : 1,
                    transition: 'opacity 0.3s ease',
                  }}
                />
              )}
              <h3 style={{
                ...solution.styles?.title,
                margin: 0,
                transform: isHovered ? 'translateY(-150px)' : 'translateY(0)',
                transition: 'transform 0.3s ease',
              }}>
                {solution.title}
              </h3>
              <p style={{
                ...solution.styles?.description,
                margin: 0,
                transform: isHovered ? 'translateY(-150px)' : 'translateY(0)',
                transition: 'transform 0.3s ease',
              }}>
                {truncatedDescription}
                {isDescriptionLong && !isHovered && (
                  <span style={{ ...solution.styles?.readMore, cursor: 'pointer' }}>
                    Read more
                  </span>
                )}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}