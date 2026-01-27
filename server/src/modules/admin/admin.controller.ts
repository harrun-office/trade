import { Request, Response } from 'express';
import { loginAdmin } from './admin.service';

/**
 * Admin Controller
 * 
 * Handles admin-specific HTTP requests
 */

/**
 * Handle admin login
 * @param req - Express request with username and password in body
 * @param res - Express response
 */
export async function adminLoginController(req: Request, res: Response) {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Call service to authenticate admin
    const result = await loginAdmin(username, password);

    // Return success response with token and user data
    res.json({
      message: 'Admin login successful',
      token: result.token,
      user: result.user,
    });
  } catch (error: any) {
    // Handle login errors
    if (error.message === 'Invalid credentials') {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    if (error.message === 'Admin access required') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    res.status(500).json({ error: error.message || 'Login failed' });
  }
}
