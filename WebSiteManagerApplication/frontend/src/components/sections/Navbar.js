import React from "react";
import { AppBar, Toolbar, Typography, Button, IconButton, Box } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";  // For menu icon

function Navbar() {
  return (
    <AppBar position="static" sx={{ backgroundColor: "#2c3e50", boxShadow: 4 }}>
      <Toolbar>
        {/* Menu Icon for mobile view */}
        <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
          <MenuIcon />
        </IconButton>
        
        {/* Brand Name or Title */}
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
          My Website
        </Typography>

        {/* Navigation Buttons */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button color="inherit" sx={{ "&:hover": { color: "#FF4081" } }}>
            Home
          </Button>
          <Button color="inherit" sx={{ "&:hover": { color: "#FF4081" } }}>
            About
          </Button>
          <Button color="inherit" sx={{ "&:hover": { color: "#FF4081" } }}>
            Services
          </Button>
          <Button color="inherit" sx={{ "&:hover": { color: "#FF4081" } }}>
            Contact
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
