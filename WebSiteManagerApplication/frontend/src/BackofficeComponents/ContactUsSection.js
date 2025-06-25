import { useEffect, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Modal,
  TextField,
  Checkbox,
  useTheme,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { tokens } from "../theme";
import Header from "../components/Header";

const ContactUsSection = () => {
  const [contactus, setContactUs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [imageSelected, setImageSelected] = useState(null);
  const [userEntreprise, setUserEntreprise] = useState(null);
  const [currentLinkKey, setCurrentLinkKey] = useState("");
  const [currentLinkValue, setCurrentLinkValue] = useState("");
  const [currentContactUs, setCurrentContactUs] = useState({
    _id: null,
    titre: "",
    description: "",
    image: "",
    adresse: "",
    phone: "",
    email: "",
    links: {},
    datePublication: "",
    isPublished: false,
    entreprise: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Auth
  const token = localStorage.getItem("token");
  let userId = null;
  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      userId = decodedToken?.sub;
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Erreur lors du décodage du token.",
        severity: "error",
      });
      setLoading(false);
    }
  } else {
    setSnackbar({
      open: true,
      message: "Token manquant. Veuillez vous connecter.",
      severity: "error",
    });
    setLoading(false);
  }

  // Récupérer l'entreprise de l'utilisateur connecté
  const fetchUserEntreprise = async () => {
    if (!token || !userId) {
      setSnackbar({
        open: true,
        message: "Token ou ID utilisateur manquant.",
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
          message: "Entreprise de l'utilisateur non trouvée.",
          severity: "error",
        });
        setLoading(false);
        return;
      }
      setUserEntreprise(user.entreprise);
      setCurrentContactUs((prev) => ({ ...prev, entreprise: user.entreprise }));
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Erreur lors de la récupération des données utilisateur.",
        severity: "error",
      });
      setLoading(false);
    }
  };

  // Récupérer la section ContactUs associée à l'entreprise de l'utilisateur connecté
  const fetchContactUs = async () => {
    if (!token || !userId || !userEntreprise) {
      setSnackbar({
        open: true,
        message: "Données manquantes pour récupérer la section ContactUs.",
        severity: "error",
      });
      setLoading(false);
      return;
    }
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get(
        `http://localhost:5000/contenus/ContactUs/entreprise/${userEntreprise}`,
        config
      );
      setContactUs(Array.isArray(response.data) ? response.data[0] : response.data);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Erreur lors de la récupération de la section ContactUs.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && userId) {
      fetchUserEntreprise();
    }
  }, []);

  useEffect(() => {
    if (userEntreprise) {
      fetchContactUs();
    }
  }, [userEntreprise]);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbar((prev) => ({ ...prev, open: false }));
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
      setCurrentContactUs((prev) => ({ ...prev, image: response.data.secure_url }));
      setSnackbar({
        open: true,
        message: "Image uploadée avec succès !",
        severity: "success",
      });
    } catch (error) {
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
  };

  const handleSave = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      if (currentContactUs._id) {
        await axios.patch(
          `http://localhost:5000/contenus/ContactUs/${currentContactUs._id}`,
          currentContactUs,
          config
        );
        setSnackbar({
          open: true,
          message: "Section Contact modifiée avec succès !",
          severity: "success",
        });
      } else {
        if (!currentContactUs.entreprise) {
          throw new Error("L'entreprise de la section Contact n'est pas définie.");
        }
        await axios.post(
          "http://localhost:5000/contenus/ContactUs",
          currentContactUs,
          config
        );
        setSnackbar({
          open: true,
          message: "Section Contact créée avec succès !",
          severity: "success",
        });
      }
      setOpen(false);
      setImageSelected(null);
      fetchContactUs();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || "Erreur lors de la sauvegarde de la section Contact.",
        severity: "error",
      });
    }
  };

  return (
    <Box m="20px">
      <Header title="CONTACT" subtitle="Gérer la Section Contact" />
      {/* Show add button only if no section exists */}
      {!contactus && (
        <Button
          variant="contained"
          color="warning"
          onClick={() => {
            setCurrentContactUs({
              _id: null,
              titre: "",
              description: "",
              image: "",
              adresse: "",
              phone: "",
              email: "",
              links: {},
              datePublication: "",
              isPublished: false,
              entreprise: userEntreprise || "",
            });
            setImageSelected(null);
            setOpen(true);
          }}
          disabled={!userEntreprise}
        >
          Ajouter une Section Contact
        </Button>
      )}
      {/* Show section details if exists */}
      {contactus && (
        <Box mt={3} p={3} bgcolor={colors.primary[400]} borderRadius={2} boxShadow={2}>
          <Box display="flex" alignItems="center" gap={2}>
            {contactus.image && (
              <img
                src={contactus.image}
                alt="Aperçu de l'image"
                style={{ width: 120, height: 120, objectFit: "cover", borderRadius: 8 }}
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/120";
                }}
              />
            )}
            <Box>
              <h2 style={{ margin: 0 }}>{contactus.titre}</h2>
              <p style={{ margin: 0 }}>{contactus.description}</p>
              <p style={{ margin: 0 }}>Adresse : {contactus.adresse}</p>
              <p style={{ margin: 0 }}>Téléphone : {contactus.phone}</p>
              <p style={{ margin: 0 }}>Email : {contactus.email}</p>
              {contactus.links && Object.keys(contactus.links).length > 0 && (
                <div style={{ margin: 0 }}>
                  <strong>Liens :</strong>
                  <ul>
                    {Object.entries(contactus.links).map(([key, value]) => (
                      <li key={key}>{key}: {value}</li>
                    ))}
                  </ul>
                </div>
              )}
              <p style={{ margin: 0, color: '#888' }}>Date de publication : {contactus.datePublication}</p>
              <p style={{ margin: 0 }}>Publié : {contactus.isPublished ? 'Oui' : 'Non'}</p>
            </Box>
          </Box>
          <Box mt={2} display="flex" gap={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setCurrentContactUs({ ...contactus });
                setOpen(true);
              }}
            >
              Modifier
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setOpenDeleteDialog(true)}
            >
              Supprimer
            </Button>
          </Box>
        </Box>
      )}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            p: 4,
            boxShadow: 24,
            borderRadius: 2,
          }}
        >
          <TextField
            fullWidth
            margin="dense"
            value={currentContactUs.titre}
            onChange={(e) => setCurrentContactUs({ ...currentContactUs, titre: e.target.value })}
            placeholder="Titre de la section Contact"
          />
          <TextField
            fullWidth
            margin="dense"
            value={currentContactUs.description}
            onChange={(e) => setCurrentContactUs({ ...currentContactUs, description: e.target.value })}
            placeholder="Description de la section Contact"
          />
          <TextField
            fullWidth
            margin="dense"
            value={currentContactUs.adresse}
            onChange={(e) => setCurrentContactUs({ ...currentContactUs, adresse: e.target.value })}
            placeholder="Adresse"
          />
          <TextField
            fullWidth
            margin="dense"
            value={currentContactUs.phone}
            onChange={(e) => setCurrentContactUs({ ...currentContactUs, phone: e.target.value })}
            placeholder="Téléphone"
          />
          <TextField
            fullWidth
            margin="dense"
            value={currentContactUs.email}
            onChange={(e) => setCurrentContactUs({ ...currentContactUs, email: e.target.value })}
            placeholder="Email"
          />
          {/* Links management */}
          <Box mt={2}>
            <TextField
              fullWidth
              margin="dense"
              placeholder="Nom du lien (ex: Facebook)"
              value={currentLinkKey}
              onChange={(e) => setCurrentLinkKey(e.target.value)}
            />
            <TextField
              fullWidth
              margin="dense"
              placeholder="URL du lien"
              value={currentLinkValue}
              onChange={(e) => setCurrentLinkValue(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                if (currentLinkKey && currentLinkValue) {
                  setCurrentContactUs((prev) => ({
                    ...prev,
                    links: {
                      ...prev.links,
                      [currentLinkKey]: currentLinkValue,
                    },
                  }));
                  setCurrentLinkKey("");
                  setCurrentLinkValue("");
                }
              }}
              style={{ marginTop: '10px' }}
            >
              Ajouter Lien
            </Button>
          </Box>
          <Box mt={2}>
            {currentContactUs.links &&
              Object.entries(currentContactUs.links).map(([key, value]) => (
                <Box key={key} display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <span>{key}: {value}</span>
                  <IconButton
                    color="secondary"
                    onClick={() => {
                      const newLinks = { ...currentContactUs.links };
                      delete newLinks[key];
                      setCurrentContactUs((prev) => ({
                        ...prev,
                        links: newLinks,
                      }));
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
          </Box>
          <Box mt={2}>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ marginBottom: "10px" }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={uploadImage}
              style={{ marginBottom: "10px" }}
            >
              Uploader l'image
            </Button>
            {currentContactUs.image && (
              <Box mt={2}>
                <img
                  src={currentContactUs.image}
                  alt="Aperçu de l'image"
                  style={{ width: "100%", maxHeight: "150px", objectFit: "cover" }}
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/150";
                  }}
                />
              </Box>
            )}
          </Box>
          <TextField
            fullWidth
            margin="dense"
            type="date"
            value={currentContactUs.datePublication}
            onChange={(e) => setCurrentContactUs({ ...currentContactUs, datePublication: e.target.value })}
            placeholder="Date de publication"
          />
          <Box display="flex" alignItems="center" mt={2}>
            <Checkbox
              checked={currentContactUs.isPublished}
              onChange={(e) => setCurrentContactUs({ ...currentContactUs, isPublished: e.target.checked })}
            />
            <span>Publié</span>
          </Box>
          <Box mt={2} display="flex" justifyContent="space-between">
            <Button onClick={() => setOpen(false)} color="secondary">Annuler</Button>
            <Button onClick={handleSave} color="primary">
              {currentContactUs._id ? "Modifier" : "Créer"}
            </Button>
          </Box>
        </Box>
      </Modal>
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirmer la suppression"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Êtes-vous sûr de vouloir supprimer cette section Contact ? Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
            Annuler
          </Button>
          <Button onClick={async () => {
            try {
              const config = { headers: { Authorization: `Bearer ${token}` } };
              await axios.delete(
                `http://localhost:5000/contenus/ContactUs/${contactus._id}`,
                config
              );
              setSnackbar({
                open: true,
                message: "Section Contact supprimée avec succès !",
                severity: "success",
              });
              setContactUs(null);
            } catch (error) {
              setSnackbar({
                open: true,
                message: "Erreur lors de la suppression de la section Contact.",
                severity: "error",
              });
            } finally {
              setOpenDeleteDialog(false);
            }
          }} color="secondary" autoFocus>
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ContactUsSection;