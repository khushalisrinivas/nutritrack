import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  Flame,
  Zap,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Utensils,
  Activity,
  Heart,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { demoLogin, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleDemoClick = async () => {
    try {
      await demoLogin();
      navigate('/dashboard');
    } catch (err) {
      console.error('Demo login error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* Navigation */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-amber-500 flex items-center justify-center shadow-sm">
              <span className="text-white font-extrabold text-xl">N</span>
            </div>
            <div>
              <span className="text-xl font-extrabold text-stone-900 tracking-tight flex items-center gap-1.5">
                NutriTrack <span className="text-xs px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold uppercase">AI</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-sm transition-all"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <button
                  onClick={handleDemoClick}
                  className="hidden sm:inline-flex px-3.5 py-2 rounded-xl text-stone-700 hover:text-stone-950 hover:bg-stone-100 font-semibold text-sm transition-colors cursor-pointer"
                >
                  Explore Demo
                </button>
                <Link
                  to="/login"
                  className="px-3.5 py-2 rounded-xl text-stone-700 hover:text-stone-950 font-semibold text-sm transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-sm transition-all shadow-emerald-600/20"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/70 border border-emerald-200/80 text-emerald-800 text-xs font-bold mb-6 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Built Specifically for Everyday Indian Meals & Fitness</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl font-extrabold text-stone-950 tracking-tight max-w-4xl mx-auto leading-[1.15]">
            Understand your food. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-emerald-700 to-amber-600">
              Track your nutrition.
            </span>{' '}
            Build better habits.
          </h1>

          {/* Supporting Text */}
          <p className="mt-6 text-lg sm:text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Track calories, protein, carbohydrates and fats from your everyday meals — including the foods you actually eat, from idlis and dal tadka to chicken biryani.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-lg shadow-emerald-600/30 transition-all hover:scale-102 cursor-pointer"
            >
              <span>Start Tracking</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={handleDemoClick}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-white hover:bg-stone-50 text-stone-800 font-bold text-base border border-stone-300 shadow-xs transition-all cursor-pointer"
            >
              <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>Explore Demo (Ravi's Profile)</span>
            </button>
          </div>

          <div className="mt-4 flex items-center justify-center gap-6 text-xs text-stone-500 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 100% Real Backend & Database
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Socket.IO Real-Time Sync
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Gemini AI Insights
            </span>
          </div>

          {/* Visual Dashboard Mockup Preview */}
          <div className="mt-14 max-w-5xl mx-auto">
            <div className="rounded-3xl bg-white border border-stone-200/90 shadow-2xl p-4 sm:p-7 text-left relative overflow-hidden">
              {/* Fake Dashboard Top Bar */}
              <div className="flex items-center justify-between pb-6 border-b border-stone-100">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-base">
                    R
                  </div>
                  <div>
                    <h3 className="font-extrabold text-stone-900 text-lg sm:text-xl">
                      Good evening, Ravi 👋
                    </h3>
                    <p className="text-xs text-stone-500">
                      Here's your nutrition summary for today (Live Preview)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-bold text-xs flex items-center gap-1.5">
                    <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
                    <span>5 Day Streak</span>
                  </div>
                </div>
              </div>

              {/* Progress Summary Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-6">
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/70">
                  <span className="text-xs text-stone-500 font-semibold uppercase block">Calories</span>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-2xl font-black text-stone-900">1,840</span>
                    <span className="text-xs text-stone-500">/ 2,500 kcal</span>
                  </div>
                  <div className="w-full bg-stone-200 h-2 rounded-full mt-2.5 overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: '74%' }} />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100">
                  <span className="text-xs text-emerald-800 font-semibold uppercase block">Protein</span>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-2xl font-black text-stone-900">92</span>
                    <span className="text-xs text-stone-500">/ 125 g</span>
                  </div>
                  <div className="w-full bg-emerald-200 h-2 rounded-full mt-2.5 overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: '74%' }} />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100">
                  <span className="text-xs text-amber-800 font-semibold uppercase block">Carbohydrates</span>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-2xl font-black text-stone-900">228</span>
                    <span className="text-xs text-stone-500">/ 313 g</span>
                  </div>
                  <div className="w-full bg-amber-200 h-2 rounded-full mt-2.5 overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: '73%' }} />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100">
                  <span className="text-xs text-indigo-800 font-semibold uppercase block">Fats</span>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-2xl font-black text-stone-900">61</span>
                    <span className="text-xs text-stone-500">/ 83 g</span>
                  </div>
                  <div className="w-full bg-indigo-200 h-2 rounded-full mt-2.5 overflow-hidden">
                    <div className="bg-indigo-500 h-full rounded-full" style={{ width: '73%' }} />
                  </div>
                </div>
              </div>

              {/* Sample Timeline snapshot */}
              <div className="mt-6 pt-6 border-t border-stone-100">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-3">
                  Today's Meals Timeline
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80">
                    <span className="text-stone-500 font-semibold block">🌅 Breakfast</span>
                    <p className="font-bold text-stone-900 mt-1">2 Idlis + Sambar</p>
                    <span className="text-emerald-700 font-extrabold">320 kcal</span>
                  </div>

                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80">
                    <span className="text-stone-500 font-semibold block">🥗 Lunch</span>
                    <p className="font-bold text-stone-900 mt-1">Rice + Dal + Chicken Curry</p>
                    <span className="text-emerald-700 font-extrabold">680 kcal</span>
                  </div>

                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80">
                    <span className="text-stone-500 font-semibold block">☕ Snack</span>
                    <p className="font-bold text-stone-900 mt-1">Banana + Peanut Butter</p>
                    <span className="text-emerald-700 font-extrabold">280 kcal</span>
                  </div>

                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80">
                    <span className="text-stone-500 font-semibold block">🌙 Dinner</span>
                    <p className="font-bold text-stone-900 mt-1">3 Chapatis + Paneer Curry</p>
                    <span className="text-emerald-700 font-extrabold">560 kcal</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Target Audiences & Features */}
      <section className="py-16 bg-white border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full">
              Designed For Real Lives
            </span>
            <h2 className="text-3xl font-extrabold text-stone-950 mt-3">
              Finally, a nutrition tracker that understands Indian meals
            </h2>
            <p className="text-stone-600 mt-3 text-sm sm:text-base">
              Western trackers struggle with rotis, sabzis, and biryanis. NutriTrack AI was built from the ground up with genuine portion measurements and regional dishes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-stone-50 border border-stone-200/80 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4">
                <Utensils className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-stone-900 mb-2">
                120+ Authentic Indian Foods
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Log dosas, poha, paneer bhurji, dal tadka, and chicken biryani with precise katori, bowl, and piece measurements.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-stone-50 border border-stone-200/80 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-stone-900 mb-2">
                AI Nutrition Insights
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Gemini AI reviews your actual logged food history and warns about protein deficits or carbohydrate heavy meals with tailored Indian swaps.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-stone-50 border border-stone-200/80 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-800 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-stone-900 mb-2">
                Real-Time Live Dashboard
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Powered by Socket.IO. When you log a meal on one device, calories, macros, and charts update across all screens without reloading.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-10 bg-stone-900 text-stone-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-emerald-500 flex items-center justify-center text-stone-950 font-black text-xs">N</span>
            <span className="font-bold text-white text-sm">NutriTrack AI</span>
            <span>— Smart Nutrition for India</span>
          </div>
          <p>© {new Date().getFullYear()} NutriTrack AI. Real-time Indian Nutrition Platform.</p>
        </div>
      </footer>
    </div>
  );
};
