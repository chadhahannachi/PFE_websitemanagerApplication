import React, { useState, useEffect } from "react";
import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";

const UpdateUser = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null); // Initialiser à null pour vérifier si les données sont chargées
  const [isLoading, setIsLoading] = useState(true); // Ajouter un état de chargement

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:5000/auth/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data); // Mettre à jour l'état avec les données de l'utilisateur
        setIsLoading(false); // Désactiver l'état de chargement une fois les données récupérées
      } catch (err) {
        console.error("Erreur lors de la récupération de l'utilisateur:", err);
        setIsLoading(false); // Désactiver l'état de chargement en cas d'erreur
      }
    };

    fetchUser();
  }, [id]);

  const handleFormSubmit = async (values) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/auth/put/${id}`, values, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Utilisateur mis à jour avec succès");
      navigate(-1);
    } catch (err) {
      console.error("Erreur lors de la mise à jour de l'utilisateur:", err);
      alert("Erreur lors de la mise à jour de l'utilisateur");
    }
  };

  // Afficher un message de chargement tant que les données ne sont pas disponibles
  if (isLoading) {
    return <div>Chargement...</div>;
  }

  // Si les données de l'utilisateur ne sont pas disponibles, afficher un message d'erreur
  if (!user) {
    return <div>Erreur lors du chargement des données de l'utilisateur.</div>;
  }

  return (
    <Box m="20px">
      <Header title="MODIFIER L'UTILISATEUR" subtitle="Modifier les informations de l'utilisateur" />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={{
          nom: user.nom || "", // Utiliser les données de l'utilisateur comme valeurs initiales
          email: user.email || "",
          nomEntreprise: user.nomEntreprise || "",
        }}
        validationSchema={checkoutSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Nom"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.nom}
                name="nom"
                error={!!touched.nom && !!errors.nom}
                helperText={touched.nom && errors.nom}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="email"
                label="Email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                error={!!touched.email && !!errors.email}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Entreprise"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.nomEntreprise}
                name="nomEntreprise"
                error={!!touched.nomEntreprise && !!errors.nomEntreprise}
                helperText={touched.nomEntreprise && errors.nomEntreprise}
                sx={{ gridColumn: "span 2" }}
              />
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Enregistrer les modifications
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

const checkoutSchema = yup.object().shape({
  nom: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  nomEntreprise: yup.string().required("required"),
});

export default UpdateUser;