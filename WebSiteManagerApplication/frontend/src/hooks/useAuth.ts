import { useState, useEffect } from 'react';
import { buildApiUrl, API_CONFIG } from '../config/api';

interface User {
  id: string;
  email: string;
  token: string;
  [key: string]: any;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté au chargement de l'application
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (error) {
        console.error('Erreur lors du parsing des données utilisateur:', error);
        // Nettoyer les données corrompues
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } else {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.AUTH.LOGIN), {
        method: "POST",
        headers: API_CONFIG.HEADERS,
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Stocker les données d'authentification
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data));

        // Mettre à jour l'état d'authentification
        setAuthState({
          user: data,
          isAuthenticated: true,
          isLoading: false,
        });

        return { success: true };
      } else {
        return {
          success: false,
          error: data.message || "Erreur lors de la connexion"
        };
      }
    } catch (error) {
      console.error("Erreur réseau:", error);
      return {
        success: false,
        error: "Erreur réseau lors de la connexion"
      };
    }
  };

  const logout = () => {
    // Supprimer les données d'authentification
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Mettre à jour l'état d'authentification
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  const getToken = (): string | null => {
    return localStorage.getItem('token');
  };

  const isTokenValid = (): boolean => {
    const token = getToken();
    if (!token) return false;

    try {
      // Décoder le JWT pour vérifier l'expiration
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;

      return payload.exp > currentTime;
    } catch (error) {
      console.error('Erreur lors de la validation du token:', error);
      return false;
    }
  };

  return {
    ...authState,
    login,
    logout,
    getToken,
    isTokenValid,
  };
};

export default useAuth;
