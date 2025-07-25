import React, { useEffect, useState } from 'react';
import axios from 'axios';
import logoblack from '../../images/aboutus.webp';

export default function AboutUsDisplay({ entrepriseId }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [positions, setPositions] = useState({ sectionName: { top: 10, left: 50 } });
  const [styles, setStyles] = useState({
    sectionName: {
      color: '#000000',
      fontSize: '3rem',
      fontFamily: 'Arial',
      fontWeight: 'bold',
      width: '100%',
      maxWidth: '600px',
      textAlign: 'center',
    },
  });
  const [texts, setTexts] = useState({ sectionName: 'About Us' });
  const [apropos, setAPropos] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!entrepriseId) {
        setError("ID d'entreprise manquant");
        setLoading(false);
        return;
      }
      const token = localStorage.getItem('token');
      try {
        // fetch apropos
        const aproposRes = await axios.get(`http://localhost:5000/contenus/APropos/entreprise/${entrepriseId}`, { headers: { Authorization: `Bearer ${token}` } });
        setAPropos(Array.isArray(aproposRes.data) ? aproposRes.data[0] : aproposRes.data);
        // fetch preferences
        const prefRes = await axios.get(`http://localhost:5000/preferences/entreprise/${entrepriseId}/preferences`, { headers: { Authorization: `Bearer ${token}` } });
        const fetchedPreferences = prefRes.data.preferences?.aboutus?.styleOne || {};
        setPositions({
          sectionName: fetchedPreferences.positions?.sectionName || { top: 10, left: 50 },
        });
        setStyles({
          sectionName: fetchedPreferences.styles?.sectionName || {
            color: '#000000',
            fontSize: '3rem',
            fontFamily: 'Arial',
            fontWeight: 'bold',
            width: '100%',
            maxWidth: '600px',
            textAlign: 'center',
          },
        });
        setTexts({
          sectionName: fetchedPreferences.texts?.sectionName || 'About Us',
        });
      } catch (e) {
        setError('Erreur lors du chargement des données About Us');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [entrepriseId]);

  function extractTextFromHTML(html) {
    if (!html) return '';
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  }

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur : {error}</div>;

  return (
    <div className="aboutus-responsive" style={{ backgroundColor: 'white', minHeight: '100vh', padding: '20px' }}>
      
      <div style={{ position: 'relative', width: '100%', minHeight: 400 }}>
        <h1
          className="aboutus-stack"
          style={{
            position: 'absolute',
            top: positions.sectionName.top,
            left: positions.sectionName.left,
            ...styles.sectionName,
            margin: 0,
            pointerEvents: 'none',
          }}
        >
          {texts.sectionName}
        </h1>
        <h2
          className="aboutus-stack"
          style={{
            position: 'absolute',
            top: apropos?.positions?.title?.top || 80,
            left: apropos?.positions?.title?.left || 50,
            ...(apropos?.styles?.title || {
              color: '#f59e0b',
              fontSize: '1.5rem',
              fontFamily: 'Arial',
            }),
            margin: 0,
            pointerEvents: 'none',
          }}
        >
          {extractTextFromHTML(apropos?.titre) || 'Abshore is a Digital Services Company.'}
        </h2>
        <p
          className="aboutus-stack"
          style={{
            position: 'absolute',
            top: apropos?.positions?.description?.top || 140,
            left: apropos?.positions?.description?.left || 80,
            ...(apropos?.styles?.description || {
              color: '#666666',
              fontSize: '1rem',
              fontFamily: 'Arial',
              width: '600px',
            }),
            margin: 0,
            pointerEvents: 'none',
          }}
        >
          {extractTextFromHTML(apropos?.description) || 'Since 2012, our company has been supporting...'}
        </p>
        <img
          className="aboutus-image"
          src={apropos?.image || logoblack}
          alt="Logo"
          style={{
            position: 'absolute',
            top: apropos?.positions?.image?.top || 60,
            left: apropos?.positions?.image?.left || 800,
            width: (apropos?.styles?.image?.width || 600),
            height: (apropos?.styles?.image?.height || 600),
            borderRadius: apropos?.styles?.image?.borderRadius || '0px',
            objectFit: 'cover',
            pointerEvents: 'none',
          }}
        />
      </div>
    </div>
  );
}