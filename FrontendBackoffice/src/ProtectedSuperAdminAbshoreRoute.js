// // src/ProtectedSuperAdminAbshoreRoute.js
// import React, { useEffect, useState } from 'react';
// import { Navigate } from 'react-router-dom';
// import { jwtDecode } from "jwt-decode";
// import axios from "axios";

// const ProtectedSuperAdminAbshoreRoute = ({ children }) => {
//   const token = localStorage.getItem('token');

//   const [userRole, setUserRole] = useState("");
//   const [userEntreprise, setUserEntreprise] = useState("Entreprise");

  
//   useEffect(() => {
//     const fetchUserData = async () => {
//       const token = localStorage.getItem('token');
//       if (token) {
//         try {
//           const decodedToken = jwtDecode(token);
//           const userId = decodedToken.sub;
//           const response = await axios.get(`http://localhost:5000/auth/user/${userId}`, {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           });
//           setUserEntreprise(response.data.entreprise);
//           setUserRole(response.data.role); // Ajouté
//         } catch (error) {
//           console.error("Erreur lors de la récupération des données de l'utilisateur :", error);
//         }
//       }
//     };
//     fetchUserData();
//   }, []);


//   if (!token) {
//     return <Navigate to="/" replace />;
//   }

//   try {
//     const decodedToken = jwtDecode(token);
//     // Si le rôle est dans decodedToken.role, sinon adapte la clé
//     if (userRole !== 'superadminabshore' ) {
//       return <Navigate to="/" replace />;
//     }
//   } catch (e) {
//     return <Navigate to="/" replace />;
//   }

//   return children;
// };

// export default ProtectedSuperAdminAbshoreRoute;


import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const ProtectedSuperAdminAbshoreRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const [userRole, setUserRole] = useState(null); // null = pas encore chargé
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          const userId = decodedToken.sub;
          const response = await axios.get(`http://localhost:5000/auth/user/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUserRole(response.data.role);
        } catch (error) {
          setUserRole(null);
        }
      }
      setLoading(false);
    };
    fetchUserData();
  }, [token]);

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    // Affiche un loader ou rien le temps de charger
    return null;
  }

  if (userRole !== 'superadminabshore') {
    // return <Navigate to="/" replace />;
    window.location.replace('http://localhost:3001/');
    return null;
  }

  return children;
};

export default ProtectedSuperAdminAbshoreRoute;