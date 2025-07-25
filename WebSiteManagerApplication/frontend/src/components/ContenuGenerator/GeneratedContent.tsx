import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Typography,
  Button,
} from '@mui/material';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import ArchiveIcon from '@mui/icons-material/Archive';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { jwtDecode } from 'jwt-decode';
import { Contenu } from './types/contenu';

interface GeneratedContentProps {
  content: Contenu;
  onOpenAIUpdate?: (content: Contenu) => void;
  onArchived?: (id: string) => void;
}

const GeneratedContent: React.FC<GeneratedContentProps> = ({ content, onOpenAIUpdate, onArchived }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [localContent, setLocalContent] = useState(content);
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [archiving, setArchiving] = useState(false);

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

  const handleArchive = async () => {
    setArchiving(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token manquant');
      await fetch(`http://localhost:5000/contenus/ContenuSpecifique/${localContent._id}/archive`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      setSnackbar({ open: true, message: 'Composant archivé avec succès !', severity: 'success' });
      setShowArchiveDialog(false);
      if (localContent._id) onArchived?.(localContent._id);
    } catch (e) {
      setSnackbar({ open: true, message: "Erreur lors de l'archivage.", severity: 'error' });
    } finally {
      setArchiving(false);
    }
  };

  if (!localContent || (!localContent.html_component && !localContent.css_style)) {
    return (
      <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
        <Typography variant="h6">Aucun contenu généré pour le moment.</Typography>
        <Typography>Générez un composant depuis l'onglet 'Générer le contenu' pour voir un aperçu.</Typography>
      </Box>
    );
  }

  return (
    <>
      <style>
        {`
          @keyframes slideInRight {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
        `}
      </style>
      
      
      
      <div style={{ backgroundColor: 'white', minHeight: '100vh', padding: '20px' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '20px',
          padding: '15px 20px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #e9ecef'
        }}>
          <span style={{ 
            fontSize: '18px', 
            fontWeight: '600', 
            color: '#495057' 
          }}>AI generated content</span> 
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <Button
              variant="outlined"
              color="warning"
              startIcon={<ArchiveIcon />}
              onClick={() => setShowArchiveDialog(true)}
              disabled={archiving}
            >
              Archiver
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<ColorLensIcon />}
              onClick={() => onOpenAIUpdate?.(localContent)}
            >
              Modifier avec l'IA
            </Button>
          </div>
        </div>

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
    </div>
    <Dialog open={showArchiveDialog} onClose={() => setShowArchiveDialog(false)}>
      <DialogTitle>Archiver ce composant IA ?</DialogTitle>
      <DialogContent>
        Voulez-vous vraiment archiver ce composant IA ? Cette action est irréversible.
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setShowArchiveDialog(false)} color="inherit">Annuler</Button>
        <Button onClick={handleArchive} color="warning" disabled={archiving}>Archiver</Button>
      </DialogActions>
    </Dialog>
    <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar(s => ({ ...s, open: false }))} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
      <MuiAlert elevation={6} variant="filled" onClose={() => setSnackbar(s => ({ ...s, open: false }))} severity={snackbar.severity as 'success' | 'info' | 'warning' | 'error'} sx={{ width: '100%' }}>
        {snackbar.message}
      </MuiAlert>
    </Snackbar>
    </>
  );
};

export default GeneratedContent; 