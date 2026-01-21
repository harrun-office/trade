import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Heart, ShoppingBag, Plus, Minus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCurrency } from '../contexts/CurrencyContext';

const Cart: React.FC = () => {
  const { cart, removeFromCart, addToCart } = useAuth();
  const { formatPrice } = useCurrency();

  const updateQuantity = (item: any, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    // Create a new cart item with updated quantity
    const updatedItem = {
      productId: item.productId,
      title: item.title,
      price: item.price,
      quantity: newQuantity,
      image: item.image,
      charity: item.charity,
      donationPercent: item.donationPercent,
      seller: item.seller
    };
    
    // Remove the old item and add the updated one
    removeFromCart(item.productId);
    addToCart(updatedItem);
  };

  // Calculate cart totals
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalDonation = cart.reduce((sum, item) => 
    sum + (item.price * item.quantity * item.donationPercent / 100), 0
  );
  const shipping = 0; // Free shipping
  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 dark:bg-gray-900 min-h-screen transition-colors">
        <div className="text-center">
          <ShoppingBag className="w-24 h-24 text-gray-300 dark:text-gray-600 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Your cart is empty</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">Start shopping to add items to your cart</p>
          <Link
            to="/search"
            className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 dark:bg-gray-900 min-h-screen transition-colors">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Cart Items ({cart.reduce((total, item) => total + item.quantity, 0)})
              </h2>
              <div className="space-y-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 pb-6 border-b border-gray-200 dark:border-gray-600 last:border-b-0">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <Link
                        to={`/product/${item.productId}`}
                        className="font-semibold text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400"
                      >
                        {item.title}
                      </Link>
                      <p className="text-sm text-gray-600 dark:text-gray-400">by {item.seller}</p>
                      <div className="flex items-center mt-1">
                        <Heart className="w-4 h-4 text-green-600 dark:text-green-400 mr-1" />
                        <span className="text-sm text-green-600 dark:text-green-400">
                          {item.donationPercent}% to {item.charity}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <div className="text-right">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {formatPrice(item.price)} each
                        </p>
                      </div>
                      
                      <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md">
                        <button 
                          onClick={() => updateQuantity(item, item.quantity - 1)}
                          className="px-2 py-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-3 py-1 text-gray-900 dark:text-white">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item, item.quantity + 1)}
                          className="px-2 py-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="p-2 text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Continue Shopping */}
          <div className="mt-6">
            <Link
              to="/search"
              className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium"
            >
              ← Continue Shopping
            </Link>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 sticky top-4 transition-colors">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                <span className="font-medium text-gray-900 dark:text-white">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                <span className="font-medium text-green-600 dark:text-green-400">Free</span>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">Total</span>
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">{formatPrice(total)}</span>
                </div>
              </div>
            </div>

            {/* Charity Impact */}
            <div className="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg p-4 mb-6">
              <div className="flex items-center mb-2">
                <Heart className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
                <span className="font-semibold text-green-900 dark:text-green-100">Charity Impact</span>
              </div>
              <p className="text-sm text-green-700 dark:text-green-300">
                Your purchase will donate <span className="font-semibold">{formatPrice(totalDonation)}</span> to various charities
              </p>
            </div>

            <Link
              to="/payment"
              className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 transition-colors text-center block"
            >
              Proceed to Checkout
            </Link>

            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Secure checkout with buyer protection
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;