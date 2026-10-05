import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Sparkles, RefreshCw, AlertCircle, CheckCircle, Info } from 'lucide-react';

interface InsightItem {
  title: string;
  category: string;
  badge: string;
  badgeColor: 'emerald' | 'amber' | 'blue' | 'rose' | 'purple';
  message: string;
  actionableTip: string;
  suggestedFoods?: string[];
}

interface AiInsightsData {
  insights: InsightItem[];
  overallEvaluation: string;
  macroBalanceScore: number;
  disclaimer: string;
}

export const AiInsightsCard: React.FC = () => {
  const [data, setData] = useState<AiInsightsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchInsights = async () => {
    try {
      setRefreshing(true);
      const res = await api.get('/insights');
      setData(res.data);
    } catch (err) {
      console.error('Failed to load AI insights:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  const badgeColorMap: Record<string, string> = {
    emerald: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    amber: 'bg-amber-100 text-amber-800 border-amber-200',
    blue: 'bg-sky-100 text-sky-800 border-sky-200',
    rose: 'bg-rose-100 text-rose-800 border-rose-200',
    purple: 'bg-purple-100 text-purple-800 border-purple-200',
  };

  return (
    <div className="bg-gradient-to-br from-emerald-950 via-stone-900 to-emerald-900 rounded-3xl p-6 text-white shadow-md relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-stone-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-emerald-400 flex items-center justify-center text-stone-950 shadow-md">
            <Sparkles className="w-5 h-5 fill-stone-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-extrabold tracking-tight text-white">
                AI Nutrition Insights
              </h3>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Gemini Intelligence
              </span>
            </div>
            <p className="text-xs text-stone-300 mt-0.5">
              Personalized dietary analysis computed directly from your logged Indian meals
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          {data && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur border border-white/10 text-xs">
              <span className="text-stone-300">Macro Balance Score:</span>
              <span className="font-extrabold text-amber-300 text-sm">
                {data.macroBalanceScore}/100
              </span>
            </div>
          )}

          <button
            onClick={fetchInsights}
            disabled={refreshing}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-stone-200 transition-colors cursor-pointer disabled:opacity-50"
            title="Refresh AI Insights"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Overall evaluation banner */}
      {data && (
        <div className="relative z-10 mt-5 p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs sm:text-sm text-stone-200 leading-relaxed flex items-start gap-2.5">
          <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <span>{data.overallEvaluation}</span>
        </div>
      )}

      {/* Insight Cards Grid */}
      <div className="relative z-10 mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-2 py-10 text-center text-xs text-stone-400 flex flex-col items-center justify-center gap-2">
            <RefreshCw className="w-6 h-6 animate-spin text-emerald-400" />
            <span>Analyzing your food history with Gemini AI...</span>
          </div>
        ) : data && data.insights.length > 0 ? (
          data.insights.map((item, idx) => (
            <div
              key={idx}
              className="bg-white/10 hover:bg-white/15 transition-colors p-4 rounded-2xl border border-white/10 space-y-2.5 backdrop-blur-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <h4 className="font-bold text-sm text-white">{item.title}</h4>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                      badgeColorMap[item.badgeColor] || 'bg-stone-800 text-stone-300 border-stone-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                </div>
                <p className="text-xs text-stone-300 leading-relaxed">{item.message}</p>
              </div>

              <div className="pt-2 border-t border-white/10">
                <p className="text-xs text-amber-200/90 font-medium">
                  💡 <strong className="text-amber-100">Action:</strong> {item.actionableTip}
                </p>
                {item.suggestedFoods && item.suggestedFoods.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {item.suggestedFoods.map((food, fIdx) => (
                      <span
                        key={fIdx}
                        className="text-[10px] px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-200 border border-emerald-500/30"
                      >
                        + {food}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 py-6 text-center text-xs text-stone-400">
            Log at least one meal today to generate live AI insights.
          </div>
        )}
      </div>

      {/* Medical Disclaimer */}
      <div className="relative z-10 mt-6 pt-4 border-t border-stone-800/80 flex items-center gap-2 text-[11px] text-stone-400">
        <AlertCircle className="w-3.5 h-3.5 text-stone-400 shrink-0" />
        <span>
          Disclaimer: AI Nutrition Insights are informational and educational, not clinical medical advice. Consult a certified nutritionist or physician for clinical diet planning.
        </span>
      </div>
    </div>
  );
};
