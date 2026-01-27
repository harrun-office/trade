import { Request, Response, NextFunction } from 'express';

/**
 * Admin middleware - verifies user is authenticated AND has admin role
 * Must be used after authMiddleware
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export function adminMiddleware(req: Request, res: Response, next: NextFunction) {
  // Check if user is authenticated (should be set by authMiddleware)
  const user = req.user as { userId?: string; role?: string } | undefined;
  
  if (!user || !user.userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  // Check if user is admin
  if (user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  // User is authenticated and is admin
  next();
}
