import React from 'react';
import { useAuth } from '../context/AuthContext';
import { DaySummary } from '../context/NutritionContext';
import { Zap, Target, ShieldCheck, AlertCircle } from 'lucide-react';

interface MacroProgressCardProps {
  summary: DaySummary | null;
}

export const MacroProgressCard: React.FC<MacroProgressCardProps> = ({ summary }) => {
  const { user } = useAuth();

  const calorieGoal = user?.calorieGoal || 2500;
  const proteinGoal = user?.proteinGoal || 125;
  const carbGoal = user?.carbGoal || 313;
  const fatGoal = user?.fatGoal || 83;

  const currentCalories = summary?.totalCalories || 0;
  const currentProtein = summary?.totalProtein || 0;
  const currentCarbs = summary?.totalCarbs || 0;
  const currentFat = summary?.totalFat || 0;
  const currentFiber = summary?.totalFiber || 0;

  const remainingCalories = Math.max(0, calorieGoal - currentCalories);
  const calPercent = Math.min(100, Math.round((currentCalories / calorieGoal) * 100));
  const proteinPercent = Math.min(100, Math.round((currentProtein / proteinGoal) * 100));
  const carbPercent = Math.min(100, Math.round((currentCarbs / carbGoal) * 100));
  const fatPercent = Math.min(100, Math.round((currentFat / fatGoal) * 100));

  // Circular progress calculations for calories
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (calPercent / 100) * circumference;

  return (
    <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-stone-100">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
            Daily Target & Progress
          </span>
          <h2 className="text-2xl font-extrabold text-stone-900 mt-2">
            Today's Nutrition Summary
          </h2>
          <p className="text-sm text-stone-500 mt-0.5">
            Real-time balance of calories and key macronutrients
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto bg-stone-50 px-3.5 py-2 rounded-2xl border border-stone-200/80">
          <Target className="w-4 h-4 text-emerald-600" />
          <div className="text-xs">
            <span className="text-stone-500 block">Daily Goal</span>
            <span className="font-bold text-stone-900">{calorieGoal.toLocaleString()} kcal</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6 items-center">
        {/* Calorie Dial / Radial Progress */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-4 bg-stone-50/80 rounded-2xl border border-stone-100">
          <div className="relative w-40 h-40 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 140 140">
              <circle
                cx="70"
                cy="70"
                r={radius}
                className="stroke-stone-200"
                strokeWidth="12"
                fill="transparent"
              />
              <circle
                cx="70"
                cy="70"
                r={radius}
                className="stroke-emerald-500 transition-all duration-700 ease-out"
                strokeWidth="12"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-xs font-semibold text-stone-600 uppercase tracking-wider">
                Consumed
              </span>
              <span className="text-3xl font-extrabold text-stone-900 tracking-tight">
                {currentCalories.toLocaleString()}
              </span>
              <span className="text-xs font-medium text-stone-600">
                / {calorieGoal.toLocaleString()} kcal
              </span>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-4 text-xs">
            <div className="text-center px-3 py-1 bg-white rounded-xl border border-stone-200/60 shadow-2xs">
              <span className="text-stone-500 block">Remaining</span>
              <span className="font-bold text-emerald-700 text-sm">{remainingCalories.toLocaleString()} kcal</span>
            </div>
            <div className="text-center px-3 py-1 bg-white rounded-xl border border-stone-200/60 shadow-2xs">
              <span className="text-stone-500 block">Progress</span>
              <span className="font-bold text-stone-900 text-sm">{calPercent}%</span>
            </div>
          </div>
        </div>

        {/* Macronutrient Bars */}
        <div className="lg:col-span-7 space-y-4">
          {/* Protein Bar */}
          <div className="bg-stone-50/60 p-3.5 rounded-2xl border border-stone-100">
            <div className="flex justify-between items-center text-sm mb-1.5">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="font-bold text-stone-800">Protein</span>
                <span className="text-xs text-stone-500">(Muscle & Recovery)</span>
              </div>
              <div className="font-semibold text-stone-900">
                <span className="text-emerald-700 font-extrabold">{currentProtein}</span> / {proteinGoal} g
                <span className="text-xs text-stone-600 ml-1.5 font-medium">({proteinPercent}%)</span>
              </div>
            </div>
            <div className="w-full bg-stone-200 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${proteinPercent}%` }}
              />
            </div>
          </div>

          {/* Carbohydrates Bar */}
          <div className="bg-stone-50/60 p-3.5 rounded-2xl border border-stone-100">
            <div className="flex justify-between items-center text-sm mb-1.5">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="font-bold text-stone-800">Carbohydrates</span>
                <span className="text-xs text-stone-500">(Energy)</span>
              </div>
              <div className="font-semibold text-stone-900">
                <span className="text-amber-700 font-extrabold">{currentCarbs}</span> / {carbGoal} g
                <span className="text-xs text-stone-600 ml-1.5 font-medium">({carbPercent}%)</span>
              </div>
            </div>
            <div className="w-full bg-stone-200 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${carbPercent}%` }}
              />
            </div>
          </div>

          {/* Fat Bar */}
          <div className="bg-stone-50/60 p-3.5 rounded-2xl border border-stone-100">
            <div className="flex justify-between items-center text-sm mb-1.5">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-indigo-500" />
                <span className="font-bold text-stone-800">Fat</span>
                <span className="text-xs text-stone-500">(Hormones & Satiety)</span>
              </div>
              <div className="font-semibold text-stone-900">
                <span className="text-indigo-700 font-extrabold">{currentFat}</span> / {fatGoal} g
                <span className="text-xs text-stone-600 ml-1.5 font-medium">({fatPercent}%)</span>
              </div>
            </div>
            <div className="w-full bg-stone-200 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${fatPercent}%` }}
              />
            </div>
          </div>

          {/* Dietary Fiber metric */}
          <div className="flex items-center justify-between pt-1 px-1 text-xs text-stone-500">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Dietary Fiber: <strong className="text-stone-800 font-semibold">{currentFiber}g</strong> (Indian foods goal: 25-35g)
            </span>
            <span className="text-[11px] text-stone-600 font-medium">
              4 kcal/g (P, C) • 9 kcal/g (F)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
