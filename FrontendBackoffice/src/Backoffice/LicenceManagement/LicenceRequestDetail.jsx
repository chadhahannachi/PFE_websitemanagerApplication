import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Icon } from '@iconify/react/dist/iconify.js';

const LicenceRequestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [licenceRequest, setLicenceRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({
    nom: '',
    contact: '',
    numTel: '',
    adresse: '',
    raisonSociale: '',
    idRequestLicence: id
  });

  useEffect(() => {
    const fetchLicenceRequest = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        const response = await axios.get(`http://localhost:5000/licence-requests/${id}`, config);
        setLicenceRequest(response.data);
      } catch (error) {
        setError("Erreur lors de la récupération des détails de la licence.");
      } finally {
        setLoading(false);
      }
    };
    fetchLicenceRequest();
  }, [id]);

  // Préremplir le formulaire à l'ouverture du drawer
  const handleOpenDrawer = () => {
    if (licenceRequest.status === 'validated') {
      setSnackbar({ open: true, message: 'Licence request already validated', severity: 'error' });
      return;
    }
    setFormData({
      nom: licenceRequest.company_name || '',
      contact: licenceRequest.company_email || '',
      numTel: licenceRequest.company_phone || '',
      adresse: licenceRequest.company_address || '',
      raisonSociale: licenceRequest.company_name || '',
      idRequestLicence: id
    });
    setShowDrawer(true);
  };
  const handleCloseDrawer = () => setShowDrawer(false);

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateEntreprise = async (e) => {
    e.preventDefault();
    try {
      // Récupérer toutes les entreprises et vérifier côté frontend
      const all = await axios.get('http://localhost:5000/entreprises');
      if (Array.isArray(all.data) && all.data.some(ent => ent.contact === formData.contact)) {
        setSnackbar({ open: true, message: "Il existe déjà une entreprise avec ce mail.", severity: 'error' });
        return;
      }
      const response = await axios.post('http://localhost:5000/entreprises', formData);
      setSnackbar({ open: true, message: "Entreprise créée avec succès !", severity: 'success' });
      setShowDrawer(false);
      if (response.data && (response.data._id || response.data.id)) {
        navigate(`/CompanyDetail/${response.data._id || response.data.id}`);
      } else {
        navigate('/CompanyList');
      }
    } catch (error) {
      setSnackbar({ open: true, message: "Erreur lors de la création de l'entreprise.", severity: 'error' });
    }
  };

  // Reject modal logic
  const handleOpenRejectModal = () => setShowRejectModal(true);
  const handleCloseRejectModal = () => {
    setShowRejectModal(false);
    setRejectionReason("");
  };
  const handleReject = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      await axios.put(
        `http://localhost:5000/licence-requests/${id}`,
        {
          status: "rejected",
          rejection_reason: rejectionReason,
          rejected_at: new Date().toISOString(),
        },
        config
      );
      setSnackbar({ open: true, message: "Demande de licence rejetée avec succès !", severity: 'success' });
      setLicenceRequest(prev => ({ ...prev, status: "rejected", rejection_reason: rejectionReason, rejected_at: new Date().toISOString() }));
      handleCloseRejectModal();
    } catch (error) {
      setSnackbar({ open: true, message: "Erreur lors du rejet de la demande de licence.", severity: 'error' });
    }
  };

  // Snackbar close
  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  if (loading) {
    return (
      <div className="text-center p-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
        <p className="mt-2">Chargement des détails de la licence...</p>
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

  if (!licenceRequest) {
    return <div className="text-center p-4">Aucune donnée trouvée pour cette licence.</div>;
  }

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h6 className="mb-0 fw-semibold">
          <Icon icon="solar:document-bold" className="me-2 text-primary" />
          Détail de la Demande de Licence
        </h6>
        <Link to="/LicenceRequestsList" className="btn btn-outline-primary btn-sm">
          <Icon icon="solar:arrow-left-outline" className="me-1" /> Retour à la liste
        </Link>
      </div>
      <div className="card-body py-40">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="shadow-4 border radius-8">
              <div className="p-20 d-flex flex-wrap justify-content-between gap-3 border-bottom">
                <div>
                  <h5 className="text-xl mb-2">{licenceRequest.company_name}</h5>
                  <p className="mb-1 text-sm">
                    <Icon icon="solar:mailbox-outline" className="me-1" /> {licenceRequest.company_email}
                  </p>
                  <p className="mb-0 text-sm">
                    <Icon icon="solar:phone-outline" className="me-1" /> {licenceRequest.company_phone}
                  </p>
                </div>
                <div>
                  <span className={`badge px-16 py-8 fw-medium text-md ${licenceRequest.status === 'pending' ? 'bg-warning' : licenceRequest.status === 'validated' ? 'bg-success' : licenceRequest.status === 'rejected' ? 'bg-danger' : 'bg-secondary'}`}>{licenceRequest.status}</span>
                  <p className="mb-1 text-sm mt-2">
                    <Icon icon="solar:calendar-outline" className="me-1" />
                    {licenceRequest.requested_at ? new Date(licenceRequest.requested_at).toLocaleString() : ''}
                  </p>
                  <p className="mb-0 text-sm">
                    <Icon icon="solar:map-point-outline" className="me-1" /> {licenceRequest.company_address}
                  </p>
                </div>
              </div>
              <div className="py-28 px-20">
                <div className="row mb-3">
                  <div className="col-md-6 mb-2">
                    <div className="fw-semibold text-primary-light">Type de licence :</div>
                    <div className="text-secondary-light">{licenceRequest.type}</div>
                  </div>
                  <div className="col-md-6 mb-2">
                    <div className="fw-semibold text-primary-light">Durée (mois) :</div>
                    <div className="text-secondary-light">{licenceRequest.duration_months}</div>
                  </div>
                  <div className="col-md-6 mb-2">
                    <div className="fw-semibold text-primary-light">Prix :</div>
                    <div className="text-secondary-light">{licenceRequest.price} DT</div>
                  </div>
                  <div className="col-md-6 mb-2">
                    <div className="fw-semibold text-primary-light">ID de la demande :</div>
                    <div className="text-secondary-light">{licenceRequest._id || licenceRequest.id}</div>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="fw-semibold text-primary-light">Description :</div>
                  <div className="text-secondary-light">{licenceRequest.description}</div>
                </div>
                {/* Boutons d'action */}
                <div className="d-flex gap-2 mt-4">
                  <button
                    className="btn btn-primary"
                    onClick={handleOpenDrawer}
                    disabled={licenceRequest.status === 'validated'}
                  >
                    <Icon icon="solar:add-circle-outline" className="me-1" />
                    Créer une entreprise
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={handleOpenRejectModal}
                    disabled={licenceRequest.status !== 'pending'}
                  >
                    <Icon icon="solar:close-circle-outline" className="me-1" />
                    Rejeter la licence
                  </button>
                </div>
                {licenceRequest.status === 'validated' && (
                  <div className="alert alert-info mt-3">
                    <Icon icon="solar:info-circle-outline" className="me-1" />
                    Licence request already validated
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Drawer pour création d'entreprise */}
      {showDrawer && (
        <>
          <div className="drawer drawer-end drawer-open" tabIndex="-1" style={{zIndex: 1050}}>
            <div className="drawer-content bg-white shadow-lg" style={{width: 400, position: 'fixed', top: 0, right: 0, height: '100%', overflowY: 'auto', padding: '18px 18px'}}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Créer une entreprise</h5>
                <button className="btn-close" onClick={handleCloseDrawer}></button>
              </div>
              <form onSubmit={handleCreateEntreprise}>
                <div className="mb-3">
                  <label className="form-label">Nom</label>
                  <input type="text" className="form-control" name="nom" value={formData.nom} onChange={handleFormChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Contact</label>
                  <input type="text" className="form-control" name="contact" value={formData.contact} onChange={handleFormChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Numéro de téléphone</label>
                  <input type="text" className="form-control" name="numTel" value={formData.numTel} onChange={handleFormChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Adresse</label>
                  <input type="text" className="form-control" name="adresse" value={formData.adresse} onChange={handleFormChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Raison sociale</label>
                  <input type="text" className="form-control" name="raisonSociale" value={formData.raisonSociale} onChange={handleFormChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">ID de la demande de licence</label>
                  <input type="text" className="form-control" name="idRequestLicence" value={formData.idRequestLicence} readOnly />
                </div>
                <div className="d-flex justify-content-end gap-2">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseDrawer}>Annuler</button>
                  <button type="submit" className="btn btn-primary">Créer</button>
                </div>
              </form>
            </div>
          </div>
          <div className="drawer-backdrop fade show" onClick={handleCloseDrawer} style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',zIndex:1040,background:'rgba(0,0,0,0.3)'}}></div>
        </>
      )}

      {/* Modal de rejet */}
      {showRejectModal && (
        <>
          <div className="modal-backdrop fade show" style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',zIndex:1090,background:'rgba(0,0,0,0.3)'}}></div>
          <div className="modal fade show" style={{display:'block',zIndex:1100}} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h6 className="modal-title fw-semibold">Rejeter la demande de licence</h6>
                  <button type="button" className="btn-close" onClick={handleCloseRejectModal}></button>
                </div>
                <div className="modal-body">
                  <label className="form-label">Raison du rejet</label>
                  <textarea className="form-control" rows="4" value={rejectionReason} onChange={e => setRejectionReason(e.target.value)} />
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseRejectModal}>Annuler</button>
                  <button type="button" className="btn btn-danger" onClick={handleReject} disabled={!rejectionReason.trim()}>Rejeter</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Snackbar/alert */}
      {snackbar.open && (
        <div className={`alert alert-${snackbar.severity === 'error' ? 'danger' : snackbar.severity} position-fixed top-0 end-0 m-4`} style={{zIndex:2000,minWidth:300}}>
          {snackbar.message}
          <button type="button" className="btn-close float-end" onClick={handleCloseSnackbar}></button>
        </div>
      )}
    </div>
  );
};

export default LicenceRequestDetail;