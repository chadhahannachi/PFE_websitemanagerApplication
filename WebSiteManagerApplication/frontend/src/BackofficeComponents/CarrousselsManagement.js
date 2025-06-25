import { useEffect, useState } from "react";
import { Box, Button, IconButton, Modal, TextField , useTheme} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { tokens } from "../theme";
import Header from "../components/Header";

const CarrousselsManagement = () => {
  const [carroussels, setCarroussels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [currentCarroussel, setCurrentCarroussel] = useState({ id: null, titre: "", police: "", code: "", position: "", url: "" });
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

//   titre: string;
//   police: string;
//   code: string;
//   position: string;

  useEffect(() => {
    fetchCarroussels();
  }, []);

  const fetchCarroussels = async () => {
    try {
      const response = await axios.get("http://localhost:5000/carroussels");
      setCarroussels(response.data);
    } catch (error) {
      console.error("Error fetching carroussels", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (currentCarroussel.id) {
        await axios.patch(`http://localhost:5000/carroussels/${currentCarroussel.id}`, {
          titre: currentCarroussel.titre,
          police: currentCarroussel.police,
          code: currentCarroussel.code,
          position: currentCarroussel.position,
          url: currentCarroussel.url,
        });
      } else {
        await axios.post("http://localhost:5000/carroussels", {
            titre: currentCarroussel.titre,
            police: currentCarroussel.police,
            code: currentCarroussel.code,
            position: currentCarroussel.position,
            url: currentCarroussel.url,
        });
      }
      setOpen(false);
      fetchCarroussels();
    } catch (error) {
      console.error("Error saving carroussel", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/carroussels/${id}`);
      fetchCarroussels();
    } catch (error) {
      console.error("Error deleting carroussel", error);
    }
  };

  const columns = [
    { field: "titre", headerName: "Titre", flex: 2 },
    { field: "police", headerName: "Police", flex: 2 },
    { field: "code", headerName: "Code", flex: 2 },
    { field: "position", headerName: "Position", flex: 2 },
    { field: "url", headerName: "url", flex: 2 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <>
          <IconButton
            onClick={() => {
              setCurrentCarroussel({ id: params.row._id, titre: params.row.titre, code: params.row.code, police: params.row.police, position: params.row.position, url: params.row.url });
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
     <Header title="CARROUSSELS" subtitle="Managing the Carroussels" />

      <Button variant="contained" color="warning" onClick={() => { setCurrentCarroussel({ id: null, titre: "", police: "", code: "", position: "", url: "" }); setOpen(true); }}>
        Ajouter une Carroussel
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
          rows={carroussels}
          columns={columns}
          getRowId={(row) => row._id}
          loading={loading}
          components={{ Toolbar: GridToolbar }}
          carrousselSize={5}
        />
      </Box>

      {/* Modal pour ajouter/modifier une carroussel */}
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
            value={currentCarroussel.titre}
            onChange={(e) => setCurrentCarroussel({ ...currentCarroussel, titre: e.target.value })}
            placeholder="Titre de la carroussel"
          />
          <TextField
            fullWidth
            margin="dense"
            value={currentCarroussel.police}
            onChange={(e) => setCurrentCarroussel({ ...currentCarroussel, police: e.target.value })}
            placeholder="police de la carroussel"
          />
          <TextField
            fullWidth
            margin="dense"
            value={currentCarroussel.code}
            onChange={(e) => setCurrentCarroussel({ ...currentCarroussel, code: e.target.value })}
            placeholder="code de la carroussel"
          />
          <TextField
            fullWidth
            margin="dense"
            value={currentCarroussel.position}
            onChange={(e) => setCurrentCarroussel({ ...currentCarroussel, position: e.target.value })}
            placeholder="position de la carroussel"
          />
          <TextField
            fullWidth
            margin="dense"
            value={currentCarroussel.url}
            onChange={(e) => setCurrentCarroussel({ ...currentCarroussel, url: e.target.value })}
            placeholder="url de la carroussel"
          />
          <Box mt={2} display="flex" justifyContent="space-between">
            <Button onClick={() => setOpen(false)} color="secondary">Annuler</Button>
            <Button onClick={handleSave} color="primary">{currentCarroussel.id ? "Modifier" : "Créer"}</Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default CarrousselsManagement;
