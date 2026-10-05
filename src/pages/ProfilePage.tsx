import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Target, Activity, Flame, Shield, Check, RefreshCw } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, streak, updateProfile } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [age, setAge] = useState(user?.age || 24);
  const [gender, setGender] = useState<'male' | 'female' | 'other'>(user?.gender || 'male');
  const [height, setHeight] = useState(user?.height || 175);
  const [weight, setWeight] = useState(user?.weight || 70);
  const [activityLevel, setActivityLevel] = useState(user?.activityLevel || 'moderate');
  const [goal, setGoal] = useState<'maintain' | 'gain' | 'lose'>(user?.goal || 'maintain');
  const [autoRecalculate, setAutoRecalculate] = useState(true);

  const [isSaved, setIsSaved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // BMI Calculation
  const heightM = height / 100;
  const bmi = heightM > 0 ? Math.round((weight / (heightM * heightM)) * 10) / 10 : 22;
  let bmiCategory = 'Normal weight';
  let bmiColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
  if (bmi < 18.5) {
    bmiCategory = 'Underweight';
    bmiColor = 'text-amber-700 bg-amber-50 border-amber-200';
  } else if (bmi >= 25 && bmi < 30) {
    bmiCategory = 'Overweight';
    bmiColor = 'text-orange-700 bg-orange-50 border-orange-200';
  } else if (bmi >= 30) {
    bmiCategory = 'Obese';
    bmiColor = 'text-rose-700 bg-rose-50 border-rose-200';
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateProfile({
        name,
        age,
        gender,
        height,
        weight,
        activityLevel,
        goal,
        autoRecalculateGoals: autoRecalculate,
      });

      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2500);
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-600 to-amber-500 text-white flex items-center justify-center font-extrabold text-2xl shadow-md">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">{user?.name}</h1>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold uppercase">
                Active Member
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">{user?.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold flex items-center gap-2">
            <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
            <span>{streak?.currentStreak || 1} Day Streak</span>
          </div>
        </div>
      </div>

      {/* BMI and Target summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-stone-200/90 shadow-2xs">
          <span className="text-xs font-bold uppercase text-stone-500 block mb-1">Body Mass Index (BMI)</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-stone-900">{bmi}</span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${bmiColor}`}>
              {bmiCategory}
            </span>
          </div>
          <span className="text-[11px] text-stone-600 block mt-2 font-medium">Height: {height}cm • Weight: {weight}kg</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200/90 shadow-2xs">
          <span className="text-xs font-bold uppercase text-emerald-800 block mb-1">Current Target</span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-emerald-800">{user?.calorieGoal}</span>
            <span className="text-xs text-stone-500">kcal/day</span>
          </div>
          <span className="text-[11px] text-stone-600 block mt-2 font-medium">Goal: {user?.goal} weight</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200/90 shadow-2xs">
          <span className="text-xs font-bold uppercase text-amber-800 block mb-1">Macros Target</span>
          <div className="text-sm font-extrabold text-stone-900 mt-1">
            P: {user?.proteinGoal}g • C: {user?.carbGoal}g • F: {user?.fatGoal}g
          </div>
          <span className="text-[11px] text-stone-600 block mt-2 font-medium">Auto-calibrated for Indian dietary patterns</span>
        </div>
      </div>

      {/* Edit Profile Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/90 shadow-2xs space-y-6">
        <div>
          <h2 className="text-lg font-bold text-stone-900">Personal & Lifestyle Configuration</h2>
          <p className="text-xs text-stone-500">Update your metrics to update your suggested metabolic baseline</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Gender
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value as any)}
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Age</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Height (cm)</label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Weight (kg)</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Activity Level
            </label>
            <select
              value={activityLevel}
              onChange={(e) => setActivityLevel(e.target.value as any)}
              className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="sedentary">Sedentary (desk job, no routine exercise)</option>
              <option value="light">Lightly Active (light exercise 1-3 days/week)</option>
              <option value="moderate">Moderately Active (exercise 3-5 days/week)</option>
              <option value="active">Very Active (hard training 6-7 days/week)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Weight Objective
            </label>
            <select
              value={goal}
              onChange={(e) => setGoal(e.target.value as any)}
              className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="maintain">Maintain Current Weight</option>
              <option value="lose">Lose Weight (Calorie Deficit)</option>
              <option value="gain">Gain Weight / Muscle Hypertrophy</option>
            </select>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-center gap-3">
          <input
            type="checkbox"
            id="autoRecalc"
            checked={autoRecalculate}
            onChange={(e) => setAutoRecalculate(e.target.checked)}
            className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
          />
          <label htmlFor="autoRecalc" className="text-xs text-stone-700 cursor-pointer">
            <strong>Automatically recalculate calorie and macro targets</strong> using the Mifflin-St Jeor formula when saving updated weight or activity.
          </label>
        </div>

        <div className="flex items-center justify-between pt-2">
          {isSaved && (
            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
              <Check className="w-4 h-4" /> Profile and targets saved successfully!
            </span>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="ml-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save Profile Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};
