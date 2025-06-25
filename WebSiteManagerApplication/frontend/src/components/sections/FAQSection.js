import React from "react";
import { Accordion, AccordionSummary, AccordionDetails, Typography, Box } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

function FAQSection() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4">Frequently Asked Questions</Typography>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>What services do you offer?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>We offer web development, consulting, and more.</Typography>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}

export default FAQSection;
