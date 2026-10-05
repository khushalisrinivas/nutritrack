import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ReferenceLine,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { BarChart3, TrendingUp, Utensils, Award, Target, Flame } from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await api.get('/analytics/weekly');
      setData(res.data);
    } catch (err) {
      console.error('Failed to load weekly analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="py-24 text-center text-xs text-stone-500">
        Loading 7-day nutrition analytics and charts...
      </div>
    );
  }

  const averages = data?.averages || { calories: 0, protein: 0, carbs: 0, fat: 0 };
  const dailyTrends = data?.dailyTrends || [];
  const macroDistribution = data?.macroDistribution || [];
  const topFoods = data?.topFoods || [];
  const userGoals = data?.userGoals || { calorieGoal: 2500, proteinGoal: 125, carbGoal: 313, fatGoal: 83 };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
            7-Day Analytical Intelligence
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mt-2">
            Weekly Nutrition Trends & Macro Breakdown
          </h1>
          <p className="text-sm text-stone-500 mt-0.5">
            Real data calculated from your MongoDB meal logs and calorie targets
          </p>
        </div>

        <div className="flex items-center gap-2 bg-stone-50 p-3 rounded-2xl border border-stone-200 text-xs font-semibold text-stone-700">
          <Target className="w-4 h-4 text-emerald-600" />
          <span>Active Logged Days: <strong>{averages.activeDaysCount || 0} / 7</strong></span>
        </div>
      </div>

      {/* 7-Day Averages Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-stone-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-stone-500 font-bold uppercase tracking-wider mb-1">
            <span>Avg. Calories</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-3xl font-black text-stone-900">{averages.calories.toLocaleString()}</span>
            <span className="text-xs text-stone-500">kcal/day</span>
          </div>
          <span className="text-[11px] text-stone-600 mt-2 block font-medium">
            Goal: {userGoals.calorieGoal.toLocaleString()} kcal
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-emerald-800 font-bold uppercase tracking-wider mb-1">
            <span>Avg. Protein</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-3xl font-black text-stone-900">{averages.protein}</span>
            <span className="text-xs text-stone-500">g/day</span>
          </div>
          <span className="text-[11px] text-stone-600 mt-2 block font-medium">
            Goal: {userGoals.proteinGoal}g ({Math.round((averages.protein / userGoals.proteinGoal) * 100)}%)
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-amber-800 font-bold uppercase tracking-wider mb-1">
            <span>Avg. Carbs</span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-3xl font-black text-stone-900">{averages.carbs}</span>
            <span className="text-xs text-stone-500">g/day</span>
          </div>
          <span className="text-[11px] text-stone-600 mt-2 block font-medium">
            Goal: {userGoals.carbGoal}g ({Math.round((averages.carbs / userGoals.carbGoal) * 100)}%)
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-indigo-800 font-bold uppercase tracking-wider mb-1">
            <span>Avg. Fat</span>
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-3xl font-black text-stone-900">{averages.fat}</span>
            <span className="text-xs text-stone-500">g/day</span>
          </div>
          <span className="text-[11px] text-stone-600 mt-2 block font-medium">
            Goal: {userGoals.fatGoal}g ({Math.round((averages.fat / userGoals.fatGoal) * 100)}%)
          </span>
        </div>
      </div>

      {/* Chart 1: 7-Day Calorie Trend vs Goal */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200/90 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-stone-900">1. 7-Day Calorie Intake vs Daily Target</h3>
            <p className="text-xs text-stone-500">Monitor energy balance and consistency over the past week</p>
          </div>
          <div className="flex items-center gap-3 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-emerald-700">
              <span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block" /> Logged Intake
            </span>
            <span className="flex items-center gap-1.5 text-stone-500">
              <span className="w-3 h-0.5 bg-stone-400 inline-block" /> Goal ({userGoals.calorieGoal} kcal)
            </span>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="#78716c" />
              <YAxis tick={{ fontSize: 11 }} stroke="#78716c" domain={[0, 'dataMax + 500']} />
              <Tooltip
                contentStyle={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #e7e5e4', fontSize: '12px' }}
                formatter={(val: any) => [`${val} kcal`, 'Calories']}
              />
              <ReferenceLine y={userGoals.calorieGoal} stroke="#a8a29e" strokeDasharray="3 3" />
              <Bar dataKey="calories" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2 & Chart 3 Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart 2: Protein Trend */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-stone-200/90 shadow-2xs">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-stone-900">2. Daily Protein Intake Trend</h3>
            <p className="text-xs text-stone-500">Target: {userGoals.proteinGoal}g protein per day for muscle retention</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="proteinGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="#78716c" />
                <YAxis tick={{ fontSize: 11 }} stroke="#78716c" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #e7e5e4', fontSize: '12px' }}
                  formatter={(val: any) => [`${val} g`, 'Protein']}
                />
                <ReferenceLine y={userGoals.proteinGoal} stroke="#f59e0b" strokeDasharray="3 3" />
                <Area type="monotone" dataKey="protein" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#proteinGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Macronutrient Caloric Distribution */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-stone-200/90 shadow-2xs flex flex-col justify-between">
          <div className="mb-2">
            <h3 className="text-lg font-bold text-stone-900">3. Macronutrient Calorie Split</h3>
            <p className="text-xs text-stone-500">7-Day proportion of Protein, Carbs, and Fats</p>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={macroDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="percentage"
                >
                  {macroDistribution.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any, name: any, item: any) => [`${val}% (${item.payload.grams}g)`, item.payload.name]}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e7e5e4', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs pt-3 border-t border-stone-100">
            {macroDistribution.map((m: any) => (
              <div key={m.name} className="p-2 rounded-xl bg-stone-50">
                <span className="font-semibold block truncate" style={{ color: m.color }}>{m.name}</span>
                <span className="font-black text-stone-900 text-sm">{m.percentage}%</span>
                <span className="text-[10px] text-stone-500 block">{m.grams}g</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chart 4: Calories by Meal Type (Stacked Bar) */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200/90 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-stone-900">4. Calories by Meal Window</h3>
            <p className="text-xs text-stone-500">Distribution across Breakfast, Lunch, Snacks, and Dinner</p>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="#78716c" />
              <YAxis tick={{ fontSize: 11 }} stroke="#78716c" />
              <Tooltip
                contentStyle={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #e7e5e4', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar dataKey="breakfast" name="Breakfast" stackId="a" fill="#f59e0b" />
              <Bar dataKey="lunch" name="Lunch" stackId="a" fill="#10b981" />
              <Bar dataKey="snack" name="Snack" stackId="a" fill="#f97316" />
              <Bar dataKey="dinner" name="Dinner" stackId="a" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 5 & 6: Top Logged Foods & Habit Consistency */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most frequently logged foods */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-stone-900">5. Most Frequently Logged Foods</h3>
              <p className="text-xs text-stone-500">Your core dietary staples this week</p>
            </div>
            <Award className="w-5 h-5 text-amber-500" />
          </div>

          <div className="space-y-3">
            {topFoods.length === 0 ? (
              <p className="text-xs text-stone-400 py-6 text-center">No foods logged yet.</p>
            ) : (
              topFoods.map((f: any, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 border border-stone-100 hover:bg-stone-100/80 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <div>
                      <h4 className="font-bold text-sm text-stone-900">{f.foodName}</h4>
                      <span className="text-[11px] text-stone-500">{f.category}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-extrabold text-sm text-emerald-700">{f.count} times</span>
                    <span className="text-[11px] text-stone-500 block">avg {f.avgCalories} kcal</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Target vs Actual Summary */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200/90 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-stone-900">6. Daily Target vs Actual Averages</h3>
              <Target className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-xs text-stone-500 mb-6">
              Compare your weekly performance against your registered physical goals
            </p>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-stone-700">Calories: {averages.calories} / {userGoals.calorieGoal} kcal</span>
                  <span className="text-emerald-700">{Math.round((averages.calories / userGoals.calorieGoal) * 100)}%</span>
                </div>
                <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${Math.min(100, Math.round((averages.calories / userGoals.calorieGoal) * 100))}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-stone-700">Protein: {averages.protein} / {userGoals.proteinGoal} g</span>
                  <span className="text-emerald-700">{Math.round((averages.protein / userGoals.proteinGoal) * 100)}%</span>
                </div>
                <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${Math.min(100, Math.round((averages.protein / userGoals.proteinGoal) * 100))}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-stone-700">Carbs: {averages.carbs} / {userGoals.carbGoal} g</span>
                  <span className="text-amber-700">{Math.round((averages.carbs / userGoals.carbGoal) * 100)}%</span>
                </div>
                <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: `${Math.min(100, Math.round((averages.carbs / userGoals.carbGoal) * 100))}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-stone-700">Fats: {averages.fat} / {userGoals.fatGoal} g</span>
                  <span className="text-indigo-700">{Math.round((averages.fat / userGoals.fatGoal) * 100)}%</span>
                </div>
                <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${Math.min(100, Math.round((averages.fat / userGoals.fatGoal) * 100))}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-xs text-emerald-900 leading-relaxed font-medium">
            💡 <strong>NutriTrack AI Coach:</strong> Consistently meeting your protein and calorie goals ensures steady progress without fatigue or nutritional deficiencies.
          </div>
        </div>
      </div>
    </div>
  );
};
