//solution style 4 display
import React, { useState, useEffect } from 'react';
import '../../website/solutions/OurSolutions.css';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function SolutionStyleFourDisplay({ solutions = [], contentType = 'solutions', styleKey = 'styleFour', entrepriseId }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [positions, setPositions] = useState({
    sectionName: { top: 0, left: 10 },
    sectionDesc: { top: 30, left: 10 },
    solutionGrid: { top: 70, left: 0 },
  });
  const [styles, setStyles] = useState({
    sectionName: {
      color: '#f59e0b', fontSize: '22px', fontWeight: '600', fontFamily: 'Arial', marginBottom: '6px',
    },
    sectionDesc: {
      color: '#222', fontSize: '28px', fontWeight: '600', fontFamily: 'Arial', margin: '0',
    },
    solutionGrid: {
      width: 1600, minHeight: 400, overlayColor: 'rgba(1, 66, 104, 0.6)', cardWidth: 400, cardHeight: 300, cardRadius: 15,
      title: {
        color: '#fff', fontSize: '24px', fontWeight: '600', fontFamily: 'Arial', textAlign: 'left', fontStyle: 'normal', textDecoration: 'none', marginRight: 20,
      },
      desc: {
        color: '#fff', fontSize: '15px', fontWeight: 'normal', fontFamily: 'Arial', textAlign: 'left', fontStyle: 'normal', textDecoration: 'none', lineHeight: 1.5,
      },
    },
  });
  const [texts, setTexts] = useState({
    sectionName: 'NOS SOLUTIONS',
    sectionDesc: 'Customizable Solutions that are Easy to Adapt',
  });
  const [cardOrder, setCardOrder] = useState([]);

  // Validation functions
  const isValidPosition = (pos) => pos && typeof pos === 'object' && typeof pos.top === 'number' && typeof pos.left === 'number';
  const isValidStyle = (style) => style && typeof style === 'object' && Object.keys(style).length > 0;
  const isValidText = (text) => typeof text === 'string' && text.trim().length > 0;
  const isValidCardOrder = (order) => Array.isArray(order) && order.every((idx) => typeof idx === 'number' && idx >= 0 && idx < solutions.length);

  // Fetch preferences
  const fetchPreferences = async () => {
    if (!entrepriseId) return;
    try {
      const response = await axios.get(
        `http://localhost:5000/preferences/entreprise/${entrepriseId}/preferences`
      );
      const fetchedPreferences = response.data.preferences?.[contentType]?.[styleKey] || {};
      setPositions({
        sectionName: isValidPosition(fetchedPreferences.positions?.sectionName)
          ? fetchedPreferences.positions.sectionName
          : positions.sectionName,
        sectionDesc: isValidPosition(fetchedPreferences.positions?.sectionDesc)
          ? fetchedPreferences.positions.sectionDesc
          : positions.sectionDesc,
        solutionGrid: isValidPosition(fetchedPreferences.positions?.solutionGrid)
          ? fetchedPreferences.positions.solutionGrid
          : positions.solutionGrid,
      });
      setStyles({
        sectionName: isValidStyle(fetchedPreferences.styles?.sectionName)
          ? fetchedPreferences.styles.sectionName
          : styles.sectionName,
        sectionDesc: isValidStyle(fetchedPreferences.styles?.sectionDesc)
          ? fetchedPreferences.styles.sectionDesc
          : styles.sectionDesc,
        solutionGrid: isValidStyle(fetchedPreferences.styles?.solutionGrid)
          ? fetchedPreferences.styles.solutionGrid
          : styles.solutionGrid,
      });
      setTexts({
        sectionName: isValidText(fetchedPreferences.texts?.sectionName)
          ? fetchedPreferences.texts.sectionName
          : texts.sectionName,
        sectionDesc: isValidText(fetchedPreferences.texts?.sectionDesc)
          ? fetchedPreferences.texts.sectionDesc
          : texts.sectionDesc,
      });
      setCardOrder(isValidCardOrder(fetchedPreferences.cardOrder)
        ? fetchedPreferences.cardOrder
        : solutions.map((_, i) => i));
    } catch (error) {
      console.error('Error fetching preferences:', error);
      toast.error('Erreur lors du chargement des préférences');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (entrepriseId) {
      fetchPreferences();
    }
  }, [entrepriseId, solutions.length]);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;
  if (!solutions.length) return <div>Aucune solution disponible.</div>;

  // Utiliser l'ordre des cartes si fourni
  const orderedSolutions = cardOrder.length === solutions.length
    ? cardOrder.map(idx => solutions[idx])
    : solutions;

  return (
    <div className="solutions-style-four-container solutionfour-responsive" style={{ position: 'relative', minHeight: '680px' }}>
      <h1
        className="solutionfour-stack"
        style={{
            position: 'relative',
          ...styles.sectionName,
        //   ...positions.sectionName,
            top: positions.sectionName.top + 40,
            left: positions.sectionName.left,
        width: '60%',
        }}
      >
        {texts.sectionName}
      </h1>
      <h2
        className="solutionfour-stack"
        style={{
          ...styles.sectionDesc,
        //   ...positions.sectionDesc,
        position: 'relative',
        top: positions.sectionDesc.top ,
        left: positions.sectionDesc.left,
        width: '60%',
        }}
      >
        {texts.sectionDesc}
      </h2>
      <div
        className="solutions-container style-four solutionfour-grid"
        style={{
          position: 'relative',
          top: positions.solutionGrid.top - 30,
          left: positions.solutionGrid.left,
        //   width: '90%',
          minHeight: styles.solutionGrid.minHeight ,
          display: 'flex',
          flexWrap: 'wrap',
          gap: '20px',
          justifyContent: 'center',
           marginBottom: '90px',

        }}
      >
        {orderedSolutions.map((solution, index) => (
          <div
            key={solution.id || index}
            className="solution-card"
            style={{
              width: styles.solutionGrid.cardWidth,
              height: styles.solutionGrid.cardHeight,

              
              borderRadius: styles.solutionGrid.cardRadius,
              overflow: 'hidden',
              position: 'relative',
              boxShadow: 'none',
              padding: 0,
              background: '#fff',
              cursor: 'pointer',
            }}
          >
            <div className="solution-thumb" style={{ width: '100%', height: '100%', position: 'relative' }}>
              <img
                src={solution.img}
                alt={solution.title}
                className="solution-image"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: styles.solutionGrid.cardRadius,
                  transition: 'all 0.4s ease-out',
                }}
              />
              <div
                className="solution-overlay"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: styles.solutionGrid.overlayColor,
                  borderRadius: styles.solutionGrid.cardRadius,
                  opacity: 0,
                  visibility: 'hidden',
                  transition: 'all 0.4s ease-out',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  pointerEvents: 'none',
                }}
              >
                <div
                  className="solution-content"
                    style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 20,
                    width: '100%',
                    height: '100%',
                  }}
                >
                  <h3 style={{ ...styles.solutionGrid.title }}>{solution.title}</h3>
                  <p style={{ ...styles.solutionGrid.desc}}>{solution.description}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <style>{`
        .style-four .solution-card:hover .solution-overlay {
          opacity: 1 !important;
          visibility: visible !important;
          pointer-events: auto !important;
        }
      `}</style>
    </div>
  );
}