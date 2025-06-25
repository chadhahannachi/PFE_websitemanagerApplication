import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Alert, CircularProgress } from "@mui/material";
import PageBannerTitle from "../../components/Common/PageBannerTitle.js";
import banner from '../../images/page-banner/page-banner-img-19.jpg'
import NavbarStyleTwo from "../../components/Layout/NavbarStyleTwo.js";
import { loadStripe } from '@stripe/stripe-js';
import { toast } from 'react-toastify';

const LicenceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [licence, setLicence] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    fetchLicenceDetails();
  }, [id]);

  const fetchLicenceDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/licences/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setLicence(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching licence details:', error);
      setError('Erreur lors du chargement des détails de la licence');
      setLoading(false);
    }
  };

//   const handlePayment = async () => {
//     try {
//       setProcessingPayment(true);
//       const token = localStorage.getItem('token');
      
//       // Appel à l'API Nest.js pour créer une session de paiement
//       const response = await axios.post(
//         'http://localhost:5000/api/stripe/create-checkout-session',
//         {
//           licenceId: id,
//           amount: licence.price,
//           currency: 'eur'
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );

//       // Redirection vers la page de paiement Stripe
//       if (response.data.url) {
//         window.location.href = response.data.url;
//       } else {
//         throw new Error('URL de paiement non reçue');
//       }
//     } catch (error) {
//       console.error('Payment error:', error);
//       toast.error(error.response?.data?.message || 'Erreur lors du traitement du paiement');
//       setProcessingPayment(false);
//     }
//   };


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
  
      console.log('Données envoyées:', { licenceId: id, amount: licence.price, currency: 'eur' });
  
      const response = await axios.post(
        'http://localhost:5000/api/stripe/create-checkout-session',
        {
          licenceId: id,
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
  

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container pt-5">
        <Alert severity="error">{error}</Alert>
      </div>
    );
  }

  if (!licence) {
    return (
      <div className="container pt-5">
        <Alert severity="info">Licence non trouvée</Alert>
      </div>
    );
  }

  return (
    <>  
          <NavbarStyleTwo />

    {/* <PageBannerTitle 
    title="Details de votre licence " 
    homeText="Home" 
    homeUrl="/" 
    image={banner}
  /> */}
  
    <div className="chackout-area ptb-175">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="chackout-content your-booking">
              <h4>Détails de la Licence</h4>
              <h3>{licence.type === 'basic' ? 'Licence Basique' : 'Licence Premium'}</h3>

              <div className="d-flex align-items-center mb-40">
                <div className="flex-shrink-0">
                  <img
                    src={licence.type === 'basic' ? "/images/basic-license.png" : "/images/premium-license.png"}
                    alt="licence type"
                    style={{ width: '136px', height: '136px', objectFit: 'cover' }}
                  />
                </div>

                <div className="flex-grow-1 ms-4">
                  <ul className="ps-0 pe-0 mb-3 list-unstyled d-flex align-items-center">
                    {[...Array(5)].map((_, index) => (
                      <li key={index} className="me-1">
                        <i
                          className="ri-star-fill"
                          style={{ color: "#FFC107", fontSize: "18px" }}
                        ></i>
                      </li>
                    ))}
                  </ul>

                  <span>Entreprise: {licence.company_name}</span>
                  <h6>Statut: {licence.status}</h6>
                  <span>Email: {licence.company_email}</span>
                </div>
              </div>

              <div className="row g-0">
                <div className="col-lg-6">
                  <div className="date-wrap border-right">
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="">
                        <span className="date-title">Date de début</span>
                        <span className="date">{new Date(licence.start_date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-6">
                  <div className="date-wrap">
                    <div className="d-flex align-items-center justify-content-between">
                      <div>
                        <span className="date-title">Date de fin</span>
                        <span className="date">{new Date(licence.end_date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-40"></div>

              <h3>Détails de la licence</h3>

              <ul className="booking-list ps-0 pe-0 list-unstyled">
                <li>
                  <span>Clé de licence</span>
                  {licence.license_key}
                </li>
                <li>
                  <span>Type</span>
                  {licence.type === 'basic' ? 'Basique' : 'Premium'}
                </li>
                <li>
                  <span>Prix</span>
                  {licence.price} €
                </li>
                <li>
                  <span>Statut</span>
                  {licence.status}
                </li>
                {licence.description && (
                  <li>
                    <span>Description</span>
                    {licence.description}
                  </li>
                )}
              </ul>

              <button
                type="submit"
                className="default-btn rounded-10 active border-0"
                onClick={() => window.history.back()}
              >
                Retour
              </button>

              <button
                type="submit"
                className="default-btn rounded-10 active border-0"
                onClick={handlePayment}
                disabled={processingPayment}
              >
                {processingPayment ? 'En cours...' : 'Payer'}
              </button>

            </div>
          </div>
        </div>
      </div>
    </div>
  </>);
};

export default LicenceDetail;
