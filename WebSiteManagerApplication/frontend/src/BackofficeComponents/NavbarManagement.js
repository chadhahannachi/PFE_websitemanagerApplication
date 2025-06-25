import { useEffect, useState } from "react";
import { Box, Button, IconButton, Modal, TextField, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import { tokens } from "../theme";
import Header from "../components/Header";

const NavbarManagement = () => {
  const [navbars, setNavbars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [currentNavbar, setCurrentNavbar] = useState({
    id: null,
    titre: "",
    logo: "",
    menus: [{ text: "" }],
  });

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    fetchNavbars();
  }, []);

  const fetchNavbars = async () => {
    try {
      const response = await axios.get("http://localhost:5000/navbars");
      setNavbars(response.data);
    } catch (error) {
      console.error("Error fetching navbars", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (currentNavbar._id) {
        await axios.patch(`http://localhost:5000/navbars/${currentNavbar._id}`, currentNavbar);
      } else {
        await axios.post("http://localhost:5000/navbars", currentNavbar);
      }
      setOpen(false);
      fetchNavbars();
    } catch (error) {
      console.error("Error saving navbar", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/navbars/${id}`);
      fetchNavbars();
    } catch (error) {
      console.error("Error deleting navbar", error);
    }
  };

  const handleAddMenu = () => {
    setCurrentNavbar({ ...currentNavbar, menus: [...currentNavbar.menus, { text: "" }] });
  };

  const handleMenuChange = (index, value) => {
    const updatedMenus = [...currentNavbar.menus];
    updatedMenus[index].text = value;
    setCurrentNavbar({ ...currentNavbar, menus: updatedMenus });
  };

  const columns = [
    { field: "titre", headerName: "Titre", flex: 2 },
    { field: "logo", headerName: "Logo URL", flex: 2 },
    { field: "menus", headerName: "Menus", flex: 3, valueGetter: (params) => params.row.menus?.map(menu => menu.text).join(", ") || "No menus" },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => { setCurrentNavbar(params.row); setOpen(true); }}>
            <EditIcon style={{ cursor: "pointer" }} />
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
      <Header title="NAVBARS" subtitle="Managing the Navigation Bars" />

      <Button variant="contained" color="warning" onClick={() => {
        setCurrentNavbar({ id: null, titre: "", logo: "", menus: [{ text: "" }] });
        setOpen(true);
      }}>
        Ajouter un Navbar
      </Button>

      <Box m="15px 0 0 0" height="75vh" sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { borderBottom: "none" },
          "& .MuiDataGrid-columnHeaders": { backgroundColor: colors.blueAccent[700], borderBottom: "none" },
          "& .MuiDataGrid-virtualScroller": { backgroundColor: colors.primary[400] },
          "& .MuiDataGrid-footerContainer": { borderTop: "none", backgroundColor: colors.blueAccent[700] },
          "& .MuiCheckbox-root": { color: `${colors.greenAccent[200]} !important` },
        }}>
        <DataGrid
          rows={navbars}
          columns={columns}
          getRowId={(row) => row._id}
          loading={loading}
          components={{ Toolbar: GridToolbar }}
          pageSize={5}
        />
      </Box>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 400, bgcolor: "background.paper", p: 4, boxShadow: 24, borderRadius: 2 }}>
          <TextField fullWidth margin="dense" value={currentNavbar.titre} onChange={(e) => setCurrentNavbar({ ...currentNavbar, titre: e.target.value })} placeholder="Titre de la navbar" />
          <TextField fullWidth margin="dense" value={currentNavbar.logo} onChange={(e) => setCurrentNavbar({ ...currentNavbar, logo: e.target.value })} placeholder="URL du logo" />
          {currentNavbar.menus.map((menu, index) => (
            <TextField
              key={index}
              fullWidth
              margin="dense"
              value={menu.text}
              onChange={(e) => handleMenuChange(index, e.target.value)}
              placeholder={`Menu ${index + 1}`}
            />
          ))}
          <Button startIcon={<AddIcon />} onClick={handleAddMenu} fullWidth sx={{ mt: 1 }}>Ajouter un menu</Button>
          <Button variant="contained" color="primary" onClick={handleSave} fullWidth sx={{ mt: 2 }}>Enregistrer</Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default NavbarManagement;