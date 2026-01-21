import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Settings, CreditCard, MapPin, Bell, Shield, Package, Gift, Coins, Edit3, Camera, Save, Mail, Phone, Calendar, ChevronDown, Star, Heart, TrendingUp, Award, Target, Users, MessageCircle, Filter, Grid, List, Eye, EyeOff, Plus, Trash2, Edit, Check, X, Clock, DollarSign, BarChart3, ShoppingCart, Truck, Home, Globe, Lock, AlertCircle, Download, Upload, RefreshCw, CreditCard as CardIcon, Building, Smartphone, Laptop, Monitor, Headphones, Camera as CameraIcon, Watch, Gamepad2, Book, Shirt, Sofa, Car, Dumbbell, Music, Palette, Wrench, Baby, PawPrint, Coffee, Flower2, Zap, Wifi, Battery, HardDrive, Cpu, MemoryStick, Speaker, Keyboard, Mouse, Printer, Router, Tablet, ToggleLeft as Toggle, Volume2, VolumeX, Sun, Moon, Languages, FileText, Archive, Bookmark, Tag, Search, SortAsc, SortDesc, Calendar as CalendarIcon, Timer, Percent, TrendingDown, Activity, PieChart, BarChart, LineChart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useEscrow } from '../contexts/EscrowContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { useTheme } from '../contexts/ThemeContext';
import ChatModal from '../components/ChatModal';
import Dropdown from '../components/Dropdown';

const Dashboard: React.FC = () => {
  // Temporarily comment out context usage to test if routing works
  /*
  const {
    user,
    updateUser,
    userListings,
    purchases,
    reviews,
    cart,
    wishlist,
    updateListing,
    deleteListing,
    markProductAsSold,
    addReview,
    markPurchaseAsReviewed
  } = useAuth();
  const { getOrdersByUser } = useEscrow();
  const { formatPrice, selectedCurrency, currencies, changeCurrency } = useCurrency();
  const { theme, toggleTheme } = useTheme();
  */
  const navigate = useNavigate();

  // State management
  const [activeSection, setActiveSection] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('recent');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // Form states
  const [profileForm, setProfileForm] = useState({
    username: user?.username || '',
    email: user?.email || '',
    phone: '+1 (555) 123-4567',
    address: '123 Main St, San Francisco, CA 94102',
    bio: 'Passionate seller committed to supporting great causes through Trade2Help.',
    website: 'https://mystore.com',
    socialMedia: {
      twitter: '@myhandle',
      instagram: '@mystore',
      facebook: 'MyStore'
    }
  });

  const [passwordForm, setPasswordForm] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    smsNotifications: true,
    marketingEmails: false,
    orderUpdates: true,
    newMessages: true,
    priceAlerts: false,
    weeklyDigest: true
  });

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false,
    showLastSeen: true,
    allowMessages: true,
    showOnlineStatus: true,
    dataCollection: true,
    analyticsTracking: false
  });

  const [shopSettings, setShopSettings] = useState({
    shopName: 'My Trade2Help Store',
    shopDescription: 'Quality items with a purpose - every purchase supports charity!',
    shopLogo: '',
    bannerImage: '',
    businessHours: {
      monday: { open: '09:00', close: '17:00', closed: false },
      tuesday: { open: '09:00', close: '17:00', closed: false },
      wednesday: { open: '09:00', close: '17:00', closed: false },
      thursday: { open: '09:00', close: '17:00', closed: false },
      friday: { open: '09:00', close: '17:00', closed: false },
      saturday: { open: '10:00', close: '16:00', closed: false },
      sunday: { open: '12:00', close: '16:00', closed: true }
    },
    autoReply: {
      enabled: true,
      message: 'Thanks for your message! I\'ll get back to you within 24 hours.'
    },
    shippingPolicies: {
      domesticShipping: '$5.99',
      internationalShipping: '$15.99',
      freeShippingThreshold: 50,
      processingTime: '1-2 business days',
      returnPolicy: '30 days'
    },
    defaultCharity: 'Education for All',
    defaultDonationPercent: 10
  });

  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: '1',
      type: 'credit',
      last4: '4242',
      brand: 'Visa',
      expiryMonth: 12,
      expiryYear: 2027,
      isDefault: true,
      nickname: 'Main Card'
    },
    {
      id: '2',
      type: 'credit',
      last4: '8888',
      brand: 'Mastercard',
      expiryMonth: 8,
      expiryYear: 2026,
      isDefault: false,
      nickname: 'Backup Card'
    }
  ]);

  const [addresses, setAddresses] = useState([
    {
      id: '1',
      type: 'home',
      name: 'Home Address',
      street: '123 Main Street',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102',
      country: 'United States',
      isDefault: true
    },
    {
      id: '2',
      type: 'work',
      name: 'Work Address',
      street: '456 Business Ave',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94105',
      country: 'United States',
      isDefault: false
    }
  ]);

  const [vouchers, setVouchers] = useState([
    {
      id: '1',
      code: 'WELCOME10',
      title: '10% Off First Purchase',
      description: 'Get 10% off your first purchase on Trade2Help',
      discount: 10,
      type: 'percentage',
      expiryDate: '2025-03-01',
      minSpend: 25,
      used: false
    },
    {
      id: '2',
      code: 'CHARITY5',
      title: '$5 Off Charity Donation',
      description: 'Extra $5 donation to your chosen charity',
      discount: 5,
      type: 'fixed',
      expiryDate: '2025-02-15',
      minSpend: 50,
      used: true
    }
  ]);

  const [coins, setCoins] = useState({
    balance: 250,
    earned: 1250,
    spent: 1000,
    pending: 50,
    history: [
      { id: '1', type: 'earned', amount: 25, description: 'Sale commission bonus', date: '2025-01-10' },
      { id: '2', type: 'spent', amount: -50, description: 'Listing promotion', date: '2025-01-09' },
      { id: '3', type: 'earned', amount: 15, description: 'Review bonus', date: '2025-01-08' },
      { id: '4', type: 'earned', amount: 30, description: 'Referral bonus', date: '2025-01-07' }
    ]
  });

  // Get user orders
  const userOrders = user ? getOrdersByUser(user.id, 'buyer') : [];
  const sellerOrders = user ? getOrdersByUser(user.id, 'seller') : [];

  // Calculate stats
  const totalSales = userListings.reduce((sum, listing) => sum + (listing.status === 'sold' ? listing.price : 0), 0);
  const totalDonated = userListings.reduce((sum, listing) => 
    sum + (listing.status === 'sold' ? (listing.price * listing.donationPercent / 100) : 0), 0
  );
  const activeListing = userListings.filter(listing => listing.status === 'active').length;
  const pendingListings = userListings.filter(listing => listing.status === 'pending').length;

  // Sidebar navigation
  const sidebarSections = [
    {
      title: 'My Activity',
      items: [
        { id: 'overview', label: 'Overview', icon: BarChart3 },
        { id: 'track-orders', label: 'Track My Orders', icon: Package },
        { id: 'purchase-history', label: 'Purchase History', icon: ShoppingCart },
        { id: 'donation-receipts', label: 'Donation Receipts', icon: FileText },
        { id: 'favorites', label: 'Favorites', icon: Heart },
        { id: 'reviews', label: 'My Reviews', icon: Star }
      ]
    },
    {
      title: 'Shop Management',
      items: [
        { id: 'my-listings', label: 'My Listings', icon: Package },
        { id: 'seller-analytics', label: 'Seller Analytics', icon: TrendingUp },
        { id: 'shop-settings', label: 'Shop Settings', icon: Settings },
        { id: 'inventory', label: 'Inventory Management', icon: Archive }
      ]
    },
    {
      title: 'Account Settings',
      items: [
        { id: 'profile', label: 'Profile Settings', icon: User },
        { id: 'security', label: 'Security & Privacy', icon: Shield },
        { id: 'preferences', label: 'Preferences', icon: Settings },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'currency', label: 'Currency & Region', icon: Globe }
      ]
    },
    {
      title: 'Payments',
      items: [
        { id: 'payment-methods', label: 'Payment Methods', icon: CreditCard },
        { id: 'addresses', label: 'Addresses', icon: MapPin },
        { id: 'transaction-history', label: 'Transaction History', icon: FileText },
        { id: 'vouchers', label: 'Vouchers & Credits', icon: Gift }
      ]
    }
  ];

  // Handle form submissions
  const handleProfileSave = () => {
    if (user) {
      updateUser({
        username: profileForm.username,
        email: profileForm.email
      });
    }
    setIsEditing(false);
  };

  const handlePasswordChange = () => {
    if (passwordForm.new !== passwordForm.confirm) {
      alert('New passwords do not match!');
      return;
    }
    if (passwordForm.new.length < 8) {
      alert('Password must be at least 8 characters long!');
      return;
    }
    
    alert('Password changed successfully!');
    setPasswordForm({ current: '', new: '', confirm: '' });
  };

  const handleNotificationToggle = (setting: string) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof prev]
    }));
  };

  const handlePrivacyToggle = (setting: string) => {
    setPrivacySettings(prev => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof prev]
    }));
  };

  const handleShopSettingChange = (field: string, value: any) => {
    setShopSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const addPaymentMethod = () => {
    const newCard = {
      id: Date.now().toString(),
      type: 'credit',
      last4: '0000',
      brand: 'Visa',
      expiryMonth: 12,
      expiryYear: 2028,
      isDefault: false,
      nickname: 'New Card'
    };
    setPaymentMethods([...paymentMethods, newCard]);
  };

  const removePaymentMethod = (id: string) => {
    setPaymentMethods(paymentMethods.filter(method => method.id !== id));
  };

  const setDefaultPaymentMethod = (id: string) => {
    setPaymentMethods(paymentMethods.map(method => ({
      ...method,
      isDefault: method.id === id
    })));
  };

  const addAddress = () => {
    const newAddress = {
      id: Date.now().toString(),
      type: 'other',
      name: 'New Address',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States',
      isDefault: false
    };
    setAddresses([...addresses, newAddress]);
  };

  const removeAddress = (id: string) => {
    setAddresses(addresses.filter(address => address.id !== id));
  };

  const setDefaultAddress = (id: string) => {
    setAddresses(addresses.map(address => ({
      ...address,
      isDefault: address.id === id
    })));
  };

  // Filter and sort functions
  const getFilteredListings = () => {
    let filtered = userListings;

    if (filterStatus !== 'all') {
      filtered = filtered.filter(listing => listing.status === filterStatus);
    }

    if (searchTerm) {
      filtered = filtered.filter(listing =>
        listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'title':
          return a.title.localeCompare(b.title);
        case 'recent':
        default:
          return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
      }
    });
  };

  // Render different sections
  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Welcome Header */}
            <div className="bg-gradient-to-br from-emerald-900/90 via-slate-800 to-slate-900 rounded-xl p-8 text-white shadow-xl border border-emerald-700/30 relative overflow-hidden">
              {/* Subtle background pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-50"></div>

              <div className="relative z-10">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-emerald-500/20 backdrop-blur-md rounded-2xl flex items-center justify-center mr-4 border border-emerald-400/40 shadow-lg">
                    <Sparkles className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">Welcome back, {user?.username}!</h1>
                    <p className="text-emerald-300 font-medium">Here's what's happening with your Trade2Help account</p>
                  </div>
                </div>

                <div className="bg-slate-700/60 backdrop-blur-md rounded-xl p-4 border border-slate-600/50 shadow-inner">
                  <p className="text-sm text-slate-300">
                    📊 Track your impact • 💰 Monitor your earnings • 📦 Manage your listings
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="group bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl p-6 rounded-xl shadow-lg border border-slate-200/80 dark:border-slate-700/80 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 hover:scale-[1.02]">
                <div className="flex items-center">
                  <div className="p-3 bg-emerald-500/20 backdrop-blur-md rounded-2xl border border-emerald-400/40 shadow-lg">
                    <Package className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Active Listings</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{activeListing}</p>
                  </div>
                </div>
              </div>

              <div className="group bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl p-6 rounded-xl shadow-lg border border-slate-200/80 dark:border-slate-700/80 hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300 hover:scale-[1.02]">
                <div className="flex items-center">
                  <div className="p-3 bg-amber-500/20 backdrop-blur-md rounded-2xl border border-amber-400/40 shadow-lg">
                    <Heart className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Donated</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{formatPrice(totalDonated)}</p>
                  </div>
                </div>
              </div>

              <div className="group bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl p-6 rounded-xl shadow-lg border border-slate-200/80 dark:border-slate-700/80 hover:shadow-xl hover:shadow-slate-500/10 transition-all duration-300 hover:scale-[1.02]">
                <div className="flex items-center">
                  <div className="p-3 bg-slate-500/20 backdrop-blur-md rounded-2xl border border-slate-400/40 shadow-lg">
                    <DollarSign className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Sales</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{formatPrice(totalSales)}</p>
                  </div>
                </div>
              </div>

              <div className="group bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl p-6 rounded-xl shadow-lg border border-slate-200/80 dark:border-slate-700/80 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 hover:scale-[1.02]">
                <div className="flex items-center">
                  <div className="p-3 bg-emerald-500/20 backdrop-blur-md rounded-2xl border border-emerald-400/40 shadow-lg">
                    <Clock className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Pending</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{pendingListings}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-xl shadow-lg border border-slate-200/80 dark:border-slate-700/80 p-6">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-emerald-500/20 backdrop-blur-md rounded-2xl flex items-center justify-center mr-3 border border-emerald-400/40 shadow-lg">
                  <Zap className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Quick Actions</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                  to="/sell"
                  className="group flex items-center p-5 bg-gradient-to-br from-emerald-50/50 to-slate-50/50 dark:from-emerald-900/20 dark:to-slate-900/20 rounded-xl border border-emerald-200/40 dark:border-emerald-700/40 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 hover:scale-[1.02] backdrop-blur-sm"
                >
                  <div className="p-2 bg-emerald-500/20 backdrop-blur-md rounded-xl border border-emerald-400/40 shadow-lg mr-3">
                    <Plus className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">List New Item</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Start selling and help charities</p>
                  </div>
                </Link>

                <button
                  onClick={() => setActiveSection('seller-analytics')}
                  className="group flex items-center p-5 bg-gradient-to-br from-amber-50/50 to-slate-50/50 dark:from-amber-900/20 dark:to-slate-900/20 rounded-xl border border-amber-200/40 dark:border-amber-700/40 hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300 hover:scale-[1.02] backdrop-blur-sm"
                >
                  <div className="p-2 bg-amber-500/20 backdrop-blur-md rounded-xl border border-amber-400/40 shadow-lg mr-3">
                    <BarChart3 className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">View Analytics</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Track your performance</p>
                  </div>
                </button>

                <Link
                  to="/search"
                  className="group flex items-center p-5 bg-gradient-to-br from-slate-50/50 to-slate-100/50 dark:from-slate-900/20 dark:to-slate-800/20 rounded-xl border border-slate-200/40 dark:border-slate-700/40 hover:shadow-xl hover:shadow-slate-500/10 transition-all duration-300 hover:scale-[1.02] backdrop-blur-sm"
                >
                  <div className="p-2 bg-slate-500/20 backdrop-blur-md rounded-xl border border-slate-400/40 shadow-lg mr-3">
                    <Package className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">Browse Items</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Find great deals</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-xl shadow-lg border border-slate-200/80 dark:border-slate-700/80 p-6">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-amber-500/20 backdrop-blur-md rounded-2xl flex items-center justify-center mr-3 border border-amber-400/40 shadow-lg">
                  <Activity className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Recent Activity</h2>
              </div>
              {userListings.length === 0 && purchases.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-slate-500/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-400/40 shadow-lg">
                    <Package className="w-8 h-8 text-slate-600 dark:text-slate-400" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No recent activity</h3>
                  <p className="text-slate-600 dark:text-slate-400">Start buying or selling to see your activity here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {userListings.slice(0, 3).map((listing) => (
                    <div key={listing.id} className="flex items-center space-x-4 p-4 bg-slate-50/50 dark:bg-slate-900/50 rounded-xl border border-slate-200/40 dark:border-slate-700/40 backdrop-blur-sm hover:shadow-md transition-all duration-200">
                      <img
                        src={listing.images[0]}
                        alt={listing.title}
                        className="w-12 h-12 object-cover rounded-xl shadow-md"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-slate-900 dark:text-white">{listing.title}</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Listed for {formatPrice(listing.price)} • {listing.status}
                        </p>
                      </div>
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        listing.status === 'active' ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-700' :
                        listing.status === 'pending' ? 'bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-700' :
                        'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-600'
                      }`}>
                        {listing.status.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 'track-orders':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Track My Orders</h1>
              <div className="flex items-center space-x-2">
                <button className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 text-white px-4 py-2 rounded-xl hover:from-indigo-700 hover:via-indigo-800 hover:to-indigo-900 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-indigo-500/30">
                  <RefreshCw className="w-4 h-4 mr-2 inline" />
                  Refresh
                </button>
              </div>
            </div>

            {userOrders.length === 0 ? (
              <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-xl shadow-lg border border-slate-200/80 dark:border-slate-700/80 p-8 text-center">
                <Package className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No orders yet</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">Start shopping to track your orders here</p>
                <Link
                  to="/search"
                  className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 text-white px-6 py-2 rounded-xl hover:from-indigo-700 hover:via-indigo-800 hover:to-indigo-900 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-indigo-500/30"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {userOrders.map((order) => (
                  <div key={order.id} className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-xl shadow-lg border border-slate-200/80 dark:border-slate-700/80 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white">Order #{order.id.substring(0, 8)}</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Placed on {order.createdAt.toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-3 py-1 text-sm rounded-full ${
                        order.status === 'completed' ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-700' :
                        order.status === 'shipped' ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 border border-indigo-200 dark:border-indigo-700' :
                        order.status === 'delivered' ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-700' :
                        'bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-700'
                      }`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <img
                        src={order.productImage}
                        alt={order.productTitle}
                        className="w-16 h-16 object-cover rounded-xl"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-slate-900 dark:text-white">{order.productTitle}</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Sold by {order.sellerName} • {formatPrice(order.total)}
                        </p>
                        <div className="flex items-center text-sm text-emerald-600 dark:text-emerald-400 mt-1">
                          <Heart className="w-4 h-4 mr-1" />
                          {formatPrice(order.donationAmount)} donated to {order.charity}
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <Link
                          to={`/order/${order.id}`}
                          className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 text-white px-4 py-2 rounded-xl hover:from-indigo-700 hover:via-indigo-800 hover:to-indigo-900 transition-colors text-sm"
                        >
                          Track Order
                        </Link>
                        {order.status === 'delivered' && (
                          <button
                            onClick={() => setShowChatModal(true)}
                            className="border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-300 text-sm bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm"
                          >
                            Contact Seller
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'purchase-history':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Purchase History</h1>
              <div className="flex items-center space-x-2">
                <button className="border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/90 backdrop-blur-sm transition-colors">
                  <Download className="w-4 h-4 mr-2 inline" />
                  Export
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200/80 dark:border-slate-700/80">
              <div className="p-6 border-b border-slate-200/80 dark:border-slate-700/80">
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Search purchases..."
                      className="w-full border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 bg-white dark:bg-slate-800/90 backdrop-blur-sm text-slate-900 dark:text-white"
                    />
                  </div>
                  <select className="border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 bg-white dark:bg-slate-800/90 backdrop-blur-sm text-slate-900 dark:text-white">
                    <option>All Time</option>
                    <option>Last 30 Days</option>
                    <option>Last 3 Months</option>
                    <option>Last Year</option>
                  </select>
                </div>
              </div>

              <div className="p-6">
                {purchases.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No purchases yet</h3>
                    <p className="text-slate-600 dark:text-slate-400">Your purchase history will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {purchases.map((purchase) => (
                      <div key={purchase.id} className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-600 rounded-xl">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-xl flex items-center justify-center">
                            <Package className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                          </div>
                          <div>
                            <h4 className="font-medium text-slate-900 dark:text-white">{purchase.productName}</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              {purchase.date} • {formatPrice(purchase.price)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            purchase.status === 'completed' ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-700' :
                            'bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-700'
                          }`}>
                            {purchase.status}
                          </span>
                          {!purchase.isReviewed && purchase.status === 'completed' && (
                            <button className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 text-sm">
                              Write Review
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'donation-receipts':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Donation Receipts</h1>
              <div className="flex items-center space-x-2">
                <button className="border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/90 backdrop-blur-sm transition-colors">
                  <Download className="w-4 h-4 mr-2 inline" />
                  Download All
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200/80 dark:border-slate-700/80 p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{formatPrice(totalDonated)}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Total Donated</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">5</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Charities Supported</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">12</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Tax Receipts</div>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { charity: 'Education for All', amount: 189.90, date: '2025-01-10', receiptId: 'RCP-001' },
                  { charity: 'Tech for Kids', amount: 156.80, date: '2025-01-09', receiptId: 'RCP-002' },
                  { charity: 'Habitat for Humanity', amount: 67.50, date: '2025-01-08', receiptId: 'RCP-003' }
                ].map((receipt, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-600 rounded-xl">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-xl flex items-center justify-center border border-emerald-200 dark:border-emerald-700">
                        <Heart className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-900 dark:text-white">{receipt.charity}</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {receipt.date} • Receipt #{receipt.receiptId}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        {formatPrice(receipt.amount)}
                      </span>
                      <button className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'favorites':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Favorites</h1>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                  className="border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/90 backdrop-blur-sm transition-colors"
                >
                  {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {wishlist.length === 0 ? (
              <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-xl shadow-lg border border-slate-200/80 dark:border-slate-700/80 p-8 text-center">
                <Heart className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No favorites yet</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">Items you favorite will appear here</p>
                <Link
                  to="/search"
                  className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 text-white px-6 py-2 rounded-xl hover:from-indigo-700 hover:via-indigo-800 hover:to-indigo-900 transition-colors"
                >
                  Browse Items
                </Link>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                {wishlist.map((item) => (
                  <div key={item.id} className={`bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-xl shadow-lg border border-slate-200/80 dark:border-slate-700/80 overflow-hidden ${
                    viewMode === 'list' ? 'flex items-center p-4' : ''
                  }`}>
                    {viewMode === 'grid' ? (
                      <>
                        <div className="aspect-square overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-slate-900 dark:text-white">{formatPrice(item.price)}</span>
                            <button className="text-red-500 hover:text-red-700">
                              <Heart className="w-5 h-5 fill-current" />
                            </button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-20 h-20 object-cover rounded-xl"
                        />
                        <div className="flex-1 ml-4">
                          <h3 className="font-semibold text-slate-900 dark:text-white">{item.title}</h3>
                          <p className="text-slate-600 dark:text-slate-400">by {item.seller}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-lg font-bold text-slate-900 dark:text-white">{formatPrice(item.price)}</span>
                            <button className="text-red-500 hover:text-red-700">
                              <Heart className="w-5 h-5 fill-current" />
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'reviews':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Reviews</h1>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-slate-600 dark:text-slate-400">{reviews.length} reviews</span>
              </div>
            </div>

            {reviews.length === 0 ? (
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200/80 dark:border-slate-700/80 p-8 text-center">
                <Star className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No reviews yet</h3>
                <p className="text-slate-600 dark:text-slate-400">Reviews you write will appear here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200/80 dark:border-slate-700/80 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white">Product Review</h3>
                        <div className="flex items-center mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating ? 'text-amber-400 fill-current' : 'text-slate-300'
                              }`}
                            />
                          ))}
                          <span className="ml-2 text-sm text-slate-600 dark:text-slate-400">{review.date}</span>
                        </div>
                      </div>
                      <button className="text-slate-400 hover:text-slate-600">
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'my-listings':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Listings</h1>
              <Link
                to="/sell"
                className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 text-white px-4 py-2 rounded-xl hover:from-indigo-700 hover:via-indigo-800 hover:to-indigo-900 transition-colors flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Listing
              </Link>
            </div>

            {/* Filters and Search */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200/80 dark:border-slate-700/80 p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search your listings..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 bg-white dark:bg-slate-800/90 backdrop-blur-sm text-slate-900 dark:text-white"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 bg-white dark:bg-slate-800/90 backdrop-blur-sm text-slate-900 dark:text-white"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="sold">Sold</option>
                  <option value="rejected">Rejected</option>
                </select>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 bg-white dark:bg-slate-800/90 backdrop-blur-sm text-slate-900 dark:text-white"
                >
                  <option value="recent">Most Recent</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="title">Title A-Z</option>
                </select>
                <button
                  onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                  className="border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 px-3 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/90 backdrop-blur-sm transition-colors"
                >
                  {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Listings */}
            {getFilteredListings().length === 0 ? (
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200/80 dark:border-slate-700/80 p-8 text-center">
                <Package className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No listings found</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  {userListings.length === 0 ? "You haven't listed any items yet" : "No listings match your filters"}
                </p>
                <Link
                  to="/sell"
                  className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 text-white px-6 py-2 rounded-xl hover:from-indigo-700 hover:via-indigo-800 hover:to-indigo-900 transition-colors"
                >
                  Create Your First Listing
                </Link>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                {getFilteredListings().map((listing) => (
                  <div key={listing.id} className={`bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200/80 dark:border-slate-700/80 overflow-hidden ${
                    viewMode === 'list' ? 'flex items-center p-4' : ''
                  }`}>
                    {viewMode === 'grid' ? (
                      <>
                        <div className="aspect-square overflow-hidden relative">
                          <img
                            src={listing.images[0]}
                            alt={listing.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 right-2">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              listing.status === 'active' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200 dark:border-emerald-700' :
                              listing.status === 'pending' ? 'bg-amber-100 text-amber-800 border border-amber-200 dark:border-amber-700' :
                              listing.status === 'sold' ? 'bg-indigo-100 text-indigo-800 border border-indigo-200 dark:border-indigo-700' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {listing.status.toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{listing.title}</h3>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-lg font-bold text-slate-900 dark:text-white">{formatPrice(listing.price)}</span>
                            <div className="flex items-center text-sm text-emerald-600 dark:text-emerald-400">
                              <Heart className="w-3 h-3 mr-1" />
                              {listing.donationPercent}%
                            </div>
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">to {listing.charity}</p>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => navigate(`/product/${listing.id}`)}
                              className="flex-1 bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 text-white px-3 py-2 rounded-xl hover:from-indigo-700 hover:via-indigo-800 hover:to-indigo-900 transition-colors text-sm"
                            >
                              <Eye className="w-4 h-4 mr-1 inline" />
                              View
                            </button>
                            <button
                              onClick={() => {/* Edit listing */}}
                              className="border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 px-3 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/90 backdrop-blur-sm transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteListing(listing.id)}
                              className="border border-red-300 text-red-600 px-3 py-2 rounded-xl hover:bg-red-50 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <img
                          src={listing.images[0]}
                          alt={listing.title}
                          className="w-20 h-20 object-cover rounded-xl"
                        />
                        <div className="flex-1 ml-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-slate-900 dark:text-white">{listing.title}</h3>
                              <p className="text-slate-600 dark:text-slate-400">{listing.category} • {listing.condition}</p>
                              <div className="flex items-center mt-1">
                                <span className="text-lg font-bold text-slate-900 dark:text-white mr-4">{formatPrice(listing.price)}</span>
                                <div className="flex items-center text-sm text-emerald-600 dark:text-emerald-400">
                                  <Heart className="w-3 h-3 mr-1" />
                                  {listing.donationPercent}% to {listing.charity}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                listing.status === 'active' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200 dark:border-emerald-700' :
                                listing.status === 'pending' ? 'bg-amber-100 text-amber-800 border border-amber-200 dark:border-amber-700' :
                                listing.status === 'sold' ? 'bg-indigo-100 text-indigo-800 border border-indigo-200 dark:border-indigo-700' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {listing.status.toUpperCase()}
                              </span>
                              <button
                                onClick={() => navigate(`/product/${listing.id}`)}
                                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {/* Edit listing */}}
                                className="text-slate-600 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deleteListing(listing.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'seller-analytics':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Seller Analytics</h1>
              <Link
                to="/seller-analytics"
                className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 text-white px-4 py-2 rounded-xl hover:from-indigo-700 hover:via-indigo-800 hover:to-indigo-900 transition-colors"
              >
                View Detailed Analytics
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200/80 dark:border-slate-700/80">
                <div className="flex items-center">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-xl">
                    <DollarSign className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Revenue</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{formatPrice(totalSales)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200/80 dark:border-slate-700/80">
                <div className="flex items-center">
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-900 rounded-xl">
                    <Heart className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Donated</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{formatPrice(totalDonated)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200/80 dark:border-slate-700/80">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-xl">
                    <Eye className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Views</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">1,234</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200/80 dark:border-slate-700/80">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-xl">
                    <Percent className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Conversion Rate</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">12.5%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200/80 dark:border-slate-700/80 p-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Sales Trend</h3>
                <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
                  <BarChart className="w-16 h-16 mr-4" />
                  <div>
                    <p className="font-medium">Sales Chart</p>
                    <p className="text-sm">Monthly sales performance</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200/80 dark:border-slate-700/80 p-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Category Performance</h3>
                <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
                  <PieChart className="w-16 h-16 mr-4" />
                  <div>
                    <p className="font-medium">Category Breakdown</p>
                    <p className="text-sm">Sales by category</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'shop-settings':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Shop Settings</h1>

            {/* Shop Information */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200/80 dark:border-slate-700/80 p-6">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Shop Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Shop Name
                  </label>
                  <input
                    type="text"
                    value={shopSettings.shopName}
                    onChange={(e) => handleShopSettingChange('shopName', e.target.value)}
                    className="w-full border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 bg-white dark:bg-slate-800/90 backdrop-blur-sm text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Shop Description
                  </label>
                  <textarea
                    rows={3}
                    value={shopSettings.shopDescription}
                    onChange={(e) => handleShopSettingChange('shopDescription', e.target.value)}
                    className="w-full border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 bg-white dark:bg-slate-800/90 backdrop-blur-sm text-slate-900 dark:text-white"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Default Charity
                    </label>
                    <select
                      value={shopSettings.defaultCharity}
                      onChange={(e) => handleShopSettingChange('defaultCharity', e.target.value)}
                      className="w-full border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 bg-white dark:bg-slate-800/90 backdrop-blur-sm text-slate-900 dark:text-white"
                    >
                      <option>Education for All</option>
                      <option>Tech for Kids</option>
                      <option>Habitat for Humanity</option>
                      <option>Arts Education</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Default Donation %
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={shopSettings.defaultDonationPercent}
                      onChange={(e) => handleShopSettingChange('defaultDonationPercent', parseInt(e.target.value))}
                      className="w-full border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 bg-white dark:bg-slate-800/90 backdrop-blur-sm text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200/80 dark:border-slate-700/80 p-6">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Business Hours</h2>
              <div className="space-y-3">
                {Object.entries(shopSettings.businessHours).map(([day, hours]) => (
                  <div key={day} className="flex items-center space-x-4">
                    <div className="w-24 text-sm font-medium text-slate-700 dark:text-slate-300 capitalize">
                      {day}
                    </div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={!hours.closed}
                        onChange={(e) => handleShopSettingChange('businessHours', {
                          ...shopSettings.businessHours,
                          [day]: { ...hours, closed: !e.target.checked }
                        })}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-slate-700 dark:text-slate-300">Open</span>
                    </label>
                    {!hours.closed && (
                      <>
                        <input
                          type="time"
                          value={hours.open}
                          onChange={(e) => handleShopSettingChange('businessHours', {
                            ...shopSettings.businessHours,
                            [day]: { ...hours, open: e.target.value }
                          })}
                          className="border border-slate-300 dark:border-slate-600 rounded px-2 py-1 text-sm bg-white dark:bg-slate-800/90 backdrop-blur-sm text-slate-900 dark:text-white"
                        />
                        <span className="text-gray-500">to</span>
                        <input
                          type="time"
                          value={hours.close}
                          onChange={(e) => handleShopSettingChange('businessHours', {
                            ...shopSettings.businessHours,
                            [day]: { ...hours, close: e.target.value }
                          })}
                          className="border border-slate-300 dark:border-slate-600 rounded px-2 py-1 text-sm bg-white dark:bg-slate-800/90 backdrop-blur-sm text-slate-900 dark:text-white"
                        />
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Auto Reply */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200/80 dark:border-slate-700/80 p-6">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Auto Reply Settings</h2>
              <div className="space-y-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={shopSettings.autoReply.enabled}
                    onChange={(e) => handleShopSettingChange('autoReply', {
                      ...shopSettings.autoReply,
                      enabled: e.target.checked
                    })}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                    Enable auto reply for new messages
                  </span>
                </label>
                {shopSettings.autoReply.enabled && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Auto Reply Message
                    </label>
                    <textarea
                      rows={3}
                      value={shopSettings.autoReply.message}
                      onChange={(e) => handleShopSettingChange('autoReply', {
                        ...shopSettings.autoReply,
                        message: e.target.value
                      })}
                      className="w-full border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 bg-white dark:bg-slate-800/90 backdrop-blur-sm text-slate-900 dark:text-white"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Shipping Policies */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200/80 dark:border-slate-700/80 p-6">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Shipping Policies</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Domestic Shipping
                  </label>
                  <input
                    type="text"
                    value={shopSettings.shippingPolicies.domesticShipping}
                    onChange={(e) => handleShopSettingChange('shippingPolicies', {
                      ...shopSettings.shippingPolicies,
                      domesticShipping: e.target.value
                    })}
                    className="w-full border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 bg-white dark:bg-slate-800/90 backdrop-blur-sm text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    International Shipping
                  </label>
                  <input
                    type="text"
                    value={shopSettings.shippingPolicies.internationalShipping}
                    onChange={(e) => handleShopSettingChange('shippingPolicies', {
                      ...shopSettings.shippingPolicies,
                      internationalShipping: e.target.value
                    })}
                    className="w-full border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 bg-white dark:bg-slate-800/90 backdrop-blur-sm text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Processing Time
                  </label>
                  <input
                    type="text"
                    value={shopSettings.shippingPolicies.processingTime}
                    onChange={(e) => handleShopSettingChange('shippingPolicies', {
                      ...shopSettings.shippingPolicies,
                      processingTime: e.target.value
                    })}
                    className="w-full border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 bg-white dark:bg-slate-800/90 backdrop-blur-sm text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Return Policy
                  </label>
                  <input
                    type="text"
                    value={shopSettings.shippingPolicies.returnPolicy}
                    onChange={(e) => handleShopSettingChange('shippingPolicies', {
                      ...shopSettings.shippingPolicies,
                      returnPolicy: e.target.value
                    })}
                    className="w-full border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 bg-white dark:bg-slate-800/90 backdrop-blur-sm text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 text-white px-6 py-2 rounded-xl hover:from-indigo-700 hover:via-indigo-800 hover:to-indigo-900 transition-colors flex items-center">
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </button>
            </div>
          </div>
        );

      case 'inventory':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Inventory Management</h1>
              <div className="flex items-center space-x-2">
                <button className="border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/90 backdrop-blur-sm transition-colors">
                  <Download className="w-4 h-4 mr-2 inline" />
                  Export
                </button>
                <button className="border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/90 backdrop-blur-sm transition-colors">
                  <Upload className="w-4 h-4 mr-2 inline" />
                  Import
                </button>
              </div>
            </div>

            {/* Inventory Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200/80 dark:border-slate-700/80">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-xl">
                    <Package className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Items</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{userListings.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200/80 dark:border-slate-700/80">
                <div className="flex items-center">
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-900 rounded-xl">
                    <Check className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Active</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{activeListing}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200/80 dark:border-slate-700/80">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-xl">
                    <Clock className="w-6 h-6 text-yellow-600 dark:text-amber-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Pending</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{pendingListings}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200/80 dark:border-slate-700/80">
                <div className="flex items-center">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-xl">
                    <DollarSign className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Value</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {formatPrice(userListings.reduce((sum, item) => sum + item.price, 0))}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Inventory Table */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200/80 dark:border-slate-700/80">
              <div className="p-6 border-b border-slate-200/80 dark:border-slate-700/80">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Inventory Items</h2>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder="Search inventory..."
                      className="border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 bg-white dark:bg-slate-800/90 backdrop-blur-sm text-slate-900 dark:text-white text-sm"
                    />
                    <select className="border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 bg-white dark:bg-slate-800/90 backdrop-blur-sm text-slate-900 dark:text-white text-sm">
                      <option>All Categories</option>
                      <option>Electronics</option>
                      <option>Furniture</option>
                      <option>Clothing</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 dark:bg-slate-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Item
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Charity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {userListings.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/90 backdrop-blur-sm">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img
                              src={item.images[0]}
                              alt={item.title}
                              className="w-10 h-10 object-cover rounded-xl mr-3"
                            />
                            <div>
                              <div className="text-sm font-medium text-slate-900 dark:text-white">
                                {item.title}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {item.condition}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white">
                          {item.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">
                          {formatPrice(item.price)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            item.status === 'active' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200 dark:border-emerald-700' :
                            item.status === 'pending' ? 'bg-amber-100 text-amber-800 border border-amber-200 dark:border-amber-700' :
                            item.status === 'sold' ? 'bg-indigo-100 text-indigo-800 border border-indigo-200 dark:border-indigo-700' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {item.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white">
                          <div>
                            <div>{item.charity}</div>
                            <div className="text-xs text-emerald-600 dark:text-emerald-400">
                              {item.donationPercent}%
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => navigate(`/product/${item.id}`)}
                              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="text-slate-600 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteListing(item.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {userListings.length === 0 && (
                <div className="p-8 text-center">
                  <Package className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No inventory items</h3>
                  <p className="text-slate-600 dark:text-slate-400">Start listing items to manage your inventory</p>
                </div>
              )}
            </div>
          </div>
        );

      case 'profile':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Profile Settings</h1>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 text-white px-4 py-2 rounded-xl hover:from-indigo-700 hover:via-indigo-800 hover:to-indigo-900 transition-colors flex items-center"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Picture */}
              <div className="lg:col-span-1">
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200/80 dark:border-slate-700/80 p-6 text-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-green-500 rounded-full flex items-center justify-center text-white font-bold text-4xl mx-auto mb-4">
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{user?.username}</h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">{user?.email}</p>
                  <button className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 text-white px-4 py-2 rounded-xl hover:from-indigo-700 hover:via-indigo-800 hover:to-indigo-900 transition-colors flex items-center mx-auto">
                    <Camera className="w-4 h-4 mr-2" />
                    Change Photo
                  </button>
                </div>
              </div>

              {/* Profile Form */}
              <div className="lg:col-span-2">
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200/80 dark:border-slate-700/80 p-6">
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">Personal Information</h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Username
                        </label>
                        <input
                          type="text"
                          value={profileForm.username}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, username: e.target.value }))}
                          disabled={!isEditing}
                          className="w-full border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 bg-white dark:bg-slate-800/90 backdrop-blur-sm text-slate-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={profileForm.email}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                          disabled={!isEditing}
                          className="w-full border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 bg-white dark:bg-slate-800/90 backdrop-blur-sm text-slate-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Phone
                        </label>
                        <input
                          type="tel"
                          value={profileForm.phone}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                          disabled={!isEditing}
                          className="w-full border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 bg-white dark:bg-slate-800/90 backdrop-blur-sm text-slate-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Website
                        </label>
                        <input
                          type="url"
                          value={profileForm.website}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, website: e.target.value }))}
                          disabled={!isEditing}
                          className="w-full border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 bg-white dark:bg-slate-800/90 backdrop-blur-sm text-slate-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Address
                      </label>
                      <input
                        type="text"
                        value={profileForm.address}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, address: e.target.value }))}
                        disabled={!isEditing}
                        className="w-full border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 bg-white dark:bg-slate-800/90 backdrop-blur-sm text-slate-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Bio
                      </label>
                      <textarea
                        rows={3}
                        value={profileForm.bio}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, bio: e.target.value }))}
                        disabled={!isEditing}
                        className="w-full border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 bg-white dark:bg-slate-800/90 backdrop-blur-sm text-slate-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600"
                      />
                    </div>
                    
                    {isEditing && (
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={() => setIsEditing(false)}
                          className="border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/90 backdrop-blur-sm transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleProfileSave}
                          className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 text-white px-4 py-2 rounded-xl hover:from-indigo-700 hover:via-indigo-800 hover:to-indigo-900 transition-colors flex items-center"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Security & Privacy</h1>

            {/* Change Password */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200/80 dark:border-slate-700/80 p-6">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Change Password</h2>
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.current ? 'text' : 'password'}
                      value={passwordForm.current}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, current: e.target.value }))}
                      className="w-full border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 pr-10 bg-white dark:bg-slate-800/90 backdrop-blur-sm text-slate-900 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('current')}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? 'text' : 'password'}
                      value={passwordForm.new}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, new: e.target.value }))}
                      className="w-full border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 pr-10 bg-white dark:bg-slate-800/90 backdrop-blur-sm text-slate-900 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('new')}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? 'text' : 'password'}
                      value={passwordForm.confirm}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, confirm: e.target.value }))}
                      className="w-full border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 pr-10 bg-white dark:bg-slate-800/90 backdrop-blur-sm text-slate-900 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('confirm')}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <button
                  onClick={handlePasswordChange}
                  className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 text-white px-4 py-2 rounded-xl hover:from-indigo-700 hover:via-indigo-800 hover:to-indigo-900 transition-colors"
                >
                  Update Password
                </button>
              </div>
            </div>

            {/* Privacy Settings */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200/80 dark:border-slate-700/80 p-6">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Privacy Settings</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-slate-900 dark:text-white">Profile Visibility</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Control who can see your profile</p>
                  </div>
                  <select
                    value={privacySettings.profileVisibility}
                    onChange={(e) => setPrivacySettings(prev => ({ ...prev, profileVisibility: e.target.value }))}
                    className="border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 bg-white dark:bg-slate-800/90 backdrop-blur-sm text-slate-900 dark:text-white"
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                    <option value="friends">Friends Only</option>
                  </select>
                </div>

                {Object.entries(privacySettings).filter(([key]) => key !== 'profileVisibility').map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-slate-900 dark:text-white capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {key === 'showEmail' && 'Display email address on profile'}
                        {key === 'showPhone' && 'Display phone number on profile'}
                        {key === 'showLastSeen' && 'Show when you were last active'}
                        {key === 'allowMessages' && 'Allow other users to message you'}
                        {key === 'showOnlineStatus' && 'Show when you are online'}
                        {key === 'dataCollection' && 'Allow data collection for analytics'}
                        {key === 'analyticsTracking' && 'Enable analytics tracking'}
                      </p>
                    </div>
                    <button
                      onClick={() => handlePrivacyToggle(key)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        value ? 'bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800' : 'bg-gray-200 dark:bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          value ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Two-Factor Authentication */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200/80 dark:border-slate-700/80 p-6">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Two-Factor Authentication</h2>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-slate-900 dark:text-white">Enable 2FA</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Add an extra layer of security to your account</p>
                </div>
                <button className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 text-white px-4 py-2 rounded-xl hover:from-indigo-700 hover:via-indigo-800 hover:to-indigo-900 transition-colors">
                  Setup 2FA
                </button>
              </div>
            </div>
          </div>
        );

      case 'preferences':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Preferences</h1>

            {/* Theme Settings */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200/80 dark:border-slate-700/80 p-6">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Appearance</h2>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-slate-900 dark:text-white">Dark Mode</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Switch between light and dark themes</p>
                </div>
                <button
                  onClick={toggleTheme}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    theme === 'dark' ? 'bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Language & Region */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200/80 dark:border-slate-700/80 p-6">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Language & Region</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Language
                  </label>
                  <select className="w-full border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 bg-white dark:bg-slate-800/90 backdrop-blur-sm text-slate-900 dark:text-white">
                    <option>English (US)</option>
                    <option>Spanish</option>
                    <option>French</option>
                    <option>German</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Time Zone
                  </label>
                  <select className="w-full border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 bg-white dark:bg-slate-800/90 backdrop-blur-sm text-slate-900 dark:text-white">
                    <option>Pacific Time (PT)</option>
                    <option>Mountain Time (MT)</option>
                    <option>Central Time (CT)</option>
                    <option>Eastern Time (ET)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Default Settings */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200/80 dark:border-slate-700/80 p-6">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Default Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Default Listing View
                  </label>
                  <select className="w-full border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 bg-white dark:bg-slate-800/90 backdrop-blur-sm text-slate-900 dark:text-white">
                    <option>Grid View</option>
                    <option>List View</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Items Per Page
                  </label>
                  <select className="w-full border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 bg-white dark:bg-slate-800/90 backdrop-blur-sm text-slate-900 dark:text-white">
                    <option>12</option>
                    <option>24</option>
                    <option>48</option>
                    <option>96</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Notification Settings</h1>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200/80 dark:border-slate-700/80 p-6">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Notification Preferences</h2>
              <div className="space-y-4">
                {Object.entries(notificationSettings).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-slate-900 dark:text-white capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {key === 'emailNotifications' && 'Receive notifications via email'}
                        {key === 'pushNotifications' && 'Receive push notifications in browser'}
                        {key === 'smsNotifications' && 'Receive SMS notifications'}
                        {key === 'marketingEmails' && 'Receive marketing and promotional emails'}
                        {key === 'orderUpdates' && 'Get notified about order status changes'}
                        {key === 'newMessages' && 'Get notified when you receive new messages'}
                        {key === 'priceAlerts' && 'Get notified about price drops on wishlist items'}
                        {key === 'weeklyDigest' && 'Receive weekly summary of your activity'}
                      </p>
                    </div>
                    <button
                      onClick={() => handleNotificationToggle(key)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        value ? 'bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800' : 'bg-gray-200 dark:bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          value ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Notification Schedule */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200/80 dark:border-slate-700/80 p-6">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Notification Schedule</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Quiet Hours
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="time"
                      defaultValue="22:00"
                      className="border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 bg-white dark:bg-slate-800/90 backdrop-blur-sm text-slate-900 dark:text-white"
                    />
                    <span className="text-gray-500 dark:text-gray-400">to</span>
                    <input
                      type="time"
                      defaultValue="08:00"
                      className="border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 bg-white dark:bg-slate-800/90 backdrop-blur-sm text-slate-900 dark:text-white"
                    />
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    No notifications will be sent during these hours
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'currency':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Currency & Region</h1>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200/80 dark:border-slate-700/80 p-6">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Currency Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Preferred Currency
                  </label>
                  <select
                    value={selectedCurrency.code}
                    onChange={(e) => changeCurrency(e.target.value)}
                    className="w-full border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 bg-white dark:bg-slate-800/90 backdrop-blur-sm text-slate-900 dark:text-white"
                  >
                    {currencies.map((currency) => (
                      <option key={currency.code} value={currency.code}>
                        {currency.name} ({currency.symbol})
                      </option>
                    ))}
                  </select>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    All prices will be displayed in {selectedCurrency.name}
                  </p>
                </div>
              </div>
            </div>

            {/* Regional Settings */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200/80 dark:border-slate-700/80 p-6">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Regional Settings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Country/Region
                  </label>
                  <select className="w-full border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 bg-white dark:bg-slate-800/90 backdrop-blur-sm text-slate-900 dark:text-white">
                    <option>United States</option>
                    <option>Canada</option>
                    <option>United Kingdom</option>
                    <option>Australia</option>
                    <option>Germany</option>
                    <option>France</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Date Format
                  </label>
                  <select className="w-full border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 bg-white dark:bg-slate-800/90 backdrop-blur-sm text-slate-900 dark:text-white">
                    <option>MM/DD/YYYY</option>
                    <option>DD/MM/YYYY</option>
                    <option>YYYY-MM-DD</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      case 'payment-methods':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Payment Methods</h1>
              <button
                onClick={addPaymentMethod}
                className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 text-white px-4 py-2 rounded-xl hover:from-indigo-700 hover:via-indigo-800 hover:to-indigo-900 transition-colors flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Payment Method
              </button>
            </div>

            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <div key={method.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200/80 dark:border-slate-700/80 p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-xl flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div>
                        <h3 className="font-medium text-slate-900 dark:text-white">
                          {method.brand} •••• {method.last4}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Expires {method.expiryMonth}/{method.expiryYear}
                          {method.isDefault && (
                            <span className="ml-2 bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-700 px-2 py-1 rounded-full text-xs">
                              Default
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!method.isDefault && (
                        <button
                          onClick={() => setDefaultPaymentMethod(method.id)}
                          className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 text-sm"
                        >
                          Set as Default
                        </button>
                      )}
                      <button
                        onClick={() => removePaymentMethod(method.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'addresses':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Addresses</h1>
              <button
                onClick={addAddress}
                className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 text-white px-4 py-2 rounded-xl hover:from-indigo-700 hover:via-indigo-800 hover:to-indigo-900 transition-colors flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Address
              </button>
            </div>

            <div className="space-y-4">
              {addresses.map((address) => (
                <div key={address.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200/80 dark:border-slate-700/80 p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-xl flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div>
                        <h3 className="font-medium text-slate-900 dark:text-white">
                          {address.name}
                          {address.isDefault && (
                            <span className="ml-2 bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-700 px-2 py-1 rounded-full text-xs">
                              Default
                            </span>
                          )}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400">
                          {address.street}<br />
                          {address.city}, {address.state} {address.zipCode}<br />
                          {address.country}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!address.isDefault && (
                        <button
                          onClick={() => setDefaultAddress(address.id)}
                          className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 text-sm"
                        >
                          Set as Default
                        </button>
                      )}
                      <button className="text-slate-600 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeAddress(address.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'transaction-history':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Transaction History</h1>
              <button className="border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/90 backdrop-blur-sm transition-colors">
                <Download className="w-4 h-4 mr-2 inline" />
                Export
              </button>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200/80 dark:border-slate-700/80">
              <div className="p-6 border-b border-slate-200/80 dark:border-slate-700/80">
                <div className="flex items-center space-x-4">
                  <input
                    type="text"
                    placeholder="Search transactions..."
                    className="flex-1 border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 bg-white dark:bg-slate-800/90 backdrop-blur-sm text-slate-900 dark:text-white"
                  />
                  <select className="border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 bg-white dark:bg-slate-800/90 backdrop-blur-sm text-slate-900 dark:text-white">
                    <option>All Types</option>
                    <option>Sales</option>
                    <option>Purchases</option>
                    <option>Donations</option>
                    <option>Refunds</option>
                  </select>
                  <select className="border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 bg-white dark:bg-slate-800/90 backdrop-blur-sm text-slate-900 dark:text-white">
                    <option>Last 30 Days</option>
                    <option>Last 3 Months</option>
                    <option>Last Year</option>
                    <option>All Time</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 dark:bg-slate-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {[
                      { date: '2025-01-10', type: 'Sale', description: 'MacBook Pro 2023', amount: 1899, status: 'Completed' },
                      { date: '2025-01-09', type: 'Donation', description: 'Education for All', amount: -189.90, status: 'Completed' },
                      { date: '2025-01-08', type: 'Purchase', description: 'Camera Kit', amount: -650, status: 'Completed' },
                      { date: '2025-01-07', type: 'Sale', description: 'Vintage Sofa', amount: 450, status: 'Completed' }
                    ].map((transaction, index) => (
                      <tr key={index} className="hover:bg-slate-50 dark:hover:bg-slate-800/90 backdrop-blur-sm">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white">
                          {transaction.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            transaction.type === 'Sale' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200 dark:border-emerald-700' :
                            transaction.type === 'Purchase' ? 'bg-indigo-100 text-indigo-800 border border-indigo-200 dark:border-indigo-700' :
                            
                            transaction.type === 'Donation' ? 'bg-purple-100 text-purple-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {transaction.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white">
                          {transaction.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <span className={transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}>
                            {transaction.amount > 0 ? '+' : ''}{formatPrice(Math.abs(transaction.amount))}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 dark:border-emerald-700">
                            {transaction.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'vouchers':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Vouchers & Credits</h1>

            {/* Coins Balance */}
            <div className="bg-gradient-to-r from-purple-600 to-green-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Trade2Help Coins</h2>
                  <p className="text-purple-100">Earn coins through sales and activities</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">{coins.balance}</div>
                  <div className="text-purple-200">Available Coins</div>
                </div>
              </div>
            </div>

            {/* Coins Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200/80 dark:border-slate-700/80">
                <div className="flex items-center">
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-900 rounded-xl">
                    <TrendingUp className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Earned</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{coins.earned}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200/80 dark:border-slate-700/80">
                <div className="flex items-center">
                  <div className="p-2 bg-amber-100 dark:bg-amber-900 rounded-xl">
                    <TrendingDown className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Spent</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{coins.spent}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200/80 dark:border-slate-700/80">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-xl">
                    <Clock className="w-6 h-6 text-yellow-600 dark:text-amber-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Pending</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{coins.pending}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Vouchers */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200/80 dark:border-slate-700/80 p-6">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Available Vouchers</h2>
              <div className="space-y-4">
                {vouchers.map((voucher) => (
                  <div key={voucher.id} className={`border rounded-xl p-4 ${
                    voucher.used 
                      ? 'border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700' 
                      : 'border-purple-200 dark:border-purple-700 bg-purple-50 dark:bg-purple-900'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className={`font-medium ${
                          voucher.used 
                            ? 'text-gray-500 dark:text-gray-400' 
                            : 'text-purple-900 dark:text-purple-100'
                        }`}>
                          {voucher.title}
                        </h3>
                        <p className={`text-sm ${
                          voucher.used 
                            ? 'text-gray-400 dark:text-gray-500' 
                            : 'text-purple-700 dark:text-purple-300'
                        }`}>
                          {voucher.description}
                        </p>
                        <div className={`text-xs mt-1 ${
                          voucher.used 
                            ? 'text-gray-400 dark:text-gray-500' 
                            : 'text-indigo-600 dark:text-indigo-400'
                        }`}>
                          Code: {voucher.code} • Min spend: {formatPrice(voucher.minSpend)} • Expires: {voucher.expiryDate}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${
                          voucher.used 
                            ? 'text-gray-500 dark:text-gray-400' 
                            : 'text-indigo-600 dark:text-indigo-400'
                        }`}>
                          {voucher.type === 'percentage' ? `${voucher.discount}%` : formatPrice(voucher.discount)} OFF
                        </div>
                        {voucher.used && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">Used</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Coins History */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200/80 dark:border-slate-700/80 p-6">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Coins History</h2>
              <div className="space-y-3">
                {coins.history.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-600 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        transaction.type === 'earned' 
                          ? 'bg-emerald-100 dark:bg-emerald-900' 
                          : 'bg-amber-100 dark:bg-amber-900'
                      }`}>
                        {transaction.type === 'earned' ? (
                          <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{transaction.description}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{transaction.date}</p>
                      </div>
                    </div>
                    <div className={`font-semibold ${
                      transaction.type === 'earned' 
                        ? 'text-emerald-600 dark:text-emerald-400' 
                        : 'text-amber-600 dark:text-amber-400'
                    }`}>
                      {transaction.type === 'earned' ? '+' : ''}{transaction.amount}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Section Not Found</h2>
            <p className="text-slate-600 dark:text-slate-400">The requested section is not available.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative transition-all duration-700 overflow-hidden">
      {/* Enhanced Background Elements with Glassmorphism */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-gradient-to-br from-indigo-400/8 to-indigo-600/4 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-gradient-to-tl from-emerald-400/6 to-emerald-600/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-gradient-to-br from-amber-400/5 to-amber-600/2 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '4s' }}></div>

        {/* Floating particles effect */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-indigo-400/30 rounded-full animate-ping"
              style={{
                left: `${10 + i * 8}%`,
                top: `${15 + (i % 4) * 20}%`,
                animationDelay: `${i * 0.6}s`,
                animationDuration: '4s'
              }}
            ></div>
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-xl shadow-lg border border-slate-200/80 dark:border-slate-700/80 overflow-hidden transition-all duration-300">
              {/* Profile Header */}
              <div className="p-6 border-b border-slate-200/60 dark:border-slate-700/60 bg-gradient-to-br from-emerald-50/30 to-slate-50/30 dark:from-emerald-900/20 dark:to-slate-900/20">
                <div className="flex items-center space-x-3">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg border border-emerald-400/40">
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">{user?.username || 'User'}</h3>
                    <button
                      onClick={() => setActiveSection('profile')}
                      className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 flex items-center transition-colors"
                    >
                      <Edit3 className="w-3 h-3 mr-1" />
                      Edit Profile
                    </button>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="p-4">
                {sidebarSections.map((section) => (
                  <div key={section.title} className="mb-6">
                    <h4 className="font-semibold text-slate-900 dark:text-white text-xs mb-3 px-3 uppercase tracking-wide">
                      {section.title}
                    </h4>
                    <ul className="space-y-1">
                      {section.items.map((item) => {
                        const IconComponent = item.icon;
                        return (
                          <li key={item.id}>
                            <button
                              onClick={() => setActiveSection(item.id)}
                              className={`group w-full flex items-center px-3 py-2.5 text-sm rounded-xl transition-all duration-200 ${
                                activeSection === item.id
                                  ? 'bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200/40 dark:border-emerald-700/40 shadow-md'
                                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50/50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white hover:shadow-lg'
                              }`}
                            >
                              <div className={`p-1 rounded-xl mr-3 transition-colors ${
                                activeSection === item.id
                                  ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                                  : 'bg-slate-500/20 text-slate-600 dark:text-slate-400 group-hover:bg-slate-400/30'
                              }`}>
                                <IconComponent className="w-3.5 h-3.5" />
                              </div>
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
            <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-xl shadow-lg border border-slate-200/80 dark:border-slate-700/80 p-6 transition-all duration-300">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>

      {/* Chat Modal */}
      <ChatModal
        isOpen={showChatModal}
        onClose={() => setShowChatModal(false)}
        sellerId={selectedOrder?.sellerId}
        sellerName={selectedOrder?.sellerName}
        productId={selectedOrder?.productId}
        productTitle={selectedOrder?.productTitle}
      />
    </div>
  );
};

export default Dashboard;