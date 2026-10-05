import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { NutritionProvider } from './context/NutritionContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { MobileNav } from './components/MobileNav';
import { AddMealModal } from './components/AddMealModal';
import { QuickAddModal } from './components/QuickAddModal';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { FoodTrackerPage } from './pages/FoodTrackerPage';
import { FoodSearchPage } from './pages/FoodSearchPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { FoodHistoryPage } from './pages/FoodHistoryPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';

// Protected App Layout
const AppLayout: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [isAddMealOpen, setIsAddMealOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center text-xs text-stone-500">
        Loading NutriTrack AI...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col selection:bg-emerald-500 selection:text-white pb-16 md:pb-0">
      <Navbar
        onOpenAddMeal={() => setIsAddMealOpen(true)}
        onOpenQuickAdd={() => setIsQuickAddOpen(true)}
      />

      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        <Sidebar onOpenAddMeal={() => setIsAddMealOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          <Outlet />
        </main>
      </div>

      <MobileNav onOpenAddMeal={() => setIsAddMealOpen(true)} />

      <AddMealModal
        isOpen={isAddMealOpen}
        onClose={() => setIsAddMealOpen(false)}
      />

      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <NutritionProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Protected Routes */}
              <Route element={<AppLayout />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/tracker" element={<FoodTrackerPage />} />
                <Route path="/search" element={<FoodSearchPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/history" element={<FoodHistoryPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </NutritionProvider>
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
