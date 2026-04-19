// patient-portal/src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/authService';
import { SessionExpiredModal } from '../components/auth/SessionExpiredModal';
import type { User, AuthContextType } from '../types/auth.types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSessionExpired, setIsSessionExpired] = useState(false);

  useEffect(() => {
    // Listen for session expiration events from API service
    const handleSessionExpired = () => {
      setIsSessionExpired(true);
      // Storage is already cleared by the interceptor
    };

    window.addEventListener('dentoai-session-expired', handleSessionExpired);
    return () => window.removeEventListener('dentoai-session-expired', handleSessionExpired);
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = authService.getToken();
      if (storedToken) {
        setToken(storedToken);
        try {
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
        } catch (error) {
          authService.removeToken();
          setToken(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const { user: loggedInUser, token: authToken } = await authService.login({
      email,
      password,
    });
    
    authService.setToken(authToken);
    setToken(authToken);
    setUser(loggedInUser);
  };

  const logout = () => {
    authService.removeToken();
    setToken(null);
    setUser(null);
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
      <SessionExpiredModal 
        isOpen={isSessionExpired} 
        onLogout={logout} 
      />
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
