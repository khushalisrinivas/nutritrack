import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  UtensilsCrossed,
  Search,
  BarChart3,
  Calendar,
  User,
  Settings,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  onOpenAddMeal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenAddMeal }) => {
  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Food Tracker', path: '/tracker', icon: UtensilsCrossed },
    { label: 'Food Search', path: '/search', icon: Search, badge: 'Indian DB' },
    { label: 'Analytics & Insights', path: '/analytics', icon: BarChart3 },
    { label: 'Food History', path: '/history', icon: Calendar },
    { label: 'Profile & Targets', path: '/profile', icon: User },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-stone-200 min-h-[calc(100vh-4rem)] p-4 shrink-0">
      <div className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-800 font-bold shadow-2xs'
                    : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 uppercase tracking-wider">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Promotion / Indian Diet Helper Card */}
      <div className="mt-auto pt-6">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-stone-900 text-white shadow-sm relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-emerald-500/20 rounded-full blur-xl" />
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
              Smart Diet AI
            </span>
          </div>
          <p className="text-xs text-stone-200 leading-relaxed mb-3">
            Track rotis, dal, biryani & curries with accurate Indian nutritional macros.
          </p>
          <button
            onClick={onOpenAddMeal}
            className="w-full py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs transition-colors cursor-pointer text-center"
          >
            + Log Indian Meal
          </button>
        </div>
      </div>
    </aside>
  );
};
