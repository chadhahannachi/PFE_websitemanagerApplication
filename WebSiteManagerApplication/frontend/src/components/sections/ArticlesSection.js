import React from "react";
import { Box, Typography, Card, CardContent } from "@mui/material";

function ArticlesSection() {
  return (
    <Box sx={{ p: 3, bgcolor: "#f5f5f5" }}>
      <Typography variant="h4">Latest Articles</Typography>
      <Card sx={{ mt: 2 }}>
        <CardContent>
          <Typography variant="h6">Article Title</Typography>
          <Typography variant="body2">A short description of the article...</Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

export default ArticlesSection;
