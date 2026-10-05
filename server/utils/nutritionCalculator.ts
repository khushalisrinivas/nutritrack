import { IUser, IFoodEntry } from '../config/db';

export interface CalculatedGoals {
  calorieGoal: number;
  proteinGoal: number;
  carbGoal: number;
  fatGoal: number;
}

export function calculateRecommendedGoals(user: {
  age: number;
  gender: 'male' | 'female' | 'other';
  height: number;
  weight: number;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goal: 'maintain' | 'gain' | 'lose';
}): CalculatedGoals {
  const { age, gender, height, weight, activityLevel, goal } = user;

  // Mifflin-St Jeor BMR formula
  let bmr: number;
  if (gender === 'female') {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  } else {
    // male or other
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  }

  // Activity multiplier
  const activityMultipliers: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };

  const multiplier = activityMultipliers[activityLevel] || 1.55;
  const tdee = bmr * multiplier;

  // Goal adjustment
  let targetCalories = tdee;
  if (goal === 'lose') {
    targetCalories = Math.max(1400, Math.round(tdee - 450));
  } else if (goal === 'gain') {
    targetCalories = Math.round(tdee + 400);
  } else {
    targetCalories = Math.round(tdee);
  }

  // Protein target: ~1.8g per kg bodyweight
  let targetProtein = Math.round(weight * 1.8);
  if (goal === 'gain') targetProtein = Math.round(weight * 2.0);
  if (goal === 'lose') targetProtein = Math.round(weight * 2.1);

  // Fat target: ~25-30% of total calories (9 cal per g)
  const fatCalories = targetCalories * 0.28;
  const targetFat = Math.round(fatCalories / 9);

  // Carbs target: remaining calories (4 cal per g)
  const remainingCaloriesForCarbs = targetCalories - (targetProtein * 4 + targetFat * 9);
  const targetCarbs = Math.max(100, Math.round(remainingCaloriesForCarbs / 4));

  return {
    calorieGoal: targetCalories,
    proteinGoal: targetProtein,
    carbGoal: targetCarbs,
    fatGoal: targetFat,
  };
}

export interface DayNutritionSummary {
  date: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalFiber: number;
  mealBreakdown: {
    breakfast: { calories: number; count: number };
    lunch: { calories: number; count: number };
    snack: { calories: number; count: number };
    dinner: { calories: number; count: number };
  };
  entries: IFoodEntry[];
}

export function aggregateNutritionForEntries(entries: IFoodEntry[], dateStr: string): DayNutritionSummary {
  const dayEntries = entries.filter((e) => e.date === dateStr);

  const summary: DayNutritionSummary = {
    date: dateStr,
    totalCalories: 0,
    totalProtein: 0,
    totalCarbs: 0,
    totalFat: 0,
    totalFiber: 0,
    mealBreakdown: {
      breakfast: { calories: 0, count: 0 },
      lunch: { calories: 0, count: 0 },
      snack: { calories: 0, count: 0 },
      dinner: { calories: 0, count: 0 },
    },
    entries: dayEntries,
  };

  for (const entry of dayEntries) {
    summary.totalCalories += entry.calories || 0;
    summary.totalProtein += entry.protein || 0;
    summary.totalCarbs += entry.carbohydrates || 0;
    summary.totalFat += entry.fats || 0;
    summary.totalFiber += entry.fiber || 0;

    const mType = entry.mealType;
    if (summary.mealBreakdown[mType]) {
      summary.mealBreakdown[mType].calories += entry.calories || 0;
      summary.mealBreakdown[mType].count += 1;
    }
  }

  summary.totalCalories = Math.round(summary.totalCalories);
  summary.totalProtein = Math.round(summary.totalProtein * 10) / 10;
  summary.totalCarbs = Math.round(summary.totalCarbs * 10) / 10;
  summary.totalFat = Math.round(summary.totalFat * 10) / 10;
  summary.totalFiber = Math.round(summary.totalFiber * 10) / 10;

  return summary;
}
