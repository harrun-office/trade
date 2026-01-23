const API_BASE_URL = 'http://localhost:3001/api';

/**
 * Centralized fetch wrapper with automatic token handling
 * @param endpoint - API endpoint (without base URL)
 * @param options - Fetch options
 * @returns Promise<Response>
 */
async function apiClient(endpoint: string, options: RequestInit = {}): Promise<Response> {
  const url = `${API_BASE_URL}${endpoint}`;

  // Get token from localStorage
  const token = localStorage.getItem('auth_token');

  // Set default headers
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add Authorization header if token exists
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // Make the request
  const response = await fetch(url, {
    ...options,
    headers,
  });

  return response;
}

/**
 * Login user and store token
 * @param email - User's email
 * @param password - User's password
 * @returns Promise<User> - User data
 */
export async function login(email: string, password: string) {
  const response = await apiClient('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ identifier: email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Login failed');
  }

  const data = await response.json();

  // Store token in localStorage
  if (data.token) {
    localStorage.setItem('auth_token', data.token);
  }

  return data.user;
}

/**
 * Get current authenticated user
 * @returns Promise<User> - Current user data
 */
export async function getMe() {
  const response = await apiClient('/users/me');

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch user');
  }

  return response.json();
}

/**
 * Register a new user
 * @param email - User's email
 * @param username - User's username
 * @param password - User's password
 * @returns Promise<User> - Created user data
 */
export async function register(email: string, username: string, password: string) {
  const response = await apiClient('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, username, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Registration failed');
  }

  return response.json();
}

/**
 * Get all products
 * @returns Promise<Product[]> - Array of all products
 */
export async function getAllProducts() {
  const response = await apiClient('/products');

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch products');
  }

  return response.json();
}

/**
 * Logout user by removing token
 */
export function logout() {
  localStorage.removeItem('auth_token');
}
