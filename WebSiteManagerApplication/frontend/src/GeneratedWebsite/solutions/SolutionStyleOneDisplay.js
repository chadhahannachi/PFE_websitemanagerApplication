import React, { useState, useEffect } from 'react';
import '../../website/solutions/OurSolutions.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';

// Styles CSS pour la responsivité
const responsiveStyles = `
  .solutions-style-one-container {
    position: relative;
    min-height: 600px;
    padding: 20px;
    max-width: 100%;
    overflow: visible;
    height: auto;
  }

  .solutions-style-one-container h1 {
    position: absolute;
    margin-bottom: 10px;
  }

  .solutions-style-one-container h2 {
    position: absolute;
    margin-bottom: 30px;
  }

  .solutions-container {
    position: absolute;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin: 0 auto;
    padding: 10px 20px;
  }

  .solution-card {
    flex: 0 0 300px;
    max-width: 300px;
    transition: background-color 0.3s ease;
  }

  @media (max-width: 768px) {
    .solutions-style-one-container {
      padding: 15px !important;
      min-height: auto !important;
      height: auto !important;
    }

    .solutions-style-one-container h1 {
      font-size: 18px !important;
      margin-bottom: 8px !important;
      position: relative !important;
      text-align: center !important;
    }

    .solutions-style-one-container h2 {
      font-size: 14px !important;
      margin-bottom: 20px !important;
      position: relative !important;
      text-align: center !important;
    }

    .solutions-container {
      gap: 10px 15px !important;
      padding: 10px !important;
      position: relative !important;
      width: 100% !important;
    }

    .solution-card {
      flex: 0 0 280px !important;
      max-width: 280px !important;
      padding: 20px 15px !important;
      min-height: 180px !important;
    }
  }

  @media (max-width: 480px) {
    .solutions-style-one-container {
      padding: 10px !important;
      min-height: auto !important;
      height: auto !important;
    }

    .solutions-style-one-container h1 {
      font-size: 16px !important;
      margin-bottom: 6px !important;
      position: relative !important;
      text-align: center !important;
    }

    .solutions-style-one-container h2 {
      font-size: 12px !important;
      margin-bottom: 15px !important;
      position: relative !important;
      text-align: center !important;
    }

    .solutions-container {
      gap: 8px 12px !important;
      padding: 8px !important;
      position: relative !important;
      width: 100% !important;
    }

    .solution-card {
      flex: 0 0 250px !important;
      max-width: 250px !important;
      padding: 15px 12px !important;
      min-height: 160px !important;
    }
  }
`;

export default function SolutionStyleOneDisplay({ solutions = [], contentType = 'solutions', styleKey = 'styleOne', entrepriseId }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [positions, setPositions] = useState({
    sectionName: { top: 0, left: 0 },
    sectionDesc: { top: 50, left: 0 },
    solutionGrid: { top: 100, left: 0 },
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
      color: '#666666',
      fontSize: '16px',
      fontFamily: 'Arial',
      fontWeight: 'normal',
      width: '100%',
      maxWidth: '800px',
    },
    solutionGrid: {
      width: 1200,
      minHeight: 440,
      gap: '15px 20px',
    },
  });
  const [texts, setTexts] = useState({
    sectionName: 'NOS SOLUTIONS',
    sectionDesc: 'Découvrez nos solutions innovantes et adaptées à vos besoins',
  });
  const cardStyles = {
    card: {
      backgroundColor: '#ffffff',
      hoverBackgroundColor: '#f8f9fa',
      borderRadius: '8px',
    },
    number: {
      color: '#333333',
      fontSize: '24px',
    },
    title: {
      color: '#333333',
      fontSize: '18px',
      fontFamily: 'Arial',
      textAlign: 'left',
      fontWeight: 'normal',
      fontStyle: 'normal',
      textDecoration: 'none',
    },
    description: {
      color: '#666666',
      fontSize: '14px',
      fontFamily: 'Arial',
      textAlign: 'left',
      fontWeight: 'normal',
      fontStyle: 'normal',
      textDecoration: 'none',
    },
  };
  const [solutionData, setSolutionData] = useState([]);
  const [userEntreprise, setUserEntreprise] = useState(null);

  // Validation functions
  const isValidPosition = (pos) => pos && typeof pos === 'object' && typeof pos.top === 'number' && typeof pos.left === 'number';
  const isValidStyle = (style) => style && typeof style === 'object' && Object.keys(style).length > 0;
  const isValidText = (text) => typeof text === 'string' && text.trim().length > 0;



  // Fetch preferences
  const fetchPreferences = async () => {
    if (!entrepriseId) {
      console.log('entrepriseId not yet available');
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:5000/preferences/entreprise/${entrepriseId}/preferences`,
        
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
    
    setSolutionData(solutions.map((solution, index) => ({
      ...solution,
      id: solution.id || (index + 1).toString().padStart(2, '0'), // Ensure id is set
      positions: solution.positions || {
        number: { top: 20, left: 20 },
        title: { top: 80, left: 20 },
        description: { top: 110, left: 20 },
      },
      // Utiliser les styles sauvegardés de la solution ou les styles par défaut
      styles: solution.styles || cardStyles,
    })));
  }, [solutions, cardStyles]);

//   useEffect(() => {
//     if (token && userId) {
//       fetchUserEntreprise();
//     }
//   }, []);

  useEffect(() => {
    if (entrepriseId) {
      fetchPreferences();
    }
  }, [entrepriseId]);

  // Debug: Log positions and styles
  useEffect(() => {
    console.log('SolutionStyleOneDisplay - Positions:', positions);
    console.log('SolutionStyleOneDisplay - Styles:', styles);
    console.log('SolutionStyleOneDisplay - Texts:', texts);
    console.log('SolutionStyleOneDisplay - solutionGrid position:', positions.solutionGrid);
    console.log('SolutionStyleOneDisplay - solutionGrid styles:', styles.solutionGrid);
  }, [positions, styles, texts]);

  // Detect screen size
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 480);
      setIsTablet(width > 480 && width <= 768);
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>Erreur: {error}</div>;
  }

  if (!solutionData.length) {
    return <div>Aucune solution disponible.</div>;
  }

  return (
    <>
      <style>{responsiveStyles}</style>
      <div className="solutions-style-one-container">
        <h1
          style={{
            ...styles.sectionName,
            ...(isMobile || isTablet ? {
              textAlign: 'center',
              marginBottom: '10px',
            } : positions.sectionName),
          }}
        >
          {texts.sectionName}
        </h1>
        
        <h2
          style={{
            ...styles.sectionDesc,
            ...(isMobile || isTablet ? {
              textAlign: 'center',
              marginBottom: '30px',
            } : positions.sectionDesc),
          }}
        >
          {texts.sectionDesc}
        </h2>
        
        <div
          className="solutions-container style-one"
          style={{
            maxWidth: isMobile ? '100%' : styles.solutionGrid.width,
            minHeight: styles.solutionGrid.minHeight,
            gap: styles.solutionGrid.gap || '15px 20px',
            ...(isMobile || isTablet ? {} : {
              top: positions.solutionGrid.top,
              left: positions.solutionGrid.left,
            }),
          }}
        >
        {solutionData.map((solution, index) => (
          <div
            key={solution._id || index}
            className="solution-card"
            // style={{
            //   // ...cardStyles.card,
            //   ...solution.styles?.card,
            //   padding: '30px 25px',
            //   position: 'relative',
            //   overflow: 'hidden',
            //   transition: 'background-color 0.3s ease',
            // }}
            style={{
              backgroundColor: solution.styles?.card?.backgroundColor || cardStyles.card.backgroundColor,
              hoverBackgroundColor: solution.styles?.card?.hoverBackgroundColor || cardStyles.card.hoverBackgroundColor,
              borderRadius: solution.styles?.card?.borderRadius || cardStyles.card.borderRadius,
              padding: '30px 25px',
              position: 'relative',
              overflow: 'hidden',
              transition: 'background-color 0.3s ease',
              width: `${solution.styles?.card?.width || cardStyles.card.width || 300}px`,
              minHeight: `${solution.styles?.card?.minHeight || cardStyles.card.minHeight || 200}px`,
              height: 'fit-content',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = solution.styles?.card?.hoverBackgroundColor || cardStyles.card.hoverBackgroundColor;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = solution.styles?.card?.backgroundColor || cardStyles.card.backgroundColor;
            }}
          >
            <div
              className="solution-number"
              style={{
                position: 'absolute',
                top: solution.positions.number.top,
                left: solution.positions.number.left,
                color: solution.styles?.number?.color || cardStyles.number.color,
                fontSize: solution.styles?.number?.fontSize || cardStyles.number.fontSize,
              }}
            >
              {solution.id}
            </div>
            <div
              style={{
                position: 'absolute',
                top: solution.positions.title.top,
                left: solution.positions.title.left,
                width: `${(solution.styles?.card?.width || cardStyles.card.width || 300) - 50}px`,
              }}
            >
              <h3 style={{ 
                color: solution.styles?.title?.color || cardStyles.title.color,
                fontSize: solution.styles?.title?.fontSize || cardStyles.title.fontSize,
                fontFamily: solution.styles?.title?.fontFamily || cardStyles.title.fontFamily,
                textAlign: solution.styles?.title?.textAlign || cardStyles.title.textAlign,
                fontWeight: solution.styles?.title?.fontWeight || cardStyles.title.fontWeight,
                fontStyle: solution.styles?.title?.fontStyle || cardStyles.title.fontStyle,
                textDecoration: solution.styles?.title?.textDecoration || cardStyles.title.textDecoration,
                margin: 0 
              }}>
                {solution.title}
              </h3>
            </div>
            <div
              style={{
                position: 'absolute',
                top: solution.positions.description.top,
                left: solution.positions.description.left,
                width: `${(solution.styles?.card?.width || cardStyles.card.width || 300) - 50}px`,
              }}
            >
              <p style={{ 
                color: solution.styles?.description?.color || cardStyles.description.color,
                fontSize: solution.styles?.description?.fontSize || cardStyles.description.fontSize,
                fontFamily: solution.styles?.description?.fontFamily || cardStyles.description.fontFamily,
                textAlign: solution.styles?.description?.textAlign || cardStyles.description.textAlign,
                fontWeight: solution.styles?.description?.fontWeight || cardStyles.description.fontWeight,
                fontStyle: solution.styles?.description?.fontStyle || cardStyles.description.fontStyle,
                textDecoration: solution.styles?.description?.textDecoration || cardStyles.description.textDecoration,
                margin: 0 
              }}>
                {solution.description}
              </p>
            </div>
          </div>
        ))}
        </div>
      </div>
    </>
  );
}