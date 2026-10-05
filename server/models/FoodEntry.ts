import mongoose, { Schema, Document } from 'mongoose';

export interface IFoodEntryDocument extends Document {
  userId: string;
  foodName: string;
  mealType: 'breakfast' | 'lunch' | 'snack' | 'dinner';
  servingSize: string;
  servingMultiplier?: number;
  calories: number;
  protein: number;
  carbohydrates: number;
  fats: number;
  fiber?: number;
  date: string; // YYYY-MM-DD
  notes?: string;
  source: 'indian_db' | 'usda' | 'quick_add' | 'custom';
  category?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const FoodEntrySchema = new Schema<IFoodEntryDocument>(
  {
    userId: { type: String, required: true, index: true },
    foodName: { type: String, required: true, trim: true },
    mealType: {
      type: String,
      required: true,
      enum: ['breakfast', 'lunch', 'snack', 'dinner'],
    },
    servingSize: { type: String, required: true },
    servingMultiplier: { type: Number, default: 1 },
    calories: { type: Number, required: true },
    protein: { type: Number, required: true },
    carbohydrates: { type: Number, required: true },
    fats: { type: Number, required: true },
    fiber: { type: Number, default: 0 },
    date: { type: String, required: true, index: true }, // Format: YYYY-MM-DD
    notes: { type: String, trim: true, default: '' },
    source: {
      type: String,
      enum: ['indian_db', 'usda', 'quick_add', 'custom'],
      default: 'indian_db',
    },
    category: { type: String, default: 'General' },
  },
  { timestamps: true }
);

FoodEntrySchema.index({ userId: 1, date: 1 });

export const FoodEntryModel =
  mongoose.models.FoodEntry || mongoose.model<IFoodEntryDocument>('FoodEntry', FoodEntrySchema);
