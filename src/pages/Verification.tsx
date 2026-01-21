import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Mail, Home, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Verification: React.FC = () => {
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user, updateUser, setRequiresVerification } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const code = verificationCode.join('');
    if (code.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    setLoading(true);

    try {
      // Simulate verification API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, accept any 6-digit code
      if (code.length === 6) {
        updateUser({ verified: true });
        setRequiresVerification(false);
        navigate('/dashboard');
      } else {
        setError('Invalid verification code');
      }
    } catch (err) {
      setError('Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResending(true);
    setError('');
    
    try {
      // Simulate resend API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Show success message or handle resend logic
    } catch (err) {
      setError('Failed to resend code. Please try again.');
    } finally {
      setResending(false);
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
            <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-teal-100 to-teal-200 dark:from-teal-900/50 dark:to-teal-800/50 rounded-lg mb-1.5 shadow-md">
              <Sparkles className="w-5 h-5 text-teal-600 dark:text-teal-400 animate-pulse" />
            </div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white mb-1 tracking-tight">Verify your account</h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm">Enter the code sent to your email</p>
          </div>

          {/* Form Container */}
          <div className={`bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl py-3 px-4 shadow-xl rounded-xl border border-slate-200/80 dark:border-slate-700/80 transition-all duration-1000 delay-500 ${mounted ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-2'}`}>
            <form className="space-y-2.5" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 px-2.5 py-1.5 rounded-md text-sm">
                  {error}
                </div>
              )}

              {/* Email Display */}
              <div className="text-center">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                  We've sent a 6-digit verification code to
                </p>
                <p className="font-medium text-slate-900 dark:text-slate-100">{user?.email}</p>
              </div>

              {/* Verification Code Input */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 text-center">
                  Enter verification code
                </label>
                <div className="flex space-x-2 justify-center">
                  {verificationCode.map((digit, index) => (
                    <input
                      key={index}
                      id={`code-${index}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleCodeChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-10 h-10 text-center text-lg font-semibold border border-slate-300 dark:border-slate-600 rounded-md placeholder-slate-400 dark:placeholder-slate-500 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 focus:bg-white dark:focus:bg-slate-800 transition-all duration-300 hover:border-slate-400 dark:hover:border-slate-500"
                      placeholder="0"
                    />
                  ))}
                </div>
              </div>

              {/* Verify Button */}
              <div>
                <button
                  type="submit"
                  disabled={loading || verificationCode.join('').length !== 6}
                  className="group w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-md text-sm font-bold text-white bg-gradient-to-r from-teal-600 via-teal-700 to-teal-800 hover:from-teal-700 hover:via-teal-800 hover:to-teal-900 focus:outline-none focus:ring-2 focus:ring-teal-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 relative overflow-hidden"
                >
                  {loading && (
                    <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-teal-600 animate-pulse rounded-md"></div>
                  )}
                  <span className="relative z-10 flex items-center justify-center">
                    {loading && <Sparkles className="w-4 h-4 mr-2 animate-spin" />}
                    {loading ? 'Verifying...' : 'Verify Account'}
                  </span>
                </button>
              </div>

              {/* Resend Code */}
              <div className="text-center">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Didn't receive the code?{' '}
                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={resending}
                    className="font-medium text-teal-600 dark:text-teal-400 hover:text-teal-500 dark:hover:text-teal-300 transition-colors disabled:opacity-50"
                  >
                    {resending ? 'Sending...' : 'Resend code'}
                  </button>
                </p>
              </div>

              {/* Email Tip */}
              <div className="bg-blue-50/50 dark:bg-blue-900/15 rounded-md p-2 border border-blue-200/40 dark:border-blue-700/30">
                <div className="flex items-start space-x-2">
                  <Mail className="w-4 h-4 text-blue-400 dark:text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-xs font-medium text-blue-800 dark:text-blue-300">
                      Check your email
                    </h3>
                    <div className="mt-0.5 text-xs text-blue-700 dark:text-blue-400">
                      <p>
                        The verification code may take a few minutes to arrive.
                        Please also check your spam folder.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Verification;