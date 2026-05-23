import { Request, Response, NextFunction } from 'express';
import { AuthorizationError } from '../utils/AppError';

export const authorize = (...roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AuthorizationError('User belum terautentikasi'));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AuthorizationError(`Akses ditolak. Membutuhkan role: ${roles.join(', ')}`));
    }

    next();
  };
};
