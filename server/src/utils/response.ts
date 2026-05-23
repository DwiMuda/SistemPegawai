import { Response } from 'express';

interface Meta {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
}

export const successResponse = (res: Response, message: string, data?: any, meta?: Meta, statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
    meta,
    timestamp: new Date().toISOString(),
  });
};

export const errorResponse = (res: Response, message: string, code = 'ERROR', errors?: any[], statusCode = 400) => {
  res.status(statusCode).json({
    success: false,
    message,
    errors,
    code,
    timestamp: new Date().toISOString(),
  });
};
