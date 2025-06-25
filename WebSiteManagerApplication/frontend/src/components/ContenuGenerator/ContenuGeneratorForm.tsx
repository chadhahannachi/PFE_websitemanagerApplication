import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  FormControl,
  Stack,
  Typography,
  Paper,
  Snackbar,
  Alert,
  SelectChangeEvent,
  Divider,
  Card,
  CardContent,
  RadioGroup,
  FormControlLabel,
  Radio,
  Modal,
  Backdrop,
  Fade,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { predefinedComponents, PredefinedComponent } from '../../types/predefined-component.ts';

interface ContenuGeneratorFormProps {
  entrepriseId: string;
  onContentGenerated: (content: any) => void;
}

export const ContenuGeneratorForm: React.FC<ContenuGeneratorFormProps> = ({
  entrepriseId,
  onContentGenerated,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    rawContent: '',
    selectedComponentId: '',
    stylePreferences: '',
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewComponent, setPreviewComponent] = useState<PredefinedComponent | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`http://localhost:5000/contenus/generate/${entrepriseId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate content');
      }

      const data = await response.json();
      onContentGenerated(data);
      
      setSnackbar({
        open: true,
        message: 'Contenu généré avec succès',
        severity: 'success',
      });
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: `Erreur lors de la génération: ${error.message}`,
        severity: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name as string]: value,
    }));
  };

  const handleOpenPreviewModal = (component: PredefinedComponent) => {
    setPreviewComponent(component);
    setShowPreviewModal(true);
  };

  const handleClosePreviewModal = () => {
    setShowPreviewModal(false);
    setPreviewComponent(null);
  };

  const handleSelectComponent = (componentId: string) => {
    setFormData(prev => ({ ...prev, selectedComponentId: componentId }));
    handleClosePreviewModal();
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <Stack spacing={4}>
        <Typography variant="h5" component="h2">
          Générateur de Contenu IA
        </Typography>
        <Typography color="text.secondary">
          Créez une nouvelle section pour votre site web en utilisant l'intelligence artificielle
        </Typography>

        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              required
              fullWidth
              label="Titre de la section"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Ex: Nos Services, Nos Valeurs..."
            />

            <TextField
              required
              fullWidth
              multiline
              rows={2}
              label="Description courte"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Une brève description de cette section..."
            />

            <Divider />

            <Typography variant="h6">Choisissez un composant de base</Typography>
            <FormControl component="fieldset" fullWidth>
              <RadioGroup
                aria-label="selectedComponentId"
                name="selectedComponentId"
                value={formData.selectedComponentId}
                onChange={handleChange}
              >
                <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap' }}>
                  {predefinedComponents.map((component) => (
                    <Card
                      key={component.id}
                      sx={{
                        width: 200,
                        height: 150,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        cursor: 'pointer',
                        border: formData.selectedComponentId === component.id ? '2px solid #1976d2' : '1px solid #e0e0e0',
                        boxShadow: formData.selectedComponentId === component.id ? '0 0 8px rgba(25, 118, 210, 0.5)' : 'none',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          borderColor: '#1976d2',
                          boxShadow: '0 0 8px rgba(25, 118, 210, 0.5)',
                        },
                      }}
                      onClick={() => handleOpenPreviewModal(component)}
                    >
                      <CardContent sx={{ textAlign: 'center' }}>
                        <Typography variant="subtitle1">{component.name}</Typography>
                        <FormControlLabel
                          value={component.id}
                          control={<Radio />}
                          label=""
                          sx={{ m: 0, position: 'absolute', bottom: 8, right: 8 }}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              </RadioGroup>
            </FormControl>

            <Divider />

            <Typography variant="h6">Contenu à structurer</Typography>
            <TextField
              required
              fullWidth
              multiline
              rows={6}
              label="Votre contenu"
              name="rawContent"
              value={formData.rawContent}
              onChange={handleChange}
              placeholder="Collez ici votre contenu. L'IA va le structurer selon le composant choisi..."
              helperText="Exemple: Pour une liste de services, écrivez chaque service sur une nouvelle ligne ou séparez-les par des points."
            />

            <Divider />

            <Typography variant="h6">Préférences de style</Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Décrivez vos préférences stylistiques"
              name="stylePreferences"
              value={formData.stylePreferences}
              onChange={handleChange}
              placeholder="Ex: couleurs vives, ambiance professionnelle, design minimaliste..."
              helperText="Décrivez en langage naturel le style souhaité pour le composant."
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isLoading || !formData.selectedComponentId}
              sx={{ mt: 2 }}
            >
              {isLoading ? 'Génération en cours...' : 'Générer le Composant'}
            </Button>
          </Stack>
        </form>
      </Stack>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={showPreviewModal}
        onClose={handleClosePreviewModal}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={showPreviewModal}>
          <Box sx={{
            position: 'absolute' as 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: 800,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
            overflow: 'auto',
            maxHeight: '90vh',
          }}>
            <IconButton
              aria-label="close"
              onClick={handleClosePreviewModal}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
            
            <Typography id="transition-modal-title" variant="h6" component="h2" gutterBottom>
              Aperçu: {previewComponent?.name}
            </Typography>
            
            <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 2, overflow: 'hidden', mt: 2 }}>
              <iframe
                title="Component Preview"
                style={{ width: '100%', height: '400px', border: 'none' }}
                srcDoc={`
                  <!DOCTYPE html>
                  <html>
                  <head>
                    <style>${previewComponent?.previewCss || previewComponent?.baseCss || ''}</style>
                  </head>
                  <body>
                    ${previewComponent?.previewHtml || previewComponent?.baseHtml || '<!-- No content to display -->'}
                  </body>
                  </html>
                `}
              />
            </Box>

            <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
              <Button
                variant="contained"
                onClick={() => handleSelectComponent(previewComponent?.id || '')}
                disabled={!previewComponent}
              >
                Sélectionner ce composant
              </Button>
              <Button variant="outlined" onClick={handleClosePreviewModal}>
                Fermer
              </Button>
            </Stack>
          </Box>
        </Fade>
      </Modal>
    </Paper>
  );
}; 