import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element, allowedRoles }) => {
  const userRole = localStorage.getItem("userRole"); // Récupérer le rôle depuis le stockage

  return allowedRoles.includes(userRole) ? element : <Navigate to="/login" />; // Redirection si non autorisé
};

export default ProtectedRoute;
