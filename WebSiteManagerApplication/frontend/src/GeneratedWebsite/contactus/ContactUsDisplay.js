import React, { useState, useEffect } from 'react';
import '../../website/contactus/ContactUs.css';
import axios from 'axios';

export default function ContactUsDisplay({ contentType = 'contactus', styleKey = 'styleOne', entrepriseId }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [contactUsData, setContactUsData] = useState(null);
  const [positions, setPositions] = useState({});
  const [styles, setStyles] = useState({});
  const [texts, setTexts] = useState({});
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [formulaire, setFormulaire] = useState(null);
  const [formSide, setFormSide] = useState('right');
  const [formInputStyle, setFormInputStyle] = useState({});
  const [formButtonStyle, setFormButtonStyle] = useState({});
  const [responses, setResponses] = useState({});
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchAllData = async () => {
      if (!entrepriseId) {
        setLoading(false);
        setError('Entreprise non spécifiée.');
        return;
      }
      try {
        setLoading(true);
        // Récupérer les données ContactUs
        const contactUsRes = await axios.get(`http://localhost:5000/contenus/ContactUs/entreprise/${entrepriseId}`);
        const data = Array.isArray(contactUsRes.data) ? contactUsRes.data[0] : contactUsRes.data;
        if (data) {
          setContactUsData(data);
          setStyles(prev => ({ ...data.styles }));
          setPositions(prev => ({ ...data.positions }));
        }
        // Récupérer les préférences
        const prefRes = await axios.get(`http://localhost:5000/preferences/entreprise/${entrepriseId}/preferences`);
        const prefs = prefRes.data.preferences?.[contentType]?.[styleKey];
        if (prefs) {
          setPositions(prev => ({ ...prev, ...prefs.positions }));
          setStyles(prev => ({ ...prev, ...prefs.styles }));
          setTexts(prev => ({ ...prev, ...prefs.texts }));
          setBackgroundColor(prefs.backgroundColor || '#ffffff');
          if (prefs.formSide) setFormSide(prefs.formSide);
          if (prefs.formInputStyle) setFormInputStyle(prefs.formInputStyle);
          if (prefs.formButtonStyle) setFormButtonStyle(prefs.formButtonStyle);
        }
        // Récupérer le formulaire dynamique
        const formRes = await axios.get(`http://localhost:5000/formulaires/entreprise/${entrepriseId}/formulaires`);
        if (Array.isArray(formRes.data) && formRes.data.length > 0) {
          setFormulaire(formRes.data[0]);
        } else {
          setFormulaire(null);
        }
      } catch (err) {
        setError('Erreur lors du chargement des données de contact.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, [entrepriseId, contentType, styleKey]);

  // Gestion des réponses du formulaire
  const handleResponseChange = (champNom, value) => {
    setResponses({ ...responses, [champNom]: value });
  };

  const submitResponses = async (e) => {
    e.preventDefault();
    if (!formulaire) return;
    try {
      const responseObject = {};
      Object.keys(formulaire.champs || {}).forEach(nom => {
        const valeur = responses[nom];
        responseObject[nom] = valeur ? valeur.trim() !== '' ? valeur : 'VALEUR_VIDE' : 'VALEUR_VIDE';
      });
      await axios.post('http://localhost:5000/formulaires/reponse', {
        values: responseObject,
        formulaire: formulaire._id,
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      setResponses({});
    } catch (error) {
      setError("Erreur lors de l'envoi des réponses");
    }
  };

  // Utilitaire pour convertir hex en rgba
  function hexToRgba(hex, alpha = 1) {
    let c = hex.replace('#', '');
    if (c.length === 3) c = c[0]+c[0]+c[1]+c[1]+c[2]+c[2];
    const bigint = parseInt(c, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r},${g},${b},${alpha})`;
  }

  if (loading) return <div>Chargement...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  // Fallbacks
  const sectionName = texts.sectionName || contactUsData?.sectionName || 'Contact Us';
  const description = contactUsData?.description || '';
  const adresse = contactUsData?.adresse || '';
  const phone = contactUsData?.phone || '';
  const email = contactUsData?.email || '';
  const labelOffice = texts.labelOffice || 'Office:';
  const labelPhone = texts.labelPhone || 'Phone:';
  const labelEmail = texts.labelEmail || 'Email:';

  return (
    <div className="contact-us" style={{ backgroundColor: backgroundColor, padding: '20px', paddingTop: '80px', paddingBottom: '120px' }}>
      <div className="contact-container" style={{ position: 'relative', display: 'flex', flexDirection: formSide === 'left' || formSide === 'right' ? 'row' : 'column', gap: 32, alignItems: 'flex-start' }}>
        <div
          className="contact-info"
          style={{
            backgroundColor: backgroundColor,
            flex: 1,
            order: formSide === 'left' ? 2 : 1,
            minWidth: 0,
          }}
        >
          <h2
            className="contact-section-title"
            style={{ ...(styles.sectionName || {}), position: 'relative', ...positions.sectionName }}
          >
            {sectionName}
          </h2>
          {description && (
            <p
              className="contact-section-description"
              style={{ ...(styles.description || {}), position: 'relative', ...positions.description }}
            >
              {description}
            </p>
          )}
          
          <div className="contact-detail">
            <p style={{ position: 'relative', minHeight: '1.5em' }}>
              <span
                style={{
                  ...(styles.labelOffice || {}),
                  ...(positions.labelOffice ? { position: 'absolute', top: positions.labelOffice.top, left: positions.labelOffice.left } : {}),
                }}
              >{labelOffice}</span>
              <span
                style={{
                  ...(styles.adresse || {}),
                  ...(positions.adresse ? { position: 'absolute', top: positions.adresse.top, left: positions.adresse.left } : {}),
                  marginLeft: 8,
                }}
              >{adresse}</span>
            </p>
            <p style={{ position: 'relative', minHeight: '1.5em' }}>
              <span
                style={{
                  ...(styles.labelPhone || {}),
                  ...(positions.labelPhone ? { position: 'absolute', top: positions.labelPhone.top, left: positions.labelPhone.left } : {}),
                }}
              >{labelPhone}</span>
              <span
                style={{
                  ...(styles.phone || {}),
                  ...(positions.phone ? { position: 'absolute', top: positions.phone.top, left: positions.phone.left } : {}),
                  marginLeft: 8,
                }}
              >{phone}</span>
            </p>
            <p style={{ position: 'relative', minHeight: '1.5em' }}>
              <span
                style={{
                  ...(styles.labelEmail || {}),
                  ...(positions.labelEmail ? { position: 'absolute', top: positions.labelEmail.top, left: positions.labelEmail.left } : {}),
                }}
              >{labelEmail}</span>
              <span
                style={{
                  ...(styles.email || {}),
                  ...(positions.email ? { position: 'absolute', top: positions.email.top, left: positions.email.left } : {}),
                  marginLeft: 8,
                }}
              >{email}</span>
            </p>
          </div>
          {contactUsData?.links && (
            <div className="social-icons" style={styles.links}>
              {Object.entries(contactUsData.links).map(([key, value]) => (
                <a key={key} href={value} target="_blank" rel="noopener noreferrer" style={{ color: styles.links?.color }}>
                  <i className={`fab fa-${key.toLowerCase()}`}></i>
                </a>
              ))}
            </div>
          )}
        </div>
        {/* Formulaire dynamique fonctionnel */}
        {formulaire && (
          <div
            className="contact-form"
            style={{
              flex: 1,
              order: formSide === 'left' ? 1 : 2,
              minWidth: 0,
            }}
          >
            <form onSubmit={submitResponses}>
              <div className="name-fields">
                {Object.entries(formulaire.champs || {}).slice(0, 2).map(([nom, type], idx) => (
                  <input
                    key={nom}
                    type={type}
                    placeholder={nom}
                    value={responses[nom] || ''}
                    onChange={e => handleResponseChange(nom, e.target.value)}
                    required
                    style={{
                      borderRadius: formInputStyle.borderRadius,
                      backgroundColor: hexToRgba(formInputStyle.backgroundColor || '#fff', formInputStyle.backgroundAlpha ?? 1),
                      border: '1px solid #ccc',
                      padding: '10px',
                      marginBottom: '10px',
                      width: '100%',
                      fontSize: '1em',
                      transition: 'background 0.2s',
                    }}
                  />
                ))}
              </div>
              {Object.entries(formulaire.champs || {}).slice(2).map(([nom, type]) => (
                <input
                  key={nom}
                  type={type}
                  placeholder={nom}
                  value={responses[nom] || ''}
                  onChange={e => handleResponseChange(nom, e.target.value)}
                  required
                  style={{
                    borderRadius: formInputStyle.borderRadius,
                    backgroundColor: hexToRgba(formInputStyle.backgroundColor || '#fff', formInputStyle.backgroundAlpha ?? 1),
                    border: '1px solid #ccc',
                    padding: '10px',
                    marginBottom: '10px',
                    width: '100%',
                    fontSize: '1em',
                    transition: 'background 0.2s',
                  }}
                />
              ))}
              <div className="button-container">
                <button
                  type="submit"
                  style={{
                    backgroundColor: formButtonStyle.backgroundColor,
                    color: formButtonStyle.textColor,
                    border: 'none',
                    borderRadius: formButtonStyle.borderRadius,
                    padding: formButtonStyle.padding,
                    fontSize: formButtonStyle.fontSize,
                    width: formButtonStyle.width,
                    transition: 'background-color 0.3s ease',
                    cursor: 'pointer',
                  }}
                >
                  Envoyer
                </button>
              </div>
              {success && (
                <div style={{ color: 'green', marginTop: '10px', fontWeight: 'bold' }}>
                  Réponses envoyées avec succès !
                </div>
              )}
            </form>
          </div>
        )}
      </div>
    </div>
  );
}