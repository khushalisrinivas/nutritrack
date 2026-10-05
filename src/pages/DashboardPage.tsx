import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNutrition } from '../context/NutritionContext';
import { MacroProgressCard } from '../components/MacroProgressCard';
import { MealTimelineCard } from '../components/MealTimelineCard';
import { AiInsightsCard } from '../components/AiInsightsCard';
import { SmartEmptyState } from '../components/SmartEmptyState';
import { AddMealModal } from '../components/AddMealModal';
import { QuickAddModal } from '../components/QuickAddModal';
import { Flame, Plus, Activity, Calendar, Sparkles } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user, streak } = useAuth();
  const { entries, summary, selectedDate, setSelectedDate } = useNutrition();

  const [isAddMealOpen, setIsAddMealOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [activeSlot, setActiveSlot] = useState<'breakfast' | 'lunch' | 'snack' | 'dinner'>('breakfast');

  // Greeting based on current hour
  const currentHour = new Date().getHours();
  let greetingTime = 'Good morning';
  if (currentHour >= 12 && currentHour < 17) greetingTime = 'Good afternoon';
  if (currentHour >= 17) greetingTime = 'Good evening';

  const handleOpenAddForSlot = (slot: 'breakfast' | 'lunch' | 'snack' | 'dinner') => {
    setActiveSlot(slot);
    setIsAddMealOpen(true);
  };

  const isToday = selectedDate === new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-8">
      {/* Top Banner & Greetings */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200/90 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
              Live Real-Time Dashboard
            </span>
            {!isToday && (
              <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                Viewing Historical Date: {selectedDate}
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            {greetingTime}, {user?.name || 'Friend'} 👋
          </h1>
          <p className="text-sm text-stone-500 mt-0.5">
            Here's your nutrition and macronutrient summary for {isToday ? 'today' : selectedDate}.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />

          <button
            onClick={() => setIsQuickAddOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs sm:text-sm border border-stone-200 transition-colors cursor-pointer"
          >
            <Activity className="w-4 h-4 text-stone-600" />
            <span>Quick Add</span>
          </button>

          <button
            onClick={() => {
              setActiveSlot('breakfast');
              setIsAddMealOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/30 transition-all cursor-pointer hover:scale-102"
          >
            <Plus className="w-4 h-4" />
            <span>+ Log Meal</span>
          </button>
        </div>
      </div>

      {/* Daily Progress & Macros Card */}
      <MacroProgressCard summary={summary} />

      {/* AI Nutrition Insights Card */}
      <AiInsightsCard />

      {/* Meal Timeline */}
      {entries.length === 0 ? (
        <SmartEmptyState
          onAddMeal={() => {
            setActiveSlot('breakfast');
            setIsAddMealOpen(true);
          }}
          title="Your plate is waiting 🍽️"
          description={`No meals logged yet for ${isToday ? 'today' : selectedDate}. Track your breakfast, lunch, or quick snack to view real-time calories and macros.`}
        />
      ) : (
        <MealTimelineCard
          entries={entries}
          onOpenAddMealForSlot={handleOpenAddForSlot}
        />
      )}

      {/* Modals */}
      <AddMealModal
        isOpen={isAddMealOpen}
        onClose={() => setIsAddMealOpen(false)}
        defaultMealType={activeSlot}
      />

      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
      />
    </div>
  );
};
