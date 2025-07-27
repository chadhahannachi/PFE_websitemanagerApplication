

import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.replace('http://localhost:3001/');
    return null;
  }
  return children;
};

export default ProtectedRoute;