// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { jwtDecode } from "jwt-decode";
// import { EditorState, convertToRaw, ContentState } from "draft-js";
// import draftToHtml from "draftjs-to-html";
// import htmlToDraft from "html-to-draftjs";
// import { Editor } from "react-draft-wysiwyg";
// import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
// import { Formik, FieldArray } from 'formik';
// import * as yup from 'yup';
// import { Icon } from '@iconify/react/dist/iconify.js';

// const FIELD_TYPES = [
//   { value: 'text', label: 'Texte' },
//   { value: 'number', label: 'Nombre' },
//   { value: 'date', label: 'Date' },
//   { value: 'email', label: 'Email' },
//   { value: 'textarea', label: 'Zone de texte' },
// ];

// const ContactUsSection = () => {
//   const [contact, setContact] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [userEntreprise, setUserEntreprise] = useState(null);
//   const [userId, setUserId] = useState(null);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [imageSelected, setImageSelected] = useState(null);
//   const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
//   const [currentContact, setCurrentContact] = useState({
//     _id: null,
//     titre: '',
//     description: '',
//     adresse: '',
//     phone: '',
//     email: '',
//     links: {},
//     entreprise: '',
//     isArchived: false,
//   });
//   const [editorTitre, setEditorTitre] = useState(EditorState.createEmpty());
//   const [editorDescription, setEditorDescription] = useState(EditorState.createEmpty());
//   const [currentLinkKey, setCurrentLinkKey] = useState('');
//   const [currentLinkValue, setCurrentLinkValue] = useState('');

//   // Formulaire dynamique (par entreprise)
//   const [formulaire, setFormulaire] = useState(null);
//   const [formResponses, setFormResponses] = useState([]);
//   const [showFormCreation, setShowFormCreation] = useState(false);
//   const [formLoading, setFormLoading] = useState(false);
//   const [formSnackbar, setFormSnackbar] = useState({ open: false, message: '', severity: 'success' });
//   const [selectedForm, setSelectedForm] = useState(null); // for future multi-form support

//   // Validation schema for form creation
//   const formSchema = yup.object().shape({
//     titre: yup.string().required('Titre requis'),
//     champs: yup.array().of(
//       yup.object().shape({
//         nom: yup.string().required('Nom requis'),
//         type: yup.string().required('Type requis'),
//       })
//     ).min(1, 'Ajouter au moins un champ'),
//   });
//   // Validation for filling a form (dynamic)
//   const getResponseSchema = (fields) => {
//     const shape = {};
//     fields.forEach(f => {
//       if (f.type === 'number') shape[f.nom] = yup.number().typeError('Doit être un nombre').required('Requis');
//       else if (f.type === 'email') shape[f.nom] = yup.string().email('Email invalide').required('Requis');
//       else shape[f.nom] = yup.string().required('Requis');
//     });
//     return yup.object().shape(shape);
//   };

//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     if (token) {
//       try {
//         const decodedToken = jwtDecode(token);
//         setUserId(decodedToken.sub);
//       } catch (error) {
//         setSnackbar({ open: true, message: "Erreur lors du décodage du token.", severity: "error" });
//         setLoading(false);
//       }
//     } else {
//       setSnackbar({ open: true, message: "Token manquant. Veuillez vous connecter.", severity: "error" });
//       setLoading(false);
//     }
//   }, [token]);

//   useEffect(() => {
//     const fetchUserEntreprise = async () => {
//       if (!token || !userId) return;
//       try {
//         const config = { headers: { Authorization: `Bearer ${token}` } };
//         const userResponse = await axios.get(`http://localhost:5000/auth/user/${userId}`, config);
//         setUserEntreprise(userResponse.data.entreprise);
//         setCurrentContact(prev => ({ ...prev, entreprise: userResponse.data.entreprise }));
//       } catch (error) {
//         setSnackbar({ open: true, message: "Erreur lors de la récupération des données utilisateur.", severity: "error" });
//         setLoading(false);
//       }
//     };
//     if (userId) fetchUserEntreprise();
//   }, [userId, token]);

//   useEffect(() => {
//     const fetchContact = async () => {
//       if (!token || !userEntreprise) return;
//       setLoading(true);
//       try {
//         const config = { headers: { Authorization: `Bearer ${token}` } };
//         const response = await axios.get(`http://localhost:5000/contenus/ContactUs/entreprise/${userEntreprise}`, config);
//         if (Array.isArray(response.data) && response.data.length > 0) {
//           // On ne prend que la non archivée
//           const notArchived = response.data.find(item => !item.isArchived);
//           setContact(notArchived || null);
//         } else {
//           setContact(null);
//         }
//       } catch (error) {
//         setSnackbar({ open: true, message: "Erreur lors de la récupération de la section Contact.", severity: "error" });
//       } finally {
//         setLoading(false);
//       }
//     };
//     if (userEntreprise) fetchContact();
//   }, [userEntreprise, token, modalOpen]);

//   useEffect(() => {
//     if (modalOpen) {
//       if (currentContact.titre) {
//         const contentBlock = htmlToDraft(currentContact.titre || '');
//         if (contentBlock) {
//           const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
//           setEditorTitre(EditorState.createWithContent(contentState));
//         } else {
//           setEditorTitre(EditorState.createEmpty());
//         }
//       } else {
//         setEditorTitre(EditorState.createEmpty());
//       }
//       if (currentContact.description) {
//         const contentBlock = htmlToDraft(currentContact.description || '');
//         if (contentBlock) {
//           const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
//           setEditorDescription(EditorState.createWithContent(contentState));
//         } else {
//           setEditorDescription(EditorState.createEmpty());
//         }
//       } else {
//         setEditorDescription(EditorState.createEmpty());
//       }
//     }
//   }, [modalOpen, currentContact.titre, currentContact.description]);

//   useEffect(() => {
//     if (snackbar.open) {
//       const timer = setTimeout(() => setSnackbar(prev => ({ ...prev, open: false })), 3000);
//       return () => clearTimeout(timer);
//     }
//   }, [snackbar.open]);

//   // Fetch the entreprise's form on mount or when userEntreprise changes
//   useEffect(() => {
//     if (!userEntreprise) return;
//     const fetchForm = async () => {
//       setFormLoading(true);
//       try {
//         const res = await axios.get(`http://localhost:5000/formulaires/entreprise/${userEntreprise}/formulaires`);
//         if (Array.isArray(res.data) && res.data.length > 0) {
//           setFormulaire(res.data[0]);
//           setSelectedForm(res.data[0]);
//         } else {
//           setFormulaire(null);
//           setSelectedForm(null);
//         }
//       } catch (err) {
//         setFormSnackbar({ open: true, message: "Erreur lors de la récupération du formulaire", severity: 'error' });
//         setFormulaire(null);
//         setSelectedForm(null);
//       } finally {
//         setFormLoading(false);
//       }
//     };
//     fetchForm();
//   }, [userEntreprise, showFormCreation]);

//   // Fetch responses for the form
//   useEffect(() => {
//     if (!formulaire) return;
//     const fetchResponses = async () => {
//       setFormLoading(true);
//       try {
//         const res = await axios.get(`http://localhost:5000/formulaires/reponse/formulaire/${formulaire._id}`);
//         setFormResponses(res.data);
//       } catch (err) {
//         setFormSnackbar({ open: true, message: "Erreur lors de la récupération des réponses", severity: 'error' });
//       } finally {
//         setFormLoading(false);
//       }
//     };
//     fetchResponses();
//   }, [formulaire]);

//   // Handler for creating a form
//   const handleCreateForm = async (values, { resetForm }) => {
//     try {
//       const champs = {};
//       values.champs.forEach(f => { champs[f.nom] = f.type; });
//       await axios.post('http://localhost:5000/formulaires', {
//         titre: values.titre,
//         champs,
//         entreprise: userEntreprise,
//       });
//       setFormSnackbar({ open: true, message: 'Formulaire créé !', severity: 'success' });
//       setShowFormCreation(false);
//       resetForm();
//       // The useEffect will refetch the form
//     } catch (err) {
//       setFormSnackbar({ open: true, message: "Erreur lors de la création du formulaire", severity: 'error' });
//     }
//   };

//   // Handler for submitting a response
//   const handleSubmitResponse = async (values, { resetForm }) => {
//     try {
//       await axios.post('http://localhost:5000/formulaires/reponse', {
//         values,
//         formulaire: formulaire._id,
//       });
//       setFormSnackbar({ open: true, message: 'Réponse enregistrée !', severity: 'success' });
//       resetForm();
//       // Refresh responses
//       const res = await axios.get(`http://localhost:5000/formulaires/reponse/formulaire/${formulaire._id}`);
//       setFormResponses(res.data);
//     } catch (err) {
//       setFormSnackbar({ open: true, message: "Erreur lors de l'envoi de la réponse", severity: 'error' });
//     }
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     setImageSelected(file);
//   };

//   const uploadImage = async () => {
//     if (!imageSelected) {
//       setSnackbar({ open: true, message: "Veuillez sélectionner une image avant d'uploader.", severity: "warning" });
//       return;
//     }
//     const formData = new FormData();
//     formData.append("file", imageSelected);
//     formData.append("upload_preset", "chadha");
//     try {
//       const response = await axios.post("https://api.cloudinary.com/v1_1/duvcpe6mx/image/upload", formData);
//       setCurrentContact(prev => ({ ...prev, image: response.data.secure_url }));
//       setSnackbar({ open: true, message: "Image uploadée avec succès !", severity: "success" });
//     } catch (error) {
//       setSnackbar({ open: true, message: "Erreur lors de l'upload de l'image. Veuillez réessayer.", severity: "error" });
//     }
//   };

//   const handleSave = async () => {
//     try {
//       const config = { headers: { Authorization: `Bearer ${token}` } };
//       const htmlTitre = draftToHtml(convertToRaw(editorTitre.getCurrentContent()));
//       const htmlDescription = draftToHtml(convertToRaw(editorDescription.getCurrentContent()));
//       const dataToSave = { ...currentContact, titre: htmlTitre, description: htmlDescription };
//       // On retire les champs inutiles
//       delete dataToSave.datePublication;
//       delete dataToSave.isPublished;
//       delete dataToSave.image;
//       if (currentContact._id) {
//         await axios.patch(`http://localhost:5000/contenus/ContactUs/${currentContact._id}`, dataToSave, config);
//         setSnackbar({ open: true, message: "Section Contact modifiée avec succès !", severity: "success" });
//       } else {
//         if (!currentContact.entreprise) throw new Error("L'entreprise de la section Contact n'est pas définie.");
//         await axios.post(`http://localhost:5000/contenus/ContactUs`, dataToSave, config);
//         setSnackbar({ open: true, message: "Section Contact créée avec succès !", severity: "success" });
//       }
//       setModalOpen(false);
//       setImageSelected(null);
//     } catch (error) {
//       setSnackbar({ open: true, message: error.message || "Erreur lors de la sauvegarde de la section Contact.", severity: "error" });
//     }
//   };

//   const handleArchive = async () => {
//     if (!contact || !contact._id) return;
//     try {
//       const config = { headers: { Authorization: `Bearer ${token}` } };
//       await axios.patch(`http://localhost:5000/contenus/ContactUs/${contact._id}/archive`, {}, config);
//       setSnackbar({ open: true, message: "Section Contact archivée avec succès !", severity: "success" });
//       setContact(null);
//     } catch (error) {
//       setSnackbar({ open: true, message: "Erreur lors de l'archivage.", severity: "error" });
//     }
//   };

//   if (loading) return <span>Chargement...</span>;

//   return (
//     <div className="card">
//       {snackbar.open && (
//         <div className={`alert bg-${snackbar.severity === 'success' ? 'success-100' : 'danger-100'} text-${snackbar.severity === 'success' ? 'success-600' : 'danger-600'} border-${snackbar.severity === 'success' ? 'success-600' : 'danger-600'} border-start-width-4-px px-24 py-13`} style={{ position: 'fixed', top: 24, right: 24, zIndex: 2000 }}>
//           {snackbar.message}
//         </div>
//       )}
//       <div className="card-header d-flex flex-wrap align-items-center justify-content-between gap-3">
//         <h5 className="card-title mb-0">Section Contact</h5>
//         <div className="d-flex gap-2">
//           {contact && !contact.isArchived && (
//             <button className="btn rounded-pill btn-neutral-900 text-base radius-8 px-20 py-11" onClick={handleArchive}>Archiver</button>
//           )}
//           <button className="btn rounded-pill btn-outline-primary-600 radius-8 px-20 py-11" onClick={() => {
//             if (contact) {
//               const { isPublished, image, ...rest } = contact;
//               setCurrentContact({ ...rest });
//             } else {
//               setCurrentContact({
//                 _id: null,
//                 titre: '',
//                 description: '',
//                 adresse: '',
//                 phone: '',
//                 email: '',
//                 links: {},
//                 entreprise: userEntreprise || '',
//                 isArchived: false,
//               });
//             }
//             setModalOpen(true);
//           }}>{contact ? 'Modifier' : 'Ajouter'}</button>
//         </div>
//       </div>
//       <div className="card-body">
//         {contact ? (
//           <div className="row align-items-center">
            
//             <div className="col-md-12">
//               <div className="rendered-html" dangerouslySetInnerHTML={{ __html: contact.titre }} />
//               <div className="rendered-html" dangerouslySetInnerHTML={{ __html: contact.description }} />
//               <div><b>Adresse :</b> {contact.adresse}</div>
//               <div><b>Téléphone :</b> {contact.phone}</div>
//               <div><b>Email :</b> {contact.email}</div>
//               {contact.links && Object.keys(contact.links).length > 0 && (
//                 <div><b>Liens :</b>
//                   <ul style={{ marginBottom: 0 }}>
//                     {Object.entries(contact.links).map(([key, value]) => (
//                       <li key={key}>{key}: {value}</li>
//                     ))}
//                   </ul>
//                 </div>
//               )}
//               {/* <div><b>Publié :</b> {contact.isPublished ? 'Oui' : 'Non'}</div> */}
//             </div>
//           </div>
//         ) : (
//           <div className="alert alert-info text-center">Aucune section Contact trouvée.</div>
//         )}
//       </div>
//       {/* --- FORMULAIRE DYNAMIQUE ENTREPRISE --- */}
//       <div className="mt-5">
//         <div className="card">
//           <div className="card-header">
//             <h5 className="card-title mb-0">
//               <Icon icon="mdi:form-select" className="me-2" />
//               Formulaire de contact
//             </h5>
//           </div>
//           <div className="card-body">
//             {formLoading ? (
//               <div>Chargement du formulaire...</div>
//             ) : formulaire ? (
//               <div>
//                 <h6 className="mb-3">{formulaire.titre}</h6>
//                 <Formik
//                   initialValues={Object.keys(formulaire.champs).reduce((acc, key) => ({ ...acc, [key]: '' }), {})}
//                   validationSchema={getResponseSchema(Object.entries(formulaire.champs).map(([nom, type]) => ({ nom, type })))}
//                   onSubmit={handleSubmitResponse}
//                   enableReinitialize
//                 >
//                   {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
//                     <form onSubmit={handleSubmit}>
//                       {Object.entries(formulaire.champs).map(([nom, type], idx) => (
//                         <div className="mb-3" key={idx}>
//                           <label className="form-label">{nom}</label>
//                           {type === 'textarea' ? (
//                             <textarea
//                               name={nom}
//                               className="form-control"
//                               value={values[nom]}
//                               onChange={handleChange}
//                               onBlur={handleBlur}
//                               required
//                             />
//                           ) : (
//                             <input
//                               type={type}
//                               name={nom}
//                               className="form-control"
//                               value={values[nom]}
//                               onChange={handleChange}
//                               onBlur={handleBlur}
//                               required
//                             />
//                           )}
//                           {touched[nom] && errors[nom] && <div className="text-danger small">{errors[nom]}</div>}
//                         </div>
//                       ))}
//                       <button type="submit" className="btn btn-primary mt-2">
//                         <Icon icon="mdi:send-outline" className="me-1" /> Envoyer
//                       </button>
//                     </form>
//                   )}
//                 </Formik>
//               </div>
//             ) : (
//               <div className="text-center">
//                 <button className="btn btn-outline-primary" onClick={() => setShowFormCreation(true)}>
//                   <Icon icon="solar:add-circle-outline" className="me-1" /> Créer un formulaire pour cette entreprise
//                 </button>
//               </div>
//             )}
//             {/* Création du formulaire si demandé */}
//             {showFormCreation && (
//               <div className="mt-4">
//                 <h6 className="mb-3">Créer un formulaire pour cette entreprise</h6>
//                 <Formik
//                   initialValues={{ titre: '', champs: [{ nom: '', type: 'text' }] }}
//                   validationSchema={formSchema}
//                   onSubmit={handleCreateForm}
//                 >
//                   {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
//                     <form onSubmit={handleSubmit}>
//                       <div className="mb-3">
//                         <label className="form-label">Titre du formulaire</label>
//                         <input
//                           type="text"
//                           name="titre"
//                           className="form-control"
//                           value={values.titre}
//                           onChange={handleChange}
//                           onBlur={handleBlur}
//                           required
//                         />
//                         {touched.titre && errors.titre && <div className="text-danger small">{errors.titre}</div>}
//                       </div>
//                       <FieldArray name="champs">
//                         {({ push, remove }) => (
//                           <div>
//                             <label className="form-label">Champs</label>
//                             {values.champs.map((champ, idx) => (
//                               <div className="row mb-2" key={idx}>
//                                 <div className="col-md-5">
//                                   <input
//                                     type="text"
//                                     name={`champs[${idx}].nom`}
//                                     className="form-control"
//                                     placeholder="Nom du champ"
//                                     value={champ.nom}
//                                     onChange={handleChange}
//                                     onBlur={handleBlur}
//                                     required
//                                   />
//                                   {touched.champs && touched.champs[idx] && errors.champs && errors.champs[idx] && errors.champs[idx].nom && (
//                                     <div className="text-danger small">{errors.champs[idx].nom}</div>
//                                   )}
//                                 </div>
//                                 <div className="col-md-5">
//                                   <select
//                                     name={`champs[${idx}].type`}
//                                     className="form-select"
//                                     value={champ.type}
//                                     onChange={handleChange}
//                                     onBlur={handleBlur}
//                                     required
//                                   >
//                                     {FIELD_TYPES.map(ft => (
//                                       <option key={ft.value} value={ft.value}>{ft.label}</option>
//                                     ))}
//                                   </select>
//                                   {touched.champs && touched.champs[idx] && errors.champs && errors.champs[idx] && errors.champs[idx].type && (
//                                     <div className="text-danger small">{errors.champs[idx].type}</div>
//                                   )}
//                                 </div>
//                                 <div className="col-md-2 d-flex align-items-center">
//                                   {values.champs.length > 1 && (
//                                     <button type="button" className="btn btn-link text-danger" onClick={() => remove(idx)}>
//                                       <Icon icon="mdi:delete-outline" />
//                                     </button>
//                                   )}
//                                 </div>
//                               </div>
//                             ))}
//                             <button type="button" className="btn btn-outline-primary btn-sm mt-2" onClick={() => push({ nom: '', type: 'text' })}>
//                               <Icon icon="solar:add-circle-outline" className="me-1" /> Ajouter un champ
//                             </button>
//                           </div>
//                         )}
//                       </FieldArray>
//                       <button type="submit" className="btn btn-success mt-3">
//                         <Icon icon="mdi:content-save-outline" className="me-1" /> Enregistrer
//                       </button>
//                     </form>
//                   )}
//                 </Formik>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* --- TABLEAU DES RÉPONSES --- */}
//       {formulaire && (
//         <div className="mt-4">
//           <div className="card">
//             <div className="card-header">
//               <h5 className="card-title mb-0">
//                 <Icon icon="mdi:clipboard-text-outline" className="me-2" />
//                 Réponses au formulaire
//               </h5>
//             </div>
//             <div className="card-body">
//               {formResponses.length === 0 ? (
//                 <div className="text-muted text-center">Aucune réponse pour ce formulaire.</div>
//               ) : (
//                 <div className="table-responsive">
//                   <table className="table vertical-striped-table mb-0">
//                     <thead>
//                       <tr>
//                         <th scope="col">#</th>
//                         {Object.keys(formulaire.champs).map((champ, idx) => (
//                           <th key={idx} scope="col">{champ}</th>
//                         ))}
//                         <th scope="col">Date de soumission</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {formResponses.map((resp, idx) => (
//                         <tr key={idx}>
//                           <td>{idx + 1}</td>
//                           {Object.keys(formulaire.champs).map((champ, j) => (
//                             <td key={j}>
//                               {typeof resp.values[champ] === 'string' && resp.values[champ].length > 50 
//                                 ? `${resp.values[champ].substring(0, 50)}...` 
//                                 : resp.values[champ] || '-'}
//                             </td>
//                           ))}
//                           <td>
//                             {resp.createdAt ? 
//                               new Date(resp.createdAt).toLocaleDateString('fr-FR', {
//                                 year: 'numeric',
//                                 month: 'long',
//                                 day: 'numeric',
//                                 hour: '2-digit',
//                                 minute: '2-digit'
//                               }) : 
//                               '-'
//                             }
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//       {/* --- FIN FORMULAIRE DYNAMIQUE ENTREPRISE --- */}
//       {modalOpen && (
//         <div className="modal fade show" style={{ display: 'block', zIndex: 1100 }}>
//           <div className="modal-dialog modal-lg">
//             <div className="modal-content p-4">
//               <div className="modal-header">
//                 <h6 className="modal-title fw-semibold w-100 text-center">{contact ? 'Modifier la section' : 'Ajouter une section'} Contact</h6>
//                 <button type="button" className="btn-close" onClick={() => setModalOpen(false)}></button>
//               </div>
//               <div className="modal-body" style={{ overflowY: 'auto', maxHeight: '70vh' }}>
//                 <div className="mb-3">
//                   <label className="form-label">Titre</label>
//                   <Editor editorState={editorTitre} onEditorStateChange={setEditorTitre} wrapperClassName="demo-wrapper" editorClassName="demo-editor" />
//                 </div>
//                 <div className="mb-3">
//                   <label className="form-label">Description</label>
//                   <Editor editorState={editorDescription} onEditorStateChange={setEditorDescription} wrapperClassName="demo-wrapper" editorClassName="demo-editor" />
//                 </div>
//                 <div className="mb-3">
//                   <label className="form-label">Adresse</label>
//                   <input type="text" className="form-control" value={currentContact.adresse} onChange={e => setCurrentContact(prev => ({ ...prev, adresse: e.target.value }))} placeholder="Adresse" />
//                 </div>
//                 <div className="mb-3">
//                   <label className="form-label">Téléphone</label>
//                   <input type="text" className="form-control" value={currentContact.phone} onChange={e => setCurrentContact(prev => ({ ...prev, phone: e.target.value }))} placeholder="Téléphone" />
//                 </div>
//                 <div className="mb-3">
//                   <label className="form-label">Email</label>
//                   <input type="email" className="form-control" value={currentContact.email} onChange={e => setCurrentContact(prev => ({ ...prev, email: e.target.value }))} placeholder="Email" />
//                 </div>
//                 <div className="mb-3">
//                   <label className="form-label">Liens</label>
//                   <div className="d-flex gap-2 mb-2">
//                     <input type="text" className="form-control" placeholder="Nom du lien (ex: Facebook)" value={currentLinkKey} onChange={e => setCurrentLinkKey(e.target.value)} />
//                     <input type="text" className="form-control" placeholder="URL du lien" value={currentLinkValue} onChange={e => setCurrentLinkValue(e.target.value)} />
//                     <button className="btn btn-primary btn-sm" type="button" onClick={() => {
//                       if (currentLinkKey && currentLinkValue) {
//                         setCurrentContact(prev => ({
//                           ...prev,
//                           links: {
//                             ...prev.links,
//                             [currentLinkKey]: currentLinkValue,
//                           },
//                         }));
//                         setCurrentLinkKey('');
//                         setCurrentLinkValue('');
//                       }
//                     }}>Ajouter</button>
//                   </div>
//                   {currentContact.links && Object.entries(currentContact.links).map(([key, value]) => (
//                     <div key={key} className="d-flex align-items-center justify-content-between mb-1">
//                       <span>{key}: {value}</span>
//                       <button className="btn btn-danger btn-sm" type="button" onClick={() => {
//                         const newLinks = { ...currentContact.links };
//                         delete newLinks[key];
//                         setCurrentContact(prev => ({ ...prev, links: newLinks }));
//                       }}>Supprimer</button>
//                     </div>
//                   ))}
//                 </div>
//                 {/* <div className="mb-3">
//                 <label className="form-label">Image</label>
//                 <input type="file" accept="image/*" onChange={handleFileChange} className="form-control" />
//                 <button onClick={uploadImage} className="btn btn-primary btn-sm mt-2">Uploader</button>
//                 {currentContact.image && <img src={currentContact.image} alt="Aperçu" className="mt-2" style={{ maxWidth: '50%' }} />}
//               </div> */}
//                 {/* <div className="mb-3 form-check">
//                 <input type="checkbox" className="form-check-input" id="isPublishedCheck" checked={currentContact.isPublished} onChange={e => setCurrentContact(prev => ({ ...prev, isPublished: e.target.checked }))} />
//                 <label className="form-check-label" htmlFor="isPublishedCheck">Publié</label>
//               </div> */}
//               </div>
//               <div className="modal-footer">
//                 <button type="button" className="btn btn-secondary-600" onClick={() => setModalOpen(false)}>Annuler</button>
//                 <button type="button" className="btn btn-sm btn-primary-600" onClick={handleSave}>{contact ? 'Modifier' : 'Créer'}</button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ContactUsSection;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { Formik, FieldArray } from 'formik';
import * as yup from 'yup';
import { Icon } from '@iconify/react/dist/iconify.js';

const FIELD_TYPES = [
  { value: 'text', label: 'Texte' },
  { value: 'number', label: 'number' },
  { value: 'date', label: 'Date' },
  { value: 'email', label: 'Email' },
  { value: 'textarea', label: 'Zone de texte' },
];

const ContactUsSection = () => {
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userEntreprise, setUserEntreprise] = useState(null);
  const [userId, setUserId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [imageSelected, setImageSelected] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [currentContact, setCurrentContact] = useState({
    _id: null,
    titre: '',
    description: '',
    adresse: '',
    phone: '',
    email: '',
    links: {},
    entreprise: '',
    isArchived: false,
  });
  const [editorTitre, setEditorTitre] = useState(EditorState.createEmpty());
  const [editorDescription, setEditorDescription] = useState(EditorState.createEmpty());
  const [currentLinkKey, setCurrentLinkKey] = useState('');
  const [currentLinkValue, setCurrentLinkValue] = useState('');

  // Formulaire dynamique (par entreprise)
  const [formulaire, setFormulaire] = useState(null);
  const [formResponses, setFormResponses] = useState([]);
  const [showFormCreation, setShowFormCreation] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formSnackbar, setFormSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [selectedForm, setSelectedForm] = useState(null); // for future multi-form support

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
        setCurrentContact(prev => ({ ...prev, entreprise: userResponse.data.entreprise }));
      } catch (error) {
        setSnackbar({ open: true, message: "Erreur lors de la récupération des données utilisateur.", severity: "error" });
        setLoading(false);
      }
    };
    if (userId) fetchUserEntreprise();
  }, [userId, token]);

  useEffect(() => {
    const fetchContact = async () => {
      if (!token || !userEntreprise) return;
      setLoading(true);
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(`http://localhost:5000/contenus/ContactUs/entreprise/${userEntreprise}`, config);
        if (Array.isArray(response.data) && response.data.length > 0) {
          // On ne prend que la non archivée
          const notArchived = response.data.find(item => !item.isArchived);
          setContact(notArchived || null);
        } else {
          setContact(null);
        }
      } catch (error) {
        setSnackbar({ open: true, message: "Erreur lors de la récupération de la section Contact.", severity: "error" });
      } finally {
        setLoading(false);
      }
    };
    if (userEntreprise) fetchContact();
  }, [userEntreprise, token, modalOpen]);

  useEffect(() => {
    if (modalOpen) {
      if (currentContact.titre) {
        const contentBlock = htmlToDraft(currentContact.titre || '');
        if (contentBlock) {
          const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
          setEditorTitre(EditorState.createWithContent(contentState));
        } else {
          setEditorTitre(EditorState.createEmpty());
        }
      } else {
        setEditorTitre(EditorState.createEmpty());
      }
      if (currentContact.description) {
        const contentBlock = htmlToDraft(currentContact.description || '');
        if (contentBlock) {
          const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
          setEditorDescription(EditorState.createWithContent(contentState));
        } else {
          setEditorDescription(EditorState.createEmpty());
        }
      } else {
        setEditorDescription(EditorState.createEmpty());
      }
    }
  }, [modalOpen, currentContact.titre, currentContact.description]);

  useEffect(() => {
    if (snackbar.open) {
      const timer = setTimeout(() => setSnackbar(prev => ({ ...prev, open: false })), 3000);
      return () => clearTimeout(timer);
    }
  }, [snackbar.open]);

  // Fetch the entreprise's form on mount or when userEntreprise changes
  useEffect(() => {
    if (!userEntreprise) return;
    const fetchForm = async () => {
      setFormLoading(true);
      try {
        const res = await axios.get(`http://localhost:5000/formulaires/entreprise/${userEntreprise}/formulaires`);
        if (Array.isArray(res.data) && res.data.length > 0) {
          setFormulaire(res.data[0]);
          setSelectedForm(res.data[0]);
        } else {
          setFormulaire(null);
          setSelectedForm(null);
        }
      } catch (err) {
        setFormSnackbar({ open: true, message: "Erreur lors de la récupération du formulaire", severity: 'error' });
        setFormulaire(null);
        setSelectedForm(null);
      } finally {
        setFormLoading(false);
      }
    };
    fetchForm();
  }, [userEntreprise, showFormCreation]);

  // Fetch responses for the form
  useEffect(() => {
    if (!formulaire) return;
    const fetchResponses = async () => {
      setFormLoading(true);
      try {
        const res = await axios.get(`http://localhost:5000/formulaires/reponse/formulaire/${formulaire._id}`);
        setFormResponses(res.data);
      } catch (err) {
        setFormSnackbar({ open: true, message: "Erreur lors de la récupération des réponses", severity: 'error' });
      } finally {
        setFormLoading(false);
      }
    };
    fetchResponses();
  }, [formulaire]);

  // Handler for creating a form
  const handleCreateForm = async (values, { resetForm }) => {
    try {
      const champs = {};
      values.champs.forEach(f => { champs[f.nom] = f.type; });
      await axios.post('http://localhost:5000/formulaires', {
        titre: values.titre,
        champs,
        entreprise: userEntreprise,
      });
      setFormSnackbar({ open: true, message: 'Formulaire créé !', severity: 'success' });
      setShowFormCreation(false);
      resetForm();
      // The useEffect will refetch the form
    } catch (err) {
      setFormSnackbar({ open: true, message: "Erreur lors de la création du formulaire", severity: 'error' });
    }
  };

  // Handler for submitting a response
  const handleSubmitResponse = async (values, { resetForm }) => {
    try {
      await axios.post('http://localhost:5000/formulaires/reponse', {
        values,
        formulaire: formulaire._id,
      });
      setFormSnackbar({ open: true, message: 'Réponse enregistrée !', severity: 'success' });
      resetForm();
      // Refresh responses
      const res = await axios.get(`http://localhost:5000/formulaires/reponse/formulaire/${formulaire._id}`);
      setFormResponses(res.data);
    } catch (err) {
      setFormSnackbar({ open: true, message: "Erreur lors de l'envoi de la réponse", severity: 'error' });
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
      setCurrentContact(prev => ({ ...prev, image: response.data.secure_url }));
      setSnackbar({ open: true, message: "Image uploadée avec succès !", severity: "success" });
    } catch (error) {
      setSnackbar({ open: true, message: "Erreur lors de l'upload de l'image. Veuillez réessayer.", severity: "error" });
    }
  };

  const handleSave = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      // const htmlTitre = draftToHtml(convertToRaw(editorTitre.getCurrentContent()));
      // const htmlDescription = draftToHtml(convertToRaw(editorDescription.getCurrentContent()));
      const dataToSave = { ...currentContact };
      // On retire les champs inutiles
      delete dataToSave.datePublication;
      delete dataToSave.isPublished;
      delete dataToSave.image;
      if (currentContact._id) {
        await axios.patch(`http://localhost:5000/contenus/ContactUs/${currentContact._id}`, dataToSave, config);
        setSnackbar({ open: true, message: "Section Contact modifiée avec succès !", severity: "success" });
      } else {
        if (!currentContact.entreprise) throw new Error("L'entreprise de la section Contact n'est pas définie.");
        await axios.post(`http://localhost:5000/contenus/ContactUs`, dataToSave, config);
        setSnackbar({ open: true, message: "Section Contact créée avec succès !", severity: "success" });
      }
      setModalOpen(false);
      setImageSelected(null);
    } catch (error) {
      setSnackbar({ open: true, message: error.message || "Erreur lors de la sauvegarde de la section Contact.", severity: "error" });
    }
  };

  const handleArchive = async () => {
    if (!contact || !contact._id) return;
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.patch(`http://localhost:5000/contenus/ContactUs/${contact._id}/archive`, {}, config);
      setSnackbar({ open: true, message: "Section Contact archivée avec succès !", severity: "success" });
      setContact(null);
    } catch (error) {
      setSnackbar({ open: true, message: "Erreur lors de l'archivage.", severity: "error" });
    }
  };

  if (loading) return <span>Chargement...</span>;

  return (
    <div className="container">
      {snackbar.open && (
        <div className={`alert bg-${snackbar.severity === 'success' ? 'success-100' : 'danger-100'} text-${snackbar.severity === 'success' ? 'success-600' : 'danger-600'} border-${snackbar.severity === 'success' ? 'success-600' : 'danger-600'} border-start-width-4-px px-24 py-13`} style={{ position: 'fixed', top: 24, right: 24, zIndex: 2000 }}>
          {snackbar.message}
        </div>
      )}
      <div className="card mb-4">
        <div className="card-header d-flex flex-wrap align-items-center justify-content-between gap-3">
          <h5 className="card-title mb-0">Coordonnées</h5>
          <div className="d-flex gap-2">
            {contact && !contact.isArchived && (
              <button className="btn rounded-pill btn-neutral-900 text-base radius-8 px-20 py-11" onClick={handleArchive}>Archiver</button>
            )}
            <button className="btn rounded-pill btn-outline-primary-600 radius-8 px-20 py-11" onClick={() => {
              if (contact) {
                const { isPublished, image, ...rest } = contact;
                setCurrentContact({ ...rest });
              } else {
                setCurrentContact({
                  _id: null,
                  titre: '',
                  description: '',
                  adresse: '',
                  phone: '',
                  email: '',
                  links: {},
                  entreprise: userEntreprise || '',
                  isArchived: false,
                });
              }
              setModalOpen(true);
            }}>{contact ? 'Modifier' : 'Ajouter'}</button>
          </div>
        </div>
        <div className="card-body">
          {contact ? (
            <div className="row align-items-center">
              <div className="col-md-12">
                {/* <div className="rendered-html" dangerouslySetInnerHTML={{ __html: contact.titre }} />
                <div className="rendered-html" dangerouslySetInnerHTML={{ __html: contact.description }} /> */}
                <div><b>Titre :</b> {contact.titre}</div>
                <div><b>Description :</b> {contact.description}</div>

                <div><b>Adresse :</b> {contact.adresse}</div>
                <div><b>Téléphone :</b> {contact.phone}</div>
                <div><b>Email :</b> {contact.email}</div>
                {/* {contact.links && Object.keys(contact.links).length > 0 && (
                  <div><b>Liens :</b>
                    <ul style={{ marginBottom: 0 }}>
                      {Object.entries(contact.links).map(([key, value]) => (
                        <li key={key}>{key}: {value}</li>
                      ))}
                    </ul>
                  </div>
                )} */}
              </div>
            </div>
          ) : (
            <div className="alert alert-info text-center">Aucune section Contact trouvée.</div>
          )}
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-header">
          <h5 className="card-title mb-0">
            <Icon icon="mdi:form-select" className="me-2" />
            Formulaire de contact
          </h5>
        </div>
        <div className="card-body">
          {formLoading ? (
            <div>Chargement du formulaire...</div>
          ) : formulaire ? (
            <div>
              <h6 className="mb-3">{formulaire.titre}</h6>
              <Formik
                initialValues={Object.keys(formulaire.champs).reduce((acc, key) => ({ ...acc, [key]: '' }), {})}
                validationSchema={getResponseSchema(Object.entries(formulaire.champs).map(([nom, type]) => ({ nom, type })))}
                onSubmit={handleSubmitResponse}
                enableReinitialize
              >
                {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
                  <form onSubmit={handleSubmit}>
                    {Object.entries(formulaire.champs).map(([nom, type], idx) => (
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
          ) : (
            <div className="text-center">
              <button className="btn btn-outline-primary" onClick={() => setShowFormCreation(true)}>
                <Icon icon="solar:add-circle-outline" className="me-1" /> Créer un formulaire pour cette entreprise
              </button>
            </div>
          )}
          {showFormCreation && (
            <div className="mt-4">
              <h6 className="mb-3">Créer un formulaire pour cette entreprise</h6>
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
          )}
        </div>
      </div>

      {formulaire && (
        <div className="card">
          <div className="card-header">
            <h5 className="card-title mb-0">
              <Icon icon="mdi:clipboard-text-outline" className="me-2" />
              Réponses au formulaire
            </h5>
          </div>
          <div className="card-body">
            {formResponses.length === 0 ? (
              <div className="text-muted text-center">Aucune réponse pour ce formulaire.</div>
            ) : (
              <div className="table-responsive">
                <table className="table vertical-striped-table mb-0">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      {Object.keys(formulaire.champs).map((champ, idx) => (
                        <th key={idx} scope="col">{champ}</th>
                      ))}
                      <th scope="col">Date de soumission</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formResponses.map((resp, idx) => (
                      <tr key={idx}>
                        <td>{idx + 1}</td>
                        {Object.keys(formulaire.champs).map((champ, j) => (
                          <td key={j}>
                            {typeof resp.values[champ] === 'string' && resp.values[champ].length > 50 
                              ? `${resp.values[champ].substring(0, 50)}...` 
                              : resp.values[champ] || '-'}
                          </td>
                        ))}
                        <td>
                          {resp.createdAt ? 
                            new Date(resp.createdAt).toLocaleDateString('fr-FR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            }) : 
                            '-'
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {modalOpen && (
        <div className="modal fade show" style={{ display: 'block', zIndex: 1100 }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content p-4">
              <div className="modal-header">
                <h6 className="modal-title fw-semibold w-100 text-center">{contact ? 'Modifier la section' : 'Ajouter une section'} Contact</h6>
                <button type="button" className="btn-close" onClick={() => setModalOpen(false)}></button>
              </div>
              <div className="modal-body" style={{ overflowY: 'auto', maxHeight: '70vh' }}>
                {/* <div className="mb-3">
                  <label className="form-label">Titre</label>
                  <Editor editorState={editorTitre} onEditorStateChange={setEditorTitre} wrapperClassName="demo-wrapper" editorClassName="demo-editor" />
                </div> */}
                {/* <div className="mb-3">
                  <label className="form-label">Description</label>
                  <Editor editorState={editorDescription} onEditorStateChange={setEditorDescription} wrapperClassName="demo-wrapper" editorClassName="demo-editor" />
                </div> */}

                <div className="mb-3">
                  <label className="form-label">Titre</label>
                  <input type="text" className="form-control" value={currentContact.titre} onChange={e => setCurrentContact(prev => ({ ...prev, titre: e.target.value }))} placeholder="titre" />
                </div>

                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <input type="text" className="form-control" value={currentContact.description} onChange={e => setCurrentContact(prev => ({ ...prev, description: e.target.value }))} placeholder="Description" />
                </div>

                <div className="mb-3">
                  <label className="form-label">Adresse</label>
                  <input type="text" className="form-control" value={currentContact.adresse} onChange={e => setCurrentContact(prev => ({ ...prev, adresse: e.target.value }))} placeholder="Adresse" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Téléphone</label>
                  <input type="text" className="form-control" value={currentContact.phone} onChange={e => setCurrentContact(prev => ({ ...prev, phone: e.target.value }))} placeholder="Téléphone" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-control" value={currentContact.email} onChange={e => setCurrentContact(prev => ({ ...prev, email: e.target.value }))} placeholder="Email" />
                </div>

                
                {/* <div className="mb-3">
                  <label className="form-label">Liens</label>
                  <div className="d-flex gap-2 mb-2">
                    <input type="text" className="form-control" placeholder="Nom du lien (ex: Facebook)" value={currentLinkKey} onChange={e => setCurrentLinkKey(e.target.value)} />
                    <input type="text" className="form-control" placeholder="URL du lien" value={currentLinkValue} onChange={e => setCurrentLinkValue(e.target.value)} />
                    <button className="btn btn-primary btn-sm" type="button" onClick={() => {
                      if (currentLinkKey && currentLinkValue) {
                        setCurrentContact(prev => ({
                          ...prev,
                          links: {
                            ...prev.links,
                            [currentLinkKey]: currentLinkValue,
                          },
                        }));
                        setCurrentLinkKey('');
                        setCurrentLinkValue('');
                      }
                    }}>Ajouter</button>
                  </div>
                  {currentContact.links && Object.entries(currentContact.links).map(([key, value]) => (
                    <div key={key} className="d-flex align-items-center justify-content-between mb-1">
                      <span>{key}: {value}</span>
                      <button className="btn btn-danger btn-sm" type="button" onClick={() => {
                        const newLinks = { ...currentContact.links };
                        delete newLinks[key];
                        setCurrentContact(prev => ({ ...prev, links: newLinks }));
                      }}>Supprimer</button>
                    </div>
                  ))}
                </div> */}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary-600" onClick={() => setModalOpen(false)}>Annuler</button>
                <button type="button" className="btn btn-sm btn-primary-600" onClick={handleSave}>{contact ? 'Modifier' : 'Créer'}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactUsSection;