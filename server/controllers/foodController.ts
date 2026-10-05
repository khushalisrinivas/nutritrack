import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { db, IFoodEntry } from '../config/db';
import { searchFoodCatalog, getFoodById } from '../services/foodApiService';
import { emitUserEvent } from '../socket/socketHandler';
import { aggregateNutritionForEntries } from '../utils/nutritionCalculator';

export async function getFoods(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user!._id;
    const { date, startDate, endDate, mealType, search } = req.query;

    let entries = db.foodEntries.find((f) => f.userId === userId);

    if (date) {
      entries = entries.filter((f) => f.date === String(date));
    } else if (startDate && endDate) {
      entries = entries.filter((f) => f.date >= String(startDate) && f.date <= String(endDate));
    }

    if (mealType && ['breakfast', 'lunch', 'snack', 'dinner'].includes(String(mealType))) {
      entries = entries.filter((f) => f.mealType === mealType);
    }

    if (search) {
      const q = String(search).toLowerCase();
      entries = entries.filter((f) => f.foodName.toLowerCase().includes(q) || (f.notes && f.notes.toLowerCase().includes(q)));
    }

    // Sort by createdAt descending or date descending
    entries.sort((a, b) => (b.date + b.createdAt).localeCompare(a.date + a.createdAt));

    res.json({ entries });
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to fetch food entries', error: err.message });
  }
}

export async function getFoodEntryById(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user!._id;
    const { id } = req.params;

    const entry = db.foodEntries.findById(id);
    if (!entry || entry.userId !== userId) {
      res.status(404).json({ message: 'Food entry not found' });
      return;
    }

    res.json({ entry });
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to fetch food entry', error: err.message });
  }
}

export async function createFood(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user!._id;
    const {
      foodName,
      mealType,
      servingSize,
      servingMultiplier = 1,
      calories,
      protein,
      carbohydrates,
      fats,
      fiber = 0,
      date,
      notes = '',
      source = 'indian_db',
      category = 'General',
    } = req.body;

    if (!foodName || !mealType || calories === undefined || protein === undefined || carbohydrates === undefined || fats === undefined) {
      res.status(400).json({ message: 'Food name, meal type, calories, and macros are required' });
      return;
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const entryDate = date || todayStr;

    const multiplier = Number(servingMultiplier) || 1;
    const finalCalories = Math.round(Number(calories) * multiplier);
    const finalProtein = Math.round(Number(protein) * multiplier * 10) / 10;
    const finalCarbs = Math.round(Number(carbohydrates) * multiplier * 10) / 10;
    const finalFats = Math.round(Number(fats) * multiplier * 10) / 10;
    const finalFiber = Math.round(Number(fiber) * multiplier * 10) / 10;

    const newEntry = db.foodEntries.create({
      userId,
      foodName: foodName.trim(),
      mealType,
      servingSize: servingSize || '1 standard serving',
      servingMultiplier: multiplier,
      calories: finalCalories,
      protein: finalProtein,
      carbohydrates: finalCarbs,
      fats: finalFats,
      fiber: finalFiber,
      date: entryDate,
      notes: notes.trim(),
      source,
      category,
    });

    // Compute updated day summary
    const allUserEntries = db.foodEntries.find((f) => f.userId === userId);
    const daySummary = aggregateNutritionForEntries(allUserEntries, entryDate);

    // Emit real-time events via Socket.IO
    emitUserEvent(userId, 'foodAdded', newEntry);
    emitUserEvent(userId, 'nutritionUpdated', daySummary);

    res.status(201).json({
      message: 'Meal logged successfully',
      entry: newEntry,
      daySummary,
    });
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to create food entry', error: err.message });
  }
}

export async function quickAdd(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user!._id;
    const { name, calories, protein, carbohydrates, fats, mealType, date, notes } = req.body;

    if (calories === undefined || !mealType) {
      res.status(400).json({ message: 'Calories and meal type are required for quick add' });
      return;
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const entryDate = date || todayStr;

    const newEntry = db.foodEntries.create({
      userId,
      foodName: name?.trim() || 'Quick Add Meal',
      mealType,
      servingSize: '1 quick entry',
      servingMultiplier: 1,
      calories: Math.round(Number(calories)),
      protein: Math.round(Number(protein || 0) * 10) / 10,
      carbohydrates: Math.round(Number(carbohydrates || 0) * 10) / 10,
      fats: Math.round(Number(fats || 0) * 10) / 10,
      fiber: 0,
      date: entryDate,
      notes: notes ? notes.trim() : 'Logged via Quick Add',
      source: 'quick_add',
      category: 'Quick Add',
    });

    const allUserEntries = db.foodEntries.find((f) => f.userId === userId);
    const daySummary = aggregateNutritionForEntries(allUserEntries, entryDate);

    emitUserEvent(userId, 'foodAdded', newEntry);
    emitUserEvent(userId, 'nutritionUpdated', daySummary);

    res.status(201).json({
      message: 'Quick meal added successfully',
      entry: newEntry,
      daySummary,
    });
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to quick add meal', error: err.message });
  }
}

export async function updateFood(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user!._id;
    const { id } = req.params;

    const existing = db.foodEntries.findById(id);
    if (!existing || existing.userId !== userId) {
      res.status(404).json({ message: 'Food entry not found' });
      return;
    }

    const { foodName, mealType, servingSize, calories, protein, carbohydrates, fats, fiber, date, notes } = req.body;

    const updates: Partial<IFoodEntry> = {};
    if (foodName) updates.foodName = foodName.trim();
    if (mealType) updates.mealType = mealType;
    if (servingSize) updates.servingSize = servingSize;
    if (calories !== undefined) updates.calories = Math.round(Number(calories));
    if (protein !== undefined) updates.protein = Math.round(Number(protein) * 10) / 10;
    if (carbohydrates !== undefined) updates.carbohydrates = Math.round(Number(carbohydrates) * 10) / 10;
    if (fats !== undefined) updates.fats = Math.round(Number(fats) * 10) / 10;
    if (fiber !== undefined) updates.fiber = Math.round(Number(fiber) * 10) / 10;
    if (date) updates.date = date;
    if (notes !== undefined) updates.notes = notes.trim();

    const updated = db.foodEntries.findByIdAndUpdate(id, updates);
    if (!updated) {
      res.status(404).json({ message: 'Entry could not be updated' });
      return;
    }

    const targetDate = updated.date;
    const allUserEntries = db.foodEntries.find((f) => f.userId === userId);
    const daySummary = aggregateNutritionForEntries(allUserEntries, targetDate);

    emitUserEvent(userId, 'foodUpdated', updated);
    emitUserEvent(userId, 'nutritionUpdated', daySummary);

    res.json({ message: 'Food entry updated', entry: updated, daySummary });
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to update food entry', error: err.message });
  }
}

export async function deleteFood(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user!._id;
    const { id } = req.params;

    const existing = db.foodEntries.findById(id);
    if (!existing || existing.userId !== userId) {
      res.status(404).json({ message: 'Food entry not found' });
      return;
    }

    const entryDate = existing.date;
    const deleted = db.foodEntries.findByIdAndDelete(id);

    const allUserEntries = db.foodEntries.find((f) => f.userId === userId);
    const daySummary = aggregateNutritionForEntries(allUserEntries, entryDate);

    emitUserEvent(userId, 'foodDeleted', { id, entryDate });
    emitUserEvent(userId, 'nutritionUpdated', daySummary);

    res.json({ message: 'Food entry deleted', entry: deleted, daySummary });
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to delete food entry', error: err.message });
  }
}

export async function searchCatalog(req: AuthRequest, res: Response): Promise<void> {
  try {
    const query = String(req.query.q || '');
    const filter = (req.query.filter as any) || 'all';

    const results = await searchFoodCatalog(query, filter);
    res.json({ results });
  } catch (err: any) {
    res.status(500).json({ message: 'Search failed', error: err.message });
  }
}
