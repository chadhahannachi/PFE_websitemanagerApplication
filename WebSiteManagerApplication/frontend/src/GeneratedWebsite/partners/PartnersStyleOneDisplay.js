import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function PartnersStyleOneDisplay({ entrepriseId }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [partenaires, setPartenaires] = useState([]);
  const [positions, setPositions] = useState({
    partnersTitle: { top: 0, left: 0 },
    partnersSubtitle: { top: 50, left: 0 },
    partnerGrid: { top: 100, left: 0 },
  });
  const [styles, setStyles] = useState({
    partnersTitle: {},
    partnersSubtitle: {},
    partnerGrid: {},
  });
  const [texts, setTexts] = useState({
    partnersTitle: '',
    partnersSubtitle: '',
  });
  const [cardStyles, setCardStyles] = useState({});

  useEffect(() => {
    if (!entrepriseId) return;
    setLoading(true);
    axios.get(`http://localhost:5000/contenus/Partenaire/entreprise/${entrepriseId}`)
      .then(res => setPartenaires(res.data))
      .catch(() => setPartenaires([]));
    axios.get(`http://localhost:5000/preferences/entreprise/${entrepriseId}/preferences`)
      .then(res => {
        const prefs = res.data.preferences?.partners?.styleOne || {};
        setPositions({
          partnersTitle: prefs.positions?.partnersTitle || { top: 0, left: 0 },
          partnersSubtitle: prefs.positions?.partnersSubtitle || { top: 50, left: 0 },
          partnerGrid: prefs.positions?.partnerGrid || { top: 100, left: 0 },
        });
        setStyles({
          partnersTitle: prefs.styles?.partnersTitle || {},
          partnersSubtitle: prefs.styles?.partnersSubtitle || {},
          partnerGrid: prefs.styles?.partnerGrid || {},
        });
        setTexts({
          partnersTitle: prefs.texts?.partnersTitle || 'Our Partners',
          partnersSubtitle: prefs.texts?.partnersSubtitle || 'Pleasure to work with',
        });
        // Correction récupération styles carte
        let card = {};
        if (prefs.partnerCards?.card) {
          card = { ...prefs.partnerCards.card };
        } else if (prefs.partnerCards) {
          for (const key in prefs.partnerCards) {
            if ([
              'backgroundColor', 'borderRadius', 'boxShadow', 'width', 'height',
              'padding', 'margin', 'display', 'alignItems', 'justifyContent',
            ].includes(key)) {
              card[key] = prefs.styles[key];
            }
          }
        }
        setCardStyles(card);
      })
      .catch(() => {
        setStyles({});
        setTexts({ partnersTitle: '', partnersSubtitle: '' });
        setCardStyles({});
      })
      .finally(() => setLoading(false));
  }, [entrepriseId]);

  if (loading) return <div>Loading partners...</div>;
  if (error) return <div>Erreur : {error}</div>;

  // Correction positionnement du slider
  const gridStyle = {
    width: '100%',
    ...(positions.partnerGrid.top ? { marginTop: positions.partnerGrid.top } : {}),
    ...(positions.partnerGrid.left ? { marginLeft: positions.partnerGrid.left } : {}),
    ...styles.partnerGrid,
  };

  // Fonction pour détecter si on est sur mobile
  const isMobile = () => window.innerWidth <= 768;

  return (
    <div className="partners-section partners-responsive" style={{ padding: '40px 20px', textAlign: 'center' }}>
      <div style={{ 
        textAlign: isMobile() ? 'center' : 'left', 
        maxWidth: 600, 
        margin: '0 auto', 
        width: '100%' 
      }}>
        <div style={{ position: 'relative', width: '100%' }}>
          <h2
            className="partners-title"
            style={{ 
              position: 'relative', 
              textAlign: isMobile() ? 'center' : 'left',
              ...styles.partnersTitle, 
              ...positions.partnersTitle 
            }}
          >
            {texts.partnersTitle}
          </h2>
        </div>
      </div>
      <div style={{ 
        textAlign: isMobile() ? 'center' : 'left', 
        maxWidth: 600, 
        margin: '0 auto', 
        width: '100%' 
      }}>
        <div style={{ position: 'relative', width: '100%' }}>
          <p
            className="partners-subtitle"
            style={{ 
              position: 'relative', 
              textAlign: isMobile() ? 'center' : 'left',
              ...styles.partnersSubtitle, 
              ...positions.partnersSubtitle 
            }}
          >
            {texts.partnersSubtitle}
          </p>
        </div>
      </div>
      <div
        className="slider-container"
        style={gridStyle}
      >
        <div className="slider-track">
          {[...partenaires, ...partenaires, ...partenaires].map((partenaire, idx) => (
            <div
              className="partner-logo-card"
              key={partenaire._id + '-' + idx}
              style={cardStyles}
            >
              <img
                src={partenaire.image}
                alt={partenaire.titre || 'Logo partenaire'}
                onError={e => { e.target.src = 'https://via.placeholder.com/150'; }}
                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
