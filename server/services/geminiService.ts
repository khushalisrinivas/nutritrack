import { GoogleGenAI } from '@google/genai';
import { IUser, IFoodEntry } from '../config/db';

export interface NutritionInsight {
  title: string;
  category: 'protein' | 'calories' | 'carbs' | 'fats' | 'habits' | 'recommendation';
  badge: string;
  badgeColor: 'emerald' | 'amber' | 'blue' | 'rose' | 'purple';
  message: string;
  actionableTip: string;
  suggestedFoods?: string[];
}

export interface AiInsightsResponse {
  insights: NutritionInsight[];
  overallEvaluation: string;
  macroBalanceScore: number; // 0 - 100
  disclaimer: string;
}

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

export async function generateAiNutritionInsights(
  user: IUser,
  entries: IFoodEntry[]
): Promise<AiInsightsResponse> {
  const DISCLAIMER = 'AI suggestions are informational and for educational purposes only, not medical or clinical dietary advice.';

  // If no entries or only 0 entries
  if (entries.length === 0) {
    return {
      insights: [
        {
          title: 'Start Logging Today',
          category: 'habits',
          badge: 'Fresh Start',
          badgeColor: 'emerald',
          message: 'You have not logged any meals yet today. Begin by tracking your breakfast to get personalized nutrition analytics.',
          actionableTip: 'Try logging your regular morning tea and breakfast like Idli, Poha, or Eggs.',
          suggestedFoods: ['Idli with Sambar', 'Kanda Poha', 'Boiled Eggs', 'Besan Chilla'],
        },
      ],
      overallEvaluation: 'Ready to track your first Indian meals! Log breakfast or lunch to unlock real-time macro analysis.',
      macroBalanceScore: 80,
      disclaimer: DISCLAIMER,
    };
  }

  // Calculate actual totals
  const todayStr = new Date().toISOString().split('T')[0];
  const todayEntries = entries.filter((e) => e.date === todayStr);
  const activeEntries = todayEntries.length > 0 ? todayEntries : entries.slice(-15);

  const totalCalories = activeEntries.reduce((acc, curr) => acc + (curr.calories || 0), 0);
  const totalProtein = activeEntries.reduce((acc, curr) => acc + (curr.protein || 0), 0);
  const totalCarbs = activeEntries.reduce((acc, curr) => acc + (curr.carbohydrates || 0), 0);
  const totalFat = activeEntries.reduce((acc, curr) => acc + (curr.fats || 0), 0);

  const foodNames = activeEntries.map((e) => `${e.foodName} (${e.servingSize}, ${e.calories} kcal)`).join(', ');

  const promptContext = `
User Profile:
- Name: ${user.name}
- Age: ${user.age}, Gender: ${user.gender}, Weight: ${user.weight}kg, Height: ${user.height}cm
- Goal: ${user.goal} weight (Activity: ${user.activityLevel})
- Calorie Target: ${user.calorieGoal} kcal
- Protein Target: ${user.proteinGoal}g
- Carbs Target: ${user.carbGoal}g
- Fat Target: ${user.fatGoal}g

Current Nutrition Consumed:
- Calories: ${totalCalories} / ${user.calorieGoal} kcal (${Math.round((totalCalories / user.calorieGoal) * 100)}%)
- Protein: ${totalProtein}g / ${user.proteinGoal}g (${Math.round((totalProtein / user.proteinGoal) * 100)}%)
- Carbs: ${totalCarbs}g / ${user.carbGoal}g (${Math.round((totalCarbs / user.carbGoal) * 100)}%)
- Fat: ${totalFat}g / ${user.fatGoal}g (${Math.round((totalFat / user.fatGoal) * 100)}%)

Logged Foods:
${foodNames}
`;

  const ai = getAiClient();
  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `You are NutriTrack AI's senior clinical nutritionist specializing in Indian diets and fitness nutrition.
Analyze the user's logged nutrition data vs their personal targets.
Return a valid JSON object matching the exact structure below.

Expected JSON output format:
{
  "overallEvaluation": "A scannable 2-sentence summary of today's nutritional performance for an Indian lifestyle.",
  "macroBalanceScore": 85,
  "insights": [
    {
      "title": "Short title",
      "category": "protein" | "calories" | "carbs" | "fats" | "habits" | "recommendation",
      "badge": "e.g. Under Target / High Fiber / Good Habit",
      "badgeColor": "emerald" | "amber" | "blue" | "rose" | "purple",
      "message": "Specific observation mentioning their logged food items and percentage gap or surplus.",
      "actionableTip": "Concrete next meal or snack suggestion with Indian ingredients.",
      "suggestedFoods": ["Paneer Bhurji", "Sprouts Chaat", "Soya Chunks"]
    }
  ]
}

Data to analyze:
${promptContext}`,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.3,
        },
      });

      if (response.text) {
        const parsed = JSON.parse(response.text.trim());
        return {
          insights: parsed.insights || [],
          overallEvaluation: parsed.overallEvaluation || 'Your daily nutrition intake has been analyzed against your targets.',
          macroBalanceScore: parsed.macroBalanceScore || 85,
          disclaimer: DISCLAIMER,
        };
      }
    } catch (err) {
      console.warn('Gemini AI call failed, using intelligent analytical fallback:', err);
    }
  }

  // Rule-based fallback rooted in real user data if API call isn't available
  const proteinGap = user.proteinGoal - totalProtein;
  const calPercent = Math.round((totalCalories / user.calorieGoal) * 100);
  const insights: NutritionInsight[] = [];

  if (proteinGap > 25) {
    insights.push({
      title: 'Protein Intake Below Daily Target',
      category: 'protein',
      badge: `${Math.round((proteinGap / user.proteinGoal) * 100)}% Deficit`,
      badgeColor: 'amber',
      message: `You consumed ${Math.round(totalProtein)}g of protein today against your target of ${user.proteinGoal}g. Indian vegetarian diets frequently lack concentrated protein.`,
      actionableTip: 'Add high-protein Indian options such as paneer bhurji, moong sprouts salad, boiled eggs, curd, or soya chunks to your next meal.',
      suggestedFoods: ['Paneer Bhurji (Scrambled Paneer)', 'Moong Sprouts Chaat Salad', 'Boiled Eggs', 'Whey Protein Shake'],
    });
  } else {
    insights.push({
      title: 'Excellent Protein Consistency',
      category: 'protein',
      badge: 'Goal Achieved',
      badgeColor: 'emerald',
      message: `You have hit ${Math.round(totalProtein)}g (${Math.round((totalProtein / user.proteinGoal) * 100)}%) of your protein goal. Great support for muscle synthesis and satiety!`,
      actionableTip: 'Keep spacing your protein evenly across breakfast, lunch, and dinner.',
      suggestedFoods: ['Cooked Dal Tadka', 'Palak Paneer', 'Grilled Chicken Breast'],
    });
  }

  if (totalCarbs > user.carbGoal * 1.1) {
    insights.push({
      title: 'Carbohydrate Distribution High',
      category: 'carbs',
      badge: 'High Carbs',
      badgeColor: 'purple',
      message: `Carbohydrates currently make up a larger portion of your intake. Rice-based and wheat-based dishes add up quickly throughout the day.`,
      actionableTip: 'Balance future meals by reducing rice portion to 1 cup and substituting with a double bowl of dal or fibrous sabzi.',
      suggestedFoods: ['Cooked Brown Rice', 'Aloo Gobi Matar', 'Salted Masala Chaas'],
    });
  } else {
    insights.push({
      title: 'Balanced Glycemic Index',
      category: 'carbs',
      badge: 'Optimal',
      badgeColor: 'blue',
      message: `Carbohydrates are well within your daily allowance (${Math.round(totalCarbs)}g / ${user.carbGoal}g).`,
      actionableTip: 'Include complex whole grains like rolled oats, brown rice, and whole wheat rotis to maintain sustained energy.',
      suggestedFoods: ['Chapati / Phulka', 'Rolled Oats Porridge', 'Kanda Poha'],
    });
  }

  if (calPercent < 75) {
    insights.push({
      title: 'Calorie Deficit Notice',
      category: 'calories',
      badge: `${user.calorieGoal - totalCalories} kcal remaining`,
      badgeColor: 'blue',
      message: `Your calorie intake is currently ${totalCalories} kcal. You have plenty of room for an evening snack or nutrient-dense dinner.`,
      actionableTip: 'Include a nourishing snack such as roasted makhana, boiled peanut chaat, or fruit with nuts before bedtime.',
      suggestedFoods: ['Roasted Makhana', 'Boiled Peanut Chaat', 'Fresh Plain Curd / Dahi', 'Raw Mixed Almonds & Walnuts'],
    });
  }

  return {
    insights,
    overallEvaluation: `You have logged ${activeEntries.length} items totaling ${totalCalories} kcal today. Your macro distribution is tracking close to your ${user.goal} weight objective.`,
    macroBalanceScore: Math.min(95, Math.max(60, Math.round(100 - Math.abs(calPercent - 100) * 0.4))),
    disclaimer: DISCLAIMER,
  };
}
