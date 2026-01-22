import { Router } from 'express';
import { registerController, loginController } from './auth.controller';

/**
 * Authentication Routes
 *
 * This file defines all HTTP routes related to authentication functionality.
 * It handles routing for login, logout, registration, password reset,
 * and other authentication-related endpoints.
 *
 * Responsibilities:
 * - Define Express routes for authentication endpoints
 * - Apply route-level middleware (validation, rate limiting, etc.)
 * - Delegate request handling to the appropriate controller methods
 * - Handle route parameter extraction and validation
 */

// Create Express router
const router = Router();

// Authentication routes
router.post('/register', registerController);
router.post('/login', loginController);

export default router;
