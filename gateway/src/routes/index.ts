import { Router } from 'express';
import { createServiceProxy } from '../middleware/proxy';

const router = Router();

router.use('/api/auth', createServiceProxy('auth'));
router.use('/api/users', createServiceProxy('user'));

export default router;
