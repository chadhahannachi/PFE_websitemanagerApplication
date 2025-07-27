import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Icon } from '@iconify/react/dist/iconify.js';
import { jwtDecode } from 'jwt-decode';
import AiComponentPreview from '../WebSite/Components/AiComponentPreview';

const ARCHIVE_TYPES = [
  { key: 'services', label: 'Services', endpoint: 'Service' },
  { key: 'partners', label: 'Partenaires', endpoint: 'Partenaire' },
  { key: 'faqs', label: 'FAQs', endpoint: 'FAQ' },
  { key: 'events', label: 'Événements', endpoint: 'Evenement' },
  { key: 'solutions', label: 'Solutions', endpoint: 'Solution' },
  { key: 'units', label: 'Unités', endpoint: 'Unite' },
  { key: 'slides', label: 'Slides', endpoint: 'Slide' },
  { key: 'aboutus', label: 'À Propos', endpoint: 'APropos' },
  { key: 'contactus', label: 'Contact', endpoint: 'ContactUs' },
  { key: 'ai', label: 'Composants IA', endpoint: 'ContenuSpecifique' },
];

const ArchiveContent = () => {
  const [archived, setArchived] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteInfo, setDeleteInfo] = useState({ type: null, id: null });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [userEntreprise, setUserEntreprise] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [aiPreviewOpen, setAiPreviewOpen] = useState(false);
  const [aiPreviewContent, setAiPreviewContent] = useState(null);

  const token = localStorage.getItem("token");
  let userId = null;

  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      userId = decodedToken.sub;
    } catch (error) {
      setSnackbar({ open: true, message: "Erreur lors du décodage du token.", severity: "error" });
      setLoading(false);
    }
  } else {
    setSnackbar({ open: true, message: "Token manquant. Veuillez vous connecter.", severity: "error" });
    setLoading(false);
  }

  useEffect(() => {
    const fetchUserData = async () => {
      if (!token || !userId) { setLoading(false); return; }
      try {
        const response = await axios.get(`http://localhost:5000/auth/user/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
        setUserEntreprise(response.data.entreprise);
        setUserRole(response.data.role);
      } catch (error) {
        setSnackbar({ open: true, message: "Erreur lors de la récupération des données utilisateur.", severity: "error" });
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchAllArchived = async () => {
      setLoading(true);
      setError(null);
      if (!token || !userEntreprise) { setLoading(false); return; }
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const newArchived = {};
      try {
        for (const type of ARCHIVE_TYPES) {
          if (type.endpoint === 'Slide') {
            // Slides: endpoint spécifique
            const res = await axios.get(`http://localhost:5000/slides/entreprise/${userEntreprise}/archived`, config);
            newArchived[type.key] = Array.isArray(res.data) ? res.data : [];
          } else if (type.endpoint === 'APropos') {
            const res = await axios.get(`http://localhost:5000/contenus/APropos/entreprise/${userEntreprise}/archived`, config);
            newArchived[type.key] = Array.isArray(res.data) ? res.data.filter(e => e.isArchived) : [];
          } else if (type.endpoint === 'ContactUs') {
            const res = await axios.get(`http://localhost:5000/contenus/ContactUs/entreprise/${userEntreprise}/archived`, config);
            newArchived[type.key] = Array.isArray(res.data) ? res.data.filter(e => e.isArchived) : [];
          } else if (type.endpoint === 'ContenuSpecifique') {
            const res = await axios.get(`http://localhost:5000/contenus/ContenuSpecifique/entreprise/${userEntreprise}/archived`, config);
            newArchived[type.key] = Array.isArray(res.data) ? res.data.filter(e => e.isArchived) : [];
          } else if ((type.endpoint === 'Partenaire' || type.endpoint === 'Unite') && userRole !== 'superadminabshore') {
            const res = await axios.get(`http://localhost:5000/contenus/${type.endpoint}/entreprise/${userEntreprise}/archived`, config);
            newArchived[type.key] = Array.isArray(res.data) ? res.data.filter(e => e.isArchived) : [];
          } else {
            const res = await axios.get(`http://localhost:5000/contenus/${type.endpoint}/entreprise/${userEntreprise}/archived`, config);
            newArchived[type.key] = Array.isArray(res.data) ? res.data.filter(e => e.isArchived) : [];
          }
        }
        setArchived(newArchived);
      } catch (err) {
        setError('Erreur lors de la récupération des contenus archivés.');
      } finally {
        setLoading(false);
      }
    };
    fetchAllArchived();
  }, [userEntreprise, userRole]);

  useEffect(() => {
    if (snackbar.open) {
      const timer = setTimeout(() => setSnackbar(prev => ({ ...prev, open: false })), 3000);
      return () => clearTimeout(timer);
    }
  }, [snackbar.open]);

  const handleAskDelete = (type, id) => {
    setDeleteInfo({ type, id });
    setShowDeleteModal(true);
  };

  // Suppression définitive
  const handleDelete = async () => {
    if (!deleteInfo.id || !deleteInfo.type) return;
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      if (deleteInfo.type === 'slides') {
        await axios.delete(`http://localhost:5000/slides/${deleteInfo.id}`, config);
      } else {
        await axios.delete(`http://localhost:5000/contenus/${ARCHIVE_TYPES.find(t => t.key === deleteInfo.type).endpoint}/${deleteInfo.id}`, config);
      }
      setArchived(prev => ({ ...prev, [deleteInfo.type]: prev[deleteInfo.type].filter(e => e._id !== deleteInfo.id) }));
      setSnackbar({ open: true, message: 'Suppression définitive réussie.', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Erreur lors de la suppression.', severity: 'error' });
    } finally {
      setShowDeleteModal(false);
      setDeleteInfo({ type: null, id: null });
    }
  };

  // Restauration
  const handleRestore = async (type, id) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      if (type === 'slides') {
        await axios.patch(`http://localhost:5000/slides/${id}/restore`, {}, config);
      } else {
        await axios.patch(`http://localhost:5000/contenus/${ARCHIVE_TYPES.find(t => t.key === type).endpoint}/${id}/restore`, {}, config);
      }
      setArchived(prev => ({ ...prev, [type]: prev[type].filter(e => e._id !== id) }));
      setSnackbar({ open: true, message: 'Contenu restauré avec succès.', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Erreur lors de la restauration.', severity: 'error' });
    }
  };

  if (loading) return <div className="text-center p-4">Chargement des contenus archivés...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  const isEmpty = Object.values(archived).every(arr => !arr || arr.length === 0);
  if (isEmpty) {
    return (
      <div className="alert alert-info text-center my-4">Aucun contenu archivé à afficher.</div>
    );
  }

  return (
    <>
      {snackbar.open && (
        <div
          className={`alert bg-${snackbar.severity === 'success' ? 'success-100' : 'danger-100'} text-${snackbar.severity === 'success' ? 'success-600' : 'danger-600'} border-${snackbar.severity === 'success' ? 'success-600' : 'danger-600'} border-start-width-4-px border-top-0 border-end-0 border-bottom-0 px-24 py-13 mb-0 fw-semibold text-lg radius-4 d-flex align-items-center justify-content-between`}
          role="alert"
          style={{ position: 'fixed', top: 24, right: 24, zIndex: 2000, minWidth: 320, maxWidth: 400, boxShadow: '0 2px 16px rgba(0,0,0,0.08)' }}
        >
          <div className="d-flex align-items-center gap-2">
            <span className="icon text-xl" style={{ display: 'flex', alignItems: 'center' }}>
              {snackbar.severity === 'success'
                ? <i className="ri-checkbox-circle-line" />
                : <i className="ri-close-circle-line" />}
            </span>
            {snackbar.message}
          </div>
          <button
            className={`remove-button text-${snackbar.severity === 'success' ? 'success-600' : 'danger-600'} text-xxl line-height-1`}
            onClick={() => setSnackbar(prev => ({ ...prev, open: false }))}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <i className="ri-close-line" />
          </button>
        </div>
      )}
      {ARCHIVE_TYPES.map(type => (
        archived[type.key] && archived[type.key].length > 0 && (
          <div className="card mb-4" key={type.key}>
            <div className="card-header d-flex align-items-center">
              <h5 className="card-title mb-0">
                <Icon icon="mdi:archive-outline" className="me-2" />
                {type.label} archivés
              </h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table striped-table mb-0">
                  <thead>
                    <tr>
                      {type.key === 'ai' ? (
                        <>
                          <th>Titre</th>
                          <th>Description</th>
                          <th>Date</th>
                          <th>Actions</th>
                        </>
                      ) : type.key === 'slides' ? (
                        <>
                          <th>Image</th>
                          <th>Titre</th>
                          <th>Description</th>
                          <th>Date</th>
                          <th className="text-center">Actions</th>
                        </>
                      ) : type.key === 'aboutus' ? (
                        <>
                          <th>Image</th>
                          <th>Titre</th>
                          <th>Description</th>
                          <th className="text-center">Actions</th>
                        </>
                      ) : type.key === 'contactus' ? (
                        <>
                          <th>Titre</th>
                          <th>Description</th>
                          <th>Adresse</th>
                          <th>Téléphone</th>
                          <th>Email</th>
                          <th>Liens</th>
                          <th className="text-center">Actions</th>
                        </>
                      ) : (
                        <>
                          <th>Titre</th>
                          <th>Description</th>
                          <th>Date</th>
                          <th className="text-center">Actions</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {archived[type.key].map(item => (
                      <tr key={item._id}>
                        {type.key === 'ai' ? (
                          <>
                            <td>{item.titre}</td>
                            <td>{item.description}</td>
                            <td>{item.datePublication ? new Date(item.datePublication).toLocaleDateString() : '-'}</td>
                            <td className="text-center">
                              <button
                                className="w-32-px h-32-px me-8 bg-primary-light text-info-pressed rounded-circle d-inline-flex align-items-center justify-content-center"
                                title="Aperçu"
                                onClick={() => { setAiPreviewContent(item); setAiPreviewOpen(true); }}
                              >
                                <Icon icon="mdi:eye-outline" />
                              </button>
                              {/* <button
                                className="w-32-px h-32-px me-8 bg-success-focus text-success-main rounded-circle d-inline-flex align-items-center justify-content-center"
                                title="Restaurer"
                                onClick={() => handleRestore(type.key, item._id)}
                              >
                                <Icon icon="solar:refresh-outline" />
                              </button>
                              <button
                                className="w-32-px h-32-px me-8 bg-danger-focus text-danger-main rounded-circle d-inline-flex align-items-center justify-content-center"
                                title="Suppression définitive"
                                onClick={() => handleAskDelete(type.key, item._id)}
                              >
                                <Icon icon="mingcute:delete-2-line" />
                              </button> */}
                            </td>
                          </>
                        ) : type.key === 'slides' ? (
                          <>
                            <td><img src={item.image} alt="slide" style={{ maxWidth: 80, maxHeight: 60, borderRadius: 4 }} /></td>
                            <td dangerouslySetInnerHTML={{ __html: item.titre }} />
                            <td dangerouslySetInnerHTML={{ __html: item.description }} />
                            <td>{item.datePublication ? new Date(item.datePublication).toLocaleDateString() : '-'}</td>
                          </>
                        ) : type.key === 'aboutus' ? (
                          <>
                            <td><img src={item.image || 'https://via.placeholder.com/80'} alt="about" style={{ maxWidth: 80, maxHeight: 60, borderRadius: 4 }} /></td>
                            <td dangerouslySetInnerHTML={{ __html: item.titre }} />
                            <td dangerouslySetInnerHTML={{ __html: item.description }} />
                          </>
                        ) : type.key === 'contactus' ? (
                          <>
                            <td dangerouslySetInnerHTML={{ __html: item.titre }} />
                            <td dangerouslySetInnerHTML={{ __html: item.description }} />
                            <td>{item.adresse}</td>
                            <td>{item.phone}</td>
                            <td>{item.email}</td>
                            <td>
                              {item.links && Object.keys(item.links).length > 0 ? (
                                <ul style={{ marginBottom: 0 }}>
                                  {Object.entries(item.links).map(([key, value]) => (
                                    <li key={key}>{key}: {value}</li>
                                  ))}
                                </ul>
                              ) : '-'}
                            </td>
                          </>
                        ) : (
                          <>
                            <td dangerouslySetInnerHTML={{ __html: item.titre }} />
                            <td dangerouslySetInnerHTML={{ __html: item.description }} />
                            <td>{item.datePublication ? new Date(item.datePublication).toLocaleDateString() : '-'}</td>
                          </>
                        )}
                        <td className="text-center">
                          <button
                            className="w-32-px h-32-px me-8 bg-success-focus text-success-main rounded-circle d-inline-flex align-items-center justify-content-center"
                            title="Restaurer"
                            onClick={() => handleRestore(type.key, item._id)}
                          >
                            <Icon icon="solar:refresh-outline" />
                          </button>
                          <button
                            className="w-32-px h-32-px me-8 bg-danger-focus text-danger-main rounded-circle d-inline-flex align-items-center justify-content-center"
                            title="Suppression définitive"
                            onClick={() => handleAskDelete(type.key, item._id)}
                          >
                            <Icon icon="mingcute:delete-2-line" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )
      ))}
      {/* Modal de confirmation de suppression définitive */}
      {showDeleteModal && (
        <>
          <div className="modal-backdrop fade show" style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',zIndex:1000,background:'rgba(0,0,0,0.3)'}}></div>
          <div className="modal fade show" style={{display:'block',zIndex:1100}} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h6 className="modal-title fw-semibold">Suppression définitive</h6>
                  <button type="button" className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
                </div>
                <div className="modal-body">
                  Êtes-vous sûr de vouloir supprimer définitivement ce contenu ? Cette action est irréversible.
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>Annuler</button>
                  <button type="button" className="btn btn-danger" onClick={handleDelete}>Supprimer</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {aiPreviewOpen && aiPreviewContent && (
        <>
          <div
            className="modal-backdrop fade show"
            style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',zIndex:2000,background:'rgba(0,0,0,0.3)'}}
            onClick={() => setAiPreviewOpen(false)}
          ></div>
          <div className="modal fade show" style={{display:'block',zIndex:2100}} tabIndex="-1">
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content" style={{ border: 'none', boxShadow: '0 2px 16px rgba(0,0,0,0.12)' }}>
                <div className="modal-header" style={{ border: 'none', boxShadow: 'none' }}>
                  <h6 className="modal-title fw-semibold">Aperçu du composant IA</h6>
                  <button type="button" className="btn-close" onClick={() => setAiPreviewOpen(false)}></button>
                </div>
                <div className="modal-body" style={{ border: 'none', boxShadow: 'none' }}>
                  <AiComponentPreview content={aiPreviewContent} />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ArchiveContent; 