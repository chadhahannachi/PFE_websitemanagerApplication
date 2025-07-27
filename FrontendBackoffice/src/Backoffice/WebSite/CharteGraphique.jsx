import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { Icon } from '@iconify/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = 'http://localhost:5000/couleurs';

export default function CharteGraphique() {
    const [colors, setColors] = useState([]);
    const [selectedColor, setSelectedColor] = useState('#3357FF');
    const [userEntreprise, setUserEntreprise] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [isHovered, setIsHovered] = useState(false);
    const [deleteHovered, setDeleteHovered] = useState({});
    const [editColorId, setEditColorId] = useState(null);
    const [editColorValue, setEditColorValue] = useState('');
    const [savingEdit, setSavingEdit] = useState(false);

    // Auth
    const token = localStorage.getItem('token');
    let userId = null;
    useEffect(() => {
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                userId = decodedToken?.sub;
                fetchUserEntreprise(decodedToken?.sub);
            } catch (error) {
                setError('Erreur lors du décodage du token.');
                setLoading(false);
            }
        } else {
            setError('Token manquant. Veuillez vous connecter.');
            setLoading(false);
        }
        // eslint-disable-next-line
    }, []);

    const fetchUserEntreprise = async (userId) => {
        if (!token || !userId) {
            setError('Token ou ID utilisateur manquant.');
            setLoading(false);
            return;
        }
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const userResponse = await axios.get(`http://localhost:5000/auth/user/${userId}`, config);
            const user = userResponse.data;
            if (!user.entreprise) {
                setError("Entreprise de l'utilisateur non trouvée.");
                setLoading(false);
                return;
            }
            setUserEntreprise(user.entreprise);
        } catch (error) {
            setError('Erreur lors de la récupération des données utilisateur.');
            setLoading(false);
        }
    };

    const fetchColors = async () => {
        if (!userEntreprise) return;
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/entreprise/${userEntreprise}/couleurs`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setColors(res.data);
            setLoading(false);
        } catch (error) {
            setError('Erreur lors de la récupération des couleurs. Veuillez réessayer.');
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userEntreprise) {
            fetchColors();
        }
        // eslint-disable-next-line
    }, [userEntreprise]);

    // Add color
    const addColor = async () => {
        if (!userEntreprise) return;
        try {
            await axios.post(
                API_URL,
                { couleur: selectedColor, entreprise: userEntreprise },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success('Couleur ajoutée !', { position: 'top-right' });
            setError(null);
            fetchColors();
        } catch (error) {
            setError("Erreur lors de l'ajout de la couleur. Veuillez réessayer.");
        }
    };

    // Edit color
    const startEdit = (id, value) => {
        setEditColorId(id);
        setEditColorValue(value);
    };
    const cancelEdit = () => {
        setEditColorId(null);
        setEditColorValue('');
    };
    const saveEdit = async (id) => {
        setSavingEdit(true);
        try {
            await axios.patch(
                `${API_URL}/${id}`,
                { couleur: editColorValue },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success('Couleur modifiée !', { position: 'top-right' });
            setError(null);
            setEditColorId(null);
            setEditColorValue('');
            fetchColors();
        } catch (error) {
            setError("Erreur lors de la mise à jour de la couleur. Veuillez réessayer.");
        }
        setSavingEdit(false);
    };

    // Delete color
    const deleteColor = async (id) => {
        try {
            await axios.delete(`${API_URL}/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success('Couleur supprimée !', { position: 'top-right' });
            setError(null);
            fetchColors();
        } catch (error) {
            setError('Erreur lors de la suppression de la couleur. Veuillez réessayer.');
        }
    };

    // UI
    return (
        <div className="card w-100 " style={{maxWidth: '100vw'}}>
        <div className="card-header d-flex flex-wrap align-items-center justify-content-between gap-3">
            <div className="d-flex flex-wrap align-items-center">
                <div className="d-flex align-items-center gap-2">
                    <div >
                        <div className="card-header d-flex align-items-center justify-content-between" >
                            <h5 className="mb-0 fw-semibold">
                                <Icon icon='mdi:palette-outline' className="me-2" /> Color Palette
                            </h5>
                        </div>
                        <div className="card-body">
                            {/* Feedback */}
                            {error && (
                                <div className="alert alert-danger d-flex align-items-center" role="alert">
                                    <Icon icon="solar:danger-circle-bold" className="me-2" /> {error}
                                </div>
                            )}
                            {success && (
                                <div className="alert alert-success d-flex align-items-center" role="alert">
                                    <Icon icon="solar:check-circle-bold" className="me-2" /> {success}
                                    <button className="btn btn-sm btn-link ms-auto" onClick={() => setSuccess(null)}>
                                        <Icon icon="solar:close-circle-outline" />
                                    </button>
                                </div>
                            )}
                            {/* Loader */}
                            {loading ? (
                                <div className="text-center py-5">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Chargement...</span>
                                    </div>
                                    <p className="mt-2">Chargement des couleurs...</p>
                                </div>
                            ) : (
                                <>
                                    {/* Add color */}

                                  
                                    <div className="d-flex align-items-center gap-4 justify-content-space-between">
                                        <div className="d-flex align-items-center gap-3" style={{background:'#f8f9fa', borderRadius:12, padding:'10px 18px', boxShadow:'0 2px 8px #0001', width:400}}>
                                            <input
                                                type="color"
                                                value={selectedColor}
                                                onChange={e => setSelectedColor(e.target.value)}
                                                className="form-control form-control-color"
                                                title="Choisir une couleur"
                                                style={{ width: '100%', height: 30, border: '2px solid #e0e0e0', borderRadius: 12, background: '#fff', boxShadow: '0 1px 4px #0001', cursor: 'pointer' }}
                                            />
                                            <span  style={{fontSize:18, letterSpacing:1}}>{selectedColor}</span>
                                        </div>
                                        <button
                                            className="btn btn-secondary-200 d-flex align-items-center justify-content-center add-color-btn"
                                            style={{background:'#f8f9fa', borderRadius: 12, width: 48, height: 48, fontSize: 24, boxShadow:'0 2px 8px #0002', padding: 0, transition: 'background 0.2s'}}
                                            onClick={addColor}
                                            onMouseEnter={() => setIsHovered(true)}
                                            onMouseLeave={() => setIsHovered(false)}
                                            title="Ajouter la couleur"
                                        >
                                            <Icon icon="typcn:plus"  style={{color:'#000'}} />
                                            
                                        </button>
                                    </div>


                                    {/* List colors */}
                                    {colors.length === 0 ? (
                                        <div className="alert alert-info">Aucune couleur n'a été ajoutée à votre charte graphique.</div>
                                    ) : (
                                        <div className="d-flex flex-wrap gap-4 justify-content-center align-items-end" style={{marginTop: 32}}>
                                            {colors.map(c => (
                                                <div key={c._id} className="d-flex flex-column align-items-center" style={{minWidth: 120}}>
                                                    <div
                                                        className="d-flex align-items-center justify-content-center position-relative"
                                                        style={{ width: 90, height: 90, borderRadius: 12, background: c.couleur, boxShadow: '0 2px 8px #0001', marginBottom: 8 }}
                                                    >
                                                        <button
                                                            className="btn d-flex align-items-center justify-content-center position-absolute top-50 start-50 translate-middle delete-color-btn"
                                                            style={{ background: '#f8f9fa', borderRadius: '50%', width: 40, height: 40, fontSize: 22, boxShadow:'0 2px 8px #0002', border: 'none', color: '#000', transition: 'background 0.2s' }}
                                                            title="Supprimer"
                                                            onClick={() => deleteColor(c._id)}
                                                        >
                                                            <Icon icon="ic:round-delete" style={{color:'#000'}}/>
                                                        </button>
                                                    </div>
                                                    <div className="fw-semibold mb-2" style={{fontSize: 16}}>{c.couleur}</div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <ToastContainer position="top-right" />
        <style>{`
    .add-color-btn:hover {
      background: #d1d1d1 !important;
    }
    .delete-color-btn:hover {
      background: #d1d1d1 !important;
      color: #000 !important;
    }
    .delete-color-btn:hover svg {
      color: #000 !important;
    }
    `}</style>
        </div>
    );
} 
