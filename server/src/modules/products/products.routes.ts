import { Router } from 'express';
import { getAllProducts, getProductById } from './products.controller';

/**
 * Product routes - public endpoints for reading products
 */
const router = Router();

// Public routes - no authentication required
router.get('/', getAllProducts);
router.get('/:id', getProductById);

export default router;
