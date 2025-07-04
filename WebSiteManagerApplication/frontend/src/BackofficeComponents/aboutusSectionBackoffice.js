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
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { tokens } from "../theme";
import Header from "../components/Header";

const AboutusSectionBackoffice = () => {
  const [apropos, setAPropos] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [imageSelected, setImageSelected] = useState(null);
  const [userEntreprise, setUserEntreprise] = useState(null);
  const [currentAPropos, setCurrentAPropos] = useState({
    _id: null,
    titre: "",
    description: "",
    image: "",
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

  // Récupération du token et décodage pour obtenir l'ID de l'utilisateur
  const token = localStorage.getItem("token");
  let userId = null;

  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      userId = decodedToken?.sub;
    } catch (error) {
      console.error("Error decoding token:", error);
      setSnackbar({
        open: true,
        message: "Erreur lors du décodage du token.",
        severity: "error",
      });
      setLoading(false);
    }
  } else {
    console.error("Token is missing from localStorage.");
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
      console.error("Token or User ID is missing");
      setSnackbar({
        open: true,
        message: "Token ou ID utilisateur manquant.",
        severity: "error",
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const userResponse = await axios.get(`http://localhost:5000/auth/user/${userId}`, config);
      const user = userResponse.data;

      if (!user.entreprise) {
        console.error("User's company (entreprise) is missing");
        setSnackbar({
          open: true,
          message: "Entreprise de l'utilisateur non trouvée.",
          severity: "error",
        });
        setLoading(false);
        return;
      }

      setUserEntreprise(user.entreprise);
      setCurrentAPropos((prev) => ({
        ...prev,
        entreprise: user.entreprise,
      }));
    } catch (error) {
      console.error("Error fetching user data:", error);
      setSnackbar({
        open: true,
        message: "Erreur lors de la récupération des données utilisateur.",
        severity: "error",
      });
      setLoading(false);
    }
  };

  // Récupérer les sections À Propos associées à l'entreprise de l'utilisateur connecté
  const fetchAPropos = async () => {
    if (!token || !userId || !userEntreprise) {
      console.error("Token, User ID, or User Entreprise is missing");
      setSnackbar({
        open: true,
        message: "Données manquantes pour récupérer la section À Propos.",
        severity: "error",
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const response = await axios.get(
        `http://localhost:5000/contenus/APropos/entreprise/${userEntreprise}`,
        config
      );
      // If the API returns an array, take the first one (should only be one)
      setAPropos(Array.isArray(response.data) ? response.data[0] : response.data);
    } catch (error) {
      console.error("Error fetching apropos by entreprise:", error);
      setSnackbar({
        open: true,
        message: "Erreur lors de la récupération de la section À Propos.",
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

  // Appeler fetchAPropos une fois que userEntreprise est défini
  useEffect(() => {
    if (userEntreprise) {
      fetchAPropos();
    }
  }, [userEntreprise]);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
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
      setCurrentAPropos((prev) => ({
        ...prev,
        image: response.data.secure_url,
      }));
      setSnackbar({
        open: true,
        message: "Image uploadée avec succès !",
        severity: "success",
      });
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
  };

  const handleSave = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      if (currentAPropos._id) {
        await axios.patch(
          `http://localhost:5000/contenus/APropos/${currentAPropos._id}`,
          currentAPropos,
          config
        );
        setSnackbar({
          open: true,
          message: "Section À Propos modifiée avec succès !",
          severity: "success",
        });
      } else {
        if (!currentAPropos.entreprise) {
          throw new Error("L'entreprise de la section À Propos n'est pas définie.");
        }
        await axios.post(
          "http://localhost:5000/contenus/APropos",
          currentAPropos,
          config
        );
        setSnackbar({
          open: true,
          message: "Section À Propos créée avec succès !",
          severity: "success",
        });
      }
      setOpen(false);
      setImageSelected(null);
      fetchAPropos();
    } catch (error) {
      console.error("Error saving apropos", error);
      setSnackbar({
        open: true,
        message: error.message || "Erreur lors de la sauvegarde de la section À Propos.",
        severity: "error",
      });
    }
  };

  return (
    <Box m="20px">
      <Header title="À PROPOS" subtitle="Gérer la Section À Propos" />

      {/* Show add button only if no section exists */}
      {!apropos && (
        <Button
          variant="contained"
          color="warning"
          onClick={() => {
            setCurrentAPropos({
              _id: null,
              titre: "",
              description: "",
              image: "",
              datePublication: "",
              isPublished: false,
              entreprise: userEntreprise || "",
            });
            setImageSelected(null);
            setOpen(true);
          }}
          disabled={!userEntreprise}
        >
          Ajouter une Section À Propos
        </Button>
      )}

      {/* Show section details if exists */}
      {apropos && (
        <Box mt={3} p={3} bgcolor={colors.primary[400]} borderRadius={2} boxShadow={2}>
          <Box display="flex" alignItems="center" gap={2}>
            {apropos.image && (
              <img
                src={apropos.image}
                alt="Aperçu de l'image"
                style={{ width: 120, height: 120, objectFit: "cover", borderRadius: 8 }}
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/120";
                }}
              />
            )}
            <Box>
              <h2 style={{ margin: 0 }}>{apropos.titre}</h2>
              <p style={{ margin: 0 }}>{apropos.description}</p>
              <p style={{ margin: 0, color: '#888' }}>Date de publication : {apropos.datePublication}</p>
              <p style={{ margin: 0 }}>Publié : {apropos.isPublished ? 'Oui' : 'Non'}</p>
            </Box>
          </Box>
          <Box mt={2} display="flex" gap={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setCurrentAPropos({ ...apropos });
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
            value={currentAPropos.titre}
            onChange={(e) => setCurrentAPropos({ ...currentAPropos, titre: e.target.value })}
            placeholder="Titre de la section À Propos"
          />
          <TextField
            fullWidth
            margin="dense"
            value={currentAPropos.description}
            onChange={(e) => setCurrentAPropos({ ...currentAPropos, description: e.target.value })}
            placeholder="Description de la section À Propos"
          />
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
            {currentAPropos.image && (
              <Box mt={2}>
                <img
                  src={currentAPropos.image}
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
            value={currentAPropos.datePublication}
            onChange={(e) => setCurrentAPropos({ ...currentAPropos, datePublication: e.target.value })}
            placeholder="Date de publication"
          />
          <Box display="flex" alignItems="center" mt={2}>
            <Checkbox
              checked={currentAPropos.isPublished}
              onChange={(e) => setCurrentAPropos({ ...currentAPropos, isPublished: e.target.checked })}
            />
            <span>Publié</span>
          </Box>
          <Box mt={2} display="flex" justifyContent="space-between">
            <Button onClick={() => setOpen(false)} color="secondary">Annuler</Button>
            <Button onClick={handleSave} color="primary">
              {currentAPropos._id ? "Modifier" : "Créer"}
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
            Êtes-vous sûr de vouloir supprimer cette section À Propos ? Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
            Annuler
          </Button>
          <Button onClick={async () => {
            try {
              const config = {
                headers: { Authorization: `Bearer ${token}` },
              };
              await axios.delete(
                `http://localhost:5000/contenus/APropos/${apropos._id}`,
                config
              );
              setSnackbar({
                open: true,
                message: "Section À Propos supprimée avec succès !",
                severity: "success",
              });
              setAPropos(null);
            } catch (error) {
              console.error("Error deleting apropos", error);
              setSnackbar({
                open: true,
                message: "Erreur lors de la suppression de la section À Propos.",
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

export default AboutusSectionBackoffice;