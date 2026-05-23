import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { errorResponse } from '../utils/response';
import { logger } from '../utils/logger';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof AppError) {
    if (err.statusCode >= 500) {
      logger.error(`[${err.code}] ${err.message}`, { stack: err.stack, path: req.path });
    }
    
    return errorResponse(res, err.message, err.code, err.errors, err.statusCode);
  }

  // Handle Prisma errors or other specific errors here if needed
  
  // Unhandled errors
  logger.error('UNHANDLED_ERROR', { error: err.message, stack: err.stack, path: req.path });
  
  const isDev = process.env.NODE_ENV === 'development';
  return errorResponse(
    res, 
    'Terjadi kesalahan pada server', 
    'INTERNAL_SERVER_ERROR',
    isDev ? [{ message: err.message, stack: err.stack }] : undefined,
    500
  );
};
