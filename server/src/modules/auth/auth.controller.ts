import { Request, Response } from 'express';
import { registerUser, loginUser } from './auth.service';

/**
 * Authentication Controller
 *
 * This file contains the controller logic for handling authentication-related
 * HTTP requests. Controllers act as intermediaries between routes and services,
 * processing HTTP requests and responses.
 *
 * Responsibilities:
 * - Handle incoming HTTP requests from routes
 * - Validate request data and parameters
 * - Call appropriate service methods for business logic
 * - Format and return HTTP responses
 * - Handle controller-level error responses
 * - Manage request/response transformation
 */

/**
 * Handle user registration
 * @param req - Express request with email, username, password in body
 * @param res - Express response
 */
export async function registerController(req: Request, res: Response) {
  try {
    const { email, username, password } = req.body;

    // Call service to register user
    const user = await registerUser(email, username, password);

    // Return success response
    res.status(201).json({
      message: 'User registered successfully',
      user,
    });
  } catch (error: any) {
    // Handle registration errors
    if (error.message.includes('already exists')) {
      return res.status(409).json({ error: error.message });
    }

    res.status(400).json({ error: error.message || 'Registration failed' });
  }
}

/**
 * Handle user login
 * @param req - Express request with identifier and password in body
 * @param res - Express response
 */
export async function loginController(req: Request, res: Response) {
  try {
    const { identifier, password } = req.body;

    // Call service to authenticate user
    const result = await loginUser(identifier, password);

    // Return success response with token and user data
    res.json({
      message: 'Login successful',
      token: result.token,
      user: result.user,
    });
  } catch (error: any) {
    // Handle login errors
    res.status(401).json({ error: error.message || 'Login failed' });
  }
}
