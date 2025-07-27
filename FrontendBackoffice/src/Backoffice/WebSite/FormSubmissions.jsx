import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { Icon } from '@iconify/react/dist/iconify.js';

const FormSubmissions = () => {
  const [userEntreprise, setUserEntreprise] = useState(null);
  const [formulaires, setFormulaires] = useState([]);
  const [selectedFormulaire, setSelectedFormulaire] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [searchTerm, setSearchTerm] = useState('');
  const [userId, setUserId] = useState(null);

  const token = localStorage.getItem("token");

  // Detect entreprise of connected user
  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserId(decodedToken.sub);
      } catch (error) {
        setSnackbar({ open: true, message: "Erreur lors du décodage du token.", severity: "error" });
      }
    }
  }, [token]);

  useEffect(() => {
    const fetchUserEntreprise = async () => {
      if (!token || !userId) return;
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const userResponse = await axios.get(`http://localhost:5000/auth/user/${userId}`, config);
        setUserEntreprise(userResponse.data.entreprise);
      } catch (error) {
        setSnackbar({ open: true, message: "Erreur lors de la récupération des données utilisateur.", severity: "error" });
      }
    };
    if (userId) fetchUserEntreprise();
  }, [userId, token]);

  // Fetch forms for the entreprise
  useEffect(() => {
    if (!userEntreprise) {
      setFormulaires([]);
      setSelectedFormulaire(null);
      setResponses([]);
      return;
    }
    const fetchFormulaires = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:5000/formulaires/entreprise/${userEntreprise}/formulaires`);
        setFormulaires(res.data);
        setSelectedFormulaire(null);
        setResponses([]);
      } catch (err) {
        setSnackbar({ open: true, message: "Erreur lors de la récupération des formulaires", severity: 'error' });
        setFormulaires([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFormulaires();
  }, [userEntreprise]);

  // Après avoir récupéré les formulaires, sélectionne automatiquement s'il n'y en a qu'un
  useEffect(() => {
    if (formulaires.length === 1) {
      setSelectedFormulaire(formulaires[0]);
    }
  }, [formulaires]);

  // Fetch responses when formulaire changes
  useEffect(() => {
    if (!selectedFormulaire) {
      setResponses([]);
      return;
    }
    const fetchResponses = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:5000/formulaires/reponse/formulaire/${selectedFormulaire._id}`);
        setResponses(res.data);
      } catch (err) {
        setSnackbar({ open: true, message: "Erreur lors de la récupération des réponses", severity: 'error' });
        setResponses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchResponses();
  }, [selectedFormulaire]);

  // Filter responses based on search term
  const filteredResponses = responses.filter(response => {
    if (!searchTerm) return true;
    return Object.values(response.values).some(value => 
      value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleFormulaireSelect = (formulaire) => {
    setSelectedFormulaire(formulaire);
    setSearchTerm('');
  };

  const exportToCSV = () => {
    if (!selectedFormulaire || filteredResponses.length === 0) return;

    const headers = Object.keys(selectedFormulaire.champs);
    const csvContent = [
      headers.join(','),
      ...filteredResponses.map(response => 
        headers.map(header => {
          const value = response.values[header] || '';
          // Escape commas and quotes in CSV
          return `"${value.toString().replace(/"/g, '""')}"`;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${selectedFormulaire.titre}_reponses.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container-fluid py-4">
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <Icon icon="mdi:form-select" className="me-2" />
                Form Submissions
              </h5>
            </div>
            <div className="card-body">
              {!userEntreprise ? (
                <div className="alert alert-info">Aucune entreprise associée à votre compte.</div>
              ) : loading ? (
                <div className="text-center py-3">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Chargement...</span>
                  </div>
                </div>
              ) : formulaires.length === 0 ? (
                <div className="alert alert-info">
                  Aucun formulaire trouvé pour votre entreprise.
                </div>
              ) : selectedFormulaire ? (
                <div className="row">
                  <div className="col-12">
                    <div className="card">
                      <div className="card-header d-flex justify-content-between align-items-center">
                        <h6 className="mb-0">
                          Réponses au formulaire : {selectedFormulaire.titre}
                        </h6>
                        <div className="d-flex gap-2">
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="Rechercher dans les réponses..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: '250px' }}
                          />
                          <button 
                            className="btn btn-outline-success btn-sm"
                            onClick={exportToCSV}
                            disabled={filteredResponses.length === 0}
                          >
                            <Icon icon="mdi:download" className="me-1" />
                            Exporter CSV
                          </button>
                        </div>
                      </div>
                      <div className="card-body">
                        {responses.length === 0 ? (
                          <div className="alert alert-info text-center">
                            Aucune réponse trouvée pour ce formulaire.
                          </div>
                        ) : (
                          <div className="table-responsive">
                            <table className="table vertical-striped-table mb-0">
                              <thead>
                                <tr>
                                  <th scope="col">#</th>
                                  {Object.keys(selectedFormulaire.champs).map((champ, idx) => (
                                    <th key={idx} scope="col">{champ}</th>
                                  ))}
                                  <th scope="col">Date de soumission</th>
                                </tr>
                              </thead>
                              <tbody>
                                {filteredResponses.map((response, idx) => (
                                  <tr key={response._id || idx}>
                                    <td>{idx + 1}</td>
                                    {Object.keys(selectedFormulaire.champs).map((champ, j) => (
                                      <td key={j}>
                                        {typeof response.values[champ] === 'string' && response.values[champ].length > 50 
                                          ? `${response.values[champ].substring(0, 50)}...` 
                                          : response.values[champ] || '-'}
                                      </td>
                                    ))}
                                    <td>
                                      {response.createdAt ? 
                                        new Date(response.createdAt).toLocaleDateString('fr-FR', {
                                          year: 'numeric',
                                          month: 'long',
                                          day: 'numeric',
                                          hour: '2-digit',
                                          minute: '2-digit'
                                        }) : 
                                        '-'
                                      }
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                            {searchTerm && filteredResponses.length !== responses.length && (
                              <div className="text-muted mt-2">
                                Affichage de {filteredResponses.length} sur {responses.length} réponses
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* Snackbar */}
      {snackbar.open && (
        <div className={`alert alert-${snackbar.severity} position-fixed`} style={{ top: 80, right: 20, zIndex: 9999 }}>
          {snackbar.message}
        </div>
      )}
    </div>
  );
};

export default FormSubmissions;