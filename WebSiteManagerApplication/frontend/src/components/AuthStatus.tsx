import React from 'react';
import { useAuth } from '../hooks/useAuth';

/**
 * Composant pour afficher le statut d'authentification
 * Exemple d'utilisation du hook useAuth
 */
const AuthStatus: React.FC = () => {
  const { user, isAuthenticated, isLoading, logout, isTokenValid } = useAuth();

  if (isLoading) {
    return (
      <div className="auth-status loading">
        <span>Vérification de l'authentification...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="auth-status not-authenticated">
        <span>Non connecté</span>
        <a href="/authentication/" className="default-btn">
          Se connecter
        </a>
      </div>
    );
  }

  const tokenValid = isTokenValid();

  return (
    <div className="auth-status authenticated">
      <div className="user-info">
        <span>Connecté en tant que: <strong>{user?.email}</strong></span>
        <span className={`token-status ${tokenValid ? 'valid' : 'invalid'}`}>
          Token: {tokenValid ? 'Valide' : 'Expiré'}
        </span>
      </div>
      <button 
        onClick={logout} 
        className="default-btn"
        style={{ marginLeft: '10px' }}
      >
        Se déconnecter
      </button>
    </div>
  );
};

export default AuthStatus;
