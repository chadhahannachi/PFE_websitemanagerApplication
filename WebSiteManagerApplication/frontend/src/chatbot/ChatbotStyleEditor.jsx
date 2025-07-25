import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { SketchPicker } from 'react-color';
import { InputLabel, Select, MenuItem, Button } from '@mui/material';
import { Icon } from '@iconify/react';

const defaultPrefs = {
  chatbotMainColor: '#007bff',
  chatbotFontFamily: 'inherit',
  chatbotUserBgColor: '#d1e7dd',
  chatbotBotBgColor: '#e2e3e5',
  chatbotBorderRadius: 16,
  chatbotWindowBgColor: '#fff',
  chatbotWindowBgImage: '',
  chatbotMessagesBgColor: '#f9f9f9', // Ajout couleur fond messages
  chatbotMessagesBgImage: '',        // Ajout image fond messages
};

const fontOptions = [
  'inherit', 'Arial', 'Poppins', 'Roboto', 'Open Sans', 'Montserrat', 'Lato', 'Nunito', 'Merriweather', 'Verdana', 'Georgia', 'Times New Roman', 'Courier New'
];

export default function ChatbotStyleEditor({ entrepriseId, onSaved, livePrefs, onLiveChange }) {
  const [prefs, setPrefs] = useState(defaultPrefs);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [colorPickerOpen, setColorPickerOpen] = useState({ main: false, user: false, bot: false, messages: false });
  const colorPickerAnchor = useRef({});

  useEffect(() => {
    if (!entrepriseId) return;
    axios.get(`http://localhost:5000/preferences/entreprise/${entrepriseId}/preferences`).then(res => {
      const styles = res.data.preferences?.chatbot?.styles || defaultPrefs;
      const newPrefs = {
        chatbotMainColor: styles.chatbotMainColor || defaultPrefs.chatbotMainColor,
        chatbotFontFamily: styles.chatbotFontFamily || defaultPrefs.chatbotFontFamily,
        chatbotUserBgColor: styles.chatbotUserBgColor || defaultPrefs.chatbotUserBgColor,
        chatbotBotBgColor: styles.chatbotBotBgColor || defaultPrefs.chatbotBotBgColor,
        chatbotBorderRadius: typeof styles.chatbotBorderRadius === 'number' ? styles.chatbotBorderRadius : defaultPrefs.chatbotBorderRadius,
        chatbotWindowBgColor: styles.chatbotWindowBgColor || defaultPrefs.chatbotWindowBgColor,
        chatbotWindowBgImage: styles.chatbotWindowBgImage || defaultPrefs.chatbotWindowBgImage,
        chatbotMessagesBgColor: styles.chatbotMessagesBgColor || defaultPrefs.chatbotMessagesBgColor,
        chatbotMessagesBgImage: styles.chatbotMessagesBgImage || defaultPrefs.chatbotMessagesBgImage,
      };
      setPrefs(newPrefs);
      onLiveChange && onLiveChange(newPrefs);
    });
  }, [entrepriseId]);

  // Appliquer livePrefs si modifié ailleurs
  useEffect(() => {
    if (livePrefs) setPrefs(livePrefs);
  }, [livePrefs]);

  const handleChange = e => {
    const newPrefs = { ...prefs, [e.target.name]: e.target.value };
    setPrefs(newPrefs);
    onLiveChange && onLiveChange(newPrefs);
  };

  const handleColorChange = (field, color) => {
    let value = color.rgb.a < 1 ? `rgba(${color.rgb.r},${color.rgb.g},${color.rgb.b},${color.rgb.a})` : color.hex;
    const newPrefs = { ...prefs, [field]: value };
    setPrefs(newPrefs);
    onLiveChange && onLiveChange(newPrefs);
  };

  const handleImageUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'chadha');
    try {
      const response = await fetch('https://api.cloudinary.com/v1_1/duvcpe6mx/image/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (data.secure_url) {
        const newPrefs = { ...prefs, [field]: data.secure_url };
        setPrefs(newPrefs);
        onLiveChange && onLiveChange(newPrefs);
      } else {
        alert("Erreur lors de l'upload de l'image sur Cloudinary");
      }
    } catch (err) {
      alert("Erreur lors de l'upload de l'image sur Cloudinary");
    }
  };

  const handleSave = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    await axios.post('http://localhost:5000/preferences/entreprise', {
      entreprise: entrepriseId,
      preferences: {
        chatbot: {
          styles: prefs
        }
      }
    }, token ? { headers: { Authorization: `Bearer ${token}` } } : {});
    setLoading(false);
    setSuccess(true);
    onSaved && onSaved();
    setTimeout(() => setSuccess(false), 2000);
  };

  const handleBorderRadiusChange = e => {
    const newPrefs = { ...prefs, chatbotBorderRadius: parseInt(e.target.value) };
    setPrefs(newPrefs);
    onLiveChange && onLiveChange(newPrefs);
  };

  return (
    <div style={{ padding: 12,  borderRadius: 8,  minWidth: 200 }}>
      {/* <h3 style={{ marginTop: 0, marginBottom: 16, color: '#fff', fontSize: 16 }}>Personnaliser le Chatbot</h3> */}
      {/* Couleur principale */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16, position: 'relative' }}>
        <InputLabel style={{ color: '#fff', marginRight: 10, minWidth: 120 }}>Couleur principale</InputLabel>
        <div
          style={{ width: 24, height: 24, borderRadius: 4, background: prefs.chatbotMainColor, border: '1px solid #ccc', cursor: 'pointer', marginRight: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.12)' }}
          onClick={() => setColorPickerOpen(o => ({ ...o, main: !o.main }))}
          ref={el => (colorPickerAnchor.current.main = el)}
        />
        {colorPickerOpen.main && (
          <div style={{ position: 'absolute', zIndex: 10010, top: 32, left: 0 }}>
            <div style={{ position: 'fixed', inset: 0 }} onClick={() => setColorPickerOpen(o => ({ ...o, main: false }))} />
            <SketchPicker
              color={prefs.chatbotMainColor}
              onChange={color => handleColorChange('chatbotMainColor', color)}
            />
          </div>
        )}
      </div>
      {/* Police */}
      <div style={{ marginBottom: 16 }}>
        <InputLabel style={{ color: '#fff', marginBottom: 10 }}>Police</InputLabel>
        <Select
          name="chatbotFontFamily"
          value={prefs.chatbotFontFamily}
          onChange={handleChange}
          fullWidth
          size="small"
          sx={{
            backgroundColor: '#777777',
            color: '#222',
            borderRadius: 2,
            
            fontFamily: prefs.chatbotFontFamily,
            '.MuiSelect-icon': { color: '#222' },
          }}
          MenuProps={{
            PaperProps: {
              style: {
                backgroundColor: '#fff',
                color: '#222',
              },
            },
          }}
        >
          {fontOptions.map(font => (
            <MenuItem key={font} value={font} style={{ fontFamily: font, color: '#222', background: '#fff' }}>{font}</MenuItem>
          ))}
        </Select>
      </div>
      {/* Fond question */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16, position: 'relative' }}>
        <InputLabel style={{ color: '#fff', marginRight: 10, minWidth: 120 }}>Fond question</InputLabel>
        <div
          style={{ width: 24, height: 24, borderRadius: 4, background: prefs.chatbotUserBgColor, border: '1px solid #ccc', cursor: 'pointer', marginRight: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.12)' }}
          onClick={() => setColorPickerOpen(o => ({ ...o, user: !o.user }))}
          ref={el => (colorPickerAnchor.current.user = el)}
        />
        {colorPickerOpen.user && (
          <div style={{ position: 'absolute', zIndex: 10010, top: 32, left: 0 }}>
            <div style={{ position: 'fixed', inset: 0 }} onClick={() => setColorPickerOpen(o => ({ ...o, user: false }))} />
            <SketchPicker
              color={prefs.chatbotUserBgColor}
              onChange={color => handleColorChange('chatbotUserBgColor', color)}
            />
          </div>
        )}
      </div>
      {/* Fond réponse */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16, position: 'relative' }}>
        <InputLabel style={{ color: '#fff', marginRight: 10, minWidth: 120 }}>Fond réponse</InputLabel>
        <div
          style={{ width: 24, height: 24, borderRadius: 4, background: prefs.chatbotBotBgColor, border: '1px solid #ccc', cursor: 'pointer', marginRight: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.12)' }}
          onClick={() => setColorPickerOpen(o => ({ ...o, bot: !o.bot }))}
          ref={el => (colorPickerAnchor.current.bot = el)}
        />
        {colorPickerOpen.bot && (
          <div style={{ position: 'absolute', zIndex: 10010, top: 32, left: 0 }}>
            <div style={{ position: 'fixed', inset: 0 }} onClick={() => setColorPickerOpen(o => ({ ...o, bot: false }))} />
            <SketchPicker
              color={prefs.chatbotBotBgColor}
              onChange={color => handleColorChange('chatbotBotBgColor', color)}
            />
          </div>
        )}
      </div>
      {/* Couleur de fond de la zone messages */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16, position: 'relative' }}>
        <InputLabel style={{ color: '#fff', marginRight: 10, minWidth: 120 }}>Fond messages</InputLabel>
        <div
          style={{ width: 24, height: 24, borderRadius: 4, background: prefs.chatbotMessagesBgColor, border: '1px solid #ccc', cursor: 'pointer', marginRight: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.12)' }}
          onClick={() => setColorPickerOpen(o => ({ ...o, messages: !o.messages }))}
          ref={el => (colorPickerAnchor.current.messages = el)}
        />
        {colorPickerOpen.messages && (
          <div style={{ position: 'absolute', zIndex: 10010, top: 32, left: 0 }}>
            <div style={{ position: 'fixed', inset: 0 }} onClick={() => setColorPickerOpen(o => ({ ...o, messages: false }))} />
            <SketchPicker color={prefs.chatbotMessagesBgColor} onChange={color => handleColorChange('chatbotMessagesBgColor', color)} />
          </div>
        )}
      </div>
      {/* Image de fond de la zone messages */}
      <div style={{ marginBottom: 16 }}>
        <InputLabel style={{ color: '#fff', marginBottom: 10 }}>Image fond messages</InputLabel>
        <input type="file" accept="image/*" onChange={e => handleImageUpload(e, 'chatbotMessagesBgImage')} />
        {prefs.chatbotMessagesBgImage && (
          <div style={{ marginTop: 8 }}>
            <img src={prefs.chatbotMessagesBgImage} alt="Aperçu" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8 }} />
            <Button onClick={() => {
              const newPrefs = { ...prefs, chatbotMessagesBgImage: '' };
              setPrefs(newPrefs);
              onLiveChange && onLiveChange(newPrefs);
            }}>
              <Icon icon="fa-solid:trash" width="18" height="18" color="#d32f2f" />
            </Button>
          </div>
        )}
      </div>
      {/* Border radius */}
      <div style={{ marginBottom: 16 }}>
        <InputLabel style={{ color: '#fff', marginRight: 10, minWidth: 120 }}>Arrondi fenêtre (px)</InputLabel>
        <input
          type="range"
          min={0}
          max={32}
          value={prefs.chatbotBorderRadius}
          onChange={handleBorderRadiusChange}
          style={{ width: 120, verticalAlign: 'middle', marginLeft: 8 }}
        />
        <span style={{ color: '#fff', marginLeft: 8 }}>{prefs.chatbotBorderRadius}px</span>
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
        <Button
          onClick={handleSave}
          disabled={loading}
          style={{
            padding: '8px',
            backgroundColor: '#777777',
            color: 'white',
            border: 'none',
            borderRadius: 10,
            cursor: 'pointer',
            
            fontWeight: 500,
            minWidth: 80,
          }}
        >
          Save
        </Button>
        {success && <span style={{ color: 'green', marginLeft: 8 }}>Modifications enregistrées</span>}
      </div>
    </div>
  );
} 