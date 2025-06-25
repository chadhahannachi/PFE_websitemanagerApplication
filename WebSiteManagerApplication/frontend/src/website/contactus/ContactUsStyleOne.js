import React, { useState, useEffect } from 'react';
import './ContactUs.css';
import EditorText from '../aboutus/EditorText';
import axios from 'axios';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { SketchPicker } from 'react-color';

// --- SimpleModal local ---
function SimpleModal({ isOpen, onClose, children }) {
  console.log('SimpleModal rendu, isOpen:', isOpen);
  if (!isOpen) return null;
  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      zIndex: 10000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backdropFilter: 'blur(3px)'
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '12px',
        padding: '32px',
        minWidth: '320px',
        maxWidth: '480px',
        width: '90%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
        position: 'relative',
        animation: 'modalFadeIn 0.3s ease'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'transparent',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: '#666',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={e => {
            e.currentTarget.style.backgroundColor = '#f0f0f0';
            e.currentTarget.style.color = '#333';
          }}
          onMouseOut={e => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#666';
          }}
          aria-label="Fermer"
        >×</button>
        {children}
      </div>
      <style>
        {`
          @keyframes modalFadeIn {
            from {
              opacity: 0;
              transform: translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
}

export default function ContactUsStyleOne({ contentType = 'contactus', styleKey = 'styleOne', onBackgroundColorChange }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [contactUsData, setContactUsData] = useState(null);
  const [userEntreprise, setUserEntreprise] = useState(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [formulaire, setFormulaire] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [fields, setFields] = useState([]);
  const [responses, setResponses] = useState({});

  
  const defaultStyles = {
    sectionName: { fontSize: '2rem', fontWeight: 'bold', color: '#000' },
    description: { fontSize: '1rem', color: '#666' },
    adresse: { fontSize: '1rem', color: '#333' },
    phone: { fontSize: '1rem', color: '#333' },
    email: { fontSize: '1rem', color: '#333' },
    links: { color: '#333' },
    labelOffice: { fontSize: '1rem', fontWeight: 'bold', color: '#333' },
    labelPhone: { fontSize: '1rem', fontWeight: 'bold', color: '#333' },
    labelEmail: { fontSize: '1rem', fontWeight: 'bold', color: '#333' }
  };

  const defaultPositions = {
    sectionName: { top: 0, left: 0 },
    description: { top: 20, left: 0 },
    adresse: { top: 40, left: 50 },
    phone: { top: 60, left: 50 },
    email: { top: 60, left: 50 },
    labelOffice: { top: 40, left: 0 },
    labelPhone: { top: 60, left: 0 },
    labelEmail: { top: 60, left: 0 }
  };

  const defaultTexts = {
    sectionName: 'Contact Us',
    labelOffice: 'Office:',
    labelPhone: 'Phone:',
    labelEmail: 'Email:'
  };

  const [positions, setPositions] = useState(defaultPositions);
  const [styles, setStyles] = useState(defaultStyles);
  const [texts, setTexts] = useState(defaultTexts);

  const token = localStorage.getItem("token");
  let userId = null;
  if (token) {
    try {
      userId = jwtDecode(token)?.sub;
    } catch (e) {
      setError('Token invalide.');
    }
  }

  useEffect(() => {
    const fetchAllData = async () => {
      if (!userId) {
        setLoading(false);
        setError('Utilisateur non authentifié.');
        return;
      }
      try {
        setLoading(true);
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const userRes = await axios.get(`http://localhost:5000/auth/user/${userId}`, config);
        const entreprise = userRes.data.entreprise;
        if (!entreprise) {
          throw new Error("Entreprise non trouvée pour l'utilisateur.");
        }
        setUserEntreprise(entreprise);

        const contactUsRes = await axios.get(`http://localhost:5000/contenus/ContactUs/entreprise/${entreprise}`, config);
        const data = Array.isArray(contactUsRes.data) ? contactUsRes.data[0] : contactUsRes.data;
        if (data) {
          setContactUsData(data);
          setStyles(prev => ({ ...defaultStyles, ...data.styles }));
          setPositions(prev => ({ ...defaultPositions, ...data.positions }));
        }

        const prefRes = await axios.get(`http://localhost:5000/preferences/entreprise/${entreprise}/preferences`, config);
        const prefs = prefRes.data.preferences?.[contentType]?.[styleKey];
        if (prefs) {
          setPositions(prev => ({
            ...prev,
            sectionName: prefs.positions?.sectionName || defaultPositions.sectionName,
            labelOffice: prefs.positions?.labelOffice || defaultPositions.labelOffice,
            labelPhone: prefs.positions?.labelPhone || defaultPositions.labelPhone,
            labelEmail: prefs.positions?.labelEmail || defaultPositions.labelEmail
          }));
          setStyles(prev => ({
            ...prev,
            sectionName: prefs.styles?.sectionName || defaultStyles.sectionName,
            labelOffice: prefs.styles?.labelOffice || defaultStyles.labelOffice,
            labelPhone: prefs.styles?.labelPhone || defaultStyles.labelPhone,
            labelEmail: prefs.styles?.labelEmail || defaultStyles.labelEmail
          }));
          setTexts(prev => ({
            ...prev,
            sectionName: prefs.texts?.sectionName || defaultTexts.sectionName,
            labelOffice: prefs.texts?.labelOffice || defaultTexts.labelOffice,
            labelPhone: prefs.texts?.labelPhone || defaultTexts.labelPhone,
            labelEmail: prefs.texts?.labelEmail || defaultTexts.labelEmail
          }));
          setBackgroundColor(prefs.backgroundColor || '#ffffff');
          if (onBackgroundColorChange) onBackgroundColorChange(prefs.backgroundColor || '#ffffff');
        }

        // Récupérer le formulaire dynamique
        const formRes = await axios.get(`http://localhost:5000/formulaires/entreprise/${entreprise}/formulaires`, config);
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
  }, [userId, token, contentType, styleKey]);

  useEffect(() => {
    if (onBackgroundColorChange) onBackgroundColorChange(backgroundColor);
  }, [backgroundColor, onBackgroundColorChange]);

  const handlePositionChange = (element, newPosition) => {
    setPositions(prev => ({ ...prev, [element]: newPosition }));
  };

  const handleStyleChange = (element, newStyles) => {
    setStyles(prev => ({ ...prev, [element]: { ...(prev[element] || {}), ...newStyles } }));
  };

  const handleTextChange = (element, newText) => {
    if (element === 'sectionName') {
      setTexts(prev => ({ ...prev, [element]: newText }));
    } else {
      setContactUsData(prev => ({ ...prev, [element]: newText }));
    }
  };

  const saveAllChanges = async () => {
    if (!userEntreprise || !contactUsData?._id) {
      toast.error("Données de l'entreprise ou de la section manquantes.");
      return;
    }
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const { sectionName, labelOffice, labelPhone, labelEmail, ...contactPositions } = positions;
      const { sectionName: sectionNameStyle, labelOffice: labelOfficeStyle, labelPhone: labelPhoneStyle, labelEmail: labelEmailStyle, ...contactStyles } = styles;

      await axios.patch(`http://localhost:5000/contenus/ContactUs/${contactUsData._id}`, {
        ...contactUsData,
        positions: contactPositions,
        styles: contactStyles,
      }, config);

      await axios.post('http://localhost:5000/preferences/entreprise', {
        entreprise: userEntreprise,
        preferences: {
          [contentType]: {
            [styleKey]: {
              positions: {
                sectionName: positions.sectionName,
                labelOffice: positions.labelOffice,
                labelPhone: positions.labelPhone,
                labelEmail: positions.labelEmail
              },
              styles: {
                sectionName: styles.sectionName,
                labelOffice: styles.labelOffice,
                labelPhone: styles.labelPhone,
                labelEmail: styles.labelEmail
              },
              texts: texts,
              backgroundColor
            },
          },
        },
      }, config);
      
      toast.success('Modifications sauvegardées !');
    } catch (err) {
      toast.error('Erreur lors de la sauvegarde.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Ajout de champ pour la création de formulaire
  const addField = () => {
    setFields([...fields, { nom: '', type: 'text' }]);
  };

  const handleFieldChange = (index, key, value) => {
    const newFields = [...fields];
    newFields[index][key] = value;
    setFields(newFields);
  };

  const createForm = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.post('http://localhost:5000/formulaires', {
        titre: formTitle,
        champs: fields,
        entreprise: userEntreprise
      }, config);
      toast.success('Formulaire créé avec succès !');
      setShowFormModal(false);
      setFormTitle("");
      setFields([]);
      // Rafraîchir le formulaire affiché
      const formRes = await axios.get(`http://localhost:5000/formulaires/entreprise/${userEntreprise}/formulaires`, config);
      if (Array.isArray(formRes.data) && formRes.data.length > 0) {
        setFormulaire(formRes.data[0]);
      } else {
        setFormulaire(null);
      }
    } catch (error) {
      toast.error('Erreur lors de la création du formulaire');
    }
  };

  const handleResponseChange = (champId, value) => {
    setResponses({ ...responses, [champId]: value });
  };

  const submitResponses = async () => {
    try {
      const responseArray = (formulaire.champs || []).map((champ) => {
        const valeur = responses[champ._id];
        return {
          formulaire: formulaire._id,
          champ: champ._id,
          valeur: valeur ? valeur.trim() !== '' ? valeur : 'VALEUR_VIDE' : 'VALEUR_VIDE',
        };
      });
      await axios.post('http://localhost:5000/formulaires/repondre', responseArray);
      toast.success('Réponses envoyées avec succès !');
      setResponses({});
    } catch (error) {
      toast.error('Erreur lors de l\'envoi des réponses');
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div className="contact-container" style={{ position: 'relative' }}>
      <button 
        onClick={saveAllChanges} 
        style={{ 
            position: 'absolute', 
            top: '-50px', 
            right: '-50px', 
            zIndex: 1000, 
            padding: '10px 20px', 
            cursor: 'pointer',
            backgroundColor: '#a0a0a0e5',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1em',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            transition: 'background-color 0.3s ease'
        }}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#a0a0a0e5'}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#a0a0a0e5'}
      >
        <CheckCircleIcon />
        Enregistrer
      </button>

      <div style={{ position: 'absolute', top: '-50px', right: '100px', zIndex: 1000 }}>
        <button
          onClick={() => setShowColorPicker(!showColorPicker)}
          style={{
            padding: '10px 20px',
            cursor: 'pointer',
            backgroundColor: backgroundColor,
            border: '1px solid #ccc',
            borderRadius: '8px'
          }}
        >
          Couleur de fond
        </button>
        {showColorPicker && (
          <div style={{ position: 'absolute', zIndex: 2 }}>
            <div
              style={{
                position: 'fixed',
                top: '0px',
                right: '0px',
                bottom: '0px',
                left: '0px',
              }}
              onClick={() => setShowColorPicker(false)}
            />
            <SketchPicker
              color={backgroundColor}
              onChange={(color) => setBackgroundColor(color.hex)}
            />
          </div>
        )}
      </div>

      <div className="contact-info" style={{ backgroundColor }}>
        <div style={{ position: 'relative', minHeight: '1.5em' }}>
          <EditorText
            elementType="h2"
            initialPosition={positions.sectionName}
            initialStyles={styles.sectionName}
            onPositionChange={(pos) => handlePositionChange('sectionName', pos)}
            onStyleChange={(style) => handleStyleChange('sectionName', style)}
            onTextChange={(text) => handleTextChange('sectionName', text)}
          >
            {texts.sectionName}
          </EditorText>
        </div>

        <div style={{ position: 'relative', minHeight: '1.5em' }}>
          <EditorText
            elementType="p"
            initialPosition={positions.description}
            initialStyles={styles.description}
            onPositionChange={(pos) => handlePositionChange('description', pos)}
            onStyleChange={(style) => handleStyleChange('description', style)}
            onTextChange={(text) => handleTextChange('description', text)}
          >
            {contactUsData?.description || "Massa urna magnis dignissim id euismod porttitor vitae etiam viverra et adipiscing sit morbi aliquet mauris porttitor nisi."}
          </EditorText>
        </div>

        <div className="contact-detail">
          <p style={{ position: 'relative', minHeight: '1.5em' }}>
            <EditorText
              elementType="span"
              initialPosition={positions.labelOffice}
              initialStyles={styles.labelOffice}
              onPositionChange={(pos) => handlePositionChange('labelOffice', pos)}
              onStyleChange={(style) => handleStyleChange('labelOffice', style)}
              onTextChange={(text) => handleTextChange('labelOffice', text)}
            >
              {texts.labelOffice}
            </EditorText>
            <div style={{ position: 'relative', display: 'inline-block', width: '100%', minHeight: '1em', marginLeft: '8px' }}>
              <EditorText
                elementType="span"
                initialPosition={positions.adresse}
                initialStyles={styles.adresse}
                onPositionChange={(pos) => handlePositionChange('adresse', pos)}
                onStyleChange={(style) => handleStyleChange('adresse', style)}
                onTextChange={(text) => handleTextChange('adresse', text)}
              >
                {contactUsData?.adresse || "1234 N Spring St, Los Angeles, CA 90012, United States."}
              </EditorText>
            </div>
          </p>
          <p style={{ position: 'relative', minHeight: '1.5em' }}>
            <EditorText
              elementType="span"
              initialPosition={positions.labelPhone}
              initialStyles={styles.labelPhone}
              onPositionChange={(pos) => handlePositionChange('labelPhone', pos)}
              onStyleChange={(style) => handleStyleChange('labelPhone', style)}
              onTextChange={(text) => handleTextChange('labelPhone', text)}
            >
              {texts.labelPhone}
            </EditorText>
            <div style={{ position: 'relative', display: 'inline-block', width: '100%', minHeight: '1em', marginLeft: '8px' }}>
              <EditorText
                elementType="span"
                initialPosition={positions.phone}
                initialStyles={styles.phone}
                onPositionChange={(pos) => handlePositionChange('phone', pos)}
                onStyleChange={(style) => handleStyleChange('phone', style)}
                onTextChange={(text) => handleTextChange('phone', text)}
              >
                {contactUsData?.phone || "+01 - 123 456 7890"}
              </EditorText>
            </div>
          </p>
          <p style={{ position: 'relative', minHeight: '1.5em' }}>
            <EditorText
              elementType="span"
              initialPosition={positions.labelEmail}
              initialStyles={styles.labelEmail}
              onPositionChange={(pos) => handlePositionChange('labelEmail', pos)}
              onStyleChange={(style) => handleStyleChange('labelEmail', style)}
              onTextChange={(text) => handleTextChange('labelEmail', text)}
            >
              {texts.labelEmail}
            </EditorText>
            <div style={{ position: 'relative', display: 'inline-block', width: '100%', minHeight: '1em', marginLeft: '8px' }}>
              <EditorText
                elementType="span"
                initialPosition={positions.email}
                initialStyles={styles.email}
                onPositionChange={(pos) => handlePositionChange('email', pos)}
                onStyleChange={(style) => handleStyleChange('email', style)}
                onTextChange={(text) => handleTextChange('email', text)}
              >
                {contactUsData?.email || "mail@example.com"}
              </EditorText>
            </div>
          </p>
        </div>

        <div className="social-icons" style={styles.links}>
          {contactUsData?.links && Object.entries(contactUsData.links).map(([key, value]) => (
            <a key={key} href={value} target="_blank" rel="noopener noreferrer" style={{color: styles.links?.color}}>
              <i className={`fab fa-${key.toLowerCase()}`}></i>
            </a>
          ))}
        </div>
      </div>

      {/* Formulaire dynamique ou bouton + */}
      {formulaire ? (
        <div className="contact-form">
          <form onSubmit={e => { e.preventDefault(); submitResponses(); }}>
            <div className="name-fields">
              {(formulaire.champs || []).slice(0, 2).map((champ, idx) => (
                <input
                  key={champ._id}
                  type={champ.type}
                  placeholder={champ.nom}
                  value={responses[champ._id] || ''}
                  onChange={e => handleResponseChange(champ._id, e.target.value)}
                  required
                />
              ))}
            </div>
            {(formulaire.champs || []).slice(2).map((champ) => (
              <input
                key={champ._id}
                type={champ.type}
                placeholder={champ.nom}
                value={responses[champ._id] || ''}
                onChange={e => handleResponseChange(champ._id, e.target.value)}
                required
              />
            ))}
            <div className="button-container">
              <button type="submit">Envoyer</button>
            </div>
          </form>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '40px 0' }}>
          <span style={{ marginBottom: '16px', fontSize: '1.2em', color: '#a0a0a0e5' }}>cliquer pour ajouter un formulaire</span>
          <button
            onClick={() => setShowFormModal(true)}
            style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'a0a0a0e5',
              color: 'white',
              border: 'none',
              fontSize: '2.5em',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            title="Ajouter un formulaire"
          >
            +
          </button>
          <SimpleModal isOpen={showFormModal} onClose={() => setShowFormModal(false)}>
            <h2 style={{
              textAlign: 'center',
              color: '#333',
              marginBottom: '24px',
              fontSize: '1.8rem',
              fontWeight: '600'
            }}>Créer un formulaire</h2>
            <input
              type="text"
              placeholder="Titre du formulaire"
              value={formTitle}
              onChange={e => setFormTitle(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                marginBottom: '20px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '1rem',
                transition: 'border-color 0.3s ease',
                outline: 'none'
              }}
            />
            <button 
              onClick={addField} 
              style={{
                width: '100%',
                padding: '12px',
                marginBottom: '20px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '500',
                transition: 'background-color 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
              onMouseOver={e => e.currentTarget.style.backgroundColor = '#45a049'}
              onMouseOut={e => e.currentTarget.style.backgroundColor = '#4CAF50'}
            >
              <span style={{ fontSize: '1.2rem' }}>+</span> Ajouter un champ
            </button>
            {fields.map((field, index) => (
              <div key={index} style={{ 
                display: 'flex', 
                gap: '12px', 
                marginBottom: '16px',
                alignItems: 'center'
              }}>
                <input
                  type="text"
                  placeholder="Nom du champ"
                  value={field.nom}
                  onChange={e => handleFieldChange(index, 'nom', e.target.value)}
                  style={{
                    flex: 2,
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
                <select
                  value={field.type}
                  onChange={e => handleFieldChange(index, 'type', e.target.value)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '0.9rem',
                    backgroundColor: 'white',
                    cursor: 'pointer',
                    outline: 'none'
                  }}
                >
                  <option value="text">Texte</option>
                  <option value="number">Nombre</option>
                </select>
              </div>
            ))}
            <button 
              onClick={createForm} 
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: '#2196F3',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1.1rem',
                fontWeight: '500',
                marginTop: '20px',
                transition: 'background-color 0.3s ease',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
              onMouseOver={e => e.currentTarget.style.backgroundColor = '#1976D2'}
              onMouseOut={e => e.currentTarget.style.backgroundColor = '#2196F3'}
            >
              Créer le formulaire
            </button>
          </SimpleModal>
        </div>
      )}
    </div>
  );
}