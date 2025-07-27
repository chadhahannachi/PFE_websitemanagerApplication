import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Icon } from '@iconify/react/dist/iconify.js';
import { Link } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

const PaymentList = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [licenceMap, setLicenceMap] = useState({}); // Pour afficher le type de licence
  const [companyMap, setCompanyMap] = useState({}); // Pour afficher le nom de l'entreprise

  // Filtres et recherche
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');

  // Récupération du token
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

  // Récupérer les paiements, licences et entreprises
  const fetchPayments = async () => {
    if (!token) {
      setError("Token manquant pour récupérer les paiements.");
      setLoading(false);
      return;
    }
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get("http://localhost:5000/api/payments", config);
      // Correction ici : extraire le tableau de paiements
      let data = [];
      if (Array.isArray(response.data)) {
        data = response.data;
      } else if (response.data && response.data.data && Array.isArray(response.data.data.data)) {
        data = response.data.data.data;
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        data = response.data.data;
      }
      setPayments(data);
      // Récupérer les licences pour afficher le type
      const licenceIds = [...new Set(data.map(p => p.licence_id).filter(Boolean))];
      const licenceMapTemp = {};
      const companyIds = new Set();
      const licenceDetails = {};
      await Promise.all(
        licenceIds.map(async (id) => {
          try {
            const res = await axios.get(`http://localhost:5000/licences/${id}`);
            licenceMapTemp[id] = res.data.type;
            licenceDetails[id] = res.data;
            if (res.data.mongo_company_id) {
              companyIds.add(res.data.mongo_company_id);
            }
          } catch {
            licenceMapTemp[id] = 'Inconnu';
          }
        })
      );
      setLicenceMap(licenceMapTemp);
      // Récupérer les entreprises pour chaque licence
      const companyMapTemp = {};
      await Promise.all(
        Array.from(companyIds).map(async (companyId) => {
          try {
            const res = await axios.get(`http://localhost:5000/entreprises/${companyId}`);
            companyMapTemp[companyId] = res.data.nom;
          } catch {
            companyMapTemp[companyId] = 'Entreprise inconnue';
          }
        })
      );
      setCompanyMap(companyMapTemp);
      setLoading(false);
    } catch (error) {
      setError("Erreur lors de la récupération des paiements.");
      setLoading(false);
    }
  };

  // Rafraîchir
  const handleRefresh = () => {
    setSearch('');
    setStatusFilter('');
    setSortOrder('desc');
    fetchPayments();
  };

  useEffect(() => {
    fetchPayments();
    // eslint-disable-next-line
  }, []);

  // Filtrage et tri
  const filteredAndSortedPayments = Array.isArray(payments) ? payments
    .filter(payment =>
      (String(payment.licence_id ?? '').toLowerCase().includes(search.toLowerCase()) ||
       (licenceMap[payment.licence_id] ?? '').toLowerCase().includes(search.toLowerCase()) ||
       (payment.payment_method ?? '').toLowerCase().includes(search.toLowerCase()) ||
       (payment.status ?? '').toLowerCase().includes(search.toLowerCase()) ||
       (payment.currency ?? '').toLowerCase().includes(search.toLowerCase()) ||
       (payment.stripe_payment_intent_id ?? '').toLowerCase().includes(search.toLowerCase()) ||
       (payment.stripe_checkout_session_id ?? '').toLowerCase().includes(search.toLowerCase()) ||
       (companyMap[payment.licence && payment.licence.mongo_company_id] ?? '').toLowerCase().includes(search.toLowerCase())
      )
      && (statusFilter ? payment.status === statusFilter : true)
    )
    .sort((a, b) => {
      const dateA = new Date(a.payment_date);
      const dateB = new Date(b.payment_date);
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    }) : [];

  // Statuts uniques pour le filtre
  const uniqueStatuses = [...new Set(payments.map(p => p.status).filter(Boolean))];

  if (loading) {
    return (
      <div className="text-center p-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
        <p className="mt-2">Chargement des paiements...</p>
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
                  placeholder="Recherche paiement, licence, entreprise, méthode..."
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
                {uniqueStatuses.map(status => (
                  <option key={status} value={status}>{status}</option>
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
            {filteredAndSortedPayments.length === 0 ? (
              <div className="text-center py-4">
                <Icon icon="solar:card-outline" className="text-muted" style={{ fontSize: '3rem' }} />
                <p className="text-muted mt-2">Aucun paiement trouvé</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table striped-table mb-0">
                  <thead>
                    <tr>
                      <th>Licence</th>
                      <th>Entreprise</th>
                      <th>Montant</th>
                      <th>Date</th>
                      <th>Méthode</th>
                      <th>Statut</th>
                      <th>Devise</th>
                      <th>Stripe Intent</th>
                      <th>Stripe Session</th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAndSortedPayments.map((payment) => (
                      <tr key={payment.id || payment._id}>
                        <td>
                          <div>
                            <div className="fw-semibold text-primary-light">
                              {licenceMap[payment.licence_id] || 'Licence'}
                            </div>
                            <small className="text-muted">ID: {payment.licence_id}</small>
                          </div>
                        </td>
                        <td>
                          <div className="fw-semibold text-primary-light">
                            {companyMap[payment.licence && payment.licence.mongo_company_id] ||
                              (payment.licence && payment.licence.mongo_company_id) ||
                              'Entreprise inconnue'}
                          </div>
                        </td>
                        <td>{payment.amount} {payment.currency}</td>
                        <td>{payment.payment_date ? new Date(payment.payment_date).toLocaleString() : ''}</td>
                        <td>{payment.payment_method}</td>
                        <td>
                          <span className={`badge ${
                            payment.status === 'paid' ? 'bg-success' : 
                            payment.status === 'succeeded' ? 'bg-success' : 
                            payment.status === 'pending' ? 'bg-warning' : 
                            payment.status === 'failed' ? 'bg-danger' : 'bg-secondary'
                          }`}>
                            {payment.status}
                          </span>
                        </td>
                        <td>{payment.currency}</td>
                        <td><span className="text-truncate d-inline-block" style={{maxWidth:'120px'}}>{payment.stripe_payment_intent_id}</span></td>
                        <td><span className="text-truncate d-inline-block" style={{maxWidth:'120px'}}>{payment.stripe_checkout_session_id}</span></td>
                        <td className="text-center">
                          <Link
                            to={`/PaymentDetail/${payment.id || payment._id}`}
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
            )}
          </div>
          <div className="card-footer">
            <div className="text-muted">
              <small>
                <Icon icon="solar:info-circle-outline" className="me-1" />
                {filteredAndSortedPayments.length} paiement(s) trouvé(s)
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentList;