export class AppError extends Error {
  public statusCode: number;
  public code: string;
  public errors?: any[];

  constructor(statusCode: number, message: string, code = 'ERROR', errors?: any[]) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.errors = errors;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

// Helper factories
export class ValidationError extends AppError {
  constructor(message: string, errors?: any[]) {
    super(400, message, 'VALIDATION_ERROR', errors);
  }
}

export class AuthenticationError extends AppError {
  constructor(message = 'Tidak terautentikasi') {
    super(401, message, 'UNAUTHENTICATED');
  }
}

export class AuthorizationError extends AppError {
  constructor(message = 'Tidak memiliki akses') {
    super(403, message, 'UNAUTHORIZED');
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Data tidak ditemukan') {
    super(404, message, 'NOT_FOUND');
  }
}
