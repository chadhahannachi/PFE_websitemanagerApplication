import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Icon } from '@iconify/react/dist/iconify.js';
import { Link } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

const LicenceRequestsList = () => {
  const [licenceRequests, setLicenceRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filtres et recherche
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('desc'); // 'desc' = plus récent, 'asc' = plus ancien

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

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

  // Récupérer les demandes de licence
  const fetchLicenceRequests = async () => {
    if (!token) {
      setError("Token manquant pour récupérer les demandes de licence.");
      setLoading(false);
      return;
    }
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get("http://localhost:5000/licence-requests", config);
      setLicenceRequests(response.data);
      setLoading(false);
    } catch (error) {
      setError("Erreur lors de la récupération des demandes de licence.");
      setLoading(false);
    }
  };

  // Fonction pour réinitialiser les filtres et rafraîchir
  const handleRefresh = () => {
    setSearch('');
    setStatusFilter('');
    setSortOrder('desc');
    setCurrentPage(1);
    fetchLicenceRequests();
  };

  useEffect(() => {
    fetchLicenceRequests();
    // eslint-disable-next-line
  }, []);

  // Filtrage et tri
  const filteredAndSortedRequests = licenceRequests
    .filter(req =>
      req.company_name?.toLowerCase().includes(search.toLowerCase())
      && (statusFilter ? req.status === statusFilter : true)
    )
    .sort((a, b) => {
      // Priorité 1: Les demandes 'pending' en premier
      if (a.status === 'pending' && b.status !== 'pending') return -1;
      if (a.status !== 'pending' && b.status === 'pending') return 1;
      
      // Priorité 2: Tri par date (plus récent d'abord)
      const dateA = new Date(a.requested_at);
      const dateB = new Date(b.requested_at);
      return sortOrder === 'desc'
        ? dateB - dateA // Plus récent d'abord
        : dateA - dateB; // Plus ancien d'abord
    });

  // Calculer les demandes à afficher pour la page courante
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRequests = filteredAndSortedRequests.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAndSortedRequests.length / itemsPerPage);

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
        <p className="mt-2">Chargement des demandes de licence...</p>
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
                  placeholder="Recherche entreprise..."
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
                <option value="pending">En attente</option>
                <option value="validated">Validée</option>
                <option value="rejected">Rejetée</option>
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
            {filteredAndSortedRequests.length === 0 ? (
              <div className="text-center py-4">
                <Icon icon="solar:buildings-outline" className="text-muted" style={{ fontSize: '3rem' }} />
                <p className="text-muted mt-2">Aucune demande de licence trouvée</p>
              </div>
            ) : (
              <>
                <div className="table-responsive">
                  <table className="table striped-table mb-0">
                    <thead>
                      <tr>
                        <th>Entreprise</th>
                        <th>Email</th>
                        <th>Téléphone</th>
                        <th>Adresse</th>
                        <th>Type</th>
                        <th>Description</th>
                        <th>Prix</th>
                        <th>Durée (mois)</th>
                        <th>Statut</th>
                        <th>Date de demande</th>
                        <th className="text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentRequests.map((req) => (
                        <tr key={req.id || req._id} className={req.status === 'pending' ? 'bg-warning-50' : ''}>
                          <td>{req.company_name}</td>
                          <td>{req.company_email}</td>
                          <td>{req.company_phone}</td>
                          <td>{req.company_address}</td>
                          <td>{req.type}</td>
                          <td>{req.description}</td>
                          <td>{req.price}</td>
                          <td>{req.duration_months}</td>
                          <td>
                            <span className={`badge ${req.status === 'pending' ? 'bg-warning' : req.status === 'validated' ? 'bg-success' : req.status === 'rejected' ? 'bg-danger' : 'bg-secondary'}`}>
                              {req.status}
                            </span>
                          </td>
                          <td>{req.requested_at ? new Date(req.requested_at).toLocaleString() : ''}</td>
                          <td className="text-center">
                            <Link
                              to={`/LicenceRequestDetail/${req.id || req._id}`}
                              className="w-32-px h-32-px me-8 bg-primary-light text-info-pressed rounded-circle d-inline-flex align-items-center justify-content-center"
                              title="Voir les détails"
                            >
                              <Icon icon="iconamoon:eye-light" />
                            </Link>
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
                        Affichage de {indexOfFirstItem + 1} à {Math.min(indexOfLastItem, filteredAndSortedRequests.length)} sur {filteredAndSortedRequests.length} demande(s)
                      </small>
                    </div>
                    <nav aria-label="Pagination des demandes de licence">
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
                {filteredAndSortedRequests.length} demande(s) au total
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LicenceRequestsList;