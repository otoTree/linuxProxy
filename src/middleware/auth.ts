import type { Request, Response, NextFunction } from 'express';
import { config } from '../config';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ error: 'Authorization header missing' });
    return;
  }

  // Expect "Bearer <token>"
  const token = authHeader.split(' ')[1];

  if (!config.apiToken) {
     console.warn('API_TOKEN is not set in environment variables.');
     res.status(500).json({ error: 'Server configuration error' });
     return;
  }

  if (token !== config.apiToken) {
    res.status(403).json({ error: 'Invalid token' });
    return;
  }

  next();
};
