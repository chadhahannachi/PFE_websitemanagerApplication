import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from '../components/Header';
import { useParams } from 'react-router-dom'; 

const AddSuperAdminCompany = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [entreprises, setEntreprises] = useState([]);
  const { entrepriseId } = useParams(); // Get entrepriseId from URL
  const [nomEntreprise, setNomEntreprise] = useState("");

  useEffect(() => {
    const fetchEntreprises = async () => {
      try {
        const response = await fetch('http://localhost:5000/entreprises');
        const data = await response.json();
        if (response.ok) {
          setEntreprises(data);
          const entreprise = data.find(e => e._id === entrepriseId);
          if (entreprise) setNomEntreprise(entreprise.nom);
        } else {
          console.error("Erreur lors du chargement des entreprises:", data.message);
        }
      } catch (error) {
        console.error("Erreur réseau lors du chargement des entreprises:", error);
      }
    };
  
    fetchEntreprises();
  }, [entrepriseId]);

  const handleFormSubmit = async (values) => {
    try {
      const newValues = { ...values, role: "superAdminEnt", nomEntreprise };
      const response = await fetch('http://localhost:5000/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newValues),
      });
  
      const data = await response.json();
      if (response.ok) {
        console.log('Inscription réussie:', data);
        alert('Inscription réussie !');
      } else {
        console.error('Erreur lors de l\'inscription:', data.message);
        alert(`Erreur: ${data.message}`);
      }
    } catch (error) {
      console.error('Erreur réseau:', error);
      alert('Erreur réseau lors de l\'inscription');
    }
  };

  return (
    <Box m="20px">
      <Header title="INSCRIPTION" subtitle="Créer un nouveau compte utilisateur" />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
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
                type="password"
                label="Mot de passe"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.password}
                name="password"
                error={!!touched.password && !!errors.password}
                helperText={touched.password && errors.password}
                sx={{ gridColumn: "span 2" }}
              />
              <FormControl fullWidth variant="filled" sx={{ gridColumn: "span 2" }}>
                <InputLabel>Nom de l'entreprise</InputLabel>
                <Select
                  value={nomEntreprise}
                  onChange={handleChange}
                  name="nomEntreprise"
                  disabled 
                >
                  <MenuItem value="">{nomEntreprise || "Sélectionner une entreprise"}</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                S'inscrire
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
  password: yup.string().required("required"),
});

const initialValues = {
  nom: "",
  email: "",
  password: "",
};

export default AddSuperAdminCompany;
