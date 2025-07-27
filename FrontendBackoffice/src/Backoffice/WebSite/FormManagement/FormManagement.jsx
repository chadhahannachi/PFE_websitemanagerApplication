import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Formik, FieldArray } from 'formik';
import * as yup from 'yup';
import { Icon } from '@iconify/react/dist/iconify.js';

const FIELD_TYPES = [
  { value: 'text', label: 'Texte' },
  { value: 'number', label: 'Nombre' },
  { value: 'date', label: 'Date' },
  { value: 'email', label: 'Email' },
  { value: 'textarea', label: 'Zone de texte' },
];

const FormManagement = () => {
  // State
  const [entreprises, setEntreprises] = useState([]);
  const [selectedEntreprise, setSelectedEntreprise] = useState('');
  const [forms, setForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);
  const [responses, setResponses] = useState([]);
  const [showFormCreation, setShowFormCreation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Fetch companies on mount
  useEffect(() => {
    const fetchEntreprises = async () => {
      try {
        const res = await axios.get('http://localhost:5000/entreprises');
        setEntreprises(res.data);
      } catch (err) {
        setSnackbar({ open: true, message: "Erreur lors de la récupération des entreprises", severity: 'error' });
      }
    };
    fetchEntreprises();
  }, []);

  // Fetch forms when entreprise changes
  useEffect(() => {
    if (!selectedEntreprise) return;
    const fetchForms = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:5000/formulaires/entreprise/${selectedEntreprise}/formulaires`);
        setForms(res.data);
      } catch (err) {
        setSnackbar({ open: true, message: "Erreur lors de la récupération des formulaires", severity: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchForms();
    setSelectedForm(null);
    setResponses([]);
  }, [selectedEntreprise]);

  // Fetch responses when form changes
  useEffect(() => {
    if (!selectedForm) return;
    const fetchResponses = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:5000/formulaires/reponse/formulaire/${selectedForm._id}`);
        setResponses(res.data);
      } catch (err) {
        setSnackbar({ open: true, message: "Erreur lors de la récupération des réponses", severity: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchResponses();
  }, [selectedForm]);

  // Validation schema for form creation
  const formSchema = yup.object().shape({
    titre: yup.string().required('Titre requis'),
    champs: yup.array().of(
      yup.object().shape({
        nom: yup.string().required('Nom requis'),
        type: yup.string().required('Type requis'),
      })
    ).min(1, 'Ajouter au moins un champ'),
  });

  // Validation for filling a form (dynamic)
  const getResponseSchema = (fields) => {
    const shape = {};
    fields.forEach(f => {
      if (f.type === 'number') shape[f.nom] = yup.number().typeError('Doit être un nombre').required('Requis');
      else if (f.type === 'email') shape[f.nom] = yup.string().email('Email invalide').required('Requis');
      else shape[f.nom] = yup.string().required('Requis');
    });
    return yup.object().shape(shape);
  };

  // Handlers
  const handleEntrepriseChange = (e) => {
    setSelectedEntreprise(e.target.value);
    setShowFormCreation(false);
  };

  const handleCreateForm = async (values, { resetForm }) => {
    try {
      const champs = {};
      values.champs.forEach(f => { champs[f.nom] = f.type; });
      await axios.post('http://localhost:5000/formulaires', {
        titre: values.titre,
        champs,
        entreprise: selectedEntreprise,
      });
      setSnackbar({ open: true, message: 'Formulaire créé !', severity: 'success' });
      setShowFormCreation(false);
      resetForm();
      // Refresh forms
      const res = await axios.get(`http://localhost:5000/formulaires/entreprise/${selectedEntreprise}/formulaires`);
      setForms(res.data);
    } catch (err) {
      setSnackbar({ open: true, message: "Erreur lors de la création du formulaire", severity: 'error' });
    }
  };

  const handleSelectForm = (form) => {
    setSelectedForm(form);
    setResponses([]);
  };

  const handleSubmitResponse = async (values, { resetForm }) => {
    try {
      await axios.post('http://localhost:5000/formulaires/reponse', {
        values,
        formulaire: selectedForm._id,
      });
      setSnackbar({ open: true, message: 'Réponse enregistrée !', severity: 'success' });
      resetForm();
      // Refresh responses
      const res = await axios.get(`http://localhost:5000/formulaires/reponse/formulaire/${selectedForm._id}`);
      setResponses(res.data);
    } catch (err) {
      setSnackbar({ open: true, message: "Erreur lors de l'envoi de la réponse", severity: 'error' });
    }
  };

  // UI
  return (
    <div className="container-fluid py-4">
      <div className="row mb-4 align-items-center">
        <div className="col-md-4">
          <label className="form-label">Entreprise</label>
          <select className="form-select" value={selectedEntreprise} onChange={handleEntrepriseChange}>
            <option value="">Sélectionner une entreprise</option>
            {entreprises.map(e => (
              <option key={e._id} value={e._id}>{e.nom}</option>
            ))}
          </select>
        </div>
        <div className="col-md-4">
          {selectedEntreprise && (
            <button className="btn btn-primary mt-3" onClick={() => setShowFormCreation(v => !v)}>
              <Icon icon="solar:add-circle-outline" className="me-1" />
              {showFormCreation ? 'Annuler' : 'Créer un formulaire'}
            </button>
          )}
        </div>
      </div>

      {/* Form creation */}
      {showFormCreation && (
        <div className="card mb-4">
          <div className="card-header"><b>Créer un formulaire</b></div>
          <div className="card-body">
            <Formik
              initialValues={{ titre: '', champs: [{ nom: '', type: 'text' }] }}
              validationSchema={formSchema}
              onSubmit={handleCreateForm}
            >
              {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Titre du formulaire</label>
                    <input
                      type="text"
                      name="titre"
                      className="form-control"
                      value={values.titre}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                    />
                    {touched.titre && errors.titre && <div className="text-danger small">{errors.titre}</div>}
                  </div>
                  <FieldArray name="champs">
                    {({ push, remove }) => (
                      <div>
                        <label className="form-label">Champs</label>
                        {values.champs.map((champ, idx) => (
                          <div className="row mb-2" key={idx}>
                            <div className="col-md-5">
                              <input
                                type="text"
                                name={`champs[${idx}].nom`}
                                className="form-control"
                                placeholder="Nom du champ"
                                value={champ.nom}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                              />
                              {touched.champs && touched.champs[idx] && errors.champs && errors.champs[idx] && errors.champs[idx].nom && (
                                <div className="text-danger small">{errors.champs[idx].nom}</div>
                              )}
                            </div>
                            <div className="col-md-5">
                              <select
                                name={`champs[${idx}].type`}
                                className="form-select"
                                value={champ.type}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                              >
                                {FIELD_TYPES.map(ft => (
                                  <option key={ft.value} value={ft.value}>{ft.label}</option>
                                ))}
                              </select>
                              {touched.champs && touched.champs[idx] && errors.champs && errors.champs[idx] && errors.champs[idx].type && (
                                <div className="text-danger small">{errors.champs[idx].type}</div>
                              )}
                            </div>
                            <div className="col-md-2 d-flex align-items-center">
                              {values.champs.length > 1 && (
                                <button type="button" className="btn btn-link text-danger" onClick={() => remove(idx)}>
                                  <Icon icon="mdi:delete-outline" />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                        <button type="button" className="btn btn-outline-primary btn-sm mt-2" onClick={() => push({ nom: '', type: 'text' })}>
                          <Icon icon="solar:add-circle-outline" className="me-1" /> Ajouter un champ
                        </button>
                      </div>
                    )}
                  </FieldArray>
                  <button type="submit" className="btn btn-success mt-3">
                    <Icon icon="mdi:content-save-outline" className="me-1" /> Enregistrer
                  </button>
                </form>
              )}
            </Formik>
          </div>
        </div>
      )}

      {/* List forms for entreprise */}
      {selectedEntreprise && !showFormCreation && (
        <div className="card mb-4">
          <div className="card-header"><b>Formulaires de l'entreprise</b></div>
          <div className="card-body">
            {loading ? (
              <div>Chargement...</div>
            ) : forms.length === 0 ? (
              <div className="text-muted">Aucun formulaire trouvé.</div>
            ) : (
              <ul className="list-group">
                {forms.map(form => (
                  <li key={form._id} className={`list-group-item d-flex justify-content-between align-items-center ${selectedForm && selectedForm._id === form._id ? 'active' : ''}`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleSelectForm(form)}
                  >
                    <span><Icon icon="mdi:form-select" className="me-2" />{form.titre}</span>
                    <Icon icon="mdi:chevron-right" />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* Fill form and show responses */}
      {selectedForm && (
        <div className="row">
          {/* Fill form */}
          <div className="col-md-6">
            <div className="card mb-4">
              <div className="card-header"><b>Remplir le formulaire : {selectedForm.titre}</b></div>
              <div className="card-body">
                <Formik
                  initialValues={Object.keys(selectedForm.champs).reduce((acc, key) => ({ ...acc, [key]: '' }), {})}
                  validationSchema={getResponseSchema(Object.entries(selectedForm.champs).map(([nom, type]) => ({ nom, type })))}
                  onSubmit={handleSubmitResponse}
                  enableReinitialize
                >
                  {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                      {Object.entries(selectedForm.champs).map(([nom, type], idx) => (
                        <div className="mb-3" key={idx}>
                          <label className="form-label">{nom}</label>
                          {type === 'textarea' ? (
                            <textarea
                              name={nom}
                              className="form-control"
                              value={values[nom]}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              required
                            />
                          ) : (
                            <input
                              type={type}
                              name={nom}
                              className="form-control"
                              value={values[nom]}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              required
                            />
                          )}
                          {touched[nom] && errors[nom] && <div className="text-danger small">{errors[nom]}</div>}
                        </div>
                      ))}
                      <button type="submit" className="btn btn-primary mt-2">
                        <Icon icon="mdi:send-outline" className="me-1" /> Envoyer
                      </button>
                    </form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
          {/* Show responses */}
          <div className="col-md-6">
            <div className="card mb-4">
              <div className="card-header"><b>Réponses au formulaire</b></div>
              <div className="card-body">
                {loading ? (
                  <div>Chargement...</div>
                ) : responses.length === 0 ? (
                  <div className="text-muted">Aucune réponse pour ce formulaire.</div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          {Object.keys(selectedForm.champs).map((champ, idx) => (
                            <th key={idx}>{champ}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {responses.map((resp, idx) => (
                          <tr key={idx}>
                            {Object.keys(selectedForm.champs).map((champ, j) => (
                              <td key={j}>{resp.values[champ]}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Snackbar */}
      {snackbar.open && (
        <div className={`alert alert-${snackbar.severity} position-fixed`} style={{ top: 80, right: 20, zIndex: 9999 }}>
          {snackbar.message}
        </div>
      )}
    </div>
  );
};

export default FormManagement; 