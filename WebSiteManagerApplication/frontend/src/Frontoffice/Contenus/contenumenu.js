// src/components/ContenuMenu.js
import React from 'react';
import { Link } from 'react-router-dom';
import { contenuTypes } from './contenuTypes';



const ContenuMenu = () => {
  return (
    <div style={{ padding: 20 }}>
      <h2>Menu</h2>
      {Object.keys(contenuTypes).map((type) => (
        <Link key={type} to={`/contenus/${type}`} style={{ marginRight: 10 }}>
          {contenuTypes[type].label}
        </Link>
      ))}
      <Link to="/add" style={{ marginLeft: 20, fontWeight: 'bold' }}>
         Ajouter Contenu
      </Link>
    </div>
  );
};

export default ContenuMenu;
