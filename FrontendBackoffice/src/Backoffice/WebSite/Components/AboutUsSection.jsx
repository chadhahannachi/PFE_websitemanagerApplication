import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Icon } from '@iconify/react';
import { Editor } from "react-draft-wysiwyg";
import { EditorState, ContentState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./AboutUsSection.css"; // Ajout du fichier CSS personnalisé

const cleanHTML = (html) => {
  // Nettoyage simple du HTML (peut être enrichi selon besoin)
  if (!html) return '';
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.innerHTML.trim();
};

const AboutUsSection = () => {
  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userEntreprise, setUserEntreprise] = useState(null);
  const [userId, setUserId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [imageSelected, setImageSelected] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [currentAbout, setCurrentAbout] = useState({
    _id: null,
    titre: '',
    description: '',
    image: '',
    entreprise: '',
    isArchived: false,
  });
  const [editorTitre, setEditorTitre] = useState(() => EditorState.createEmpty());
  const [editorDescription, setEditorDescription] = useState(() => EditorState.createEmpty());

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserId(decodedToken.sub);
      } catch (error) {
        setSnackbar({ open: true, message: "Erreur lors du décodage du token.", severity: "error" });
        setLoading(false);
      }
    } else {
      setSnackbar({ open: true, message: "Token manquant. Veuillez vous connecter.", severity: "error" });
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    const fetchUserEntreprise = async () => {
      if (!token || !userId) return;
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const userResponse = await axios.get(`http://localhost:5000/auth/user/${userId}`, config);
        setUserEntreprise(userResponse.data.entreprise);
        setCurrentAbout(prev => ({ ...prev, entreprise: userResponse.data.entreprise }));
      } catch (error) {
        setSnackbar({ open: true, message: "Erreur lors de la récupération des données utilisateur.", severity: "error" });
        setLoading(false);
      }
    };
    if (userId) fetchUserEntreprise();
  }, [userId, token]);

  useEffect(() => {
    const fetchAbout = async () => {
      if (!token || !userEntreprise) return;
      setLoading(true);
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(`http://localhost:5000/contenus/APropos/entreprise/${userEntreprise}`, config);
        if (Array.isArray(response.data) && response.data.length > 0) {
          // On ne prend que la non archivée
          const notArchived = response.data.find(item => !item.isArchived);
          setAbout(notArchived || null);
        } else {
          setAbout(null);
        }
      } catch (error) {
        setSnackbar({ open: true, message: "Erreur lors de la récupération de la section À Propos.", severity: "error" });
      } finally {
        setLoading(false);
      }
    };
    if (userEntreprise) fetchAbout();
  }, [userEntreprise, token, modalOpen]);

  useEffect(() => {
    if (modalOpen) {
      if (currentAbout.titre) {
        const cleanTitre = cleanHTML(currentAbout.titre);
        const contentBlock = htmlToDraft(cleanTitre);
        if (contentBlock) {
          const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
          setEditorTitre(EditorState.createWithContent(contentState));
        } else {
          setEditorTitre(EditorState.createEmpty());
        }
      }
      if (currentAbout.description) {
        const cleanDesc = cleanHTML(currentAbout.description);
        const contentBlock = htmlToDraft(cleanDesc);
        if (contentBlock) {
          const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
          setEditorDescription(EditorState.createWithContent(contentState));
        } else {
          setEditorDescription(EditorState.createEmpty());
        }
      }
    }
  }, [modalOpen, currentAbout]);

  useEffect(() => {
    if (snackbar.open) {
      const timer = setTimeout(() => setSnackbar(prev => ({ ...prev, open: false })), 3000);
      return () => clearTimeout(timer);
    }
  }, [snackbar.open]);

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
      setCurrentAbout(prev => ({ ...prev, image: response.data.secure_url }));
      setSnackbar({ open: true, message: "Image uploadée avec succès !", severity: "success" });
    } catch (error) {
      setSnackbar({ open: true, message: "Erreur lors de l'upload de l'image. Veuillez réessayer.", severity: "error" });
    }
  };

  const handleSave = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const htmlTitre = draftToHtml(convertToRaw(editorTitre.getCurrentContent()));
      const htmlDescription = draftToHtml(convertToRaw(editorDescription.getCurrentContent()));
      const dataToSave = { ...currentAbout, titre: htmlTitre, description: htmlDescription };

      // On retire datePublication du payload si présent
      delete dataToSave.datePublication;

      if (currentAbout._id) {
        await axios.patch(`http://localhost:5000/contenus/APropos/${currentAbout._id}`, dataToSave, config);
        setSnackbar({ open: true, message: "Section À Propos modifiée avec succès !", severity: "success" });
      } else {
        if (!currentAbout.entreprise) throw new Error("L'entreprise de la section À Propos n'est pas définie.");
        await axios.post(`http://localhost:5000/contenus/APropos`, dataToSave, config);
        setSnackbar({ open: true, message: "Section À Propos créée avec succès !", severity: "success" });
      }
      setModalOpen(false);
      setImageSelected(null);
    } catch (error) {
      setSnackbar({ open: true, message: error.message || "Erreur lors de la sauvegarde de la section À Propos.", severity: "error" });
    }
  };

  const handleArchive = async () => {
    if (!about || !about._id) return;
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.patch(`http://localhost:5000/contenus/APropos/${about._id}/archive`, {}, config);
      setSnackbar({ open: true, message: "Section À Propos archivée avec succès !", severity: "success" });
      setAbout(null);
    } catch (error) {
      setSnackbar({ open: true, message: "Erreur lors de l'archivage.", severity: "error" });
    }
  };


  if (loading) return <span>Chargement...</span>;

  return (
    <div className="card">
      {snackbar.open && (
        <div className={`alert bg-${snackbar.severity === 'success' ? 'success-100' : 'danger-100'} text-${snackbar.severity === 'success' ? 'success-600' : 'danger-600'} border-${snackbar.severity === 'success' ? 'success-600' : 'danger-600'} border-start-width-4-px px-24 py-13`} style={{ position: 'fixed', top: 24, right: 24, zIndex: 2000 }}>
          {snackbar.message}
        </div>
      )}
      <div className="card-header d-flex flex-wrap align-items-center justify-content-between gap-3">
        <h5 className="card-title mb-0">Section À Propos</h5>
        <div className="d-flex gap-2">
          {about && !about.isArchived && (
            <button className="btn rounded-pill btn-neutral-900 text-base radius-8 px-20 py-11"            
            onClick={handleArchive}>Archiver</button>
          )}
          <button className="btn rounded-pill btn-outline-primary-600 radius-8 px-20 py-11"
 onClick={() => {
            if (about) {
              setCurrentAbout({ ...about, datePublication: undefined });
            } else {
              setCurrentAbout({
                _id: null,
                titre: '',
                description: '',
                image: '',
                entreprise: userEntreprise || '',
                isArchived: false,
              });
            }
            setModalOpen(true);
          }}>{about ? 'Modifier' : 'Ajouter'}</button>
        </div>
      </div>
      <div className="card-body">
        {about ? (
          <div className="row align-items-center">
            <div className="col-md-4 text-center">
              <img src={about.image || 'https://via.placeholder.com/150'} alt={about.titre} style={{ maxWidth: 200, maxHeight: 200 }} />
            </div>
            <div className="col-md-8">
              <div className="rendered-html" dangerouslySetInnerHTML={{ __html: about.titre }} />
              <div className="rendered-html" dangerouslySetInnerHTML={{ __html: about.description }} />
            </div>
          </div>
        ) : (
          <div className="alert alert-info text-center">Aucune section À Propos trouvée.</div>
        )}
      </div>
      {modalOpen && (
        <div className="modal fade show" style={{ display: 'block', zIndex: 1100 }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content p-4">
              <div className="modal-header">
                <h6 className="modal-title fw-semibold w-100 text-center">{about ? 'Modifier la section' : 'Ajouter une section'} À Propos</h6>
                <button type="button" className="btn-close" onClick={() => setModalOpen(false)}></button>
              </div>
              <div className="modal-body" style={{ overflowY: 'auto', maxHeight: '70vh' }}>
                <div className="mb-3">
                  <label className="form-label">Titre</label>
                  <Editor editorState={editorTitre} onEditorStateChange={setEditorTitre} wrapperClassName="demo-wrapper" editorClassName="demo-editor" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <Editor editorState={editorDescription} onEditorStateChange={setEditorDescription} wrapperClassName="demo-wrapper" editorClassName="demo-editor" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Image</label>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="form-control" />
                  <button onClick={uploadImage} className="btn btn-primary btn-sm mt-2">Uploader</button>
                  {currentAbout.image && <img src={currentAbout.image} alt="Aperçu" className="mt-2" style={{ maxWidth: '50%' }} />}
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary-600" onClick={() => setModalOpen(false)}>Annuler</button>
                <button type="button" className="btn btn-sm btn-primary-600" onClick={handleSave}>{about ? 'Modifier' : 'Créer'}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutUsSection;

