import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Package, TrendingUp, AlertCircle, Eye, Check, X, Ban } from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';
import { useAuth } from '../contexts/AuthContext';

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const { pendingItems, approveItem, rejectItem, isAuthenticated } = useAdmin();
  const { allProducts } = useAuth();
  const navigate = useNavigate();

  // Redirect if not authenticated as admin
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, navigate]);

  const stats = {
    totalUsers: 15420,
    totalAds: allProducts.length,
    totalSales: 6780,
    totalRevenue: 2450000,
    pendingAds: pendingItems.filter(item => item.status === 'pending').length,
    websiteVisitors: 45230
  };

  const handleApproveAd = (id: string) => {
    approveItem(id);
  };

  const handleRejectAd = (id: string) => {
    rejectItem(id);
  };

  const handleSuspendUser = (username: string) => {
    console.log('Suspended user:', username);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage Trade2Help platform</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
              <p className="text-sm font-medium text-gray-600">Total Ads</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalAds.toLocaleString()}</p>
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
            <div className="p-2 bg-orange-100 rounded-lg">
              <AlertCircle className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Ads</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingAds}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Statistics</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Revenue</span>
              <span className="font-semibold text-gray-900">${stats.totalRevenue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">This Month</span>
              <span className="font-semibold text-green-600">$125,000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Last Month</span>
              <span className="font-semibold text-gray-900">$98,500</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Website Traffic</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Visitors</span>
              <span className="font-semibold text-gray-900">{stats.websiteVisitors.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Today</span>
              <span className="font-semibold text-blue-600">1,250</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Yesterday</span>
              <span className="font-semibold text-gray-900">1,180</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('pending')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'pending'
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Pending Ads ({pendingItems.filter(item => item.status === 'pending').length})
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'users'
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              User Management
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'reports'
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Reports
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'pending' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Pending Ad Approvals
              </h3>
              <div className="space-y-4">
                {pendingItems.filter(item => item.status === 'pending').map((ad) => (
                  <div key={ad.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                    <img
                      src={ad.images[0]}
                      alt={ad.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{ad.title}</h4>
                      <p className="text-sm text-gray-600">by {ad.seller}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                        <span>${ad.price}</span>
                        <span>{ad.category}</span>
                        <span>Submitted: {new Date(ad.submittedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleApproveAd(ad.id)}
                        className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200"
                        title="Approve"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleRejectAd(ad.id)}
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

                {pendingItems.filter(item => item.status === 'pending').length === 0 && (
                  <div className="text-center py-8">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No pending ads</h3>
                    <p className="text-gray-600">All ads have been reviewed</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                User Management
              </h3>
              <div className="space-y-4">
                {['TechDeals', 'FurnitureLovers', 'GamerHub', 'FashionForward'].map((username) => (
                  <div key={username} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-gray-900">{username}</h4>
                      <p className="text-sm text-gray-600">Active seller • 4.8 rating • 156 sales</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200" title="View Profile">
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleSuspendUser(username)}
                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                        title="Suspend User"
                      >
                        <Ban className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Platform Reports
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Category Performance</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Electronics</span>
                      <span className="font-medium">2,450 sales</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Furniture</span>
                      <span className="font-medium">1,890 sales</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Clothing</span>
                      <span className="font-medium">1,650 sales</span>
                    </div>
                  </div>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Charity Impact</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Donated</span>
                      <span className="font-medium">$245,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">This Month</span>
                      <span className="font-medium">$12,500</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Partner Charities</span>
                      <span className="font-medium">500+</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;