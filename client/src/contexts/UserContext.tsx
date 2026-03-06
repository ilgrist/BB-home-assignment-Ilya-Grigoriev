import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserCheckStatusResponse } from '../types/User';
import { apiClient } from '../api/client';

export interface User extends UserCheckStatusResponse {
  email: string;
}

interface UserContextType {
  user: User | null;
  login: (email: string) => Promise<UserCheckStatusResponse>;
  logout: () => void;
  isLoading: boolean;
  isInitializing: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'user_status';

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    }
    setIsInitializing(false);
  }, []);

  const login = async (email: string): Promise<UserCheckStatusResponse> => {
    setIsLoading(true);
    try {
      const statusResponse = await apiClient.checkUserStatus(email);

      if (statusResponse.status === 'blacklisted') {
        // Don't set user if blacklisted
        return statusResponse;
      }

      const userData: User = {
        email,
        ...statusResponse
      };

      setUser(userData);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));

      return statusResponse;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
  };

  const value: UserContextType = {
    user,
    login,
    logout,
    isLoading,
    isInitializing
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}