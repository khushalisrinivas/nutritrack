import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { Flame, Plus, Sparkles, LogOut, User, Activity } from 'lucide-react';

interface NavbarProps {
  onOpenQuickAdd: () => void;
  onOpenAddMeal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenQuickAdd, onOpenAddMeal }) => {
  const { user, streak, logout } = useAuth();
  const { isConnected } = useSocket();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-amber-500 flex items-center justify-center shadow-sm shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <span className="text-white font-extrabold text-xl tracking-tight">N</span>
              </div>
              <div>
                <span className="text-xl font-bold text-stone-900 tracking-tight flex items-center gap-1.5">
                  NutriTrack <span className="text-xs px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold uppercase tracking-wider">AI</span>
                </span>
                <span className="hidden sm:block text-[11px] text-stone-600 font-medium -mt-1">
                  Indian Nutrition & Macros
                </span>
              </div>
            </Link>

            {/* Real-time sync badge */}
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-100 border border-stone-200 text-xs font-medium text-stone-700">
              <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-stone-500'}`} />
              <span>{isConnected ? 'Real-Time Live' : 'Connecting...'}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Habit Streak Badge */}
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-900 font-semibold text-xs sm:text-sm shadow-2xs"
              title={`${streak?.currentStreak || 0} consecutive days logged`}
            >
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-bounce" />
              <span>{streak?.currentStreak || 1} Day Streak</span>
            </div>

            {/* Quick Add Button */}
            <button
              onClick={onOpenQuickAdd}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-medium text-xs sm:text-sm border border-stone-200 transition-colors cursor-pointer"
            >
              <Activity className="w-3.5 h-3.5 text-stone-600" />
              <span>Quick Add</span>
            </button>

            {/* Log Meal Button */}
            <button
              onClick={onOpenAddMeal}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm shadow-sm shadow-emerald-600/30 transition-all cursor-pointer hover:shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Log Meal</span>
            </button>

            {/* User Profile / Menu */}
            <div className="flex items-center gap-2 pl-2 border-l border-stone-200">
              <Link
                to="/profile"
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-stone-100 text-stone-700 transition-colors"
                title="Your Profile"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="hidden lg:block text-sm font-medium text-stone-800">
                  {user?.name}
                </span>
              </Link>

              <button
                onClick={handleLogout}
                className="p-2 rounded-xl text-stone-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
