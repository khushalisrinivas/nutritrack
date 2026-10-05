import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { db } from '../config/db';
import { calculateRecommendedGoals } from '../utils/nutritionCalculator';
import { calculateUserStreak } from '../services/streakService';
import { emitUserEvent } from '../socket/socketHandler';

export async function getProfile(req: AuthRequest, res: Response): Promise<void> {
  try {
    const user = req.user!;
    const userEntries = db.foodEntries.find((f) => f.userId === user._id);
    const streakInfo = calculateUserStreak(userEntries);

    const { password, ...sanitized } = user;
    res.json({
      user: sanitized,
      streak: streakInfo,
    });
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to fetch profile', error: err.message });
  }
}

export async function updateProfile(req: AuthRequest, res: Response): Promise<void> {
  try {
    const user = req.user!;
    const { name, age, gender, height, weight, activityLevel, goal, autoRecalculateGoals } = req.body;

    const updates: any = {};
    if (name) updates.name = name.trim();
    if (age !== undefined) updates.age = Number(age);
    if (gender) updates.gender = gender;
    if (height !== undefined) updates.height = Number(height);
    if (weight !== undefined) updates.weight = Number(weight);
    if (activityLevel) updates.activityLevel = activityLevel;
    if (goal) updates.goal = goal;

    if (autoRecalculateGoals) {
      const calculated = calculateRecommendedGoals({
        age: updates.age ?? user.age,
        gender: updates.gender ?? user.gender,
        height: updates.height ?? user.height,
        weight: updates.weight ?? user.weight,
        activityLevel: updates.activityLevel ?? user.activityLevel,
        goal: updates.goal ?? user.goal,
      });
      updates.calorieGoal = calculated.calorieGoal;
      updates.proteinGoal = calculated.proteinGoal;
      updates.carbGoal = calculated.carbGoal;
      updates.fatGoal = calculated.fatGoal;
    }

    const updated = db.users.findByIdAndUpdate(user._id, updates);
    if (!updated) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    emitUserEvent(user._id, 'goalUpdated', {
      calorieGoal: updated.calorieGoal,
      proteinGoal: updated.proteinGoal,
      carbGoal: updated.carbGoal,
      fatGoal: updated.fatGoal,
    });

    const { password, ...sanitized } = updated;
    res.json({ message: 'Profile updated successfully', user: sanitized });
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to update profile', error: err.message });
  }
}

export async function updateGoals(req: AuthRequest, res: Response): Promise<void> {
  try {
    const user = req.user!;
    const { calorieGoal, proteinGoal, carbGoal, fatGoal } = req.body;

    const updates: any = {};
    if (calorieGoal !== undefined) updates.calorieGoal = Number(calorieGoal);
    if (proteinGoal !== undefined) updates.proteinGoal = Number(proteinGoal);
    if (carbGoal !== undefined) updates.carbGoal = Number(carbGoal);
    if (fatGoal !== undefined) updates.fatGoal = Number(fatGoal);

    const updated = db.users.findByIdAndUpdate(user._id, updates);
    if (!updated) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    emitUserEvent(user._id, 'goalUpdated', {
      calorieGoal: updated.calorieGoal,
      proteinGoal: updated.proteinGoal,
      carbGoal: updated.carbGoal,
      fatGoal: updated.fatGoal,
    });

    const { password, ...sanitized } = updated;
    res.json({ message: 'Nutrition goals updated successfully', user: sanitized });
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to update nutrition goals', error: err.message });
  }
}
