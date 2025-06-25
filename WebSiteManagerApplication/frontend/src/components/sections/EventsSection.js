import React from "react";
import { Box, Typography, Card, CardContent } from "@mui/material";

function EventsSection() {
  return (
    <Box sx={{ p: 3, bgcolor: "#e0e0e0" }}>
      <Typography variant="h4">Upcoming Events</Typography>
      <Card sx={{ mt: 2 }}>
        <CardContent>
          <Typography variant="h6">Event Name</Typography>
          <Typography variant="body2">Event date and details...</Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

export default EventsSection;
