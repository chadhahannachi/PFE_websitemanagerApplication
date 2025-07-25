// StyleUpdateModal.tsx
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
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { SelectChangeEvent } from '@mui/material/Select';
import { Contenu } from './types/contenu';

interface StyleUpdateModalProps {
  sectionId: string;
  content: Contenu;
  onClose: () => void;
}

const StyleUpdateModal: React.FC<StyleUpdateModalProps> = ({ sectionId, content, onClose }) => {
  const [styles, setStyles] = useState({
    title: {
      fontFamily: content?.styles?.title?.fontFamily || 'Arial',
      color: content?.styles?.title?.color || '#000000',
      textAlign: content?.styles?.title?.textAlign || 'center',
    },
    description: {
      fontFamily: content?.styles?.description?.fontFamily || 'Arial',
      color: content?.styles?.description?.color || '#000000',
      textAlign: content?.styles?.description?.textAlign || 'center',
    },
    items: {
      backgroundColor: content?.styles?.items?.backgroundColor || '#f3f4f6',
    },
  });

  // Handle changes for both TextField and Select components
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target;
    const [section, property] = name.split('.');
    setStyles((prev) => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [property]: value,
      },
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`http://localhost:5000/contenus/ContenuSpecifique/${sectionId}/styles`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(styles),
      });
      if (!response.ok) {
        throw new Error('Failed to update styles');
      }
      onClose();
    } catch (error) {
      console.error('Error updating styles:', error);
    }
  };

  return (
    <Modal
      open={true}
      onClose={onClose}
      aria-labelledby="style-update-modal-title"
      aria-describedby="style-update-modal-description"
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
      }}>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
        <Typography id="style-update-modal-title" variant="h6" component="h2" gutterBottom>
          Update Styles for {content?.titre}
        </Typography>
        <Stack spacing={3}>
          {/* Title Styles */}
          <FormControl fullWidth>
            <InputLabel>Title Font</InputLabel>
            <Select
              name="title.fontFamily"
              value={styles.title.fontFamily}
              onChange={handleChange}
            >
              <MenuItem value="Arial">Arial</MenuItem>
              <MenuItem value="Roboto">Roboto</MenuItem>
              <MenuItem value="Times New Roman">Times New Roman</MenuItem>
              <MenuItem value="Georgia">Georgia</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Title Color"
            name="title.color"
            type="color"
            value={styles.title.color}
            onChange={handleChange}
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel>Title Alignment</InputLabel>
            <Select
              name="title.textAlign"
              value={styles.title.textAlign}
              onChange={handleChange}
            >
              <MenuItem value="left">Left</MenuItem>
              <MenuItem value="center">Center</MenuItem>
              <MenuItem value="right">Right</MenuItem>
            </Select>
          </FormControl>

          {/* Description Styles */}
          <FormControl fullWidth>
            <InputLabel>Description Font</InputLabel>
            <Select
              name="description.fontFamily"
              value={styles.description.fontFamily}
              onChange={handleChange}
            >
              <MenuItem value="Arial">Arial</MenuItem>
              <MenuItem value="Roboto">Roboto</MenuItem>
              <MenuItem value="Times New Roman">Times New Roman</MenuItem>
              <MenuItem value="Georgia">Georgia</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Description Color"
            name="description.color"
            type="color"
            value={styles.description.color}
            onChange={handleChange}
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel>Description Alignment</InputLabel>
            <Select
              name="description.textAlign"
              value={styles.description.textAlign}
              onChange={handleChange}
            >
              <MenuItem value="left">Left</MenuItem>
              <MenuItem value="center">Center</MenuItem>
              <MenuItem value="right">Right</MenuItem>
            </Select>
          </FormControl>

          {/* Card Background Color */}
          <TextField
            label="Card Background Color"
            name="items.backgroundColor"
            type="color"
            value={styles.items.backgroundColor}
            onChange={handleChange}
            fullWidth
          />

          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Save Changes
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default StyleUpdateModal;