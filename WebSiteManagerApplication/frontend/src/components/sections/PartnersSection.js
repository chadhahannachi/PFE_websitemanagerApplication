import React from "react";
import { Box, Typography, Grid, Paper } from "@mui/material";

function PartnersSection() {
  return (
    <Box sx={{ p: 3, bgcolor: "#e0e0e0" }}>
      <Typography variant="h4">Our Partners</Typography>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Paper sx={{ p: 2 }}>Partner 1</Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper sx={{ p: 2 }}>Partner 2</Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper sx={{ p: 2 }}>Partner 3</Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default PartnersSection;
