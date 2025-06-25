import { useEffect, useState } from "react";
import { Box, Button, IconButton, Modal, TextField , useTheme} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { tokens } from "../theme";
import Header from "../components/Header";

const LanguagesManagement = () => {
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState({ id: null, nom: "" });
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    fetchLanguages();
  }, []);

  const fetchLanguages = async () => {
    try {
      const response = await axios.get("http://localhost:5000/languages");
      setLanguages(response.data);
    } catch (error) {
      console.error("Error fetching languages", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (currentLanguage.id) {
        await axios.patch(`http://localhost:5000/languages/${currentLanguage.id}`, {
          nom: currentLanguage.nom,
        });
      } else {
        await axios.post("http://localhost:5000/languages", {
          nom: currentLanguage.nom,
        });
      }
      setOpen(false);
      fetchLanguages();
    } catch (error) {
      console.error("Error saving language", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/languages/${id}`);
      fetchLanguages();
    } catch (error) {
      console.error("Error deleting language", error);
    }
  };

  const columns = [
    { field: "nom", headerName: "Nom", flex: 2 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <>
          <IconButton
            onClick={() => {
              setCurrentLanguage({ id: params.row._id, nom: params.row.nom });
              setOpen(true);
            }}
          > 
            <EditIcon  style={{ cursor: "pointer" }}/>
          </IconButton>
          <IconButton color="secondary" onClick={() => handleDelete(params.row._id)}>
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Box m="20px">
     <Header title="LANGUAGES" subtitle="Managing the Languages" />

      <Button variant="contained" color="warning" onClick={() => { setCurrentLanguage({ id: null, nom: "" }); setOpen(true); }}>
        Ajouter une Language
      </Button>

      <Box 
        m="15px 0 0 0"
        height="75vh"
         sx={{
            "& .MuiDataGrid-root": {
              border: "none",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "none",
            },
            "& .name-column--cell": {
              color: colors.greenAccent[300],
            },
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
          rows={languages}
          columns={columns}
          getRowId={(row) => row._id}
          loading={loading}
          components={{ Toolbar: GridToolbar }}
          languageSize={5}
        />
      </Box>

      {/* Modal pour ajouter/modifier une language */}
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
            value={currentLanguage.nom}
            onChange={(e) => setCurrentLanguage({ ...currentLanguage, nom: e.target.value })}
            placeholder="Nom de la language"
          />
          <Box mt={2} display="flex" justifyContent="space-between">
            <Button onClick={() => setOpen(false)} color="secondary">Annuler</Button>
            <Button onClick={handleSave} color="primary">{currentLanguage.id ? "Modifier" : "Créer"}</Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default LanguagesManagement;
