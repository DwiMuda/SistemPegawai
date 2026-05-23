import rateLimit from 'express-rate-limit';
import { errorResponse } from '../utils/response';

export const loginRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // Limit each IP to 5 login requests per `window` (here, per minute)
  handler: (_req, res) => {
    errorResponse(res, 'Terlalu banyak percobaan login, silakan coba lagi setelah 1 menit', 'TOO_MANY_REQUESTS', undefined, 429);
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window`
  handler: (_req, res) => {
    errorResponse(res, 'Terlalu banyak request, silakan coba lagi nanti', 'TOO_MANY_REQUESTS', undefined, 429);
  },
});
