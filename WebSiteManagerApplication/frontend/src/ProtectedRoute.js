// import { Navigate } from "react-router-dom";

// const ProtectedRoute = ({ element, allowedRoles }) => {
//   const userRole = localStorage.getItem("userRole"); // Récupérer le rôle depuis le stockage

//   return allowedRoles.includes(userRole) ? element : <Navigate to="/login" />; // Redirection si non autorisé
// };

// export default ProtectedRoute;




import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    // Redirige vers la page de login (ou autre)
    return <Navigate to="/" replace />;
  }
  return children;
};

export default ProtectedRoute;