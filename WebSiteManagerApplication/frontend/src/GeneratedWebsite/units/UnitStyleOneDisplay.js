import React, { useState, useEffect } from 'react';
import '../../website/units/Units.css';
import company from '../../images/company.jpg';
import axios from 'axios';

export default function UnitStyleOneDisplay({ entrepriseId }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [positions, setPositions] = useState({
    sectionName: { top: 0, left: 0 },
    subtitle: { top: 60, left: 0 },
    img: { top: 160, left: 0 },
    unitContent: { top: 120, left: 0, width: '50%' },
  });
  const [styles, setStyles] = useState({
    sectionName: { color: '#f59e0b', fontSize: '20px', fontFamily: 'inherit', fontWeight: '600' },
    subtitle: { color: '#000', fontSize: '38px', fontFamily: 'inherit', fontWeight: '600' },
    img: { width: '400px', height: 'auto', borderRadius: '0px'},
    unitContent: {
      title: { color: '#358dcc', fontSize: '20px', fontWeight: '600' },
      description: { color: '#666', fontSize: '18px' },
    },
  });
  const [texts, setTexts] = useState({
    sectionName: 'Our Unite',
    subtitle: 'A reliable partner to meet all your development and digital services needs.',
  });
  const [units, setUnits] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!entrepriseId) {
        setError("ID de l'entreprise manquant.");
        setLoading(false);
        return;
      }
      try {
        // fetch units
        const unitsRes = await axios.get(`http://localhost:5000/contenus/Unite/entreprise/${entrepriseId}`);
        setUnits(Array.isArray(unitsRes.data) ? unitsRes.data : []);
        // fetch preferences
        const prefRes = await axios.get(`http://localhost:5000/preferences/entreprise/${entrepriseId}/preferences`);
        const fetchedPreferences = prefRes.data.preferences?.unite?.styleOne || {};
        setPositions({
          sectionName: fetchedPreferences.positions?.sectionName || { top: 0, left: 0 },
          subtitle: fetchedPreferences.positions?.subtitle || { top: 60, left: 0 },
          img: fetchedPreferences.positions?.img ,
          unitContent: fetchedPreferences.positions?.unitContent || { top: 120, left: 0, width: '50%' },
        });
        setStyles({
          sectionName: fetchedPreferences.styles?.sectionName || { color: '#f59e0b', fontSize: '20px', fontFamily: 'inherit', fontWeight: '600' },
          subtitle: fetchedPreferences.styles?.subtitle || { color: '#000', fontSize: '38px', fontFamily: 'inherit', fontWeight: '600' },
          img: fetchedPreferences.styles?.img || { width: '400px', height: 'auto', borderRadius: '0px', position: 'absolute', left: '50%' },
          unitContent: fetchedPreferences.styles?.unitContent || {
            title: { color: '#358dcc', fontSize: '20px', fontWeight: '600' },
            description: { color: '#666', fontSize: '18px' },
          },
        });

        setTexts({
          sectionName: fetchedPreferences.texts?.sectionName || 'Our Unite',
          subtitle: fetchedPreferences.texts?.subtitle || 'A reliable partner to meet all your development and digital services needs.',
        });

      } catch (e) {
        setError('Erreur lors du chargement des données Units');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [entrepriseId]);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;

  return (
    <div className="units unitone-responsive">
      <div className="units-wrapper unitone-wrapper" style={{ position: 'relative', maxWidth: '1400px', margin: '0 auto', padding: '40px 20px', minHeight: '600px' }}>
        <h1
          className="unitone-stack"
          style={{
            ...styles.sectionName,
            position: 'absolute',
            top: `${positions.sectionName.top}px`,
            left: `${positions.sectionName.left}px`,
            margin: 0,
            lineHeight: '1.2',
            pointerEvents: 'none',
          }}
        >
          {texts.sectionName}
        </h1>
        <p
          className="unitone-stack"
          style={{
            ...styles.subtitle,
            position: 'absolute',
            top: `${positions.subtitle.top}px`,
            left: `${positions.subtitle.left}px`,
            margin: 0,
            lineHeight: '1.5',
            pointerEvents: 'none',
          }}
        >
          {texts.subtitle}
        </p>
        <div
          className="unit-content unitone-stack"
          style={{
            position: 'absolute',
            top: `${positions.unitContent.top}px`,
            left: `${positions.unitContent.left}px`,
            width: positions.unitContent.width || styles.unitContent.width || '50%',
            flex: 1,
            minWidth: '250px',
          }}
        >
          {Array.isArray(units) && units.length > 0 ? (
            units.map((unit, index) => (
              <div key={index}>
                <h2
                  className="unitone-stack"
                  style={{
                    ...(unit.styles?.title || styles.unitContent.title),
                    marginBottom: '20px',
                    padding: '2px 30px',
                  }}
                >
                  {unit.image && (
                    <img
                      className="unitone-image"
                      src={unit.image}
                      alt={unit.titre || 'Image de l\'unité'}
                      style={{ width: '40px', height: '40px', objectFit: 'cover', marginRight: '8px', verticalAlign: 'middle' }}
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/40'; }}
                    />
                  )}
                  {unit.titre}
                </h2>
                <p
                  className="unitone-stack"
                  style={{
                    ...(unit.styles?.description || styles.unitContent.description),
                    marginBottom: '20px',
                    marginTop: '1px',
                    paddingLeft: '40px',
                  }}
                >
                  {unit.description}
                </p>
              </div>
            ))
          ) : (
            <p className="unitone-stack">Aucune unité publiée pour le moment.</p>
          )}
        </div>
        <div>
          {positions.img && (
            <img
              className="unitone-image"
              src={styles.img.src || company}
              alt="image"
              style={{
                position: 'absolute',
                top: positions?.img?.top || '0%',
                left: positions?.img?.left + 700 ,
                width: styles.img.width || 'auto',
                height: styles.img.height || 'auto',
                borderRadius: styles.img.borderRadius || '0px',
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}