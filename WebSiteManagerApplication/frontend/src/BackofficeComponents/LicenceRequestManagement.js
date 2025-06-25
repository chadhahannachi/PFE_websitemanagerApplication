import { useEffect, useState } from "react";
import {
  Box,
  IconButton,
  useTheme,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { tokens } from "../theme";
import Header from "../components/Header";

const LicenceRequestManagement = () => {
  const [licenceRequests, setLicenceRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [userEntreprise, setUserEntreprise] = useState(null);
  const [currentLicenceRequest, setCurrentLicenceRequest] = useState({
    id: null,
    company_name: "",
    company_email: "",
    company_phone: "",
    company_address: "",
    type: "",
    description: "",
    price: 0,
    duration_months: 0,
    status: "pending",
    requested_at: new Date().toISOString(),
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [licenceRequestToDelete, setLicenceRequestToDelete] = useState(null);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

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

  // Récupérer les demandes de licence (pour l'instant toutes, ou par entreprise si implémenté côté backend)
  const fetchLicenceRequests = async () => {
    if (!token) {
      console.error("Token is missing");
      setSnackbar({
        open: true,
        message: "Token manquant pour récupérer les demandes de licence.",
        severity: "error",
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      // Adaptez cette URL si vous voulez filtrer par entreprise ou autre
      const response = await axios.get(
        `http://localhost:5000/licence-requests`,
        config
      );
      setLicenceRequests(response.data);
    } catch (error) {
      console.error("Error fetching licence requests:", error);
      setSnackbar({
        open: true,
        message: "Erreur lors de la récupération des demandes de licence.",
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
    // Fetch licence requests once userEntreprise is set, or if not required, fetch immediately
    // For simplicity, fetching all for now, but keep userEntreprise context
    fetchLicenceRequests();
  }, [userEntreprise]); // Re-fetch if userEntreprise changes, if filtering is implemented

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleSave = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      if (currentLicenceRequest.id) {
        // Update existing licence request
        await axios.put(
          `http://localhost:5000/licence-requests/${currentLicenceRequest.id}`,
          currentLicenceRequest,
          config
        );
        setSnackbar({
          open: true,
          message: "Demande de licence modifiée avec succès !",
          severity: "success",
        });
      } else {
        // Create new licence request
        // Note: The form sends company_name, etc., but DTO expects mongo_company_id.
        // Assuming backend handles mapping or derivation.
        await axios.post(
          "http://localhost:5000/licence-requests",
          currentLicenceRequest,
          config
        );
        setSnackbar({
          open: true,
          message: "Demande de licence créée avec succès !",
          severity: "success",
        });
      }
      setOpen(false);
      fetchLicenceRequests();
    } catch (error) {
      console.error("Error saving licence request:", error);
      setSnackbar({
        open: true,
        message: error.message || "Erreur lors de la sauvegarde de la demande de licence.",
        severity: "error",
      });
    }
  };

  const handleOpenDeleteDialog = (id) => {
    setLicenceRequestToDelete(id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setLicenceRequestToDelete(null);
  };

  const handleConfirmDelete = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      await axios.delete(
        `http://localhost:5000/licence-requests/${licenceRequestToDelete}`,
        config
      );
      setSnackbar({
        open: true,
        message: "Demande de licence supprimée avec succès !",
        severity: "success",
      });
      fetchLicenceRequests();
    } catch (error) {
      console.error("Error deleting licence request:", error);
      setSnackbar({
        open: true,
        message: "Erreur lors de la suppression de la demande de licence.",
        severity: "error",
      });
    } finally {
      handleCloseDeleteDialog();
    }
  };

  const columns = [
    { field: "company_name", headerName: "Nom de l'entreprise", flex: 2 },
    { field: "company_email", headerName: "Email", flex: 2 },
    { field: "company_phone", headerName: "Téléphone", flex: 1.5 },
    { field: "company_address", headerName: "Adresse", flex: 2 },
    { field: "type", headerName: "Type", flex: 1 },
    { field: "description", headerName: "Description", flex: 2 },
    { field: "price", headerName: "Prix", flex: 0.8, type: "number" },
    { field: "duration_months", headerName: "Durée (mois)", flex: 1, type: "number" },
    { field: "status", headerName: "Statut", flex: 1 },
    { field: "requested_at", headerName: "Date de demande", flex: 2 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <>
          <IconButton
            onClick={() => navigate(`/licence-requests/${params.row.id}`)}
            color="primary"
          >
            <VisibilityIcon />
          </IconButton>
          {/* <IconButton
            onClick={() => {
              setCurrentLicenceRequest({ ...params.row });
              setOpen(true);
            }}
          >
            <EditIcon style={{ cursor: "pointer" }} />
          </IconButton>
          <IconButton
            color="secondary"
            onClick={() => handleOpenDeleteDialog(params.row.id)}
          >
            <DeleteIcon />
          </IconButton> */}
        </>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header title="DEMANDES DE LICENCE" subtitle="Gestion des Demandes de Licence" />

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
          rows={licenceRequests}
          columns={columns}
          getRowId={(row) => row.id}
          loading={loading}
          components={{ Toolbar: GridToolbar }}
          pageSize={5}
        />
      </Box>

      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirmer la suppression"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Êtes-vous sûr de vouloir supprimer cette demande de licence ? Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">Annuler</Button>
          <Button onClick={handleConfirmDelete} color="secondary" autoFocus>Supprimer</Button>
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

export default LicenceRequestManagement; 