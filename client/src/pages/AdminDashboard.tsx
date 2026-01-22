import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Package, TrendingUp, Heart, Settings, Plus, Edit, Trash2, 
  Check, X, Eye, LogOut, Shield, Tag, Building2, FileText, Search,
  Monitor, ArrowUp, ArrowDown, ToggleLeft, ToggleRight, Upload, Image as ImageIcon
} from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';

const AdminDashboard: React.FC = () => {
  const { 
    admin, categories, charities, pendingItems, carouselSlides, isAuthenticated,
    logout, addCategory, updateCategory, deleteCategory,
    addCharity, updateCharity, deleteCharity,
    approveItem, rejectItem, addCarouselSlide, updateCarouselSlide, 
    deleteCarouselSlide, reorderCarouselSlides, getStats
  } = useAdmin();
  
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showCharityModal, setShowCharityModal] = useState(false);
  const [showCarouselModal, setShowCarouselModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [editingCharity, setEditingCharity] = useState<any>(null);
  const [editingCarouselSlide, setEditingCarouselSlide] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const stats = getStats();

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const handleMoveSlide = (index: number, direction: 'up' | 'down') => {
    const newSlides = [...carouselSlides];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex >= 0 && targetIndex < newSlides.length) {
      [newSlides[index], newSlides[targetIndex]] = [newSlides[targetIndex], newSlides[index]];
      // Update order values
      newSlides.forEach((slide, idx) => {
        slide.order = idx + 1;
      });
      reorderCarouselSlides(newSlides);
    }
  };

  const handleToggleSlide = (id: string, isActive: boolean) => {
    updateCarouselSlide(id, { isActive: !isActive });
  };

  const CategoryModal = () => {
    const [formData, setFormData] = useState({
      name: editingCategory?.name || '',
      icon: editingCategory?.icon || '',
      description: editingCategory?.description || '',
      isActive: editingCategory?.isActive ?? true
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (editingCategory) {
        updateCategory(editingCategory.id, formData);
      } else {
        addCategory(formData);
      }
      setShowCategoryModal(false);
      setEditingCategory(null);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h3 className="text-lg font-semibold mb-4">
            {editingCategory ? 'Edit Category' : 'Add New Category'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Icon (Text)</label>
              <input
                type="text"
                required
                value={formData.icon}
                onChange={(e) => setFormData({...formData, icon: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Electronics"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows={3}
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">Active</label>
            </div>
            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700"
              >
                {editingCategory ? 'Update' : 'Add'} Category
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCategoryModal(false);
                  setEditingCategory(null);
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const CharityModal = () => {
    const [formData, setFormData] = useState({
      name: editingCharity?.name || '',
      description: editingCharity?.description || '',
      website: editingCharity?.website || '',
      category: editingCharity?.category || '',
      isActive: editingCharity?.isActive ?? true
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (editingCharity) {
        updateCharity(editingCharity.id, formData);
      } else {
        addCharity(formData);
      }
      setShowCharityModal(false);
      setEditingCharity(null);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h3 className="text-lg font-semibold mb-4">
            {editingCharity ? 'Edit Charity' : 'Add New Charity'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
              <input
                type="url"
                required
                value={formData.website}
                onChange={(e) => setFormData({...formData, website: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="https://example.org"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select category</option>
                <option value="Education">Education</option>
                <option value="Health">Health</option>
                <option value="Environment">Environment</option>
                <option value="Social Services">Social Services</option>
                <option value="Housing">Housing</option>
                <option value="Animal Welfare">Animal Welfare</option>
              </select>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="charityActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label htmlFor="charityActive" className="ml-2 text-sm text-gray-700">Active</label>
            </div>
            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700"
              >
                {editingCharity ? 'Update' : 'Add'} Charity
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCharityModal(false);
                  setEditingCharity(null);
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const CarouselModal = () => {
    const [formData, setFormData] = useState({
      title: editingCarouselSlide?.title || '',
      type: editingCarouselSlide?.type || 'custom',
      isActive: editingCarouselSlide?.isActive ?? true,
      order: editingCarouselSlide?.order || carouselSlides.length + 1,
      customImage: editingCarouselSlide?.content?.customImage || '',
      heading: editingCarouselSlide?.content?.heading || '',
      subheading: editingCarouselSlide?.content?.subheading || '',
      buttonText: editingCarouselSlide?.content?.buttonText || '',
      buttonLink: editingCarouselSlide?.content?.buttonLink || '',
      backgroundColor: editingCarouselSlide?.content?.backgroundColor || '#6366f1',
      textColor: editingCarouselSlide?.content?.textColor || '#ffffff'
    });
    const [imagePreview, setImagePreview] = useState<string>(editingCarouselSlide?.content?.customImage || '');

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setImagePreview(result);
          setFormData(prev => ({ ...prev, customImage: result }));
        };
        reader.readAsDataURL(file);
      }
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      const slideData = {
        title: formData.title,
        type: formData.type as any,
        isActive: formData.isActive,
        order: formData.order,
        content: {
          customImage: formData.customImage,
          heading: formData.heading,
          subheading: formData.subheading,
          buttonText: formData.buttonText,
          buttonLink: formData.buttonLink,
          backgroundColor: formData.backgroundColor,
          textColor: formData.textColor
        }
      };

      if (editingCarouselSlide) {
        updateCarouselSlide(editingCarouselSlide.id, slideData);
      } else {
        addCarouselSlide(slideData);
      }
      setShowCarouselModal(false);
      setEditingCarouselSlide(null);
      setImagePreview('');
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4">
            {editingCarouselSlide ? 'Edit Carousel Slide' : 'Add New Carousel Slide'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  required
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="donation-counter">Donation Counter</option>
                  <option value="hot-deals">Hot Deals</option>
                  <option value="new-charity">New Charity</option>
                  <option value="trending-fashion">Trending Fashion</option>
                  <option value="flash-sale">Flash Sale</option>
                  <option value="charity-spotlight">Charity Spotlight</option>
                  <option value="custom">Custom Advertisement</option>
                </select>
              </div>
            </div>

            {/* Custom Advertisement Fields */}
            {formData.type === 'custom' && (
              <>
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Advertisement Image</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    {imagePreview ? (
                      <div className="space-y-4">
                        <div className="relative">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-48 object-contain bg-gray-100 rounded-lg"
                            style={{ objectFit: 'contain' }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setImagePreview('');
                              setFormData(prev => ({ ...prev, customImage: '' }));
                            }}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-sm text-gray-600 text-center">
                          Image will maintain its aspect ratio and fit within the carousel
                        </p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 mb-2">Upload an advertisement image</p>
                        <p className="text-sm text-gray-500 mb-4">
                          Recommended: 800x400px or similar aspect ratio
                        </p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="image-upload"
                        />
                        <label
                          htmlFor="image-upload"
                          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 cursor-pointer inline-flex items-center"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Choose Image
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                {/* Text Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Heading</label>
                    <input
                      type="text"
                      value={formData.heading}
                      onChange={(e) => setFormData({...formData, heading: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Main heading text"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subheading</label>
                    <input
                      type="text"
                      value={formData.subheading}
                      onChange={(e) => setFormData({...formData, subheading: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Subtitle or description"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
                    <input
                      type="text"
                      value={formData.buttonText}
                      onChange={(e) => setFormData({...formData, buttonText: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Call to action text"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Button Link</label>
                    <input
                      type="text"
                      value={formData.buttonLink}
                      onChange={(e) => setFormData({...formData, buttonLink: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="/search or https://example.com"
                    />
                  </div>
                </div>

                {/* Color Customization */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={formData.backgroundColor}
                        onChange={(e) => setFormData({...formData, backgroundColor: e.target.value})}
                        className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={formData.backgroundColor}
                        onChange={(e) => setFormData({...formData, backgroundColor: e.target.value})}
                        className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="#6366f1"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Text Color</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={formData.textColor}
                        onChange={(e) => setFormData({...formData, textColor: e.target.value})}
                        className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={formData.textColor}
                        onChange={(e) => setFormData({...formData, textColor: e.target.value})}
                        className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="#ffffff"
                      />
                    </div>
                  </div>
                </div>

                {/* Preview */}
                {(imagePreview || formData.heading) && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
                    <div 
                      className="border border-gray-300 rounded-lg p-4 h-48 flex items-center justify-center relative overflow-hidden"
                      style={{ backgroundColor: formData.backgroundColor }}
                    >
                      {imagePreview && (
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="absolute inset-0 w-full h-full object-contain"
                          style={{ objectFit: 'contain' }}
                        />
                      )}
                      {(formData.heading || formData.subheading || formData.buttonText) && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 bg-black bg-opacity-20">
                          {formData.heading && (
                            <h3 className="text-lg font-bold mb-2" style={{ color: formData.textColor }}>
                              {formData.heading}
                            </h3>
                          )}
                          {formData.subheading && (
                            <p className="text-sm mb-3" style={{ color: formData.textColor }}>
                              {formData.subheading}
                            </p>
                          )}
                          {formData.buttonText && (
                            <button 
                              className="px-4 py-2 bg-white text-gray-800 rounded-lg text-sm font-medium"
                              style={{ backgroundColor: formData.textColor, color: formData.backgroundColor }}
                            >
                              {formData.buttonText}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.order}
                  onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="flex items-center pt-6">
                <input
                  type="checkbox"
                  id="slideActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label htmlFor="slideActive" className="ml-2 text-sm text-gray-700">Active</label>
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700"
              >
                {editingCarouselSlide ? 'Update' : 'Add'} Slide
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCarouselModal(false);
                  setEditingCarouselSlide(null);
                  setImagePreview('');
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Shield className="w-8 h-8 text-purple-600 mr-3" />
              <h1 className="text-xl font-bold text-gray-900">Trade2Help Admin</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {admin?.username}</span>
              <button
                onClick={handleLogout}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <LogOut className="w-4 h-4 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Package className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Items</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalItems.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Sales</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalSales.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-pink-100 rounded-lg">
                <Heart className="w-6 h-6 text-pink-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Donations</p>
                <p className="text-2xl font-bold text-gray-900">${(stats.totalDonations / 1000000).toFixed(1)}M</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <FileText className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Items</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingApprovals}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: TrendingUp },
                { id: 'carousel', label: 'Carousel Management', icon: Monitor },
                { id: 'pending', label: `Pending Items (${stats.pendingApprovals})`, icon: FileText },
                { id: 'categories', label: 'Categories', icon: Tag },
                { id: 'charities', label: 'Charities', icon: Building2 },
                { id: 'settings', label: 'Settings', icon: Settings }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === tab.id
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <tab.icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Recent Activity</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">New users today</span>
                        <span className="font-medium">47</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Items listed today</span>
                        <span className="font-medium">23</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Sales today</span>
                        <span className="font-medium">15</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Donations today</span>
                        <span className="font-medium">$1,247</span>
                      </div>
                    </div>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Top Categories</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Electronics</span>
                        <span className="font-medium">2,450 items</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Clothing</span>
                        <span className="font-medium">1,890 items</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Furniture</span>
                        <span className="font-medium">1,650 items</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Books</span>
                        <span className="font-medium">950 items</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Carousel Management Tab */}
            {activeTab === 'carousel' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Carousel Management</h3>
                  <button
                    onClick={() => setShowCarouselModal(true)}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Slide
                  </button>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <h4 className="font-semibold text-blue-900 mb-2">🎨 Carousel Advertisement Controls</h4>
                  <p className="text-blue-700 text-sm mb-3">
                    Manage the slides that appear in the homepage carousel. You can upload custom images, reorder slides, toggle their visibility, 
                    and edit their content. Changes will be reflected immediately on the homepage.
                  </p>
                  <ul className="text-blue-700 text-sm space-y-1">
                    <li>• Upload custom advertisement images with proper aspect ratio preservation</li>
                    <li>• Add custom text overlays, buttons, and call-to-action links</li>
                    <li>• Customize colors and styling for each slide</li>
                    <li>• Reorder slides by priority and toggle active status</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  {carouselSlides
                    .sort((a, b) => a.order - b.order)
                    .map((slide, index) => (
                    <div key={slide.id} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex flex-col space-y-1">
                            <button
                              onClick={() => handleMoveSlide(index, 'up')}
                              disabled={index === 0}
                              className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                              title="Move up"
                            >
                              <ArrowUp className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleMoveSlide(index, 'down')}
                              disabled={index === carouselSlides.length - 1}
                              className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                              title="Move down"
                            >
                              <ArrowDown className="w-4 h-4" />
                            </button>
                          </div>
                          
                          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                            <span className="text-sm font-semibold text-purple-600">{slide.order}</span>
                          </div>
                          
                          {/* Preview thumbnail for custom slides */}
                          {slide.type === 'custom' && slide.content?.customImage && (
                            <div className="w-16 h-12 border border-gray-200 rounded overflow-hidden">
                              <img
                                src={slide.content.customImage}
                                alt="Slide preview"
                                className="w-full h-full object-contain bg-gray-50"
                              />
                            </div>
                          )}
                          
                          <div>
                            <h4 className="font-semibold text-gray-900">{slide.title}</h4>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <span className="capitalize">{slide.type.replace('-', ' ')}</span>
                              {slide.type === 'custom' && slide.content?.heading && (
                                <span className="text-purple-600">• {slide.content.heading}</span>
                              )}
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                slide.isActive 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {slide.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleToggleSlide(slide.id, slide.isActive)}
                            className={`p-2 rounded-lg ${
                              slide.isActive 
                                ? 'text-green-600 hover:bg-green-100' 
                                : 'text-gray-400 hover:bg-gray-100'
                            }`}
                            title={slide.isActive ? 'Deactivate' : 'Activate'}
                          >
                            {slide.isActive ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                          </button>
                          <button
                            onClick={() => {
                              setEditingCarouselSlide(slide);
                              setShowCarouselModal(true);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteCarouselSlide(slide.id)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pending Items Tab */}
            {activeTab === 'pending' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Pending Item Approvals</h3>
                  <div className="relative">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Search items..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  {pendingItems.filter(item => item.status === 'pending').map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                      <img
                        src={item.images[0]}
                        alt={item.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{item.title}</h4>
                        <p className="text-sm text-gray-600">by {item.seller}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                          <span>${item.price}</span>
                          <span>{item.category}</span>
                          <span>{item.condition}</span>
                          <span>{item.donationPercent}% to {item.charity}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => approveItem(item.id)}
                          className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200"
                          title="Approve"
                        >
                          <Check className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => rejectItem(item.id)}
                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                          title="Reject"
                        >
                          <X className="w-5 h-5" />
                        </button>
                        <button className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200" title="View Details">
                          <Eye className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Categories Tab */}
            {activeTab === 'categories' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Manage Categories</h3>
                  <button
                    onClick={() => setShowCategoryModal(true)}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Category
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.map((category) => (
                    <div key={category.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-2">
                            <span className="text-xs font-semibold text-purple-600">{category.icon}</span>
                          </div>
                          <h4 className="font-semibold text-gray-900">{category.name}</h4>
                        </div>
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => {
                              setEditingCategory(category);
                              setShowCategoryModal(true);
                            }}
                            className="p-1 text-gray-400 hover:text-blue-600"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteCategory(category.id)}
                            className="p-1 text-gray-400 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{category.description}</p>
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                        category.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {category.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Charities Tab */}
            {activeTab === 'charities' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Manage Charities</h3>
                  <button
                    onClick={() => setShowCharityModal(true)}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Charity
                  </button>
                </div>
                <div className="space-y-4">
                  {charities.map((charity) => (
                    <div key={charity.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <h4 className="font-semibold text-gray-900 mr-2">{charity.name}</h4>
                            <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                              charity.isActive 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {charity.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{charity.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>Category: {charity.category}</span>
                            <span>Total Received: ${charity.totalReceived.toLocaleString()}</span>
                            <a 
                              href={charity.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-purple-600 hover:text-purple-700"
                            >
                              Visit Website
                            </a>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => {
                              setEditingCharity(charity);
                              setShowCharityModal(true);
                            }}
                            className="p-1 text-gray-400 hover:text-blue-600"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteCharity(charity.id)}
                            className="p-1 text-gray-400 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab ===   'settings' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Settings</h3>
                <div className="space-y-6">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">General Settings</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Platform Name</label>
                        <input
                          type="text"
                          defaultValue="Trade2Help"
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Support Email</label>
                        <input
                          type="email"
                          defaultValue="support@trade2help.com"
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Images per Listing</label>
                        <input
                          type="number"
                          defaultValue="15"
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Donation Settings</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Donation Percentage</label>
                        <input
                          type="number"
                          defaultValue="1"
                          min="1"
                          max="50"
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Donation Percentage</label>
                        <input
                          type="number"
                          defaultValue="50"
                          min="1"
                          max="100"
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>
                  </div>

                  <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700">
                    Save Settings
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showCategoryModal && <CategoryModal />}
      {showCharityModal && <CharityModal />}
      {showCarouselModal && <CarouselModal />}
    </div>
  );
};

export default AdminDashboard;