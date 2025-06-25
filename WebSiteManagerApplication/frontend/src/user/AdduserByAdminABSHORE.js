import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from '../components/Header';
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const SignupForm = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [userEntreprise, setUserEntreprise] = useState("Entreprise");
  const [entreprise, setEntreprise] = useState();
  const [initialValues, setInitialValues] = useState({
    nom: "",
    email: "",
    password: "",
    nomEntreprise: "",
    role: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          const userId = decodedToken.sub;
          const response = await axios.get(`http://localhost:5000/auth/user/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUserEntreprise(response.data.entreprise);
        } catch (error) {
          console.error("Erreur lors de la récupération des données de l'utilisateur :", error);
        }
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchEntreprise = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/entreprises/${userEntreprise}`);
        setEntreprise(response.data);
        // Mettre à jour les initialValues avec le nom de l'entreprise
        setInitialValues(prevValues => ({
          ...prevValues,
          nomEntreprise: response.data.nom,
        }));
      } catch (err) {
        console.error("Erreur lors de la récupération de l'utilisateur:", err);
      }
    };

    fetchEntreprise();
  }, [userEntreprise]);

  const handleFormSubmit = async (values) => {
    try {
      const response = await fetch('http://localhost:5000/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
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
        enableReinitialize // Permet de réinitialiser les valeurs initiales lorsque initialValues change
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
                  value={values.nomEntreprise}
                  onChange={handleChange}
                  name="nomEntreprise"
                  disabled // Désactiver le champ pour empêcher la modification manuelle
                >
                  <MenuItem value={values.nomEntreprise}>
                    {values.nomEntreprise}
                  </MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth variant="filled" sx={{ gridColumn: "span 2" }}>
                <InputLabel>Rôle</InputLabel>
                <Select
                  value={values.role}
                  onChange={handleChange}
                  name="role"
                >
                  <MenuItem value="superadminabshore">Super Admin ABshore</MenuItem>
                  <MenuItem value="moderateur">Modérateur</MenuItem>
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
  nomEntreprise: yup.string().required("required"),
  role: yup.string().required("required"),
});

export default SignupForm;