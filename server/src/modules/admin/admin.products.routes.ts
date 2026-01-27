import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { adminMiddleware } from '../../middlewares/admin.middleware';
import { 
  getPendingProducts, 
  approveProduct, 
  rejectProduct 
} from './admin.products.controller';
import { adminLoginController } from './admin.controller';

/**
 * Admin routes
 * - Login is public (no authentication required)
 * - Product management routes require authentication AND admin role
 */
const router = Router();

// Public admin login route (no middleware)
router.post('/login', adminLoginController);

// Protected admin product routes (require authentication AND admin role)
router.get('/products/pending', authMiddleware, adminMiddleware, getPendingProducts);
router.post('/products/:id/approve', authMiddleware, adminMiddleware, approveProduct);
router.post('/products/:id/reject', authMiddleware, adminMiddleware, rejectProduct);

export { router as default };
