import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  UtensilsCrossed,
  Search,
  BarChart3,
  Calendar,
  User,
} from 'lucide-react';

interface MobileNavProps {
  onOpenAddMeal: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ onOpenAddMeal }) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-t border-stone-200 px-2 py-1.5 flex items-center justify-around shadow-lg">
      <NavLink
        to="/dashboard"
        className={({ isActive }) =>
          `flex flex-col items-center gap-0.5 p-1 text-[11px] font-medium transition-colors ${
            isActive ? 'text-emerald-600 font-bold' : 'text-stone-500 hover:text-stone-900'
          }`
        }
      >
        <LayoutDashboard className="w-5 h-5" />
        <span>Home</span>
      </NavLink>

      <NavLink
        to="/tracker"
        className={({ isActive }) =>
          `flex flex-col items-center gap-0.5 p-1 text-[11px] font-medium transition-colors ${
            isActive ? 'text-emerald-600 font-bold' : 'text-stone-500 hover:text-stone-900'
          }`
        }
      >
        <UtensilsCrossed className="w-5 h-5" />
        <span>Tracker</span>
      </NavLink>

      {/* Floating Center Add Button */}
      <button
        onClick={onOpenAddMeal}
        className="-mt-5 w-12 h-12 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-lg shadow-emerald-600/40 cursor-pointer"
        aria-label="Add Meal"
      >
        <span className="text-2xl font-bold leading-none mb-0.5">+</span>
      </button>

      <NavLink
        to="/search"
        className={({ isActive }) =>
          `flex flex-col items-center gap-0.5 p-1 text-[11px] font-medium transition-colors ${
            isActive ? 'text-emerald-600 font-bold' : 'text-stone-500 hover:text-stone-900'
          }`
        }
      >
        <Search className="w-5 h-5" />
        <span>Search</span>
      </NavLink>

      <NavLink
        to="/analytics"
        className={({ isActive }) =>
          `flex flex-col items-center gap-0.5 p-1 text-[11px] font-medium transition-colors ${
            isActive ? 'text-emerald-600 font-bold' : 'text-stone-500 hover:text-stone-900'
          }`
        }
      >
        <BarChart3 className="w-5 h-5" />
        <span>Insights</span>
      </NavLink>
    </nav>
  );
};
