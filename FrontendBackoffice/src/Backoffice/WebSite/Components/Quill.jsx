import React, { useEffect, useState } from "react";
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const AboutUsSection = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("Utilisateur");
  const [userRole, setUserRole] = useState("Rôle");
  const [userEntreprise, setUserEntreprise] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [updatedTitre, setUpdatedTitre] = useState("");
  const [updatedDescription, setUpdatedDescription] = useState("");
  const [updatedImage, setUpdatedImage] = useState("");
  const [updatedIsPublished, setUpdatedIsPublished] = useState(false);
  const [updatedDatePublication, setUpdatedDatePublication] = useState("");
  const [imageSelected, setImageSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [serviceToEdit, setServiceToEdit] = useState(null);
  const [currentService, setCurrentService] = useState({
    titre: '',
    description: '',
    image: '',
    isPublished: false,
    datePublication: '',
    entreprise: userEntreprise || '',
  });

  const token = localStorage.getItem("token");
  let userId = null;

  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      userId = decodedToken.sub;
    } catch (error) {
      console.error("Erreur lors du décodage du token :", error);
      setSnackbar({
        open: true,
        message: "Erreur lors du décodage du token.",
        severity: "error",
      });
      setLoading(false);
    }
  } else {
    console.error("Token manquant dans localStorage.");
    setSnackbar({
      open: true,
      message: "Token manquant. Veuillez vous connecter.",
      severity: "error",
    });
    setLoading(false);
  }

  useEffect(() => {
    const fetchUserData = async () => {
      if (!token || !userId) {
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get(`http://localhost:5000/auth/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserName(response.data.nom);
        setUserRole(response.data.role);
        setUserEntreprise(response.data.entreprise);
      } catch (error) {
        console.error("Erreur lors de la récupération des données de l'utilisateur :", error);
        setSnackbar({
          open: true,
          message: "Erreur lors de la récupération des données utilisateur.",
          severity: "error",
        });
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchServicesByEntreprise = async () => {
      if (!token || !userId || !userEntreprise) {
        setLoading(false);
        return;
      }
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(
          `http://localhost:5000/contenus/Service/entreprise/${userEntreprise}`,
          config
        );
        setServices(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des services :", error);
        setSnackbar({
          open: true,
          message: "Erreur lors de la récupération des services.",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    };
    if (userEntreprise) {
      fetchServicesByEntreprise();
    }
  }, [userEntreprise]);

  const handleOpen = (service) => {
    setSelectedService(service);
    setUpdatedTitre(service.titre);
    setUpdatedDescription(service.description);
    setUpdatedImage(service.image);
    setUpdatedIsPublished(service.isPublished);
    setUpdatedDatePublication(service.datePublication);
    setImageSelected(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedService(null);
    setImageSelected(null);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageSelected(file);
  };

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
      setCurrentService(prev => ({ ...prev, image: response.data.secure_url }));
      setSnackbar({
        open: true,
        message: "Image uploadée avec succès !",
        severity: "success",
      });
    } catch (error) {
      console.error("Erreur lors de l'upload de l'image :", error);
      setSnackbar({
        open: true,
        message: "Erreur lors de l'upload de l'image. Veuillez réessayer.",
        severity: "error",
      });
    }
  };
  // Fonction pour rafraîchir la liste des services
  const fetchServices = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      if (!userEntreprise) return;
      const response = await axios.get(
        `http://localhost:5000/contenus/Service/entreprise/${userEntreprise}`,
        config
      );
      setServices(response.data);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Erreur lors de la récupération des services.",
        severity: "error",
      });
    }
  };

  // Fonction d'ajout ou de modification
  const handleSave = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      // Si _id existe, c'est une modification
      if (currentService._id) {
        await axios.patch(
          `http://localhost:5000/contenus/Service/${currentService._id}`,
          currentService,
          config
        );
        setSnackbar({
          open: true,
          message: "Service modifié avec succès !",
          severity: "success",
        });
      } else {
        if (!currentService.entreprise) {
          throw new Error("L'entreprise du service n'est pas définie.");
        }
        await axios.post(
          "http://localhost:5000/contenus/Service",
          currentService,
          config
        );
        setSnackbar({
          open: true,
          message: "Service créé avec succès !",
          severity: "success",
        });
      }
      setAddModalOpen(false);
      setEditModalOpen(false);
      setCurrentService({
        _id: null,
        titre: "",
        description: "",
        image: "",
        datePublication: "",
        isPublished: false,
        entreprise: userEntreprise || "",
      });
      fetchServices();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du service", error);
      setSnackbar({
        open: true,
        message: error.message || "Erreur lors de la sauvegarde du service.",
        severity: "error",
      });
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.patch(
        `http://localhost:5000/contenus/Service/${selectedService._id}`,
        {
          titre: updatedTitre,
          description: updatedDescription,
          image: updatedImage,
          isPublished: updatedIsPublished,
          datePublication: updatedDatePublication,
          entreprise: userEntreprise,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setServices(services.map(service =>
        service._id === selectedService._id
          ? { ...service, titre: updatedTitre, description: updatedDescription, image: updatedImage, isPublished: updatedIsPublished, datePublication: updatedDatePublication }
          : service
      ));
      setSnackbar({
        open: true,
        message: "Service modifié avec succès !",
        severity: "success",
      });
      handleClose();
    } catch (error) {
      console.error("Erreur lors de la mise à jour du service :", error);
      setSnackbar({
        open: true,
        message: "Erreur lors de la mise à jour du service.",
        severity: "error",
      });
    }
  };

  const handleDelete = async (serviceId) => {
    try {
      await axios.delete(`http://localhost:5000/contenus/Service/${serviceId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setServices(services.filter(service => service._id !== serviceId));
      setSnackbar({
        open: true,
        message: "Service supprimé avec succès !",
        severity: "success",
      });
    } catch (error) {
      console.error("Erreur lors de la suppression du service :", error);
      setSnackbar({
        open: true,
        message: "Erreur lors de la suppression du service.",
        severity: "error",
      });
    }
  };

  // Fonction utilitaire pour tronquer le texte
  function truncateText(text, maxLength = 40) {
    if (!text) return '';
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  }

  if (loading) {
    return <span>Loading...</span>;
  }

  const filteredServices = services.filter(service =>
    service.titre.toLowerCase().includes(search.toLowerCase()) ||
    service.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
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
          <Link
            to="#"
            className="btn btn-sm btn-primary-600"
            onClick={() => {
              setCurrentService({
                titre: '',
                description: '',
                image: '',
                isPublished: false,
                datePublication: '',
                entreprise: userEntreprise || '',
              });
              setImageSelected(null);
              setAddModalOpen(true);
            }}
          >
            <i className="ri-add-line" /> Add Service
          </Link>
        </div>
      </div>
      <div className="card-body">
        <div className="table-responsive">
        <table className="table bordered-table mb-0">
          <thead>
            <tr>
              <th scope="col">
                <div className="form-check style-check d-flex align-items-center">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    defaultValue=""
                    id="checkAll"
                  />
                  <label className="form-check-label" htmlFor="checkAll">
                    S.L
                  </label>
                </div>
              </th>
              <th scope="col">Titre</th>
              <th scope="col">Description</th>
              <th scope="col">Image</th>
              <th scope="col">Publié</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredServices.map((service, index) => (
              <tr key={service._id}>
                <td>
                  <div className="form-check style-check d-flex align-items-center">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      defaultValue=""
                      id={`check${index + 1}`}
                    />
                    <label className="form-check-label" htmlFor={`check${index + 1}`}>
                      {String(index + 1).padStart(2, '0')}
                    </label>
                  </div>
                </td>
                <td>{truncateText(service.titre)}</td>
                <td>{truncateText(service.description)}</td>
                <td>
                  <img
                    src={service.image || "https://via.placeholder.com/50"}
                    alt={service.titre}
                    className="flex-shrink-0 me-12 radius-8"
                    style={{ width: "50px", height: "50px", objectFit: "cover" }}
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/50";
                    }}
                  />
                </td>
                <td>{service.isPublished ? "Oui" : "Non"}</td>
                <td>
                  <Link
                    to={`/ServiceDetail/${service._id}`}
                    className="w-32-px h-32-px me-8 bg-primary-light text-primary-600 rounded-circle d-inline-flex align-items-center justify-content-center"
                  >
                    <Icon icon="iconamoon:eye-light" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentService({ ...service }); // service doit contenir _id
                      setEditModalOpen(true);
                    }}
                    className="w-32-px h-32-px me-8 bg-success-focus text-success-main rounded-circle d-inline-flex align-items-center justify-content-center"
                  >
                    <Icon icon="lucide:edit" />
                  </button>
                  <Link
                    to="#"
                    onClick={() => handleDelete(service._id)}
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
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mt-24">
          <span>Showing 1 to {filteredServices.length} of {filteredServices.length} entries</span>
          <ul className="pagination d-flex flex-wrap align-items-center gap-2 justify-content-center">
            <li className="page-item">
              <Link
                className="page-link text-secondary-light fw-medium radius-4 border-0 px-10 py-10 d-flex align-items-center justify-content-center h-32-px me-8 w-32-px bg-base"
                to="#"
              >
                <Icon icon="ep:d-arrow-left" className="text-xl" />
              </Link>
            </li>
            <li className="page-item">
              <Link
                className="page-link bg-primary-600 text-white fw-medium radius-4 border-0 px-10 py-10 d-flex align-items-center justify-content-center h-32-px me-8 w-32-px"
                to="#"
              >
                1
              </Link>
            </li>
            <li className="page-item">
              <Link
                className="page-link bg-primary-50 text-secondary-light fw-medium radius-4 border-0 px-10 py-10 d-flex align-items-center justify-content-center h-32-px me-8 w-32-px"
                to="#"
              >
                2
              </Link>
            </li>
            <li className="page-item">
              <Link
                className="page-link bg-primary-50 text-secondary-light fw-medium radius-4 border-0 px-10 py-10 d-flex align-items-center justify-content-center h-32-px me-8 w-32-px"
                to="#"
              >
                3
              </Link>
            </li>
            <li className="page-item">
              <Link
                className="page-link text-secondary-light fw-medium radius-4 border-0 px-10 py-10 d-flex align-items-center justify-content-center h-32-px me-8 w-32-px bg-base"
                to="#"
              >
                <Icon icon="ep:d-arrow-right" className="text-xl" />
              </Link>
            </li>
          </ul>
        </div>
      </div>
      {(addModalOpen || editModalOpen) && (
        <>
          {/* Overlay sombre */}
          <div className="modal-backdrop fade show" style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',zIndex:1000,background:'rgba(0,0,0,0.3)'}}></div>
          {/* Modal centré */}
          <div className="modal fade show" style={{display:'block',zIndex:1100}} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content p-4">
                <div className="modal-header">
                  <h6 className="modal-title fw-semibold w-100 text-center">
                    {addModalOpen ? 'Ajouter un Service' : 'Modifier le Service'}
                  </h6>
                  <button type="button" className="btn-close" onClick={() => { setAddModalOpen(false); setEditModalOpen(false); }}></button>
                </div>
                <div className="modal-body" style={{ overflowY: 'auto', maxHeight: '70vh' }}>
                  {/* Titre */}
                  <div className="mb-3">
                    <label className="form-label">Titre</label>


                    <>
                        <style>
                            {`
                            .custom-quill .ql-editor {
                                min-height: 50px;
                                max-height: 150px;
                                height: auto;
                                overflow-y: auto;
                                font-size: 14px;
                                padding: 10px;
                                line-height: 1.5;
                            }
                            `}
                        </style>

                        <ReactQuill
                            value={currentService.titre}
                            onChange={val => setCurrentService(prev => ({ ...prev, titre: val }))}
                            className="custom-quill"
                            placeholder="Titre du service"
                        />
                        </>

                  </div>
                  {/* Description */}
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <>
                        <style>
                            {`
                            .custom-quill .ql-editor {
                                min-height: 100px;
                                max-height: 300px;
                                height: auto;
                                overflow-y: auto;
                                font-size: 14px;
                                padding: 10px;
                                line-height: 1.5;
                            }
                            `}
                        </style>

                        <ReactQuill
                            value={currentService.description}
                            onChange={val => setCurrentService(prev => ({ ...prev, description: val }))}
                            className="custom-quill"
                            placeholder="Description du service"
                        />
                        </>

                    {/* <ReactQuill
                      value={currentService.description}
                      onChange={val => setCurrentService(prev => ({ ...prev, description: val }))}
                      placeholder="Description du service"
                      style={{ height: '100px', overflow: 'auto'  }}
                    //   style={{ minHeight: 40, maxHeight: 120, overflow: 'auto' }}
                    /> */}
                  </div>
                  {/* Image */}
                  <div className="mb-3">
                    <label className="form-label">Image</label>
                    <input type="file" accept="image/*" onChange={handleFileChange} className="form-control" />
                    <button onClick={uploadImage} className="btn btn-primary btn-sm mt-2">Uploader l'image</button>
                    {currentService.image && (
                      <img src={currentService.image} alt="Aperçu" className="mt-2" style={{ width: 'auto', maxWidth: '50%', maxHeight: '50%', objectFit: 'cover', borderRadius: '6px' }} onError={e => { e.target.src = 'https://via.placeholder.com/150'; }} />
                    )}
                  </div>
                  {/* Date de publication */}
                  <div className="mb-3">
                    <label className="form-label">Date de Publication</label>
                    <input type="date" value={currentService.datePublication} onChange={e => setCurrentService(prev => ({ ...prev, datePublication: e.target.value }))} className="form-control" />
                  </div>
                  {/* Checkbox publié */}
                  <div className="mb-3 form-check">
                    <input type="checkbox" className="form-check-input" id="isPublishedCheck" checked={currentService.isPublished} onChange={e => setCurrentService(prev => ({ ...prev, isPublished: e.target.checked }))} />
                    <label className="form-check-label" htmlFor="isPublishedCheck">Publié</label>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => { setAddModalOpen(false); setEditModalOpen(false); }}>Annuler</button>
                  <button type="button" className="btn btn-primary" onClick={handleSave}>{addModalOpen ? 'Créer' : 'Modifier'}</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      <div className={`mt-3 alert alert-${snackbar.severity === 'success' ? 'success' : 'danger'} ${snackbar.open ? '' : 'd-none'}`}>
        {snackbar.message}
        <button
          type="button"
          className="btn-close float-end"
          onClick={handleCloseSnackbar}
        ></button>
      </div>
    </div>
  );
};

export default AboutUsSection ;



