import { useEffect, useState } from "react";
import { Box, Button, IconButton, Modal, TextField , useTheme} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { tokens } from "../theme";
import Header from "../components/Header";

const KeywordsManagement = () => {
  const [keywords, setKeywords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [currentKeyword, setCurrentKeyword] = useState({ id: null, keyword: "" });
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    fetchKeywords();
  }, []);

  const fetchKeywords = async () => {
    try {
      const response = await axios.get("http://localhost:5000/keywords");
      setKeywords(response.data);
    } catch (error) {
      console.error("Error fetching keywords", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (currentKeyword.id) {
        await axios.patch(`http://localhost:5000/keywords/${currentKeyword.id}`, {
          keyword: currentKeyword.keyword,
        });
      } else {
        await axios.post("http://localhost:5000/keywords", {
          keyword: currentKeyword.keyword,
        });
      }
      setOpen(false);
      fetchKeywords();
    } catch (error) {
      console.error("Error saving keyword", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/keywords/${id}`);
      fetchKeywords();
    } catch (error) {
      console.error("Error deleting keyword", error);
    }
  };

  const columns = [
    { field: "keyword", headerName: "Keyword", flex: 2 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <>
          <IconButton
            onClick={() => {
              setCurrentKeyword({ id: params.row._id, keyword: params.row.keyword });
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
     <Header title="KEYWORDS" subtitle="Managing the Keywords" />

      <Button variant="contained" color="warning" onClick={() => { setCurrentKeyword({ id: null, keyword: "" }); setOpen(true); }}>
        Ajouter une Keyword
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
          rows={keywords}
          columns={columns}
          getRowId={(row) => row._id}
          loading={loading}
          components={{ Toolbar: GridToolbar }}
          keywordSize={5}
        />
      </Box>

      {/* Modal pour ajouter/modifier une keyword */}
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
            value={currentKeyword.keyword}
            onChange={(e) => setCurrentKeyword({ ...currentKeyword, keyword: e.target.value })}
            placeholder="Keyword de la keyword"
          />
          <Box mt={2} display="flex" justifyContent="space-between">
            <Button onClick={() => setOpen(false)} color="secondary">Annuler</Button>
            <Button onClick={handleSave} color="primary">{currentKeyword.id ? "Modifier" : "Créer"}</Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default KeywordsManagement;
