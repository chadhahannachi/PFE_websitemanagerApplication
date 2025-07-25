import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsUpDownLeftRight, faTimes, faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons';

export default function EditorImage({ initialPosition = { top: 0, left: 0 }, initialStyles = { width: 400, height: 300 }, src, alt, onSelect, onPositionChange, onStyleChange, onImageChange }) {
  const [position, setPosition] = useState({
    top: initialPosition.top || 0,
    left: typeof initialPosition.left === 'number' ? initialPosition.left : 0,
  });
  const [styles, setStyles] = useState({
    width: parseFloat(initialStyles.width) || 400,
    height: initialStyles.height === 'auto' ? 300 : parseFloat(initialStyles.height) || 300,
    borderRadius: initialStyles.borderRadius || '0px',
    maxWidth: initialStyles.maxWidth || 'none',
  });
  const [imageSrc, setImageSrc] = useState(src);
  const [isDragging, setIsDragging] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [resizing, setResizing] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const offset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (isDragging || resizing) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    } else {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, resizing]);

  useEffect(() => {
    if (onPositionChange) {
      onPositionChange(position);
    }
  }, [position, onPositionChange]);

  useEffect(() => {
    if (onStyleChange) {
      onStyleChange(styles);
    }
  }, [styles, onStyleChange]);

  const handleMouseDown = (e) => {
    e.stopPropagation();
    offset.current = {
      x: e.clientX - position.left,
      y: e.clientY - position.top,
    };
    setIsDragging(true);
  };

  const handleGlobalMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        top: e.clientY - offset.current.y,
        left: e.clientX - offset.current.x,
      });
    } else if (resizing) {
      const deltaX = e.clientX - offset.current.x;
      const deltaY = e.clientY - offset.current.y;

      let newWidth = styles.width;
      let newHeight = styles.height;

      if (resizing === 'bottom-right') {
        newWidth = offset.current.width + deltaX;
        newHeight = offset.current.height + deltaY;
      } else if (resizing === 'bottom-left') {
        newWidth = offset.current.width - deltaX;
        newHeight = offset.current.height + deltaY;
      } else if (resizing === 'top-right') {
        newWidth = offset.current.width + deltaX;
        newHeight = offset.current.height - deltaY;
      } else if (resizing === 'top-left') {
        newWidth = offset.current.width - deltaX;
        newHeight = offset.current.height - deltaY;
      }

      newWidth = Math.max(newWidth, 50);
      newHeight = Math.max(newHeight, 50);

      setStyles((prev) => ({
        ...prev,
        width: newWidth,
        height: newHeight,
      }));
    }
  };

  const handleGlobalMouseUp = () => {
    setIsDragging(false);
    setResizing(null);
  };

  const handleResizeMouseDown = (handle, e) => {
    e.stopPropagation();
    setResizing(handle);
    offset.current = {
      x: e.clientX,
      y: e.clientY,
      width: styles.width,
      height: styles.height,
    };
  };

  const handleElementClick = (e) => {
    e.stopPropagation();
    setIsSelected(true);
    if (onSelect) onSelect('img');
  };

  // Sélection du fichier (ne fait rien tant qu'on n'a pas cliqué sur Uploader)
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
    }
  };

  // Upload sur Cloudinary quand on clique sur le bouton
  const handleUploadToCloudinary = async () => {
    if (!selectedFile) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('upload_preset', 'chadha');
    try {
      const response = await fetch('https://api.cloudinary.com/v1_1/duvcpe6mx/image/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (data.secure_url) {
        setImageSrc(data.secure_url);
        setSelectedFile(null);
        if (onImageChange) {
          onImageChange(data.secure_url);
        }
      } else {
        alert("Erreur lors de l'upload de l'image sur Cloudinary");
      }
    } catch (err) {
      alert("Erreur lors de l'upload de l'image sur Cloudinary");
    } finally {
      setUploading(false);
    }
  };

  const handleStyleChange = (property, value) => {
    setStyles((prev) => ({
      ...prev,
      [property]: value,
    }));
  };

  const renderControlButtons = () => {
    if (!isSelected) return null;

    return (
      <div
        className="element-controls"
        style={{
          position: 'absolute',
          top: position.top - 40,
          left: position.left,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '5px',
          backgroundColor: '#fff',
          padding: '8px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          zIndex: 1000,
        }}
      >
        <button
          onMouseDown={handleMouseDown}
          style={{
            cursor: 'grab',
            fontSize: '16px',
            color: '#000',
            background: '#fff',
            border: '1px solid #ccc',
            borderRadius: '4px',
            padding: '4px',
          }}
        >
          <FontAwesomeIcon icon={faArrowsUpDownLeftRight} />
        </button>
        <button
          onClick={() => setIsEditing(true)}
          style={{
            cursor: 'pointer',
            fontSize: '16px',
            color: '#000',
            background: '#fff',
            border: '1px solid #ccc',
            borderRadius: '4px',
            padding: '4px',
          }}
        >
          <FontAwesomeIcon icon={faWandMagicSparkles} />
        </button>
      </div>
    );
  };

  const renderResizeHandles = () => {
    if (!isSelected) return null;

    const handleSize = 8;
    const handles = [
      { name: 'top-left', cursor: 'nwse-resize', top: -handleSize / 2, left: -handleSize / 2 },
      { name: 'top-right', cursor: 'nesw-resize', top: -handleSize / 2, left: styles.width - handleSize / 2 },
      { name: 'bottom-left', cursor: 'nesw-resize', top: styles.height - handleSize / 2, left: -handleSize / 2 },
      { name: 'bottom-right', cursor: 'nwse-resize', top: styles.height - handleSize / 2, left: styles.width - handleSize / 2 },
    ];

    return handles.map((handle) => (
      <div
        key={handle.name}
        style={{
          position: 'absolute',
          top: position.top + handle.top,
          left: position.left + handle.left,
          width: handleSize,
          height: handleSize,
          backgroundColor: 'blue',
          cursor: handle.cursor,
          zIndex: 20,
        }}
        onMouseDown={(e) => handleResizeMouseDown(handle.name, e)}
      />
    ));
  };

  return (
    <div
      onClick={() => setIsSelected(false)}
      style={{ position: 'relative' }}
    >
      {renderControlButtons()}
      {renderResizeHandles()}
      {isEditing && (
        <div
          className="style-editor-panel visible"
          style={{
            position: 'absolute',
            top: `${position.top || 0}px`,
            left: `${(position.left || 0) + 300}px`,
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            zIndex: 100,
          }}
        >
          <button
            onClick={() => setIsEditing(false)}
            style={{
              position: 'absolute',
              top: '5px',
              right: '5px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px',
              color: '#999',
            }}
            aria-label="Close editor"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>

          <div className="style-controls">
            <h3>Edit Image Style</h3>
            <div>
              <label>Choose Image: </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                style={{ marginTop: '5px' }}
              />
              {selectedFile && (
                <button
                  onClick={handleUploadToCloudinary}
                  disabled={uploading}
                  style={{ marginLeft: '10px', padding: '5px 12px', borderRadius: '6px', border: 'none', background: '#777', color: 'white', cursor: uploading ? 'not-allowed' : 'pointer' }}
                >
                  {uploading ? 'Uploading...' : 'Uploader'}
                </button>
              )}
            </div>
            <div>
              <label>Width: </label>
              <input
                type="number"
                min="50"
                value={styles.width}
                onChange={(e) => handleStyleChange('width', parseInt(e.target.value))}
              />
            </div>
            <div>
              <label>Height: </label>
              <input
                type="number"
                min="50"
                value={styles.height}
                onChange={(e) => handleStyleChange('height', parseInt(e.target.value))}
              />
            </div>
            <div>
              <label>Border Radius: </label>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={parseFloat(styles.borderRadius || 0)}
                onChange={(e) => handleStyleChange('borderRadius', `${e.target.value}px`)}
              />
            </div>
          </div>
        </div>
      )}
      <img
        src={imageSrc}
        alt={alt}
        style={{
          ...styles,
          position: 'absolute',
          top: position.top,
          left: position.left,
          cursor: 'pointer',
          borderRadius: styles.borderRadius || '0px',
          maxWidth: styles.maxWidth,
        }}
        onClick={handleElementClick}
      />
    </div>
  );
}