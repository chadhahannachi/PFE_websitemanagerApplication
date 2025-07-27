import { Icon } from '@iconify/react/dist/iconify.js';
import React, { useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import * as yup from "yup";
import { Formik } from 'formik';

const Profile = () => {
    const [imagePreview, setImagePreview] = useState('assets/images/user.png');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const [imageSelected, setImageSelected] = useState(null);

    const [snackbar, setSnackbar] = useState({
      open: false,
      message: "",
      severity: "success",
    });

    // Toggle function for password field
    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    // Toggle function for confirm password field
    const toggleConfirmPasswordVisibility = () => {
        setConfirmPasswordVisible(!confirmPasswordVisible);
    };

    // const readURL = (input) => {
    //     if (input.target.files && input.target.files[0]) {
    //         const file = input.target.files[0];
    //         setImageSelected(file);
    //         const reader = new FileReader();
    //         reader.onload = (e) => {
    //             setImagePreview(e.target.result);
    //         };
    //         reader.readAsDataURL(file);
    //     }
    // };

    const uploadImage = async () => {
        if (!imageSelected) {
            setSnackbar({
                open: true,
                message: "Veuillez sélectionner une image avant d'uploader.",
                severity: "warning",
            });
            return;
        }

        const formData = new FormData();
        formData.append("file", imageSelected);
        formData.append("upload_preset", "chadha");

        try {
            const response = await axios.post(
                "https://api.cloudinary.com/v1_1/duvcpe6mx/image/upload",
                formData
            );
            
            // Mettre à jour le profil utilisateur avec la nouvelle image
            const token = localStorage.getItem('token');
            if (token && userProfile) {
                const updateResponse = await axios.put(
                    `http://localhost:5000/auth/users/update/${userProfile._id}`,
                    { image: response.data.secure_url },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );
                
                setUserProfile(updateResponse.data);
                setImagePreview(response.data.secure_url);
                setSnackbar({
                    open: true,
                    message: "Image uploadée et profil mis à jour avec succès !",
                    severity: "success",
                });
            }
        } catch (error) {
            console.error("Error uploading image:", error);
            setSnackbar({
                open: true,
                message: "Erreur lors de l'upload de l'image. Veuillez réessayer.",
                severity: "error",
            });
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setImageSelected(file);
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };


    // Récupérer les données du profil utilisateur
    useEffect(() => {
        const fetchUserProfile = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await axios.get('http://localhost:5000/auth/profile', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    
                    // Si l'entreprise n'est pas peuplée, la récupérer séparément
                    let userData = response.data.user;
                    if (userData.entreprise && typeof userData.entreprise === 'string') {
                        try {
                            const entrepriseResponse = await axios.get(`http://localhost:5000/entreprises/${userData.entreprise}`);
                            userData.entreprise = entrepriseResponse.data;
                        } catch (error) {
                            console.error("Erreur lors de la récupération de l'entreprise:", error);
                        }
                    }
                    
                    setUserProfile(userData);
                    setLoading(false);
                } catch (error) {
                    console.error("Erreur lors de la récupération du profil :", error);
                    setLoading(false);
                }
            }
        };
        fetchUserProfile();
    }, []);

    // Gérer la mise à jour du profil
    const handleProfileUpdate = async (values) => {
        const token = localStorage.getItem('token');
        if (token && userProfile) {
            try {
                const response = await axios.put(`http://localhost:5000/auth/users/update/${userProfile._id}`, values, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                setUserProfile(response.data);
                setUpdateSuccess(true);
                setTimeout(() => setUpdateSuccess(false), 3000);
            } catch (error) {
                console.error("Erreur lors de la mise à jour du profil :", error);
                alert('Erreur lors de la mise à jour du profil');
            }
        }
    };

    // Gérer le changement de mot de passe
    // const handlePasswordChange = async (values) => {
    //     const token = localStorage.getItem('token');
    //     if (token && userProfile) {
    //         try {
    //             const response = await axios.patch('http://localhost:5000/auth/changePass', {
    //                 newPass: values.newPassword,
    //                 confirmNewPass: values.confirmPassword
    //             }, {
    //                 headers: {
    //                     Authorization: `Bearer ${token}`,
    //                     'Content-Type': 'application/json',
    //                 },
    //             });
    //             alert('Mot de passe modifié avec succès');
    //             // Réinitialiser les champs de mot de passe
    //             document.getElementById('new-password').value = '';
    //             document.getElementById('confirm-password').value = '';
    //         } catch (error) {
    //             console.error("Erreur lors du changement de mot de passe :", error);
    //             alert('Erreur lors du changement de mot de passe');
    //         }
    //     }
    // };

    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
  
    const handlePasswordChange = async (e) => {
        e.preventDefault();
        try {
          // Utilisez l'email du profil utilisateur au lieu d'un champ de saisie
          await axios.post('http://localhost:5000/auth/reset-password-request', { 
            email
          });
          setMessage('Un email de réinitialisation a été envoyé à ' + email);
          setMessageType('success');
        } catch (error) {
          console.error("Error sending reset request:", error);
          setMessage('Erreur lors de la demande. Vérifiez que votre email est correct.');
          setMessageType('error');
        }
      };


    if (loading) {
        return <div className="text-center p-4">Chargement du profil...</div>;
    }

    if (!userProfile) {
        return <div className="text-center p-4">Erreur lors du chargement du profil</div>;
    }

    return (
        <div className="row gy-4">
            <div className="col-lg-4">
                <div className="user-grid-card position-relative border radius-16 overflow-hidden bg-base h-100">
                    <img
                        src="assets/images/user-grid/user-grid-bg1.jpg"
                        alt=""
                        className="w-100 object-fit-cover"
                    />
                    <div className="pb-24 ms-16 mb-24 me-16  mt--100">
                        <div className="text-center border border-top-0 border-start-0 border-end-0">
                            <img
                                src={userProfile.image || imagePreview}
                                alt="Profile"
                                className="border br-white border-width-2-px w-200-px h-200-px rounded-circle object-fit-cover"
                            />
                            <h6 className="mb-0 mt-16">{userProfile.nom}</h6>
                            <span className="text-secondary-light mb-16">{userProfile.email}</span>
                        </div>
                        <div className="mt-24">
                            <h6 className="text-xl mb-16">Personal Info</h6>
                            <ul>
                                <li className="d-flex align-items-center gap-1 mb-12">
                                    <span className="w-30 text-md fw-semibold text-primary-light">
                                        Full Name
                                    </span>
                                    <span className="w-70 text-secondary-light fw-medium">
                                        : {userProfile.nom}
                                    </span>
                                </li>
                                <li className="d-flex align-items-center gap-1 mb-12">
                                    <span className="w-30 text-md fw-semibold text-primary-light">
                                        Email
                                    </span>
                                    <span className="w-70 text-secondary-light fw-medium">
                                        : {userProfile.email}
                                    </span>
                                </li>
                                <li className="d-flex align-items-center gap-1 mb-12">
                                    <span className="w-30 text-md fw-semibold text-primary-light">
                                        Phone Number
                                    </span>
                                    <span className="w-70 text-secondary-light fw-medium">
                                        : {userProfile.tel || 'Non renseigné'}
                                    </span>
                                </li>
                                <li className="d-flex align-items-center gap-1 mb-12">
                                    <span className="w-30 text-md fw-semibold text-primary-light">
                                        Role
                                    </span>
                                    <span className="w-70 text-secondary-light fw-medium">
                                        : {userProfile.role}
                                    </span>
                                </li>
                                <li className="d-flex align-items-center gap-1 mb-12">
                                    <span className="w-30 text-md fw-semibold text-primary-light">
                                        Entreprise
                                    </span>
                                    <span className="w-70 text-secondary-light fw-medium">
                                        : {userProfile.entreprise?.nom || 'Non renseigné'}
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
                                Profil mis à jour avec succès !
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
                                    className="nav-link d-flex align-items-center px-24 active"
                                    id="pills-edit-profile-tab"
                                    data-bs-toggle="pill"
                                    data-bs-target="#pills-edit-profile"
                                    type="button"
                                    role="tab"
                                    aria-controls="pills-edit-profile"
                                    aria-selected="true"
                                >
                                    Edit Profile
                                </button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button
                                    className="nav-link d-flex align-items-center px-24"
                                    id="pills-change-passwork-tab"
                                    data-bs-toggle="pill"
                                    data-bs-target="#pills-change-passwork"
                                    type="button"
                                    role="tab"
                                    aria-controls="pills-change-passwork"
                                    aria-selected="false"
                                    tabIndex={-1}
                                >
                                    Change Password
                                </button>
                            </li>
                        </ul>
                        <div className="tab-content" id="pills-tabContent">
                            <div
                                className="tab-pane fade show active"
                                id="pills-edit-profile"
                                role="tabpanel"
                                aria-labelledby="pills-edit-profile-tab"
                                tabIndex={0}
                            >
                                <h6 className="text-md text-primary-light mb-16">Profile Image</h6>
                                {/* Upload Image Start */}
                                <div className="mb-24 mt-16">
                                    <div className="avatar-upload">
                                        <div className="avatar-edit position-absolute bottom-0 end-0 me-24 mt-16 z-1 cursor-pointer">
                                            <input
                                                type="file"
                                                id="imageUpload"
                                                accept=".png, .jpg, .jpeg"
                                                hidden
                                                onChange={handleFileChange}
                                            />
                                            <label
                                                htmlFor="imageUpload"
                                                className="w-32-px h-32-px d-flex justify-content-center align-items-center bg-primary-50 text-primary-600 border border-primary-600 bg-hover-primary-100 text-lg rounded-circle"
                                            >
                                                <Icon icon="solar:camera-outline" className="icon"></Icon>
                                            </label>
                                        </div>
                                        <div className="avatar-preview">
                                            <div
                                                id="imagePreview"
                                                style={{
                                                    backgroundImage: `url(${userProfile.image || imagePreview})`,
                                                    backgroundSize: 'cover',
                                                    backgroundPosition: 'center'
                                                }}
                                            />
                                        </div>
                                    </div>
                                    {imageSelected && (
                                        <div className="mt-3 text-center">
                                            <button
                                                type="button"
                                                className="btn btn-primary btn-sm"
                                                onClick={uploadImage}
                                            >
                                                Upload Image
                                            </button>
                                        </div>
                                    )}
                                </div>
                                {/* Upload Image End */}
                                <Formik
                                    initialValues={{
                                        nom: userProfile.nom || '',
                                        email: userProfile.email || '',
                                        tel: userProfile.tel || ''
                                    }}
                                    validationSchema={profileSchema}
                                    onSubmit={handleProfileUpdate}
                                    enableReinitialize
                                >
                                    {({ values, errors, touched, handleBlur, handleChange, handleSubmit }) => (
                                        <form onSubmit={handleSubmit}>
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <div className="mb-20">
                                                <label
                                                    htmlFor="name"
                                                    className="form-label fw-semibold text-primary-light text-sm mb-8"
                                                >
                                                    Full Name
                                                    <span className="text-danger-600">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                            name="nom"
                                                    className="form-control radius-8"
                                                    id="name"
                                                    placeholder="Enter Full Name"
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
                                                    Email <span className="text-danger-600">*</span>
                                                </label>
                                                <input
                                                    type="email"
                                                            name="email"
                                                    className="form-control radius-8"
                                                    id="email"
                                                    placeholder="Enter email address"
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
                                                    Phone
                                                </label>
                                                <input
                                                            type="text"
                                                            name="tel"
                                                    className="form-control radius-8"
                                                            id="tel"
                                                    placeholder="Enter phone number"
                                                            value={values.tel}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-center gap-3">
                                        <button
                                                    type="submit"
                                            className="btn rounded-pill btn-primary-100 text-primary-600 radius-8 px-20 py-11"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </form>
                                    )}
                                </Formik>
                            </div>



                            
                            <div className="tab-pane fade" id="pills-change-passwork" role="tabpanel" aria-labelledby="pills-change-passwork-tab" tabIndex="0">
                                
                                    
                                        <form onSubmit={handlePasswordChange}>
                                <div className="mb-20">
                                                <label htmlFor="new-password" className="form-label fw-semibold text-primary-light text-sm mb-8">
                                                    Email <span className="text-danger-600">*</span>
                                    </label>
                                    <div className="position-relative">
                                        <input
                                                        type={passwordVisible ? "text" : "email"}
                                                        name="email"
                                            className="form-control radius-8"
                                                        id="email"
                                                        placeholder="Enter Your email*"
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                        />
                                        <span
                                            className={`toggle-password ${passwordVisible ? "ri-eye-off-line" : "ri-eye-line"} cursor-pointer position-absolute end-0 top-50 translate-middle-y me-16 text-secondary-light`}
                                            onClick={togglePasswordVisibility}
                                        ></span>
                                    </div>
                                                
                                </div>

                                            <div className="d-flex align-items-center justify-content-center">
                                                <button
                                                    type="submit"
                                                    className="btn rounded-pill btn-primary-100 text-primary-600 radius-8 px-20 py-11"
                                                >
                                                    Change Password
                                                </button>
                                    </div>
                                        </form>
                                    
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const profileSchema = yup.object().shape({
    nom: yup.string().required("Le nom est requis"),
    email: yup.string().email("Email invalide").required("L'email est requis"),
    tel: yup.string().optional(),
});

const passwordSchema = yup.object().shape({
    newPassword: yup.string()
        .min(6, "Le mot de passe doit contenir au moins 6 caractères")
        .matches(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
        .matches(/[a-z]/, "Le mot de passe doit contenir au moins une minuscule")
        .required("Le nouveau mot de passe est requis"),
    confirmPassword: yup.string()
        .oneOf([yup.ref('newPassword'), null], "Les mots de passe doivent correspondre")
        .required("La confirmation du mot de passe est requise"),
});

export default Profile;