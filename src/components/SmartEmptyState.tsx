import React from 'react';
import { Plus, UtensilsCrossed } from 'lucide-react';

interface SmartEmptyStateProps {
  onAddMeal: () => void;
  title?: string;
  description?: string;
}

export const SmartEmptyState: React.FC<SmartEmptyStateProps> = ({
  onAddMeal,
  title = 'Your plate is waiting 🍽️',
  description = 'Start by logging your first meal today. Search from 120+ authentic Indian foods or quick add calories.',
}) => {
  return (
    <div className="py-12 px-6 text-center bg-white rounded-3xl border border-dashed border-stone-300 max-w-lg mx-auto shadow-2xs">
      <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-100">
        <UtensilsCrossed className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-stone-900 mb-1.5">{title}</h3>
      <p className="text-sm text-stone-500 mb-6 max-w-sm mx-auto leading-relaxed">
        {description}
      </p>
      <button
        onClick={onAddMeal}
        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all cursor-pointer hover:scale-102"
      >
        <Plus className="w-4 h-4" />
        <span>+ Add First Meal</span>
      </button>
    </div>
  );
};
