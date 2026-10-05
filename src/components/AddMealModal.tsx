import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useNutrition } from '../context/NutritionContext';
import { Search, X, Check, Utensils, Sparkles, Filter } from 'lucide-react';

interface AddMealModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMealType?: 'breakfast' | 'lunch' | 'snack' | 'dinner';
}

export const AddMealModal: React.FC<AddMealModalProps> = ({
  isOpen,
  onClose,
  defaultMealType = 'breakfast',
}) => {
  const { addFoodEntry, selectedDate } = useNutrition();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'indian' | 'global'>('all');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Selected food item
  const [selectedFood, setSelectedFood] = useState<any | null>(null);

  // Form fields
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'snack' | 'dinner'>(defaultMealType);
  const [servingMultiplier, setServingMultiplier] = useState<number>(1);
  const [servingLabel, setServingLabel] = useState<string>('');
  const [date, setDate] = useState<string>(selectedDate);
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setMealType(defaultMealType);
  }, [defaultMealType]);

  useEffect(() => {
    setDate(selectedDate);
  }, [selectedDate]);

  // Search catalog with debounce
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await api.get(`/foods/search?q=${encodeURIComponent(searchQuery)}&filter=${filterType}`);
        setSearchResults(res.data.results || []);
      } catch (err) {
        console.error('Food search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery, filterType, isOpen]);

  const handleSelectFood = (food: any) => {
    setSelectedFood(food);
    setServingMultiplier(1);
    setServingLabel(food.defaultServing || '1 serving');
  };

  const handleServingMultiplierChange = (mult: number, label: string) => {
    setServingMultiplier(mult);
    setServingLabel(label);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFood) return;

    setIsSubmitting(true);
    try {
      await addFoodEntry({
        foodName: selectedFood.name,
        mealType,
        servingSize: servingLabel || selectedFood.defaultServing,
        servingMultiplier,
        calories: selectedFood.baseCalories,
        protein: selectedFood.baseProtein,
        carbohydrates: selectedFood.baseCarbs,
        fats: selectedFood.baseFat,
        fiber: selectedFood.baseFiber || 0,
        date,
        notes,
        source: selectedFood.isIndian ? 'indian_db' : 'usda',
        category: selectedFood.category || 'General',
      });

      onClose();
      // Reset form
      setSelectedFood(null);
      setSearchQuery('');
      setNotes('');
    } catch (err) {
      console.error('Failed to log meal:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const calculatedCalories = selectedFood ? Math.round(selectedFood.baseCalories * servingMultiplier) : 0;
  const calculatedProtein = selectedFood ? Math.round(selectedFood.baseProtein * servingMultiplier * 10) / 10 : 0;
  const calculatedCarbs = selectedFood ? Math.round(selectedFood.baseCarbs * servingMultiplier * 10) / 10 : 0;
  const calculatedFat = selectedFood ? Math.round(selectedFood.baseFat * servingMultiplier * 10) / 10 : 0;
  const calculatedFiber = selectedFood ? Math.round((selectedFood.baseFiber || 0) * servingMultiplier * 10) / 10 : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-stone-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Utensils className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-stone-900">Log Food to Daily Tracker</h3>
              <p className="text-xs text-stone-500">Search Indian meals or international foods</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* Step 1: Search & Filter */}
          {!selectedFood ? (
            <div className="space-y-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search Indian meals (e.g. Chicken Biryani, Dosa, Dal, Paneer, Rice, Poha)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  autoFocus
                />
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-2 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setFilterType('all')}
                  className={`px-3 py-1.5 rounded-xl border transition-colors cursor-pointer ${
                    filterType === 'all'
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  All Foods
                </button>
                <button
                  type="button"
                  onClick={() => setFilterType('indian')}
                  className={`px-3 py-1.5 rounded-xl border transition-colors cursor-pointer flex items-center gap-1 ${
                    filterType === 'indian'
                      ? 'bg-amber-600 text-white border-amber-600'
                      : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  <span>🇮🇳</span> Indian Foods
                </button>
                <button
                  type="button"
                  onClick={() => setFilterType('global')}
                  className={`px-3 py-1.5 rounded-xl border transition-colors cursor-pointer ${
                    filterType === 'global'
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  Global / USDA Foods
                </button>
              </div>

              {/* Results list */}
              <div className="border border-stone-200 rounded-2xl divide-y divide-stone-100 max-h-72 overflow-y-auto">
                {isSearching ? (
                  <div className="py-8 text-center text-xs text-stone-400">Searching catalog...</div>
                ) : searchResults.length === 0 ? (
                  <div className="py-8 text-center text-xs text-stone-400">
                    No food found matching "{searchQuery}". Try searching for dal, roti, paneer, or rice.
                  </div>
                ) : (
                  searchResults.map((food) => (
                    <button
                      key={food.id}
                      type="button"
                      onClick={() => handleSelectFood(food)}
                      className="w-full p-3 text-left hover:bg-stone-50 transition-colors flex items-center justify-between gap-3 group cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{food.imageEmoji || '🍽️'}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-stone-900 group-hover:text-emerald-700 transition-colors">
                              {food.name}
                            </span>
                            {food.isIndian && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200/60 font-semibold">
                                Indian
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-stone-500 mt-0.5">
                            Serving: {food.defaultServing} • {food.category}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-extrabold text-sm text-stone-900">
                          {food.baseCalories} kcal
                        </span>
                        <div className="text-[11px] text-stone-500">
                          P: {food.baseProtein}g • C: {food.baseCarbs}g • F: {food.baseFat}g
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          ) : (
            /* Step 2: Configure Selected Food */
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Selected Item Banner */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{selectedFood.imageEmoji || '🍽️'}</span>
                  <div>
                    <h4 className="font-bold text-stone-900">{selectedFood.name}</h4>
                    <p className="text-xs text-stone-600">{selectedFood.category} • {selectedFood.defaultServing}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedFood(null)}
                  className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 underline cursor-pointer"
                >
                  Change Food
                </button>
              </div>

              {/* Serving Size Presets */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                  Serving Size Preset
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(selectedFood.servingUnits || [
                    { label: '1 standard serving', multiplier: 1.0 },
                    { label: 'Half serving (0.5x)', multiplier: 0.5 },
                    { label: 'Large serving (1.5x)', multiplier: 1.5 },
                  ]).map((unit: any, idx: number) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleServingMultiplierChange(unit.multiplier, unit.label)}
                      className={`p-2.5 rounded-xl border text-xs font-medium text-left transition-all cursor-pointer ${
                        servingMultiplier === unit.multiplier
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold shadow-2xs'
                          : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                      }`}
                    >
                      <div className="truncate">{unit.label}</div>
                      <div className="text-[10px] text-stone-500 mt-0.5">
                        {Math.round(selectedFood.baseCalories * unit.multiplier)} kcal
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Meal Slot and Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                    Meal Type
                  </label>
                  <select
                    value={mealType}
                    onChange={(e) => setMealType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  >
                    <option value="breakfast">🌅 Breakfast</option>
                    <option value="lunch">🥗 Lunch</option>
                    <option value="snack">☕ Snack</option>
                    <option value="dinner">🌙 Dinner</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                    Log Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Optional Notes (preparation, ghee, sides)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Cooked in 1 tsp olive oil, no extra butter"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              {/* Calculated Macros Preview */}
              <div className="p-4 rounded-2xl bg-stone-100/80 border border-stone-200">
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-2">
                  Total Calculated Nutrition for this Meal
                </span>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="bg-white p-2 rounded-xl border border-stone-200/60 shadow-2xs">
                    <span className="text-xs text-stone-500 block">Calories</span>
                    <span className="font-extrabold text-stone-900 text-sm">{calculatedCalories} kcal</span>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-stone-200/60 shadow-2xs">
                    <span className="text-xs text-emerald-700 font-semibold block">Protein</span>
                    <span className="font-extrabold text-stone-900 text-sm">{calculatedProtein}g</span>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-stone-200/60 shadow-2xs">
                    <span className="text-xs text-amber-700 font-semibold block">Carbs</span>
                    <span className="font-extrabold text-stone-900 text-sm">{calculatedCarbs}g</span>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-stone-200/60 shadow-2xs">
                    <span className="text-xs text-indigo-700 font-semibold block">Fat</span>
                    <span className="font-extrabold text-stone-900 text-sm">{calculatedFat}g</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedFood(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm shadow-emerald-600/30 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  <span>{isSubmitting ? 'Logging...' : 'Save to Timeline'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
