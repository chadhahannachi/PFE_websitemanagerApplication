import React, { useEffect, useState } from "react";
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const ServicesList = () => {
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
  const [archiveId, setArchiveId] = useState(null);
  const [showArchiveModal, setShowArchiveModal] = useState(false);

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

  useEffect(() => {
    if (snackbar.open) {
      const timer = setTimeout(() => {
        setSnackbar(prev => ({ ...prev, open: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [snackbar.open]);

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
        const payload = {
          ...currentService,
          datePublication: currentService.datePublication || new Date().toISOString(),
        };
        await axios.post(
          "http://localhost:5000/contenus/Service",
          payload,
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

  const handleAskArchive = (id) => {
    setArchiveId(id);
    setShowArchiveModal(true);
  };

  const handleArchive = async () => {
    if (!archiveId) return;
    try {
      await axios.patch(`http://localhost:5000/contenus/Service/${archiveId}/archive`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setServices(prev => prev.filter(e => e._id !== archiveId));
      setSnackbar({
        open: true,
        message: "Service archivé avec succès !",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Erreur lors de l'archivage du service.",
        severity: "error",
      });
    } finally {
      setShowArchiveModal(false);
      setArchiveId(null);
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
    <>
      {snackbar.open && (
        <div
          className={`alert bg-${snackbar.severity === 'success' ? 'success-100' : 'danger-100'} text-${snackbar.severity === 'success' ? 'success-600' : 'danger-600'} border-${snackbar.severity === 'success' ? 'success-600' : 'danger-600'} border-start-width-4-px border-top-0 border-end-0 border-bottom-0 px-24 py-13 mb-0 fw-semibold text-lg radius-4 d-flex align-items-center justify-content-between`}
          role="alert"
          style={{ position: 'fixed', top: 24, right: 24, zIndex: 2000, minWidth: 320, maxWidth: 400, boxShadow: '0 2px 16px rgba(0,0,0,0.08)' }}
        >
          <div className="d-flex align-items-center gap-2">
            <span className="icon text-xl" style={{ display: 'flex', alignItems: 'center' }}>
              {snackbar.severity === 'success'
                ? <i className="ri-checkbox-circle-line" />
                : <i className="ri-close-circle-line" />}
            </span>
            {snackbar.message}
          </div>
          <button
            className={`remove-button text-${snackbar.severity === 'success' ? 'success-600' : 'danger-600'} text-xxl line-height-1`}
            onClick={handleCloseSnackbar}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <i className="ri-close-line" />
          </button>
        </div>
      )}
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
              className="btn rounded-pill btn-outline-primary-600 radius-8 px-20 py-11"
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
                {/* <th scope="col">Publié</th> */}
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
                  {/* <td>{service.isPublished ? "Oui" : "Non"}</td> */}
                  <td>
                    {/* <Link
                      to={`/ServiceDetail/${service._id}`}
                      className="w-32-px h-32-px me-8 bg-primary-light text-primary-600 rounded-circle d-inline-flex align-items-center justify-content-center"
                    >
                      <Icon icon="iconamoon:eye-light" />
                    </Link> */}
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentService({ ...service }); // service doit contenir _id
                        setEditModalOpen(true);
                      }}
                      className="w-32-px h-32-px me-8 bg-primary-light text-success-main rounded-circle d-inline-flex align-items-center justify-content-center"
                    >
                      <Icon icon="lucide:edit" />
                    </button>
                    <Link
                      to="#"
                      onClick={() => handleAskArchive(service._id)}
                      className="w-32-px h-32-px me-8 bg-primary-light text-info-pressed rounded-circle d-inline-flex align-items-center justify-content-center"
                      title="Archiver"
                    >
                      <Icon icon="mdi:archive-outline" />
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
      </div>
      {addModalOpen || editModalOpen ? (
        <>
          {/* Overlay sombre */}
          <div className="modal-backdrop fade show" style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',zIndex:1000,background:'rgba(0,0,0,0.3)'}}></div>
          {/* Modal centré */}
          <div className="modal fade show" style={{display:'block',zIndex:1100}} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content p-4" style={{ border: 'none', boxShadow: '0 2px 16px rgba(0,0,0,0.12)' }}>
                <div className="modal-header" style={{ border: 'none', boxShadow: 'none' }}>
                  <h6 className="modal-title fw-semibold w-100 text-center" style={{ letterSpacing: '0.5px' }}>
                    {addModalOpen ? 'Ajouter un Service' : 'Modifier le Service'}
                  </h6>
                  <button type="button" className="btn-close" onClick={() => { setAddModalOpen(false); setEditModalOpen(false); }}></button>
                </div>
                <div className="modal-body" style={{ overflowY: 'auto', maxHeight: '70vh', border: 'none', boxShadow: 'none' }}>
                  {/* Titre */}
                  <div className="mb-3">
                    <label className="form-label">Titre</label>
                    <input
                      type="text"
                      className="form-control"
                      value={currentService.titre}
                      onChange={e => setCurrentService(prev => ({ ...prev, titre: e.target.value }))}
                      placeholder="Titre du service"
                    />
                  </div>
                  {/* Description */}
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      value={currentService.description}
                      onChange={e => setCurrentService(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Description du service"
                      rows={4}
                      style={{ minHeight: 80 }}
                    />
                  </div>
                  {/* Image */}
                  <div className="mb-3">
                    <label className="form-label">Image</label>
                    <input type="file" accept="image/*" onChange={handleFileChange} className="form-control" />
                    <button onClick={uploadImage} className="btn btn-sm btn-primary-600">Uploader l'image</button>
                    {currentService.image && (
                      <img src={currentService.image} alt="Aperçu" className="mt-2" style={{ width: 'auto', maxWidth: '50%', maxHeight: '50%', objectFit: 'cover', borderRadius: '6px' }} onError={e => { e.target.src = 'https://via.placeholder.com/150'; }} />
                    )}
                  </div>
                  {/* (Champ datePublication supprimé) */}
                </div>
                <div className="modal-footer" style={{ border: 'none', boxShadow: 'none' }}>
                  <button type="button" className="btn btn-secondary-600" onClick={() => { setAddModalOpen(false); setEditModalOpen(false); }}>Annuler</button>
                  <button type="button" className="btn btn-sm btn-primary-600" onClick={handleSave}>{addModalOpen ? 'Create' : 'Update'}</button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
      {/* Modal de confirmation d'archivage */}
      {showArchiveModal && (
        <>
          <div className="modal-backdrop fade show" style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',zIndex:1000,background:'rgba(0,0,0,0.3)'}}></div>
          <div className="modal fade show" style={{display:'block',zIndex:1100}} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content" style={{ border: 'none', boxShadow: '0 2px 16px rgba(0,0,0,0.12)' }}>
                <div className="modal-header" style={{ border: 'none', boxShadow: 'none' }}>
                  <h6 className="modal-title fw-semibold">Archivage du service</h6>
                  <button type="button" className="btn-close" onClick={() => setShowArchiveModal(false)}></button>
                </div>
                <div className="modal-body" style={{ border: 'none', boxShadow: 'none' }}>
                  Êtes-vous sûr de vouloir archiver ce service ?
                </div>
                <div className="modal-footer" style={{ border: 'none', boxShadow: 'none' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowArchiveModal(false)}>Annuler</button>
                  <button type="button" className="btn btn-warning" onClick={handleArchive}>Archiver</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ServicesList;