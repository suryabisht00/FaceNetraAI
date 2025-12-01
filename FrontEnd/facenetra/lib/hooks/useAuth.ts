'use client';

import { useState, useEffect } from 'react';
import { authUtils } from '@/lib/utils/auth';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  vectorId: string;
  randomId: string;
  fullName?: string;
  username?: string;
  email?: string;
  profilePictureUrl?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
    
    // Listen for storage changes to update auth state
    const handleStorageChange = () => {
      checkAuth();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const checkAuth = () => {
    const token = authUtils.getAccessToken();
    if (token && !authUtils.isTokenExpired(token)) {
      const decoded = authUtils.decodeToken(token);
      if (decoded) {
        setUser({
          id: decoded.userId,
          vectorId: decoded.vectorId,
          randomId: decoded.randomId,
          fullName: decoded.fullName,
          username: decoded.username,
          email: decoded.email,
          profilePictureUrl: decoded.profilePictureUrl,
        });
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
    setIsLoading(false);
  };

  const login = (accessToken: string, refreshToken: string, userData?: User) => {
    authUtils.setTokens(accessToken, refreshToken);
    if (userData) {
      setUser(userData);
    } else {
      checkAuth();
    }
    setIsAuthenticated(true);
  };

  const logout = () => {
    authUtils.clearTokens();
    setUser(null);
    setIsAuthenticated(false);
    router.push('/login');
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkAuth,
  };
}
