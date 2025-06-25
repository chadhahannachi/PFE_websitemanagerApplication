import React from "react";
import { Box, TextField, Button, Typography } from "@mui/material";

function ContactUs() {
  return (
    <Box sx={{ p: 3, bgcolor: "#f5f5f5" }}>
      <Typography variant="h4">Contact Us</Typography>
      <TextField fullWidth label="Your Name" margin="normal" />
      <TextField fullWidth label="Your Email" margin="normal" />
      <TextField fullWidth label="Message" multiline rows={4} margin="normal" />
      <Button variant="contained" color="primary">Send</Button>
    </Box>
  );
}

export default ContactUs;
