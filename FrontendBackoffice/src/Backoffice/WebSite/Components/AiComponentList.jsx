import React, { useEffect, useState } from "react";
import { Icon } from '@iconify/react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import AiComponentPreview from './AiComponentPreview';

const AiComponentList = () => {
  const [contenus, setContenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userEntreprise, setUserEntreprise] = useState(null);
  const [search, setSearch] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [archiveId, setArchiveId] = useState(null);
  const [openAccordion, setOpenAccordion] = useState(null);
  const [editState, setEditState] = useState({ id: null, type: null }); 
  const [editValue, setEditValue] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewContent, setPreviewContent] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

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
  }

  useEffect(() => {
    const fetchUserData = async () => {
      if (!token || !userId) { setLoading(false); return; }
      try {
        const response = await axios.get(`http://localhost:5000/auth/user/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
        setUserEntreprise(response.data.entreprise);
      } catch (error) {
        setSnackbar({ open: true, message: "Erreur lors de la récupération des données utilisateur.", severity: "error" });
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchContenus = async () => {
      if (!token || !userEntreprise) { setLoading(false); return; }
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(`http://localhost:5000/contenus/ContenuSpecifique/entreprise/${userEntreprise}`, config);
        setContenus(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        setSnackbar({ open: true, message: "Erreur lors de la récupération des contenus IA.", severity: "error" });
      } finally {
        setLoading(false);
      }
    };
    if (userEntreprise) fetchContenus();
  }, [userEntreprise]);

  useEffect(() => {
    if (snackbar.open) {
      const timer = setTimeout(() => {
        setSnackbar(prev => ({ ...prev, open: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [snackbar.open]);

  const handleArchive = async () => {
    if (!archiveId) return;
    try {
      await axios.patch(`http://localhost:5000/contenus/ContenuSpecifique/${archiveId}/archive`, {}, { headers: { Authorization: `Bearer ${token}` } });
      setContenus(prev => prev.filter(e => e._id !== archiveId));
      setSnackbar({ open: true, message: "Contenu archivé avec succès !", severity: "success" });
    } catch (error) {
      setSnackbar({ open: true, message: "Erreur lors de l'archivage du contenu.", severity: "error" });
    } finally {
      setShowArchiveModal(false);
      setArchiveId(null);
    }
  };

  // Ajoute la fonction de sauvegarde
  const handleSaveEdit = async (contenu) => {
    try {
      const update = editState.type === 'html'
        ? { html_component: editValue }
        : { css_style: editValue };
      await axios.patch(
        `http://localhost:5000/contenus/ContenuSpecifique/${contenu._id}/update-ai`,
        update,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSnackbar({ open: true, message: 'Modification enregistrée !', severity: 'success' });
      // Mets à jour localement
      setContenus(prev => prev.map(c =>
        c._id === contenu._id ? { ...c, ...update } : c
      ));
      setEditState({ id: null, type: null });
      setEditValue('');
    } catch (error) {
      setSnackbar({ open: true, message: 'Erreur lors de la sauvegarde.', severity: 'error' });
    }
  };

  function truncateText(text, maxLength = 40) {
    if (!text) return '';
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  }

  if (loading) return <span>Loading...</span>;

  const filteredContenus = Array.isArray(contenus)
    ? contenus
        .filter(c => c.isArchived !== true)
        .filter(c =>
          (c.titre || '').toLowerCase().includes(search.toLowerCase()) ||
          (c.description || '').toLowerCase().includes(search.toLowerCase())
        )
    : [];

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentContenus = filteredContenus.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredContenus.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

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
      <div className="card">
        <div className="card-header d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div className="d-flex flex-wrap align-items-center gap-3">
            <div className="icon-field">
              <input
                type="text"
                className="form-control form-control-sm w-auto"
                placeholder="Search"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <span className="icon">
                <Icon icon="ion:search-outline" />
              </span>
            </div>
          </div>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table bordered-table mb-0">
              <thead>
                <tr>
                  <th scope="col">Titre</th>
                  <th scope="col">Description</th>
                  <th scope="col">Date de publication</th>
                  {/* <th scope="col">Statut</th> */}
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentContenus.map((contenu) => (
                  <React.Fragment key={contenu._id}>
                    <tr
                      style={{ cursor: 'pointer' }}
                      onClick={() => setOpenAccordion(openAccordion === contenu._id ? null : contenu._id)}
                    >
                      <td>{truncateText(contenu.titre)}</td>
                      <td>{truncateText(contenu.description)}</td>
                      <td>{contenu.datePublication ? new Date(contenu.datePublication).toLocaleDateString() : '-'}</td>
                      {/* <td>
                        {contenu.isPublished ? (
                          <span className="badge bg-success-100 text-success-700">Publié</span>
                        ) : (
                          <span className="badge bg-warning-100 text-warning-700">Brouillon</span>
                        )}
                      </td> */}
                      <td>
                        <button
                          type="button"
                          onClick={e => { e.stopPropagation(); setArchiveId(contenu._id); setShowArchiveModal(true); }}
                          className="w-32-px h-32-px me-8 bg-primary-light text-info-pressed rounded-circle d-inline-flex align-items-center justify-content-center"
                          title="Archiver"
                        >
                          <Icon icon="mdi:archive-outline" />
                        </button>
                        <button
                          type="button"
                          onClick={e => {
                            e.stopPropagation();
                            setPreviewContent(contenu);
                            setPreviewOpen(true);
                          }}
                          className="w-32-px h-32-px me-8 bg-primary-light text-info-pressed rounded-circle d-inline-flex align-items-center justify-content-center"
                          title="Aperçu"
                        >
                          <Icon icon="mdi:eye-outline" />
                        </button>
                      </td>
                    </tr>
                    {openAccordion === contenu._id && (
                      <tr>
                        <td colSpan={5} style={{ background: '#f5f6fa', padding: 1 }}>
                          <div style={{
                            display: 'flex',
                            gap: 32,
                            justifyContent: 'center',
                            alignItems: 'flex-start',
                            flexWrap: 'wrap'
                          }}>
                            <div style={{
                              background: '#fff',
                              borderRadius: 10,
                              boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
                              padding: 20,
                              width: '100%',
                              minWidth: 300,
                              maxWidth: 600,
                              height: 300,
                              display: 'flex',
                              flexDirection: 'column',
                              marginBottom: 16
                            }}>
                              <strong style={{ marginBottom: 8 }}>HTML généré :</strong>
                              {editState.id === contenu._id && editState.type === 'html' ? (
                                <>
                                  <textarea
                                    value={editValue}
                                    onChange={e => setEditValue(e.target.value)}
                                    style={{
                                      flex: 1,
                                      width: '100%',
                                      height: '100%',
                                      borderRadius: 8,
                                      padding: 10,
                                      border: '1px solid #ccc',
                                      fontFamily: 'monospace',
                                      fontSize: 14,
                                      background: '#f8f9fa',
                                      marginBottom: 8,
                                      overflow: 'auto',
                                      resize: 'none'
                                    }}
                                    autoFocus
                                  />
                                  <button
                                    className="btn btn-success btn-sm align-self-end"
                                    onClick={() => handleSaveEdit(contenu)}
                                    style={{ marginTop: 4 }}
                                  >
                                    Save
                                  </button>
                                </>
                              ) : (
                                <pre
                                  style={{
                                    whiteSpace: 'pre-wrap',
                                    wordBreak: 'break-all',
                                    background: '#f8f9fa',
                                    borderRadius: 8,
                                    padding: 10,
                                    flex: 1,
                                    overflow: 'auto',
                                    maxHeight: 300,
                                    cursor: 'pointer'
                                  }}
                                  title="Cliquer pour éditer"
                                  onClick={() => {
                                    setEditState({ id: contenu._id, type: 'html' });
                                    setEditValue(contenu.html_component || '');
                                  }}
                                >
                                  {contenu.html_component}
                                </pre>
                              )}
                            </div>
                            <div style={{
                              background: '#fff',
                              borderRadius: 10,
                              boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
                              padding: 20,
                              width: '100%',
                              minWidth: 300,
                              maxWidth: 600,
                              height: 300,
                              display: 'flex',
                              flexDirection: 'column',
                              marginBottom: 16
                            }}>
                              <strong style={{ marginBottom: 8 }}>CSS :</strong>
                              {editState.id === contenu._id && editState.type === 'css' ? (
                                <>
                                  <textarea
                                    value={editValue}
                                    onChange={e => setEditValue(e.target.value)}
                                    style={{
                                      flex: 1,
                                      width: '100%',
                                      height: '100%',
                                      borderRadius: 8,
                                      padding: 10,
                                      border: '1px solid #ccc',
                                      fontFamily: 'monospace',
                                      fontSize: 14,
                                      background: '#f8f9fa',
                                      marginBottom: 8,
                                      overflow: 'auto',
                                      resize: 'none'
                                    }}
                                    autoFocus
                                  />
                                  <button
                                    className="btn btn-success btn-sm align-self-end"
                                    onClick={() => handleSaveEdit(contenu)}
                                    style={{ marginTop: 4 }}
                                  >
                                    Save
                                  </button>
                                </>
                              ) : (
                                <pre
                                  style={{
                                    whiteSpace: 'pre-wrap',
                                    wordBreak: 'break-all',
                                    background: '#f8f9fa',
                                    borderRadius: 8,
                                    padding: 10,
                                    flex: 1,
                                    overflow: 'auto',
                                    maxHeight: 300,
                                    cursor: 'pointer'
                                  }}
                                  title="Cliquer pour éditer"
                                  onClick={() => {
                                    setEditState({ id: contenu._id, type: 'css' });
                                    setEditValue(contenu.css_style || '');
                                  }}
                                >
                                  {contenu.css_style}
                                </pre>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mt-24">
            <span>Affichage de {filteredContenus.length === 0 ? 0 : indexOfFirstItem + 1} à {Math.min(indexOfLastItem, filteredContenus.length)} sur {filteredContenus.length} composant(s)</span>
          </div>
          {totalPages > 1 && (
            <div className="d-flex justify-content-between align-items-center mt-4">
              <div className="text-muted">
                <small>
                  Affichage de {indexOfFirstItem + 1} à {Math.min(indexOfLastItem, filteredContenus.length)} sur {filteredContenus.length} composant(s)
                </small>
              </div>
              <nav aria-label="Pagination des composants IA">
                <ul className="pagination d-flex flex-wrap align-items-center gap-2 justify-content-center mb-0">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button
                      className="page-link bg-neutral-100 text-neutral-500 fw-medium rounded-circle border-0 py-10 d-flex align-items-center justify-content-center h-48-px w-48-px"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <Icon icon="iconamoon:arrow-left-2-light" className="text-xxl" />
                    </button>
                  </li>
                  {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                    <li key={page} className="page-item">
                      <button
                        className={`page-link bg-neutral-100 text-neutral-500 fw-medium rounded-circle border-0 py-10 d-flex align-items-center justify-content-center h-48-px w-48-px ${currentPage === page ? 'bg-neutral-400 text-neutral-400' : ''}`}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </button>
                    </li>
                  ))}
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button
                      className="page-link bg-neutral-100 text-neutral-500 fw-medium rounded-circle border-0 py-10 d-flex align-items-center justify-content-center h-48-px w-48-px"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      <Icon icon="iconamoon:arrow-right-2-light" className="text-xxl" />
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </div>
      </div>
      {/* Modal de confirmation d'archivage */}
      {showArchiveModal && (
        <>
          <div className="modal-backdrop fade show" style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',zIndex:1000,background:'rgba(0,0,0,0.3)'}}></div>
          <div className="modal fade show" style={{display:'block',zIndex:1100}} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content" style={{ border: 'none', boxShadow: '0 2px 16px rgba(0,0,0,0.12)' }}>
                <div className="modal-header" style={{ border: 'none', boxShadow: 'none' }}>
                  <h6 className="modal-title fw-semibold">Archivage du contenu IA</h6>
                  <button type="button" className="btn-close" onClick={() => setShowArchiveModal(false)}></button>
                </div>
                <div className="modal-body" style={{ border: 'none', boxShadow: 'none' }}>
                  Êtes-vous sûr de vouloir archiver ce contenu IA ?
                </div>
                <div className="modal-footer" style={{ border: 'none', boxShadow: 'none' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowArchiveModal(false)}>Annuler</button>
                  <button type="button" className="btn btn-warning" onClick={handleArchive}>Archiver</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {previewOpen && previewContent && (
        <>
          <div
            className="modal-backdrop fade show"
            style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',zIndex:2000,background:'rgba(0,0,0,0.3)'}}
            onClick={() => setPreviewOpen(false)}
          ></div>
          <div className="modal fade show" style={{display:'block',zIndex:2100}} tabIndex="-1">
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content" style={{ border: 'none', boxShadow: '0 2px 16px rgba(0,0,0,0.12)' }}>
                <div className="modal-header" style={{ border: 'none', boxShadow: 'none' }}>
                  <h6 className="modal-title fw-semibold">Aperçu du composant IA</h6>
                  <button type="button" className="btn-close" onClick={() => setPreviewOpen(false)}></button>
                </div>
                <div className="modal-body" style={{ border: 'none', boxShadow: 'none' }}>
                  <AiComponentPreview content={previewContent} />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default AiComponentList;
