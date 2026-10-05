import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db, IUser } from '../config/db';

const JWT_SECRET = process.env.JWT_SECRET || 'nutritrack_super_secret_jwt_key_2026_change_in_production';

export interface AuthRequest extends Request {
  user?: IUser;
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Authorization token required' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string };
    const user = db.users.findById(decoded.id);

    if (!user) {
      res.status(401).json({ message: 'User not found or account removed' });
      return;
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token', error: (err as Error).message });
  }
}
