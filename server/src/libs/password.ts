import bcrypt from 'bcrypt';

/**
 * Hash a plain text password using bcrypt
 * @param plain - The plain text password to hash
 * @returns Promise<string> - The hashed password
 */
export async function hashPassword(plain: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(plain, saltRounds);
}

/**
 * Compare a plain text password with a hashed password
 * @param plain - The plain text password to compare
 * @param hash - The hashed password to compare against
 * @returns Promise<boolean> - True if passwords match, false otherwise
 */
export async function comparePassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}
