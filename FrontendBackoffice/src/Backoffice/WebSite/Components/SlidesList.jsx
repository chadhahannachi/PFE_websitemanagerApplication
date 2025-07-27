import React, { useEffect, useState } from "react";
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const SlidesList = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("Utilisateur");
  const [userRole, setUserRole] = useState("Rôle");
  const [userEntreprise, setUserEntreprise] = useState(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState({
    titre: '',
    description: '',
    image: '',
    datePublication: '',
    entreprise: userEntreprise || '',
  });
  const [imageSelected, setImageSelected] = useState(null);
  const [archiveId, setArchiveId] = useState(null);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [search, setSearch] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const token = localStorage.getItem("token");
  let userId = null;

  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      userId = decodedToken.sub;
    } catch (error) {
      setSnackbar({ open: true, message: "Erreur lors du décodage du token.", severity: "error" });
      setLoading(false);
    }
  } else {
    setSnackbar({ open: true, message: "Token manquant. Veuillez vous connecter.", severity: "error" });
    setLoading(false);
  }

  useEffect(() => {
    const fetchUserData = async () => {
      if (!token || !userId) { setLoading(false); return; }
      try {
        const response = await axios.get(`http://localhost:5000/auth/user/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
        setUserName(response.data.nom);
        setUserRole(response.data.role);
        setUserEntreprise(response.data.entreprise);
      } catch (error) {
        setSnackbar({ open: true, message: "Erreur lors de la récupération des données utilisateur.", severity: "error" });
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchSlidesByEntreprise = async () => {
      if (!token || !userId || !userEntreprise) { setLoading(false); return; }
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(`http://localhost:5000/slides/entreprise/${userEntreprise}/slides`, config);
        setSlides(response.data);
      } catch (error) {
        setSnackbar({ open: true, message: "Erreur lors de la récupération des slides.", severity: "error" });
      } finally {
        setLoading(false);
      }
    };
    if (userEntreprise) fetchSlidesByEntreprise();
  }, [userEntreprise]);

  useEffect(() => {
    if (snackbar.open) {
      const timer = setTimeout(() => setSnackbar(prev => ({ ...prev, open: false })), 3000);
      return () => clearTimeout(timer);
    }
  }, [snackbar.open]);

  const fetchSlides = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      if (!userEntreprise) return;
      const response = await axios.get(`http://localhost:5000/slides/entreprise/${userEntreprise}/slides`, config);
      setSlides(response.data);
    } catch (error) {
      setSnackbar({ open: true, message: "Erreur lors de la récupération des slides.", severity: "error" });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageSelected(file);
  };

  const uploadImage = async () => {
    if (!imageSelected) {
      setSnackbar({ open: true, message: "Veuillez sélectionner une image avant d'uploader.", severity: "warning" });
      return;
    }
    const formData = new FormData();
    formData.append("file", imageSelected);
    formData.append("upload_preset", "chadha");
    try {
      const response = await axios.post("https://api.cloudinary.com/v1_1/duvcpe6mx/image/upload", formData);
      setCurrentSlide(prev => ({ ...prev, image: response.data.secure_url }));
      setSnackbar({ open: true, message: "Image uploadée avec succès !", severity: "success" });
    } catch (error) {
      setSnackbar({ open: true, message: "Erreur lors de l'upload de l'image. Veuillez réessayer.", severity: "error" });
    }
  };

  // Ajout ou modification
  const handleSave = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      if (currentSlide._id) {
        await axios.patch(`http://localhost:5000/slides/${currentSlide._id}`, currentSlide, config);
        setSnackbar({ open: true, message: "Slide modifiée avec succès !", severity: "success" });
      } else {
        if (!userEntreprise) throw new Error("L'entreprise de la slide n'est pas définie.");
        const payload = { ...currentSlide, datePublication: currentSlide.datePublication || new Date().toISOString(), entreprise: userEntreprise };
        await axios.post("http://localhost:5000/slides", payload, config);
        setSnackbar({ open: true, message: "Slide créée avec succès !", severity: "success" });
      }
      setAddModalOpen(false);
      setEditModalOpen(false);
      setCurrentSlide({ _id: null, titre: '', description: '', image: '', datePublication: '', entreprise: userEntreprise || '' });
      fetchSlides();
    } catch (error) {
      setSnackbar({ open: true, message: error.message || "Erreur lors de la sauvegarde de la slide.", severity: "error" });
    }
  };

  // Ouvre le modal d'édition
  const handleEdit = (slide) => {
    setCurrentSlide({ ...slide });
    setEditModalOpen(true);
    setImageSelected(null);
  };

  // Ouvre le modal d'ajout
  const handleAdd = () => {
    setCurrentSlide({ titre: '', description: '', image: '', datePublication: '', entreprise: userEntreprise || '' });
    setAddModalOpen(true);
    setImageSelected(null);
  };

  // Archivage
  const handleAskArchive = (id) => {
    setArchiveId(id);
    setShowArchiveModal(true);
  };
  const handleArchive = async () => {
    if (!archiveId) return;
    try {
      await axios.patch(`http://localhost:5000/slides/${archiveId}/archive`, {}, { headers: { Authorization: `Bearer ${token}` } });
      setSlides(prev => prev.filter(e => e._id !== archiveId));
      setSnackbar({ open: true, message: "Slide archivée avec succès !", severity: "success" });
    } catch (error) {
      setSnackbar({ open: true, message: "Erreur lors de l'archivage de la slide.", severity: "error" });
    } finally {
      setShowArchiveModal(false);
      setArchiveId(null);
    }
  };

  function truncateText(text, maxLength = 40) {
    if (!text) return '';
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  }

  if (loading) return <span>Loading...</span>;

  const filteredSlides = slides.filter(slide =>
    slide.titre.toLowerCase().includes(search.toLowerCase()) ||
    slide.description.toLowerCase().includes(search.toLowerCase())
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
            onClick={() => setSnackbar(prev => ({ ...prev, open: false }))}
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
            <button
            className="btn rounded-pill btn-outline-primary-600 radius-8 px-20 py-11"
            onClick={handleAdd}
          >
            <i className="ri-add-line" /> Add Slide
            </button>
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
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredSlides.map((slide, index) => (
              <tr key={slide._id}>
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
                  <td>{truncateText(slide.titre)}</td>
                  <td>{truncateText(slide.description)}</td>
                <td>
                  <img
                    src={slide.image || "https://via.placeholder.com/50"}
                    alt={slide.titre}
                    className="flex-shrink-0 me-12 radius-8"
                    style={{ width: "50px", height: "50px", objectFit: "cover" }}
                      onError={e => { e.target.src = "https://via.placeholder.com/50"; }}
                  />
                </td>
                <td>
                    {/* <Link
                    to={`/SlideDetail/${slide._id}`}
                    className="w-32-px h-32-px me-8 bg-primary-light text-primary-600 rounded-circle d-inline-flex align-items-center justify-content-center"
                  >
                    <Icon icon="iconamoon:eye-light" />
                    </Link> */}
                    <button
                      type="button"
                      onClick={() => handleEdit(slide)}
                      className="w-32-px h-32-px me-8 bg-primary-light text-info-pressed rounded-circle d-inline-flex align-items-center justify-content-center"
                    >
                      <Icon icon="lucide:edit"/>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAskArchive(slide._id)}
                      className="w-32-px h-32-px me-8 bg-neutral-300 text-neutral-500 rounded-circle d-inline-flex align-items-center justify-content-center"
                      title="Archiver"
                    >
                      <Icon icon="mdi:archive-outline" />
                    </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
          </div>
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mt-24">
          <span>Showing 1 to {filteredSlides.length} of {filteredSlides.length} entries</span>
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
      {/* Modal Ajout/Edition */}
      {(addModalOpen || editModalOpen) && (
        <>
          <div className="modal-backdrop fade show" style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',zIndex:1000,background:'rgba(0,0,0,0.3)'}}></div>
          <div className="modal fade show" style={{display:'block',zIndex:1100}} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content p-4" style={{ border: 'none', boxShadow: '0 2px 16px rgba(0,0,0,0.12)' }}>
                <div className="modal-header" style={{ border: 'none', boxShadow: 'none' }}>
                  <h6 className="modal-title fw-semibold w-100 text-center" style={{ letterSpacing: '0.5px' }}>
                    {addModalOpen ? 'Ajouter une Slide' : 'Modifier la Slide'}
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
                      value={currentSlide.titre}
                      onChange={e => setCurrentSlide(prev => ({ ...prev, titre: e.target.value }))}
                      placeholder="Titre de la slide"
              />
            </div>
                  {/* Description */}
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      value={currentSlide.description}
                      onChange={e => setCurrentSlide(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Description de la slide"
                      rows={4}
                      style={{ minHeight: 80 }}
              />
            </div>
                  {/* Image */}
                  <div className="mb-3">
                    <label className="form-label">Image</label>
                    <input type="file" accept="image/*" onChange={handleFileChange} className="form-control" />
                    <button onClick={uploadImage} className="btn btn-sm btn-primary-600">Uploader l'image</button>
                    {currentSlide.image && (
                      <img src={currentSlide.image} alt="Aperçu" className="mt-2" style={{ width: 'auto', maxWidth: '50%', maxHeight: '50%', objectFit: 'cover', borderRadius: '6px' }} onError={e => { e.target.src = 'https://via.placeholder.com/150'; }} />
              )}
            </div>
                </div>
                <div className="modal-footer" style={{ border: 'none', boxShadow: 'none' }}>
                  <button type="button" className="btn btn-secondary-600" onClick={() => { setAddModalOpen(false); setEditModalOpen(false); }}>Annuler</button>
                  <button type="button" className="btn btn-sm btn-primary-600" onClick={handleSave}>{addModalOpen ? 'Create' : 'Update'}</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {/* Modal de confirmation d'archivage */}
      {showArchiveModal && (
        <>
          <div className="modal-backdrop fade show" style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',zIndex:1000,background:'rgba(0,0,0,0.3)'}}></div>
          <div className="modal fade show" style={{display:'block',zIndex:1100}} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content" style={{ border: 'none', boxShadow: '0 2px 16px rgba(0,0,0,0.12)' }}>
                <div className="modal-header" style={{ border: 'none', boxShadow: 'none' }}>
                  <h6 className="modal-title fw-semibold">Archivage de la slide</h6>
                  <button type="button" className="btn-close" onClick={() => setShowArchiveModal(false)}></button>
                </div>
                <div className="modal-body" style={{ border: 'none', boxShadow: 'none' }}>
                  Êtes-vous sûr de vouloir archiver cette slide ?
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

export default SlidesList;