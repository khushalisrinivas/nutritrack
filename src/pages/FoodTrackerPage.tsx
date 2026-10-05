import React, { useState } from 'react';
import { useNutrition } from '../context/NutritionContext';
import { MacroProgressCard } from '../components/MacroProgressCard';
import { MealTimelineCard } from '../components/MealTimelineCard';
import { AddMealModal } from '../components/AddMealModal';
import { QuickAddModal } from '../components/QuickAddModal';
import { SmartEmptyState } from '../components/SmartEmptyState';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus, Activity } from 'lucide-react';

export const FoodTrackerPage: React.FC = () => {
  const { entries, summary, selectedDate, setSelectedDate } = useNutrition();

  const [isAddMealOpen, setIsAddMealOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [activeSlot, setActiveSlot] = useState<'breakfast' | 'lunch' | 'snack' | 'dinner'>('breakfast');

  const handlePrevDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const handleToday = () => {
    setSelectedDate(new Date().toISOString().split('T')[0]);
  };

  const formattedDate = new Date(selectedDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const isToday = selectedDate === new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      {/* Date Navigation Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevDay}
            className="p-2 rounded-xl text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer"
            title="Previous Day"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="text-center sm:text-left">
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-extrabold text-stone-900">{formattedDate}</h2>
              {isToday && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase">
                  Today
                </span>
              )}
            </div>
            <p className="text-xs text-stone-500">
              {entries.length} items logged • {summary?.totalCalories || 0} kcal consumed
            </p>
          </div>

          <button
            onClick={handleNextDay}
            className="p-2 rounded-xl text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer"
            title="Next Day"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {!isToday && (
            <button
              onClick={handleToday}
              className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold cursor-pointer"
            >
              Jump to Today
            </button>
          )}

          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium">
            <CalendarIcon className="w-3.5 h-3.5 text-stone-500" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent focus:outline-none cursor-pointer"
            />
          </div>

          <button
            onClick={() => setIsQuickAddOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold border border-stone-200 transition-colors cursor-pointer flex items-center gap-1"
          >
            <Activity className="w-3.5 h-3.5 text-stone-600" />
            <span>Quick Add</span>
          </button>

          <button
            onClick={() => {
              setActiveSlot('breakfast');
              setIsAddMealOpen(true);
            }}
            className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm shadow-emerald-600/30 transition-all cursor-pointer flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Log Meal</span>
          </button>
        </div>
      </div>

      {/* Progress Cards */}
      <MacroProgressCard summary={summary} />

      {/* Meals Timeline */}
      {entries.length === 0 ? (
        <SmartEmptyState
          onAddMeal={() => {
            setActiveSlot('breakfast');
            setIsAddMealOpen(true);
          }}
          title="Your plate is waiting 🍽️"
          description={`No meals logged yet for ${formattedDate}. Start by tracking your breakfast or morning tea.`}
        />
      ) : (
        <MealTimelineCard
          entries={entries}
          onOpenAddMealForSlot={(slot) => {
            setActiveSlot(slot);
            setIsAddMealOpen(true);
          }}
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
