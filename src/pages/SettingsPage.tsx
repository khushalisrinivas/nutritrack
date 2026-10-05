import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Settings, Target, Check, ShieldAlert, Database, Info } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user, updateGoals } = useAuth();

  const [calorieGoal, setCalorieGoal] = useState<number>(user?.calorieGoal || 2500);
  const [proteinGoal, setProteinGoal] = useState<number>(user?.proteinGoal || 125);
  const [carbGoal, setCarbGoal] = useState<number>(user?.carbGoal || 313);
  const [fatGoal, setFatGoal] = useState<number>(user?.fatGoal || 83);

  const [isSaved, setIsSaved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const calculatedTotalMacroCals = proteinGoal * 4 + carbGoal * 4 + fatGoal * 9;

  const handleSaveGoals = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateGoals({
        calorieGoal: Number(calorieGoal),
        proteinGoal: Number(proteinGoal),
        carbGoal: Number(carbGoal),
        fatGoal: Number(fatGoal),
      });

      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2500);
    } catch (err) {
      console.error('Failed to update nutrition goals:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200/90 shadow-2xs">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
          Preferences & Targets
        </span>
        <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight mt-2">
          Nutrition Goals & System Settings
        </h1>
        <p className="text-xs text-stone-500 mt-0.5">
          Fine-tune custom daily caloric targets and macronutrient distributions
        </p>
      </div>

      {/* Goal Management Form */}
      <form onSubmit={handleSaveGoals} className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/90 shadow-2xs space-y-6">
        <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
          <Target className="w-5 h-5 text-emerald-600" />
          <h2 className="text-lg font-bold text-stone-900">Custom Nutrition Goal Overrides</h2>
        </div>

        <p className="text-xs text-stone-500 leading-relaxed">
          While NutriTrack AI calculates recommendations using standard formulas, you can manually tailor these values to fit specific clinical or athletic bodybuilding regimens.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Daily Calorie Target (kcal)
            </label>
            <input
              type="number"
              min={1000}
              max={6000}
              value={calorieGoal}
              onChange={(e) => setCalorieGoal(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-base font-extrabold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1">
              Daily Protein Target (g)
            </label>
            <input
              type="number"
              min={20}
              max={400}
              value={proteinGoal}
              onChange={(e) => setProteinGoal(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-base font-extrabold text-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-amber-800 mb-1">
              Daily Carbohydrates Target (g)
            </label>
            <input
              type="number"
              min={30}
              max={800}
              value={carbGoal}
              onChange={(e) => setCarbGoal(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-base font-extrabold text-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-indigo-800 mb-1">
              Daily Fat Target (g)
            </label>
            <input
              type="number"
              min={15}
              max={250}
              value={fatGoal}
              onChange={(e) => setFatGoal(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-base font-extrabold text-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        </div>

        {/* Macro math check */}
        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-600 space-y-1">
          <div className="flex justify-between font-semibold">
            <span>Sum of Macros in Calories:</span>
            <span className="font-extrabold text-stone-900">{calculatedTotalMacroCals} kcal</span>
          </div>
          <div className="flex justify-between text-[11px] text-stone-500">
            <span>Calorie Goal Variance:</span>
            <span className={Math.abs(calculatedTotalMacroCals - calorieGoal) > 50 ? 'text-amber-600 font-bold' : 'text-emerald-700 font-bold'}>
              {calculatedTotalMacroCals - calorieGoal > 0 ? `+${calculatedTotalMacroCals - calorieGoal}` : calculatedTotalMacroCals - calorieGoal} kcal
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          {isSaved && (
            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
              <Check className="w-4 h-4" /> Nutrition targets updated! Real-time dashboard refreshed.
            </span>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="ml-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? 'Saving Goals...' : 'Save Nutrition Goals'}
          </button>
        </div>
      </form>

      {/* Architecture & Tech Spec Card */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200/90 shadow-2xs space-y-3">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-stone-700" />
          <h2 className="text-base font-bold text-stone-900">Technical Environment & Stack</h2>
        </div>
        <p className="text-xs text-stone-600 leading-relaxed">
          NutriTrack AI runs on a unified full-stack architecture: React 19 + TypeScript + Tailwind CSS on the client, and Express + Socket.IO + Mongoose/MongoDB data persistence on the server. AI Nutrition Insights are served by server-side Gemini 3.8 Flash.
        </p>
      </div>
    </div>
  );
};
