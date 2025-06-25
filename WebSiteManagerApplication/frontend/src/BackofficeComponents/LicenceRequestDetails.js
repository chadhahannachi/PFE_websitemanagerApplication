import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  Paper,
  Grid,
  useTheme,
  Snackbar,
  Alert,
  Modal,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import axios from "axios";
import { tokens } from "../theme";
import Header from "../components/Header";

const LicenceRequestDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [licenceRequest, setLicenceRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Modal states
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({
    nom: "",
    contact: "",
    numTel: "",
    adresse: "",
    raisonSociale: "",
    idRequestLicence: id
  });

  // Reject dialog states
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    const fetchLicenceRequest = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        const response = await axios.get(
          `http://localhost:5000/licence-requests/${id}`,
          config
        );
        setLicenceRequest(response.data);
      } catch (error) {
        console.error("Error fetching licence request:", error);
        setSnackbar({
          open: true,
          message: "Erreur lors de la récupération des détails de la licence.",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLicenceRequest();
  }, [id]);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleOpenModal = () => {
    if (licenceRequest.status === "rejected") {
      setSnackbar({
        open: true,
        message: "Vous ne pouvez pas ajouter une entreprise car vous avez rejeté cette demande de licence.",
        severity: "error",
      });
      return;
    }

    setFormData({
      nom: licenceRequest.company_name || "",
      contact: licenceRequest.company_email || "",
      numTel: licenceRequest.company_phone || "",
      adresse: licenceRequest.company_address || "",
      raisonSociale: licenceRequest.company_name || "",
      idRequestLicence: id
    });
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setFormData({
      nom: "",
      contact: "",
      numTel: "",
      adresse: "",
      raisonSociale: "",
      idRequestLicence: id
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await axios.post("http://localhost:5000/entreprises", formData);
      setSnackbar({
        open: true,
        message: "Entreprise créée avec succès !",
        severity: "success",
      });
      handleCloseModal();
      navigate("/EntrepriseManager");
    } catch (error) {
      console.error("Error creating entreprise:", error);
      setSnackbar({
        open: true,
        message: "Erreur lors de la création de l'entreprise.",
        severity: "error",
      });
    }
  };

  const handleOpenRejectDialog = () => {
    setOpenRejectDialog(true);
  };

  const handleCloseRejectDialog = () => {
    setOpenRejectDialog(false);
    setRejectionReason("");
  };

  const handleReject = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      await axios.put(
        `http://localhost:5000/licence-requests/${id}`,
        {
          status: "rejected",
          rejection_reason: rejectionReason,
          rejected_at: new Date().toISOString(),
        },
        config
      );

      setSnackbar({
        open: true,
        message: "Demande de licence rejetée avec succès !",
        severity: "success",
      });

      setLicenceRequest(prev => ({
        ...prev,
        status: "rejected",
        rejection_reason: rejectionReason,
        rejected_at: new Date().toISOString(),
      }));

      handleCloseRejectDialog();
    } catch (error) {
      console.error("Error rejecting licence request:", error);
      setSnackbar({
        open: true,
        message: "Erreur lors du rejet de la demande de licence.",
        severity: "error",
      });
    }
  };

  if (loading) {
    return <Typography>Chargement...</Typography>;
  }

  if (!licenceRequest) {
    return <Typography>Aucune licence trouvée</Typography>;
  }

  return (
    <Box m="20px">
      <Header
        title="DÉTAILS DE LA DEMANDE DE LICENCE"
        subtitle="Informations détaillées de la demande"
      />

      <Box sx={{ mb: 2, display: "flex", gap: 2 }}>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => navigate("/licenceRequestList")}
        >
          Retour à la liste
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenModal}
        >
          Créer une entreprise
        </Button>
        {licenceRequest.status === "pending" && (
          <Button
            variant="contained"
            color="error"
            onClick={handleOpenRejectDialog}
          >
            Rejeter la demande
          </Button>
        )}
      </Box>

      <Paper
        elevation={3}
        sx={{
          p: 3,
          backgroundColor: colors.primary[400],
          borderRadius: 2,
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" color={colors.grey[100]} gutterBottom>
              Informations de l'entreprise
            </Typography>
            <Typography variant="body1" color={colors.grey[100]}>
              <strong>Nom:</strong> {licenceRequest.company_name}
            </Typography>
            <Typography variant="body1" color={colors.grey[100]}>
              <strong>Email:</strong> {licenceRequest.company_email}
            </Typography>
            <Typography variant="body1" color={colors.grey[100]}>
              <strong>Téléphone:</strong> {licenceRequest.company_phone}
            </Typography>
            <Typography variant="body1" color={colors.grey[100]}>
              <strong>Adresse:</strong> {licenceRequest.company_address}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" color={colors.grey[100]} gutterBottom>
              Détails de la licence
            </Typography>
            <Typography variant="body1" color={colors.grey[100]}>
              <strong>Type:</strong> {licenceRequest.type}
            </Typography>
            <Typography variant="body1" color={colors.grey[100]}>
              <strong>Description:</strong> {licenceRequest.description}
            </Typography>
            <Typography variant="body1" color={colors.grey[100]}>
              <strong>Prix:</strong> {licenceRequest.price} €
            </Typography>
            <Typography variant="body1" color={colors.grey[100]}>
              <strong>Durée:</strong> {licenceRequest.duration_months} mois
            </Typography>
            <Typography variant="body1" color={colors.grey[100]}>
              <strong>Statut:</strong> {licenceRequest.status}
            </Typography>
            {licenceRequest.status === "rejected" && licenceRequest.rejection_reason && (
              <Typography variant="body1" color={colors.grey[100]}>
                <strong>Raison du rejet:</strong> {licenceRequest.rejection_reason}
              </Typography>
            )}
            <Typography variant="body1" color={colors.grey[100]}>
              <strong>Date de demande:</strong>{" "}
              {new Date(licenceRequest.requested_at).toLocaleDateString()}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Créer une entreprise
          </Typography>
          <TextField
            fullWidth
            label="Nom"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Contact"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Numéro de téléphone"
            name="numTel"
            value={formData.numTel}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Adresse"
            name="adresse"
            value={formData.adresse}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Raison sociale"
            name="raisonSociale"
            value={formData.raisonSociale}
            onChange={handleChange}
            margin="normal"
          />
          <Box sx={{ mt: 2, display: "flex", gap: 2, justifyContent: "flex-end" }}>
            <Button variant="outlined" onClick={handleCloseModal}>
              Annuler
            </Button>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Créer
            </Button>
          </Box>
        </Box>
      </Modal>

      <Dialog open={openRejectDialog} onClose={handleCloseRejectDialog}>
        <DialogTitle>Rejeter la demande de licence</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Veuillez fournir une raison pour le rejet de cette demande de licence.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Raison du rejet"
            fullWidth
            multiline
            rows={4}
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRejectDialog}>Annuler</Button>
          <Button 
            onClick={handleReject} 
            color="error" 
            disabled={!rejectionReason.trim()}
          >
            Rejeter
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

export default LicenceRequestDetails;