import React, { useEffect, useState } from 'react';
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { Icon } from '@iconify/react/dist/iconify.js';
import * as yup from "yup";
import { Formik } from 'formik';

const AddMember = () => {
  const [userEntreprise, setUserEntreprise] = useState("Entreprise");
  const [entreprise, setEntreprise] = useState();
  const [initialValues, setInitialValues] = useState({
    nom: "",
    email: "",
    password: "",
    nomEntreprise: "",
    role: "",
    tel: ""
  });
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          const userId = decodedToken.sub;
          const response = await axios.get(`http://localhost:5000/auth/user/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUserEntreprise(response.data.entreprise);
          setUserRole(response.data.role); // Ajouté
        } catch (error) {
          console.error("Erreur lors de la récupération des données de l'utilisateur :", error);
        }
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    if (!userEntreprise || userEntreprise === "Entreprise") return; // Ajouté
    const fetchEntreprise = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/entreprises/${userEntreprise}`);
        setEntreprise(response.data);
        setInitialValues(prevValues => ({
          ...prevValues,
          nomEntreprise: response.data.nom,
        }));
      } catch (err) {
        console.error("Erreur lors de la récupération de l'utilisateur:", err);
      }
    };
    fetchEntreprise();
  }, [userEntreprise]);

  const handleFormSubmit = async (values) => {
    try {
      const response = await fetch('http://localhost:5000/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      const data = await response.json();
      if (response.ok) {
        console.log('Inscription réussie:', data);
        alert('Inscription réussie !');
        // Réinitialiser le formulaire après succès
        window.location.reload();
      } else {
        console.error('Erreur lors de l\'inscription:', data.message);
        // Gestion spécifique des erreurs
        if (data.message && data.message.includes('email')) {
          alert('Il existe déjà un compte avec cet email');
        } else if (data.message) {
          alert(`Erreur: ${data.message}`);
        } else {
          alert('Une erreur est survenue lors de l\'inscription');
        }
      }
    } catch (error) {
      console.error('Erreur réseau:', error);
      alert('Erreur réseau lors de l\'inscription');
    }
  };

  return (
    <div className="col-md-12">
      <div className="card">
        <div className="card-header">
          <h5 className="card-title mb-0">Add a New Member</h5>
        </div>
        <div className="card-body">
          <Formik
            onSubmit={handleFormSubmit}
            initialValues={initialValues}
            validationSchema={checkoutSchema}
            enableReinitialize
          >
            {({ values, errors, touched, handleBlur, handleChange, handleSubmit, resetForm }) => (
              <form onSubmit={handleSubmit}>
                <div className="row mb-24 gy-3 align-items-center">
                  <label className="form-label mb-0 col-sm-2">Nom</label>
                  <div className="col-sm-10">
                    <div className="icon-field">
                      <span className="icon">
                        <Icon icon="f7:person" />
                      </span>
                      <input
                        type="text"
                        name="nom"
                        className="form-control"
                        placeholder="Entrer le nom"
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
                  <label className="form-label mb-0 col-sm-2">Email</label>
                  <div className="col-sm-10">
                    <div className="icon-field">
                      <span className="icon">
                        <Icon icon="mage:email" />
                      </span>
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        placeholder="Entrer l'email"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                      />
                      {touched.email && errors.email && (
                        <div className="text-danger small mt-1">{errors.email}</div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="row mb-24 gy-3 align-items-center">
                  <label className="form-label mb-0 col-sm-2">Mot de passe</label>
                  <div className="col-sm-10">
                    <div className="icon-field">
                      <span className="icon">
                        <Icon icon="solar:lock-password-outline" />
                      </span>
                      <input
                        type="password"
                        name="password"
                        className="form-control"
                        placeholder="*******"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                      />
                      {touched.password && errors.password && (
                        <div className="text-danger small mt-1">{errors.password}</div>
                      )}
                      <div className="text-muted small mt-1">
                        Le mot de passe doit contenir au moins 6 caractères, une majuscule et une minuscule
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row mb-24 gy-3 align-items-center">
                  <label className="form-label mb-0 col-sm-2">Entreprise</label>
                  <div className="col-sm-10">
                    <div className="icon-field">
                      <span className="icon">
                        <Icon icon="mdi:office-building-outline" />
                      </span>
                      <input
                        type="text"
                        name="nomEntreprise"
                        className="form-control"
                        placeholder="Entreprise"
                        value={values.nomEntreprise}
                        disabled
                      />
                    </div>
                  </div>
                </div>
                <div className="row mb-24 gy-3 align-items-center">
                  <label className="form-label mb-0 col-sm-2">Rôle</label>
                  <div className="col-sm-10">
                    <div className="icon-field">
                      <span className="icon">
                        <Icon icon="mdi:account-badge-outline" />
                      </span>
                      <select
                        name="role"
                        className="form-control"
                        value={values.role}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                      >
                        <option value="">Sélectionner un rôle</option>
                        {userRole === 'superadminabshore' && (
                          <option value="superadminabshore">Super Admin ABshore</option>
                        )}
                        {userRole === 'superadminentreprise' && (
                          <option value="superadminentreprise">Super Admin Entreprise</option>
                        )}
                        {(userRole === 'superadminabshore' || userRole === 'superadminentreprise') && (
                          <option value="moderateur">Modérateur</option>
                        )}
                        {userRole !== 'superadminabshore' && userRole !== 'superadminentreprise' && (
                          <option value="moderateur">Modérateur</option>
                        )}
                      </select>
                      {touched.role && errors.role && (
                        <div className="text-danger small mt-1">{errors.role}</div>
                      )}
                    </div>
                  </div>
                </div>
                {/* Champ téléphone facultatif, non requis par la logique signupform mais conservé pour le style */}
                <div className="row mb-24 gy-3 align-items-center">
                  <label className="form-label mb-0 col-sm-2">Téléphone</label>
                  <div className="col-sm-10">
                    <div className="icon-field">
                      <span className="icon">
                        <Icon icon="solar:phone-calling-linear" />
                      </span>
                      <input
                        type="text"
                        name="tel"
                        className="form-control"
                        placeholder="+1 (555) 000-0000"
                        value={values.tel}
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
                      Add Member
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

const checkoutSchema = yup.object().shape({
  nom: yup.string().required("Le nom est requis"),
  email: yup.string().email("Email invalide").required("L'email est requis"),
  password: yup.string()
    .min(6, "Le mot de passe doit contenir au moins 6 caractères")
    .matches(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
    .matches(/[a-z]/, "Le mot de passe doit contenir au moins une minuscule")
    .required("Le mot de passe est requis"),
  nomEntreprise: yup.string().required("L'entreprise est requise"),
  role: yup.string().required("Le rôle est requis"),
});

export default AddMember;