import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useNutrition, FoodEntryItem } from '../context/NutritionContext';
import { MealTimelineCard } from '../components/MealTimelineCard';
import { AddMealModal } from '../components/AddMealModal';
import { Calendar as CalendarIcon, Search, Filter, Trash2, Edit3, ChevronLeft, ChevronRight, Check } from 'lucide-react';

export const FoodHistoryPage: React.FC = () => {
  const { deleteFoodEntry, updateFoodEntry } = useNutrition();

  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [dayEntries, setDayEntries] = useState<FoodEntryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [mealTypeFilter, setMealTypeFilter] = useState<'all' | 'breakfast' | 'lunch' | 'snack' | 'dinner'>('all');

  // Modal
  const [isAddMealOpen, setIsAddMealOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<'breakfast' | 'lunch' | 'snack' | 'dinner'>('breakfast');

  const fetchHistoryForDate = async (targetDate: string) => {
    setLoading(true);
    try {
      const res = await api.get(`/foods?date=${targetDate}`);
      setDayEntries(res.data.entries || []);
    } catch (err) {
      console.error('Failed to load history for date:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistoryForDate(date);
  }, [date]);

  const handlePrevDay = () => {
    const d = new Date(date);
    d.setDate(d.getDate() - 1);
    setDate(d.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const d = new Date(date);
    d.setDate(d.getDate() + 1);
    setDate(d.toISOString().split('T')[0]);
  };

  // Filter entries
  const filteredEntries = dayEntries.filter((e) => {
    if (mealTypeFilter !== 'all' && e.mealType !== mealTypeFilter) return false;
    if (searchFilter && !e.foodName.toLowerCase().includes(searchFilter.toLowerCase())) return false;
    return true;
  });

  const totalCalories = filteredEntries.reduce((acc, curr) => acc + (curr.calories || 0), 0);
  const totalProtein = Math.round(filteredEntries.reduce((acc, curr) => acc + (curr.protein || 0), 0) * 10) / 10;
  const totalCarbs = Math.round(filteredEntries.reduce((acc, curr) => acc + (curr.carbohydrates || 0), 0) * 10) / 10;
  const totalFat = Math.round(filteredEntries.reduce((acc, curr) => acc + (curr.fats || 0), 0) * 10) / 10;

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="space-y-6">
      {/* Header and Date Selector */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200/90 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
              Calendar & Timeline Logs
            </span>
            <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight mt-2">
              Food History & Historical Day Breakdown
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Review any past date's complete nutrition breakdown with search and filter
            </p>
          </div>

          {/* Quick Date Switcher */}
          <div className="flex items-center gap-2 bg-stone-50 p-2 rounded-2xl border border-stone-200">
            <button
              onClick={handlePrevDay}
              className="p-1.5 rounded-xl hover:bg-stone-200/70 text-stone-700 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="px-2 py-1 bg-transparent text-xs font-bold text-stone-900 cursor-pointer focus:outline-none"
            />
            <button
              onClick={handleNextDay}
              className="p-1.5 rounded-xl hover:bg-stone-200/70 text-stone-700 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2">
          <div className="sm:col-span-8 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
            <input
              type="text"
              placeholder="Search historical meals by name..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-10 pr-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div className="sm:col-span-4">
            <select
              value={mealTypeFilter}
              onChange={(e) => setMealTypeFilter(e.target.value as any)}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="all">All Meal Windows</option>
              <option value="breakfast">🌅 Breakfast only</option>
              <option value="lunch">🥗 Lunch only</option>
              <option value="snack">☕ Snack only</option>
              <option value="dinner">🌙 Dinner only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Daily Summary Metric Ribbon */}
      <div className="bg-emerald-900 text-white p-5 rounded-3xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-emerald-300">Selected Date:</span>
          <h2 className="text-xl font-extrabold text-white">{formattedDate}</h2>
        </div>

        <div className="flex items-center gap-6 text-xs sm:text-sm font-semibold">
          <div>
            <span className="text-emerald-300 text-[11px] block">Total Calories</span>
            <span className="text-2xl font-black text-amber-300">{totalCalories} kcal</span>
          </div>
          <div>
            <span className="text-emerald-300 text-[11px] block">Protein</span>
            <span className="font-extrabold text-white">{totalProtein}g</span>
          </div>
          <div>
            <span className="text-emerald-300 text-[11px] block">Carbs</span>
            <span className="font-extrabold text-white">{totalCarbs}g</span>
          </div>
          <div>
            <span className="text-emerald-300 text-[11px] block">Fats</span>
            <span className="font-extrabold text-white">{totalFat}g</span>
          </div>
        </div>
      </div>

      {/* Timeline or Empty State */}
      {loading ? (
        <div className="py-20 text-center text-xs text-stone-400">Loading historical meal data...</div>
      ) : filteredEntries.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-stone-300">
          <CalendarIcon className="w-10 h-10 text-stone-300 mx-auto mb-2" />
          <h3 className="text-base font-bold text-stone-800">No meals logged for {formattedDate}</h3>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            You can log meals retroactively to maintain your accurate tracking history and weekly averages.
          </p>
          <button
            onClick={() => {
              setSelectedSlot('breakfast');
              setIsAddMealOpen(true);
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            + Log Meal for this Date
          </button>
        </div>
      ) : (
        <MealTimelineCard
          entries={filteredEntries}
          onOpenAddMealForSlot={(slot) => {
            setSelectedSlot(slot);
            setIsAddMealOpen(true);
          }}
        />
      )}

      {/* Add Modal */}
      <AddMealModal
        isOpen={isAddMealOpen}
        onClose={() => {
          setIsAddMealOpen(false);
          fetchHistoryForDate(date);
        }}
        defaultMealType={selectedSlot}
      />
    </div>
  );
};
