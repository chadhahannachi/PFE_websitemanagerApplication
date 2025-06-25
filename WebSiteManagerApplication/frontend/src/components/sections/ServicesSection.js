import React from "react";
import { Box, Typography, List, ListItem, ListItemText } from "@mui/material";

function ServicesSection() {
  return (
    <Box sx={{ p: 3, bgcolor: "white" }}>
      <Typography variant="h4">Our Services</Typography>
      <List>
        <ListItem><ListItemText primary="Web Development" /></ListItem>
        <ListItem><ListItemText primary="Consulting" /></ListItem>
        <ListItem><ListItemText primary="Design" /></ListItem>
      </List>
    </Box>
  );
}

export default ServicesSection;
