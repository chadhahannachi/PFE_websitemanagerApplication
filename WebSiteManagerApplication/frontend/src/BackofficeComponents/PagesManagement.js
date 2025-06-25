import { useEffect, useState } from "react";
import { Box, Button, IconButton, Modal, TextField , useTheme} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { tokens } from "../theme";
import Header from "../components/Header";

const PagesManagement = () => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState({ id: null, titre: "" });
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const response = await axios.get("http://localhost:5000/pages");
      setPages(response.data);
    } catch (error) {
      console.error("Error fetching pages", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (currentPage.id) {
        await axios.patch(`http://localhost:5000/pages/${currentPage.id}`, {
          titre: currentPage.titre,
        });
      } else {
        await axios.post("http://localhost:5000/pages", {
          titre: currentPage.titre,
        });
      }
      setOpen(false);
      fetchPages();
    } catch (error) {
      console.error("Error saving page", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/pages/${id}`);
      fetchPages();
    } catch (error) {
      console.error("Error deleting page", error);
    }
  };

  const columns = [
    { field: "titre", headerName: "Titre", flex: 2 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <>
          <IconButton
            onClick={() => {
              setCurrentPage({ id: params.row._id, titre: params.row.titre });
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
     <Header title="PAGES" subtitle="Managing the Pages" />

      <Button variant="contained" color="warning" onClick={() => { setCurrentPage({ id: null, titre: "" }); setOpen(true); }}>
        Ajouter une Page
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
          rows={pages}
          columns={columns}
          getRowId={(row) => row._id}
          loading={loading}
          components={{ Toolbar: GridToolbar }}
          pageSize={5}
        />
      </Box>

      {/* Modal pour ajouter/modifier une page */}
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
            value={currentPage.titre}
            onChange={(e) => setCurrentPage({ ...currentPage, titre: e.target.value })}
            placeholder="Titre de la page"
          />
          <Box mt={2} display="flex" justifyContent="space-between">
            <Button onClick={() => setOpen(false)} color="secondary">Annuler</Button>
            <Button onClick={handleSave} color="primary">{currentPage.id ? "Modifier" : "Créer"}</Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default PagesManagement;
