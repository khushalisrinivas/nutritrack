import fs from 'fs';
import path from 'path';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string; // bcrypt hash
  age: number;
  gender: 'male' | 'female' | 'other';
  height: number; // in cm
  weight: number; // in kg
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goal: 'maintain' | 'gain' | 'lose';
  calorieGoal: number;
  proteinGoal: number;
  carbGoal: number;
  fatGoal: number;
  createdAt: string;
  updatedAt: string;
}

export interface IFoodEntry {
  _id: string;
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
  createdAt: string;
  updatedAt: string;
}

interface DatabaseState {
  users: IUser[];
  foodEntries: IFoodEntry[];
}

const DATA_DIR = path.resolve(process.cwd(), '.data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

let memoryDb: DatabaseState = {
  users: [],
  foodEntries: [],
};

// Load database from disk if exists
try {
  if (fs.existsSync(DB_FILE)) {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    memoryDb = JSON.parse(raw);
  }
} catch (err) {
  console.warn('Failed to load local database, initializing fresh:', err);
}

export function saveDatabase(): void {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(memoryDb, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to persist database:', err);
  }
}

export const db = {
  users: {
    find: (predicate?: (u: IUser) => boolean) => {
      return predicate ? memoryDb.users.filter(predicate) : [...memoryDb.users];
    },
    findById: (id: string) => {
      return memoryDb.users.find((u) => u._id === id) || null;
    },
    findOne: (predicate: (u: IUser) => boolean) => {
      return memoryDb.users.find(predicate) || null;
    },
    create: (data: Omit<IUser, '_id' | 'createdAt' | 'updatedAt'>) => {
      const now = new Date().toISOString();
      const newUser: IUser = {
        _id: 'user_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36),
        ...data,
        createdAt: now,
        updatedAt: now,
      };
      memoryDb.users.push(newUser);
      saveDatabase();
      return newUser;
    },
    findByIdAndUpdate: (id: string, update: Partial<IUser>) => {
      const index = memoryDb.users.findIndex((u) => u._id === id);
      if (index === -1) return null;
      const updated = {
        ...memoryDb.users[index],
        ...update,
        updatedAt: new Date().toISOString(),
      };
      memoryDb.users[index] = updated;
      saveDatabase();
      return updated;
    },
  },
  foodEntries: {
    find: (predicate?: (f: IFoodEntry) => boolean) => {
      return predicate ? memoryDb.foodEntries.filter(predicate) : [...memoryDb.foodEntries];
    },
    findById: (id: string) => {
      return memoryDb.foodEntries.find((f) => f._id === id) || null;
    },
    create: (data: Omit<IFoodEntry, '_id' | 'createdAt' | 'updatedAt'>) => {
      const now = new Date().toISOString();
      const newEntry: IFoodEntry = {
        _id: 'food_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36),
        ...data,
        createdAt: now,
        updatedAt: now,
      };
      memoryDb.foodEntries.push(newEntry);
      saveDatabase();
      return newEntry;
    },
    findByIdAndUpdate: (id: string, update: Partial<IFoodEntry>) => {
      const index = memoryDb.foodEntries.findIndex((f) => f._id === id);
      if (index === -1) return null;
      const updated = {
        ...memoryDb.foodEntries[index],
        ...update,
        updatedAt: new Date().toISOString(),
      };
      memoryDb.foodEntries[index] = updated;
      saveDatabase();
      return updated;
    },
    findByIdAndDelete: (id: string) => {
      const index = memoryDb.foodEntries.findIndex((f) => f._id === id);
      if (index === -1) return null;
      const deleted = memoryDb.foodEntries.splice(index, 1)[0];
      saveDatabase();
      return deleted;
    },
  },
};
