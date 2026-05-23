import { Request, Response, NextFunction } from 'express';

declare module 'express-serve-static-core' {
  interface Request {
    pagination?: {
      page: number;
      limit: number;
      skip: number;
      search?: string;
    };
  }
}

export const paginate = (req: Request, _res: Response, next: NextFunction) => {
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 10;
  
  // Ensure non-negative numbers and reasonable limits
  const safePage = Math.max(1, page);
  const safeLimit = Math.min(100, Math.max(1, limit));
  
  const skip = (safePage - 1) * safeLimit;
  const search = req.query.search as string | undefined;

  req.pagination = {
    page: safePage,
    limit: safeLimit,
    skip,
    search: search || undefined,
  };

  next();
};
