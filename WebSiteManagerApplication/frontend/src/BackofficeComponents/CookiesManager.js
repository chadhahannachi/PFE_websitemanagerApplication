import { useEffect, useState } from "react";
import { Box, Button, IconButton, Modal, TextField , useTheme} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { tokens } from "../theme";
import Header from "../components/Header";

const CookiesManagement = () => {
  const [cookies, setCookies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [currentCookie, setCurrentCookie] = useState({ id: null, preferences: "", dateaccept: "", dureedevie: "", typecookies: ""});
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

//   preferences: string;
//   dateaccept: string;
//   dureedevie: string;
//   typecookies: string;

  useEffect(() => {
    fetchCookies();
  }, []);

  const fetchCookies = async () => {
    try {
      const response = await axios.get("http://localhost:5000/cookies");
      setCookies(response.data);
    } catch (error) {
      console.error("Error fetching cookies", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (currentCookie.id) {
        await axios.patch(`http://localhost:5000/cookies/${currentCookie.id}`, {
          preferences: currentCookie.preferences,
          dateaccept: currentCookie.dateaccept,
          dureedevie: currentCookie.dureedevie,
          typecookies: currentCookie.typecookies,
        });
      } else {
        await axios.post("http://localhost:5000/cookies", {
            preferences: currentCookie.preferences,
            dateaccept: currentCookie.dateaccept,
            dureedevie: currentCookie.dureedevie,
            typecookies: currentCookie.typecookies,
        });
      }
      setOpen(false);
      fetchCookies();
    } catch (error) {
      console.error("Error saving cookie", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/cookies/${id}`);
      fetchCookies();
    } catch (error) {
      console.error("Error deleting cookie", error);
    }
  };

  const columns = [
    { field: "preferences", headerName: "Preferences", flex: 2 },
    { field: "dateaccept", headerName: "Dateaccept", flex: 2 },
    { field: "dureedevie", headerName: "Dureedevie", flex: 2 },
    { field: "typecookies", headerName: "Typecookies", flex: 2 },
    
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <>
          <IconButton
            onClick={() => {
              setCurrentCookie({ id: params.row._id, preferences: params.row.preferences, dureedevie: params.row.dureedevie, dateaccept: params.row.dateaccept, typecookies: params.row.typecookies});
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
     <Header title="COOKIES" subtitle="Managing the Cookies" />

      <Button variant="contained" color="warning" onClick={() => { setCurrentCookie({ id: null, preferences: "", dateaccept: "", dureedevie: "", typecookies: ""}); setOpen(true); }}>
        Ajouter une Cookie
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
          rows={cookies}
          columns={columns}
          getRowId={(row) => row._id}
          loading={loading}
          components={{ Toolbar: GridToolbar }}
          cookieSize={5}
        />
      </Box>

      {/* Modal pour ajouter/modifier une cookie */}
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
            value={currentCookie.preferences}
            onChange={(e) => setCurrentCookie({ ...currentCookie, preferences: e.target.value })}
            placeholder="Preferences de la cookie"
          />
          <TextField
            fullWidth
            margin="dense"
            value={currentCookie.dateaccept}
            onChange={(e) => setCurrentCookie({ ...currentCookie, dateaccept: e.target.value })}
            placeholder="dateaccept de la cookie"
          />
          <TextField
            fullWidth
            margin="dense"
            value={currentCookie.dureedevie}
            onChange={(e) => setCurrentCookie({ ...currentCookie, dureedevie: e.target.value })}
            placeholder="dureedevie de la cookie"
          />
          <TextField
            fullWidth
            margin="dense"
            value={currentCookie.typecookies}
            onChange={(e) => setCurrentCookie({ ...currentCookie, typecookies: e.target.value })}
            placeholder="typecookies de la cookie"
          />
          
          <Box mt={2} display="flex" justifyContent="space-between">
            <Button onClick={() => setOpen(false)} color="secondary">Annuler</Button>
            <Button onClick={handleSave} color="primary">{currentCookie.id ? "Modifier" : "Créer"}</Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default CookiesManagement;
