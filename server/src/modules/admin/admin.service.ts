import { comparePassword } from '../../libs/password';
import { signToken } from '../../libs/jwt';
import { prisma } from '../../libs/prisma';

/**
 * Admin Authentication Service
 * 
 * Handles admin-specific authentication logic
 */

/**
 * Authenticate an admin user and generate JWT token
 * @param username - Admin's username
 * @param password - Admin's plain text password
 * @returns Promise<{token: string, user: User}> - JWT token and admin user data (excluding password_hash)
 * @throws Error if user not found, password is incorrect, or user is not an admin
 */
export async function loginAdmin(username: string, password: string) {
  // Find user by username
  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    throw new Error('Invalid credentials');
  }

  // Verify password
  const isValidPassword = await comparePassword(password, user.password_hash);
  if (!isValidPassword) {
    throw new Error('Invalid credentials');
  }

  // Check if user is admin
  if (user.role !== 'admin') {
    throw new Error('Admin access required');
  }

  // Generate JWT token with same format as regular login
  const token = signToken({
    userId: user.id,
    email: user.email,
    username: user.username,
    role: user.role,
  });

  // Return token and user data (exclude password_hash)
  const { password_hash, ...userData } = user;

  return {
    token,
    user: userData,
  };
}
