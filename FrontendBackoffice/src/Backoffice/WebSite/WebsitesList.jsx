import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Icon } from "@iconify/react";

const WebsitesList = () => {
  const [entreprises, setEntreprises] = useState([]);
  const [licenceStatusByCompany, setLicenceStatusByCompany] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEntreprises = async () => {
      try {
        const response = await axios.get("http://localhost:5000/entreprises");
        const mappedData = response.data.map((entreprise) => ({
          id: entreprise._id,
          nom: entreprise.nom,
          logo: entreprise.logo, // Assure-toi que le champ logo existe côté backend
          contact: entreprise.contact,
          numTel: entreprise.numTel,
        }));
        setEntreprises(mappedData);

        // Récupérer la licence pour chaque entreprise
        const token = localStorage.getItem("token");
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        const licenceStatusObj = {};
        await Promise.all(
          mappedData.map(async (entreprise) => {
            try {
              const res = await axios.get(`http://localhost:5000/licences/mongo/${entreprise.id}`, config);
              licenceStatusObj[entreprise.id] = res.data || null;
            } catch (e) {
              licenceStatusObj[entreprise.id] = null;
            }
          })
        );
        setLicenceStatusByCompany(licenceStatusObj);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchEntreprises();
  }, []);

  if (loading) {
    return (
      <div className="text-center p-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
        <p className="mt-2">Chargement des websites...</p>
      </div>
    );
  }

  return (
    <div className='row gy-4'>
      {entreprises.map((entreprise) => {
        const licence = licenceStatusByCompany[entreprise.id];
        return (
          <div className='col-xxl-3 col-lg-4 col-sm-6' key={entreprise.id}>
            <div className='card h-100 p-0 radius-12 overflow-hidden'>
              <div className='card-body p-0'>
                <Link
                  to={`/CompanyDetail/${entreprise.id}`}
                  className='w-100 max-h-266-px radius-0 overflow-hidden d-flex align-items-center justify-content-center'
                  style={{ background: "#f8f9fa", minHeight: 120 }}
                >
                  {entreprise.logo ? (
                    <img
                      src={entreprise.logo}
                      alt={entreprise.nom}
                      className='w-100 h-100 object-fit-cover'
                      style={{ maxHeight: 120, objectFit: "contain" }}
                    />
                  ) : (
                    <Icon icon="solar:building-outline" style={{ fontSize: 60, color: "#bbb" }} />
                  )}
                </Link>
                <div className='p-20 d-flex flex-column align-items-center'>
                  <h6 className="mb-8 text-center w-100">
                    <Link
                      to={`/CompanyDetail/${entreprise.id}`}
                      className="text-line-2 text-hover-primary-600 text-xl transition-2"
                    >
                      {entreprise.nom}
                    </Link>
                  </h6>
                  <div className="mb-2 text-center w-100">
                    <div className="text-neutral-500">{entreprise.contact || "-"}</div>
                    <div className="text-neutral-500">{entreprise.numTel || "-"}</div>
                  </div>
                  <div className="mb-2 text-center w-100 mt-3">
                    <strong>Licence :</strong>{' '}
                    {licence ? (
                      <>
                        <span
                          className={`badge text-sm fw-semibold rounded-pill px-20 py-9 ${
                            licence.status === "validated"
                              ? "bg-success-100 text-success-600"
                              : licence.status === "pending"
                              ? "bg-warning-100 text-warning-600"
                              : "bg-danger-100 text-danger-600"
                          }`}
                        >
                          {licence.status}
                        </span>
                        <br />
                        <span className="text-xs text-neutral-500">
                          {licence.type ? `Type: ${licence.type}` : ""}
                          {licence.dateDebut ? ` | Début: ${new Date(licence.dateDebut).toLocaleDateString()}` : ""}
                          {licence.dateFin ? ` | Fin: ${new Date(licence.dateFin).toLocaleDateString()}` : ""}
                        </span>
                      </>
                    ) : (
                      <span className="badge text-sm fw-semibold rounded-pill px-20 py-9 bg-danger-100 text-danger-600" style={{ minWidth: 140 }}>
                        Aucune licence
                      </span>
                    )}
                  </div>
                </div>
                
                <span className='d-block border-bottom border-neutral-300 border-dashed my-2' />
                <div className="d-flex justify-content-end align-items-end p-20 pt-0 mt-auto">
                  <Link
                    to={entreprise.id ? `http://localhost:3001/homepage/${entreprise.id}/${entreprise.nom}` : '#'}
                    // href={userEntreprise ? `http://localhost:3001/PublicWebsite/${userEntreprise}/${entrepriseName}` : '#'}

                    className='btn btn-sm btn-primary-600 d-flex align-items-center gap-1 text-xs px-20 py-6 rounded-pill'
                  >
                    Preview Website
                    <i className='ri-arrow-right-double-line text-xl d-flex line-height-1' />

                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default WebsitesList;
