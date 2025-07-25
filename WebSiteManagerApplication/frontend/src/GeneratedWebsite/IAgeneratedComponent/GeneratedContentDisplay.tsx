import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Typography,
  Button,
} from '@mui/material';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import { Contenu } from '../../components/ContenuGenerator/types/contenu';
// import { Contenu } from './types/contenu';

interface GeneratedContentProps {
  content: Contenu;
  onOpenAIUpdate?: (content: Contenu) => void;
}

const GeneratedContentDisplay: React.FC<GeneratedContentProps> = ({ content }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [localContent, setLocalContent] = useState(content);

  useEffect(() => {
    setLocalContent(content);
  }, [content]);

  useEffect(() => {
    if (iframeRef.current && localContent.html_component && localContent.css_style) {
      const iframeDoc = iframeRef.current.contentDocument;
      if (iframeDoc) {
        iframeDoc.open();
        iframeDoc.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <style>
            body { margin: 0; }
            ${localContent.css_style}
            </style>
          </head>
          <body>
            ${localContent.html_component}
          </body>
          </html>
        `);
        iframeDoc.close();
      }
    }
  }, [localContent]);

  if (!localContent || (!localContent.html_component && !localContent.css_style)) {
    return (
      <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
        <Typography variant="h6">Aucun contenu généré pour le moment.</Typography>
        <Typography>Générez un composant depuis l'onglet 'Générer le contenu' pour voir un aperçu.</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ border: '1px solid #e0e0e0' , backgroundColor: '#fff'}}>
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
                // ignore cross-origin errors
              }
            }
          }}
        />
      </Box>
      {/* <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<ColorLensIcon />}
          onClick={() => onOpenAIUpdate?.(localContent)}
        >
          Modifier avec l'IA
        </Button>
      </Box> */}
    </Box>
  );
};

export default GeneratedContentDisplay; 