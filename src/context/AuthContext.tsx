import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

export interface User {
  _id: string;
  name: string;
  email: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  height: number;
  weight: number;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goal: 'maintain' | 'gain' | 'lose';
  calorieGoal: number;
  proteinGoal: number;
  carbGoal: number;
  fatGoal: number;
  createdAt?: string;
}

export interface UserStreak {
  currentStreak: number;
  longestStreak: number;
  activeDates: string[];
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  streak: UserStreak | null;
  login: (email: string, password: string) => Promise<void>;
  demoLogin: () => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User> & { autoRecalculateGoals?: boolean }) => Promise<void>;
  updateGoals: (goals: { calorieGoal: number; proteinGoal: number; carbGoal: number; fatGoal: number }) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('nutritrack_token'));
  const [streak, setStreak] = useState<UserStreak | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/users/profile');
      setUser(res.data.user);
      setStreak(res.data.streak);
      localStorage.setItem('nutritrack_user', JSON.stringify(res.data.user));
    } catch {
      // Token expired or invalid
      setToken(null);
      setUser(null);
      localStorage.removeItem('nutritrack_token');
      localStorage.removeItem('nutritrack_user');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchProfile();
    } else {
      setIsLoading(false);
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('nutritrack_token', res.data.token);
    setToken(res.data.token);
    setUser(res.data.user);
    await fetchProfile();
  };

  const demoLogin = async () => {
    const res = await api.post('/auth/demo-login');
    localStorage.setItem('nutritrack_token', res.data.token);
    setToken(res.data.token);
    setUser(res.data.user);
    await fetchProfile();
  };

  const register = async (data: any) => {
    const res = await api.post('/auth/register', data);
    localStorage.setItem('nutritrack_token', res.data.token);
    setToken(res.data.token);
    setUser(res.data.user);
    await fetchProfile();
  };

  const logout = () => {
    localStorage.removeItem('nutritrack_token');
    localStorage.removeItem('nutritrack_user');
    setToken(null);
    setUser(null);
    setStreak(null);
  };

  const updateProfile = async (data: Partial<User> & { autoRecalculateGoals?: boolean }) => {
    const res = await api.put('/users/profile', data);
    setUser(res.data.user);
  };

  const updateGoals = async (goals: { calorieGoal: number; proteinGoal: number; carbGoal: number; fatGoal: number }) => {
    const res = await api.put('/users/goals', goals);
    setUser(res.data.user);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        streak,
        login,
        demoLogin,
        register,
        logout,
        updateProfile,
        updateGoals,
        refreshProfile: fetchProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
