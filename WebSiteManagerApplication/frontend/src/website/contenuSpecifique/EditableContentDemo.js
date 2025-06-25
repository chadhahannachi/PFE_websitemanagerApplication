import React, { useState } from 'react';
import EditableContent from './EditableContent';

const EditableContentDemo = () => {
  const [contents, setContents] = useState([
    {
      id: '1',
      titre: 'Notre Mission',
      description: 'Nous nous engageons à fournir des solutions innovantes qui répondent aux besoins de nos clients tout en respectant l\'environnement.',
      image: 'https://via.placeholder.com/600x300',
      styles: {
        container: {
          backgroundColor: '#f8f9fa',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          margin: '10px 0',
        },
        title: {
          color: '#2c3e50',
          fontSize: '24px',
          fontWeight: 'bold',
          marginBottom: '10px',
        },
        description: {
          color: '#34495e',
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
    },
    {
      id: '2',
      titre: 'Nos Services',
      description: 'Découvrez notre gamme complète de services conçus pour répondre à tous vos besoins professionnels.',
      image: 'https://via.placeholder.com/600x300',
      styles: {
        container: {
          backgroundColor: '#e3f2fd',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          margin: '10px 0',
        },
        title: {
          color: '#1565c0',
          fontSize: '24px',
          fontWeight: 'bold',
          marginBottom: '10px',
        },
        description: {
          color: '#0d47a1',
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
    }
  ]);

  const handleContentUpdate = (updatedContent) => {
    setContents(prevContents => 
      prevContents.map(content => 
        content.id === updatedContent.id ? updatedContent : content
      )
    );
  };

  const addNewContent = () => {
    const newContent = {
      id: `${contents.length + 1}`,
      titre: 'Nouveau Contenu',
      description: 'Cliquez sur l\'icône de crayon pour modifier ce contenu.',
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
    };
    
    setContents(prevContents => [...prevContents, newContent]);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Gestionnaire de Contenu Éditable</h1>
      
      <button 
        onClick={addNewContent}
        style={{
          display: 'block',
          margin: '0 auto 30px',
          padding: '10px 20px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '16px'
        }}
      >
        Ajouter un nouveau contenu
      </button>
      
      {contents.map(content => (
        <EditableContent 
          key={content.id}
          contentId={content.id}
          initialData={content}
          onUpdate={handleContentUpdate}
        />
      ))}
    </div>
  );
};

export default EditableContentDemo;