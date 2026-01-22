import jwt from 'jsonwebtoken';

/**
 * Sign a JWT token with the provided payload
 * @param payload - The payload object to encode in the token
 * @returns string - The signed JWT token
 * @throws Error if JWT_SECRET environment variable is not set
 */
export function signToken(payload: object): string {
  const secret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';
  return jwt.sign(payload, secret, { expiresIn: '24h' });
}

/**
 * Verify and decode a JWT token
 * @param token - The JWT token to verify
 * @returns object - The decoded payload
 * @throws Error if token is invalid or JWT_SECRET is missing
 */
export function verifyToken(token: string): object {
  const secret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';

  try {
    return jwt.verify(token, secret) as object;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}
