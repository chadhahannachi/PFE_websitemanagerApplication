import React from "react";
import { Box, Typography } from "@mui/material";

function AboutSection() {
  return (
    <Box sx={{ p: 3, bgcolor: "white" }}>
      <Typography variant="h4">About Us</Typography>
      <Typography variant="body1">We are a company dedicated to providing amazing services.</Typography>
    </Box>
  );
}

export default AboutSection;
