import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  darkBackground?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', showText = true, darkBackground = false }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-3xl'
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Logo Icon - Enhanced Gradient Heart */}
      <div className={`${sizeClasses[size]} relative group transform transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-[1.02]`}>
        {/* Enhanced Background with Vibrant Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-500 to-emerald-500 rounded-lg shadow-lg shadow-indigo-500/50"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-400/30 to-emerald-400/30 rounded-lg"></div>
        <div className="absolute inset-0 rounded-lg ring-1 ring-white/40 ring-offset-0 opacity-80 group-hover:opacity-100 transition-opacity"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-transparent rounded-lg mix-blend-screen"></div>
        
        {/* White Heart Icon with Glow */}
        <div className="relative w-full h-full flex items-center justify-center">
          <svg 
            viewBox="0 0 24 24" 
            fill="none" 
            className="w-5/6 h-5/6 drop-shadow-lg"
          >
            <path 
              d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" 
              fill="white"
              filter="drop-shadow(0 0 2px rgba(255,255,255,0.8))"
            />
          </svg>
        </div>
      </div>

      {/* Logo Text */}
      {showText && (
        <div className="flex items-center">
          <span className={`${textSizeClasses[size]} font-bold ${
            darkBackground 
              ? 'text-indigo-300 drop-shadow-sm' 
              : 'text-indigo-600 dark:text-indigo-400'
          }`}>
            Trade
          </span>
          <span className={`${textSizeClasses[size]} font-bold ${
            darkBackground 
              ? 'text-white drop-shadow-sm' 
              : 'text-gray-700 dark:text-gray-300'
          }`}>
            2
          </span>
          <span className={`${textSizeClasses[size]} font-bold ${
            darkBackground 
              ? 'text-emerald-300 drop-shadow-sm' 
              : 'text-emerald-600 dark:text-emerald-400'
          }`}>
            Help
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;