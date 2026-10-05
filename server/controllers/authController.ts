import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db, IUser } from '../config/db';
import { calculateRecommendedGoals } from '../utils/nutritionCalculator';
import { ensureDemoDataSeeded, DEMO_USER_EMAIL, DEMO_USER_PASSWORD } from '../services/seedData';

const JWT_SECRET = process.env.JWT_SECRET || 'nutritrack_super_secret_jwt_key_2026_change_in_production';
const JWT_EXPIRES_IN = '7d';

function generateToken(user: IUser): string {
  return jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

function sanitizeUser(user: IUser) {
  const { password, ...rest } = user;
  return rest;
}

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { name, email, password, confirmPassword, age, gender, height, weight, activityLevel, goal } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ message: 'Name, email, and password are required' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ message: 'Password must be at least 6 characters long' });
      return;
    }

    if (confirmPassword && password !== confirmPassword) {
      res.status(400).json({ message: 'Passwords do not match' });
      return;
    }

    const existingUser = db.users.findOne((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      res.status(400).json({ message: 'An account with this email already exists' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userAge = Number(age) || 24;
    const userGender = gender === 'female' ? 'female' : 'male';
    const userHeight = Number(height) || 172;
    const userWeight = Number(weight) || 68;
    const userActivity = activityLevel || 'moderate';
    const userGoal = goal || 'maintain';

    const calculatedGoals = calculateRecommendedGoals({
      age: userAge,
      gender: userGender,
      height: userHeight,
      weight: userWeight,
      activityLevel: userActivity,
      goal: userGoal,
    });

    const newUser = db.users.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      age: userAge,
      gender: userGender,
      height: userHeight,
      weight: userWeight,
      activityLevel: userActivity,
      goal: userGoal,
      calorieGoal: calculatedGoals.calorieGoal,
      proteinGoal: calculatedGoals.proteinGoal,
      carbGoal: calculatedGoals.carbGoal,
      fatGoal: calculatedGoals.fatGoal,
    });

    const token = generateToken(newUser);

    res.status(201).json({
      message: 'Account created successfully',
      token,
      user: sanitizeUser(newUser),
    });
  } catch (err: any) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' });
      return;
    }

    // Check if logging in as demo user and seed if needed
    if (email.toLowerCase() === DEMO_USER_EMAIL.toLowerCase()) {
      await ensureDemoDataSeeded();
    }

    const user = db.users.findOne((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    const token = generateToken(user);

    res.json({
      message: 'Logged in successfully',
      token,
      user: sanitizeUser(user),
    });
  } catch (err: any) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
}

export async function demoLogin(req: Request, res: Response): Promise<void> {
  try {
    const demoUser = await ensureDemoDataSeeded();
    const token = generateToken(demoUser);

    res.json({
      message: 'Logged in as Demo User (Ravi)',
      token,
      user: sanitizeUser(demoUser),
    });
  } catch (err: any) {
    res.status(500).json({ message: 'Demo login failed', error: err.message });
  }
}
