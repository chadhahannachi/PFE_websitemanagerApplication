import React, { useState } from "react";
import { Modal, Box, Button, List, ListItem, ListItemButton, Typography } from "@mui/material";
import axios from 'axios';

const sections = ["Navbar", "Cover Section", "About Section", "Contact Us", "FAQ Section","Partners Section",
  "Services Section",
  "Articles Section",
  "Events Section"];


function ModalComponent({ addSection }) {
  const [open, setOpen] = useState(false);
  const [carrousels, setCarrousels] = useState([]);

  const addCarroussel = (sectionName) => {
    const sectionData = {
      titre: sectionName,
      code: `<${sectionName.replace(" ", "")} />`, // Transforme en JSX valide
      styles: {},
      position: carrousels.length // Ajoute à la fin
    };
  
    axios.post('http://localhost:5000/carrousels', sectionData)
      .then(response => {
        setCarrousels(prevCarrousels => [...prevCarrousels, response.data]);
      })
      .catch(error => console.error('Erreur lors de l\'ajout:', error));
  };

  const updateCarrousselStyle = (id, newStyles) => {
    axios.put(`http://localhost:5000/carrousels/${id}`, { styles: newStyles })
      .then(response => {
        setCarrousels(prevCarrousels => prevCarrousels.map(carroussel =>
          carroussel._id === id ? { ...carroussel, styles: newStyles } : carroussel
        ));
      })
      .catch(error => console.error('Erreur lors de la mise à jour des styles:', error));
  };
  
  
  return (
    <>
      <Button variant="contained" onClick={() => setOpen(true)}>+</Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: 300, bgcolor: "white", p: 2, m: "auto", mt: 10, borderRadius: 2 }}>
          <Typography variant="h6">Choose a Section</Typography>
          <List>
            {sections.map((type) => (
              <ListItem key={type}>
                <ListItemButton onClick={() => { addSection(type); setOpen(false); }}>
                  {type}
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Modal>
    </>
  );
}

export default ModalComponent;
