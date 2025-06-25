// import { useEffect, useState } from "react";
// import { Box, Button, IconButton, Modal, TextField , useTheme} from "@mui/material";
// import { DataGrid, GridToolbar } from "@mui/x-data-grid";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import axios from "axios";
// import { tokens } from "../theme";
// import Header from "../components/Header";

// const SlidesManagement = () => {
//   const [slides, setSlides] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [open, setOpen] = useState(false);
//   const [currentSlide, setCurrentSlide] = useState({ id: null, titre: "", description: "", image: ""});
//   const theme = useTheme();
//   const colors = tokens(theme.palette.mode);


//   useEffect(() => {
//     fetchSlides();
//   }, []);

//   const fetchSlides = async () => {
//     try {
//       const response = await axios.get("http://localhost:5000/slides");
//       setSlides(response.data);
//     } catch (error) {
//       console.error("Error fetching slides", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSave = async () => {
//     try {
//       if (currentSlide.id) {
//         await axios.patch(`http://localhost:5000/slides/${currentSlide.id}`, {
//           titre: currentSlide.titre,
//           description: currentSlide.description,
//           image: currentSlide.image,
//         });
//       } else {
//         await axios.post("http://localhost:5000/slides", {
//             titre: currentSlide.titre,
//             description: currentSlide.description,
//             image: currentSlide.image,
//         });
//       }
//       setOpen(false);
//       fetchSlides();
//     } catch (error) {
//       console.error("Error saving slide", error);
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       await axios.delete(`http://localhost:5000/slides/${id}`);
//       fetchSlides();
//     } catch (error) {
//       console.error("Error deleting slide", error);
//     }
//   };

//   const columns = [
//     { field: "titre", headerName: "Titre", flex: 2 },
//     { field: "description", headerName: "Description", flex: 2 },
//     { field: "image", headerName: "Image", flex: 2 },
//     {
//       field: "actions",
//       headerName: "Actions",
//       flex: 1,
//       renderCell: (params) => (
//         <>
//           <IconButton
//             onClick={() => {
//               setCurrentSlide({ id: params.row._id, titre: params.row.titre, image: params.row.image, description: params.row.description});
//               setOpen(true);
//             }}
//           > 
//             <EditIcon  style={{ cursor: "pointer" }}/>
//           </IconButton>
//           <IconButton color="secondary" onClick={() => handleDelete(params.row._id)}>
//             <DeleteIcon />
//           </IconButton>
//         </>
//       ),
//     },
//   ];

//   return (
//     <Box m="20px">
//      <Header title="SLIDES" subtitle="Managing the Slides" />

//       <Button variant="contained" color="warning" onClick={() => { setCurrentSlide({ id: null, titre: "", description: "", image: ""}); setOpen(true); }}>
//         Ajouter une Slide
//       </Button>

//       <Box 
//         m="15px 0 0 0"
//         height="75vh"
//          sx={{
//             "& .MuiDataGrid-root": {
//               border: "none",
//             },
//             "& .MuiDataGrid-cell": {
//               borderBottom: "none",
//             },
//             "& .name-column--cell": {
//               color: colors.greenAccent[300],
//             },
//             "& .MuiDataGrid-columnHeaders": {
//               backgroundColor: colors.blueAccent[700],
//               borderBottom: "none",
//             },
//             "& .MuiDataGrid-virtualScroller": {
//               backgroundColor: colors.primary[400],
//             },
//             "& .MuiDataGrid-footerContainer": {
//               borderTop: "none",
//               backgroundColor: colors.blueAccent[700],
//             },
//             "& .MuiCheckbox-root": {
//               color: `${colors.greenAccent[200]} !important`,
//             },
//             "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
//                     color: `${colors.grey[100]} !important`,
//                   },
//           }}
//       >
//         <DataGrid
//           rows={slides}
//           columns={columns}
//           getRowId={(row) => row._id}
//           loading={loading}
//           components={{ Toolbar: GridToolbar }}
//           slideSize={5}
//         />
//       </Box>

//       {/* Modal pour ajouter/modifier une slide */}
//       <Modal open={open} onClose={() => setOpen(false)}>
//         <Box
//           sx={{
//             position: "absolute",
//             top: "50%",
//             left: "50%",
//             transform: "translate(-50%, -50%)",
//             width: 400,
//             bgcolor: "background.paper",
//             p: 4,
//             boxShadow: 24,
//             borderRadius: 2,
//           }}
//         >
//           <TextField
//             fullWidth
//             margin="dense"
//             value={currentSlide.titre}
//             onChange={(e) => setCurrentSlide({ ...currentSlide, titre: e.target.value })}
//             placeholder="Titre de la slide"
//           />
//           <TextField
//             fullWidth
//             margin="dense"
//             value={currentSlide.description}
//             onChange={(e) => setCurrentSlide({ ...currentSlide, description: e.target.value })}
//             placeholder="description de la slide"
//           />
//           <TextField
//             fullWidth
//             margin="dense"
//             value={currentSlide.image}
//             onChange={(e) => setCurrentSlide({ ...currentSlide, image: e.target.value })}
//             placeholder="image de la slide"
//           />
//           <Box mt={2} display="flex" justifyContent="space-between">
//             <Button onClick={() => setOpen(false)} color="secondary">Annuler</Button>
//             <Button onClick={handleSave} color="primary">{currentSlide.id ? "Modifier" : "Créer"}</Button>
//           </Box>
//         </Box>
//       </Modal>
//     </Box>
//   );
// };

// export default SlidesManagement;


import { useEffect, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Modal,
  TextField,
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

const SlidesManagement = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [imageSelected, setImageSelected] = useState(null);
  const [userEntreprise, setUserEntreprise] = useState(null);
  const [currentSlide, setCurrentSlide] = useState({
    _id: null,
    titre: "",
    description: "",
    image: "",
    entreprise: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [slideToDelete, setSlideToDelete] = useState(null);
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
      setCurrentSlide((prev) => ({
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

  // Récupérer les slides associées à l'entreprise de l'utilisateur connecté
  const fetchSlides = async () => {
    if (!token || !userId || !userEntreprise) {
      console.error("Token, User ID, or User Entreprise is missing");
      setSnackbar({
        open: true,
        message: "Données manquantes pour récupérer les slides.",
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
        `http://localhost:5000/slides/entreprise/${userEntreprise}/slides`,
        config
      );
      setSlides(response.data);
    } catch (error) {
      console.error("Error fetching slides by entreprise:", error);
      setSnackbar({
        open: true,
        message: "Erreur lors de la récupération des slides.",
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

  // Appeler fetchSlides une fois que userEntreprise est défini
  useEffect(() => {
    if (userEntreprise) {
      fetchSlides();
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
      setCurrentSlide((prev) => ({
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

      if (currentSlide._id) {
        await axios.patch(
          `http://localhost:5000/slides/${currentSlide._id}`,
          currentSlide,
          config
        );
        setSnackbar({
          open: true,
          message: "Slide modifiée avec succès !",
          severity: "success",
        });
      } else {
        if (!currentSlide.entreprise) {
          throw new Error("L'entreprise de la slide n'est pas définie.");
        }
        await axios.post(
          "http://localhost:5000/slides",
          currentSlide,
          config
        );
        setSnackbar({
          open: true,
          message: "Slide créée avec succès !",
          severity: "success",
        });
      }
      setOpen(false);
      setImageSelected(null);
      fetchSlides();
    } catch (error) {
      console.error("Error saving slide", error);
      setSnackbar({
        open: true,
        message: error.message || "Erreur lors de la sauvegarde de la slide.",
        severity: "error",
      });
    }
  };

  const handleOpenDeleteDialog = (id) => {
    setSlideToDelete(id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSlideToDelete(null);
  };

  const handleConfirmDelete = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      await axios.delete(
        `http://localhost:5000/slides/${slideToDelete}`,
        config
      );
      setSnackbar({
        open: true,
        message: "Slide supprimée avec succès !",
        severity: "success",
      });
      fetchSlides();
    } catch (error) {
      console.error("Error deleting slide", error);
      setSnackbar({
        open: true,
        message: "Erreur lors de la suppression de la slide.",
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
          alt={params.row.titre || "Image de la slide"}
          style={{ width: "50px", height: "50px", objectFit: "cover" }}
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/50";
          }}
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <>
          <IconButton
            onClick={() => {
              setCurrentSlide({ ...params.row });
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
      <Header title="SLIDES" subtitle="Managing the Slides" />

      <Button
        variant="contained"
        color="warning"
        onClick={() => {
          setCurrentSlide({
            _id: null,
            titre: "",
            description: "",
            image: "",
            entreprise: userEntreprise || "",
          });
          setImageSelected(null);
          setOpen(true);
        }}
        disabled={!userEntreprise}
      >
        Ajouter une Slide
      </Button>

      <Box
        m="15px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { borderBottom: "none" },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          rows={slides}
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
            value={currentSlide.titre}
            onChange={(e) =>
              setCurrentSlide({ ...currentSlide, titre: e.target.value })
            }
            placeholder="Titre de la slide"
          />
          <TextField
            fullWidth
            margin="dense"
            value={currentSlide.description}
            onChange={(e) =>
              setCurrentSlide({ ...currentSlide, description: e.target.value })
            }
            placeholder="Description de la slide"
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
            {currentSlide.image && (
              <Box mt={2}>
                <img
                  src={currentSlide.image}
                  alt="Aperçu de l'image"
                  style={{
                    width: "100%",
                    maxHeight: "150px",
                    objectFit: "cover",
                  }}
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/150";
                  }}
                />
              </Box>
            )}
          </Box>
          <Box mt={2} display="flex" justifyContent="space-between">
            <Button onClick={() => setOpen(false)} color="secondary">
              Annuler
            </Button>
            <Button onClick={handleSave} color="primary">
              {currentSlide._id ? "Modifier" : "Créer"}
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
        <DialogTitle id="alert-dialog-title">
          {"Confirmer la suppression"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Êtes-vous sûr de vouloir supprimer cette slide ? Cette action est irréversible.
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
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SlidesManagement;