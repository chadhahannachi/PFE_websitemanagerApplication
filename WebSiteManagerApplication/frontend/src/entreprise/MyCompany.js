import React, { useEffect, useState } from 'react';
import { Box, TextField, Button } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from '../components/Header';
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const MyCompany = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [entreprise, setEntreprise] = useState({
    id: "",  // Ajout du champ ID
    nom: "",
    contact: "",
    numTel: "",
    adresse: "",
    raisonSociale: "",
  });

  const [isEditing, setIsEditing] = useState(false); // Mode édition activé/désactivé

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          const userId = decodedToken.sub;
          
          console.log("User ID récupéré :", userId);

          const userResponse = await axios.get(`http://localhost:5000/auth/user/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          const entrepriseId = userResponse.data.entreprise;
          console.log("Entreprise ID récupéré :", entrepriseId);

          if (!entrepriseId) {
            console.error("Erreur : aucun ID d'entreprise trouvé pour cet utilisateur.");
            return;
          }

          const entrepriseResponse = await axios.get(`http://localhost:5000/entreprises/${entrepriseId}`);
          console.log("Données de l'entreprise récupérées :", entrepriseResponse.data);

          setEntreprise({ ...entrepriseResponse.data, id: entrepriseId }); // Assure que l'ID est bien présent

        } catch (error) {
          console.error("Erreur lors de la récupération des données :", error);
        }
      }
    };

    fetchUserData();
  }, []);

  // Fonction pour modifier l'état des champs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEntreprise((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Fonction pour sauvegarder les modifications
  const handleSave = async () => {
    try {
      console.log("Entreprise à mettre à jour :", entreprise);

      if (!entreprise.id) {
        console.error("Erreur : l'ID de l'entreprise est manquant !");
        alert("Impossible de mettre à jour : ID introuvable.");
        return;
      }

      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:5000/entreprises/${entreprise.id}`, entreprise, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setIsEditing(false); // Désactiver le mode édition après la sauvegarde
      alert("Entreprise mise à jour avec succès !");
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
      alert("Une erreur s'est produite !");
    }
  };

  return (
    <Box m="20px">
      <Header title="My Company" subtitle="Modify your company details" />

      <Box
        display="grid"
        gap="20px"
        gridTemplateColumns="repeat(2, minmax(0, 1fr))"
        sx={{
          "& > div": { gridColumn: isNonMobile ? undefined : "span 2" },
        }}
      >
        <TextField
          label="Nom de l'entreprise"
          name="nom"
          value={entreprise.nom}
          onChange={handleChange}
          variant="filled"
          fullWidth
          disabled={!isEditing}
        />

        <TextField
          label="Contact"
          name="contact"
          value={entreprise.contact}
          onChange={handleChange}
          variant="filled"
          fullWidth
          disabled={!isEditing}
        />

        <TextField
          label="Numéro de téléphone"
          name="numTel"
          value={entreprise.numTel}
          onChange={handleChange}
          variant="filled"
          fullWidth
          disabled={!isEditing}
        />

        <TextField
          label="Adresse"
          name="adresse"
          value={entreprise.adresse}
          onChange={handleChange}
          variant="filled"
          fullWidth
          disabled={!isEditing}
        />

        <TextField
          label="Raison sociale"
          name="raisonSociale"
          value={entreprise.raisonSociale}
          onChange={handleChange}
          variant="filled"
          fullWidth
          disabled={!isEditing}
        />
      </Box>

      <Box mt="20px" display="flex" justifyContent="space-between">
        {!isEditing ? (
          <Button variant="contained" color="primary" onClick={() => setIsEditing(true)}>
            Modifier
          </Button>
        ) : (
          <>
            <Button variant="contained" color="success" onClick={handleSave}>
              Enregistrer
            </Button>
            <Button variant="contained" color="secondary" onClick={() => setIsEditing(false)}>
              Annuler
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
};

export default MyCompany;
