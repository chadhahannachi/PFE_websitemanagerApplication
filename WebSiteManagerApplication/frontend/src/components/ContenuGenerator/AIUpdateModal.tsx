import React, { useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Stack,
  IconButton,
  CircularProgress,
  Alert,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Contenu } from './types/contenu';

const FONT_OPTIONS = [
  'Arial',
  'Roboto',
  'Times New Roman',
  'Georgia',
  'Montserrat',
  'Lato',
  'Open Sans',
];

const ALIGN_OPTIONS = [
  { value: 'left', label: 'Gauche' },
  { value: 'center', label: 'Centré' },
  { value: 'right', label: 'Droite' },
];

interface AIUpdateModalProps {
  content: Contenu;
  onClose: () => void;
  onUpdate: (updatedContent: Contenu) => void;
}

const AIUpdateModal: React.FC<AIUpdateModalProps> = ({ content, onClose, onUpdate }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: content.titre || '',
    description: content.description || '',
    cardBackgroundColor: '',
    sectionTitleColor: '',
    sectionDescriptionColor: '',
    cardTitleColor: '',
    cardDescriptionColor: '',
    sectionTitleFont: '',
    sectionDescriptionFont: '',
    cardTitleFont: '',
    cardDescriptionFont: '',
    sectionTitleAlign: '',
    sectionDescriptionAlign: '',
    cardTitleAlign: '',
    cardDescriptionAlign: '',
    additionalModifications: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: string } }
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:5000/contenus/ContenuSpecifique/${content._id}/update-ai`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update content');
      }
      const updatedContent = await response.json();
      onUpdate(updatedContent);
      onClose();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      open={true}
      onClose={onClose}
      aria-labelledby="ai-update-modal-title"
      aria-describedby="ai-update-modal-description"
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '90%',
        maxWidth: 600,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
        borderRadius: 2,
        maxHeight: '90vh',
        overflow: 'auto',
      }}>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
        <Typography id="ai-update-modal-title" variant="h6" component="h2" gutterBottom>
          Modifier la section avec l'IA
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        )}
        <Stack spacing={3}>
          <TextField
            label="Titre de la section"
            name="title"
            value={formData.title}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Description de la section"
            name="description"
            value={formData.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={2}
          />
          <TextField
            label="Autres modifications souhaitées"
            name="additionalModifications"
            value={formData.additionalModifications}
            onChange={handleChange}
            fullWidth
            multiline
            rows={2}
            placeholder="Ex: ajouter une animation, changer la disposition, etc."
          />
          <Typography variant="subtitle1">Styles de la carte</Typography>
          <TextField
            label="Couleur d'arrière-plan de la carte"
            name="cardBackgroundColor"
            type="color"
            value={formData.cardBackgroundColor}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <Typography variant="subtitle1">Styles des textes</Typography>
          {/* Section Title */}
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              label="Couleur du titre de la section"
              name="sectionTitleColor"
              type="color"
              value={formData.sectionTitleColor}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
            <FormControl fullWidth>
              <InputLabel>Police du titre</InputLabel>
              <Select
                name="sectionTitleFont"
                value={formData.sectionTitleFont}
                label="Police du titre"
                onChange={handleChange}
              >
                {FONT_OPTIONS.map(font => (
                  <MenuItem key={font} value={font}>{font}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Alignement du titre</InputLabel>
              <Select
                name="sectionTitleAlign"
                value={formData.sectionTitleAlign}
                label="Alignement du titre"
                onChange={handleChange}
              >
                {ALIGN_OPTIONS.map(opt => (
                  <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
          {/* Section Description */}
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              label="Couleur de la description de la section"
              name="sectionDescriptionColor"
              type="color"
              value={formData.sectionDescriptionColor}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
            <FormControl fullWidth>
              <InputLabel>Police de la description</InputLabel>
              <Select
                name="sectionDescriptionFont"
                value={formData.sectionDescriptionFont}
                label="Police de la description"
                onChange={handleChange}
              >
                {FONT_OPTIONS.map(font => (
                  <MenuItem key={font} value={font}>{font}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Alignement de la description</InputLabel>
              <Select
                name="sectionDescriptionAlign"
                value={formData.sectionDescriptionAlign}
                label="Alignement de la description"
                onChange={handleChange}
              >
                {ALIGN_OPTIONS.map(opt => (
                  <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
          {/* Card Title */}
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              label="Couleur des titres dans les cartes"
              name="cardTitleColor"
              type="color"
              value={formData.cardTitleColor}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
            <FormControl fullWidth>
              <InputLabel>Police des titres dans les cartes</InputLabel>
              <Select
                name="cardTitleFont"
                value={formData.cardTitleFont}
                label="Police des titres dans les cartes"
                onChange={handleChange}
              >
                {FONT_OPTIONS.map(font => (
                  <MenuItem key={font} value={font}>{font}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Alignement des titres dans les cartes</InputLabel>
              <Select
                name="cardTitleAlign"
                value={formData.cardTitleAlign}
                label="Alignement des titres dans les cartes"
                onChange={handleChange}
              >
                {ALIGN_OPTIONS.map(opt => (
                  <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
          {/* Card Description */}
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              label="Couleur des descriptions dans les cartes"
              name="cardDescriptionColor"
              type="color"
              value={formData.cardDescriptionColor}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
            <FormControl fullWidth>
              <InputLabel>Police des descriptions dans les cartes</InputLabel>
              <Select
                name="cardDescriptionFont"
                value={formData.cardDescriptionFont}
                label="Police des descriptions dans les cartes"
                onChange={handleChange}
              >
                {FONT_OPTIONS.map(font => (
                  <MenuItem key={font} value={font}>{font}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Alignement des descriptions dans les cartes</InputLabel>
              <Select
                name="cardDescriptionAlign"
                value={formData.cardDescriptionAlign}
                label="Alignement des descriptions dans les cartes"
                onChange={handleChange}
              >
                {ALIGN_OPTIONS.map(opt => (
                  <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button variant="outlined" onClick={onClose} disabled={isLoading}>
              Annuler
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={20} /> : null}
            >
              {isLoading ? 'Mise à jour...' : 'Mettre à jour avec l\'IA'}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
};

export default AIUpdateModal; 