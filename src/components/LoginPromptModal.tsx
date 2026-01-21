import React from 'react';
import { Link } from 'react-router-dom';
import { X, ShoppingCart, Package, Heart, MessageCircle } from 'lucide-react';

interface LoginPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  action: 'cart' | 'sell' | 'buy' | 'chat';
}

const LoginPromptModal: React.FC<LoginPromptModalProps> = ({ isOpen, onClose, action }) => {
  if (!isOpen) return null;

  const actionConfig = {
    cart: {
      icon: ShoppingCart,
      title: 'Login Required to Add to Cart',
      message: 'You need to be logged in to add items to your cart and make purchases.',
      primaryAction: 'Login to Add to Cart',
      secondaryAction: 'Create Account'
    },
    sell: {
      icon: Package,
      title: 'Login Required to Sell Items',
      message: 'You need to be logged in to list items for sale on our platform.',
      primaryAction: 'Login to Start Selling',
      secondaryAction: 'Create Seller Account'
    },
    buy: {
      icon: ShoppingCart,
      title: 'Login Required to Purchase',
      message: 'You need to be logged in to add items to your cart and make purchases.',
      primaryAction: 'Login to Purchase',
      secondaryAction: 'Create Account'
    },
    chat: {
      icon: MessageCircle,
      title: 'Login Required to Chat',
      message: 'You need to be logged in to chat with sellers on our platform.',
      primaryAction: 'Login to Chat',
      secondaryAction: 'Create Account'
    }
  };

  const config = actionConfig[action];
  const IconComponent = config.icon;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 relative transition-colors">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center">
          <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <IconComponent className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{config.title}</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{config.message}</p>

          <div className="flex items-center justify-center mb-4">
            <Heart className="w-5 h-5 text-red-500 mr-2" />
            <span className="text-sm text-gray-500 dark:text-gray-400">Join our community of conscious commerce</span>
          </div>

          <div className="space-y-3">
            <Link
              to="/login"
              onClick={onClose}
              className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 transition-colors block text-center"
            >
              {config.primaryAction}
            </Link>
            
            <Link
              to="/signup"
              onClick={onClose}
              className="w-full border border-purple-600 text-purple-600 dark:text-purple-400 py-3 px-6 rounded-lg font-semibold hover:bg-purple-50 dark:hover:bg-purple-900 transition-colors block text-center"
            >
              {config.secondaryAction}
            </Link>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
            Already have an account? <Link to="/login" className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300">Sign in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPromptModal;