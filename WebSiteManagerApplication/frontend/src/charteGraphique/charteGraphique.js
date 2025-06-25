import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';

const API_URL = 'http://localhost:5000/couleurs';

export default function CharteGraphique() {
    const [colors, setColors] = useState([]);
    const [selectedColor, setSelectedColor] = useState('#3357FF');
    const [userEntreprise, setUserEntreprise] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isHovered, setIsHovered] = useState(false); // State for add button hover
    const [deleteHovered, setDeleteHovered] = useState({}); // State for delete buttons hover

    const token = localStorage.getItem('token');
    let userId = null;
    if (token) {
        try {
            const decodedToken = jwtDecode(token);
            userId = decodedToken?.sub;
        } catch (error) {
            console.error('Error decoding token:', error);
            setError('Erreur lors du décodage du token.');
            setLoading(false);
        }
    } else {
        console.error('Token is missing from localStorage.');
        setError('Token manquant. Veuillez vous connecter.');
        setLoading(false);
    }

    const fetchUserEntreprise = async () => {
        if (!token || !userId) {
            console.error('Token or User ID is missing');
            setError('Token ou ID utilisateur manquant.');
            setLoading(false);
            return;
        }

        try {
            const config = {
                headers: { Authorization: `Bearer ${token}` },
            };
            const userResponse = await axios.get(`http://localhost:5000/auth/user/${userId}`, config);
            const user = userResponse.data;
            if (!user.entreprise) {
                console.error("User's company (entreprise) is missing");
                setError("Entreprise de l'utilisateur non trouvée.");
                setLoading(false);
                return;
            }
            setUserEntreprise(user.entreprise);
        } catch (error) {
            console.error('Error fetching user data:', error);
            setError('Erreur lors de la récupération des données utilisateur.');
            setLoading(false);
        }
    };

    const fetchColors = async () => {
        if (!userEntreprise) return;
        try {
            const res = await axios.get(`${API_URL}/entreprise/${userEntreprise}/couleurs`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setColors(res.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des couleurs:', error);
            setError('Erreur lors de la récupération des couleurs. Veuillez réessayer.');
        }
    };

    const addColor = async () => {
        if (!userEntreprise) return;
        try {
            await axios.post(
                API_URL,
                {
                    couleur: selectedColor,
                    entreprise: userEntreprise,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            fetchColors();
        } catch (error) {
            console.error('Erreur lors de l\'ajout de la couleur:', error);
            setError('Erreur lors de l\'ajout de la couleur. Veuillez réessayer.');
        }
    };

    const updateColor = async (id, newColor) => {
        try {
            await axios.patch(
                `${API_URL}/${id}`,
                { couleur: newColor },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            fetchColors();
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la couleur:', error);
            setError('Erreur lors de la mise à jour de la couleur. Veuillez réessayer.');
        }
    };

    const deleteColor = async (id) => {
        try {
            await axios.delete(`${API_URL}/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchColors();
        } catch (error) {
            console.error('Erreur lors de la suppression de la couleur:', error);
            setError('Erreur lors de la suppression de la couleur. Veuillez réessayer.');
        }
    };

    useEffect(() => {
        fetchUserEntreprise();
    }, []);

    useEffect(() => {
        if (userEntreprise) {
            fetchColors();
            setLoading(false);
        }
    }, [userEntreprise]);

    // Add button styles
    const viewButtonStyles = (isHovered) => ({
        width: '150px',
        height: '32px',
        border: 'none',
        backgroundColor: isHovered ? '#4d4d4d' : '#282829',
        color: isHovered ? '#fff' : '#999',
        borderRadius: '6px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        marginLeft: '10px',
        padding: '5px 10px',
    });

    // Delete button styles
    const deleteButtonStyles = (isHovered) => ({
        width: '32px',
        height: '32px',
        border: 'none',
        backgroundColor: isHovered ? '#ff4d4d' : '#cc0000',
        color: '#fff',
        borderRadius: '6px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        marginRight: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    });

    if (loading) {
        return (
            <div>
                <h2>Charte Graphique</h2>
                <p>Chargement en cours...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <h2>Charte Graphique</h2>
                <p style={{ color: 'red' }}>{error}</p>
            </div>
        );
    }

    return (
        <div>
            <h4>Charte Graphique</h4>
            <div style={{ margin: '20px 0' }}>
                <label>Ajouter une couleur :</label>
                <input
                    type="color"
                    value={selectedColor}
                    onChange={e => setSelectedColor(e.target.value)}
                    style={{ marginLeft: '10px', marginRight: '10px', verticalAlign: 'middle' }}
                />
                <span>{selectedColor}</span>
                <button
                    onClick={addColor}
                    style={viewButtonStyles(isHovered)}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <FontAwesomeIcon icon={faPlus} style={{ marginRight: '5px' }} />
                    Ajouter
                </button>
            </div>
            {colors.length === 0 ? (
                <p>Aucune couleur n'a été ajoutée à votre charte graphique.</p>
            ) : (
                <div>
                    <h4>Couleurs de votre charte graphique :</h4>
                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                        {colors.map(c => (
                            <li key={c._id} style={{ display: 'flex', alignItems: 'center', margin: '10px 0' }}>
                                
                                <div style={{
                                    width: '20px',
                                    height: '20px',
                                    backgroundColor: c.couleur,
                                    marginRight: '10px',
                                    border: '1px solid #ccc'
                                }}></div>
                                <label style={{ marginRight: '10px', minWidth: '80px' }}>{c.couleur}</label>
                                <input
                                    type="color"
                                    value={c.couleur}
                                    onChange={e => updateColor(c._id, e.target.value)}
                                    style={{ marginRight: '10px' }}
                                />
                                <button
                                    onClick={() => deleteColor(c._id)}
                                    style={deleteButtonStyles(deleteHovered[c._id] || false)}
                                    onMouseEnter={() => setDeleteHovered({ ...deleteHovered, [c._id]: true })}
                                    onMouseLeave={() => setDeleteHovered({ ...deleteHovered, [c._id]: false })}
                                    title="Supprimer la couleur"
                                >
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}