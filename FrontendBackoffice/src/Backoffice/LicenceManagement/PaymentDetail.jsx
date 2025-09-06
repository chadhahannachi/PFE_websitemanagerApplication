import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useReactToPrint } from "react-to-print";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const PaymentDetail = () => {
  const { id } = useParams();
  const [payment, setPayment] = useState(null);
  const [licence, setLicence] = useState(null);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const invoiceRef = useRef();

//   const handlePrint = useReactToPrint({
//     content: () => invoiceRef.current,
//     documentTitle: `Facture-${payment?.id || "invoice"}`,
//   });

const handlePrint = useReactToPrint({
    content: () => {
      if (!invoiceRef.current) {
        alert("Erreur : la facture à imprimer n'est pas trouvée dans la page.");
        return null;
      }
      return invoiceRef.current;
    },
    documentTitle: `Facture-${payment?.id || "invoice"}`,
    onPrintError: (error) => {
      alert("Erreur lors de l'impression : " + error);
      console.error("Erreur d'impression:", error);
    },
  });
  
  

  const handleDownloadPDF = async () => {
    const element = invoiceRef.current;
    if (!element) return;
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Facture-${payment?.id || "invoice"}.pdf`);
  };

  useEffect(() => {
    const fetchPaymentDetail = async () => {
      setLoading(true);
      try {
        // Récupérer le paiement
        // const response = await axios.get(`http://localhost:5000/payments/${id}`);
        const response = await axios.get(`http://localhost:5000/api/payments/${id}`);
        const paymentData = response.data.data;
        setPayment(paymentData);
        // Récupérer la licence
        let licenceData = paymentData.licence;
        if (!licenceData && paymentData.licence_id) {
          const licenceRes = await axios.get(`http://localhost:5000/licences/${paymentData.licence_id}`);
          licenceData = licenceRes.data.data || licenceRes.data;
        }
        setLicence(licenceData);
        // Récupérer l'entreprise
        if (licenceData && licenceData.mongo_company_id) {
          const companyRes = await axios.get(`http://localhost:5000/entreprises/${licenceData.mongo_company_id}`);
          setCompany(companyRes.data.data || companyRes.data);
        }
        setLoading(false);
      } catch (err) {
        setError("Erreur lors de la récupération du paiement.");
        setLoading(false);
      }
    };
    fetchPaymentDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center p-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
        <p className="mt-2">Chargement du paiement...</p>
      </div>
    );
  }

  if (error || !payment) {
    return (
      <div className="alert alert-danger" role="alert">
        <Icon icon="solar:danger-circle-bold" className="me-2" />
        {error || "Paiement introuvable."}
      </div>
    );
  }

  // Formatage des dates
  const formatDate = (dateStr) => dateStr ? new Date(dateStr).toLocaleDateString() : '';
  const formatDateTime = (dateStr) => dateStr ? new Date(dateStr).toLocaleString() : '';

  // Statut badge
  const getStatusBadge = (status) => {
    if (status === 'paid' || status === 'succeeded') return 'bg-success';
    if (status === 'pending' || status === 'pending_verification') return 'bg-warning';
    if (status === 'failed') return 'bg-danger';
    return 'bg-secondary';
  };


  const printStyles = `
  @media print {
    body * {
      visibility: hidden;
    }
    #invoice, #invoice * {
      visibility: visible;
    }
    #invoice {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
    }
  }
`;


  return (
    <div className="card">
        <style>{printStyles}</style>

      <div className="card-header">
        <div className="d-flex flex-wrap align-items-center justify-content-end gap-2">
          {/* <Link
            to="#"
            className="btn btn-sm btn-primary-600 radius-8 d-inline-flex align-items-center gap-1"
          >
            <Icon icon="pepicons-pencil:paper-plane" className="text-xl" />
            Envoyer le reçu
          </Link> */}

          <button className="btn btn-sm btn-warning radius-8 d-inline-flex align-items-center gap-1" onClick={handleDownloadPDF}>
          <Icon icon="solar:download-linear" className="text-xl" />
                <span className="iconify" data-icon="mdi:file-pdf-box" /> Télécharger PDF
              </button>


              {/* <button className="btn btn-sm btn-danger radius-8 d-inline-flex align-items-center gap-1" onClick={handlePrint}>
              <Icon icon="basil:printer-outline" className="text-xl" />
                <span className="iconify" data-icon="mdi:printer" /> Imprimer
              </button> */}


          {/* <button
            type="button"
            className="btn btn-sm btn-danger radius-8 d-inline-flex align-items-center gap-1"
          >
            <Icon icon="basil:printer-outline" className="text-xl" />
            Imprimer
          </button> */}
        </div>
      </div>
      <div className="card-body py-40">
        <div className="row justify-content-center" id="invoice">
          <div className="col-lg-8">
            {/* Facture à imprimer/télécharger */}
            <div className="shadow-4 border radius-8" ref={invoiceRef}>
              
            <div className="p-20 d-flex flex-wrap justify-content-between gap-3 border-bottom">
            <img src="/assets/images/logo.png" alt="logo" className="mb-8" style={{maxHeight:'60px', maxWidth:'200px'}} />
              </div>

              <div className="p-20 d-flex flex-wrap justify-content-between gap-3 border-bottom">
                <div>
                  <h3 className="text-xl">Paiement #{payment.id || payment._id}</h3>
                  <p className="mb-1 text-sm">Date du paiement : {formatDateTime(payment.payment_date)}</p>
                  <p className="mb-0 text-sm">Statut : <span className={`badge ${getStatusBadge(payment.status)}`}>{payment.status}</span></p>
                </div>
                <div>
                  <img src={company?.logo || "/assets/images/logo.png"} alt="logo" className="mb-8" style={{maxHeight:40}} />
                  <p className="mb-1 text-sm">
                    {company?.adresse || 'Adresse inconnue'}
                  </p>
                  <p className="mb-0 text-sm">{company?.contact || ''}{company?.numTel ? ', ' + company.numTel : ''}</p>
                </div>
              </div>
              <div className="py-28 px-20">
                <div className="d-flex flex-wrap justify-content-between align-items-end gap-3">
                  <div>
                    <h6 className="text-md">Payé par :</h6>
                    <table className="text-sm text-secondary-light">
                      <tbody>
                        <tr>
                          <td>Entreprise</td>
                          <td className="ps-8">: {company?.nom || 'Entreprise inconnue'}</td>
                        </tr>
                        <tr>
                          <td>Email</td>
                          <td className="ps-8">: {company?.contact || ''}</td>
                        </tr>
                        <tr>
                          <td>Téléphone</td>
                          <td className="ps-8">: {company?.numTel || ''}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div>
                    <table className="text-sm text-secondary-light">
                      <tbody>
                        <tr>
                          <td>Type de licence</td>
                          <td className="ps-8">: {licence?.type || ''}</td>
                        </tr>
                        <tr>
                          <td>Clé de licence</td>
                          <td className="ps-8">: {licence?.license_key || ''}</td>
                        </tr>
                        <tr>
                          <td>Statut licence</td>
                          <td className="ps-8">: <span className={`badge ${getStatusBadge(licence?.status)}`}>{licence?.status}</span></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="mt-24">
                  <div className="table-responsive scroll-sm">
                    <table className="table bordered-table text-sm">
                      <thead>
                        <tr>
                          <th>SL.</th>
                          <th>Description</th>
                          <th>Méthode</th>
                          <th>Montant</th>
                          <th>Devise</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>01</td>
                          <td>{licence?.description || '-'}</td>
                          <td>{payment.payment_method}</td>
                          <td>{payment.amount}</td>
                          <td>{payment.currency}</td>
                          <td>{formatDateTime(payment.payment_date)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="d-flex flex-wrap justify-content-between gap-3 mt-3">
                    {/* <div>
                      <p className="text-sm mb-0">
                        <span className="text-primary-light fw-semibold">Stripe Payment Intent:</span> {payment.stripe_payment_intent_id || '-'}
                      </p>
                      <p className="text-sm mb-0">
                        <span className="text-primary-light fw-semibold">Stripe Checkout Session:</span> {payment.stripe_checkout_session_id || '-'}
                      </p>
                    </div> */}
                    <div>
                      <table className="text-sm">
                        <tbody>
                          <tr>
                            <td className="pe-64">Total payé :</td>
                            <td className="pe-16">
                              <span className="text-primary-light fw-semibold">{payment.amount} {payment.currency}</span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div className="mt-64">
                  <p className="text-center text-secondary-light text-sm fw-semibold">
                    Merci pour votre paiement !
                  </p>
                </div>
                <div className="d-flex flex-wrap justify-content-between align-items-end mt-64">
                  <div className="text-sm border-top d-inline-block px-12">
                    Signature du client
                  </div>
                  <div className="text-sm border-top d-inline-block px-12">
                    Signature de l'administrateur
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetail; 