import mongoose, { Schema, Document } from 'mongoose';

export interface IUserDocument extends Document {
  name: string;
  email: string;
  password?: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  height: number;
  weight: number;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goal: 'maintain' | 'gain' | 'lose';
  calorieGoal: number;
  proteinGoal: number;
  carbGoal: number;
  fatGoal: number;
  createdAt: Date;
  updatedAt: Date;
}

export const UserSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    age: { type: Number, default: 24 },
    gender: { type: String, enum: ['male', 'female', 'other'], default: 'male' },
    height: { type: Number, default: 175 }, // cm
    weight: { type: Number, default: 70 }, // kg
    activityLevel: {
      type: String,
      enum: ['sedentary', 'light', 'moderate', 'active', 'very_active'],
      default: 'moderate',
    },
    goal: {
      type: String,
      enum: ['maintain', 'gain', 'lose'],
      default: 'maintain',
    },
    calorieGoal: { type: Number, default: 2500 },
    proteinGoal: { type: Number, default: 125 },
    carbGoal: { type: Number, default: 313 },
    fatGoal: { type: Number, default: 83 },
  },
  { timestamps: true }
);

export const UserModel = mongoose.models.User || mongoose.model<IUserDocument>('User', UserSchema);
