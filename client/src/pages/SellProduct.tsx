import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Upload, X, Plus, Heart, Home, Shield, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import LoginPromptModal from '../components/LoginPromptModal';
import Dropdown from '../components/Dropdown';

const SellProduct: React.FC = () => {
  const { addListing, user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    condition: '',
    charity: '',
    donationPercent: 10,
    weight: '',
    dimensions: {
      length: '',
      width: '',
      height: ''
    }
  });
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Check authentication when component mounts or when user tries to interact
  useEffect(() => {
    if (!isAuthenticated) {
      // Don't show modal immediately, let user see the form first
    }
  }, [isAuthenticated]);

  const categoryOptions = [
    { value: 'Electronics', label: 'Electronics' },
    { value: 'Vehicles', label: 'Vehicles' },
    { value: 'Furniture', label: 'Furniture' },
    { value: 'Clothing', label: 'Clothing' },
    { value: 'Books', label: 'Books' },
    { value: 'Sports', label: 'Sports' },
    { value: 'Home & Garden', label: 'Home & Garden' },
    { value: 'Toys & Games', label: 'Toys & Games' },
    { value: 'Collectibles', label: 'Collectibles' },
    { value: 'Other', label: 'Other' }
  ];

  const conditionOptions = [
    { value: 'New', label: 'New' },
    { value: 'Like New', label: 'Like New' },
    { value: 'Excellent', label: 'Excellent' },
    { value: 'Good', label: 'Good' },
    { value: 'Fair', label: 'Fair' },
    { value: 'Poor', label: 'Poor' }
  ];

  const charityOptions = [
    { value: 'Education for All', label: 'Education for All' },
    { value: 'Habitat for Humanity', label: 'Habitat for Humanity' },
    { value: 'Warmth for All', label: 'Warmth for All' },
    { value: 'Arts Education', label: 'Arts Education' },
    { value: 'Tech for Kids', label: 'Tech for Kids' },
    { value: 'Digital Literacy', label: 'Digital Literacy' },
    { value: 'Music Education', label: 'Music Education' },
    { value: 'Environmental Protection', label: 'Environmental Protection' },
    { value: 'Animal Welfare', label: 'Animal Welfare' },
    { value: 'Healthcare Access', label: 'Healthcare Access' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // Check authentication on any form interaction
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }

    const { name, value } = e.target;
    
    if (name.startsWith('dimensions.')) {
      const dimension = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        dimensions: {
          ...prev.dimensions,
          [dimension]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleDropdownChange = (name: string, value: string) => {
    // Check authentication on dropdown change
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Check authentication on image upload
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }

    const files = Array.from(e.target.files || []);
    if (images.length + files.length > 15) {
      alert('Maximum 15 images allowed');
      return;
    }

    const newImages = [...images, ...files];
    setImages(newImages);

    // Create previews
    const newPreviews = [...imagePreviews];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        newPreviews.push(e.target?.result as string);
        setImagePreviews([...newPreviews]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }

    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }

    if (imagePreviews.length === 0) {
      alert('Please add at least one image');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create the listing object
      const listing = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        condition: formData.condition,
        charity: formData.charity,
        donationPercent: formData.donationPercent,
        images: ['https://via.placeholder.com/400x300?text=Product+Image'], // Use placeholder instead of base64 images
        seller: user!.username,
        location: 'Your Location', // In real app, this would come from user profile
        specifications: [], // Could be added based on category
        shipping: {
          cost: 'Handled by Trade2Help',
          time: '3-5 business days',
          protection: 'Full Buyer Protection included'
        }
      };

      // Add to user listings
      addListing(listing);

      alert('Your item has been listed successfully! It will be reviewed by our team before going live.');
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        price: '',
        category: '',
        condition: '',
        charity: '',
        donationPercent: 10,
        weight: '',
        dimensions: {
          length: '',
          width: '',
          height: ''
        }
      });
      setImages([]);
      setImagePreviews([]);

      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      alert('Error listing item. Please try again.');
    } finally {
      setIsSubmitting(false);
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

      <div className={`relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-95'}`}>
        <div className="mb-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/50 dark:to-amber-800/50 rounded-xl mb-3 shadow-md">
              <Plus className="w-6 h-6 text-amber-600 dark:text-amber-400 animate-pulse" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">Sell Your Item</h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg">List your item and choose a charity to support</p>
            <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 via-indigo-600 to-amber-500 rounded-full mx-auto mt-4"></div>
          </div>

          {!isAuthenticated && (
            <div className="mt-4 p-4 bg-indigo-50/50 dark:bg-indigo-900/20 backdrop-blur-xl border border-indigo-200/40 dark:border-indigo-700/40 rounded-xl shadow-lg">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-indigo-500/20 backdrop-blur-md rounded-xl flex items-center justify-center mr-3 border border-indigo-400/40 shadow-lg">
                  <Shield className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                <p className="text-indigo-700 dark:text-indigo-300">
                  <strong>Note:</strong> You'll need to log in to complete your listing. You can fill out the form below,
                  but you'll be prompted to log in when you try to submit or interact with the form.
                </p>
              </div>
            </div>
          )}
        </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Images Upload */}
        <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl p-6 rounded-xl shadow-lg border border-slate-200/80 dark:border-slate-700/80 transition-all duration-300">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-indigo-500/20 backdrop-blur-md rounded-2xl flex items-center justify-center mr-3 border border-indigo-400/40 shadow-lg">
              <Upload className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Product Images</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">Upload up to 15 images (JPG, PNG, GIF)</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-4">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative aspect-square group">
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover rounded-xl border border-slate-200/60 dark:border-slate-600/60 shadow-md group-hover:shadow-lg transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-amber-500 text-white rounded-full p-1.5 hover:bg-amber-600 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}

            {images.length < 15 && (
              <label className="aspect-square border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 dark:hover:border-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 transition-all duration-300 backdrop-blur-sm group">
                <Upload className="w-8 h-8 text-slate-400 dark:text-slate-500 mb-2 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors" />
                <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors font-medium">Add Image</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {/* Product Details */}
        <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl p-6 rounded-xl shadow-lg border border-slate-200/80 dark:border-slate-700/80 transition-all duration-300">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-emerald-500/20 backdrop-blur-md rounded-2xl flex items-center justify-center mr-3 border border-emerald-400/40 shadow-lg">
              <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Product Details</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">Tell buyers about your item</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Product Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleInputChange}
                className="w-full border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2.5 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 hover:border-slate-400 dark:hover:border-slate-500"
                placeholder="Enter product title"
              />
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Price ($) *
              </label>
              <input
                type="number"
                id="price"
                name="price"
                required
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2.5 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 hover:border-slate-400 dark:hover:border-slate-500"
                placeholder="0.00"
              />
            </div>

            <div>
              <Dropdown
                options={categoryOptions}
                value={formData.category}
                onChange={(value) => handleDropdownChange('category', value)}
                placeholder="Select a category"
                label="Category *"
              />
            </div>

            <div>
              <Dropdown
                options={conditionOptions}
                value={formData.condition}
                onChange={(value) => handleDropdownChange('condition', value)}
                placeholder="Select condition"
                label="Condition *"
              />
            </div>
          </div>

          <div className="mt-6">
            <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={6}
              value={formData.description}
              onChange={handleInputChange}
              className="w-full border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2.5 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 hover:border-slate-400 dark:hover:border-slate-500 resize-none"
              placeholder="Describe your item in detail..."
            />
          </div>
        </div>

        {/* Shipping Information */}
        <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl p-6 rounded-xl shadow-lg border border-slate-200/80 dark:border-slate-700/80 transition-all duration-300">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-amber-500/20 backdrop-blur-md rounded-2xl flex items-center justify-center mr-3 border border-amber-400/40 shadow-lg">
              <Heart className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Shipping & Protection</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">Optional details for better listings</p>
            </div>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">🛡️ Trade2Help Handles Everything</h3>
            <p className="text-green-700 dark:text-green-300 text-sm mb-3">
              All shipping and payments are handled securely through Trade2Help's escrow system to protect both buyers and sellers.
            </p>
            <ul className="text-green-700 dark:text-green-300 text-sm space-y-1">
              <li>• Secure escrow payment protection</li>
              <li>• Professional shipping with tracking</li>
              <li>• Full buyer and seller protection</li>
              <li>• Automatic charity donation processing</li>
            </ul>
          </div>

          {/* Package Details for shipping calculation */}
          <div>
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4">Package Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="weight" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Approximate Weight (kg)
                </label>
                <input
                  type="number"
                  id="weight"
                  name="weight"
                  min="0"
                  step="0.1"
                  value={formData.weight}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="0.0"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Helps us calculate shipping costs</p>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label htmlFor="dimensions.length" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Length (cm)
                  </label>
                  <input
                    type="number"
                    id="dimensions.length"
                    name="dimensions.length"
                    min="0"
                    value={formData.dimensions.length}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label htmlFor="dimensions.width" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Width (cm)
                  </label>
                  <input
                    type="number"
                    id="dimensions.width"
                    name="dimensions.width"
                    min="0"
                    value={formData.dimensions.width}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label htmlFor="dimensions.height" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    id="dimensions.height"
                    name="dimensions.height"
                    min="0"
                    value={formData.dimensions.height}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charity Selection */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Charity Support</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Choose a charity and percentage of your sale to donate</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Dropdown
                options={charityOptions}
                value={formData.charity}
                onChange={(value) => handleDropdownChange('charity', value)}
                placeholder="Choose a charity"
                label="Select Charity *"
              />
            </div>

            <div>
              <label htmlFor="donationPercent" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Donation Percentage *
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="donationPercent"
                  name="donationPercent"
                  required
                  min="1"
                  max="50"
                  value={formData.donationPercent}
                  onChange={handleInputChange}
                  className="w-full border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2.5 pr-10 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 hover:border-slate-400 dark:hover:border-slate-500"
                />
                <span className="absolute right-3 top-3 text-slate-500 dark:text-slate-400 font-medium">%</span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Recommended: 5-20%
              </p>
            </div>
          </div>

          {formData.price && formData.donationPercent && (
            <div className="mt-6 p-4 bg-emerald-50/50 dark:bg-emerald-900/20 backdrop-blur-xl border border-emerald-200/40 dark:border-emerald-700/40 rounded-xl shadow-lg">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-emerald-500/20 backdrop-blur-md rounded-xl flex items-center justify-center mr-3 border border-emerald-400/40 shadow-lg">
                  <Heart className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <div className="font-medium text-emerald-900 dark:text-emerald-100 text-sm">
                    ${((parseFloat(formData.price) * formData.donationPercent) / 100).toFixed(2)} will be donated
                  </div>
                  <div className="text-sm text-emerald-700 dark:text-emerald-300">
                    to {formData.charity || 'your selected charity'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-xl shadow-lg border border-slate-200/80 dark:border-slate-700/80 p-6">
          <div className="flex flex-col sm:flex-row justify-end gap-4">
            <button
              type="button"
              className="px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-300 backdrop-blur-sm bg-white/90 dark:bg-slate-800/90 shadow-sm hover:shadow-md"
            >
              Save as Draft
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative px-8 py-3 bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 text-white rounded-xl hover:from-indigo-700 hover:via-indigo-800 hover:to-indigo-900 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
            >
              {isSubmitting && (
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-indigo-600 animate-pulse rounded-xl"></div>
              )}
              <span className="relative z-10 flex items-center">
                {isSubmitting ? 'Listing Item...' : 'List Item for Sale'}
                {!isSubmitting && (
                  <Plus className="w-4 h-4 ml-2 group-hover:rotate-12 transition-transform duration-300" />
                )}
              </span>

              {/* Shine effect */}
              {!isSubmitting && (
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                </div>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Login Prompt Modal */}
      <LoginPromptModal
        isOpen={showLoginPrompt}
        onClose={() => setShowLoginPrompt(false)}
        action="sell"
      />
      </div>
    </div>
  );
};

export default SellProduct;