import React, { useState } from 'react';
import axios from 'axios';

const CarrouselForm = ({ onCarrouselCreated }) => {
    const [titre, setTitre] = useState('');
    const [styles, setStyles] = useState({ backgroundColor: '#f0f0f0' });
    const [contenus, setContenus] = useState([{ titre: '', description: '', image: '' }]);

    const handleContenuChange = (index, field, value) => {
        const newContenus = [...contenus];
        newContenus[index][field] = value;
        setContenus(newContenus);
    };

    const addContenu = () => {
        setContenus([...contenus, { titre: '', description: '', image: '' }]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/carroussels', {
                titre,
                styles,
                contenus,
            });
            onCarrouselCreated(response.data); // Mettre à jour la liste après création
            setTitre('');
            setContenus([{ titre: '', description: '', image: '' }]);
        } catch (error) {
            console.error('Error creating carrousel:', error);
        }
    };

    return (
        <div>
            <h2>Créer un carrousel</h2>
            <form onSubmit={handleSubmit}>
                <label>Titre du carrousel:</label>
                <input type="text" value={titre} onChange={(e) => setTitre(e.target.value)} required />

                <h3>Contenus:</h3>
                {contenus.map((contenu, index) => (
                    <div key={index} style={{ marginBottom: '10px', padding: '10px', border: '1px solid #ccc' }}>
                        <input
                            type="text"
                            placeholder="Titre du contenu"
                            value={contenu.titre}
                            onChange={(e) => handleContenuChange(index, 'titre', e.target.value)}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Description"
                            value={contenu.description}
                            onChange={(e) => handleContenuChange(index, 'description', e.target.value)}
                            required
                        />
                        <input
                            type="text"
                            placeholder="URL de l'image"
                            value={contenu.image}
                            onChange={(e) => handleContenuChange(index, 'image', e.target.value)}
                            required
                        />
                    </div>
                ))}
                <button type="button" onClick={addContenu}>Ajouter un contenu</button>
                <button type="submit">Créer Carrousel</button>
            </form>
        </div>
    );
};

export default CarrouselForm;
