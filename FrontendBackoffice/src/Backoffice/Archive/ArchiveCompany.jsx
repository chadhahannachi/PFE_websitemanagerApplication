import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Icon } from '@iconify/react/dist/iconify.js';

const ArchiveCompany = () => {
  const [entreprises, setEntreprises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const fetchArchivedEntreprises = async () => {
    try {
      const response = await axios.get("http://localhost:5000/entreprises/archived");
      setEntreprises(response.data);
      setLoading(false);
    } catch (error) {
      setError("Erreur lors de la récupération des entreprises archivées");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArchivedEntreprises();
  }, []);

  // Fonction pour ouvrir la modale de confirmation
  const handleAskDelete = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  // Suppression définitive
  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await axios.delete(`http://localhost:5000/entreprises/${deleteId}`);
      setEntreprises(prev => prev.filter(e => e._id !== deleteId));
    } catch (error) {
      alert("Erreur lors de la suppression définitive de l'entreprise.");
    } finally {
      setShowDeleteModal(false);
      setDeleteId(null);
    }
  };

  // Fonction de restauration
  const handleRestore = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/entreprises/${id}/restore`);
      setEntreprises(prev => prev.filter(e => e._id !== id));
    } catch (error) {
      alert("Erreur lors de la restauration de l'entreprise.");
    }
  };

  if (loading) {
    return <div className="text-center p-4">Chargement des entreprises archivées...</div>;
  }
  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="row">
      <div className="col-12">
        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="card-title mb-0">
              <Icon icon="mdi:archive-outline" className="me-2" />
              Entreprises Archivées
            </h5>
            <button className="btn btn-outline-primary btn-sm" onClick={fetchArchivedEntreprises}>
              <Icon icon="solar:refresh-outline" className="me-1" />
              Actualiser
            </button>
          </div>
          <div className="card-body">
            {entreprises.length === 0 ? (
              <div className="text-center py-4">
                <Icon icon="solar:buildings-outline" className="text-muted" style={{ fontSize: '3rem' }} />
                <p className="text-muted mt-2">Aucune entreprise archivée</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table striped-table mb-0">
                  <thead>
                    <tr>
                      <th>Entreprise</th>
                      <th>Contact</th>
                      <th>Téléphone</th>
                      <th>Adresse</th>
                      <th>Raison Sociale</th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entreprises.map((e) => (
                      <tr key={e._id}>
                        <td>{e.nom}</td>
                        <td>{e.contact}</td>
                        <td>{e.numTel}</td>
                        <td>{e.adresse}</td>
                        <td>{e.raisonSociale}</td>
                        <td className="text-center">
                          <button
                            className="w-32-px h-32-px me-8 bg-success-focus text-success-main rounded-circle d-inline-flex align-items-center justify-content-center"
                            title="Restaurer"
                            onClick={() => handleRestore(e._id)}
                          >
                            <Icon icon="solar:refresh-outline" />
                          </button>
                          <button
                            className="w-32-px h-32-px me-8 bg-danger-focus text-danger-main rounded-circle d-inline-flex align-items-center justify-content-center"
                            title="Suppression définitive"
                            onClick={() => handleAskDelete(e._id)}
                          >
                            <Icon icon="mingcute:delete-2-line" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
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
                    Êtes-vous sûr de vouloir supprimer définitivement cette entreprise ? Cette action est irréversible.
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
      </div>
    </div>
  );
};

export default ArchiveCompany;