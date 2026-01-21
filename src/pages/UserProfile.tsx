import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  User, Settings, CreditCard, MapPin, Bell, Shield, 
  Package, Gift, Coins, Edit3, Camera, Save, Mail, 
  Phone, Calendar, ChevronDown, Star, Heart, TrendingUp,
  Award, Target, Users, MessageCircle, Filter, Grid, List
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCurrency } from '../contexts/CurrencyContext';
import LoginPromptModal from '../components/LoginPromptModal';
import ChatModal from '../components/ChatModal';
import Dropdown from '../components/Dropdown';

const UserProfile: React.FC = () => {
  const { id } = useParams();
  const { user, updateUser, isAuthenticated, reviews, allProducts } = useAuth();
  const { formatPrice } = useCurrency();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [sellerTab, setSellerTab] = useState('listings'); // For seller profile tabs
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.username || '',
    email: user?.email || '',
    phone: '********69',
    gender: 'male',
    dateOfBirth: {
      day: '',
      month: '',
      year: ''
    }
  });

  // Check if viewing own profile
  const isOwnProfile = !id || id === user?.id;

  // Get seller listings from global products
  const sellerListings = allProducts.filter(product => 
    product.sellerId === id || product.seller === id
  );

  // Get reviews for this seller
  const sellerReviews = reviews.filter(review => 
    review.sellerId === id || review.sellerName === id
  );

  // Mock user data for viewing other profiles
  const profileUser = isOwnProfile ? user : {
    id: id,
    username: 'TechDeals',
    email: 'techdeals@example.com',
    rating: 4.8,
    totalSales: 156,
    joinDate: '2023',
    location: 'San Francisco, CA',
    verified: true,
    totalDonated: 15420,
    description: 'Passionate about technology and giving back to the community. All my sales support education initiatives.',
    stats: {
      responseTime: '< 1 hour',
      shippingTime: '1-2 days',
      returnPolicy: '30 days'
    }
  };

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' }
  ];

  const dayOptions = Array.from({ length: 31 }, (_, i) => ({
    value: (i + 1).toString(),
    label: (i + 1).toString()
  }));

  const monthOptions = [
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ];

  const yearOptions = Array.from({ length: 80 }, (_, i) => ({
    value: (2025 - i).toString(),
    label: (2025 - i).toString()
  }));

  const sidebarItems = [
    {
      category: 'My Account',
      items: [
        { id: 'profile', label: 'Profile', icon: User, active: true },
        { id: 'banks', label: 'Banks & Cards', icon: CreditCard },
        { id: 'addresses', label: 'Addresses', icon: MapPin },
        { id: 'password', label: 'Change Password', icon: Shield },
        { id: 'notifications', label: 'Notification Settings', icon: Bell },
        { id: 'privacy', label: 'Privacy Settings', icon: Settings }
      ]
    },
    {
      category: 'My Activity',
      items: [
        { id: 'purchases', label: 'My Purchase', icon: Package },
        { id: 'notifications-list', label: 'Notifications', icon: Bell },
        { id: 'vouchers', label: 'My Vouchers', icon: Gift },
        { id: 'coins', label: 'My Trade2Help Coins', icon: Coins }
      ]
    }
  ];

  const handleContactSeller = () => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }
    setShowChatModal(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      dateOfBirth: {
        ...prev.dateOfBirth,
        [field]: value
      }
    }));
  };

  const handleSave = () => {
    if (user) {
      updateUser({
        username: formData.name,
        email: formData.email
      });
    }
    setIsEditing(false);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const ProductCard = ({ product }: { product: any }) => (
    <Link
      to={`/product/${product.id}`}
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:shadow-lg transition-all group relative"
    >
      {product.status === 'sold' && (
        <div className="absolute top-2 left-2 z-10 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold">
          SOLD
        </div>
      )}
      <div className="aspect-square overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
        />
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2 text-sm leading-tight">
          {product.title}
        </h3>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-1">
            <span className="text-lg font-bold text-gray-900 dark:text-white">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-xs text-gray-500 dark:text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
            )}
          </div>
          <div className="flex items-center text-xs text-green-600 dark:text-green-400">
            <Heart className="w-3 h-3 mr-0.5" />
            {product.donationPercent}%
          </div>
        </div>
        <div className="text-xs text-gray-600 dark:text-gray-400">
          <div className="truncate">to {product.charity}</div>
          <div className="text-xs mt-1 truncate">{product.condition} • {product.postedDate}</div>
        </div>
      </div>
    </Link>
  );

  // If viewing someone else's profile, show the seller profile view
  if (!isOwnProfile) {
    const averageRating = sellerReviews.length > 0 
      ? sellerReviews.reduce((sum, review) => sum + review.rating, 0) / sellerReviews.length 
      : 4.8; // Default if no reviews
    const activeListings = sellerListings.filter(listing => listing.status === 'active');
    const soldListings = sellerListings.filter(listing => listing.status === 'sold');

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 dark:bg-gray-900 min-h-screen transition-colors">
        {/* Seller Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8 transition-colors">
          <div className="flex items-start space-x-6">
            <div className="w-24 h-24 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
              <span className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {profileUser.username.charAt(0)}
              </span>
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{profileUser.username}</h1>
                {profileUser.verified && (
                  <div className="flex items-center bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full text-sm">
                    <Shield className="w-4 h-4 mr-1" />
                    Verified
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-4 text-gray-600 dark:text-gray-400 mb-3">
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-400 fill-current mr-1" />
                  <span className="font-semibold">{averageRating.toFixed(1)}</span>
                  <span className="ml-1">({sellerReviews.length} reviews)</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {profileUser.location}
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Member since {profileUser.joinDate}
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4">{profileUser.description}</p>
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center">
                  <Package className="w-4 h-4 text-gray-400 mr-1" />
                  <span className="text-gray-600 dark:text-gray-400">{profileUser.totalSales} sales</span>
                </div>
                <div className="flex items-center">
                  <Heart className="w-4 h-4 text-red-400 mr-1" />
                  <span className="text-gray-600 dark:text-gray-400">${profileUser.totalDonated.toLocaleString()} donated</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col space-y-3">
              <button 
                onClick={handleContactSeller}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Contact Seller
              </button>
            </div>
          </div>
        </div>

        {/* Seller Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 text-center transition-colors">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Response Time</h3>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{profileUser.stats.responseTime}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 text-center transition-colors">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Shipping Time</h3>
            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{profileUser.stats.shippingTime}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 text-center transition-colors">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Return Policy</h3>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{profileUser.stats.returnPolicy}</p>
          </div>
        </div>

        {/* Tabs for Listings and Reviews */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setSellerTab('listings')}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                  sellerTab === 'listings'
                    ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <Package className="w-4 h-4 mr-2" />
                Listings ({activeListings.length} active)
              </button>
              <button
                onClick={() => setSellerTab('reviews')}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                  sellerTab === 'reviews'
                    ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <Star className="w-4 h-4 mr-2" />
                Reviews ({sellerReviews.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {sellerTab === 'listings' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {profileUser.username}'s Listings
                  </h3>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-md transition-colors ${
                        viewMode === 'grid' 
                          ? 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400' 
                          : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
                      }`}
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-md transition-colors ${
                        viewMode === 'list' 
                          ? 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400' 
                          : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
                      }`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {sellerListings.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sellerListings.map((product) => (
                      <Link
                        key={product.id}
                        to={`/product/${product.id}`}
                        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-lg transition-all group flex items-center space-x-4"
                      >
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                            {product.title}
                          </h3>
                          <div className="flex items-center space-x-4 mb-1">
                            <div className="flex items-center space-x-2">
                              <span className="text-xl font-bold text-gray-900 dark:text-white">{formatPrice(product.price)}</span>
                              {product.originalPrice && (
                                <span className="text-sm text-gray-500 dark:text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
                              )}
                            </div>
                            <div className="flex items-center text-sm text-green-600 dark:text-green-400">
                              <Heart className="w-4 h-4 mr-1" />
                              {product.donationPercent}% to {product.charity}
                            </div>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              product.status === 'active' 
                                ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                                : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                            }`}>
                              {product.status.toUpperCase()}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {product.condition} • Posted {product.postedDate}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {sellerListings.length === 0 && (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No listings yet</h3>
                    <p className="text-gray-600 dark:text-gray-400">This seller hasn't listed any items</p>
                  </div>
                )}
              </div>
            )}

            {sellerTab === 'reviews' && (
              <div>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Customer Reviews</h3>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <div className="flex items-center mr-2">
                        {renderStars(Math.round(averageRating))}
                      </div>
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">{averageRating.toFixed(1)}</span>
                      <span className="text-gray-600 dark:text-gray-400 ml-2">out of 5</span>
                    </div>
                    <span className="text-gray-600 dark:text-gray-400">({sellerReviews.length} reviews)</span>
                  </div>
                </div>

                <div className="space-y-6">
                  {sellerReviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-200 dark:border-gray-600 pb-6 last:border-b-0">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                          <span className="font-semibold text-purple-600 dark:text-purple-400">
                            {review.sellerName.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-3">
                              <h4 className="font-semibold text-gray-900 dark:text-white">{review.sellerName}</h4>
                              <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full text-xs font-medium">
                                Verified Purchase
                              </span>
                            </div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">{review.date}</span>
                          </div>
                          <div className="flex items-center mb-2">
                            {renderStars(review.rating)}
                            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">for {review.productTitle}</span>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300">{review.comment}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {sellerReviews.length === 0 && (
                  <div className="text-center py-12">
                    <Star className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No reviews yet</h3>
                    <p className="text-gray-600 dark:text-gray-400">This seller hasn't received any reviews</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Login Prompt Modal */}
        <LoginPromptModal
          isOpen={showLoginPrompt}
          onClose={() => setShowLoginPrompt(false)}
          action="chat"
        />

        {/* Chat Modal */}
        <ChatModal
          isOpen={showChatModal}
          onClose={() => setShowChatModal(false)}
          sellerId={profileUser.id}
          sellerName={profileUser.username}
        />
      </div>
    );
  }

  // Own profile view with modern layout (unchanged)
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors">
              {/* Profile Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-green-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {user?.username?.charAt(0).toUpperCase() || 'A'}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{user?.username || 'User'}</h3>
                    <button className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 flex items-center">
                      <Edit3 className="w-3 h-3 mr-1" />
                      Edit Profile
                    </button>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="p-4">
                {sidebarItems.map((section) => (
                  <div key={section.category} className="mb-6">
                    <div className="flex items-center mb-3">
                      <User className="w-4 h-4 text-purple-600 dark:text-purple-400 mr-2" />
                      <h4 className="font-medium text-gray-900 dark:text-white text-sm">{section.category}</h4>
                    </div>
                    <ul className="space-y-1">
                      {section.items.map((item) => {
                        const IconComponent = item.icon;
                        return (
                          <li key={item.id}>
                            <button
                              onClick={() => setActiveTab(item.id)}
                              className={`w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
                                activeTab === item.id
                                  ? 'bg-purple-50 dark:bg-purple-900 text-purple-600 dark:text-purple-400 border-l-2 border-purple-500'
                                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                              }`}
                            >
                              <IconComponent className="w-4 h-4 mr-3" />
                              {item.label}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
              {/* Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Profile</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Manage and protect your account</p>
              </div>

              {/* Profile Form */}
              <div className="p-6">
                <div className="flex flex-col lg:flex-row gap-8">
                  {/* Form Fields */}
                  <div className="flex-1 space-y-6">
                    {/* Username */}
                    <div className="flex items-center">
                      <label className="w-32 text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
                      <div className="flex-1">
                        <span className="text-gray-900 dark:text-white">{user?.username || 'arrentheguy'}</span>
                      </div>
                    </div>

                    {/* Name */}
                    <div className="flex items-center">
                      <label className="w-32 text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                      <div className="flex-1">
                        {isEditing ? (
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        ) : (
                          <span className="text-gray-900 dark:text-white">{formData.name || 'Not set'}</span>
                        )}
                      </div>
                    </div>

                    {/* Email */}
                    <div className="flex items-center">
                      <label className="w-32 text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                      <div className="flex-1 flex items-center space-x-3">
                        <span className="text-gray-900 dark:text-white">ar**********@gmail.com</span>
                        <button className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 text-sm font-medium">
                          Change
                        </button>
                      </div>
                    </div>

                    {/* Phone Number */}
                    <div className="flex items-center">
                      <label className="w-32 text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
                      <div className="flex-1 flex items-center space-x-3">
                        <span className="text-gray-900 dark:text-white">*********69</span>
                        <button className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 text-sm font-medium">
                          Change
                        </button>
                      </div>
                    </div>

                    {/* Gender */}
                    <div className="flex items-center">
                      <label className="w-32 text-sm font-medium text-gray-700 dark:text-gray-300">Gender</label>
                      <div className="flex-1">
                        {isEditing ? (
                          <div className="flex space-x-6">
                            {genderOptions.map((option) => (
                              <label key={option.value} className="flex items-center">
                                <input
                                  type="radio"
                                  name="gender"
                                  value={option.value}
                                  checked={formData.gender === option.value}
                                  onChange={handleInputChange}
                                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 dark:border-gray-600"
                                />
                                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{option.label}</span>
                              </label>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-900 dark:text-white capitalize">{formData.gender}</span>
                        )}
                      </div>
                    </div>

                    {/* Date of Birth */}
                    <div className="flex items-center">
                      <label className="w-32 text-sm font-medium text-gray-700 dark:text-gray-300">Date of birth</label>
                      <div className="flex-1">
                        {isEditing ? (
                          <div className="flex space-x-3">
                            <div className="w-20">
                              <Dropdown
                                options={dayOptions}
                                value={formData.dateOfBirth.day}
                                onChange={(value) => handleDateChange('day', value)}
                                placeholder="Date"
                              />
                            </div>
                            <div className="w-32">
                              <Dropdown
                                options={monthOptions}
                                value={formData.dateOfBirth.month}
                                onChange={(value) => handleDateChange('month', value)}
                                placeholder="Month"
                              />
                            </div>
                            <div className="w-20">
                              <Dropdown
                                options={yearOptions}
                                value={formData.dateOfBirth.year}
                                onChange={(value) => handleDateChange('year', value)}
                                placeholder="Year"
                              />
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-900 dark:text-white">Not set</span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center pt-4">
                      <div className="w-32"></div>
                      <div className="flex-1">
                        {isEditing ? (
                          <div className="flex space-x-3">
                            <button
                              onClick={handleSave}
                              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
                            >
                              <Save className="w-4 h-4 mr-2" />
                              Save
                            </button>
                            <button
                              onClick={() => setIsEditing(false)}
                              className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-6 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setIsEditing(true)}
                            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
                          >
                            <Edit3 className="w-4 h-4 mr-2" />
                            Edit Profile
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Profile Picture */}
                  <div className="lg:w-80 flex flex-col items-center">
                    <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-green-500 rounded-full flex items-center justify-center text-white font-bold text-4xl mb-4">
                      {user?.username?.charAt(0).toUpperCase() || 'A'}
                    </div>
                    <button className="flex items-center justify-center w-32 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <Camera className="w-4 h-4 mr-2" />
                      Select Image
                    </button>
                    <div className="text-center mt-3 text-xs text-gray-500 dark:text-gray-400">
                      <p>File size: maximum 1 MB</p>
                      <p>File extension: .JPEG, .PNG</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 text-center transition-colors">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Package className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{user?.totalSales || 0}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Items Sold</div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 text-center transition-colors">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Heart className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">${user?.donationTotal?.toFixed(2) || '0.00'}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Donated</div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 text-center transition-colors">
                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Star className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{user?.rating || 'N/A'}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Seller Rating</div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 text-center transition-colors">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Award className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Gold</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Member Status</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;