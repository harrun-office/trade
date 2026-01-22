import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Menu, X, Edit3, User, LogOut, ChevronDown, BarChart3 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import LoginPromptModal from './LoginPromptModal';
import Logo from './Logo';

const Header: React.FC = () => {
  const { user, logout, isAuthenticated, cart } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [loginPromptAction, setLoginPromptAction] = useState<'cart' | 'sell' | 'buy'>('buy');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);


  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    logout();
    setShowProfileDropdown(false);
    navigate('/');
  };

  const handleCartClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      setLoginPromptAction('cart');
      setShowLoginPrompt(true);
      return;
    }
    navigate('/cart');
  };

  const handlePostAdClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      setLoginPromptAction('sell');
      setShowLoginPrompt(true);
      return;
    }
    navigate('/sell');
  };

  const handleProfileDropdownClick = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  const cartItemCount = isAuthenticated ? cart.reduce((total, item) => total + item.quantity, 0) : 0;

  return (
    <header className="bg-slate-950 shadow-lg sticky top-0 z-50 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Navigation */}
        <div className="flex items-center h-14">
          <div className="hidden lg:block w-32" />

          {/* Navigation Links */}
          <div className="flex-1 flex justify-center">
            <nav className="hidden lg:flex items-center space-x-6">
              <Link to="/" className="text-slate-300 hover:text-indigo-400 transition-colors text-sm font-medium">
                Home
              </Link>
              <Link to="/charities" className="text-slate-300 hover:text-emerald-400 transition-colors text-sm font-medium">
                Charities
              </Link>
              <Link to="/donation-analytics" className="flex items-center text-slate-300 hover:text-amber-400 transition-colors text-sm font-medium">
                <BarChart3 className="w-4 h-4 mr-1" />
                Analytics
              </Link>
              <Link to="/about" className="text-slate-300 hover:text-indigo-400 transition-colors text-sm font-medium">
                About
              </Link>
            </nav>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-slate-300 hover:text-white p-2"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Desktop actions */}
          <div className="hidden lg:flex items-center space-x-3">
            <button
              onClick={handlePostAdClick}
              className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
              aria-label="Post a free advertisement"
            >
              <Edit3 className="w-4 h-4" />
              <span className="text-sm font-extrabold tracking-wide">POST FREE AD</span>
            </button>

            <button
              onClick={handleCartClick}
              className="relative p-2 text-slate-300 hover:text-indigo-400 transition-colors"
              aria-label={`Shopping cart with ${cartItemCount} items`}
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-400 text-slate-900 text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  {cartItemCount}
                </span>
              )}
            </button>
            
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={handleProfileDropdownClick}
                  className="flex items-center space-x-2 p-2 text-slate-300 hover:text-indigo-400 transition-colors rounded-lg hover:bg-slate-800"
                  aria-label="User menu"
                  aria-expanded={showProfileDropdown}
                >
                  <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center">
                    <span className="text-xs font-semibold text-white">
                      {user?.username?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium hidden xl:block">{user?.username}</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${showProfileDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showProfileDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-lg shadow-lg border border-slate-700 py-1 z-50">
                    <Link
                      to="/dashboard"
                      onClick={() => setShowProfileDropdown(false)}
                      className="flex items-center px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 transition-colors"
                    >
                      <User className="w-4 h-4 mr-3" />
                      Dashboard
                    </Link>
                    <hr className="my-1 border-slate-600" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-amber-400 hover:bg-slate-700 transition-colors"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-slate-300 hover:text-indigo-400 px-3 py-2 transition-colors text-sm"
                  aria-label="Login to your account"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-indigo-600 text-white px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors text-sm"
                  aria-label="Create new account"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Search Section */}
        <div className="pb-4">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center -mt-2">
              <Logo size="sm" darkBackground={true} />
            </Link>
            <form onSubmit={handleSearch} className="flex items-center flex-1">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for items..."
                  className="w-full border border-slate-600 px-3 py-2 bg-slate-800 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-l-md text-sm"
                  aria-label="Search products"
                />
              </div>
              <button
                type="submit"
                className="bg-indigo-600 text-white px-4 py-2 rounded-r-md hover:bg-indigo-700 transition-colors flex items-center"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-t border-slate-700">
          <div className="px-4 py-4 space-y-4">
            <button
              onClick={handlePostAdClick}
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-4 py-3 rounded-lg flex items-center justify-center space-x-2"
            >
              <Edit3 className="w-4 h-4" />
              <span className="text-sm font-extrabold tracking-wide">POST FREE AD</span>
            </button>

            <Link
              to="/"
              className="block py-2 text-slate-300 hover:text-indigo-400"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/search"
              className="block py-2 text-slate-300 hover:text-indigo-400"
              onClick={() => setIsMenuOpen(false)}
            >
              Browse
            </Link>
            <Link
              to="/charities"
              className="block py-2 text-slate-300 hover:text-emerald-400"
              onClick={() => setIsMenuOpen(false)}
            >
              Charities
            </Link>
            <Link
              to="/donation-analytics"
              className="flex items-center py-2 text-slate-300 hover:text-amber-400"
              onClick={() => setIsMenuOpen(false)}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </Link>
            <Link
              to="/about"
              className="block py-2 text-slate-300 hover:text-indigo-400"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="block py-2 text-slate-300 hover:text-indigo-400"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleCartClick({} as React.MouseEvent);
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left py-2 text-slate-300 hover:text-indigo-400"
                >
                  Cart ({cartItemCount})
                </button>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left py-2 text-amber-400 hover:text-amber-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setLoginPromptAction('cart');
                    setShowLoginPrompt(true);
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left py-2 text-slate-300 hover:text-indigo-400"
                >
                  Cart ({cartItemCount})
                </button>
                <Link
                  to="/login"
                  className="block py-2 text-slate-300 hover:text-indigo-400"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block py-2 text-slate-300 hover:text-indigo-400"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      {/* Login Prompt Modal */}
      <LoginPromptModal
        isOpen={showLoginPrompt}
        onClose={() => setShowLoginPrompt(false)}
        action={loginPromptAction}
      />
    </header>
  );
};

export default Header;