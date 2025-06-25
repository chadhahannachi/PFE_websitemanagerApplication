import React, { useState } from 'react';

const EditableUnitGroup = ({ 
  children, 
  initialPosition = { top: 0, left: 0 }, 
  onDrag 
}) => {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.left,
      y: e.clientY - position.top
    });
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const newPosition = {
      top: e.clientY - dragStart.y,
      left: e.clientX - dragStart.x
    };
    setPosition(newPosition);
    if (onDrag) onDrag(newPosition);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      style={{
        position: 'relative',
        top: `${position.top}px`,
        left: `${position.left}px`,
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none'
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {children}
    </div>
  );
};

export default EditableUnitGroup;