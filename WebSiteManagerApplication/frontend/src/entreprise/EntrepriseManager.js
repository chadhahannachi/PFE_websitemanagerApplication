import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Modal, Box, TextField, Typography, List, ListItem, ListItemText, Snackbar, Alert, FormControl, InputLabel, Select, MenuItem, Grid } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import BeenhereIcon from '@mui/icons-material/Beenhere';

const EntrepriseManager = () => {
  const [entreprises, setEntreprises] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingEntreprise, setEditingEntreprise] = useState(null);
  const [formData, setFormData] = useState({ nom: "", contact: "", numTel: "", adresse: "", raisonSociale: "", idRequestLicence: "" });
  const navigate = useNavigate();
  const [userEntrepriseId, setUserEntrepriseId] = useState(null);
  const [usersModalOpen, setUsersModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedEntreprise, setSelectedEntreprise] = useState(null);
  const [licenseModalOpen, setLicenseModalOpen] = useState(false);
  const [selectedLicense, setSelectedLicense] = useState(null);
  const [licenseLoading, setLicenseLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [addLicenseModalOpen, setAddLicenseModalOpen] = useState(false);
  const [licenseFormData, setLicenseFormData] = useState({
    type: 'basic',
    status: 'pending',
    price: 50,
    description: '',
    start_date: '',
    end_date: '',
    license_key: '',
    mongo_company_id: '',
    company_email: '',
    licence_request_id: ''
  });
  const [selectedEntrepriseId, setSelectedEntrepriseId] = useState(null);
  const [licenseRequestDetails, setLicenseRequestDetails] = useState(null);
  const [licenseRequestModalOpen, setLicenseRequestModalOpen] = useState(false);

  useEffect(() => {
    fetchEntreprises();
    fetchUserEntrepriseId();
  }, []);

  const fetchUserEntrepriseId = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken?.sub;
        if (userId) {
          axios.get(`http://localhost:5000/auth/user/${userId}`)
            .then(response => {
              setUserEntrepriseId(response.data.entreprise);
            })
            .catch(error => {
              console.error("Error fetching user entreprise:", error);
              setSnackbar({
                open: true,
                message: "Erreur lors de la récupération de l'ID de l'entreprise de l'utilisateur.",
                severity: "error",
              });
            });
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        setSnackbar({
          open: true,
          message: "Erreur lors du décodage du token d'authentification.",
          severity: "error",
        });
      }
    }
  };

  const fetchEntreprises = async () => {
    try {
      const response = await axios.get("http://localhost:5000/entreprises");
      const mappedData = response.data.map((entreprise) => ({
        id: entreprise._id,
        nom: entreprise.nom,
        contact: entreprise.contact,
        numTel: entreprise.numTel,
        adresse: entreprise.adresse,
        raisonSociale: entreprise.raisonSociale,
        idRequestLicence: entreprise.idRequestLicence || ""
      }));
      setEntreprises(mappedData);
    } catch (error) {
      console.error("Error fetching entreprises:", error);
      setSnackbar({
        open: true,
        message: "Erreur lors de la récupération des entreprises.",
        severity: "error",
      });
    }
  };

  const handleOpen = (entreprise = null) => {
    setEditingEntreprise(entreprise);
    setFormData(entreprise ? { 
      nom: entreprise.nom, 
      contact: entreprise.contact, 
      numTel: entreprise.numTel, 
      adresse: entreprise.adresse, 
      raisonSociale: entreprise.raisonSociale,
      idRequestLicence: entreprise.idRequestLicence || ""
    } : { nom: "", contact: "", numTel: "", adresse: "", raisonSociale: "", idRequestLicence: "" });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingEntreprise(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (editingEntreprise) {
        await axios.patch(`http://localhost:5000/entreprises/${editingEntreprise.id}`, formData);
      } else {
        await axios.post("http://localhost:5000/entreprises", formData);
      }
      fetchEntreprises();
      handleClose();
      setSnackbar({
        open: true,
        message: editingEntreprise ? "Entreprise mise à jour avec succès !" : "Entreprise créée avec succès !",
        severity: "success",
      });
    } catch (error) {
      console.error("Error saving entreprise:", error);
      setSnackbar({
        open: true,
        message: "Erreur lors de la sauvegarde de l'entreprise.",
        severity: "error",
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/entreprises/${id}`);
      fetchEntreprises();
      setSnackbar({
        open: true,
        message: "Entreprise supprimée avec succès !",
        severity: "success",
      });
    } catch (error) {
      console.error("Error deleting entreprise:", error);
      setSnackbar({
        open: true,
        message: "Erreur lors de la suppression de l'entreprise.",
        severity: "error",
      });
    }
  };

  const handleAddSuperAdmin = (entrepriseId) => {
    navigate(`/add-super-admin-company/${entrepriseId}`);
  };

  const handleShowMembers = async (entrepriseId, entrepriseNom) => {
    try {
      const response = await axios.get(`http://localhost:5000/auth/entreprise/${entrepriseId}/users`);
      setUsers(response.data);
      setSelectedEntreprise({ id: entrepriseId, nom: entrepriseNom });
      setUsersModalOpen(true);
    } catch (error) {
      console.error("Error fetching users by entreprise:", error);
      setSnackbar({
        open: true,
        message: "Erreur lors de la récupération des membres de l'entreprise.",
        severity: "error",
      });
    }
  };

  const handleShowLicense = async (entrepriseId) => {
    try {
      setLicenseLoading(true);
      const response = await axios.get(`http://localhost:5000/licences/mongo/${entrepriseId}`);
      setSelectedLicense(response.data);
      setSelectedEntrepriseId(entrepriseId);
      setLicenseModalOpen(true);
    } catch (error) {
        setSelectedLicense(null);
        setSelectedEntrepriseId(entrepriseId);
        setLicenseModalOpen(true);
      
    } finally {
      setLicenseLoading(false);
    }
  };

  const handleCreateLicense = async (entrepriseId) => {
    try {
      const entreprise = entreprises.find(e => e.id === entrepriseId);
      if (!entreprise) {
        throw new Error("Entreprise non trouvée");
      }
      const response = await axios.post("http://localhost:5000/licences", {
        mongo_company_id: entrepriseId,
        type: "basic",
        status: "pending",
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        price: 50,
        description: "Licence créée automatiquement",
        licence_request_id: entreprise.idRequestLicence || ""
      });

      setSnackbar({
        open: true,
        message: "Licence créée avec succès !",
        severity: "success",
      });

      setSelectedLicense(response.data);
    } catch (error) {
      console.error("Error creating license:", error);
      setSnackbar({
        open: true,
        message: "Erreur lors de la création de la licence.",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const generateLicenseKey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const segments = 4;
    const segmentLength = 4;
    let key = '';
    
    for (let i = 0; i < segments; i++) {
      for (let j = 0; j < segmentLength; j++) {
        key += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      if (i < segments - 1) key += '-';
    }
    
    return key;
  };

  const handleLicenseFormChange = (e) => {
    const { name, value } = e.target;
    let newFormData = {
      ...licenseFormData,
      [name]: value
    };

    if (name === 'type') {
      switch (value) {
        case 'basic':
          newFormData.price = 50;
          break;
        case 'professional':
          newFormData.price = 100;
          break;
        case 'enterprise':
          newFormData.price = 150;
          break;
        default:
          newFormData.price = 0;
      }
    }

    setLicenseFormData(newFormData);
  };

  const handleOpenAddLicenseModal = async () => {
    const entreprise = entreprises.find(e => e.id === selectedEntrepriseId);
    
    if (!entreprise) {
      setSnackbar({
        open: true,
        message: 'Erreur: Entreprise non trouvée',
        severity: 'error'
      });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      
      // Fetch licence request details
      const response = await axios.get(`http://localhost:5000/licence-requests/${entreprise.idRequestLicence}`, config);
      const licenceRequest = response.data;

      // Calculate dates
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + (licenceRequest.duration_months || 12));

      // Set licence form data based on licence request
      setLicenseFormData({
        type: licenceRequest.type || 'basic',
        status: 'pending',
        price: licenceRequest.price || 50,
        description: licenceRequest.description || '',
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        license_key: generateLicenseKey(),
        mongo_company_id: entreprise.id,
        company_email: entreprise.contact,
        licence_request_id: entreprise.idRequestLicence
      });
      
      setAddLicenseModalOpen(true);
    } catch (error) {
      console.error('Error fetching licence request:', error);
      setSnackbar({
        open: true,
        message: 'Erreur lors de la récupération des détails de la demande de licence.',
        severity: 'error'
      });
    }
  };

  const handleCloseAddLicenseModal = () => {
    setAddLicenseModalOpen(false);
  };

  const handleLicenseSubmit = async (e) => {
    e.preventDefault();
    try {
      const licenseData = {
        type: licenseFormData.type,
        status: licenseFormData.status,
        price: licenseFormData.price,
        description: licenseFormData.description,
        start_date: licenseFormData.start_date,
        end_date: licenseFormData.end_date,
        license_key: licenseFormData.license_key,
        mongo_company_id: licenseFormData.mongo_company_id,
        company_email: licenseFormData.company_email,
        licence_request_id: licenseFormData.licence_request_id
      };

      const response = await axios.post('http://localhost:5000/licences', licenseData);

      setSnackbar({
        open: true,
        message: 'Licence ajoutée avec succès',
        severity: 'success'
      });
      handleCloseAddLicenseModal();
      handleShowLicense(licenseFormData.mongo_company_id);
    } catch (error) {
      console.error("Error creating license:", error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Erreur lors de l\'ajout de la licence',
        severity: 'error'
      });
    }
  };

  const handleShowLicenseRequest = async (requestId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const response = await axios.get(`http://localhost:5000/licence-requests/${requestId}`, config);
      setLicenseRequestDetails(response.data);
      setLicenseRequestModalOpen(true);
    } catch (error) {
      console.error("Error fetching license request:", error);
      setSnackbar({
        open: true,
        message: error.message === "No token found" 
          ? "Veuillez vous reconnecter"
          : "Erreur lors de la récupération des détails de la demande de licence.",
        severity: "error",
      });
    }
  };

  const handleCloseLicenseRequestModal = () => {
    setLicenseRequestModalOpen(false);
    setLicenseRequestDetails(null);
  };

  const columns = [
    { field: "nom", headerName: "Name", width: 150 },
    { field: "contact", headerName: "Contact", width: 150 },
    { field: "numTel", headerName: "Phone Number", width: 150 },
    { field: "adresse", headerName: "Address", width: 100 },
    { field: "raisonSociale", headerName: "raisonSociale", width: 150 },
    {
      field: "Members",
      headerName: "Members",
      width: 150,
      renderCell: (params) => (
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => handleShowMembers(params.row.id, params.row.nom)}
        >
          Show Members
        </Button>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 180,
      renderCell: (params) => (
        <>
          <Button 
            variant="contained" 
            color="secondary" 
            onClick={() => handleOpen(params.row)}
          >
            Edit
          </Button>
          <Button 
            variant="contained" 
            color="error" 
            onClick={() => handleDelete(params.row.id)} 
            style={{ marginLeft: 10 }}
          >
            Delete
          </Button>
        </>
      ),
    },
    {
      field: "AddSuperAdmin",
      headerName: "",
      width: 200,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="success"
          onClick={() => handleAddSuperAdmin(params.row.id)}
          style={{ marginLeft: 10 }}
          disabled={userEntrepriseId === params.row.id}
        >
          Add Super Admin
        </Button>
      ),
    },
    {
      field: "Licence",
      headerName: "Licence",
      width: 200,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="success"
          onClick={() => handleShowLicense(params.row.id)}
          style={{ marginLeft: 10 }}
        >
          <BeenhereIcon />
        </Button>
      ),
    },
    {
      field: "idRequestLicence",
      headerName: "Demande de Licence",
      width: 200,
      renderCell: (params) => {
        if (!params.row.idRequestLicence) return <Typography>-</Typography>;
        return (
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => handleShowLicenseRequest(params.row.idRequestLicence)}
          >
            Voir la demande
          </Button>
        );
      },
    },
  ];

  return (
    <div style={{ height: 400, width: "100%" }}>
      <Button 
        variant="contained" 
        color="warning" 
        onClick={() => handleOpen()} 
        style={{ marginBottom: 10 }}
      >
        Add Entreprise
      </Button>
      <DataGrid 
        rows={entreprises} 
        columns={columns} 
        pageSize={5} 
        checkboxSelection 
        getRowId={(row) => row.id} 
      />

      <Modal open={open} onClose={handleClose}>
        <Box sx={{ 
          position: "absolute", 
          top: "50%", 
          left: "50%", 
          transform: "translate(-50%, -50%)", 
          width: 400, 
          bgcolor: "background.paper", 
          boxShadow: 24, 
          p: 4 
        }}>
          <Typography variant="h6">
            {editingEntreprise ? "Edit Entreprise" : "Add Entreprise"}
          </Typography>
          <TextField 
            fullWidth 
            label="Name" 
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
            label="Phone Number" 
            name="numTel" 
            value={formData.numTel} 
            onChange={handleChange} 
            margin="normal" 
          />
          <TextField 
            fullWidth 
            label="Address" 
            name="adresse" 
            value={formData.adresse} 
            onChange={handleChange} 
            margin="normal" 
          />
          <TextField 
            fullWidth 
            label="raisonSociale" 
            name="raisonSociale" 
            value={formData.raisonSociale} 
            onChange={handleChange} 
            margin="normal" 
          />
          <TextField 
            fullWidth 
            label="ID Demande de Licence" 
            name="idRequestLicence" 
            value={formData.idRequestLicence} 
            onChange={handleChange} 
            margin="normal" 
          />
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleSubmit} 
            style={{ marginTop: 10 }}
          >
            Save
          </Button>
          <Button 
            variant="outlined" 
            onClick={handleClose} 
            style={{ marginTop: 10, marginLeft: 10 }}
          >
            Cancel
          </Button>
        </Box>
      </Modal>

      <Modal open={usersModalOpen} onClose={() => setUsersModalOpen(false)}>
        <Box sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
        }}>
          <Typography variant="h6">
            Membres de {selectedEntreprise?.nom || "l'entreprise"}
          </Typography>
          {users.length > 0 ? (
            <>
              <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: "bold" }}>
                Administrateurs
              </Typography>
              <List>
                {users
                  .filter(user => user.role === "superadminabshore" || user.role === "superadminentreprise")
                  .map(user => (
                    <ListItem key={user._id}>
                      <ListItemText primary={user.nom} secondary={user.email} />
                    </ListItem>
                  ))}
              </List>
              <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: "bold" }}>
                Modérateurs
              </Typography>
              <List>
                {users
                  .filter(user => user.role === "moderateur")
                  .map(user => (
                    <ListItem key={user._id}>
                      <ListItemText primary={user.nom} secondary={user.email} />
                    </ListItem>
                  ))}
              </List>
            </>
          ) : (
            <Typography>No members added yet.</Typography>
          )}
          <Button
            variant="outlined"
            onClick={() => setUsersModalOpen(false)}
            style={{ marginTop: 10 }}
          >
            Close
          </Button>
        </Box>
      </Modal>

      <Modal open={licenseModalOpen} onClose={() => setLicenseModalOpen(false)}>
        <Box sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}>
          {licenseLoading ? (
            <Typography>Chargement...</Typography>
          ) : selectedLicense ? (
            <>
              <Typography variant="h6" gutterBottom>
                Détails de la licence
              </Typography>
              <Typography variant="body1">
                <strong>Type:</strong> {selectedLicense.type}
              </Typography>
              <Typography variant="body1">
                <strong>Statut:</strong> {selectedLicense.status}
              </Typography>
              <Typography variant="body1">
                <strong>Prix:</strong> {selectedLicense.price} €
              </Typography>
              <Typography variant="body1">
                <strong>Date de début:</strong>{" "}
                {new Date(selectedLicense.start_date).toLocaleDateString()}
              </Typography>
              <Typography variant="body1">
                <strong>Date de fin:</strong>{" "}
                {new Date(selectedLicense.end_date).toLocaleDateString()}
              </Typography>
              <Typography variant="body1">
                <strong>Clé de licence:</strong> {selectedLicense.license_key}
              </Typography>
              {selectedLicense.description && (
                <Typography variant="body1">
                  <strong>Description:</strong> {selectedLicense.description}
                </Typography>
              )}
              {selectedLicense.licence_request_id && (
                <Typography variant="body1">
                  <strong>ID Demande de Licence:</strong> {selectedLicense.licence_request_id}
                </Typography>
              )}
            </>
          ) : (
            <>
              <Typography variant="h6" gutterBottom>
                Aucune licence
              </Typography>
              <Typography variant="body1" gutterBottom>
                Cette entreprise n'a pas encore de licence.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleOpenAddLicenseModal}
                sx={{ mt: 2 }}
              >
                Ajouter une licence
              </Button>
            </>
          )}
          <Button
            variant="outlined"
            onClick={() => setLicenseModalOpen(false)}
            sx={{ mt: 2 }}
          >
            Fermer
          </Button>
        </Box>
      </Modal>

      <Modal
        open={addLicenseModalOpen}
        onClose={handleCloseAddLicenseModal}
        aria-labelledby="add-license-modal-title"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2
        }}>
          <Typography id="add-license-modal-title" variant="h6" component="h2" gutterBottom>
            Ajouter une licence
          </Typography>
          <form onSubmit={handleLicenseSubmit}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Type de licence</InputLabel>
              <Select
                name="type"
                value={licenseFormData.type}
                onChange={handleLicenseFormChange}
                label="Type de licence"
              >
                <MenuItem value="basic">Basic</MenuItem>
                <MenuItem value="professional">Professional</MenuItem>
                <MenuItem value="enterprise">Enterprise</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>Statut</InputLabel>
              <Select
                name="status"
                value={licenseFormData.status}
                onChange={handleLicenseFormChange}
                label="Statut"
              >
                <MenuItem value="pending">En attente</MenuItem>
                <MenuItem value="paid">Payée</MenuItem>
                <MenuItem value="expired">Expirée</MenuItem>
                <MenuItem value="cancelled">Annulée</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              margin="normal"
              label="Prix"
              name="price"
              type="number"
              value={licenseFormData.price}
              InputProps={{
                readOnly: true,
              }}
              helperText="Le prix est automatiquement défini selon le type de licence"
            />

            <TextField
              fullWidth
              margin="normal"
              label="Date de début"
              name="start_date"
              type="date"
              value={licenseFormData.start_date}
              onChange={handleLicenseFormChange}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              fullWidth
              margin="normal"
              label="Date de fin"
              name="end_date"
              type="date"
              value={licenseFormData.end_date}
              onChange={handleLicenseFormChange}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              fullWidth
              margin="normal"
              label="Clé de licence"
              name="license_key"
              value={licenseFormData.license_key}
              InputProps={{
                readOnly: true,
              }}
              helperText="La clé de licence est générée automatiquement"
            />

            <TextField
              fullWidth
              margin="normal"
              label="Description"
              name="description"
              multiline
              rows={4}
              value={licenseFormData.description}
              onChange={handleLicenseFormChange}
            />

            <TextField
              fullWidth
              margin="normal"
              label="ID Demande de Licence"
              name="licence_request_id"
              value={licenseFormData.licence_request_id}
              InputProps={{
                readOnly: true,
              }}
            />

            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <Button onClick={handleCloseAddLicenseModal}>
                Annuler
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Ajouter
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>

      <Modal
        open={licenseRequestModalOpen}
        onClose={handleCloseLicenseRequestModal}
        aria-labelledby="license-request-modal-title"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}>
          {licenseRequestDetails && (
            <>
              <Typography id="license-request-modal-title" variant="h6" component="h2" gutterBottom>
                Détails de la demande de licence
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Informations de l'entreprise
                  </Typography>
                  <Typography variant="body1">
                    <strong>Nom:</strong> {licenseRequestDetails.company_name}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Email:</strong> {licenseRequestDetails.company_email}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Téléphone:</strong> {licenseRequestDetails.company_phone}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Adresse:</strong> {licenseRequestDetails.company_address}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Détails de la licence
                  </Typography>
                  <Typography variant="body1">
                    <strong>Type:</strong> {licenseRequestDetails.type}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Description:</strong> {licenseRequestDetails.description}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Prix:</strong> {licenseRequestDetails.price} €
                  </Typography>
                  <Typography variant="body1">
                    <strong>Durée:</strong> {licenseRequestDetails.duration_months} mois
                  </Typography>
                  <Typography variant="body1">
                    <strong>Statut:</strong> {licenseRequestDetails.status}
                  </Typography>
                  {licenseRequestDetails.rejection_reason && (
                    <Typography variant="body1">
                      <strong>Raison du rejet:</strong> {licenseRequestDetails.rejection_reason}
                    </Typography>
                  )}
                  <Typography variant="body1">
                    <strong>Date de demande:</strong>{" "}
                    {new Date(licenseRequestDetails.requested_at).toLocaleDateString()}
                  </Typography>
                </Grid>
              </Grid>
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button onClick={handleCloseLicenseRequestModal}>
                  Fermer
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>

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
    </div>
  );
};

export default EntrepriseManager;