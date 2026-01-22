import { hashPassword, comparePassword } from '../../libs/password';
import { signToken } from '../../libs/jwt';
import { prisma } from '../../libs/prisma';

/**
 * Authentication Service
 *
 * This file contains the core business logic for authentication operations.
 * Services handle the actual implementation of authentication features,
 * database interactions, and external API calls.
 *
 * Responsibilities:
 * - Implement authentication business logic (login, register, etc.)
 * - Handle password hashing and verification
 * - Generate and validate JWT tokens
 * - Interact with database for user authentication
 * - Manage user sessions and tokens
 * - Handle external authentication providers (if any)
 * - Implement security measures (rate limiting, lockouts, etc.)
 */

/**
 * Register a new user
 * @param email - User's email address
 * @param username - User's unique username
 * @param password - User's plain text password
 * @returns Promise<User> - Created user data (excluding password_hash)
 * @throws Error if email or username already exists
 */
export async function registerUser(email: string, username: string, password: string) {
  try {
    // Hash the password
    console.log('🔐 Hashing password...');
    const passwordHash = await hashPassword(password);
    console.log('✅ Password hashed successfully');

    console.log('🗄️  Creating user with Prisma...');
    console.log('📧 Email:', email.toLowerCase());
    console.log('👤 Username:', username);

    // Create user with Prisma
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        username,
        password_hash: passwordHash,
      },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        is_verified: true,
        created_at: true,
      },
    });

    console.log('✅ User created successfully:', user.id);
    return user;
  } catch (error: any) {
    console.error('❌ Error in registerUser:', error);

    // Handle unique constraint violations
    if (error.code === 'P2002') {
      if (error.meta?.target?.includes('email')) {
        throw new Error('Email already exists');
      }
      if (error.meta?.target?.includes('username')) {
        throw new Error('Username already exists');
      }
    }

    // Log the full error for debugging
    console.error('❌ Full error details:', {
      code: error.code,
      message: error.message,
      meta: error.meta,
      stack: error.stack
    });

    throw new Error(`Failed to create user: ${error.message}`);
  }
}

/**
 * Authenticate a user and generate JWT token
 * @param identifier - User's email or username
 * @param password - User's plain text password
 * @returns Promise<{token: string, user: User}> - JWT token and user data (excluding password_hash)
 * @throws Error if user not found or password is incorrect
 */
export async function loginUser(identifier: string, password: string) {
  // Determine if identifier is email or username
  const isEmail = identifier.includes('@');

  // Find user by email or username
  const user = await prisma.user.findUnique({
    where: isEmail
      ? { email: identifier.toLowerCase() }
      : { username: identifier },
  });

  if (!user) {
    throw new Error('Invalid credentials');
  }

  // Compare password
  const isValidPassword = await comparePassword(password, user.password_hash);
  if (!isValidPassword) {
    throw new Error('Invalid credentials');
  }

  // Generate JWT token
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
