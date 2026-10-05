import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { db } from '../config/db';
import { generateAiNutritionInsights } from '../services/geminiService';

export async function getInsights(req: AuthRequest, res: Response): Promise<void> {
  try {
    const user = req.user!;
    const userEntries = db.foodEntries.find((f) => f.userId === user._id);

    const result = await generateAiNutritionInsights(user, userEntries);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to generate AI insights', error: err.message });
  }
}
