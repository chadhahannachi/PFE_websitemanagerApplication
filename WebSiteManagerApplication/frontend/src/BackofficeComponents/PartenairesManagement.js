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

const PartenairesManagement = () => {
  const [partenaires, setPartenaires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [imageSelected, setImageSelected] = useState(null);
  const [userEntreprise, setUserEntreprise] = useState(null);
  const [currentPartenaire, setCurrentPartenaire] = useState({
    _id: null,
    titre: "",
    description: "",
    image: "",
    datePublication: "",
    isPublished: false,
    secteurActivite: "",
    entreprise: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [partnerToDelete, setPartnerToDelete] = useState(null);
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
      setCurrentPartenaire((prev) => ({
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

  // Récupérer les partenaires associés à l'entreprise de l'utilisateur connecté
  const fetchPartenaires = async () => {
    if (!token || !userId || !userEntreprise) {
      console.error("Token, User ID, or User Entreprise is missing");
      setSnackbar({
        open: true,
        message: "Données manquantes pour récupérer les partenaires.",
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
        `http://localhost:5000/contenus/Partenaire/entreprise/${userEntreprise}`,
        config
      );
      setPartenaires(response.data);
    } catch (error) {
      console.error("Error fetching partenaires by entreprise:", error);
      setSnackbar({
        open: true,
        message: "Erreur lors de la récupération des partenaires.",
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

  // Appeler fetchPartenaires une fois que userEntreprise est défini
  useEffect(() => {
    if (userEntreprise) {
      fetchPartenaires();
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
      setCurrentPartenaire((prev) => ({
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

      if (currentPartenaire._id) {
        await axios.patch(
          `http://localhost:5000/contenus/Partenaire/${currentPartenaire._id}`,
          currentPartenaire,
          config
        );
        setSnackbar({
          open: true,
          message: "Partenaire modifié avec succès !",
          severity: "success",
        });
      } else {
        if (!currentPartenaire.entreprise) {
          throw new Error("L'entreprise du partenaire n'est pas définie.");
        }
        await axios.post(
          "http://localhost:5000/contenus/Partenaire",
          currentPartenaire,
          config
        );
        setSnackbar({
          open: true,
          message: "Partenaire créé avec succès !",
          severity: "success",
        });
      }
      setOpen(false);
      setImageSelected(null);
      fetchPartenaires();
    } catch (error) {
      console.error("Error saving partenaire", error);
      setSnackbar({
        open: true,
        message: error.message || "Erreur lors de la sauvegarde du partenaire.",
        severity: "error",
      });
    }
  };

  const handleOpenDeleteDialog = (id) => {
    setPartnerToDelete(id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setPartnerToDelete(null);
  };

  const handleConfirmDelete = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      await axios.delete(
        `http://localhost:5000/contenus/Partenaire/${partnerToDelete}`,
        config
      );
      setSnackbar({
        open: true,
        message: "Partenaire supprimé avec succès !",
        severity: "success",
      });
      fetchPartenaires();
    } catch (error) {
      console.error("Error deleting partenaire", error);
      setSnackbar({
        open: true,
        message: "Erreur lors de la suppression du partenaire.",
        severity: "error",
      });
    } finally {
      handleCloseDeleteDialog();
    }
  };

  const columns = [
    { field: "titre", headerName: "Titre", flex: 2 },
    { field: "description", headerName: "Description", flex: 3 },
    {
      field: "image",
      headerName: "Image",
      flex: 2,
      renderCell: (params) => (
        <img
          src={params.value}
          alt={params.row.titre || "Image du partenaire"}
          style={{ width: "50px", height: "50px", objectFit: "cover" }}
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/50";
          }}
        />
      ),
    },
    { field: "datePublication", headerName: "Date de Publication", flex: 2 },
    { field: "isPublished", headerName: "Publié", flex: 1, type: "boolean" },
    { field: "secteurActivite", headerName: "Secteur d'activité", flex: 2 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <>
          <IconButton
            onClick={() => {
              setCurrentPartenaire({ ...params.row });
              setOpen(true);
            }}
          >
            <EditIcon style={{ cursor: "pointer" }} />
          </IconButton>
          <IconButton
            color="secondary"
            onClick={() => handleOpenDeleteDialog(params.row._id)}
          >
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header title="PARTENAIRES" subtitle="Gestion des Partenaires" />

      <Button
        variant="contained"
        color="warning"
        onClick={() => {
          setCurrentPartenaire({
            _id: null,
            titre: "",
            description: "",
            image: "",
            datePublication: "",
            isPublished: false,
            secteurActivite: "",
            entreprise: userEntreprise || "",
          });
          setImageSelected(null);
          setOpen(true);
        }}
        disabled={!userEntreprise}
      >
        Ajouter un Partenaire
      </Button>

      <Box
        m="15px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { borderBottom: "none" },
          "& .MuiDataGrid-columnHeaders": { backgroundColor: colors.blueAccent[700], borderBottom: "none" },
          "& .MuiDataGrid-virtualScroller": { backgroundColor: colors.primary[400] },
          "& .MuiDataGrid-footerContainer": { borderTop: "none", backgroundColor: colors.blueAccent[700] },
          "& .MuiCheckbox-root": { color: `${colors.greenAccent[200]} !important` },
        }}
      >
        <DataGrid
          rows={partenaires}
          columns={columns}
          getRowId={(row) => row._id}
          loading={loading}
          components={{ Toolbar: GridToolbar }}
          pageSize={5}
        />
      </Box>

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
            value={currentPartenaire.titre}
            onChange={(e) => setCurrentPartenaire({ ...currentPartenaire, titre: e.target.value })}
            placeholder="Titre de Partenariat"
          />
          <TextField
            fullWidth
            margin="dense"
            value={currentPartenaire.description}
            onChange={(e) => setCurrentPartenaire({ ...currentPartenaire, description: e.target.value })}
            placeholder="Description de Partenariat"
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
            {currentPartenaire.image && (
              <Box mt={2}>
                <img
                  src={currentPartenaire.image}
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
            value={currentPartenaire.secteurActivite}
            onChange={(e) => setCurrentPartenaire({ ...currentPartenaire, secteurActivite: e.target.value })}
            placeholder="Secteur d'activité du partenaire"
          />
          <TextField
            fullWidth
            margin="dense"
            type="date"
            value={currentPartenaire.datePublication}
            onChange={(e) => setCurrentPartenaire({ ...currentPartenaire, datePublication: e.target.value })}
            placeholder="Date de publication"
          />
          <Box display="flex" alignItems="center" mt={2}>
            <Checkbox
              checked={currentPartenaire.isPublished}
              onChange={(e) => setCurrentPartenaire({ ...currentPartenaire, isPublished: e.target.checked })}
            />
            <span>Publié</span>
          </Box>
          <Box mt={2} display="flex" justifyContent="space-between">
            <Button onClick={() => setOpen(false)} color="secondary">Annuler</Button>
            <Button onClick={handleSave} color="primary">
              {currentPartenaire._id ? "Modifier" : "Créer"}
            </Button>
          </Box>
        </Box>
      </Modal>

      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirmer la suppression"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Êtes-vous sûr de vouloir supprimer ce partenaire ? Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Annuler
          </Button>
          <Button onClick={handleConfirmDelete} color="secondary" autoFocus>
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

export default PartenairesManagement;