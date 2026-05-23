import { Request, Response, NextFunction } from 'express';
import { AuthenticationError } from '../utils/AppError';
import { verifyAccessToken } from '../utils/jwt';

export const authenticate = (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AuthenticationError('Token tidak ditemukan'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = verifyAccessToken(token);
    req.user = payload;
    next();
  } catch (error) {
    next(new AuthenticationError('Token tidak valid atau sudah kadaluarsa'));
  }
};
