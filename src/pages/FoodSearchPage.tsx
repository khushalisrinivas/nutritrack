import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useNutrition } from '../context/NutritionContext';
import { Search, Filter, Plus, Check, Info, Sparkles } from 'lucide-react';

export const FoodSearchPage: React.FC = () => {
  const { addFoodEntry, selectedDate } = useNutrition();

  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'indian' | 'global'>('all');
  const [foods, setFoods] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Selected food for detailed logging modal
  const [activeFood, setActiveFood] = useState<any | null>(null);
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'snack' | 'dinner'>('lunch');
  const [servingMultiplier, setServingMultiplier] = useState(1);
  const [servingLabel, setServingLabel] = useState('');
  const [date, setDate] = useState(selectedDate);
  const [notes, setNotes] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const fetchFoods = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/foods/search?q=${encodeURIComponent(query)}&filter=${filterType}`);
      setFoods(res.data.results || []);
    } catch (err) {
      console.error('Search foods failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchFoods();
    }, 250);
    return () => clearTimeout(timer);
  }, [query, filterType]);

  const handleOpenDetail = (food: any) => {
    setActiveFood(food);
    setServingMultiplier(1);
    setServingLabel(food.defaultServing);
    setIsSaved(false);
  };

  const handleSaveMeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeFood) return;

    try {
      await addFoodEntry({
        foodName: activeFood.name,
        mealType,
        servingSize: servingLabel || activeFood.defaultServing,
        servingMultiplier,
        calories: activeFood.baseCalories,
        protein: activeFood.baseProtein,
        carbohydrates: activeFood.baseCarbs,
        fats: activeFood.baseFat,
        fiber: activeFood.baseFiber || 0,
        date,
        notes,
        source: activeFood.isIndian ? 'indian_db' : 'usda',
        category: activeFood.category,
      });

      setIsSaved(true);
      setTimeout(() => {
        setActiveFood(null);
        setIsSaved(false);
      }, 900);
    } catch (err) {
      console.error('Failed to log meal:', err);
    }
  };

  const cals = activeFood ? Math.round(activeFood.baseCalories * servingMultiplier) : 0;
  const prot = activeFood ? Math.round(activeFood.baseProtein * servingMultiplier * 10) / 10 : 0;
  const carbs = activeFood ? Math.round(activeFood.baseCarbs * servingMultiplier * 10) / 10 : 0;
  const fats = activeFood ? Math.round(activeFood.baseFat * servingMultiplier * 10) / 10 : 0;

  return (
    <div className="space-y-6">
      {/* Title & Search bar */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200/90 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">
              Food & Nutrition Catalog
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Explore 120+ authentic Indian breakfast, lunch, curries, dals & international fitness foods
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-2xl">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterType === 'all'
                  ? 'bg-white text-stone-900 shadow-2xs'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              All Foods
            </button>
            <button
              onClick={() => setFilterType('indian')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                filterType === 'indian'
                  ? 'bg-amber-500 text-white shadow-2xs'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              <span>🇮🇳</span> Indian Foods
            </button>
            <button
              onClick={() => setFilterType('global')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterType === 'global'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              Global / USDA
            </button>
          </div>
        </div>

        <div className="relative">
          <Search className="w-5 h-5 absolute left-4 top-3.5 text-stone-400" />
          <input
            type="text"
            placeholder="Search food by name (e.g. Chicken biryani, Paneer, Dal tadka, Idli, Dosa, Rice, Samosa)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
          />
        </div>
      </div>

      {/* Food Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full py-16 text-center text-xs text-stone-400">
            Searching foods...
          </div>
        ) : foods.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-stone-200 p-8">
            <span className="text-4xl block mb-2">🍽️</span>
            <p className="font-bold text-stone-800">No matching food items found</p>
            <p className="text-xs text-stone-500 mt-1">Try searching for dosa, roti, dal, paneer, or chicken.</p>
          </div>
        ) : (
          foods.map((food) => (
            <div
              key={food.id}
              className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-3xl">{food.imageEmoji || '🍽️'}</span>
                    <div>
                      <h3 className="font-extrabold text-base text-stone-900 group-hover:text-emerald-700 transition-colors">
                        {food.name}
                      </h3>
                      <span className="text-[11px] text-stone-600 block mt-0.5">
                        {food.category}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      food.isIndian
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'bg-stone-50 text-stone-600 border-stone-200'
                    }`}
                  >
                    {food.isIndian ? '🇮🇳 Indian' : 'Global'}
                  </span>
                </div>

                <p className="text-xs text-stone-600 line-clamp-2 my-2.5 leading-relaxed">
                  {food.description}
                </p>

                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100 mb-4">
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-xs text-stone-600 font-semibold truncate pr-2">
                      Portion: {food.defaultServing}
                    </span>
                    <span className="text-sm font-extrabold text-stone-900">
                      {food.baseCalories} <span className="text-xs font-normal text-stone-500">kcal</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-[11px] pt-1 border-t border-stone-200/60 font-semibold">
                    <div>
                      <span className="text-stone-600 block text-[10px]">Protein</span>
                      <span className="text-emerald-700 font-bold">{food.baseProtein}g</span>
                    </div>
                    <div>
                      <span className="text-stone-600 block text-[10px]">Carbs</span>
                      <span className="text-amber-700 font-bold">{food.baseCarbs}g</span>
                    </div>
                    <div>
                      <span className="text-stone-600 block text-[10px]">Fat</span>
                      <span className="text-indigo-700 font-bold">{food.baseFat}g</span>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleOpenDetail(food)}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-600 text-emerald-800 hover:text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Log to Meal</span>
              </button>
            </div>
          ))
        )}
      </div>

      {/* Detailed Log Modal */}
      {activeFood && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden border border-stone-200">
            <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/80">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">{activeFood.imageEmoji || '🍽️'}</span>
                <div>
                  <h3 className="text-lg font-bold text-stone-900">{activeFood.name}</h3>
                  <p className="text-xs text-stone-500">{activeFood.category}</p>
                </div>
              </div>
              <button
                onClick={() => setActiveFood(null)}
                className="text-stone-400 hover:text-stone-700 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveMeal} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  1. Choose Serving Size
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(activeFood.servingUnits || [
                    { label: '1 standard serving', multiplier: 1.0 },
                    { label: 'Half serving', multiplier: 0.5 },
                  ]).map((unit: any, idx: number) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setServingMultiplier(unit.multiplier);
                        setServingLabel(unit.label);
                      }}
                      className={`p-2 rounded-xl border text-xs font-medium text-left transition-all cursor-pointer ${
                        servingMultiplier === unit.multiplier
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold'
                          : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                      }`}
                    >
                      <div>{unit.label}</div>
                      <div className="text-[10px] text-stone-500">
                        {Math.round(activeFood.baseCalories * unit.multiplier)} kcal
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    2. Choose Meal Type
                  </label>
                  <select
                    value={mealType}
                    onChange={(e) => setMealType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold"
                  >
                    <option value="breakfast">🌅 Breakfast</option>
                    <option value="lunch">🥗 Lunch</option>
                    <option value="snack">☕ Snack</option>
                    <option value="dinner">🌙 Dinner</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    3. Select Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  4. Add Optional Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. with extra dahi, cooked in mustard oil"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                />
              </div>

              {/* Calculated Total */}
              <div className="p-3 bg-stone-100 rounded-2xl flex items-center justify-between text-xs">
                <span className="font-bold text-stone-700">Calculated Nutrition:</span>
                <span className="font-extrabold text-stone-900 text-sm">
                  {cals} kcal • P: {prot}g • C: {carbs}g • F: {fats}g
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveFood(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaved}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                >
                  {isSaved ? <Check className="w-4 h-4 text-white" /> : <Plus className="w-4 h-4" />}
                  <span>{isSaved ? 'Saved to Log!' : 'Save Meal'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
