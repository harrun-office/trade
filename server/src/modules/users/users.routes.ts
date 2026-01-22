import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { getCurrentUserController } from './users.controller';

/**
 * User routes
 */
const router = Router();

// Protected routes (require authentication)
router.get('/me', authMiddleware, getCurrentUserController);

export default router;
