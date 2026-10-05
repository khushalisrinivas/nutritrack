import React, { useState } from 'react';
import { FoodEntryItem, useNutrition } from '../context/NutritionContext';
import { Plus, Trash2, Edit3, Coffee, Sun, Utensils, Moon, Check, X } from 'lucide-react';

interface MealTimelineCardProps {
  entries: FoodEntryItem[];
  onOpenAddMealForSlot: (mealType: 'breakfast' | 'lunch' | 'snack' | 'dinner') => void;
}

export const MealTimelineCard: React.FC<MealTimelineCardProps> = ({
  entries,
  onOpenAddMealForSlot,
}) => {
  const { deleteFoodEntry, updateFoodEntry } = useNutrition();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{
    foodName: string;
    servingSize: string;
    calories: number;
    protein: number;
    carbohydrates: number;
    fats: number;
    notes: string;
  }>({
    foodName: '',
    servingSize: '',
    calories: 0,
    protein: 0,
    carbohydrates: 0,
    fats: 0,
    notes: '',
  });

  const slots = [
    {
      type: 'breakfast' as const,
      label: 'Breakfast',
      icon: Coffee,
      color: 'text-amber-600 bg-amber-50 border-amber-200',
      timeSlot: 'Morning (7:00 AM - 10:30 AM)',
    },
    {
      type: 'lunch' as const,
      label: 'Lunch',
      icon: Sun,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      timeSlot: 'Afternoon (12:30 PM - 3:00 PM)',
    },
    {
      type: 'snack' as const,
      label: 'Snack',
      icon: Utensils,
      color: 'text-orange-600 bg-orange-50 border-orange-200',
      timeSlot: 'Late Afternoon (4:30 PM - 6:30 PM)',
    },
    {
      type: 'dinner' as const,
      label: 'Dinner',
      icon: Moon,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
      timeSlot: 'Evening (7:30 PM - 10:00 PM)',
    },
  ];

  const handleStartEdit = (entry: FoodEntryItem) => {
    setEditingId(entry._id);
    setEditForm({
      foodName: entry.foodName,
      servingSize: entry.servingSize,
      calories: entry.calories,
      protein: entry.protein,
      carbohydrates: entry.carbohydrates,
      fats: entry.fats,
      notes: entry.notes || '',
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleSaveEdit = async (id: string) => {
    try {
      await updateFoodEntry(id, editForm);
      setEditingId(null);
    } catch (err) {
      console.error('Failed to update entry:', err);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Remove "${name}" from today's log?`)) {
      await deleteFoodEntry(id);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-stone-900">Daily Meal Timeline</h3>
          <p className="text-xs text-stone-500">Track and adjust your daily Indian meals by meal window</p>
        </div>
      </div>

      <div className="space-y-4">
        {slots.map((slot) => {
          const Icon = slot.icon;
          const slotEntries = entries.filter((e) => e.mealType === slot.type);
          const slotCalories = slotEntries.reduce((acc, curr) => acc + (curr.calories || 0), 0);
          const slotProtein = slotEntries.reduce((acc, curr) => acc + (curr.protein || 0), 0);
          const slotCarbs = slotEntries.reduce((acc, curr) => acc + (curr.carbohydrates || 0), 0);
          const slotFat = slotEntries.reduce((acc, curr) => acc + (curr.fats || 0), 0);

          return (
            <div
              key={slot.type}
              className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-2xs hover:shadow-xs transition-shadow"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3.5 border-b border-stone-100">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-2xl flex items-center justify-center border ${slot.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-stone-900">{slot.label}</h4>
                      <span className="text-[11px] text-stone-600">{slot.timeSlot}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-stone-500 font-medium">
                      <span>{slotCalories} kcal</span>
                      <span>•</span>
                      <span>P: {Math.round(slotProtein * 10) / 10}g</span>
                      <span>•</span>
                      <span>C: {Math.round(slotCarbs * 10) / 10}g</span>
                      <span>•</span>
                      <span>F: {Math.round(slotFat * 10) / 10}g</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onOpenAddMealForSlot(slot.type)}
                  className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-50 hover:bg-stone-100 text-stone-700 hover:text-emerald-700 text-xs font-semibold border border-stone-200/80 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add {slot.label}</span>
                </button>
              </div>

              {/* Items List */}
              <div className="pt-3">
                {slotEntries.length === 0 ? (
                  <div className="py-4 text-center text-xs text-stone-600 bg-stone-50/50 rounded-2xl border border-dashed border-stone-200">
                    No items logged for {slot.label.toLowerCase()} yet.
                  </div>
                ) : (
                  <div className="divide-y divide-stone-100">
                    {slotEntries.map((item) => {
                      const isEditing = editingId === item._id;

                      if (isEditing) {
                        return (
                          <div key={item._id} className="py-3 bg-stone-50/70 p-3 rounded-2xl my-1.5 space-y-2.5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                              <div>
                                <label className="block text-stone-500 font-medium mb-0.5">Food Name</label>
                                <input
                                  type="text"
                                  value={editForm.foodName}
                                  onChange={(e) => setEditForm({ ...editForm, foodName: e.target.value })}
                                  className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs"
                                />
                              </div>
                              <div>
                                <label className="block text-stone-500 font-medium mb-0.5">Serving Size</label>
                                <input
                                  type="text"
                                  value={editForm.servingSize}
                                  onChange={(e) => setEditForm({ ...editForm, servingSize: e.target.value })}
                                  className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-4 gap-2 text-xs">
                              <div>
                                <label className="block text-stone-500 font-medium mb-0.5">Calories</label>
                                <input
                                  type="number"
                                  value={editForm.calories}
                                  onChange={(e) => setEditForm({ ...editForm, calories: Number(e.target.value) })}
                                  className="w-full px-2 py-1 bg-white border border-stone-300 rounded-lg text-xs"
                                />
                              </div>
                              <div>
                                <label className="block text-stone-500 font-medium mb-0.5">Protein (g)</label>
                                <input
                                  type="number"
                                  value={editForm.protein}
                                  onChange={(e) => setEditForm({ ...editForm, protein: Number(e.target.value) })}
                                  className="w-full px-2 py-1 bg-white border border-stone-300 rounded-lg text-xs"
                                />
                              </div>
                              <div>
                                <label className="block text-stone-500 font-medium mb-0.5">Carbs (g)</label>
                                <input
                                  type="number"
                                  value={editForm.carbohydrates}
                                  onChange={(e) => setEditForm({ ...editForm, carbohydrates: Number(e.target.value) })}
                                  className="w-full px-2 py-1 bg-white border border-stone-300 rounded-lg text-xs"
                                />
                              </div>
                              <div>
                                <label className="block text-stone-500 font-medium mb-0.5">Fat (g)</label>
                                <input
                                  type="number"
                                  value={editForm.fats}
                                  onChange={(e) => setEditForm({ ...editForm, fats: Number(e.target.value) })}
                                  className="w-full px-2 py-1 bg-white border border-stone-300 rounded-lg text-xs"
                                />
                              </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-1">
                              <button
                                onClick={handleCancelEdit}
                                className="px-2.5 py-1 text-xs text-stone-600 hover:bg-stone-200 rounded-lg cursor-pointer"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleSaveEdit(item._id)}
                                className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg cursor-pointer"
                              >
                                <Check className="w-3 h-3" />
                                Save
                              </button>
                            </div>
                          </div>
                        );
                      }

                      return (
                        <div
                          key={item._id}
                          className="py-2.5 flex items-center justify-between gap-3 group hover:bg-stone-50/70 px-2 rounded-xl transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-xl">
                              {item.source === 'indian_db' ? '🇮🇳' : item.source === 'usda' ? '🥗' : '⚡'}
                            </span>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-sm text-stone-900">{item.foodName}</span>
                                {item.source === 'indian_db' && (
                                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-50 text-amber-800 border border-amber-200/60 font-semibold">
                                    Indian
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-stone-500 flex items-center gap-2 mt-0.5">
                                <span>{item.servingSize}</span>
                                {item.notes && (
                                  <>
                                    <span>•</span>
                                    <span className="italic text-stone-600 truncate max-w-xs">{item.notes}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="font-extrabold text-sm text-stone-900">
                                {item.calories} <span className="text-xs font-normal text-stone-500">kcal</span>
                              </div>
                              <div className="text-[11px] text-stone-600 font-medium">
                                P: {item.protein}g • C: {item.carbohydrates}g • F: {item.fats}g
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-1 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleStartEdit(item)}
                                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
                                title="Edit meal"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDelete(item._id, item.foodName)}
                                className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                title="Delete meal"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
