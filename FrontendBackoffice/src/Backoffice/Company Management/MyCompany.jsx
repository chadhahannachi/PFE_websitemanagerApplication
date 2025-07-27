import { Icon } from '@iconify/react/dist/iconify.js';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";
import * as yup from "yup";
import { Formik } from 'formik';
import { jwtDecode } from 'jwt-decode';

const MyCompany = () => {
    const [entreprise, setEntreprise] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const [logoPreview, setLogoPreview] = useState('/assets/images/user-grid/user-grid-bg1.jpg');
    const [logoSelected, setLogoSelected] = useState(null);

    const [snackbar, setSnackbar] = useState({
      open: false,
      message: "",
      severity: "success",
    });

    // Récupérer les données de l'entreprise de l'utilisateur connecté
    useEffect(() => {
        const fetchEntreprise = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setSnackbar({
                    open: true,
                    message: "Token d'authentification manquant",
                    severity: "error",
                });
                setLoading(false);
                return;
            }

            let userId = null;
            try {
                const decodedToken = jwtDecode(token);
                userId = decodedToken.sub;
            } catch (error) {
                setSnackbar({
                    open: true,
                    message: "Token invalide",
                    severity: "error",
                });
                setLoading(false);
                return;
            }

            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const userResponse = await axios.get(`http://localhost:5000/auth/user/${userId}`, config);
                const user = userResponse.data;
                
                if (!user.entreprise) {
                    setSnackbar({
                        open: true,
                        message: "Aucune entreprise associée à votre compte",
                        severity: "error",
                    });
                    setLoading(false);
                    return;
                }

                // Récupérer les détails de l'entreprise
                const entrepriseResponse = await axios.get(`http://localhost:5000/entreprises/${user.entreprise}`, config);
                setEntreprise(entrepriseResponse.data);
                // Définir le logo preview
                if (entrepriseResponse.data.logo) {
                    setLogoPreview(entrepriseResponse.data.logo);
                }
                setLoading(false);
            } catch (error) {
                console.error("Erreur lors de la récupération de l'entreprise :", error);
                setSnackbar({
                    open: true,
                    message: "Erreur lors de la récupération de l'entreprise",
                    severity: "error",
                });
                setLoading(false);
            }
        };

        fetchEntreprise();
    }, []);

    const uploadLogo = async () => {
        if (!logoSelected) {
            setSnackbar({
                open: true,
                message: "Veuillez sélectionner un logo avant d'uploader.",
                severity: "warning",
            });
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            setSnackbar({
                open: true,
                message: "Token d'authentification manquant",
                severity: "error",
            });
            return;
        }

        const formData = new FormData();
        formData.append("file", logoSelected);
        formData.append("upload_preset", "chadha");

        try {
            const response = await axios.post(
                "https://api.cloudinary.com/v1_1/duvcpe6mx/image/upload",
                formData
            );
            
            // Mettre à jour l'entreprise avec le nouveau logo
            const updateResponse = await axios.patch(
                `http://localhost:5000/entreprises/${entreprise._id}`,
                { logo: response.data.secure_url },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                }
            );
            
            setEntreprise(updateResponse.data);
            setLogoPreview(response.data.secure_url);
            setSnackbar({
                open: true,
                message: "Logo uploadé et entreprise mise à jour avec succès !",
                severity: "success",
            });
        } catch (error) {
            console.error("Error uploading logo:", error);
            setSnackbar({
                open: true,
                message: "Erreur lors de l'upload du logo. Veuillez réessayer.",
                severity: "error",
            });
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setLogoSelected(file);
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setLogoPreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Gérer la mise à jour de l'entreprise
    const handleEntrepriseUpdate = async (values) => {
        const token = localStorage.getItem('token');
        if (!token) {
            setSnackbar({
                open: true,
                message: "Token d'authentification manquant",
                severity: "error",
            });
            return;
        }

        try {
            console.log("Valeurs du formulaire:", values); // Debug
            
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const response = await axios.patch(`http://localhost:5000/entreprises/${entreprise._id}`, values, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });
            
            console.log("Réponse de l'API:", response.data); // Debug
            setEntreprise(response.data);
            setUpdateSuccess(true);
            setSnackbar({
                open: true,
                message: "Entreprise mise à jour avec succès !",
                severity: "success",
            });
            setTimeout(() => setUpdateSuccess(false), 3000);
        } catch (error) {
            console.error("Erreur lors de la mise à jour de l'entreprise :", error);
            console.error("Détails de l'erreur:", error.response?.data); // Debug
            setSnackbar({
                open: true,
                message: "Erreur lors de la mise à jour de l'entreprise",
                severity: "error",
            });
        }
    };

    if (loading) {
        return <div className="text-center p-4">Chargement de l'entreprise...</div>;
    }

    if (!entreprise) {
        return <div className="text-center p-4">Erreur lors du chargement de l'entreprise</div>;
    }

    return (
        <div className="row gy-4">
            <div className="col-lg-4">
                <div className="user-grid-card position-relative border radius-16 overflow-hidden bg-base h-100">
                    <div className="position-relative">
                        <img
                            src={entreprise.logo || "/assets/images/user-grid/user-grid-bg1.jpg"}
                            alt="Logo de l'entreprise"
                            className="w-100 object-fit-cover"
                            style={{ height: '200px' }}
                        />
                    </div>
                    <div className="pb-24 ms-16 mb-24 me-16">
                        <div className="text-center border border-top-0 border-start-0 border-end-0">
                            <h6 className="mb-0 mt-16">{entreprise.nom}</h6>
                            <span className="text-secondary-light mb-16">{entreprise.raisonSociale}</span>
                        </div>
                        <div className="mt-24">
                            <h6 className="text-xl mb-16">Informations de l'entreprise</h6>
                            <ul>
                                <li className="d-flex align-items-center gap-1 mb-12">
                                    <span className="w-30 text-md fw-semibold text-primary-light">
                                        Nom
                                    </span>
                                    <span className="w-70 text-secondary-light fw-medium">
                                        : {entreprise.nom}
                                    </span>
                                </li>
                                <li className="d-flex align-items-center gap-1 mb-12">
                                    <span className="w-30 text-md fw-semibold text-primary-light">
                                        Contact
                                    </span>
                                    <span className="w-70 text-secondary-light fw-medium">
                                        : {entreprise.contact}
                                    </span>
                                </li>
                                <li className="d-flex align-items-center gap-1 mb-12">
                                    <span className="w-30 text-md fw-semibold text-primary-light">
                                        Téléphone
                                    </span>
                                    <span className="w-70 text-secondary-light fw-medium">
                                        : {entreprise.numTel}
                                    </span>
                                </li>
                                <li className="d-flex align-items-center gap-1 mb-12">
                                    <span className="w-30 text-md fw-semibold text-primary-light">
                                        Adresse
                                    </span>
                                    <span className="w-70 text-secondary-light fw-medium">
                                        : {entreprise.adresse}
                                    </span>
                                </li>
                                <li className="d-flex align-items-center gap-1 mb-12">
                                    <span className="w-30 text-md fw-semibold text-primary-light">
                                        Raison Sociale
                                    </span>
                                    <span className="w-70 text-secondary-light fw-medium">
                                        : {entreprise.raisonSociale}
                                    </span>
                                </li>
                                <li className="d-flex align-items-center gap-1 mb-12">
                                    <span className="w-30 text-md fw-semibold text-primary-light">
                                        ID Licence
                                    </span>
                                    <span className="w-70 text-secondary-light fw-medium">
                                        : {entreprise.idRequestLicence || 'Non renseigné'}
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-lg-8">
                <div className="card h-100">
                    <div className="card-body p-24">
                        {updateSuccess && (
                            <div className="alert alert-success mb-3">
                                Entreprise mise à jour avec succès !
                            </div>
                        )}
                        {snackbar.open && (
                            <div className={`alert alert-${snackbar.severity === 'error' ? 'danger' : snackbar.severity} mb-3`}>
                                {snackbar.message}
                                <button
                                    type="button"
                                    className="btn-close float-end"
                                    onClick={() => setSnackbar({ ...snackbar, open: false })}
                                ></button>
                            </div>
                        )}
                        
                        <ul
                            className="nav bordered-tab border border-top-0 border-start-0 border-end-0 d-inline-flex nav-pills mb-16"
                            id="pills-tab"
                            role="tablist"
                        >
                            <li className="nav-item" role="presentation">
                                <button
                                    className="nav-link px-16 py-10 active"
                                    id="pills-edit-entreprise-tab"
                                    data-bs-toggle="pill"
                                    data-bs-target="#pills-edit-entreprise"
                                    type="button"
                                    role="tab"
                                    aria-controls="pills-edit-entreprise"
                                    aria-selected="true"
                                >
                                    Modifier l'entreprise
                                </button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button
                                    className="nav-link px-16 py-10"
                                    id="pills-licence-tab"
                                    data-bs-toggle="pill"
                                    data-bs-target="#pills-licence"
                                    type="button"
                                    role="tab"
                                    aria-controls="pills-licence"
                                    aria-selected="false"
                                >
                                    Licence
                                </button>
                            </li>
                        </ul>
                        <div className="tab-content" id="pills-tabContent">
                            <div
                                className="tab-pane fade show active"
                                id="pills-edit-entreprise"
                                role="tabpanel"
                                aria-labelledby="pills-edit-entreprise-tab"
                                tabIndex={0}
                            >
                                <h6 className="text-md text-primary-light mb-16">Logo de l'entreprise</h6>
                                {/* Upload Logo Start */}
                                <div className="mb-24 mt-16">
                                    <div className="upload-image-wrapper d-flex align-items-center gap-3">
                                        {/* Image preview section */}
                                        {logoSelected ? (
                                            <div className="uploaded-img position-relative h-120-px w-120-px border input-form-light radius-8 overflow-hidden border-dashed bg-neutral-50">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setLogoSelected(null);
                                                        setLogoPreview(entreprise.logo || '/assets/images/user-grid/user-grid-bg1.jpg');
                                                    }}
                                                    className="uploaded-img__remove position-absolute top-0 end-0 z-1 text-2xxl line-height-1 me-8 mt-8 d-flex"
                                                    aria-label="Remove uploaded image"
                                                >
                                                    <Icon
                                                        icon="radix-icons:cross-2"
                                                        className="text-xl text-danger-600"
                                                    ></Icon>
                                                </button>
                                                <img
                                                    id="uploaded-img__preview"
                                                    className="w-100 h-100 object-fit-cover"
                                                    src={logoPreview}
                                                    alt="Preview"
                                                />
                                            </div>
                                        ) : (
                                            <label
                                                className="upload-file h-120-px w-120-px border input-form-light radius-8 overflow-hidden border-dashed bg-neutral-50 bg-hover-neutral-200 d-flex align-items-center flex-column justify-content-center gap-1"
                                                htmlFor="logoUpload"
                                            >
                                                <Icon
                                                    icon="solar:camera-outline"
                                                    className="text-xl text-secondary-light"
                                                ></Icon>
                                                <span className="fw-semibold text-secondary-light">Upload</span>
                                            </label>
                                        )}

                                        {/* Always render the input, but hide it */}
                                        <input
                                            id="logoUpload"
                                            type="file"
                                            onChange={handleFileChange}
                                            hidden
                                            accept="image/*"
                                        />
                                    </div>
                                    
                                    {logoSelected && (
                                        <div className="mt-3 text-center">
                                            <button
                                                type="button"
                                                className="btn btn-primary btn-sm"
                                                onClick={uploadLogo}
                                            >
                                                Upload Logo
                                            </button>
                                        </div>
                                    )}
                                </div>
                                {/* Upload Logo End */}
                                <Formik
                                    initialValues={{
                                        nom: entreprise.nom || '',
                                        contact: entreprise.contact || '',
                                        numTel: entreprise.numTel || '',
                                        adresse: entreprise.adresse || '',
                                        raisonSociale: entreprise.raisonSociale || '',
                                        idRequestLicence: entreprise.idRequestLicence || ''
                                    }}
                                    validationSchema={entrepriseSchema}
                                    onSubmit={handleEntrepriseUpdate}
                                    enableReinitialize
                                >
                                    {({ values, errors, touched, handleBlur, handleChange, handleSubmit }) => (
                                        <form onSubmit={handleSubmit}>
                                            <div className="row">
                                                <div className="col-sm-6">
                                                    <div className="mb-20">
                                                        <label
                                                            htmlFor="nom"
                                                            className="form-label fw-semibold text-primary-light text-sm mb-8"
                                                        >
                                                            Nom de l'entreprise
                                                            <span className="text-danger-600">*</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            name="nom"
                                                            className="form-control radius-8"
                                                            id="nom"
                                                            placeholder="Entrer le nom de l'entreprise"
                                                            value={values.nom}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                        />
                                                        {touched.nom && errors.nom && (
                                                            <div className="text-danger small mt-1">{errors.nom}</div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="col-sm-6">
                                                    <div className="mb-20">
                                                        <label
                                                            htmlFor="contact"
                                                            className="form-label fw-semibold text-primary-light text-sm mb-8"
                                                        >
                                                            Contact
                                                            <span className="text-danger-600">*</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            name="contact"
                                                            className="form-control radius-8"
                                                            id="contact"
                                                            placeholder="Entrer le contact"
                                                            value={values.contact}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                        />
                                                        {touched.contact && errors.contact && (
                                                            <div className="text-danger small mt-1">{errors.contact}</div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="col-sm-6">
                                                    <div className="mb-20">
                                                        <label
                                                            htmlFor="numTel"
                                                            className="form-label fw-semibold text-primary-light text-sm mb-8"
                                                        >
                                                            Téléphone
                                                            <span className="text-danger-600">*</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            name="numTel"
                                                            className="form-control radius-8"
                                                            id="numTel"
                                                            placeholder="Entrer le numéro de téléphone"
                                                            value={values.numTel}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                        />
                                                        {touched.numTel && errors.numTel && (
                                                            <div className="text-danger small mt-1">{errors.numTel}</div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="col-sm-6">
                                                    <div className="mb-20">
                                                        <label
                                                            htmlFor="raisonSociale"
                                                            className="form-label fw-semibold text-primary-light text-sm mb-8"
                                                        >
                                                            Raison Sociale
                                                            <span className="text-danger-600">*</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            name="raisonSociale"
                                                            className="form-control radius-8"
                                                            id="raisonSociale"
                                                            placeholder="Entrer la raison sociale"
                                                            value={values.raisonSociale}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                        />
                                                        {touched.raisonSociale && errors.raisonSociale && (
                                                            <div className="text-danger small mt-1">{errors.raisonSociale}</div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="col-sm-12">
                                                    <div className="mb-20">
                                                        <label
                                                            htmlFor="adresse"
                                                            className="form-label fw-semibold text-primary-light text-sm mb-8"
                                                        >
                                                            Adresse
                                                            <span className="text-danger-600">*</span>
                                                        </label>
                                                        <textarea
                                                            name="adresse"
                                                            className="form-control radius-8"
                                                            id="adresse"
                                                            rows="3"
                                                            placeholder="Entrer l'adresse complète"
                                                            value={values.adresse}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                        />
                                                        {touched.adresse && errors.adresse && (
                                                            <div className="text-danger small mt-1">{errors.adresse}</div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="d-flex align-items-center justify-content-center gap-3">
                                                <button
                                                    type="submit"
                                                    className="btn rounded-pill btn-primary-100 text-primary-600 radius-8 px-20 py-11"
                                                >
                                                    <Icon icon="solar:check-circle-outline" className="me-2" />
                                                    Save
                                                </button>
                                            </div>
                                        </form>
                                    )}
                                </Formik>
                            </div>
                            
                            <div
                                className="tab-pane fade"
                                id="pills-licence"
                                role="tabpanel"
                                aria-labelledby="pills-licence-tab"
                                tabIndex={0}
                            >
                                <div>
                                    <h6 className="text-lg mb-8">Licence</h6>
                                    <p className="text-secondary-light mb-16">
                                        Gestion des licences de l'entreprise.
                                    </p>
                                    <p className="text-secondary-light mb-0">
                                        Fonctionnalité en cours de développement...
                                    </p>
                                </div>
                            </div>
                  </div>
                </div>
              </div>
            </div>
        </div>
    );
};

const entrepriseSchema = yup.object().shape({
    nom: yup.string().required("Le nom de l'entreprise est requis"),
    contact: yup.string().required("Le contact est requis"),
    numTel: yup.string().required("Le numéro de téléphone est requis"),
    adresse: yup.string().required("L'adresse est requise"),
    raisonSociale: yup.string().required("La raison sociale est requise"),
    idRequestLicence: yup.string().optional(),
});

export default MyCompany;