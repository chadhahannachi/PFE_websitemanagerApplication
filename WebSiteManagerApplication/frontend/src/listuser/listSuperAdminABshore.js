import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, useTheme, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { tokens } from "../theme";

const ListAdminABshore = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/auth/superAdminABshore", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAdmins(response.data);
      } catch (err) {
        setError("Erreur lors de la récupération des administrateurs.");
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  const handleUpdate = (id) => {
    navigate(`/update-user/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/auth/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAdmins(admins.filter((admin) => admin._id !== id));
      alert("Administrateur supprimé avec succès");
    } catch (err) {
      alert("Erreur lors de la suppression");
    }
  };

  if (loading) return <p className="text-center text-primary">Chargement...</p>;
  if (error) return <p className="text-center text-danger">{error}</p>;

  const columns = [
    { field: "_id", headerName: "ID", flex: 1 },
    { field: "nom", headerName: "Nom", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "nomEntreprise", headerName: "Entreprise", flex: 1 },
    {
      field: "role",
      headerName: "Rôle",
      flex: 1,
      renderCell: ({ row }) => {
        return (
          <Box
            width="60%"
            m="0 auto"
            p="5px"
            display="flex"
            justifyContent="center"
            backgroundColor={
              row.role === "admin"
                ? colors.greenAccent[600]
                : row.role === "manager"
                ? colors.greenAccent[700]
                : colors.greenAccent[700]
            }
            borderRadius="4px"
          >
            {row.role === "admin" && <AdminPanelSettingsOutlinedIcon />}
            {row.role === "manager" && <SecurityOutlinedIcon />}
            {row.role === "user" && <LockOpenOutlinedIcon />}
            <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
              {row.role}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: ({ row }) => (
        <Box display="flex" gap="10px">
          <Button
            variant="contained"
            color="warning"
            size="small"
            onClick={() => handleUpdate(row._id)}
          >
            Modifier
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={() => handleDelete(row._id)}
          >
            Supprimer
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header title="Administrateurs ABshore" subtitle="Liste des administrateurs de la plateforme" />
      <Button
        variant="contained"
        color="success"
        onClick={() => navigate("/registration")}
        sx={{ mb: 2 }}
      >
        Ajouter un administrateur
      </Button>
      <Box
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
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
        }}
      >
        <DataGrid rows={admins} columns={columns} getRowId={(row) => row._id} />
      </Box>
    </Box>
  );
};

export default ListAdminABshore;
