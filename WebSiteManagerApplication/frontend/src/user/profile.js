import React, { useEffect, useState } from "react";
import { Box, Typography, TextField, Button, Paper, Avatar } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import axios from "axios";
import { tokens } from "../theme";
import { useNavigate } from "react-router-dom";
import LogoutIcon from '@mui/icons-material/Logout';

const Profile = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});
  const token = localStorage.getItem("token");
  const [entreprises, setEntreprises] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem("token"); // Suppression du token
    navigate("/login"); // Redirection vers la page de connexion
  };

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        console.error("Token manquant");
        setLoading(false);
        return;
      }
  
      try {
        const response = await axios.get("http://localhost:5000/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        console.log("Profil récupéré:", response.data.user); 
        setProfile(response.data.user);
        setEditedProfile(response.data.user);
  
        const entreprisesResponse = await axios.get("http://localhost:5000/entreprises", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEntreprises(entreprisesResponse.data);
        console.log("Entreprises chargées:", entreprisesResponse.data);
        
      } catch (error) {
        console.error("Erreur lors de la récupération du profil :", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchProfile();
  }, [token]);
  

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };


  const handleEdit = () => setEditing(true);

  const handleSave = async () => {
    if (!profile || !profile._id) {
      console.error("User ID not found.");
      return;
    }

    const formData = new FormData();
    formData.append('nom', editedProfile.nom);
    formData.append('email', editedProfile.email);
    formData.append('role', editedProfile.role);
    if (imageFile) {
      formData.append('image', imageFile); // Append image file
    }

    try {
      await axios.put(`http://localhost:5000/auth/users/update/${profile._id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data' // Set content type for form data
        },
      });

      setProfile({ ...profile, ...editedProfile, image: URL.createObjectURL(imageFile) });
      setEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile");
    }
  };

  const getNomEntreprise = (entreprise) => {
    if (typeof entreprise === "string") {
      const foundEntreprise = entreprises.find((e) => e._id === entreprise);
      return foundEntreprise ? foundEntreprise.nom : "Inconnu";
    } else if (entreprise && entreprise._id) {
      const foundEntreprise = entreprises.find((e) => e._id === entreprise._id);
      return foundEntreprise ? foundEntreprise.nom : "Inconnu";
    }
    return "Inconnu"; 
  };
  

  if (loading) return <Typography>Chargement...</Typography>;
  if (!profile) return <Typography>Aucun profil trouvé.</Typography>;

  return (
    <Box m="20px" display="flex" flexDirection="column" alignItems="center">
       <Box  display="flex" justifyContent="flex-end" width="100%">
  <Button variant="contained" color="error" onClick={handleLogout} >
    Log Out <LogoutIcon />
  </Button>
</Box>

      <Typography variant="h3" color={colors.grey[100]} mb={2}>Profil</Typography>
      <Paper elevation={3} sx={{ p: "20px", backgroundColor: colors.primary[400], borderRadius: "8px", width: "60%" }}>
        <Box display="flex" alignItems="center" mb={2}>
          <Avatar src={profile.avatar || "/default-avatar.png"} sx={{ width: 100, height: 100, mr: 3 }} />
          <Typography variant="h5" color={colors.grey[100]}>
            {profile.nom}
          </Typography>
        </Box>

{/* File input for image upload */}
{editing && (
          <input type="file" onChange={handleImageChange} accept="image/*" />
        )}
        
        <TextField
          fullWidth
          label="Nom"
          value={editedProfile.nom || ""}
          onChange={(e) => setEditedProfile({ ...editedProfile, nom: e.target.value })}
          disabled={!editing}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Email"
          value={editedProfile.email || ""}
          onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
          disabled={!editing}
          sx={{ mb: 2 }}
        />
        <TextField
            fullWidth
            label="Rôle"
            variant="outlined"
            value={editedProfile.role || ""}
            onChange={(e) => setEditedProfile({ ...editedProfile, role: e.target.value })}
            disabled={!editing}
            sx={{ mb: 2 }}
          />
        <TextField
          fullWidth
          label="Entreprise"
          value={getNomEntreprise(profile.entreprise)}
          disabled
          sx={{ mb: 2 }}
        />


        {editing ? (
          <Button variant="contained" color="primary" onClick={handleSave}>
            Enregistrer
          </Button>
        ) : (
          <Button variant="contained" color="secondary" onClick={handleEdit}>
            Modifier
          </Button>
        )}
      </Paper>
    </Box>
  );
};

export default Profile;
