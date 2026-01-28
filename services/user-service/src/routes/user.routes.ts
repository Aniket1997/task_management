import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { authenticate, authorize } from '../middleware/auth';
import validate from '../middleware/validate';
import { updateProfileSchema } from '../validators/user.validator';

const router = Router();

router.get('/profile', authenticate, userController.getProfile);
router.put('/profile', authenticate, validate(updateProfileSchema), userController.updateProfile);
router.get('/', authenticate, authorize('admin'), userController.getAllUsers);
router.get('/:id', authenticate, authorize('admin'), userController.getUserById);

export default router;
