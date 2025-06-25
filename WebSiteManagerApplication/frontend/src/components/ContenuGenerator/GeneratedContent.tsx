import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Stack,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import { Contenu } from '../../types/contenu';

interface GeneratedContentProps {
  content: Contenu;
}

const GeneratedContent: React.FC<GeneratedContentProps> = ({ content }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current && content.html_component && content.css_style) {
      const iframeDoc = iframeRef.current.contentDocument;
      if (iframeDoc) {
        iframeDoc.open();
        iframeDoc.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <style>${content.css_style}</style>
          </head>
          <body>
            ${content.html_component}
          </body>
          </html>
        `);
        iframeDoc.close();
      }
    }
  }, [content]);

  if (!content || (!content.html_component && !content.css_style)) {
    return (
      <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
        <Typography variant="h6">Aucun contenu généré pour le moment.</Typography>
        <Typography>Générez un composant depuis l'onglet 'Générer le contenu' pour voir un aperçu.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Aperçu du Composant Généré
      </Typography>

      <Accordion defaultExpanded sx={{ mb: 3 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
          <ColorLensIcon sx={{ mr: 1 }} />
          <Typography>Personnaliser les couleurs (via IA)</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" color="text.secondary">
            La personnalisation des couleurs est maintenant gérée par les préférences de style que vous décrivez à l'IA.
            Pour modifier les couleurs, retournez à l'onglet 'Générer le contenu' et ajustez vos préférences stylistiques.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 2, overflow: 'hidden' }}>
        <iframe
          ref={iframeRef}
          title="Generated Content Preview"
          style={{ width: '100%', height: '600px', border: 'none' }}
        />
      </Box>
    </Box>
  );
};

export default GeneratedContent; 