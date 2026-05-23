import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validate } from '../middlewares/validate';
import { loginSchema, changePasswordSchema } from '../validators/auth.validator';
import { authenticate } from '../middlewares/authenticate';
import { loginRateLimiter } from '../middlewares/rateLimiter';

const router = Router();

router.post('/login', loginRateLimiter, validate(loginSchema), AuthController.login);
router.post('/refresh', loginRateLimiter, AuthController.refreshToken);
router.post('/logout', authenticate, AuthController.logout);
router.get('/me', authenticate, AuthController.me);
router.put('/profile', authenticate, AuthController.updateProfile);
router.put('/password', authenticate, validate(changePasswordSchema), AuthController.changePassword);

export default router;
