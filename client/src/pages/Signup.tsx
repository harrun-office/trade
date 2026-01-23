import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, Home, Shield, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Signup: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [mounted, setMounted] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);

  const validateUsername = (username: string) => {
    if (!username) return 'Username is required';
    if (username.length < 3) return 'Username must be at least 3 characters';
    if (!/^[a-zA-Z0-9_]+$/.test(username)) return 'Username can only contain letters, numbers, and underscores';
    return '';
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email is required';
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return '';
  };

  const validatePassword = (password: string) => {
    if (!password) return 'Password is required';
    if (password.length < 8) return 'Password must be at least 8 characters';
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return 'Password must contain uppercase, lowercase, and number';
    }
    return '';
  };

  const validateConfirmPassword = (confirmPassword: string, password: string) => {
    if (!confirmPassword) return 'Please confirm your password';
    if (confirmPassword !== password) return 'Passwords do not match';
    return '';
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, username: value }));
    setUsernameError(validateUsername(value));
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, email: value }));
    setEmailError(validateEmail(value));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, password: value }));
    setPasswordError(validatePassword(value));
    // Also validate confirm password if it's filled
    if (formData.confirmPassword) {
      setConfirmPasswordError(validateConfirmPassword(formData.confirmPassword, value));
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, confirmPassword: value }));
    setConfirmPasswordError(validateConfirmPassword(value, formData.password));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const usernameErr = validateUsername(formData.username);
    const emailErr = validateEmail(formData.email);
    const passwordErr = validatePassword(formData.password);
    const confirmPasswordErr = validateConfirmPassword(formData.confirmPassword, formData.password);

    setUsernameError(usernameErr);
    setEmailError(emailErr);
    setPasswordError(passwordErr);
    setConfirmPasswordError(confirmPasswordErr);

    if (usernameErr || emailErr || passwordErr || confirmPasswordErr) {
      return;
    }

    setError('');
    setLoading(true);

    try {
      const success = await signup(formData);
      if (success) {
        navigate('/login');
      } else {
        setError('Signup failed. Please try again.');
      }
    } catch (err) {
      setError('Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex flex-col relative transition-all duration-700 overflow-hidden">
      {/* Enhanced Background Elements with Glassmorphism */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-gradient-to-br from-indigo-400/8 to-indigo-600/4 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-gradient-to-tl from-emerald-400/6 to-emerald-600/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-gradient-to-br from-amber-400/5 to-amber-600/2 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '4s' }}></div>

        {/* Floating particles effect */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-indigo-400/30 rounded-full animate-ping"
              style={{
                left: `${15 + i * 10}%`,
                top: `${20 + (i % 3) * 20}%`,
                animationDelay: `${i * 0.7}s`,
                animationDuration: '3s'
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Enhanced Security Trust Indicator */}
      <div className={`absolute top-4 right-4 z-20 flex items-center space-x-1.5 bg-emerald-50/90 dark:bg-emerald-900/30 backdrop-blur-md px-3 py-1.5 rounded-xl border border-emerald-200/70 dark:border-emerald-700/70 shadow-lg transition-all duration-1000 hover:shadow-xl ${mounted ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-4 scale-95'}`}>
        <div className="relative">
          <Shield className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <div className="absolute inset-0 bg-emerald-400/50 rounded-full animate-ping"></div>
        </div>
        <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">Secure & Private</span>
      </div>

      {/* Enhanced Home Navigation Button */}
      <Link
        to="/"
        className={`absolute top-4 left-4 z-10 flex items-center space-x-1.5 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-lg border border-slate-200/70 dark:border-slate-700/70 hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-300 hover:scale-105 group ${mounted ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 -translate-x-4 scale-95'}`}
      >
        <Home className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-all duration-300 group-hover:rotate-12" />
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors">Home</span>
      </Link>

      <div className={`flex-1 flex items-center justify-center px-4 sm:px-6 py-3 transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-95'}`}>
        <div className="w-full max-w-sm">
          {/* Header Section */}
          <div className="text-center mb-2">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/50 dark:to-emerald-800/50 rounded-lg mb-1.5 shadow-md">
              <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400 animate-pulse" />
            </div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white mb-1 tracking-tight">Create your account</h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm">Join Trade2Help and start making a difference</p>
          </div>

          {/* Form Container */}
          <div className={`bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl py-3 px-4 shadow-xl rounded-xl border border-slate-200/80 dark:border-slate-700/80 transition-all duration-1000 delay-500 ${mounted ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-2'}`}>
          <form className="space-y-2.5" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 px-2.5 py-1.5 rounded-md text-sm">
                {error}
              </div>
            )}

            {/* Account Information Section */}
            <div className="space-y-2">
              <div className="border-b border-slate-200 dark:border-slate-700 pb-1">
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 text-center">Account Information</h3>
              </div>

              <div className="space-y-2">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Username
                  </label>
                  <div className="relative">
                    <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      value={formData.username}
                      onChange={handleUsernameChange}
                      className="appearance-none block w-full px-2.5 py-1.5 pl-9 pr-2.5 border border-slate-300 dark:border-slate-600 rounded-md placeholder-slate-400 dark:placeholder-slate-500 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition-all duration-300 hover:border-slate-400 dark:hover:border-slate-500 text-sm"
                      placeholder="Choose a username"
                    />
                    <User className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                  {usernameError && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                      <span className="mr-1.5">⚠️</span>
                      {usernameError}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Email address
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleEmailChange}
                      className="appearance-none block w-full px-2.5 py-1.5 pl-9 pr-2.5 border border-slate-300 dark:border-slate-600 rounded-md placeholder-slate-400 dark:placeholder-slate-500 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition-all duration-300 hover:border-slate-400 dark:hover:border-slate-500 text-sm"
                      placeholder="Enter your email"
                    />
                    <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                  {emailError && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                      <span className="mr-1.5">⚠️</span>
                      {emailError}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Security Section */}
            <div className="space-y-2">
              <div className="border-b border-slate-200 dark:border-slate-700 pb-1">
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 text-center">Security</h3>
              </div>

              <div className="space-y-2">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={handlePasswordChange}
                      className="appearance-none block w-full px-2.5 py-1.5 pl-9 pr-9 border border-slate-300 dark:border-slate-600 rounded-md placeholder-slate-400 dark:placeholder-slate-500 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition-all duration-300 hover:border-slate-400 dark:hover:border-slate-500 text-sm"
                      placeholder="Create a password"
                    />
                    <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400 transition-colors p-0.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {passwordError && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                      <span className="mr-1.5">⚠️</span>
                      {passwordError}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={formData.confirmPassword}
                      onChange={handleConfirmPasswordChange}
                      className="appearance-none block w-full px-2.5 py-1.5 pl-9 pr-9 border border-slate-300 dark:border-slate-600 rounded-md placeholder-slate-400 dark:placeholder-slate-500 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition-all duration-300 hover:border-slate-400 dark:hover:border-slate-500 text-sm"
                      placeholder="Confirm your password"
                    />
                    <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400 transition-colors p-0.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {confirmPasswordError && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                      <span className="mr-1.5">⚠️</span>
                      {confirmPasswordError}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="bg-slate-50/50 dark:bg-slate-700/15 rounded-md p-2 border border-slate-200/40 dark:border-slate-600/30">
              <div className="flex items-start space-x-1.5">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-3.5 w-3.5 mt-0.5 text-indigo-600 focus:ring-indigo-500 border-slate-300 dark:border-slate-600 rounded transition-colors"
                />
                <label htmlFor="terms" className="text-sm text-slate-700 dark:text-slate-300 leading-tight">
                  I agree to the{' '}
                  <a href="#" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors font-medium underline underline-offset-1">
                    Terms
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors font-medium underline underline-offset-1">
                    Privacy Policy
                  </a>
                </label>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || !!usernameError || !!emailError || !!passwordError || !!confirmPasswordError}
                className="group w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-md text-sm font-bold text-white bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800 hover:from-emerald-700 hover:via-emerald-800 hover:to-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 relative overflow-hidden"
              >
                {loading && (
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-emerald-600 animate-pulse rounded-md"></div>
                )}
                <span className="relative z-10 flex items-center justify-center">
                  {loading && <Sparkles className="w-4 h-4 mr-2 animate-spin" />}
                  {loading ? 'Creating account...' : 'Create account'}
                </span>
              </button>
            </div>

            {/* Social Login Section */}
            <div className="space-y-2">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-slate-600" />
                </div>
                <div className="relative flex justify-center">
                  <span className="px-2 bg-white/95 dark:bg-slate-800/95 text-sm text-slate-500 dark:text-slate-400 font-medium">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-1.5 min-w-0 w-full">
                <button
                  type="button"
                  className="group w-full min-w-0 inline-flex justify-center items-center py-1.5 px-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:shadow-md hover:shadow-slate-500/10 transition-all duration-300 hover:border-slate-400 dark:hover:border-slate-500 overflow-hidden"
                >
                  <span className="sr-only">Sign up with Google</span>
                  <svg className="w-4 h-4 group-hover:animate-pulse flex-shrink-0" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="ml-1.5 group-hover:text-slate-900 dark:group-hover:text-slate-100 truncate min-w-0">Google</span>
                </button>

                <button
                  type="button"
                  className="group w-full min-w-0 inline-flex justify-center items-center py-1.5 px-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:shadow-md hover:shadow-slate-500/10 transition-all duration-300 hover:border-slate-400 dark:hover:border-slate-500 overflow-hidden"
                >
                  <span className="sr-only">Sign up with Apple</span>
                  <svg className="w-4 h-4 group-hover:animate-pulse flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                  </svg>
                  <span className="ml-1.5 group-hover:text-slate-900 dark:group-hover:text-slate-100 truncate min-w-0">Apple</span>
                </button>
              </div>
            </div>
          </form>

          <div className="mt-2 text-center pt-2 border-t border-slate-200/50 dark:border-slate-600/50">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors underline underline-offset-1">
                Sign in
              </Link>
            </p>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;