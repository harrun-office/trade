import { Router } from 'express';
import { getAllProducts, getProductById, createProduct } from './products.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

/**
 * Product routes
 * - Public endpoints for reading products
 * - Protected endpoint for creating products
 */
const router = Router();

// Public routes - no authentication required
router.get('/', getAllProducts);
router.get('/:id', getProductById);

// Protected route - authentication required
router.post('/', authMiddleware, createProduct);

export { router as default };
