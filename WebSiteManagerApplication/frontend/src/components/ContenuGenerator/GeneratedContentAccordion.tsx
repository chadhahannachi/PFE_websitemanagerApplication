// GeneratedContentAccordion.tsx
import React, { useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import { Contenu } from './types/contenu';

interface GeneratedContentAccordionProps {
  content: Contenu;
  onUpdate: () => void;
}

const GeneratedContentAccordion: React.FC<GeneratedContentAccordionProps> = ({ content, onUpdate }) => {
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
            <style>
            body { margin: 0; }
            ${content.css_style}
            /* Apply stored styles from MongoDB */
            .container h1 { 
              color: ${content.styles?.title?.color || '#000'};
              font-family: ${content.styles?.title?.fontFamily || 'inherit'};
              text-align: ${content.styles?.title?.textAlign || 'center'};
            }
            .container p { 
              color: ${content.styles?.description?.color || '#000'};
              font-family: ${content.styles?.description?.fontFamily || 'inherit'};
              text-align: ${content.styles?.description?.textAlign || 'center'};
            }
            .card, .feature-item, .plan, .testimonial, .faq-item { 
              background-color: ${content.styles?.items?.backgroundColor || '#f3f4f6'};
            }
            </style>
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
    <Box>
      <Accordion defaultExpanded sx={{ mb: 3 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
          <Typography>{content.titre}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ border: '1px solid #e0e0e0', backgroundColor: '#fff' }}>
            <iframe
              ref={iframeRef}
              title="Generated Content Preview"
              style={{ width: '100%', border: 'none' }}
              onLoad={() => {
                if (iframeRef.current) {
                  const iframe = iframeRef.current;
                  try {
                    const doc = iframe.contentDocument || iframe.contentWindow?.document;
                    if (doc && doc.body && doc.body.scrollHeight) {
                      iframe.style.height = (doc.body.scrollHeight + 8) + 'px';
                    }
                  } catch (e) {
                    // Ignore cross-origin errors
                  }
                }
              }}
            />
          </Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<ColorLensIcon />}
            onClick={onUpdate}
            sx={{ mt: 2 }}
          >
            Update Styles
          </Button>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default GeneratedContentAccordion;