import React, { useState } from 'react';
import axios from "axios";
import { Icon } from '@iconify/react/dist/iconify.js';
import * as yup from "yup";
import { Formik } from 'formik';

const AddCompany = () => {
  const [initialValues] = useState({
    nom: "",
    contact: "",
    numTel: "",
    adresse: "",
    raisonSociale: "",
    idRequestLicence: ""
  });

  const handleFormSubmit = async (values) => {
    try {
      // Récupérer toutes les entreprises et vérifier côté frontend
      const all = await axios.get('http://localhost:5000/entreprises');
      if (Array.isArray(all.data) && all.data.some(ent => ent.contact === values.contact)) {
        alert('Il existe déjà une entreprise avec ce mail');
        return;
      }
      const response = await fetch('http://localhost:5000/entreprises', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      const data = await response.json();
      if (response.ok) {
        console.log('Entreprise créée avec succès:', data);
        alert('Entreprise créée avec succès !');
        // Réinitialiser le formulaire après succès
        window.location.reload();
      } else {
        console.error('Erreur lors de la création:', data.message);
        // Gestion spécifique des erreurs
        if (data.message && data.message.includes('nom')) {
          alert('Il existe déjà une entreprise avec ce nom');
        } else if (data.message) {
          alert(`Erreur: ${data.message}`);
        } else {
          alert('Une erreur est survenue lors de la création de l\'entreprise');
        }
      }
    } catch (error) {
      console.error('Erreur réseau:', error);
      alert('Erreur réseau lors de la création de l\'entreprise');
    }
  };

  return (
    <div className="col-md-12">
      <div className="card">
        <div className="card-header">
          <h5 className="card-title mb-0">Créer une nouvelle entreprise</h5>
        </div>
        <div className="card-body">
          <Formik
            onSubmit={handleFormSubmit}
            initialValues={initialValues}
            validationSchema={companySchema}
            enableReinitialize
          >
            {({ values, errors, touched, handleBlur, handleChange, handleSubmit, resetForm }) => (
              <form onSubmit={handleSubmit}>
                <div className="row mb-24 gy-3 align-items-center">
                  <label className="form-label mb-0 col-sm-2">Nom de l'entreprise</label>
                  <div className="col-sm-10">
                    <div className="icon-field">
                      <span className="icon">
                        <Icon icon="mdi:office-building-outline" />
                      </span>
                      <input
                        type="text"
                        name="nom"
                        className="form-control"
                        placeholder="Entrer le nom de l'entreprise"
                        value={values.nom}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                      />
                      {touched.nom && errors.nom && (
                        <div className="text-danger small mt-1">{errors.nom}</div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="row mb-24 gy-3 align-items-center">
                  <label className="form-label mb-0 col-sm-2">Contact</label>
                  <div className="col-sm-10">
                    <div className="icon-field">
                      <span className="icon">
                        <Icon icon="f7:person" />
                      </span>
                      <input
                        type="text"
                        name="contact"
                        className="form-control"
                        placeholder="Entrer le nom du contact"
                        value={values.contact}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                      />
                      {touched.contact && errors.contact && (
                        <div className="text-danger small mt-1">{errors.contact}</div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="row mb-24 gy-3 align-items-center">
                  <label className="form-label mb-0 col-sm-2">Téléphone</label>
                  <div className="col-sm-10">
                    <div className="icon-field">
                      <span className="icon">
                        <Icon icon="solar:phone-calling-linear" />
                      </span>
                      <input
                        type="text"
                        name="numTel"
                        className="form-control"
                        placeholder="Entrer le numéro de téléphone"
                        value={values.numTel}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                      />
                      {touched.numTel && errors.numTel && (
                        <div className="text-danger small mt-1">{errors.numTel}</div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="row mb-24 gy-3 align-items-center">
                  <label className="form-label mb-0 col-sm-2">Raison Sociale</label>
                  <div className="col-sm-10">
                    <div className="icon-field">
                      <span className="icon">
                        <Icon icon="mdi:account-badge-outline" />
                      </span>
                      <input
                        type="text"
                        name="raisonSociale"
                        className="form-control"
                        placeholder="Entrer la raison sociale"
                        value={values.raisonSociale}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                      />
                      {touched.raisonSociale && errors.raisonSociale && (
                        <div className="text-danger small mt-1">{errors.raisonSociale}</div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="row mb-24 gy-3 align-items-center">
                  <label className="form-label mb-0 col-sm-2">Adresse</label>
                  <div className="col-sm-10">
                    <div className="icon-field">
                      <span className="icon">
                        <Icon icon="solar:map-point-outline" />
                      </span>
                      <textarea
                        name="adresse"
                        className="form-control"
                        rows="3"
                        placeholder="Entrer l'adresse complète"
                        value={values.adresse}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                      />
                      {touched.adresse && errors.adresse && (
                        <div className="text-danger small mt-1">{errors.adresse}</div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="row mb-24 gy-3 align-items-center">
                  <label className="form-label mb-0 col-sm-2">ID Licence</label>
                  <div className="col-sm-10">
                    <div className="icon-field">
                      <span className="icon">
                        <Icon icon="solar:key-outline" />
                      </span>
                      <input
                        type="text"
                        name="idRequestLicence"
                        className="form-control"
                        placeholder="Entrer l'ID de licence (optionnel)"
                        value={values.idRequestLicence}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="d-flex align-items-center justify-content-center gap-3 mt-24">
                    <button 
                      type="button" 
                      className="btn rounded-pill btn-neutral-900 text-base radius-8 px-20 py-11"
                      onClick={() => {
                        // Réinitialiser le formulaire avec Formik
                        resetForm();
                      }}
                    >
                      Reset
                    </button>
                    <button type="submit" className="btn rounded-pill btn-primary-100 text-primary-600 radius-8 px-20 py-11">
                      Créer l'entreprise
                    </button>
                  </div>
                </div>
              </form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

const companySchema = yup.object().shape({
  nom: yup.string().required("Le nom de l'entreprise est requis"),
  contact: yup.string().required("Le contact est requis"),
  numTel: yup.string().required("Le numéro de téléphone est requis"),
  adresse: yup.string().required("L'adresse est requise"),
  raisonSociale: yup.string().required("La raison sociale est requise"),
  idRequestLicence: yup.string().optional(),
});

export default AddCompany;