import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Icon } from '@iconify/react/dist/iconify.js';
import { Link, useNavigate } from 'react-router-dom';

const CompanyList = () => {
  const [entreprises, setEntreprises] = useState([]);
  const [licenceStatuses, setLicenceStatuses] = useState({}); // { [idRequestLicence]: status }
  const [superAdminCounts, setSuperAdminCounts] = useState({}); // { [entrepriseId]: count }
  const [licenceStatusByCompany, setLicenceStatusByCompany] = useState({}); // { [entrepriseId]: status|null }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  const navigate = useNavigate();

  const fetchEntreprises = async () => {
    try {
      const response = await axios.get("http://localhost:5000/entreprises");
      const mappedData = response.data.map((entreprise) => ({
        id: entreprise._id,
        nom: entreprise.nom,
        contact: entreprise.contact,
        numTel: entreprise.numTel,
        adresse: entreprise.adresse,
        raisonSociale: entreprise.raisonSociale,
        idRequestLicence: entreprise.idRequestLicence || ""
      }));
      setEntreprises(mappedData);
      setLoading(false);

      // Récupérer le status de chaque licence request associée
      const token = localStorage.getItem("token");
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const statusObj = {};
      const superAdminObj = {};
      const licenceStatusObj = {};
      await Promise.all(
        mappedData.map(async (entreprise) => {
          if (entreprise.idRequestLicence) {
            try {
              const res = await axios.get(`http://localhost:5000/licence-requests/${entreprise.idRequestLicence}`, config);
              statusObj[entreprise.idRequestLicence] = res.data.status;
            } catch (e) {
              statusObj[entreprise.idRequestLicence] = undefined;
            }
          }
          // Récupérer les superadmins pour chaque entreprise
          try {
            const res = await axios.get(`http://localhost:5000/auth/entreprise/${entreprise.id}/users`, config);
            const superAdmins = res.data.filter(user => user.role === 'superadminabshore' || user.role === 'superadminentreprise');
            superAdminObj[entreprise.id] = superAdmins.length;
          } catch (e) {
            superAdminObj[entreprise.id] = 0;
          }
          // Récupérer la licence pour chaque entreprise
          try {
            const res = await axios.get(`http://localhost:5000/licences/mongo/${entreprise.id}`, config);
            licenceStatusObj[entreprise.id] = res.data?.status || null;
          } catch (e) {
            licenceStatusObj[entreprise.id] = null;
          }
        })
      );
      setLicenceStatuses(statusObj);
      setSuperAdminCounts(superAdminObj);
      setLicenceStatusByCompany(licenceStatusObj);
    } catch (error) {
      console.error("Error fetching entreprises:", error);
      setError("Erreur lors de la récupération des entreprises");
      setLoading(false);
    }
  };

  // Fonction pour ouvrir la modale de confirmation
  const handleAskDelete = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  // Fonction de suppression après confirmation (archivage logique)
  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await axios.patch(`http://localhost:5000/entreprises/${deleteId}/archive`);
      setEntreprises(prev => prev.filter(e => e.id !== deleteId));
    } catch (error) {
      alert("Erreur lors de l'archivage de l'entreprise.");
    } finally {
      setShowDeleteModal(false);
      setDeleteId(null);
    }
  };

  useEffect(() => {
    fetchEntreprises();
  }, []);

  // Calculer les entreprises à afficher pour la page courante
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // Juste avant le calcul de currentEntreprises, trie les entreprises :
  const entreprisesPaidNoSuperAdmin = entreprises.filter(e =>
    (licenceStatusByCompany[e.id] === 'paid') && (superAdminCounts[e.id] === 0)
  );
  const autresEntreprises = entreprises.filter(e =>
    !(licenceStatusByCompany[e.id] === 'paid' && superAdminCounts[e.id] === 0)
  );
  const sortedEntreprises = [...entreprisesPaidNoSuperAdmin, ...autresEntreprises];
  const currentEntreprises = sortedEntreprises.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(entreprises.length / itemsPerPage);

  // Fonction pour changer de page
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
    return (
      <div className="text-center p-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
        <p className="mt-2">Chargement des entreprises...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        <Icon icon="solar:danger-circle-bold" className="me-2" />
        {error}
      </div>
    );
  }

  return (
    <div className="row">
      <div className="col-12">
        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="card-title mb-0">
              <Icon icon="mdi:office-building-outline" className="me-2" />
              Liste des Entreprises
            </h5>
            <div className="d-flex gap-2">
              {/* <button 
                className="btn btn-outline-primary btn-sm"
                onClick={fetchEntreprises}
              >
                <Icon icon="solar:refresh-outline" className="me-1" />
                Actualiser
              </button> */}
              <Link to={`/AddCompany`}>
                <button className="btn rounded-pill btn-outline-primary-600 radius-8 px-20 py-11">
                  <Icon icon="solar:add-circle-outline" className="me-1" />
                  Add New Company
                </button>
              </Link>
            </div>
          </div>
          <div className="card-body">
            {entreprises.length === 0 ? (
              <div className="text-center py-4">
                <Icon icon="solar:buildings-outline" className="text-muted" style={{ fontSize: '3rem' }} />
                <p className="text-muted mt-2">Aucune entreprise trouvée</p>
              </div>
            ) : (
              <>
                <div className="table-responsive">
                  <table className="table striped-table mb-0">
                    <thead>
                      <tr>
                        <th scope="col">Company</th>
                        <th scope="col">Contact</th>
                        <th scope="col">Phone</th>
                        <th scope="col">Adress</th>
                        <th scope="col">Raison Sociale</th>
                        <th scope="col">Licence Request</th>
                        <th scope="col">Super Admin</th>
                        <th scope="col">Licence</th>
                        <th scope="col" className="text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentEntreprises.map((entreprise) => {
                        const status = entreprise.idRequestLicence ? licenceStatuses[entreprise.idRequestLicence] : undefined;
                        const superAdminCount = superAdminCounts[entreprise.id] || 0;
                        const licenceStatus = licenceStatusByCompany[entreprise.id] || null;
                        return (
                          <tr key={entreprise.id}>
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="avatar-sm me-3">
                                  <div className="avatar-title bg-primary-50 text-primary rounded-circle">
                                    <Icon icon="solar:building-outline" />
                                  </div>
                                </div>
                                <div className="flex-grow-1">
                                  <h6 className="text-md mb-0 fw-normal">{entreprise.nom}</h6>
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className="text-primary fw-medium">
                                {entreprise.contact || 'Non renseigné'}
                              </span>
                            </td>
                            <td>
                              <div className="d-flex align-items-center">
                                <Icon icon="solar:phone-outline" className="text-muted me-1" />
                                {entreprise.numTel || 'Non renseigné'}
                              </div>
                            </td>
                            <td>
                              <div className="d-flex align-items-center">
                                <Icon icon="solar:map-point-outline" className="text-muted me-1" />
                                <span className="text-truncate" style={{ maxWidth: '200px' }}>
                                  {entreprise.adresse || 'Non renseigné'}
                                </span>
                              </div>
                            </td>
                            <td>
                              <span className="badge bg-light text-dark">
                                {entreprise.raisonSociale || 'Non renseigné'}
                              </span>
                            </td>
                            <td>
                              {status === 'pending' && (
                                <span className="bg-warning-focus text-warning-main px-32 py-4 rounded-pill fw-medium text-sm">
                                  <Icon icon="solar:clock-circle-outline" className="me-1" />
                                  pending
                                </span>
                              )}
                              {status === 'validated' && (
                                <span className="bg-success-focus text-success-main px-32 py-4 rounded-pill fw-medium text-sm">
                                  <Icon icon="solar:check-circle-outline" className="me-1" />
                                  validated
                                </span>
                              )}
                              {status === 'rejected' && (
                                <span className="bg-danger-focus text-danger-main px-32 py-4 rounded-pill fw-medium text-sm">
                                  <Icon icon="solar:close-circle-outline" className="me-1" />
                                  rejected
                                </span>
                              )}
                              {!status && (
                                <span className="bg-warning-focus text-warning-main px-32 py-4 rounded-pill fw-medium text-sm">
                                  <Icon icon="solar:clock-circle-outline" className="me-1" />
                                  En attente
                                </span>
                              )}
                            </td>
                            <td>
                              {superAdminCount > 0 ? (
                                <span className="bg-primary-light text-info-pressed px-24 py-4 rounded-pill fw-medium text-sm" >
                                  {superAdminCount}
                                  <Icon icon="solar:check-circle-bold" style={{color:'#2196f3', fontSize:'1.2em', marginBottom:'4px', marginLeft:'4px'}} />
                                </span>
                              ) : (
                                <span
                                  className="bg-danger-focus text-danger-main px-32 py-4 rounded-pill fw-medium text-sm"
                                  style={{cursor:'pointer'}}
                                  onClick={() => navigate(`/CompanyDetail/${entreprise.id}`)}
                                  title="Aucun super admin, cliquez pour voir les détails"
                                >
                                  0
                                  <Icon icon="solar:close-circle-bold" style={{color:'#e53935', fontSize:'1.2em', marginBottom:'4px', marginLeft:'4px'}} />
                                </span>
                              )}
                            </td>
                            <td>
                              {licenceStatus ? (
                                <span className={
                                  licenceStatus === 'pending' ? 'bg-warning-focus text-warning-main px-24 py-4 rounded-pill fw-medium text-sm' :
                                  licenceStatus === 'validated' ? 'bg-success-focus text-success-main px-24 py-4 rounded-pill fw-medium text-sm' :
                                  licenceStatus === 'rejected' ? 'bg-danger-focus text-danger-main px-24 py-4 rounded-pill fw-medium text-sm' :
                                  'bg-secondary-light text-black px-24 py-4 rounded-pill fw-medium text-sm'
                                }>
                                  {licenceStatus}
                                </span>
                              ) : (
                                <span
                                  className="bg-danger-focus text-danger-main px-32 py-4 rounded-pill fw-medium text-sm"
                                  style={{cursor:'pointer'}}
                                  onClick={() => navigate(`/CompanyDetail/${entreprise.id}`)}
                                  title="Aucune licence, cliquez pour voir les détails"
                                >
                                  No licence assigned
                                  <Icon icon="solar:close-circle-bold" style={{color:'#e53935', fontSize:'1.2em', marginBottom:'4px', marginLeft:'4px'}} />
                                </span>
                              )}
                            </td>
                            <td className="text-center">
                              <Link
                                to={`/CompanyDetail/${entreprise.id}`}
                                className="w-32-px h-32-px me-8 bg-primary-light text-info-pressed rounded-circle d-inline-flex align-items-center justify-content-center"
                                title="Voir les détails"
                              >
                                <Icon icon="iconamoon:eye-light"/>
                              </Link>
                              {/* <Link
                                to="#"
                                className="w-32-px h-32-px me-8 bg-success-focus text-success-main rounded-circle d-inline-flex align-items-center justify-content-center"
                                title="Modifier"
                              >
                                <Icon icon="lucide:edit" />
                              </Link> */}
                              <Link
                                to="#"
                                className="w-32-px h-32-px me-8 bg-neutral-300 text-neutral-500 rounded-circle d-inline-flex align-items-center justify-content-center"
                                title="Supprimer"
                                onClick={() => handleAskDelete(entreprise.id)}
                              >
                                <Icon icon="mingcute:delete-2-line" />
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="d-flex justify-content-between align-items-center mt-4">
                    <div className="text-muted">
                      <small>
                        Affichage de {indexOfFirstItem + 1} à {Math.min(indexOfLastItem, entreprises.length)} sur {entreprises.length} entreprise(s)
                      </small>
                    </div>
                    <nav aria-label="Pagination des entreprises">
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
              </>
            )}
          </div>
          <div className="card-footer">
            <div className="d-flex justify-content-between align-items-center">
              <div className="text-muted">
                <small>
                  <Icon icon="solar:info-circle-outline" className="me-1" />
                  {entreprises.length} entreprise(s) au total
                </small>
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-outline-secondary btn-sm">
                  <Icon icon="solar:export-outline" className="me-1" />
                  Exporter
                </button>
                <button className="btn btn-outline-secondary btn-sm">
                  <Icon icon="solar:import-outline" className="me-1" />
                  Importer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Modal de confirmation de suppression */}
      {showDeleteModal && (
        <>
          <div className="modal-backdrop fade show" style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',zIndex:1000,background:'rgba(0,0,0,0.3)'}}></div>
          <div className="modal fade show" style={{display:'block',zIndex:1100}} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h6 className="modal-title fw-semibold">Confirmer l'archivage</h6>
                  <button type="button" className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
                </div>
                <div className="modal-body">
                  Êtes-vous sûr de vouloir archiver cette entreprise ?
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
  );
};

export default CompanyList; 