// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Icon } from '@iconify/react/dist/iconify.js';
// import { jwtDecode } from 'jwt-decode';
// import { toast } from 'react-toastify';

// const MyPaymentList = () => {
//   const [payments, setPayments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [licence, setLicence] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState('');

//   // Get current user's token and ID
//   const token = localStorage.getItem('token');
//   const decodedToken = token ? jwtDecode(token) : null;
//   const userId = decodedToken?.sub; 

//   // Fetch user's licence and payments
//   useEffect(() => {
//     const fetchData = async () => {
//       console.log('Starting to fetch data...');
//       if (!token || !userId) {
//         const errorMsg = 'Veuillez vous connecter pour voir vos paiements';
//         console.error(errorMsg);
//         setError(errorMsg);
//         setLoading(false);
//         return;
//       }

//       try {
//         const config = { 
//           headers: { 
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           } 
//         };
        
//         // 1. Get user profile
//         const userResponse = await axios.get('http://localhost:5000/auth/profile', config);
//         const user = userResponse.data.user || userResponse.data;
        
//         if (!user || !user.entreprise) {
//           setError("Aucune entreprise associée à votre compte");
//           setLoading(false);
//           return;
//         }

//         const companyId = user.entreprise._id || user.entreprise;
        
//         if (!companyId) {
//           throw new Error('ID de l\'entreprise non trouvé');
//         }

//         // 2. Get licence for the company
//         try {
//           console.log('Fetching license for company ID:', companyId);
//           const licenceResponse = await axios.get(
//             `http://localhost:5000/licences/mongo/${companyId}`, 
//             config
//           );
          
//           console.log('License API response:', licenceResponse.data);
          
//           if (!licenceResponse.data || !licenceResponse.data.id) {
//             const errorMsg = 'Aucune licence trouvée pour votre entreprise';
//             console.error(errorMsg, { response: licenceResponse.data });
//             throw new Error(errorMsg);
//           }
          
//           const licenceData = licenceResponse.data;
//           setLicence(licenceData);
          
//           // 3. Get payments for the licence
//           try {
//             const paymentsResponse = await axios.get(
//               `http://localhost:5000/api/payments/licence/${licenceData.id}`, 
//               config
//             );
            
//             // Handle different response formats
//             let paymentsData = [];
//             if (Array.isArray(paymentsResponse.data)) {
//               paymentsData = paymentsResponse.data;
//             } else if (paymentsResponse.data?.data) {
//               paymentsData = Array.isArray(paymentsResponse.data.data) 
//                 ? paymentsResponse.data.data 
//                 : [paymentsResponse.data.data];
//             }
            
//             setPayments(paymentsData);
//           } catch (paymentError) {
//             console.error('Error fetching payments:', paymentError);
//             setError('Erreur lors de la récupération des paiements');
//             setPayments([]);
//           }
          
//         } catch (licenceError) {
//           console.warn('Error fetching license:', licenceError);
//           setError('Aucune licence active trouvée pour votre entreprise');
//           setPayments([]);
//         }
//       } catch (err) {
//         console.error('Error in fetchData:', {
//           message: err.message,
//           response: err.response?.data,
//           status: err.response?.status,
//           config: err.config
//         });
//         const errorMessage = err.response?.data?.message || err.message || 'Erreur lors du chargement des paiements';
//         setError(errorMessage);
//         toast.error(`Erreur: ${errorMessage}`);
        
//         // If 401 Unauthorized, redirect to login
//         if (err.response?.status === 401) {
//           console.log('Unauthorized - redirecting to login');
//           localStorage.removeItem('token');
//           window.location.href = '/login';
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [token, userId]);

//   // Filter payments based on search and status filter
//   const filteredPayments = payments.filter(payment => {
//     const matchesSearch = 
//       payment._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       payment.payment_method?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       payment.amount?.toString().includes(searchTerm);
      
//     const matchesStatus = statusFilter ? payment.status === statusFilter : true;
    
//     return matchesSearch && matchesStatus;
//   });

//   // Get unique statuses for filter dropdown
//   const statuses = [...new Set(payments.map(p => p.status).filter(Boolean))];

//   // Format date
//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     return new Date(dateString).toLocaleDateString('fr-FR', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   // Format amount
//   const formatAmount = (amount, currency = 'TND') => {
//     if (amount === undefined || amount === null) return 'N/A';
//     return new Intl.NumberFormat('fr-FR', {
//       style: 'currency',
//       currency
//     }).format(amount);
//   };

//   // Get status badge class
//   const getStatusBadgeClass = (status) => {
//     switch (status?.toLowerCase()) {
//       case 'paid':
//       case 'succeeded':
//         return 'bg-success';
//       case 'pending':
//       case 'processing':
//         return 'bg-warning';
//       case 'failed':
//       case 'canceled':
//         return 'bg-danger';
//       default:
//         return 'bg-secondary';
//     }
//   };

//   if (loading) {
//     return (
//       <div className="text-center p-4">
//         <div className="spinner-border text-primary" role="status">
//           <span className="visually-hidden">Chargement...</span>
//         </div>
//         <p className="mt-2">Chargement de l'historique des paiements...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="alert alert-danger" role="alert">
//         <Icon icon="solar:danger-circle-bold" className="me-2" />
//         {error}
//       </div>
//     );
//   }

//   return (
//     <div className="row">
//       <div className="col-12">
//         <div className="card">
//           <div className="card-header d-flex justify-content-between align-items-center">
//             <h5 className="card-title mb-0">
//               <Icon icon="solar:bill-list-outline" className="me-2" />
//               Historique des paiements
//             </h5>
//             <div className="d-flex gap-2">
//               <div className="input-group input-group-sm" style={{ width: '250px' }}>
//                 <span className="input-group-text">
//                   <Icon icon="solar:magnifer-outline" />
//                 </span>
//                 <input
//                   type="text"
//                   className="form-control"
//                   placeholder="Rechercher..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </div>
//               <select
//                 className="form-select form-select-sm"
//                 style={{ width: 'auto' }}
//                 value={statusFilter}
//                 onChange={(e) => setStatusFilter(e.target.value)}
//               >
//                 <option value="">Tous les statuts</option>
//                 {statuses.map((status) => (
//                   <option key={status} value={status}>
//                     {status.charAt(0).toUpperCase() + status.slice(1)}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//           <div className="card-body">
//             {filteredPayments.length === 0 ? (
//               <div className="text-center py-5">
//                 <div className="mb-3">
//                   <Icon
//                     icon="solar:bill-check-outline"
//                     style={{ fontSize: '3rem', opacity: 0.5 }}
//                   />
//                 </div>
//                 <h5>Aucun paiement trouvé</h5>
//                 <p className="text-muted">
//                   {payments.length === 0
//                     ? "Vous n'avez effectué aucun paiement pour le moment."
//                     : "Aucun paiement ne correspond à votre recherche."}
//                 </p>
//               </div>
//             ) : (
//               <div className="table-responsive">
//                 <table className="table table-hover">
//                   <thead>
//                     <tr>
//                       <th>Référence</th>
//                       <th>Date</th>
//                       <th>Montant</th>
//                       <th>Méthode</th>
//                       <th>Statut</th>
//                       <th>Détails</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {filteredPayments.map((payment) => (
//                       <tr key={payment?._id || Math.random()}>
//                         <td className="text-nowrap">
//                           <small className="text-muted">#</small>
//                           {payment?._id ? `${payment._id.substring(0, 8)}...` : 'N/A'}
//                         </td>
//                         <td className="text-nowrap">
//                           {formatDate(payment.payment_date || payment.createdAt)}
//                         </td>
//                         <td className="fw-semibold">
//                           {formatAmount(payment.amount, payment.currency)}
//                         </td>
//                         <td>
//                           <span className="text-capitalize">
//                             {payment.payment_method || 'N/A'}
//                           </span>
//                         </td>
//                         <td>
//                           <span className={`badge ${getStatusBadgeClass(payment.status)}`}>
//                             {payment.status || 'Inconnu'}
//                           </span>
//                         </td>
//                         <td>
//                           <button
//                             className="btn btn-sm btn-outline-primary"
//                             onClick={() => {
//                               // Implement payment details modal or navigation
//                               toast.info('Détails du paiement non implémenté');
//                             }}
//                           >
//                             <Icon icon="solar:eye-outline" />
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>
//           <div className="card-footer d-flex justify-content-between align-items-center">
//             <div className="text-muted small">
//               {filteredPayments.length} paiement(s) trouvé(s)
//             </div>
//             <div className="d-flex gap-2">
//               <button
//                 className="btn btn-sm btn-outline-secondary"
//                 onClick={() => {
//                   setSearchTerm('');
//                   setStatusFilter('');
//                 }}
//                 disabled={!searchTerm && !statusFilter}
//               >
//                 <Icon icon="solar:restart-outline" className="me-1" />
//                 Réinitialiser
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MyPaymentList;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Icon } from '@iconify/react/dist/iconify.js';
import { jwtDecode } from 'jwt-decode';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const MyPaymentList = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [licence, setLicence] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const token = localStorage.getItem('token');
  const decodedToken = token ? jwtDecode(token) : null;
  const userId = decodedToken?.sub;

  useEffect(() => {
    const fetchData = async () => {
      if (!token || !userId) {
        setError('Veuillez vous connecter pour voir vos paiements');
        setLoading(false);
        return;
      }
      try {
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };
        const userResponse = await axios.get('http://localhost:5000/auth/profile', config);
        const user = userResponse.data.user || userResponse.data;

        if (!user || !user.entreprise) {
          setError("Aucune entreprise associée à votre compte");
          setLoading(false);
          return;
        }

        const companyId = user.entreprise._id || user.entreprise;
        const licenceResponse = await axios.get(
          `http://localhost:5000/licences/mongo/${companyId}`,
          config
        );
        if (!licenceResponse.data || !licenceResponse.data.id) {
          throw new Error('Aucune licence trouvée pour votre entreprise');
        }

        const licenceData = licenceResponse.data;
        setLicence(licenceData);

        const paymentsResponse = await axios.get(
          `http://localhost:5000/api/payments/licence/${licenceData.id}`,
          config
        );
        let paymentsData = [];
        if (Array.isArray(paymentsResponse.data)) {
          paymentsData = paymentsResponse.data;
        } else if (paymentsResponse.data?.data) {
          paymentsData = Array.isArray(paymentsResponse.data.data)
            ? paymentsResponse.data.data
            : [paymentsResponse.data.data];
        }
        setPayments(paymentsData);
      } catch (err) {
        setError(err.message || 'Erreur lors du chargement des paiements');
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token, userId]);

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.payment_method?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.amount?.toString().includes(searchTerm);
    const matchesStatus = statusFilter ? payment.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  const statuses = [...new Set(payments.map((p) => p.status).filter(Boolean))];

  const formatDate = (dateString) =>
    dateString
      ? new Date(dateString).toLocaleString('fr-FR')
      : 'N/A';

  const formatAmount = (amount, currency = 'TND') =>
    amount != null
      ? new Intl.NumberFormat('fr-FR', {
          style: 'currency',
          currency
        }).format(amount)
      : 'N/A';

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
      case 'succeeded':
        return 'bg-success';
      case 'pending':
      case 'processing':
        return 'bg-warning';
      case 'failed':
      case 'canceled':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  };

  if (loading) {
    return (
      <div className="text-center p-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
        <p className="mt-2">Chargement de l&apos;historique des paiements...</p>
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
              <Icon icon="solar:bill-list-outline" className="me-2" />
              Mes paiements
            </h5>
            <div className="d-flex gap-2">
              <div className="input-group input-group-sm" style={{ width: '250px' }}>
                <span className="input-group-text">
                  <Icon icon="solar:magnifer-outline" />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                className="form-select form-select-sm"
                style={{ width: 'auto' }}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Tous les statuts</option>
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="card-body">
            {filteredPayments.length === 0 ? (
              <div className="text-center py-5">
                <Icon icon="solar:bill-check-outline" style={{ fontSize: '3rem', opacity: 0.5 }} />
                <h5>Aucun paiement trouvé</h5>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table striped-table mb-0">
                  <thead>
                    <tr>
                      <th>Référence</th>
                      <th>Date</th>
                      <th>Montant</th>
                      <th>Méthode</th>
                      <th>Statut</th>
                      <th className="text-center">Invoices</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPayments.map((payment) => (
                      <tr key={payment?._id}>
                        <td className="text-nowrap">
                          <small className="text-muted">#</small>
                          {payment?.id ? `${payment.id}` : 'N/A'}
                        </td>
                        <td>{formatDate(payment.payment_date || payment.createdAt)}</td>
                        <td className="fw-semibold">{formatAmount(payment.amount, payment.currency)}</td>
                        <td className="text-capitalize">{payment.payment_method || 'N/A'}</td>
                        <td>
                          <span className={`badge ${getStatusBadgeClass(payment.status)}`}>
                            {payment.status || 'Inconnu'}
                          </span>
                        </td>
                        <td className="text-center">
                          <Link
                            to={`/PaymentDetail/${payment.id}`}
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
                {filteredPayments.length} paiement(s) trouvé(s)
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPaymentList;
