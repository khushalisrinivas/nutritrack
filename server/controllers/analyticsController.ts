import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { db, IFoodEntry } from '../config/db';
import { aggregateNutritionForEntries } from '../utils/nutritionCalculator';

export async function getDailyAnalytics(req: AuthRequest, res: Response): Promise<void> {
  try {
    const user = req.user!;
    const dateStr = String(req.query.date || new Date().toISOString().split('T')[0]);

    const userEntries = db.foodEntries.find((f) => f.userId === user._id);
    const summary = aggregateNutritionForEntries(userEntries, dateStr);

    const remainingCalories = Math.max(0, user.calorieGoal - summary.totalCalories);
    const caloriePercentage = Math.round((summary.totalCalories / user.calorieGoal) * 100);
    const proteinPercentage = Math.round((summary.totalProtein / user.proteinGoal) * 100);
    const carbPercentage = Math.round((summary.totalCarbs / user.carbGoal) * 100);
    const fatPercentage = Math.round((summary.totalFat / user.fatGoal) * 100);

    res.json({
      summary,
      goals: {
        calorieGoal: user.calorieGoal,
        proteinGoal: user.proteinGoal,
        carbGoal: user.carbGoal,
        fatGoal: user.fatGoal,
      },
      comparison: {
        remainingCalories,
        caloriePercentage,
        proteinPercentage,
        carbPercentage,
        fatPercentage,
      },
    });
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to generate daily analytics', error: err.message });
  }
}

export async function getWeeklyAnalytics(req: AuthRequest, res: Response): Promise<void> {
  try {
    const user = req.user!;
    const userEntries = db.foodEntries.find((f) => f.userId === user._id);

    // Build the past 7 days dates array
    const today = new Date();
    const days: { date: string; label: string }[] = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const iso = d.toISOString().split('T')[0];
      const weekday = d.toLocaleDateString('en-US', { weekday: 'short' });
      const monthDay = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      days.push({
        date: iso,
        label: i === 0 ? 'Today' : `${weekday}, ${monthDay}`,
      });
    }

    const dailyTrends = days.map((day) => {
      const daySummary = aggregateNutritionForEntries(userEntries, day.date);
      return {
        date: day.date,
        label: day.label,
        calories: daySummary.totalCalories,
        calorieGoal: user.calorieGoal,
        protein: daySummary.totalProtein,
        proteinGoal: user.proteinGoal,
        carbs: daySummary.totalCarbs,
        carbGoal: user.carbGoal,
        fats: daySummary.totalFat,
        fatGoal: user.fatGoal,
        breakfast: daySummary.mealBreakdown.breakfast.calories,
        lunch: daySummary.mealBreakdown.lunch.calories,
        snack: daySummary.mealBreakdown.snack.calories,
        dinner: daySummary.mealBreakdown.dinner.calories,
        entryCount: daySummary.entries.length,
      };
    });

    // 7-day averages (only on days with logs or across all 7 days)
    const loggedDays = dailyTrends.filter((d) => d.calories > 0);
    const divisor = loggedDays.length > 0 ? loggedDays.length : 1;

    const totalCals = dailyTrends.reduce((acc, d) => acc + d.calories, 0);
    const totalProt = dailyTrends.reduce((acc, d) => acc + d.protein, 0);
    const totalCarb = dailyTrends.reduce((acc, d) => acc + d.carbs, 0);
    const totalFats = dailyTrends.reduce((acc, d) => acc + d.fats, 0);

    const averages = {
      calories: Math.round(totalCals / divisor),
      protein: Math.round((totalProt / divisor) * 10) / 10,
      carbs: Math.round((totalCarb / divisor) * 10) / 10,
      fat: Math.round((totalFats / divisor) * 10) / 10,
      activeDaysCount: loggedDays.length,
    };

    // Macronutrient overall distribution in grams and percentage of calories
    const totalGrams = totalProt + totalCarb + totalFats;
    const macroDistribution = totalGrams > 0
      ? [
          { name: 'Protein', grams: Math.round(totalProt), calories: Math.round(totalProt * 4), percentage: Math.round(((totalProt * 4) / (totalCals || 1)) * 100), color: '#10b981' },
          { name: 'Carbohydrates', grams: Math.round(totalCarb), calories: Math.round(totalCarb * 4), percentage: Math.round(((totalCarb * 4) / (totalCals || 1)) * 100), color: '#f59e0b' },
          { name: 'Fats', grams: Math.round(totalFats), calories: Math.round(totalFats * 9), percentage: Math.round(((totalFats * 9) / (totalCals || 1)) * 100), color: '#6366f1' },
        ]
      : [
          { name: 'Protein', grams: 0, calories: 0, percentage: 25, color: '#10b981' },
          { name: 'Carbohydrates', grams: 0, calories: 0, percentage: 50, color: '#f59e0b' },
          { name: 'Fats', grams: 0, calories: 0, percentage: 25, color: '#6366f1' },
        ];

    // Most frequently logged foods
    const foodCounts: Record<string, { count: number; totalCalories: number; category: string }> = {};
    for (const entry of userEntries) {
      if (!foodCounts[entry.foodName]) {
        foodCounts[entry.foodName] = { count: 0, totalCalories: 0, category: entry.category || 'General' };
      }
      foodCounts[entry.foodName].count += 1;
      foodCounts[entry.foodName].totalCalories += entry.calories || 0;
    }

    const topFoods = Object.entries(foodCounts)
      .map(([name, data]) => ({
        foodName: name,
        count: data.count,
        avgCalories: Math.round(data.totalCalories / data.count),
        category: data.category,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    res.json({
      dailyTrends,
      averages,
      macroDistribution,
      topFoods,
      userGoals: {
        calorieGoal: user.calorieGoal,
        proteinGoal: user.proteinGoal,
        carbGoal: user.carbGoal,
        fatGoal: user.fatGoal,
      },
    });
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to generate weekly analytics', error: err.message });
  }
}
