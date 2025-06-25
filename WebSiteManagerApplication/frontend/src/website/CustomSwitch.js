

import React from "react";

const CustomSwitch = ({ checked, onChange }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>

    <button
      onClick={onChange}
      style={{
        width: 30,
        height: 30,
        borderRadius: "50%",
        border: "none",
        background: "#fff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        outline: "none",
        transition: "box-shadow 0.2s",
        marginRight: 10,
      }}
    >
      {checked ? (
        // Coche verte
        <svg width="32" height="32" viewBox="0 0 24 24">
          <path
            d="M9 16.2l-3.5-3.5 1.4-1.4L9 13.4l7.1-7.1 1.4 1.4z"
            fill="green"
          />
        </svg>
      ) : (
        // Croix rouge
        <svg width="32" height="32" viewBox="0 0 24 24">
          <path
            d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
            fill="red"
          />
        </svg>
      )}
    </button>
    
    {checked ? (
        <span>section selected</span>
      ) : (
        <span> section hidden </span>
      )}

    </div>
  );
};

export default CustomSwitch;