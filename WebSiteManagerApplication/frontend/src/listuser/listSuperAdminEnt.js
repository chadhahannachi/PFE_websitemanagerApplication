import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, useTheme, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { tokens } from "../theme";

const ListSuperAdminEnt = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [superAdmins, setSuperAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSuperAdmins = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/auth/SuperAdminEnt", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuperAdmins(response.data);
      } catch (err) {
        setError("Erreur lors de la récupération des Super Admin Ent.");
      } finally {
        setLoading(false);
      }
    };

    fetchSuperAdmins();
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
      setSuperAdmins(superAdmins.filter((admin) => admin._id !== id));
      alert("Utilisateur supprimé avec succès");
    } catch (err) {
      console.error("Erreur lors de la suppression de l'utilisateur:", err);
      alert("Erreur lors de la suppression de l'utilisateur");
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
      <Header
        title="Super Administrateurs des Entreprises"
        subtitle="Liste des super administrateurs des entreprises"
      />
      <Button
        variant="contained"
        color="success"
        onClick={() => navigate("/registration")}
        sx={{ mb: 2 }}
      >
        Ajouter un Super administrateur
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
        <DataGrid rows={superAdmins} columns={columns} getRowId={(row) => row._id} />
      </Box>
    </Box>
  );
};

export default ListSuperAdminEnt;