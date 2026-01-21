import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, Share2, Star, MapPin, Shield, Truck, ArrowLeft, MessageCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useChat } from '../contexts/ChatContext';
import { useCurrency } from '../contexts/CurrencyContext';
import LoginPromptModal from '../components/LoginPromptModal';
import ChatModal from '../components/ChatModal';

const ProductDetails: React.FC = () => {
  const { id } = useParams();
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist, allProducts, isAuthenticated } = useAuth();
  const { getConversation } = useChat();
  const { formatPrice } = useCurrency();
  const [selectedImage, setSelectedImage] = useState(0);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [loginPromptAction, setLoginPromptAction] = useState<'cart' | 'sell' | 'buy' | 'chat'>('buy');
  const [showChatModal, setShowChatModal] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Find the specific product by ID from global products
  const product = allProducts.find(p => p.id === parseInt(id || '1'));

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Product Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">The product you're looking for doesn't exist.</p>
          <Link
            to="/search"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      setLoginPromptAction('cart');
      setShowLoginPrompt(true);
      return;
    }

    const cartItem = {
      productId: product.id.toString(),
      title: product.title,
      price: product.price,
      quantity: quantity,
      image: product.images[0],
      charity: product.charity,
      donationPercent: product.donationPercent,
      seller: product.seller
    };
    
    addToCart(cartItem);
    alert('Item added to cart!');
  };

  const handleContactSeller = () => {
    if (!isAuthenticated) {
      setLoginPromptAction('chat');
      setShowLoginPrompt(true);
      return;
    }

    setShowChatModal(true);
  };

  const handleToggleWishlist = () => {
    if (!isAuthenticated) {
      setLoginPromptAction('buy');
      setShowLoginPrompt(true);
      return;
    }

    if (isInWishlist(product.id.toString())) {
      removeFromWishlist(product.id.toString());
    } else {
      const wishlistItem = {
        productId: product.id.toString(),
        title: product.title,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.images[0],
        charity: product.charity,
        donationPercent: product.donationPercent,
        seller: product.seller,
        condition: product.condition,
        location: product.location,
        postedDate: product.postedDate
      };
      addToWishlist(wishlistItem);
    }
  };

  const sellerId = product.sellerId;
  const sellerName = product.seller;

  const isWishlisted = isInWishlist(product.id.toString());

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 dark:bg-gray-900 min-h-screen">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
        <Link to="/" className="hover:text-purple-600 dark:hover:text-purple-400">Home</Link>
        <span>/</span>
        <Link to="/search" className="hover:text-purple-600 dark:hover:text-purple-400">{product.category}</Link>
        <span>/</span>
        <span className="text-gray-900 dark:text-white">{product.title}</span>
      </nav>

      {/* Back button */}
      <Link
        to="/search"
        className="inline-flex items-center text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to search
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div>
          <div className="aspect-square mb-4 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
            <img
              src={product.images[selectedImage]}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-3 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square overflow-hidden rounded-lg border-2 ${
                    selectedImage === index ? 'border-purple-500' : 'border-gray-200 dark:border-gray-600'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.title} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{product.title}</h1>
            <div className="flex items-center space-x-4 mb-4">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="text-xl text-gray-500 dark:text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
              )}
              {product.originalPrice && (
                <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full text-sm font-medium">
                  Save {formatPrice(product.originalPrice - product.price)}
                </span>
              )}
            </div>
          </div>

          {/* Charity Info */}
          <div className="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <Heart className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
              <span className="font-medium text-green-900 dark:text-green-100">
                {product.donationPercent}% ({formatPrice(product.price * product.donationPercent / 100)}) 
                goes to {product.charity}
              </span>
            </div>
            <p className="text-sm text-green-700 dark:text-green-300 mt-1">
              Your purchase helps support this amazing cause
            </p>
          </div>

          {/* Product Details */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Condition:</span>
              <span className="font-medium text-gray-900 dark:text-white">{product.condition}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Category:</span>
              <span className="font-medium text-gray-900 dark:text-white">{product.category}</span>
            </div>
            
            {/* Quantity Selector */}
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Quantity:</span>
              <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  -
                </button>
                <span className="px-3 py-1 text-gray-900 dark:text-white">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 mb-6">
            <button
              onClick={handleAddToCart}
              className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              Add to Cart
            </button>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleContactSeller}
                className="flex items-center justify-center border border-purple-600 text-purple-600 dark:text-purple-400 py-3 px-6 rounded-lg font-semibold hover:bg-purple-50 dark:hover:bg-purple-900 transition-colors"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Chat with Seller
              </button>
              <button 
                onClick={handleToggleWishlist}
                className={`border py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center ${
                  isWishlisted 
                    ? "bg-red-50 dark:bg-red-900 text-red-600 dark:text-red-400 border-red-600 dark:border-red-400 hover:bg-red-100 dark:hover:bg-red-800"
                    : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                <Heart className={`w-4 h-4 mr-2 ${isWishlisted ? "fill-current" : ""}`} />
                {isWishlisted ? "In Wishlist" : "Add to Wishlist"}
              </button>
            </div>
          </div>

          {/* Shipping Info */}
          {product.shipping && (
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-6 bg-white dark:bg-gray-800">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Shipping & Protection</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <Truck className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-gray-700 dark:text-gray-300">{product.shipping.cost} shipping • {product.shipping.time}</span>
                </div>
                <div className="flex items-center">
                  <Shield className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-gray-700 dark:text-gray-300">{product.shipping.protection}</span>
                </div>
              </div>
            </div>
          )}

          {/* Share */}
          <div className="flex items-center space-x-4">
            <button className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="mt-12">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            <button className="border-b-2 border-purple-500 py-2 px-1 text-sm font-medium text-purple-600 dark:text-purple-400">
              Description
            </button>
            <button className="border-b-2 border-transparent py-2 px-1 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
              Specifications
            </button>
            <button className="border-b-2 border-transparent py-2 px-1 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
              Seller Info
            </button>
          </nav>
        </div>

        <div className="py-6">
          {/* Description Tab */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Product Description</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{product.description}</p>
            
            {product.specifications && (
              <>
                <h4 className="text-md font-semibold text-gray-900 dark:text-white mt-6 mb-3">Key Features</h4>
                <ul className="space-y-2">
                  {product.specifications.map((spec, index) => (
                    <li key={index} className="flex items-center text-gray-700 dark:text-gray-300">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                      {spec}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Seller Info */}
      <div className="mt-8 bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Seller Information</h3>
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
            <span className="text-xl font-bold text-purple-600 dark:text-purple-400">
              {sellerName.charAt(0)}
            </span>
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h4 className="font-semibold text-gray-900 dark:text-white">{sellerName}</h4>
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">4.8</span>
              </div>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {product.location}
              </div>
              <p>156 sales • Member since 2023</p>
            </div>
            <div className="flex items-center space-x-4 mt-3">
              <Link
                to={`/profile/${sellerName}`}
                className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium"
              >
                View seller profile →
              </Link>
              <button
                onClick={handleContactSeller}
                className="flex items-center text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium"
              >
                <MessageCircle className="w-4 h-4 mr-1" />
                Send message
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Login Prompt Modal */}
      <LoginPromptModal
        isOpen={showLoginPrompt}
        onClose={() => setShowLoginPrompt(false)}
        action={loginPromptAction}
      />

      {/* Chat Modal */}
      <ChatModal
        isOpen={showChatModal}
        onClose={() => setShowChatModal(false)}
        sellerId={sellerId}
        sellerName={sellerName}
        productId={product.id}
        productTitle={product.title}
      />
    </div>
  );
};

export default ProductDetails;