import React, { useState, useEffect } from 'react';
import '../../website/solutions/OurSolutions.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';

export default function SolutionStyleOneDisplay({ solutions = [], contentType = 'solutions', styleKey = 'styleOne', entrepriseId }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [positions, setPositions] = useState({
    sectionName: { top: 0, left: 0 },
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
    solutionGrid: {
      width: 1200,
      minHeight: 440,
    },
  });
  const [texts, setTexts] = useState({
    sectionName: 'NOS SOLUTIONS',
  });
  const [cardStyles, setCardStyles] = useState({
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
  });
  const [solutionData, setSolutionData] = useState([]);
  const [userEntreprise, setUserEntreprise] = useState(null);

  // Validation functions
  const isValidPosition = (pos) => pos && typeof pos === 'object' && typeof pos.top === 'number' && typeof pos.left === 'number';
  const isValidStyle = (style) => style && typeof style === 'object' && Object.keys(style).length > 0;
  const isValidText = (text) => typeof text === 'string' && text.trim().length > 0;

  // Fetch user enterprise
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

//   const fetchUserEntreprise = async () => {
//     if (!token || !userId) {
//       console.error('Token or User ID is missing');
//       setError('Token ou ID utilisateur manquant.');
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
//       console.error('Error fetching user data:', error);
//       setError('Erreur lors de la récupération des données utilisateur.');
//       setLoading(false);
//     }
//   };

  // Fetch preferences
  const fetchPreferences = async () => {
    if (!entrepriseId) {
      console.log('entrepriseId not yet available');
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:5000/preferences/entreprise/${entrepriseId}/preferences`,
        // {
        //   headers: { Authorization: `Bearer ${token}` },
        // }
      );
      const fetchedPreferences = response.data.preferences?.[contentType]?.[styleKey] || {};

      const newPositions = {
        sectionName: isValidPosition(fetchedPreferences.positions?.sectionName)
          ? fetchedPreferences.positions.sectionName
          : positions.sectionName,
        solutionGrid: isValidPosition(fetchedPreferences.positions?.solutionGrid)
          ? fetchedPreferences.positions.solutionGrid
          : { top: 100, left: 0 }, // Adjusted default to avoid overlap
      };

      const newStyles = {
        sectionName: isValidStyle(fetchedPreferences.styles?.sectionName)
          ? fetchedPreferences.styles.sectionName
          : styles.sectionName,
        solutionGrid: isValidStyle(fetchedPreferences.styles?.solutionGrid)
          ? fetchedPreferences.styles.solutionGrid
          : styles.solutionGrid,
      };

      const newTexts = {
        sectionName: isValidText(fetchedPreferences.texts?.sectionName)
          ? fetchedPreferences.texts.sectionName
          : texts.sectionName,
      };

      setPositions(newPositions);
      setStyles(newStyles);
      setTexts(newTexts);

      // Fetch card styles if available
      const fetchedCardStyles = fetchedPreferences.cardStyles || cardStyles;
      setCardStyles(fetchedCardStyles);
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
      styles: cardStyles,
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
    <div className="solutions-style-one-container" style={{ position: 'relative' }}>
      <h1
        style={{
          position: 'relative',
          marginBottom: '20px',
          ...styles.sectionName,
        }}
      >
        {texts.sectionName}
      </h1>
      <div
        className="solutions-container style-one"
        style={{
          position: 'relative',
          width: styles.solutionGrid.width,
          minHeight: styles.solutionGrid.minHeight,
          display: 'flex',
          flexWrap: 'wrap',
          gap: '30px',
          padding: '10px 20px',
        }}
      >
        {solutionData.map((solution, index) => (
          <div
            key={solution._id || index}
            className="solution-card"
            style={{
              ...cardStyles.card,
              padding: '30px 25px',
              position: 'relative',
              overflow: 'hidden',
              transition: 'background-color 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = cardStyles.card.hoverBackgroundColor;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = cardStyles.card.backgroundColor;
            }}
          >
            <div
              className="solution-number"
              style={{
                position: 'absolute',
                top: solution.positions.number.top,
                left: solution.positions.number.left,
                ...cardStyles.number,
              }}
            >
              {solution.id}
            </div>
            <div
              style={{
                position: 'absolute',
                top: solution.positions.title.top,
                left: solution.positions.title.left,
                width: parseInt(styles.solutionGrid.width) / 3 - 50, // Approximate card width
              }}
            >
              <h3 style={{ ...cardStyles.title, margin: 0 }}>
                {solution.title}
              </h3>
            </div>
            <div
              style={{
                position: 'absolute',
                top: solution.positions.description.top,
                left: solution.positions.description.left,
                width: parseInt(styles.solutionGrid.width) / 3 - 50, // Approximate card width
              }}
            >
              <p style={{ ...cardStyles.description, margin: 0 }}>
                {solution.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}