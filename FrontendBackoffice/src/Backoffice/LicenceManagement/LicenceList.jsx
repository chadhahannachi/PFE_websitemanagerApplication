import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Icon } from '@iconify/react/dist/iconify.js';
import { Link } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

const LicenceList = () => {
  const [licences, setLicences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [companyNames, setCompanyNames] = useState({}); // Cache pour les noms d'entreprises

  // Filtres et recherche
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('desc'); // 'desc' = plus récent, 'asc' = plus ancien

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  // Récupération du token et décodage pour obtenir l'ID de l'utilisateur (optionnel)
  const token = localStorage.getItem("token");
  let userId = null;
  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      userId = decodedToken?.sub;
    } catch (error) {
      setError("Erreur lors du décodage du token.");
      setLoading(false);
    }
  } else {
    setError("Token manquant. Veuillez vous connecter.");
    setLoading(false);
  }

  // Récupérer les licences
  const fetchLicences = async () => {
    if (!token) {
      setError("Token manquant pour récupérer les licences.");
      setLoading(false);
      return;
    }
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get("http://localhost:5000/licences", config);
      setLicences(response.data);
      
      // Récupérer les noms des entreprises pour chaque licence
      const names = {};
      await Promise.all(
        response.data.map(async (licence) => {
          if (licence.mongo_company_id) {
            try {
              const companyResponse = await axios.get(`http://localhost:5000/entreprises/${licence.mongo_company_id}`);
              names[licence.mongo_company_id] = companyResponse.data.nom;
            } catch (error) {
              names[licence.mongo_company_id] = 'Entreprise non trouvée';
            }
          }
        })
      );
      setCompanyNames(names);
      setLoading(false);
    } catch (error) {
      setError("Erreur lors de la récupération des licences.");
      setLoading(false);
    }
  };

  // Fonction pour réinitialiser les filtres et rafraîchir
  const handleRefresh = () => {
    setSearch('');
    setStatusFilter('');
    setTypeFilter('');
    setSortOrder('desc');
    setCurrentPage(1);
    fetchLicences();
  };

  useEffect(() => {
    fetchLicences();
    // eslint-disable-next-line
  }, []);

  // Filtrage et tri
  const filteredAndSortedLicences = licences
    .filter(licence =>
      (licence.description?.toLowerCase().includes(search.toLowerCase()) || 
       licence.type?.toLowerCase().includes(search.toLowerCase()) ||
       licence.status?.toLowerCase().includes(search.toLowerCase()) ||
       licence.mongo_company_id?.toLowerCase().includes(search.toLowerCase()) ||
       companyNames[licence.mongo_company_id]?.toLowerCase().includes(search.toLowerCase()))
      && (statusFilter ? licence.status === statusFilter : true)
      && (typeFilter ? licence.type === typeFilter : true)
    )
    .sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return sortOrder === 'desc'
        ? dateB - dateA // Plus récent d'abord
        : dateA - dateB; // Plus ancien d'abord
    });

  // Calculer les licences à afficher pour la page courante
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLicences = filteredAndSortedLicences.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAndSortedLicences.length / itemsPerPage);

  // Fonction pour changer de page
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Fonction pour supprimer une licence
  const handleDeleteLicence = async (licenceId) => {
    const isConfirmed = window.confirm(
      `Êtes-vous sûr de vouloir supprimer cette licence ?\n\nCette action est irréversible.`
    );

    if (!isConfirmed) {
      return;
    }

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`http://localhost:5000/licences/${licenceId}`, config);
      
      // Rafraîchir la liste après suppression
      fetchLicences();
      
      // Afficher un message de succès (optionnel)
      alert('Licence supprimée avec succès !');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression de la licence. Veuillez réessayer.');
    }
  };

  // Obtenir les types uniques pour le filtre
  const uniqueTypes = [...new Set(licences.map(licence => licence.type).filter(Boolean))];

  if (loading) {
    return (
      <div className="text-center p-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
        <p className="mt-2">Chargement des licences...</p>
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
          <div className="card-header d-flex flex-wrap align-items-center justify-content-between gap-3">
            <div className="d-flex flex-wrap align-items-center gap-3">
              <div className="icon-field">
                <input
                  type="text"
                  className="form-control form-control-sm w-auto"
                  placeholder="Recherche licence, entreprise..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                <span className="icon">
                  <Icon icon="ion:search-outline" />
                </span>
              </div>
              <select
                className="form-select form-select-sm w-auto"
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
              >
                <option value="">Tous les statuts</option>
                <option value="paid">paid</option>
                <option value="expired">expired</option>
                <option value="pending">pending</option>
                <option value="pending_verification">pending_verification</option>
                <option value="cancelled">cancelled</option>
                
              </select>
              <select
                className="form-select form-select-sm w-auto"
                value={typeFilter}
                onChange={e => setTypeFilter(e.target.value)}
              >
                <option value="">Tous les types</option>
                {uniqueTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <select
                className="form-select form-select-sm w-auto"
                value={sortOrder}
                onChange={e => setSortOrder(e.target.value)}
              >
                <option value="desc">Plus récent</option>
                <option value="asc">Plus ancien</option>
              </select>
            </div>
            <div className="d-flex gap-2 align-items-center">
              <button 
                className="btn btn-outline-primary btn-sm"
                onClick={handleRefresh}
              >
                <Icon icon="solar:refresh-outline" className="me-1" />
                Actualiser
              </button>
            </div>
          </div>
          <div className="card-body">
            {filteredAndSortedLicences.length === 0 ? (
              <div className="text-center py-4">
                <Icon icon="solar:key-outline" className="text-muted" style={{ fontSize: '3rem' }} />
                <p className="text-muted mt-2">Aucune licence trouvée</p>
              </div>
            ) : (
              <>
                <div className="table-responsive">
                  <table className="table striped-table mb-0">
                    <thead>
                      <tr>
                        <th>Type</th>
                        <th>Description</th>
                        <th>Prix</th>
                        <th>Statut</th>
                        <th>Date de début</th>
                        <th>Date de fin</th>
                        <th>Entreprise</th>
                        <th>Date de création</th>
                        <th className="text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentLicences.map((licence) => (
                        <tr key={licence.id || licence._id}>
                          <td>{licence.type}</td>
                          <td>{licence.description}</td>
                          <td>{licence.price}</td>
                          <td>
                            <span className={`badge ${
                              licence.status === 'paid' ? 'bg-success' : 
                              licence.status === 'expired' ? 'bg-danger' : 
                              licence.status === 'pending' ? 'bg-warning' : 
                              licence.status === 'cancelled' ? 'bg-secondary':
                              licence.status === 'pending_verification' ? 'bg-secondary' : 'bg-info'

                            }`}>
                              {licence.status}
                            </span>
                          </td>
                          <td>{licence.start_date ? new Date(licence.start_date).toLocaleDateString() : ''}</td>
                          <td>{licence.end_date ? new Date(licence.end_date).toLocaleDateString() : ''}</td>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="flex-grow-1">
                                <h6 className="text-md mb-0 fw-normal">
                                  {companyNames[licence.mongo_company_id] || 'Chargement...'}
                                </h6>
                                <small className="text-muted">
                                  ID: {licence.mongo_company_id}
                                </small>
                              </div>
                            </div>
                          </td>
                          <td>{licence.created_at ? new Date(licence.created_at).toLocaleString() : ''}</td>
                          <td className="text-center">
                            <div className="d-flex align-items-center justify-content-center gap-2">
                              <Link
                                to={`/LicenceDetail/${licence.id || licence._id}`}
                                className="w-32-px h-32-px bg-primary-light text-info-pressed rounded-circle d-inline-flex align-items-center justify-content-center"
                                title="Voir les détails"
                              >
                                <Icon icon="iconamoon:eye-light" />
                              </Link>
                              <button
                                onClick={() => handleDeleteLicence(licence.id || licence._id)}
                                className="w-32-px h-32-px bg-danger-light text-danger rounded-circle d-inline-flex align-items-center justify-content-center border-0"
                                title="Supprimer la licence"
                              >
                                <Icon icon="solar:trash-bin-trash-outline" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="d-flex justify-content-between align-items-center mt-4">
                    <div className="text-muted">
                      <small>
                        Affichage de {indexOfFirstItem + 1} à {Math.min(indexOfLastItem, filteredAndSortedLicences.length)} sur {filteredAndSortedLicences.length} licence(s)
                      </small>
                    </div>
                    <nav aria-label="Pagination des licences">
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
            <div className="text-muted">
              <small>
                <Icon icon="solar:info-circle-outline" className="me-1" />
                {filteredAndSortedLicences.length} licence(s) au total
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LicenceList; 