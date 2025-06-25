// import { useEffect, useState } from "react";
// import {
//   Box,
//   Button,
//   IconButton,
//   Modal,
//   TextField,
//   Checkbox,
//   useTheme,
//   Snackbar,
//   Alert,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogContentText,
//   DialogActions,
// } from "@mui/material";
// import { DataGrid, GridToolbar } from "@mui/x-data-grid";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import axios from "axios";
// import { tokens } from "../theme";
// import Header from "../components/Header";

// const FAQsManagement = () => {
//   const [faqs, setFAQs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [open, setOpen] = useState(false);
//   const [currentFAQ, setCurrentFAQ] = useState({
//     _id: null,
//     question: "",
//     reponse: "",
//     datePublication: "",
//     isPublished: false,
//   });
//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: "",
//     severity: "success",
//   });
//   const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
//   const [faqToDelete, setFaqToDelete] = useState(null);
//   const theme = useTheme();
//   const colors = tokens(theme.palette.mode);

//   useEffect(() => {
//     fetchFAQs();
//   }, []);

//   const fetchFAQs = async () => {
//     try {
//       const response = await axios.get("http://localhost:5000/contenus/FAQ");
//       setFAQs(response.data);
//     } catch (error) {
//       console.error("Error fetching faqs", error);
//       setSnackbar({
//         open: true,
//         message: "Erreur lors de la récupération des FAQs.",
//         severity: "error",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCloseSnackbar = (event, reason) => {
//     if (reason === "clickaway") {
//       return;
//     }
//     setSnackbar((prev) => ({ ...prev, open: false }));
//   };

//   const handleSave = async () => {
//     try {
//       if (currentFAQ._id) {
//         await axios.patch(`http://localhost:5000/contenus/FAQ/${currentFAQ._id}`, currentFAQ);
//         setSnackbar({
//           open: true,
//           message: "FAQ modifiée avec succès !",
//           severity: "success",
//         });
//       } else {
//         await axios.post("http://localhost:5000/contenus/FAQ", currentFAQ);
//         setSnackbar({
//           open: true,
//           message: "FAQ créée avec succès !",
//           severity: "success",
//         });
//       }
//       setOpen(false);
//       fetchFAQs();
//     } catch (error) {
//       console.error("Error saving faq", error);
//       setSnackbar({
//         open: true,
//         message: "Erreur lors de la sauvegarde de la FAQ.",
//         severity: "error",
//       });
//     }
//   };

//   const handleOpenDeleteDialog = (id) => {
//     setFaqToDelete(id);
//     setOpenDeleteDialog(true);
//   };

//   const handleCloseDeleteDialog = () => {
//     setOpenDeleteDialog(false);
//     setFaqToDelete(null);
//   };

//   const handleConfirmDelete = async () => {
//     try {
//       await axios.delete(`http://localhost:5000/contenus/FAQ/${faqToDelete}`);
//       setSnackbar({
//         open: true,
//         message: "FAQ supprimée avec succès !",
//         severity: "success",
//       });
//       fetchFAQs();
//     } catch (error) {
//       console.error("Error deleting faq", error);
//       setSnackbar({
//         open: true,
//         message: "Erreur lors de la suppression de la FAQ.",
//         severity: "error",
//       });
//     } finally {
//       handleCloseDeleteDialog();
//     }
//   };

//   const columns = [
//     { field: "question", headerName: "Question", flex: 2 },
//     { field: "reponse", headerName: "Réponse", flex: 3 },
//     { field: "datePublication", headerName: "Date de Publication", flex: 2 },
//     { field: "isPublished", headerName: "Publié", flex: 1, type: "boolean" },
//     {
//       field: "actions",
//       headerName: "Actions",
//       flex: 1,
//       renderCell: (params) => (
//         <>
//           <IconButton
//             onClick={() => {
//               setCurrentFAQ({ ...params.row });
//               setOpen(true);
//             }}
//           >
//             <EditIcon style={{ cursor: "pointer" }} />
//           </IconButton>
//           <IconButton
//             color="secondary"
//             onClick={() => handleOpenDeleteDialog(params.row._id)}
//           >
//             <DeleteIcon />
//           </IconButton>
//         </>
//       ),
//     },
//   ];

//   return (
//     <Box m="20px">
//       <Header title="FAQS" subtitle="Gestion des FAQs" />

//       <Button
//         variant="contained"
//         color="warning"
//         onClick={() => {
//           setCurrentFAQ({
//             _id: null,
//             question: "",
//             reponse: "",
//             datePublication: "",
//             isPublished: false,
//           });
//           setOpen(true);
//         }}
//       >
//         Ajouter une FAQ
//       </Button>

//       <Box
//         m="15px 0 0 0"
//         height="75vh"
//         sx={{
//           "& .MuiDataGrid-root": { border: "none" },
//           "& .MuiDataGrid-cell": { borderBottom: "none" },
//           "& .MuiDataGrid-columnHeaders": {
//             backgroundColor: colors.blueAccent[700],
//             borderBottom: "none",
//           },
//           "& .MuiDataGrid-virtualScroller": {
//             backgroundColor: colors.primary[400],
//           },
//           "& .MuiDataGrid-footerContainer": {
//             borderTop: "none",
//             backgroundColor: colors.blueAccent[700],
//           },
//           "& .MuiCheckbox-root": {
//             color: `${colors.greenAccent[200]} !important`,
//           },
//         }}
//       >
//         <DataGrid
//           rows={faqs}
//           columns={columns}
//           getRowId={(row) => row._id}
//           loading={loading}
//           components={{ Toolbar: GridToolbar }}
//           pageSize={5}
//         />
//       </Box>

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
//             value={currentFAQ.question}
//             onChange={(e) =>
//               setCurrentFAQ({ ...currentFAQ, question: e.target.value })
//             }
//             placeholder="Question de la FAQ"
//           />
//           <TextField
//             fullWidth
//             margin="dense"
//             value={currentFAQ.reponse}
//             onChange={(e) =>
//               setCurrentFAQ({ ...currentFAQ, reponse: e.target.value })
//             }
//             placeholder="Réponse de la FAQ"
//           />
//           <TextField
//             fullWidth
//             margin="dense"
//             type="date"
//             value={currentFAQ.datePublication}
//             onChange={(e) =>
//               setCurrentFAQ({ ...currentFAQ, datePublication: e.target.value })
//             }
//             placeholder="Date de publication"
//           />
//           <Box display="flex" alignItems="center" mt={2}>
//             <Checkbox
//               checked={currentFAQ.isPublished}
//               onChange={(e) =>
//                 setCurrentFAQ({ ...currentFAQ, isPublished: e.target.checked })
//               }
//             />
//             <span>Publié</span>
//           </Box>
//           <Box mt={2} display="flex" justifyContent="space-between">
//             <Button onClick={() => setOpen(false)} color="secondary">
//               Annuler
//             </Button>
//             <Button onClick={handleSave} color="primary">
//               {currentFAQ._id ? "Modifier" : "Créer"}
//             </Button>
//           </Box>
//         </Box>
//       </Modal>

//       <Dialog
//         open={openDeleteDialog}
//         onClose={handleCloseDeleteDialog}
//         aria-labelledby="alert-dialog-title"
//         aria-describedby="alert-dialog-description"
//       >
//         <DialogTitle id="alert-dialog-title">
//           {"Confirmer la suppression"}
//         </DialogTitle>
//         <DialogContent>
//           <DialogContentText id="alert-dialog-description">
//             Êtes-vous sûr de vouloir supprimer cette FAQ ? Cette action est
//             irréversible.
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseDeleteDialog} color="primary">
//             Annuler
//           </Button>
//           <Button onClick={handleConfirmDelete} color="secondary" autoFocus>
//             Supprimer
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={6000}
//         onClose={handleCloseSnackbar}
//         anchorOrigin={{ vertical: "top", horizontal: "right" }}
//       >
//         <Alert
//           onClose={handleCloseSnackbar}
//           severity={snackbar.severity}
//           sx={{ width: "100%" }}
//         >
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// };

// export default FAQsManagement;


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

const FAQsManagement = () => {
  const [faqs, setFAQs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [userEntreprise, setUserEntreprise] = useState(null);
  const [currentFAQ, setCurrentFAQ] = useState({
    _id: null,
    question: "",
    reponse: "",
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
  const [faqToDelete, setFaqToDelete] = useState(null);
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
      setCurrentFAQ((prev) => ({
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

  // Récupérer les FAQs associées à l'entreprise de l'utilisateur connecté
  const fetchFAQs = async () => {
    if (!token || !userId || !userEntreprise) {
      console.error("Token, User ID, or User Entreprise is missing");
      setSnackbar({
        open: true,
        message: "Données manquantes pour récupérer les FAQs.",
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
        `http://localhost:5000/contenus/FAQ/entreprise/${userEntreprise}`,
        config
      );
      setFAQs(response.data);
    } catch (error) {
      console.error("Error fetching faqs by entreprise:", error);
      setSnackbar({
        open: true,
        message: "Erreur lors de la récupération des FAQs.",
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

  // Appeler fetchFAQs une fois que userEntreprise est défini
  useEffect(() => {
    if (userEntreprise) {
      fetchFAQs();
    }
  }, [userEntreprise]);

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

      if (currentFAQ._id) {
        await axios.patch(
          `http://localhost:5000/contenus/FAQ/${currentFAQ._id}`,
          currentFAQ,
          config
        );
        setSnackbar({
          open: true,
          message: "FAQ modifiée avec succès !",
          severity: "success",
        });
      } else {
        if (!currentFAQ.entreprise) {
          throw new Error("L'entreprise de la FAQ n'est pas définie.");
        }
        await axios.post(
          "http://localhost:5000/contenus/FAQ",
          currentFAQ,
          config
        );
        setSnackbar({
          open: true,
          message: "FAQ créée avec succès !",
          severity: "success",
        });
      }
      setOpen(false);
      fetchFAQs();
    } catch (error) {
      console.error("Error saving faq", error);
      setSnackbar({
        open: true,
        message: error.message || "Erreur lors de la sauvegarde de la FAQ.",
        severity: "error",
      });
    }
  };

  const handleOpenDeleteDialog = (id) => {
    setFaqToDelete(id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setFaqToDelete(null);
  };

  const handleConfirmDelete = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      await axios.delete(
        `http://localhost:5000/contenus/FAQ/${faqToDelete}`,
        config
      );
      setSnackbar({
        open: true,
        message: "FAQ supprimée avec succès !",
        severity: "success",
      });
      fetchFAQs();
    } catch (error) {
      console.error("Error deleting faq", error);
      setSnackbar({
        open: true,
        message: "Erreur lors de la suppression de la FAQ.",
        severity: "error",
      });
    } finally {
      handleCloseDeleteDialog();
    }
  };

  const columns = [
    { field: "question", headerName: "Question", flex: 2 },
    { field: "reponse", headerName: "Réponse", flex: 3 },
    { field: "datePublication", headerName: "Date de Publication", flex: 2 },
    { field: "isPublished", headerName: "Publié", flex: 1, type: "boolean" },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <>
          <IconButton
            onClick={() => {
              setCurrentFAQ({ ...params.row });
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
      <Header title="FAQS" subtitle="Gérer les FAQs" />

      <Button
        variant="contained"
        color="warning"
        onClick={() => {
          setCurrentFAQ({
            _id: null,
            question: "",
            reponse: "",
            datePublication: "",
            isPublished: false,
            entreprise: userEntreprise || "",
          });
          setOpen(true);
        }}
        disabled={!userEntreprise}
      >
        Ajouter une FAQ
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
          rows={faqs}
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
            value={currentFAQ.question}
            onChange={(e) => setCurrentFAQ({ ...currentFAQ, question: e.target.value })}
            placeholder="Question"
          />
          <TextField
            fullWidth
            margin="dense"
            value={currentFAQ.reponse}
            onChange={(e) => setCurrentFAQ({ ...currentFAQ, reponse: e.target.value })}
            placeholder="Réponse"
          />
          <TextField
            fullWidth
            margin="dense"
            type="date"
            value={currentFAQ.datePublication}
            onChange={(e) => setCurrentFAQ({ ...currentFAQ, datePublication: e.target.value })}
            placeholder="Date de publication"
          />
          <Box display="flex" alignItems="center" mt={2}>
            <Checkbox
              checked={currentFAQ.isPublished}
              onChange={(e) => setCurrentFAQ({ ...currentFAQ, isPublished: e.target.checked })}
            />
            <span>Publié</span>
          </Box>
          <Box mt={2} display="flex" justifyContent="space-between">
            <Button onClick={() => setOpen(false)} color="secondary">Annuler</Button>
            <Button onClick={handleSave} color="primary">
              {currentFAQ._id ? "Modifier" : "Créer"}
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
            Êtes-vous sûr de vouloir supprimer cette FAQ ? Cette action est irréversible.
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

export default FAQsManagement;