import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../libs/jwt';

// Extend Express Request interface to include user property
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

/**
 * Authentication middleware - verifies JWT tokens
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Access token required' });
    }

    // Extract token from "Bearer <token>"
    const token = authHeader.substring(7);

    // Verify token
    const decoded = verifyToken(token);

    // Attach decoded payload to request
    req.user = decoded;

    // Continue to next middleware/route handler
    next();
  } catch (error) {
    // Token verification failed
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}
