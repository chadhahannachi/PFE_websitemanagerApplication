// Configuration de l'API
export const API_CONFIG = {
  BASE_URL: 'http://localhost:5000',
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      SIGNUP: '/auth/signup',
      LOGOUT: '/auth/logout',
      RESET_PASSWORD: '/auth/reset-password',
      RESET_PASSWORD_REQUEST: '/auth/reset-password-request',
    },
    USERS: '/auth/users',
    ENTREPRISES: '/entreprises',
    CONTENUS: '/contenus',
  },
  HEADERS: {
    'Content-Type': 'application/json',
  },
};

// Helper function pour construire les URLs complètes
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function pour les requêtes avec authentification
export const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('token');
  return {
    ...API_CONFIG.HEADERS,
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export default API_CONFIG;
