import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Link } from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:5000/couleurs';

const WebsiteManagement = () => {
    // Color palette state and logic
    const [colors, setColors] = useState([]);
    const [selectedColor, setSelectedColor] = useState('#3357FF');
    const [userEntreprise, setUserEntreprise] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [token] = useState(localStorage.getItem('token'));
    const [entrepriseName, setEntrepriseName] = useState(null);
    const [isPublic, setIsPublic] = useState(null);
    const [fonts, setFonts] = useState([]);
    const [loadingFonts, setLoadingFonts] = useState(false);
    const [logo, setLogo] = useState(null);

    const location = useLocation();
const navigate = useNavigate();

useEffect(() => {
  // Récupère le token dans l'URL si présent
  const params = new URLSearchParams(location.search);
  const urlToken = params.get('token');
  if (urlToken) {
    localStorage.setItem('token', urlToken);
    // Nettoie l'URL (supprime le paramètre token)
    navigate('/WebsiteManagement', { replace: true });
  }
  // eslint-disable-next-line
}, []);


    
    useEffect(() => {
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
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
        const token = localStorage.getItem('token');
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
            // Récupérer les infos de l'entreprise pour isPublic
            const entrepriseRes = await axios.get(`http://localhost:5000/entreprises/${user.entreprise}`, config);
            setIsPublic(entrepriseRes.data.isPublic);
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

    useEffect(() => {
      if (!userEntreprise) return;
      setLoadingFonts(true);
      axios
        .post(`http://localhost:5000/chatbot/fonts/${userEntreprise}`)
        .then(res => {
          const fontList = res.data.answer
            .split('\n')
            .map(f => f.trim())
            .filter(f => f.length > 0);
          setFonts(fontList);
        })
        .catch(() => setFonts([]))
        .finally(() => setLoadingFonts(false));
    }, [userEntreprise]);

    // Add color
    const addColor = async (e) => {
        if (e) e.preventDefault();
        if (!userEntreprise) return;
        try {
            await axios.post(
                API_URL,
                { couleur: selectedColor, entreprise: userEntreprise },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setError(null);
            fetchColors();
        } catch (error) {
            setError("Erreur lors de l'ajout de la couleur. Veuillez réessayer.");
        }
    };

    // Delete color
    const deleteColor = async (id) => {
        try {
            await axios.delete(`${API_URL}/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setError(null);
            fetchColors();
        } catch (error) {
            setError('Erreur lors de la suppression de la couleur. Veuillez réessayer.');
        }
    };


    const fetchEntrepriseName = async (userEntreprise) => {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Token manquant pour récupérer le nom de l entreprise.');
          return;
        }
    
        try {
          const config = { headers: { Authorization: `Bearer ${token}` } };
          const entrepriseResponse = await axios.get(
            `http://localhost:5000/entreprises/${userEntreprise}`,
            config
          );
          setEntrepriseName(entrepriseResponse.data.nom || 'Unknown');
          if (entrepriseResponse.data.logo) {
            setLogo(entrepriseResponse.data.logo);
        }
        } catch (error) {
          console.error('Erreur lors de la récupération du nom de l entreprise:', error);
          setError('Erreur lors de la récupération du nom de l entreprise.');
        }
      };
      
      useEffect(() => {
        if (userEntreprise) {
          fetchEntrepriseName(userEntreprise);
        }
      }, [userEntreprise]);

    return (
        <div className="mb-40">
            <style jsx>{`
                .icon-circle {
                    border-radius: 50%;
                    width: 56px;
                    height: 56px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-right: 24px;
                }
                .icon-circle.workspace {
                    background: #fef3c7;
                }
                .icon-circle.website {
                    background: #e0f2fe;
                }
                .arrow-right {
                    display: flex;
                    align-items: center;
                    margin-left: 24px;
                }
                .card {
                    transition: box-shadow 0.2s, transform 0.2s, background 0.2s;
                    box-shadow: 0 2px 12px rgba(16, 30, 54, 0.08);
                }
                .card:hover, .card:focus {
                    box-shadow: 0 6px 24px rgba(16, 30, 54, 0.16);
                    transform: scale(1.03);
                    background: #f9fafb !important;
                    z-index: 2;
                }
                .color-swatch {
                    min-width: 80px;
                    min-height: 80px;
                    border-radius: 12px;
                    box-shadow: 0 2px 8px #0001;
                    padding: 8px;
                    margin-bottom: 8px;
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    transition: box-shadow 0.2s;
                }
                .color-swatch span {
                    color: #222;
                    background: #fff9;
                    border-radius: 6px;
                    padding: 2px 8px;
                    font-size: 14px;
                    margin-top: 8px;
                }
                .color-swatch .delete-btn {
                    display: none;
                    position: absolute;
                    top: 6px;
                    right: 6px;
                    border-radius: 50%;
                    width: 28px;
                    height: 28px;
                    background: #f8f9fa;
                    box-shadow: 0 2px 8px #0002;
                    border: none;
                    color: #000;
                    align-items: center;
                    justify-content: center;
                    transition: background 0.2s;
                }
                .color-swatch:hover .delete-btn {
                    display: flex;
                }
                @media (max-width: 600px) {
                    .icon-circle { margin-bottom: 12px; margin-right: 0; }
                    .arrow-right { margin-left: 0; margin-top: 12px; }
                }
            `}</style>
            
            <div className="row gy-4">
                <div className="col-xl-4">

                    {/*workspace */}
                    <a href="http://localhost:3001/workspacelayout" className="card mb-24 bg-neutral-200" target="_blank" rel="noopener noreferrer">
                        <div className="card-body p-24 d-flex align-items-center">
                            <div className="icon-circle workspace">
                                <Icon icon="ph:paint-brush-duotone" width="36" height="36" color="#f59e0b" />
                            </div>
                            <div className="flex-grow-1">
                                <div className="card-title mb-1">Workspace</div>
                                <div className="card-text">Access to the development environment</div>
                            </div>
                            <div className="arrow-right ms-auto">
                                <Icon icon="iconamoon:arrow-right-2" width="28" height="28" color="#64748b" />
                            </div>
                        </div>
                    </a>

                    {/*preview */}

                    <a
                        href={userEntreprise ? `http://localhost:3001/homepage/${userEntreprise}/${entrepriseName}` : '#'}
                        className="card mb-24 bg-neutral-200"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <div className="card-body p-24 d-flex align-items-center">
                            <div className="icon-circle website">
                                <Icon icon="qlementine-icons:preview-16" width="30" height="30" color="#014268" />
                                {/* <Icon icon="mdi:web" width="36" height="36" color="#2563eb" /> */}
                            </div>
                            <div className="flex-grow-1">
                                <div className="card-title mb-1">Website Preview</div>
                                <div className="card-text">Show the preview of the website</div>
                            </div>
                            <div className="arrow-right ms-auto">
                                <Icon icon="iconamoon:arrow-right-2" width="28" height="28" color="#64748b" />
                            </div>
                        </div>
                    </a>

                    {/*public website */}
                    <a
                        href={userEntreprise ? `http://localhost:3001/PublicWebsite/${userEntreprise}/${entrepriseName}` : '#'}
                        className="card bg-neutral-200"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <div className="card-body p-24 d-flex align-items-center">
                            <div className="icon-circle website">
                                <Icon icon="mdi:web" width="36" height="36" color="#014268" />
                            </div>
                            <div className="flex-grow-1">
                                <div className="card-title mb-1">Public Website</div>
                                <div className="card-text">Show the public website</div>
                            </div>
                            <div className="arrow-right ms-auto">
                                <Icon icon="iconamoon:arrow-right-2" width="28" height="28" color="#64748b" />
                            </div>
                        </div>
                        {entrepriseName && (
                          <div className="text-center my-3 d-flex flex-column align-items-center justify-content-center gap-2">
                            <div>
                              {isPublic === true ? (
                                <span className="badge text-sm fw-semibold rounded-pill px-20 py-9 bg-success-100 text-success-600 d-inline-flex align-items-center gap-2" style={{ minWidth: 110 }}>
                                  <i className="ri-global-line" style={{ fontSize: 18 }} /> Public
                                </span>
                              ) : isPublic === false ? (
                                <span className="badge text-sm fw-semibold rounded-pill px-20 py-9 bg-neutral-200 text-neutral-700 d-inline-flex align-items-center gap-2" style={{ minWidth: 110 }}>
                                  <i className="ri-lock-2-line" style={{ fontSize: 18 }} /> Privé
                                </span>
                              ) : null}
                              <button
                                className="btn btn-light btn-sm ms-2 d-inline-flex align-items-center gap-2"
                                style={{ borderRadius: 20, fontWeight: 600, border: '1px solid #e0e0e0' }}
                                onClick={async () => {
                                  const token = localStorage.getItem('token');
                                  if (!token) return;
                                  try {
                                    const entrepriseId = userEntreprise;
                                    const response = await axios.patch(
                                      `http://localhost:5000/entreprises/${entrepriseId}`,
                                      { isPublic: !isPublic },
                                      {
                                        headers: {
                                          'Content-Type': 'application/json',
                                          'Authorization': `Bearer ${token}`
                                        },
                                      }
                                    );
                                    setIsPublic(response.data.isPublic);
                                  } catch (error) {
                                    alert("Erreur lors de la mise à jour de la visibilité du site.");
                                  }
                                }}
                              >
                                {isPublic ? <><i className="ri-lock-2-line" /> Rendre privé</> : <><i className="ri-global-line" /> Rendre public</>}
                              </button>
                            </div>
                          </div>
                        )}
                    </a>


                </div>
                {/* Third card: Color palette management */}
                <div className="col-xl-8">
                    <div className="card radius-12 overflow-hidden h-100 mr-24">
                        <div className="card-body p-24">
                            <div style={{ display: 'flex', gap: 32 }}>
                                {/* Palette de couleur à gauche */}

                                <div style={{ flex: 1 }}>
                                {/* Logo */}
                                {userEntreprise && (
                                <div className="d-flex flex-column align-items-left mb-3">
                                    <h5 className="card-title fw-bold mb-2" style={{ fontSize: '2.2rem', color: '#1f2937' }}>Logo</h5>
                                    <img
                                    src={logo}
                                    alt="Logo de l'entreprise"
                                    style={{ maxHeight: 130, maxWidth: 220, objectFit: 'contain', background: '#fff', borderRadius: 12, padding: 8 }}
                                    />
                                </div>
                                )}
                                    {/* Primary Colors */}
                                    <h5 className="card-title fw-bold d-flex align-items-center mb-16" style={{ fontSize: '2.2rem', color: '#1f2937' }}>
                                        {/* <Icon icon="mdi:palette-outline" width="28" height="28" style={{ marginRight: 12 }} color="#6366f1" />  */}
                                        <div className="icon-circle website">
                                            <Icon icon="mdi:palette-outline" width="30" height="30" color="#014268" />
                                        </div>
                                        Primary Colors
                                    </h5>
                                    <div className="d-flex align-items-center gap-3 flex-wrap">
                                        <div className="d-flex align-items-center gap-3 flex-wrap p-20 m-24">
                                            {loading ? (
                                                <div className="text-center py-5 w-100">
                                                    <div className="spinner-border text-primary" role="status">
                                                        <span className="visually-hidden">Loading...</span>
                                                    </div>
                                                </div>
                                            ) : colors.length === 0 ? (
                                                <div className="text-muted">No colors yet.</div>
                                            ) : (
                                                colors.map(c => (
                                                    <div
                                                        key={c._id}
                                                        className="color-swatch position-relative"
                                                        style={{ background: c.couleur }}
                                                    >
                                                        <span>{c.couleur}</span>
                                                        <button
                                                            className="delete-btn"
                                                            onClick={() => deleteColor(c._id)}
                                                            title="Delete"
                                                        >
                                                            <Icon icon="ic:round-delete" style={{ color: '#000', fontSize: 18 }} />
                                                        </button>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                    {error && (
                                        <div className="alert alert-danger d-flex align-items-center mt-3" role="alert">
                                            <Icon icon="solar:danger-circle-bold" className="me-2" /> {error}
                                        </div>
                                    )}
                                </div>
                                {/* Typography à droite */}
                                <div style={{ flex: 1 }}>
                                    {/* Typography */}
                                    <h5 className="card-title fw-bold d-flex align-items-center mb-16" style={{ fontSize: '2.2rem', color: '#1f2937' }}>
                                        <div className="icon-circle website">
                                            <Icon icon="tabler:file-typography-filled" width="30" height="30" color="#014268" />
                                        </div>
                                    Typography
                                    </h5>
                                    {loadingFonts ? (
                                        <div>Chargement des polices...</div>
                                    ) : (
                                        <div style={{ marginLeft: 70 }}>
                                            {fonts.map(font => (
                                                <div key={font} style={{ fontFamily: font, fontSize: 20, marginBottom: 6 }}>
                                                    {font}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WebsiteManagement;