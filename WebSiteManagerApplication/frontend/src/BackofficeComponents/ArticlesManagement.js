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
import { tokens } from "../theme";
import Header from "../components/Header";

const ArticlesManagement = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [imageSelected, setImageSelected] = useState(null);
  const [currentArticle, setCurrentArticle] = useState({
    _id: null,
    titre: "",
    description: "",
    image: "",
    datePublication: "",
    isPublished: false,
    categorie: "",
    prix: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState(null);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await axios.get("http://localhost:5000/contenus/Article");
      setArticles(response.data);
    } catch (error) {
      console.error("Error fetching articles", error);
      setSnackbar({
        open: true,
        message: "Erreur lors de la récupération des articles.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

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
      setCurrentArticle((prev) => ({
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
      if (currentArticle._id) {
        await axios.patch(`http://localhost:5000/contenus/Article/${currentArticle._id}`, currentArticle);
        setSnackbar({
          open: true,
          message: "Article modifié avec succès !",
          severity: "success",
        });
      } else {
        await axios.post("http://localhost:5000/contenus/Article", currentArticle);
        setSnackbar({
          open: true,
          message: "Article créé avec succès !",
          severity: "success",
        });
      }
      setOpen(false);
      setImageSelected(null);
      fetchArticles();
    } catch (error) {
      console.error("Error saving article", error);
      setSnackbar({
        open: true,
        message: "Erreur lors de la sauvegarde de l'article.",
        severity: "error",
      });
    }
  };

  const handleOpenDeleteDialog = (id) => {
    setArticleToDelete(id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setArticleToDelete(null);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/contenus/Article/${articleToDelete}`);
      setSnackbar({
        open: true,
        message: "Article supprimé avec succès !",
        severity: "success",
      });
      fetchArticles();
    } catch (error) {
      console.error("Error deleting article", error);
      setSnackbar({
        open: true,
        message: "Erreur lors de la suppression de l'article.",
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
          alt={params.row.titre || "Image de l'article"}
          style={{ width: "50px", height: "50px", objectFit: "cover" }}
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/50";
          }}
        />
      ),
    },
    { field: "datePublication", headerName: "Date de Publication", flex: 2 },
    { field: "isPublished", headerName: "Publié", flex: 1, type: "boolean" },
    { field: "categorie", headerName: "Catégorie", flex: 2 },
    { field: "prix", headerName: "Prix", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <>
          <IconButton
            onClick={() => {
              setCurrentArticle({ ...params.row });
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
      <Header title="ARTICLES" subtitle="Gestion des Articles" />

      <Button
        variant="contained"
        color="warning"
        onClick={() => {
          setCurrentArticle({
            _id: null,
            titre: "",
            description: "",
            image: "",
            datePublication: "",
            isPublished: false,
            categorie: "",
            prix: "",
          });
          setImageSelected(null);
          setOpen(true);
        }}
      >
        Ajouter un Article
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
          rows={articles}
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
            value={currentArticle.titre}
            onChange={(e) => setCurrentArticle({ ...currentArticle, titre: e.target.value })}
            placeholder="Titre de l'article"
          />
          <TextField
            fullWidth
            margin="dense"
            value={currentArticle.description}
            onChange={(e) => setCurrentArticle({ ...currentArticle, description: e.target.value })}
            placeholder="Description de l'article"
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
            {currentArticle.image && (
              <Box mt={2}>
                <img
                  src={currentArticle.image}
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
            value={currentArticle.datePublication}
            onChange={(e) => setCurrentArticle({ ...currentArticle, datePublication: e.target.value })}
            placeholder="Date de publication"
          />
          <TextField
            fullWidth
            margin="dense"
            value={currentArticle.categorie}
            onChange={(e) => setCurrentArticle({ ...currentArticle, categorie: e.target.value })}
            placeholder="Catégorie"
          />
          <TextField
            fullWidth
            margin="dense"
            type="number"
            value={currentArticle.prix}
            onChange={(e) => setCurrentArticle({ ...currentArticle, prix: e.target.value })}
            placeholder="Prix"
          />
          <Box display="flex" alignItems="center" mt={2}>
            <Checkbox
              checked={currentArticle.isPublished}
              onChange={(e) => setCurrentArticle({ ...currentArticle, isPublished: e.target.checked })}
            />
            <span>Publié</span>
          </Box>
          <Box mt={2} display="flex" justifyContent="space-between">
            <Button onClick={() => setOpen(false)} color="secondary">Annuler</Button>
            <Button onClick={handleSave} color="primary">
              {currentArticle._id ? "Modifier" : "Créer"}
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
            Êtes-vous sûr de vouloir supprimer cet article ? Cette action est irréversible.
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

export default ArticlesManagement;