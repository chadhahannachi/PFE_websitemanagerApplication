import { Icon } from '@iconify/react/dist/iconify.js';
import React, { useState, useEffect } from 'react';
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';


const MyLicence = () => {
    const [licence, setLicence] = useState(null);
    const [entreprise, setEntreprise] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: false });
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const [processingPayment, setProcessingPayment] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [loadingRole, setLoadingRole] = useState(true);
    const [upgradeData, setUpgradeData] = useState({
      plan: licence?.type || '',
      startDate: new Date().toISOString().slice(0, 10),
      endDate: '',
    });
    const TYPE_BASIC = 'basic';
    const TYPE_PROFESSIONAL = 'professional';
    const TYPE_ENTERPRISE = 'enterprise';
    const PRICE_BASIC = 50;
    const PRICE_PROFESSIONAL = 100;
    const PRICE_ENTERPRISE = 150;

    const [plans, setPlans] = useState([
      { name: TYPE_BASIC, price: PRICE_BASIC },
      { name: TYPE_PROFESSIONAL, price: PRICE_PROFESSIONAL },
      { name: TYPE_ENTERPRISE, price: PRICE_ENTERPRISE },
    ]);

    // Récupérer les données de l'utilisateur connecté et sa licence
    useEffect(() => {
        const fetchUserLicence = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setError("Token d'authentification manquant");
                setLoading(false);
                return;
            }

            let userId = null;
            try {
                const decodedToken = jwtDecode(token);
                userId = decodedToken.sub;
            } catch (error) {
                setError("Token invalide");
                setLoading(false);
                return;
            }

            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                
                // Récupérer les informations de l'utilisateur (comme dans TeamList)
                const userResponse = await axios.get(`http://localhost:5000/auth/user/${userId}`, config);
                const user = userResponse.data;

                if (!user.entreprise) {
                    setError("Aucune entreprise associée à votre compte");
                    setLoading(false);
                    return;
                }

                // Récupérer les détails de l'entreprise
                const entrepriseResponse = await axios.get(`http://localhost:5000/entreprises/${user.entreprise}`, config);
                setEntreprise(entrepriseResponse.data);

                // Récupérer la licence de l'entreprise (comme dans CompanyDetail)
                try {
                    const licenceResponse = await axios.get(`http://localhost:5000/licences/mongo/${user.entreprise}`, config);
                    setLicence(licenceResponse.data);
                } catch (licenceError) {
                    // Si pas de licence trouvée, on ne met pas d'erreur, juste pas de licence
                    setLicence(null);
                }
                
                setLoading(false);

            } catch (error) {
                console.error("Erreur lors de la récupération des données :", error);
                setError("Erreur lors de la récupération des données");
                setLoading(false);
            }
        };

        fetchUserLicence();
    }, []);


    const handlePayment = async () => {
        try {
            setProcessingPayment(true);
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Token d\'authentification manquant');
            }
            if (!licence?.price) {
                throw new Error('Prix de la licence manquant'); 
            }
    
            const response = await axios.post(
                'http://localhost:5000/api/stripe/create-checkout-session',
                {
                    licenceId: licence.id,
                    amount: licence.price,
                    currency: 'eur'
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
    
            if (response.data.url) {
                window.location.href = response.data.url;
            } else {
                throw new Error('URL de paiement non reçue');
            }
        } catch (error) {
            console.error('Payment error:', error);
            toast.error(error.response?.data?.message || error.message || 'Erreur lors du traitement du paiement');
            setProcessingPayment(false);
        }
    };


    // Compte à rebours pour la licence
    useEffect(() => {
        if (!licence || !licence.end_date) return;

        const updateCountdown = () => {
            const endDate = new Date(licence.end_date);
            const now = new Date();
            const diff = endDate - now;

            if (diff <= 0) {
                // Licence expirée
                setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setCountdown({ days, hours, minutes, seconds, isExpired: false });
        };

        // Mise à jour immédiate
        updateCountdown();

        // Mise à jour toutes les secondes
        const interval = setInterval(updateCountdown, 1000);

        return () => clearInterval(interval);
    }, [licence]);


    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const decodedToken = jwtDecode(token);
            const userId = decodedToken.sub;
            axios.get(`http://localhost:5000/auth/user/${userId}`, {
              headers: { Authorization: `Bearer ${token}` }
            }).then(response => {
              setUserRole(response.data.role);
              setLoadingRole(false);
            }).catch(() => {
              setUserRole(null);
              setLoadingRole(false);
            });
          } catch {
            setUserRole(null);
            setLoadingRole(false);
          }
        } else {
          setLoadingRole(false);
        }
      }, []);



    if (loading) {
        return (
            <div className="text-center p-4">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Chargement...</span>
                </div>
                <p className="mt-2">Chargement de votre licence...</p>
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

    if (!licence) {
        return (
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card-body text-center py-5">
                            <Icon icon="solar:shield-keyhole-outline" className="text-muted" style={{ fontSize: '4rem' }} />
                            <h5 className="mt-3 text-muted">Aucune licence trouvée</h5>
                            <p className="text-muted">Votre entreprise n'a pas encore de licence active.</p>
                            {entreprise && (
                                <div className="mt-4">
                                    <div className="alert alert-info">
                                        <strong>Votre entreprise :</strong> {entreprise.nom}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Calculer le statut de la licence
    const getLicenceStatus = () => {
        if (licence.status === 'paid') return { text: 'Active', class: 'bg-success' };
        if (licence.status === 'expired') return { text: 'Expirée', class: 'bg-danger' };
        if (licence.status === 'pending') return { text: 'En attente', class: 'bg-warning' };
        if (licence.status === 'pending_verification') return { text: 'En vérification', class: 'bg-info' };
        if (licence.status === 'cancelled') return { text: 'Annulée', class: 'bg-secondary' };
        return { text: licence.status, class: 'bg-secondary' };
    };

    const statusInfo = getLicenceStatus();

    // Calculer les jours restants
    const getDaysRemaining = () => {
        if (!licence.end_date) return null;
        const endDate = new Date(licence.end_date);
        const today = new Date();
        const diffTime = endDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const daysRemaining = getDaysRemaining();

    return (
        <div className="row gy-4">
            {/* Compte à rebours en haut */}
            {licence && licence.end_date && (
                <div className="col-12">
                    <div className={`card ${countdown.isExpired ? 'border-danger' : countdown.days <= 7 ? 'border-warning' : 'border-success'}`}>
                        <div className="card-body text-center py-4">
                            <div className="d-flex align-items-center justify-content-center mb-3">
                                <Icon 
                                    icon={countdown.isExpired ? "solar:clock-circle-bold" : "solar:clock-circle-outline"} 
                                    className={`me-2 ${countdown.isExpired ? 'text-danger' : countdown.days <= 7 ? 'text-warning' : 'text-success'}`}
                                    style={{ fontSize: '1.5rem' }}
                                />
                                <h5 className={`mb-0 ${countdown.isExpired ? 'text-danger' : countdown.days <= 7 ? 'text-warning' : 'text-success'}`}>
                                    {countdown.isExpired ? 'Licence expirée' : 'Temps restant'}
                                </h5>
                            </div>
                            
                            {countdown.isExpired ? (
                                <div className="alert alert-danger mb-0">
                                    <Icon icon="solar:danger-circle-bold" className="me-2" />
                                    Votre licence a expiré le {new Date(licence.end_date).toLocaleDateString()}
                                </div>
                            ) : (
                                <div className="row justify-content-center">
                                    <div className="col-auto">
                                        <div className="d-flex gap-3">
                                            <div className="text-center">
                                                <div className={`display-6 fw-bold ${countdown.days <= 7 ? 'text-warning' : 'text-success'}`}>
                                                    {countdown.days.toString().padStart(2, '0')}
                                                </div>
                                                <div className="text-muted small">Jours</div>
                                            </div>
                                            <div className="text-center">
                                                <div className={`display-6 fw-bold ${countdown.days <= 7 ? 'text-warning' : 'text-success'}`}>
                                                    {countdown.hours.toString().padStart(2, '0')}
                                                </div>
                                                <div className="text-muted small">Heures</div>
                                            </div>
                                            <div className="text-center">
                                                <div className={`display-6 fw-bold ${countdown.days <= 7 ? 'text-warning' : 'text-success'}`}>
                                                    {countdown.minutes.toString().padStart(2, '0')}
                                                </div>
                                                <div className="text-muted small">Minutes</div>
                                            </div>
                                            <div className="text-center">
                                                <div className={`display-6 fw-bold ${countdown.days <= 7 ? 'text-warning' : 'text-success'}`}>
                                                    {countdown.seconds.toString().padStart(2, '0')}
                                                </div>
                                                <div className="text-muted small">Secondes</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            {countdown.days <= 7 && !countdown.isExpired && (
                                <div className="alert alert-warning mt-3 mb-0">
                                    <Icon icon="solar:warning-circle-bold" className="me-2" />
                                    Attention : Votre licence expire bientôt ! Pensez à la renouveler.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* En-tête avec informations de l'entreprise */}
            <div className="col-12">
                <div className="card">
                    <div className="card-body">
                        <div className="d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center">
                                <div className="avatar-lg me-4">
                                    <div className="avatar-title bg-primary-50 text-primary rounded-circle" style={{ width: '60px', height: '60px' }}>
                                        <Icon icon="solar:building-outline" style={{ fontSize: '2rem' }} />
                                    </div>
                                </div>
                                <div>
                                    <h4 className="mb-1">{entreprise?.nom}</h4>
                                    <p className="text-muted mb-0">
                                        <Icon icon="solar:mailbox-outline" className="me-1" />
                                        {entreprise?.contact}
                                    </p>
                                </div>
                            </div>
                            <div className="text-end">
                                <span className={`badge ${statusInfo.class} px-3 py-2 fw-medium`}>
                                    {statusInfo.text}
                                </span>
                                {daysRemaining !== null && (
                                    <div className="mt-2">
                                        <small className="text-muted">
                                            {daysRemaining > 0 ? (
                                                <span className="text-success">
                                                    <Icon icon="solar:clock-circle-outline" className="me-1" />
                                                    {daysRemaining} jour(s) restant(s)
                                                </span>
                                            ) : (
                                                <span className="text-danger">
                                                    <Icon icon="solar:clock-circle-outline" className="me-1" />
                                                    Expirée depuis {Math.abs(daysRemaining)} jour(s)
                                                </span>
                                            )}
                                        </small>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Détails de la licence */}
            <div className="col-lg-8">
                <div className="card">
                    <div className="card-header">
                        <h5 className="card-title mb-0">
                            <Icon icon="solar:key-outline" className="me-2" />
                            Détails de votre licence
                        </h5>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <div className="d-flex align-items-center p-3 border rounded">
                                    <div className="avatar-sm me-3">
                                        <div className="avatar-title bg-primary-50 text-primary rounded-circle">
                                            <Icon icon="solar:shield-keyhole-outline" />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="fw-semibold text-primary-light">Type de licence</div>
                                        <div className="text-secondary-light text-capitalize">{licence.type}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 mb-3">
                                <div className="d-flex align-items-center p-3 border rounded">
                                    <div className="avatar-sm me-3">
                                        <div className="avatar-title bg-success-50 text-success rounded-circle">
                                            <Icon icon="solar:dollar-minimalistic-outline" />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="fw-semibold text-primary-light">Prix</div>
                                        <div className="text-secondary-light">{licence.price} DT</div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 mb-3">
                                <div className="d-flex align-items-center p-3 border rounded">
                                    <div className="avatar-sm me-3">
                                        <div className="avatar-title bg-info-50 text-info rounded-circle">
                                            <Icon icon="solar:calendar-outline" />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="fw-semibold text-primary-light">Date de début</div>
                                        <div className="text-secondary-light">
                                            {licence.start_date ? new Date(licence.start_date).toLocaleDateString() : 'Non définie'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 mb-3">
                                <div className="d-flex align-items-center p-3 border rounded">
                                    <div className="avatar-sm me-3">
                                        <div className="avatar-title bg-warning-50 text-warning rounded-circle">
                                            <Icon icon="solar:calendar-outline" />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="fw-semibold text-primary-light">Date de fin</div>
                                        <div className="text-secondary-light">
                                            {licence.end_date ? new Date(licence.end_date).toLocaleDateString() : 'Non définie'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {licence.description && (
                            <div className="mt-4">
                                <h6 className="text-md text-primary-light mb-2">Description</h6>
                                <div className="p-3 bg-light rounded">
                                    {licence.description}
                                </div>
                            </div>
                        )}

                        {licence.license_key && (
                            <div className="mt-4">
                                <h6 className="text-md text-primary-light mb-2">Clé de licence</h6>
                                <div className="p-3 bg-light rounded font-monospace">
                                    {licence.license_key}
                                </div>
                            </div>
                        )}

                        {licence.licence_request_id && (
                            <div className="mt-4">
                                <h6 className="text-md text-primary-light mb-2">ID Demande de Licence</h6>
                                <div className="p-3 bg-light rounded">
                                    {licence.licence_request_id}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Informations supplémentaires */}
            <div className="col-lg-4">
                <div className="card">
                    <div className="card-header">
                        <h6 className="card-title mb-0">
                            <Icon icon="solar:info-circle-outline" className="me-2" />
                            Informations
                        </h6>
                    </div>
                    <div className="card-body">
                        <div className="mb-3">
                            <div className="d-flex align-items-center mb-2">
                                <Icon icon="solar:clock-circle-outline" className="text-primary me-2" />
                                <span className="fw-semibold">Statut actuel</span>
                            </div>
                            <span className={`badge ${statusInfo.class} px-3 py-2`}>
                                {statusInfo.text}
                            </span>
                        </div>

                        {daysRemaining !== null && (
                            <div className="mb-3">
                                <div className="d-flex align-items-center mb-2">
                                    <Icon icon="solar:calendar-outline" className="text-primary me-2" />
                                    <span className="fw-semibold">Durée restante</span>
                                </div>
                                {daysRemaining > 0 ? (
                                    <div className="text-success">
                                        <strong>{daysRemaining} jour(s)</strong> restant(s)
                                    </div>
                                ) : (
                                    <div className="text-danger">
                                        <strong>Expirée</strong> depuis {Math.abs(daysRemaining)} jour(s)
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="mb-3">
                            <div className="d-flex align-items-center mb-2">
                                <Icon icon="solar:calendar-outline" className="text-primary me-2" />
                                <span className="fw-semibold">Date de création</span>
                            </div>
                            <div className="text-secondary-light">
                                {licence.created_at ? new Date(licence.created_at).toLocaleString() : 'Non disponible'}
                            </div>
                        </div>

                        {licence.updated_at && (
                            <div className="mb-3">
                                <div className="d-flex align-items-center mb-2">
                                    <Icon icon="solar:refresh-outline" className="text-primary me-2" />
                                    <span className="fw-semibold">Dernière mise à jour</span>
                                </div>
                                <div className="text-secondary-light">
                                    {new Date(licence.updated_at).toLocaleString()}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Actions rapides */}
                {!loadingRole && ['superadminabshore', 'superadminentreprise'].includes(userRole) && (
                <div className="card mt-3">
                    <div className="card-header">
                        <h6 className="card-title mb-0">
                            <Icon icon="solar:settings-outline" className="me-2" />
                            Actions
                        </h6>
                    </div>
                    <div className="card-body">
                        <div className="d-grid gap-2">
                            <button className="btn btn-outline-primary btn-sm" onClick={() => setShowModal(true)}>
                                <Icon icon="material-symbols:upgrade" width="24" height="24" />
                                Mettre à niveau la licence
                            </button>
                            
                            <button 
                                className="btn btn-outline-secondary btn-sm" 
                                onClick={handlePayment}
                                disabled={processingPayment || licence.status === 'paid'}
                            >
                                <Icon icon="hugeicons:payment-02" width="24" height="24" />
                                {processingPayment ? 'Traitement...' : 'Payer la licence'}
                            </button>
                        </div>
                    </div>
                </div>

                )}
            </div>
            {showModal && (
                <div className="modal-backdrop fade show" style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',zIndex:1000,background:'rgba(0,0,0,0.3)'}}></div>
            )}
            {showModal && (
                <div className="modal fade show" style={{display:'block',zIndex:1100}} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h6 className="modal-title fw-semibold">Mettre à niveau la licence</h6>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <form
                                onSubmit={async (e) => {
                                    e.preventDefault();
                                    const planObj = plans.find(p => p.name === upgradeData.plan);
                                    const start = new Date(upgradeData.startDate);
                                    const end = new Date(upgradeData.endDate);
                                    // Calcul du nombre de mois entiers ou partiels (arrondi au supérieur)
                                    const months = Math.ceil((end.getFullYear() * 12 + end.getMonth() - (start.getFullYear() * 12 + start.getMonth()) + 1));
                                    const price = planObj ? months * planObj.price : 0;
                                    try {
                                        const token = localStorage.getItem('token');
                                        await axios.put(
                                            `http://localhost:5000/licences/${licence.id}`,
                                            {
                                                type: upgradeData.plan,
                                                start_date: upgradeData.startDate,
                                                end_date: upgradeData.endDate,
                                                price,
                                                status: 'pending'
                                            },
                                            {
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                    'Authorization': `Bearer ${token}`
                                                }
                                            }
                                        );
                                        setShowModal(false);
                                        window.location.reload();
                                    } catch (err) {
                                        alert('Erreur lors de la mise à niveau');
                                    }
                                }}
                            >
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">Type de licence</label>
                                        <select
                                            className="form-control"
                                            value={upgradeData.plan}
                                            onChange={e => setUpgradeData({ ...upgradeData, plan: e.target.value })}
                                            required
                                        >
                                            <option value="">Choisir un type</option>
                                            {plans.map(plan => (
                                                <option key={plan.name} value={plan.name}>{plan.name} ({plan.price} DT/mois)</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Date de début</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            value={upgradeData.startDate}
                                            onChange={e => setUpgradeData({ ...upgradeData, startDate: e.target.value })}
                                            required
                                            min={new Date().toISOString().slice(0, 10)}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Date de fin</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            value={upgradeData.endDate}
                                            onChange={e => setUpgradeData({ ...upgradeData, endDate: e.target.value })}
                                            required
                                            min={upgradeData.startDate}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Prix calculé</label>
                                        <div className="form-control bg-light">
                                            {(() => {
                                                const planObj = plans.find(p => p.name === upgradeData.plan);
                                                if (!planObj || !upgradeData.startDate || !upgradeData.endDate) return '—';
                                                const start = new Date(upgradeData.startDate);
                                                const end = new Date(upgradeData.endDate);
                                                // Calcul du nombre de mois entiers ou partiels (arrondi au supérieur)
                                                const months = Math.ceil((end.getFullYear() * 12 + end.getMonth() - (start.getFullYear() * 12 + start.getMonth()) + 1));
                                                return months > 0 ? `${months * planObj.price} DT` : '—';
                                            })()}
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Statut</label>
                                        <div className="form-control bg-light">pending</div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Annuler</button>
                                    <button type="submit" className="btn btn-primary">Valider</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyLicence;