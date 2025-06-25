import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faSave, faTimes, faImage, faPalette } from '@fortawesome/free-solid-svg-icons';

const API_URL = 'http://localhost:5000/contenus';

const EditableContent = ({ contentId, initialData, onUpdate }) => {
  const [content, setContent] = useState({
    titre: '',
    description: '',
    image: '',
    styles: {
      container: {
        backgroundColor: '#ffffff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        margin: '10px 0',
      },
      title: {
        color: '#333333',
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '10px',
      },
      description: {
        color: '#666666',
        fontSize: '16px',
        lineHeight: '1.5',
      },
      image: {
        maxWidth: '100%',
        height: 'auto',
        borderRadius: '4px',
        marginBottom: '15px',
      }
    }
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [isStyleEditing, setIsStyleEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const titleInputRef = useRef(null);
  
  useEffect(() => {
    if (initialData) {
      setContent({
        ...initialData,
        styles: initialData.styles || content.styles
      });
    } else if (contentId) {
      fetchContent();
    }
  }, [contentId, initialData]);
  
  useEffect(() => {
    if (isEditing && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [isEditing]);
  
  const fetchContent = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/${contentId}`);
      setContent({
        ...response.data,
        styles: response.data.styles || content.styles
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching content:', error);
      setError('Erreur lors de la récupération du contenu');
      setLoading(false);
    }
  };
  
  const saveContent = async () => {
    try {
      setLoading(true);
      let response;
      
      if (contentId) {
        response = await axios.patch(`${API_URL}/${contentId}`, content);
      } else {
        response = await axios.post(API_URL, content);
      }
      
      setContent(response.data);
      setIsEditing(false);
      setIsStyleEditing(false);
      setLoading(false);
      
      if (onUpdate) {
        onUpdate(response.data);
      }
    } catch (error) {
      console.error('Error saving content:', error);
      setError('Erreur lors de la sauvegarde du contenu');
      setLoading(false);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContent(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleStyleChange = (property, value, section) => {
    setContent(prev => ({
      ...prev,
      styles: {
        ...prev.styles,
        [section]: {
          ...prev.styles[section],
          [property]: value
        }
      }
    }));
  };
  
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setContent(prev => ({
        ...prev,
        image: reader.result
      }));
    };
    reader.readAsDataURL(file);
  };
  
  if (loading) {
    return <div>Chargement en cours...</div>;
  }
  
  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }
  
  return (
    <div style={content.styles.container}>
      {!isEditing && !isStyleEditing ? (
        <>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
            <button 
              onClick={() => setIsEditing(true)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', marginRight: '10px' }}
            >
              <FontAwesomeIcon icon={faPencilAlt} />
            </button>
            <button 
              onClick={() => setIsStyleEditing(true)}
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <FontAwesomeIcon icon={faPalette} />
            </button>
          </div>
          
          {content.image && (
            <img 
              src={content.image} 
              alt={content.titre} 
              style={content.styles.image}
            />
          )}
          
          <h2 style={content.styles.title}>{content.titre}</h2>
          <p style={content.styles.description}>{content.description}</p>
        </>
      ) : isEditing ? (
        <div className="edit-mode">
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
            <button 
              onClick={saveContent}
              style={{ background: 'none', border: 'none', cursor: 'pointer', marginRight: '10px' }}
            >
              <FontAwesomeIcon icon={faSave} />
            </button>
            <button 
              onClick={() => setIsEditing(false)}
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="image-upload" style={{ display: 'block', marginBottom: '5px' }}>
              Image:
            </label>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
              <label 
                htmlFor="image-upload" 
                style={{ 
                  display: 'inline-block',
                  padding: '8px 12px',
                  backgroundColor: '#f0f0f0',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  marginRight: '10px'
                }}
              >
                <FontAwesomeIcon icon={faImage} /> Choisir une image
              </label>
              {content.image && (
                <img 
                  src={content.image} 
                  alt="Aperçu" 
                  style={{ height: '40px', width: 'auto', borderRadius: '4px' }}
                />
              )}
            </div>
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="titre" style={{ display: 'block', marginBottom: '5px' }}>
              Titre:
            </label>
            <input
              ref={titleInputRef}
              type="text"
              id="titre"
              name="titre"
              value={content.titre}
              onChange={handleInputChange}
              style={{ 
                width: '100%', 
                padding: '8px', 
                borderRadius: '4px',
                border: '1px solid #ddd'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="description" style={{ display: 'block', marginBottom: '5px' }}>
              Description:
            </label>
            <textarea
              id="description"
              name="description"
              value={content.description}
              onChange={handleInputChange}
              rows="4"
              style={{ 
                width: '100%', 
                padding: '8px', 
                borderRadius: '4px',
                border: '1px solid #ddd',
                resize: 'vertical'
              }}
            />
          </div>
        </div>
      ) : (
        <div className="style-edit-mode">
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
            <button 
              onClick={saveContent}
              style={{ background: 'none', border: 'none', cursor: 'pointer', marginRight: '10px' }}
            >
              <FontAwesomeIcon icon={faSave} />
            </button>
            <button 
              onClick={() => setIsStyleEditing(false)}
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
          
          <h3>Styles du conteneur</h3>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>
              Couleur de fond:
            </label>
            <input
              type="color"
              value={content.styles.container.backgroundColor}
              onChange={(e) => handleStyleChange('backgroundColor', e.target.value, 'container')}
            />
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>
              Padding:
            </label>
            <input
              type="range"
              min="0"
              max="50"
              value={parseInt(content.styles.container.padding)}
              onChange={(e) => handleStyleChange('padding', `${e.target.value}px`, 'container')}
            />
            <span>{content.styles.container.padding}</span>
          </div>
          
          <h3>Styles du titre</h3>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>
              Couleur du texte:
            </label>
            <input
              type="color"
              value={content.styles.title.color}
              onChange={(e) => handleStyleChange('color', e.target.value, 'title')}
            />
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>
              Taille de police:
            </label>
            <input
              type="range"
              min="12"
              max="48"
              value={parseInt(content.styles.title.fontSize)}
              onChange={(e) => handleStyleChange('fontSize', `${e.target.value}px`, 'title')}
            />
            <span>{content.styles.title.fontSize}</span>
          </div>
          
          <h3>Styles de la description</h3>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>
              Couleur du texte:
            </label>
            <input
              type="color"
              value={content.styles.description.color}
              onChange={(e) => handleStyleChange('color', e.target.value, 'description')}
            />
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>
              Taille de police:
            </label>
            <input
              type="range"
              min="10"
              max="24"
              value={parseInt(content.styles.description.fontSize)}
              onChange={(e) => handleStyleChange('fontSize', `${e.target.value}px`, 'description')}
            />
            <span>{content.styles.description.fontSize}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditableContent;
