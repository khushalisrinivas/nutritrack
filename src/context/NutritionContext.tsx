import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { useAuth } from './AuthContext';
import { useSocket } from './SocketContext';

export interface FoodEntryItem {
  _id: string;
  userId: string;
  foodName: string;
  mealType: 'breakfast' | 'lunch' | 'snack' | 'dinner';
  servingSize: string;
  servingMultiplier?: number;
  calories: number;
  protein: number;
  carbohydrates: number;
  fats: number;
  fiber?: number;
  date: string;
  notes?: string;
  source: 'indian_db' | 'usda' | 'quick_add' | 'custom';
  category?: string;
  createdAt: string;
}

export interface DaySummary {
  date: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalFiber: number;
  mealBreakdown: {
    breakfast: { calories: number; count: number };
    lunch: { calories: number; count: number };
    snack: { calories: number; count: number };
    dinner: { calories: number; count: number };
  };
  entries: FoodEntryItem[];
}

interface NutritionContextType {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  entries: FoodEntryItem[];
  summary: DaySummary | null;
  isLoading: boolean;
  refreshDayData: () => Promise<void>;
  addFoodEntry: (data: any) => Promise<FoodEntryItem>;
  quickAddMeal: (data: any) => Promise<FoodEntryItem>;
  updateFoodEntry: (id: string, data: any) => Promise<FoodEntryItem>;
  deleteFoodEntry: (id: string) => Promise<void>;
}

const NutritionContext = createContext<NutritionContextType | undefined>(undefined);

export const NutritionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, refreshProfile } = useAuth();
  const { socket } = useSocket();

  const [selectedDate, setSelectedDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [entries, setEntries] = useState<FoodEntryItem[]>([]);
  const [summary, setSummary] = useState<DaySummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchDayData = useCallback(async (dateToFetch: string) => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    try {
      const res = await api.get(`/analytics/daily?date=${dateToFetch}`);
      setSummary(res.data.summary);
      setEntries(res.data.summary.entries || []);
    } catch (err) {
      console.error('Failed to fetch daily nutrition data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchDayData(selectedDate);
    } else {
      setEntries([]);
      setSummary(null);
    }
  }, [selectedDate, isAuthenticated, fetchDayData]);

  // Listen to Socket.IO real-time events
  useEffect(() => {
    if (!socket || !user) return;

    const handleFoodAdded = (newEntry: FoodEntryItem) => {
      if (newEntry.date === selectedDate) {
        setEntries((prev) => {
          if (prev.some((e) => e._id === newEntry._id)) return prev;
          return [newEntry, ...prev];
        });
      }
      refreshProfile();
    };

    const handleFoodUpdated = (updatedEntry: FoodEntryItem) => {
      if (updatedEntry.date === selectedDate) {
        setEntries((prev) => prev.map((e) => (e._id === updatedEntry._id ? updatedEntry : e)));
      } else {
        // Entry date was changed away from current date
        setEntries((prev) => prev.filter((e) => e._id !== updatedEntry._id));
      }
    };

    const handleFoodDeleted = ({ id, entryDate }: { id: string; entryDate: string }) => {
      if (entryDate === selectedDate) {
        setEntries((prev) => prev.filter((e) => e._id !== id));
      }
      refreshProfile();
    };

    const handleNutritionUpdated = (updatedSummary: DaySummary) => {
      if (updatedSummary.date === selectedDate) {
        setSummary(updatedSummary);
      }
    };

    const handleGoalUpdated = () => {
      refreshProfile();
      fetchDayData(selectedDate);
    };

    // Main room listeners
    socket.on('foodAdded', handleFoodAdded);
    socket.on('foodUpdated', handleFoodUpdated);
    socket.on('foodDeleted', handleFoodDeleted);
    socket.on('nutritionUpdated', handleNutritionUpdated);
    socket.on('goalUpdated', handleGoalUpdated);

    // Direct user channel listener
    const userChannel = `user_broadcast_${user._id}`;
    const handleBroadcast = (payload: { event: string; data: any }) => {
      if (payload.event === 'foodAdded') handleFoodAdded(payload.data);
      if (payload.event === 'foodUpdated') handleFoodUpdated(payload.data);
      if (payload.event === 'foodDeleted') handleFoodDeleted(payload.data);
      if (payload.event === 'nutritionUpdated') handleNutritionUpdated(payload.data);
      if (payload.event === 'goalUpdated') handleGoalUpdated();
    };
    socket.on(userChannel, handleBroadcast);

    return () => {
      socket.off('foodAdded', handleFoodAdded);
      socket.off('foodUpdated', handleFoodUpdated);
      socket.off('foodDeleted', handleFoodDeleted);
      socket.off('nutritionUpdated', handleNutritionUpdated);
      socket.off('goalUpdated', handleGoalUpdated);
      socket.off(userChannel, handleBroadcast);
    };
  }, [socket, user, selectedDate, refreshProfile, fetchDayData]);

  const addFoodEntry = async (data: any): Promise<FoodEntryItem> => {
    const res = await api.post('/foods', {
      ...data,
      date: data.date || selectedDate,
    });
    // Immediately update local state in case socket is delayed
    const newEntry = res.data.entry;
    if (newEntry.date === selectedDate) {
      setEntries((prev) => [newEntry, ...prev.filter((e) => e._id !== newEntry._id)]);
      if (res.data.daySummary) setSummary(res.data.daySummary);
    }
    return newEntry;
  };

  const quickAddMeal = async (data: any): Promise<FoodEntryItem> => {
    const res = await api.post('/foods/quick-add', {
      ...data,
      date: data.date || selectedDate,
    });
    const newEntry = res.data.entry;
    if (newEntry.date === selectedDate) {
      setEntries((prev) => [newEntry, ...prev.filter((e) => e._id !== newEntry._id)]);
      if (res.data.daySummary) setSummary(res.data.daySummary);
    }
    return newEntry;
  };

  const updateFoodEntry = async (id: string, data: any): Promise<FoodEntryItem> => {
    const res = await api.put(`/foods/${id}`, data);
    const updated = res.data.entry;
    if (updated.date === selectedDate) {
      setEntries((prev) => prev.map((e) => (e._id === id ? updated : e)));
      if (res.data.daySummary) setSummary(res.data.daySummary);
    }
    return updated;
  };

  const deleteFoodEntry = async (id: string): Promise<void> => {
    const res = await api.delete(`/foods/${id}`);
    setEntries((prev) => prev.filter((e) => e._id !== id));
    if (res.data.daySummary) setSummary(res.data.daySummary);
  };

  return (
    <NutritionContext.Provider
      value={{
        selectedDate,
        setSelectedDate,
        entries,
        summary,
        isLoading,
        refreshDayData: () => fetchDayData(selectedDate),
        addFoodEntry,
        quickAddMeal,
        updateFoodEntry,
        deleteFoodEntry,
      }}
    >
      {children}
    </NutritionContext.Provider>
  );
};

export function useNutrition() {
  const context = useContext(NutritionContext);
  if (!context) {
    throw new Error('useNutrition must be used within a NutritionProvider');
  }
  return context;
}
