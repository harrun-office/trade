import React, { useState } from 'react';
import { ArrowLeft, TrendingUp, DollarSign, Package, Heart, Calendar, BarChart3, PieChart, Users, Target, ArrowUp, ArrowDown, Eye, ShoppingCart, Percent } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCurrency } from '../contexts/CurrencyContext';
import Dropdown from '../components/Dropdown';

const SellerAnalytics: React.FC = () => {
  const { user, userListings } = useAuth();
  const { formatPrice } = useCurrency();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedYear, setSelectedYear] = useState('2025');

  const periodOptions = [
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' }
  ];

  const yearOptions = [
    { value: '2025', label: '2025' },
    { value: '2024', label: '2024' },
    { value: '2023', label: '2023' }
  ];

  // Mock analytics data based on user listings
  const totalRevenue = userListings.reduce((sum, listing) => sum + listing.price * 0.3, 0) + 2450; // 30% assumed sold + base
  const totalDonated = userListings.reduce((sum, listing) => sum + (listing.price * listing.donationPercent / 100 * 0.3), 0) + 245;
  const totalViews = userListings.length * 150 + 1200; // Base views per listing
  const conversionRate = 12.5; // Percentage

  const monthlyData = [
    { month: 'Jan', sales: 8, revenue: 1200, donations: 120, views: 450 },
    { month: 'Feb', sales: 12, revenue: 1800, donations: 180, views: 520 },
    { month: 'Mar', sales: 15, revenue: 2200, donations: 220, views: 680 },
    { month: 'Apr', sales: 18, revenue: 2800, donations: 280, views: 750 },
    { month: 'May', sales: 22, revenue: 3200, donations: 320, views: 890 },
    { month: 'Jun', sales: 25, revenue: 3600, donations: 360, views: 950 },
    { month: 'Jul', sales: 28, revenue: 4100, donations: 410, views: 1100 },
    { month: 'Aug', sales: 32, revenue: 4500, donations: 450, views: 1200 },
    { month: 'Sep', sales: 35, revenue: 4900, donations: 490, views: 1350 },
    { month: 'Oct', sales: 38, revenue: 5200, donations: 520, views: 1450 },
    { month: 'Nov', sales: 42, revenue: 5800, donations: 580, views: 1600 },
    { month: 'Dec', sales: 45, revenue: 6200, donations: 620, views: 1750 }
  ];

  const topPerformingListings = userListings.slice(0, 5).map((listing, index) => ({
    ...listing,
    views: 150 - (index * 20),
    sales: 8 - (index * 1),
    revenue: listing.price * (8 - index),
    conversionRate: (8 - index) / (150 - (index * 20)) * 100
  }));

  const categoryPerformance = [
    { category: 'Electronics', sales: 45, revenue: 12500, percentage: 35.2 },
    { category: 'Furniture', sales: 28, revenue: 8900, percentage: 25.1 },
    { category: 'Clothing', sales: 32, revenue: 6800, percentage: 19.2 },
    { category: 'Books', sales: 18, revenue: 3200, percentage: 9.0 },
    { category: 'Sports', sales: 15, revenue: 2800, percentage: 7.9 },
    { category: 'Other', sales: 12, revenue: 1200, percentage: 3.4 }
  ];

  const charityImpact = [
    { charity: 'Education for All', amount: 285, percentage: 32.1 },
    { charity: 'Tech for Kids', amount: 198, percentage: 22.3 },
    { charity: 'Habitat for Humanity', amount: 156, percentage: 17.6 },
    { charity: 'Arts Education', amount: 134, percentage: 15.1 },
    { charity: 'Warmth for All', amount: 98, percentage: 11.0 },
    { charity: 'Other', amount: 18, percentage: 2.0 }
  ];

  const recentActivity = [
    { date: '2025-01-10', action: 'Sale', item: 'MacBook Pro 2023', amount: 1899, charity: 'Education for All', donation: 189.90 },
    { date: '2025-01-09', action: 'View', item: 'Gaming Setup', views: 25 },
    { date: '2025-01-09', action: 'Sale', item: 'Camera Kit', amount: 650, charity: 'Arts Education', donation: 78.00 },
    { date: '2025-01-08', action: 'Listed', item: 'Vintage Guitar', amount: 800 },
    { date: '2025-01-08', action: 'View', item: 'Designer Coat', views: 18 }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 dark:bg-gray-900 min-h-screen transition-colors">
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/dashboard"
          className="inline-flex items-center text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Seller Analytics</h1>
        <p className="text-gray-600 dark:text-gray-400">Track your sales performance and charitable impact</p>
      </div>

      {/* Period Selector */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-8 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="w-48">
            <Dropdown
              options={periodOptions}
              value={selectedPeriod}
              onChange={setSelectedPeriod}
              label="Period:"
            />
          </div>
          <div className="w-32">
            <Dropdown
              options={yearOptions}
              value={selectedYear}
              onChange={setSelectedYear}
              label="Year:"
            />
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-purple-600 text-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-8 h-8" />
            <div className="flex items-center text-purple-200">
              <ArrowUp className="w-4 h-4 mr-1" />
              <span className="text-sm">+18.5%</span>
            </div>
          </div>
          <div className="text-3xl font-bold mb-1">{formatPrice(totalRevenue)}</div>
          <div className="text-purple-200 text-sm">Total Revenue</div>
        </div>

        <div className="bg-green-600 text-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <Heart className="w-8 h-8" />
            <div className="flex items-center text-green-200">
              <ArrowUp className="w-4 h-4 mr-1" />
              <span className="text-sm">+22.3%</span>
            </div>
          </div>
          <div className="text-3xl font-bold mb-1">{formatPrice(totalDonated)}</div>
          <div className="text-green-200 text-sm">Total Donated</div>
        </div>

        <div className="bg-gray-600 text-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <Eye className="w-8 h-8" />
            <div className="flex items-center text-gray-200">
              <ArrowUp className="w-4 h-4 mr-1" />
              <span className="text-sm">+12.1%</span>
            </div>
          </div>
          <div className="text-3xl font-bold mb-1">{totalViews.toLocaleString()}</div>
          <div className="text-gray-200 text-sm">Total Views</div>
        </div>

        <div className="bg-gray-700 text-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <Percent className="w-8 h-8" />
            <div className="flex items-center text-gray-200">
              <ArrowUp className="w-4 h-4 mr-1" />
              <span className="text-sm">+3.2%</span>
            </div>
          </div>
          <div className="text-3xl font-bold mb-1">{conversionRate}%</div>
          <div className="text-gray-200 text-sm">Conversion Rate</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Monthly Performance Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Monthly Performance</h2>
          <div className="space-y-4">
            {monthlyData.slice(-6).map((month, index) => (
              <div key={month.month} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-8">{month.month}</span>
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3 w-48">
                    <div 
                      className="bg-purple-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${(month.revenue / 6500) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="flex items-center space-x-6 text-sm">
                  <div className="text-center">
                    <div className="font-semibold text-gray-900 dark:text-white">{month.sales}</div>
                    <div className="text-gray-500 dark:text-gray-400">Sales</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-gray-900 dark:text-white">{formatPrice(month.revenue)}</div>
                    <div className="text-gray-500 dark:text-gray-400">Revenue</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-green-600 dark:text-green-400">{formatPrice(month.donations)}</div>
                    <div className="text-gray-500 dark:text-gray-400">Donated</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Performance */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Sales by Category</h2>
          <div className="space-y-4">
            {categoryPerformance.map((category, index) => (
              <div key={category.category}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{category.category}</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">{category.percentage}%</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${category.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">{formatPrice(category.revenue)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Top Performing Listings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Top Performing Listings</h2>
          <div className="space-y-4">
            {topPerformingListings.map((listing, index) => (
              <div key={listing.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <img
                  src={listing.images[0]}
                  alt={listing.title}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{listing.title}</h3>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-gray-500 dark:text-gray-400">Views</div>
                      <div className="font-semibold text-gray-900 dark:text-white">{listing.views}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 dark:text-gray-400">Sales</div>
                      <div className="font-semibold text-gray-900 dark:text-white">{listing.sales}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 dark:text-gray-400">Conv. Rate</div>
                      <div className="font-semibold text-green-600 dark:text-green-400">{listing.conversionRate.toFixed(1)}%</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Charity Impact */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Charity Impact Breakdown</h2>
          <div className="space-y-4">
            {charityImpact.map((charity, index) => (
              <div key={charity.charity} className="flex items-center space-x-4 p-3 rounded-lg">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{charity.charity}</h3>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">{formatPrice(charity.amount)}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${charity.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-600 dark:text-gray-400">{charity.percentage}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Recent Activity</h2>
        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <div key={index} className="flex items-center space-x-4 p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                activity.action === 'Sale' ? 'bg-green-100 dark:bg-green-900' :
                activity.action === 'View' ? 'bg-blue-100 dark:bg-blue-900' :
                'bg-purple-100 dark:bg-purple-900'
              }`}>
                {activity.action === 'Sale' ? (
                  <DollarSign className={`w-5 h-5 ${
                    activity.action === 'Sale' ? 'text-green-600 dark:text-green-400' : ''
                  }`} />
                ) : activity.action === 'View' ? (
                  <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                ) : (
                  <Package className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{activity.action}: {activity.item}</h3>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{activity.date}</span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {activity.action === 'Sale' && (
                    <div>
                      Revenue: {formatPrice(activity.amount)} • Donated: {formatPrice(activity.donation)} to {activity.charity}
                    </div>
                  )}
                  {activity.action === 'View' && (
                    <div>{activity.views} new views</div>
                  )}
                  {activity.action === 'Listed' && (
                    <div>Listed for {formatPrice(activity.amount)}</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SellerAnalytics;