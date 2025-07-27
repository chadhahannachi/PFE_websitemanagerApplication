import { Icon } from '@iconify/react/dist/iconify.js';
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from "axios";
import * as yup from "yup";
import { Formik } from 'formik';

const CompanyDetail = () => {
    const { id } = useParams(); // Récupère l'id de l'entreprise de l'URL
    const [entreprise, setEntreprise] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const [logoPreview, setLogoPreview] = useState('/assets/images/user-grid/user-grid-bg1.jpg');
    const [logoSelected, setLogoSelected] = useState(null);
    const [users, setUsers] = useState([]);
    const [superAdmins, setSuperAdmins] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(false);

    // Ajout des états nécessaires en haut du composant
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("");
    const [open, setOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [updatedName, setUpdatedName] = useState("");
    const [updatedEmail, setUpdatedEmail] = useState("");

    const [snackbar, setSnackbar] = useState({
      open: false,
      message: "",
      severity: "success",
    });

    const [licenceRequest, setLicenceRequest] = useState(null);
    const [licence, setLicence] = useState(null);
    const [licenceLoading, setLicenceLoading] = useState(false);
    const [showAddLicenceModal, setShowAddLicenceModal] = useState(false);
    const [licenceFormData, setLicenceFormData] = useState({
      type: 'basic',
      status: 'pending',
      price: 50,
      description: '',
      start_date: '',
      end_date: '',
      license_key: '',
      mongo_company_id: '',
      company_email: '',
      licence_request_id: ''
    });

    // Ajoute un état pour le formulaire de licence
    const [showAddLicenceForm, setShowAddLicenceForm] = useState(false);

    // Récupérer les données de l'entreprise et les utilisateurs
    useEffect(() => {
        const fetchEntreprise = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/entreprises/${id}`);
                setEntreprise(response.data);
                // Définir le logo preview
                if (response.data.logo) {
                    setLogoPreview(response.data.logo);
                }
                // Récupérer la licence request si elle existe
                if (response.data.idRequestLicence) {
                    try {
                        const token = localStorage.getItem("token");
                        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
                        const res = await axios.get(`http://localhost:5000/licence-requests/${response.data.idRequestLicence}`, config);
                        setLicenceRequest(res.data);
                    } catch (e) {
                        setLicenceRequest(null);
                    }
                } else {
                    setLicenceRequest(null);
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

        const fetchUsers = async () => {
            setLoadingUsers(true);
            try {
                const response = await axios.get(`http://localhost:5000/auth/entreprise/${id}/users`);
                setUsers(response.data);
                // Filtrer les super admins
                const superAdminsList = response.data.filter(user => user.role === 'superadminabshore' || user.role === 'superadminentreprise');
                setSuperAdmins(superAdminsList);
                setLoadingUsers(false);
            } catch (error) {
                console.error("Erreur lors de la récupération des utilisateurs :", error);
            setSnackbar({
                open: true,
                    message: "Erreur lors de la récupération des utilisateurs",
                    severity: "error",
                });
                setLoadingUsers(false);
            }
        };

        fetchEntreprise();
        fetchUsers();
    }, [id]);

    useEffect(() => {
      if (!entreprise) return;
      setLicenceLoading(true);
      axios.get(`http://localhost:5000/licences/mongo/${entreprise._id}`)
        .then(res => setLicence(res.data))
        .catch(() => setLicence(null))
        .finally(() => setLicenceLoading(false));
    }, [entreprise]);

    // Fonctions pour gérer les utilisateurs (édition, suppression)
    const handleOpen = (user) => {
        setSelectedUser(user);
        setUpdatedName(user.nom);
        setUpdatedEmail(user.email);
        setOpen(true);
    };
    const handleClose = () => setOpen(false);
    const handleUpdate = async () => {
        try {
            await axios.patch(`http://localhost:5000/auth/${selectedUser._id}`, {
                nom: updatedName,
                email: updatedEmail,
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setUsers(users.map(user => 
                user._id === selectedUser._id ? { ...user, nom: updatedName, email: updatedEmail } : user
            ));
            handleClose();
        } catch (error) {
            console.error("Error updating user:", error);
        }
    };
    const handleDelete = async (userId) => {
        try {
            await axios.delete(`http://localhost:5000/auth/users/${userId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setUsers(users.filter(user => user._id !== userId));
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };
    const filteredUsers = users.filter(user => {
        const matchesSearch =
            user.nom.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase());
        let matchesRole = true;
        if (roleFilter === 'superadmin') {
            matchesRole = user.role === 'superadminabshore' || user.role === 'superadminentreprise';
        } else if (roleFilter) {
            matchesRole = user.role === roleFilter;
        }
        return matchesSearch && matchesRole;
    });

    const uploadLogo = async () => {
        if (!logoSelected) {
            setSnackbar({
                open: true,
                message: "Veuillez sélectionner un logo avant d'uploader.",
                severity: "warning",
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
                `http://localhost:5000/entreprises/${id}`,
                { logo: response.data.secure_url },
                    {
                        headers: {
                            'Content-Type': 'application/json',
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

    // Gérer l'ajout d'un super admin
    const handleAddSuperAdmin = async (values) => {
        try {
            const response = await fetch('http://localhost:5000/auth/signup', {
                method: 'POST',
                        headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...values,
                    nomEntreprise: entreprise.nom,
                    entreprise: id
                }),
            });
            
            const data = await response.json();
            if (response.ok) {
                console.log('Super admin ajouté avec succès:', data);
                
                // Recharger les utilisateurs
                const usersResponse = await axios.get(`http://localhost:5000/auth/entreprise/${id}/users`);
                setUsers(usersResponse.data);
                const superAdminsList = usersResponse.data.filter(user => 
                    user.role === 'superadminabshore' || user.role === 'superadminentreprise'
                );
                setSuperAdmins(superAdminsList);
                
                setSnackbar({
                    open: true,
                    message: "Super admin ajouté avec succès !",
                    severity: "success",
                });
            } else {
                console.error('Erreur lors de l\'ajout du super admin:', data.message);
                if (data.message && data.message.includes('email')) {
                    setSnackbar({
                        open: true,
                        message: "Il existe déjà un compte avec cet email",
                        severity: "error",
                    });
                } else if (data.message) {
                    setSnackbar({
                        open: true,
                        message: `Erreur: ${data.message}`,
                        severity: "error",
                    });
                } else {
                    setSnackbar({
                        open: true,
                        message: "Une erreur est survenue lors de l'ajout du super admin",
                        severity: "error",
                    });
                }
            }
                } catch (error) {
            console.error("Erreur lors de l'ajout du super admin :", error);
            setSnackbar({
                open: true,
                message: "Erreur réseau lors de l'ajout du super admin",
                severity: "error",
            });
        }
    };

    // Gérer la mise à jour de l'entreprise
    const handleEntrepriseUpdate = async (values) => {
            try {
                console.log("Valeurs du formulaire:", values); // Debug
            
            const response = await axios.patch(`http://localhost:5000/entreprises/${id}`, values, {
                    headers: {
                        'Content-Type': 'application/json',
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

    const generateLicenseKey = () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      const segments = 4;
      const segmentLength = 4;
      let key = '';
      for (let i = 0; i < segments; i++) {
        for (let j = 0; j < segmentLength; j++) {
          key += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        if (i < segments - 1) key += '-';
      }
      return key;
    };

    const handleOpenAddLicenceModal = () => {
      if (!licenceRequest) return;
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + (licenceRequest.duration_months || 12));
      setLicenceFormData({
        type: licenceRequest.type || 'basic',
        status: 'pending',
        price: licenceRequest.price || 50,
        description: licenceRequest.description || '',
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        license_key: generateLicenseKey(),
        mongo_company_id: entreprise._id,
        company_email: entreprise.contact,
        licence_request_id: entreprise.idRequestLicence
      });
      setShowAddLicenceModal(true);
    };

    const handleLicenceFormChange = (e) => {
      const { name, value } = e.target;
      let newFormData = { ...licenceFormData, [name]: value };
      if (name === 'type') {
        switch (value) {
          case 'basic': newFormData.price = 50; break;
          case 'professional': newFormData.price = 100; break;
          case 'enterprise': newFormData.price = 150; break;
          default: newFormData.price = 0;
        }
      }
      setLicenceFormData(newFormData);
    };

    const handleLicenceFormSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await axios.post('http://localhost:5000/licences', licenceFormData);
        setLicence(response.data);
        setShowAddLicenceForm(false);
        setSnackbar({ open: true, message: 'Licence ajoutée avec succès', severity: 'success' });
      } catch (error) {
        setSnackbar({ open: true, message: 'Erreur lors de l\'ajout de la licence', severity: 'error' });
      }
    };

    const handleShowAddLicenceForm = () => {
      if (!licenceRequest) return;
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + (licenceRequest.duration_months || 12));
      setLicenceFormData({
        type: licenceRequest.type || 'basic',
        status: 'pending',
        price: licenceRequest.price || 50,
        description: licenceRequest.description || '',
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        license_key: generateLicenseKey(),
        mongo_company_id: entreprise._id,
        company_email: entreprise.contact,
        licence_request_id: entreprise.idRequestLicence
      });
      setShowAddLicenceForm(true);
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
                                    id="pills-add-super-admin-tab"
                                    data-bs-toggle="pill"
                                    data-bs-target="#pills-add-super-admin"
                                    type="button"
                                    role="tab"
                                    aria-controls="pills-add-super-admin"
                                    aria-selected="false"
                                >
                                    Super Admin
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
                            <li className="nav-item" role="presentation">
                                <button
                                    className="nav-link px-16 py-10"
                                    id="pills-licence-request-tab"
                                    data-bs-toggle="pill"
                                    data-bs-target="#pills-licence-request"
                                    type="button"
                                    role="tab"
                                    aria-controls="pills-licence-request"
                                    aria-selected="false"
                                >
                                    Licence Request
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
                                                {/* <div className="col-sm-6">
                                                    <div className="mb-20">
                                                        <label
                                                            htmlFor="idRequestLicence"
                                                            className="form-label fw-semibold text-primary-light text-sm mb-8"
                                                        >
                                                            ID Licence
                                                        </label>
                                                        <input
                                                            type="text"
                                                            name="idRequestLicence"
                                                            className="form-control radius-8"
                                                            id="idRequestLicence"
                                                            placeholder="Entrer l'ID de licence (optionnel)"
                                                            value={values.idRequestLicence}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                        />
                                                    </div>
                                                </div> */}
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
                                id="pills-add-super-admin"
                                role="tabpanel"
                                aria-labelledby="pills-add-super-admin-tab"
                                tabIndex={0}
                            >
                                <div>
                                    <h6 className="text-lg mb-8">Super Admin</h6>
                                    
                                    {loadingUsers ? (
                                        <div className="text-center p-4">
                                            <div className="spinner-border text-primary" role="status">
                                                <span className="visually-hidden">Chargement...</span>
                                            </div>
                                        </div>
                                    ) : superAdmins.length > 0 ? (
                                        // Afficher la liste des super admins
                                        <div>
                                            <div className="alert alert-info mb-3">
                                                <strong>{superAdmins.length}</strong> super admin(s) trouvé(s) pour cette entreprise
                                            </div>
                                            <ul className="list-group radius-8">
                                                {superAdmins.map((admin, index) => (
                                                    <li key={admin._id} className={`list-group-item border text-secondary-light p-16 bg-base ${index < superAdmins.length - 1 ? 'border-bottom-0' : ''}`}>
                                                        <div className="d-flex align-items-center">
                                                            <Icon icon="solar:user-outline" className="text-primary me-3 text-lg" />
                                                            <div>
                                                                <div className="fw-bold text-lg text-primary-light mb-1">
                                                                    {admin.nom}
                                                                </div>
                                                                <div className="text-sm text-secondary-light">
                                                                    {admin.email}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ) : (
                                        // Afficher le formulaire d'ajout
                                        <div>
                                            <div className="alert alert-warning mb-3">
                                                Aucun super admin trouvé pour cette entreprise. Ajoutez-en un maintenant.
                                            </div>
                                            
                                <Formik
                                    initialValues={{
                                                    nom: '',
                                                    email: '',
                                                    tel: '',
                                                    password: '',
                                                    confirmPassword: '',
                                                    role: ''
                                                }}
                                                validationSchema={superAdminSchema}
                                                onSubmit={handleAddSuperAdmin}
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
                                                                        Nom complet
                                                            <span className="text-danger-600">*</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            name="nom"
                                                            className="form-control radius-8"
                                                                        id="nom"
                                                                        placeholder="Entrer le nom complet"
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
                                                            htmlFor="email"
                                                            className="form-label fw-semibold text-primary-light text-sm mb-8"
                                                        >
                                                                        Email
                                                                        <span className="text-danger-600">*</span>
                                                        </label>
                                                        <input
                                                            type="email"
                                                            name="email"
                                                            className="form-control radius-8"
                                                            id="email"
                                                                        placeholder="Entrer l'email"
                                                            value={values.email}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                        />
                                                        {touched.email && errors.email && (
                                                            <div className="text-danger small mt-1">{errors.email}</div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="col-sm-6">
                                                    <div className="mb-20">
                                                        <label
                                                            htmlFor="tel"
                                                            className="form-label fw-semibold text-primary-light text-sm mb-8"
                                                        >
                                                                        Téléphone
                                                        </label>
                                                        <input
                                                            type="text"
                                                            name="tel"
                                                            className="form-control radius-8"
                                                            id="tel"
                                                                        placeholder="Entrer le numéro de téléphone"
                                                            value={values.tel}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-sm-6">
                                                    <div className="mb-20">
                                                        <label
                                                            htmlFor="role"
                                                            className="form-label fw-semibold text-primary-light text-sm mb-8"
                                                        >
                                                                        Rôle
                                                            <span className="text-danger-600">*</span>
                                                        </label>
                                                        <select
                                                            name="role"
                                                            className="form-control radius-8"
                                                            id="role"
                                                            value={values.role}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                        >
                                                            <option value="">Sélectionner un rôle</option>
                                                                <option value="superadminabshore">Super Admin ABshore</option>
                                                                <option value="superadminentreprise">Super Admin Entreprise</option>
                                                        </select>
                                                        {touched.role && errors.role && (
                                                            <div className="text-danger small mt-1">{errors.role}</div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="col-sm-6">
                                                    <div className="mb-20">
                                                        <label
                                                                        htmlFor="password"
                                                            className="form-label fw-semibold text-primary-light text-sm mb-8"
                                                        >
                                                                        Mot de passe
                                                                        <span className="text-danger-600">*</span>
                                                        </label>
                                                                    <input
                                                                        type="password"
                                                                        name="password"
                                                            className="form-control radius-8"
                                                                        id="password"
                                                                        placeholder="Entrer le mot de passe"
                                                                        value={values.password}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                                    />
                                                                    {touched.password && errors.password && (
                                                                        <div className="text-danger small mt-1">{errors.password}</div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="col-sm-6">
                                                                <div className="mb-20">
                                                                    <label
                                                                        htmlFor="confirmPassword"
                                                                        className="form-label fw-semibold text-primary-light text-sm mb-8"
                                                                    >
                                                                        Confirmer le mot de passe
                                                                        <span className="text-danger-600">*</span>
                                                                    </label>
                                                                    <input
                                                                        type="password"
                                                                        name="confirmPassword"
                                                                        className="form-control radius-8"
                                                                        id="confirmPassword"
                                                                        placeholder="Confirmer le mot de passe"
                                                                        value={values.confirmPassword}
                                                                        onChange={handleChange}
                                                                        onBlur={handleBlur}
                                                                    />
                                                                    {touched.confirmPassword && errors.confirmPassword && (
                                                                        <div className="text-danger small mt-1">{errors.confirmPassword}</div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="d-flex align-items-center justify-content-center gap-3">
                                                <button
                                                    type="submit"
                                                    className="btn rounded-pill btn-primary-100 text-primary-600 radius-8 px-20 py-11"
                                                >
                                                                <Icon icon="solar:user-plus-outline" className="me-2" />
                                                                Ajouter Super Admin
                                                </button>
                                            </div>
                                        </form>
                                    )}
                                </Formik>
                                        </div>
                                    )}
                                </div>
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
                                    {licenceLoading ? (
                                        <div className="text-center p-4">
                                            <div className="spinner-border text-primary" role="status">
                                                <span className="visually-hidden">Chargement...</span>
                        </div>
                                            <p className="mt-2">Chargement de la licence...</p>
                    </div>
                                    ) : licence ? (
                                        <div className="card mb-3">
                                            <div className="card-body">
                                                <div className="row mb-3">
                                                    <div className="col-md-6 mb-2">
                                                        <div className="fw-semibold text-primary-light">Type de licence :</div>
                                                        <div className="text-secondary-light">{licence.type}</div>
                </div>
                                                    <div className="col-md-6 mb-2">
                                                        <div className="fw-semibold text-primary-light">Statut :</div>
                                                        <div className="text-secondary-light">{licence.status}</div>
                                                    </div>
                                                    <div className="col-md-6 mb-2">
                                                        <div className="fw-semibold text-primary-light">Prix :</div>
                                                        <div className="text-secondary-light">{licence.price} €</div>
                                                    </div>
                                                    <div className="col-md-6 mb-2">
                                                        <div className="fw-semibold text-primary-light">Clé de licence :</div>
                                                        <div className="text-secondary-light">{licence.license_key}</div>
                                                    </div>
                                                    <div className="col-md-6 mb-2">
                                                        <div className="fw-semibold text-primary-light">Date de début :</div>
                                                        <div className="text-secondary-light">
                                                            {licence.start_date}
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6 mb-2">
                                                        <div className="fw-semibold text-primary-light">Date de fin :</div>
                                                        <div className="text-secondary-light">
                                                            {licence.end_date}
                                                        </div>
                                                    </div>
                                                </div>
                                                {licence.description && (
                                                    <div className="mb-3">
                                                        <div className="fw-semibold text-primary-light">Description :</div>
                                                        <div className="text-secondary-light">{licence.description}</div>
                                                    </div>
                                                )}
                                                {licence.licence_request_id && (
                                                    <div className="mb-2">
                                                        <div className="fw-semibold text-primary-light">ID Demande de Licence :</div>
                                                        <div className="text-secondary-light">{licence.licence_request_id}</div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-4">
                                            <Icon icon="solar:shield-keyhole-outline" className="text-muted" style={{ fontSize: '3rem' }} />
                                            <p className="text-muted mt-2">Aucune licence</p>
                                            {licenceRequest && !showAddLicenceForm && (
                                                <button
                                                    className="btn rounded-pill btn-primary-100 text-primary-600 radius-8 px-20 py-11"
                                                    onClick={handleShowAddLicenceForm}
                                                >
                                                    Ajouter une licence
                                                </button>
                                            )}
                                            {showAddLicenceForm && (
                                                <form onSubmit={handleLicenceFormSubmit} className="mt-4" style={{maxWidth:400, margin:'0 auto', textAlign:'left'}}>
                                                                    <div className="mb-3">
                                                                        <label className="form-label">Type de licence</label>
                                                        <select className="form-control" name="type" value={licenceFormData.type} onChange={handleLicenceFormChange}>
                                                                            <option value="basic">Basic</option>
                                                                            <option value="professional">Professional</option>
                                                                            <option value="enterprise">Enterprise</option>
                                                                        </select>
                                                                    </div>
                                                                    <div className="mb-3">
                                                                        <label className="form-label">Statut</label>
                                                        <select className="form-control" name="status" value={licenceFormData.status} onChange={handleLicenceFormChange}>
                                                                            <option value="pending">En attente</option>
                                                                            <option value="paid">Payée</option>
                                                                            <option value="expired">Expirée</option>
                                                                            <option value="cancelled">Annulée</option>
                                                                        </select>
                                                                    </div>
                                                                    <div className="mb-3">
                                                                        <label className="form-label">Prix</label>
                                                        <input className="form-control" name="price" type="number" value={licenceFormData.price} readOnly />
                                                                        <small className="text-muted">Le prix est automatiquement défini selon le type de licence</small>
                                                                    </div>
                                                                    <div className="mb-3">
                                                                        <label className="form-label">Date de début</label>
                                                        <input className="form-control" name="start_date" type="date" value={licenceFormData.start_date} onChange={handleLicenceFormChange} />
                                                                    </div>
                                                                    <div className="mb-3">
                                                                        <label className="form-label">Date de fin</label>
                                                        <input className="form-control" name="end_date" type="date" value={licenceFormData.end_date} onChange={handleLicenceFormChange} />
                                                                    </div>
                                                    <div className="mb-3">
                                                        <label className="form-label">Clé de licence</label>
                                                        <input className="form-control" name="license_key" value={licenceFormData.license_key} readOnly />
                                                        <small className="text-muted">La clé de licence est générée automatiquement</small>
                                                                </div>
                                                                    <div className="mb-3">
                                                                        <label className="form-label">Description</label>
                                                        <textarea className="form-control" name="description" rows={3} value={licenceFormData.description} onChange={handleLicenceFormChange} />
                                                                    </div>
                                                                    <div className="mb-3">
                                                                        <label className="form-label">ID Demande de Licence</label>
                                                        <input className="form-control" name="licence_request_id" value={licenceFormData.licence_request_id} readOnly />
                                                            </div>
                                                            <div className="d-flex justify-content-end gap-2">
                                                        <button type="button" className="btn btn-secondary" onClick={()=>setShowAddLicenceForm(false)}>Annuler</button>
                                                                <button type="submit" className="btn btn-primary">Ajouter</button>
                                                            </div>
                                                        </form>
                                            )}
                                                    </div>
                                )}
                                </div>
                            </div>
                            
                            <div
                                className="tab-pane fade"
                                id="pills-licence-request"
                                role="tabpanel"
                                aria-labelledby="pills-licence-request-tab"
                                tabIndex={0}
                            >
                                <div>
                                    <h6 className="text-lg mb-8">Licence Request</h6>
                                    {licenceRequest ? (
                                        <div className="card mb-3">
                                            <div className="card-body">
                                                <div className="d-flex flex-wrap justify-content-between gap-3 border-bottom pb-2 mb-3">
                                                    <div>
                                                        <h5 className="text-xl mb-2">{licenceRequest.company_name}</h5>
                                                        <p className="mb-1 text-sm">
                                                            <Icon icon="solar:mailbox-outline" className="me-1" /> {licenceRequest.company_email}
                                                        </p>
                                                        <p className="mb-0 text-sm">
                                                            <Icon icon="solar:phone-outline" className="me-1" /> {licenceRequest.company_phone}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <span className={`badge px-16 py-8 fw-medium text-md ${licenceRequest.status === 'pending' ? 'bg-warning' : licenceRequest.status === 'validated' ? 'bg-success' : licenceRequest.status === 'rejected' ? 'bg-danger' : 'bg-secondary'}`}>{licenceRequest.status}</span>
                                                        <p className="mb-1 text-sm mt-2">
                                                            <Icon icon="solar:calendar-outline" className="me-1" />
                                                            {licenceRequest.requested_at ? new Date(licenceRequest.requested_at).toLocaleString() : ''}
                                                        </p>
                                                        <p className="mb-0 text-sm">
                                                            <Icon icon="solar:map-point-outline" className="me-1" /> {licenceRequest.company_address}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="row mb-3">
                                                    <div className="col-md-6 mb-2">
                                                        <div className="fw-semibold text-primary-light">Type de licence :</div>
                                                        <div className="text-secondary-light">{licenceRequest.type}</div>
                                                    </div>
                                                    <div className="col-md-6 mb-2">
                                                        <div className="fw-semibold text-primary-light">Durée (mois) :</div>
                                                        <div className="text-secondary-light">{licenceRequest.duration_months}</div>
                                                    </div>
                                                    <div className="col-md-6 mb-2">
                                                        <div className="fw-semibold text-primary-light">Prix :</div>
                                                        <div className="text-secondary-light">{licenceRequest.price} €</div>
                                                    </div>
                                                    <div className="col-md-6 mb-2">
                                                        <div className="fw-semibold text-primary-light">ID de la demande :</div>
                                                        <div className="text-secondary-light">{licenceRequest._id || licenceRequest.id}</div>
                                                    </div>
                                                </div>
                                                <div className="mb-3">
                                                    <div className="fw-semibold text-primary-light">Description :</div>
                                                    <div className="text-secondary-light">{licenceRequest.description}</div>
                                                </div>
                                                {licenceRequest.status === 'rejected' && licenceRequest.rejection_reason && (
                                                    <div className="mb-2">
                                                        <span className="fw-bold">Motif de rejet :</span>
                                                        <span className="ms-2 text-danger">{licenceRequest.rejection_reason}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="alert alert-warning mb-0">Aucune licence request associée à cette entreprise.</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row mt-4">
              <div className="col-12">
                <div className="card">
                  <div className="card-header d-flex flex-wrap align-items-center justify-content-between gap-3">
                    <div className="d-flex flex-wrap align-items-center gap-3">
                      <div className="d-flex align-items-center gap-2">
                        <span>Show</span>
                        <select className="form-select form-select-sm w-auto" defaultValue="Select Number">
                          <option value="Select Number" disabled>Select Number</option>
                          <option value="10">10</option>
                          <option value="15">15</option>
                          <option value="20">20</option>
                        </select>
                      </div>
                      <div className="icon-field">
                        <input
                          type="text"
                          className="form-control form-control-sm w-auto"
                          placeholder="Search"
                          value={search}
                          onChange={e => setSearch(e.target.value)}
                        />
                        <span className="icon">
                          <Icon icon="ion:search-outline" />
                        </span>
                      </div>
                    </div>
                    <div className="d-flex flex-wrap align-items-center gap-3">
                      <select className="form-select form-select-sm w-auto" value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
                        <option value="">Select Role</option>
                        <option value="superadmin">Super Admin</option>
                        <option value="moderateur">Moderateur</option>
                      </select>
                    </div>
                  </div>
                  <div className="card-body">
                    <table className="table bordered-table mb-0">
                      <thead>
                        <tr>
                          <th>S.L</th>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Role</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((user, index) => (
                          <tr key={user._id}>
                            <td>{String(index + 1).padStart(2, '0')}</td>
                            <td>
                              <div className="d-flex align-items-center">
                                <img
                                  src={`assets/images/user-list/user-list${(index % 10) + 1}.png`}
                                  alt=""
                                  className="flex-shrink-0 me-12 radius-8"
                                />
                                <h6 className="text-md mb-0 fw-medium flex-grow-1">
                                  {user.nom}
                                </h6>
                              </div>
                            </td>
                            <td>{user.email}</td>
                            <td>
                              <span className={
                                (user.role === 'superadminabshore' || user.role === 'superadminentreprise')
                                  ? 'bg-success-focus text-success-main px-24 py-4 rounded-pill fw-medium text-sm'
                                  : user.role === 'moderateur'
                                  ? 'bg-warning-focus text-warning-main px-24 py-4 rounded-pill fw-medium text-sm'
                                  : 'bg-secondary-light text-black px-24 py-4 rounded-pill fw-medium text-sm'
                              }>
                                {(user.role === 'superadminabshore' || user.role === 'superadminentreprise') ? 'Super Admin' : user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                              </span>
                            </td>
                            <td>
                              <Link
                                to={`/UserDetail/${user._id}`}
                                className="w-32-px h-32-px me-8 bg-primary-light text-primary-600 rounded-circle d-inline-flex align-items-center justify-content-center"
                              >
                                <Icon icon="iconamoon:eye-light" />
                              </Link>
                              <Link
                                to="#"
                                onClick={() => handleOpen(user)}
                                className="w-32-px h-32-px me-8 bg-success-focus text-success-main rounded-circle d-inline-flex align-items-center justify-content-center"
                              >
                                <Icon icon="lucide:edit" />
                              </Link>
                              <Link
                                to="#"
                                onClick={() => handleDelete(user._id)}
                                className="w-32-px h-32-px me-8 bg-danger-focus text-danger-main rounded-circle d-inline-flex align-items-center justify-content-center"
                              >
                                <Icon icon="mingcute:delete-2-line" />
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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

const superAdminSchema = yup.object().shape({
    nom: yup.string().required("Le nom est requis"),
    email: yup.string().email("Email invalide").required("L'email est requis"),
    tel: yup.string().optional(),
    password: yup.string()
        .min(6, "Le mot de passe doit contenir au moins 6 caractères")
        .matches(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
        .matches(/[a-z]/, "Le mot de passe doit contenir au moins une minuscule")
        .required("Le mot de passe est requis"),
    confirmPassword: yup.string()
        .oneOf([yup.ref('password'), null], "Les mots de passe doivent correspondre")
        .required("La confirmation du mot de passe est requise"),
    role: yup.string().oneOf(['superadminabshore', 'superadminentreprise'], 'Rôle invalide').required('Le rôle est requis'),
});

export default CompanyDetail;