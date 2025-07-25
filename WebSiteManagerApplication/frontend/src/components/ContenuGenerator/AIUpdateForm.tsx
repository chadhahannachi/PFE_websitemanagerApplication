import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Stack,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
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

interface AIUpdateFormProps {
  content: Contenu;
  onUpdate: (updatedContent: Contenu) => void;
  onCancel: () => void;
}

const AIUpdateForm: React.FC<AIUpdateFormProps> = ({ content, onUpdate, onCancel }) => {
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
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ 
      p: 2, 
      height: '100%', 
      overflowY: 'auto',
      backgroundColor: '#2d2d2d',
      color: '#fff',
      boxSizing: 'border-box', // Ensure padding/margins are included in height calculations
    }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      )}
      
      <Stack spacing={2} sx={{ pb: 4 }}>
        <Typography variant="h6" sx={{ mb: 1, color: '#fff' }}>
          {content.titre}
        </Typography>

        <TextField
          label="Titre de la section"
          name="title"
          value={formData.title}
          onChange={handleChange}
          fullWidth
          size="small"
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#555',
              },
              '&:hover fieldset': {
                borderColor: '#777',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#1976d2',
              },
            },
            '& .MuiInputLabel-root': {
              color: '#ccc',
            },
            '& .MuiInputBase-input': {
              color: '#fff',
            },
          }}
        />

        <TextField
          label="Description de la section"
          name="description"
          value={formData.description}
          onChange={handleChange}
          fullWidth
          multiline
          rows={2}
          size="small"
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#555',
              },
              '&:hover fieldset': {
                borderColor: '#777',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#1976d2',
              },
            },
            '& .MuiInputLabel-root': {
              color: '#ccc',
            },
            '& .MuiInputBase-input': {
              color: '#fff',
            },
          }}
        />

        <Divider sx={{ borderColor: '#555' }} />

        <Typography variant="subtitle2" color="primary" sx={{ color: '#1976d2' }}>
          Couleurs
        </Typography>

        <TextField
          label="Arrière-plan des cartes"
          name="cardBackgroundColor"
          type="color"
          value={formData.cardBackgroundColor}
          onChange={handleChange}
          fullWidth
          size="small"
          InputLabelProps={{ shrink: true }}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#555',
              },
              '&:hover fieldset': {
                borderColor: '#777',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#1976d2',
              },
            },
            '& .MuiInputLabel-root': {
              color: '#ccc',
            },
          }}
        />

        <TextField
          label="Couleur titre section"
          name="sectionTitleColor"
          type="color"
          value={formData.sectionTitleColor}
          onChange={handleChange}
          fullWidth
          size="small"
          InputLabelProps={{ shrink: true }}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#555',
              },
              '&:hover fieldset': {
                borderColor: '#777',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#1976d2',
              },
            },
            '& .MuiInputLabel-root': {
              color: '#ccc',
            },
          }}
        />

        <TextField
          label="Couleur description section"
          name="sectionDescriptionColor"
          type="color"
          value={formData.sectionDescriptionColor}
          onChange={handleChange}
          fullWidth
          size="small"
          InputLabelProps={{ shrink: true }}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#555',
              },
              '&:hover fieldset': {
                borderColor: '#777',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#1976d2',
              },
            },
            '& .MuiInputLabel-root': {
              color: '#ccc',
            },
          }}
        />

        <TextField
          label="Couleur titres cartes"
          name="cardTitleColor"
          type="color"
          value={formData.cardTitleColor}
          onChange={handleChange}
          fullWidth
          size="small"
          InputLabelProps={{ shrink: true }}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#555',
              },
              '&:hover fieldset': {
                borderColor: '#777',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#1976d2',
              },
            },
            '& .MuiInputLabel-root': {
              color: '#ccc',
            },
          }}
        />

        <TextField
          label="Couleur descriptions cartes"
          name="cardDescriptionColor"
          type="color"
          value={formData.cardDescriptionColor}
          onChange={handleChange}
          fullWidth
          size="small"
          InputLabelProps={{ shrink: true }}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#555',
              },
              '&:hover fieldset': {
                borderColor: '#777',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#1976d2',
              },
            },
            '& .MuiInputLabel-root': {
              color: '#ccc',
            },
          }}
        />

        <Divider sx={{ borderColor: '#555' }} />

        <Typography variant="subtitle2" color="primary" sx={{ color: '#1976d2' }}>
          Polices
        </Typography>

        <FormControl fullWidth size="small">
          <InputLabel sx={{ color: '#ccc' }}>Police titre section</InputLabel>
          <Select
            name="sectionTitleFont"
            value={formData.sectionTitleFont}
            label="Police titre section"
            onChange={handleChange}
            sx={{
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#555',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#777',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#1976d2',
              },
              '& .MuiSelect-icon': {
                color: '#ccc',
              },
              '& .MuiSelect-select': {
                color: '#fff',
              },
            }}
          >
            {FONT_OPTIONS.map(font => (
              <MenuItem key={font} value={font}>{font}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth size="small">
          <InputLabel sx={{ color: '#ccc' }}>Police description section</InputLabel>
          <Select
            name="sectionDescriptionFont"
            value={formData.sectionDescriptionFont}
            label="Police description section"
            onChange={handleChange}
            sx={{
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#555',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#777',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#1976d2',
              },
              '& .MuiSelect-icon': {
                color: '#ccc',
              },
              '& .MuiSelect-select': {
                color: '#fff',
              },
            }}
          >
            {FONT_OPTIONS.map(font => (
              <MenuItem key={font} value={font}>{font}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth size="small">
          <InputLabel sx={{ color: '#ccc' }}>Police titres cartes</InputLabel>
          <Select
            name="cardTitleFont"
            value={formData.cardTitleFont}
            label="Police titres cartes"
            onChange={handleChange}
            sx={{
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#555',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#777',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#1976d2',
              },
              '& .MuiSelect-icon': {
                color: '#ccc',
              },
              '& .MuiSelect-select': {
                color: '#fff',
              },
            }}
          >
            {FONT_OPTIONS.map(font => (
              <MenuItem key={font} value={font}>{font}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth size="small">
          <InputLabel sx={{ color: '#ccc' }}>Police descriptions cartes</InputLabel>
          <Select
            name="cardDescriptionFont"
            value={formData.cardDescriptionFont}
            label="Police descriptions cartes"
            onChange={handleChange}
            sx={{
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#555',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#777',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#1976d2',
              },
              '& .MuiSelect-icon': {
                color: '#ccc',
              },
              '& .MuiSelect-select': {
                color: '#fff',
              },
            }}
          >
            {FONT_OPTIONS.map(font => (
              <MenuItem key={font} value={font}>{font}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Divider sx={{ borderColor: '#555' }} />

        <Typography variant="subtitle2" color="primary" sx={{ color: '#1976d2' }}>
          Alignements
        </Typography>

        <FormControl fullWidth size="small">
          <InputLabel sx={{ color: '#ccc' }}>Alignement titre section</InputLabel>
          <Select
            name="sectionTitleAlign"
            value={formData.sectionTitleAlign}
            label="Alignement titre section"
            onChange={handleChange}
            sx={{
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#555',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#777',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#1976d2',
              },
              '& .MuiSelect-icon': {
                color: '#ccc',
              },
              '& .MuiSelect-select': {
                color: '#fff',
              },
            }}
          >
            {ALIGN_OPTIONS.map(opt => (
              <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth size="small">
          <InputLabel sx={{ color: '#ccc' }}>Alignement description section</InputLabel>
          <Select
            name="sectionDescriptionAlign"
            value={formData.sectionDescriptionAlign}
            label="Alignement description section"
            onChange={handleChange}
            sx={{
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#555',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#777',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#1976d2',
              },
              '& .MuiSelect-icon': {
                color: '#ccc',
              },
              '& .MuiSelect-select': {
                color: '#fff',
              },
            }}
          >
            {ALIGN_OPTIONS.map(opt => (
              <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth size="small">
          <InputLabel sx={{ color: '#ccc' }}>Alignement titres cartes</InputLabel>
          <Select
            name="cardTitleAlign"
            value={formData.cardTitleAlign}
            label="Alignement titres cartes"
            onChange={handleChange}
            sx={{
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#555',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#777',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#1976d2',
              },
              '& .MuiSelect-icon': {
                color: '#ccc',
              },
              '& .MuiSelect-select': {
                color: '#fff',
              },
            }}
          >
            {ALIGN_OPTIONS.map(opt => (
              <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth size="small">
          <InputLabel sx={{ color: '#ccc' }}>Alignement descriptions cartes</InputLabel>
          <Select
            name="cardDescriptionAlign"
            value={formData.cardDescriptionAlign}
            label="Alignement descriptions cartes"
            onChange={handleChange}
            sx={{
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#555',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#777',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#1976d2',
              },
              '& .MuiSelect-icon': {
                color: '#ccc',
              },
              '& .MuiSelect-select': {
                color: '#fff',
              },
            }}
          >
            {ALIGN_OPTIONS.map(opt => (
              <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Divider sx={{ borderColor: '#555' }} />

        <Typography variant="subtitle2" color="primary" sx={{ color: '#1976d2' }}>
          Autres modifications
        </Typography>

        <TextField
          label="Autres modifications souhaitées"
          name="additionalModifications"
          value={formData.additionalModifications}
          onChange={handleChange}
          fullWidth
          multiline
          rows={3}
          size="small"
          placeholder="Ex: ajouter des animations, modifier la disposition, changer les icônes..."
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#555',
              },
              '&:hover fieldset': {
                borderColor: '#777',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#1976d2',
              },
            },
            '& .MuiInputLabel-root': {
              color: '#ccc',
            },
            '& .MuiInputBase-input': {
              color: '#fff',
            },
          }}
        />

        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
          <Button
            variant="outlined"
            onClick={onCancel}
            disabled={isLoading}
            fullWidth
            sx={{
              borderColor: '#555',
              color: '#ccc',
              '&:hover': {
                borderColor: '#777',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
              },
            }}
          >
            Annuler
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} /> : null}
            fullWidth
          >
            {isLoading ? 'Mise à jour...' : 'Appliquer'}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default AIUpdateForm; 