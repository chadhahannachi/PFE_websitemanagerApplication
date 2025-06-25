/**
 * Utilitaires d'authentification
 * Fonctions helper pour gérer l'authentification dans l'application
 */

import { getAuthHeaders, buildApiUrl, API_CONFIG } from '../config/api';

/**
 * Vérifie si l'utilisateur est connecté
 */
export const isUserAuthenticated = (): boolean => {
  const token = localStorage.getItem('token');
  return !!token;
};

/**
 * Récupère les informations de l'utilisateur connecté
 */
export const getCurrentUser = (): any | null => {
  try {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Erreur lors de la récupération des données utilisateur:', error);
    return null;
  }
};

/**
 * Effectue une requête API authentifiée
 */
export const authenticatedFetch = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const url = endpoint.startsWith('http') ? endpoint : buildApiUrl(endpoint);
  
  const config: RequestInit = {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  };

  const response = await fetch(url, config);

  // Si le token est expiré (401), déconnecter l'utilisateur
  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/authentication/';
  }

  return response;
};

/**
 * Déconnecte l'utilisateur
 */
export const logoutUser = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/authentication/';
};

/**
 * Redirige vers la page de connexion si l'utilisateur n'est pas authentifié
 */
export const requireAuth = (): boolean => {
  if (!isUserAuthenticated()) {
    window.location.href = '/authentication/';
    return false;
  }
  return true;
};

/**
 * Middleware pour protéger les routes
 */
export const withAuth = <T extends {}>(Component: React.ComponentType<T>) => {
  return (props: T) => {
    if (!requireAuth()) {
      return null;
    }
    return <Component {...props} />;
  };
};

/**
 * Hook pour les requêtes API authentifiées
 */
export const useAuthenticatedApi = () => {
  const get = async (endpoint: string) => {
    return authenticatedFetch(endpoint, { method: 'GET' });
  };

  const post = async (endpoint: string, data: any) => {
    return authenticatedFetch(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  };

  const put = async (endpoint: string, data: any) => {
    return authenticatedFetch(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  };

  const patch = async (endpoint: string, data: any) => {
    return authenticatedFetch(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  };

  const del = async (endpoint: string) => {
    return authenticatedFetch(endpoint, { method: 'DELETE' });
  };

  return { get, post, put, patch, delete: del };
};

/**
 * Vérifie les permissions de l'utilisateur
 */
export const hasPermission = (requiredRole: string): boolean => {
  const user = getCurrentUser();
  if (!user) return false;
  
  // Logique de vérification des rôles
  // À adapter selon votre système de rôles
  return user.role === requiredRole || user.role === 'admin';
};

/**
 * Composant de protection de route basé sur les rôles
 */
export const withRole = <T extends {}>(
  Component: React.ComponentType<T>,
  requiredRole: string
) => {
  return (props: T) => {
    if (!requireAuth() || !hasPermission(requiredRole)) {
      return (
        <div className="alert alert-danger">
          Vous n'avez pas les permissions nécessaires pour accéder à cette page.
        </div>
      );
    }
    return <Component {...props} />;
  };
};

export default {
  isUserAuthenticated,
  getCurrentUser,
  authenticatedFetch,
  logoutUser,
  requireAuth,
  withAuth,
  useAuthenticatedApi,
  hasPermission,
  withRole,
};
