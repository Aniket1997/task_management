import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import validate from '../middleware/validate';
import { authenticate } from '../middleware/auth';
import { registerSchema, loginSchema, refreshSchema } from '../validators/auth.validator';

const router = Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/logout', authenticate, authController.logout);
router.post('/refresh-token', validate(refreshSchema), authController.refreshToken);

export default router;
