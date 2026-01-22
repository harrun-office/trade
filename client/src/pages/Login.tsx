import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Home, Shield, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [mounted, setMounted] = useState(false);
  const { login, requiresVerification } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email is required';
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return '';
  };

  const validatePassword = (password: string) => {
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    return '';
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError(validateEmail(value));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordError(validatePassword(value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);

    setEmailError(emailErr);
    setPasswordError(passwordErr);

    if (emailErr || passwordErr) {
      return;
    }

    setError('');
    setLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        navigate('/dashboard');
      } else if (requiresVerification) {
        navigate('/verify');
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex flex-col justify-center py-4 sm:px-6 lg:px-12 relative transition-all duration-700 overflow-hidden">
      {/* Enhanced Background Elements with Glassmorphism */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-16 w-80 h-80 bg-gradient-to-br from-indigo-400/8 to-indigo-600/4 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-16 w-96 h-96 bg-gradient-to-tl from-emerald-400/6 to-emerald-600/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-gradient-to-br from-amber-400/5 to-amber-600/2 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '4s' }}></div>

        {/* Floating particles effect */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-indigo-400/30 rounded-full animate-ping"
              style={{
                left: `${15 + i * 12}%`,
                top: `${20 + (i % 3) * 25}%`,
                animationDelay: `${i * 0.8}s`,
                animationDuration: '4s'
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Enhanced Security Trust Indicator */}
      <div className={`absolute top-4 right-4 flex items-center space-x-1.5 bg-emerald-50/90 dark:bg-emerald-900/30 backdrop-blur-md px-3 py-1.5 rounded-xl border border-emerald-200/70 dark:border-emerald-700/70 shadow-lg transition-all duration-1000 hover:shadow-xl ${mounted ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-4 scale-95'}`}>
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

      <div className={`sm:mx-auto sm:w-full sm:max-w-md transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}`}>
        <div className="text-center mb-2">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900/50 dark:to-indigo-800/50 rounded-2xl mb-3 shadow-xl">
            <Sparkles className="w-6 h-6 text-indigo-600 dark:text-indigo-400 animate-pulse" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1 tracking-tight">Welcome back</h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Sign in to your Trade2Help account</p>
          <div className="mt-2 flex items-center justify-center space-x-1">
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">Secure Login</span>
          </div>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className={`bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl py-6 px-6 shadow-2xl sm:rounded-3xl sm:px-8 border border-slate-200/80 dark:border-slate-700/80 transition-all duration-1000 delay-500 hover:shadow-3xl hover:shadow-indigo-500/10 ${mounted ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'}`}>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Email address
              </label>
              <div className="mt-0.5 relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={handleEmailChange}
                  className="appearance-none block w-full px-3 py-2.5 pl-10 border-2 border-slate-300 dark:border-slate-600 rounded-2xl placeholder-slate-400 dark:placeholder-slate-500 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition-all duration-300 hover:border-slate-400 dark:hover:border-slate-500 hover:shadow-lg hover:shadow-indigo-500/10"
                  placeholder="Enter your email"
                />
                <Mail className="w-5 h-5 text-slate-400 dark:text-slate-500 absolute left-3 top-3.5" />
              </div>
              {emailError && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                  <span className="mr-1">⚠️</span>
                  {emailError}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Password
              </label>
              <div className="mt-0.5 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={handlePasswordChange}
                  className="appearance-none block w-full px-3 py-3 pl-10 pr-10 border border-slate-300 dark:border-slate-600 rounded-xl placeholder-slate-400 dark:placeholder-slate-500 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 hover:border-slate-400 dark:hover:border-slate-500"
                  placeholder="Enter your password"
                />
                <Lock className="w-5 h-5 text-slate-400 dark:text-slate-500 absolute left-3 top-3.5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {passwordError && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                  <span className="mr-1">⚠️</span>
                  {passwordError}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 dark:border-slate-600 rounded transition-colors"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-900 dark:text-slate-100">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || !!emailError || !!passwordError}
                className="group w-full flex justify-center py-3 px-4 border border-transparent rounded-2xl shadow-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 hover:from-indigo-700 hover:via-indigo-800 hover:to-indigo-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-indigo-500/25 disabled:hover:scale-100 disabled:hover:shadow-xl relative overflow-hidden"
              >
                {/* Animated background gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Shine effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                </div>

                {loading && (
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-indigo-600 animate-pulse rounded-2xl"></div>
                )}
                <span className="relative z-10 flex items-center">
                  {loading && <Sparkles className="w-4 h-4 mr-2 animate-spin" />}
                  {loading ? 'Signing in...' : 'Sign in'}
                </span>
              </button>
            </div>


            <div className="mt-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-300 dark:border-slate-600" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400">Or continue with</span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="group w-full inline-flex justify-center items-center py-2.5 px-3 border-2 border-slate-300 dark:border-slate-600 rounded-2xl shadow-lg bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:shadow-xl hover:shadow-slate-500/20 transition-all duration-300 hover:scale-[1.02] hover:border-slate-400 dark:hover:border-slate-500"
                >
                  <span className="sr-only">Sign in with Google</span>
                  <svg className="w-5 h-5 group-hover:animate-pulse" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="ml-2 group-hover:text-slate-900 dark:group-hover:text-slate-100">Google</span>
                </button>

                <button
                  type="button"
                  className="group w-full inline-flex justify-center items-center py-2.5 px-3 border-2 border-slate-300 dark:border-slate-600 rounded-2xl shadow-lg bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:shadow-xl hover:shadow-slate-500/20 transition-all duration-300 hover:scale-[1.02] hover:border-slate-400 dark:hover:border-slate-500"
                >
                  <span className="sr-only">Sign in with Facebook</span>
                  <svg className="w-5 h-5 group-hover:animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span className="ml-2 group-hover:text-slate-900 dark:group-hover:text-slate-100">Facebook</span>
                </button>
              </div>

            </div>
          </form>

          <div className="mt-3 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Don't have an account?{' '}
              <Link to="/signup" className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors">
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Login;