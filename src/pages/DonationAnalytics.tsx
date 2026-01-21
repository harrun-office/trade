import React, { useState } from 'react';
import { TrendingUp, Heart, Calendar, Award, BarChart3, PieChart, Users, DollarSign, Target, ArrowUp, ArrowDown } from 'lucide-react';
import Dropdown from '../components/Dropdown';
import { useCurrency } from '../contexts/CurrencyContext';

const DonationAnalytics: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedYear, setSelectedYear] = useState('2025');
  const { formatPrice } = useCurrency();

  // Mock data for analytics
  const totalDonated = 2450000;
  const monthlyDonations = 125000;
  const weeklyDonations = 28500;
  const dailyAverage = 4071;

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

  const monthlyData = [
    { month: 'Jan', amount: 98000, growth: 12.5 },
    { month: 'Feb', amount: 105000, growth: 7.1 },
    { month: 'Mar', amount: 118000, growth: 12.4 },
    { month: 'Apr', amount: 132000, growth: 11.9 },
    { month: 'May', amount: 145000, growth: 9.8 },
    { month: 'Jun', amount: 158000, growth: 9.0 },
    { month: 'Jul', amount: 172000, growth: 8.9 },
    { month: 'Aug', amount: 185000, growth: 7.6 },
    { month: 'Sep', amount: 198000, growth: 7.0 },
    { month: 'Oct', amount: 212000, growth: 7.1 },
    { month: 'Nov', amount: 225000, growth: 6.1 },
    { month: 'Dec', amount: 238000, growth: 5.8 }
  ];

  const charityRankings = [
    { 
      rank: 1, 
      name: 'Education for All', 
      amount: 285000, 
      percentage: 23.2, 
      growth: 15.3,
      beneficiaries: 15000,
      category: 'Education'
    },
    { 
      rank: 2, 
      name: 'Habitat for Humanity', 
      amount: 245000, 
      percentage: 19.9, 
      growth: 12.1,
      beneficiaries: 8500,
      category: 'Housing'
    },
    { 
      rank: 3, 
      name: 'Warmth for All', 
      amount: 198000, 
      percentage: 16.1, 
      growth: 18.7,
      beneficiaries: 12000,
      category: 'Social Services'
    },
    { 
      rank: 4, 
      name: 'Tech for Kids', 
      amount: 156000, 
      percentage: 12.7, 
      growth: 22.4,
      beneficiaries: 9200,
      category: 'Education'
    },
    { 
      rank: 5, 
      name: 'Arts Education', 
      amount: 134000, 
      percentage: 10.9, 
      growth: 8.9,
      beneficiaries: 6500,
      category: 'Education'
    },
    { 
      rank: 6, 
      name: 'Ocean Conservation', 
      amount: 98000, 
      percentage: 8.0, 
      growth: 14.2,
      beneficiaries: 25000,
      category: 'Environment'
    },
    { 
      rank: 7, 
      name: 'Animal Rescue Network', 
      amount: 76000, 
      percentage: 6.2, 
      growth: 6.8,
      beneficiaries: 5500,
      category: 'Animal Welfare'
    },
    { 
      rank: 8, 
      name: 'Clean Water Initiative', 
      amount: 58000, 
      percentage: 4.7, 
      growth: 11.3,
      beneficiaries: 18500,
      category: 'Health'
    }
  ];

  const categoryBreakdown = [
    { category: 'Education', amount: 575000, percentage: 46.8 },
    { category: 'Housing', amount: 245000, percentage: 19.9 },
    { category: 'Social Services', amount: 198000, percentage: 16.1 },
    { category: 'Environment', amount: 98000, percentage: 8.0 },
    { category: 'Animal Welfare', amount: 76000, percentage: 6.2 },
    { category: 'Health', amount: 58000, percentage: 4.7 }
  ];

  const impactMetrics = [
    { label: 'Lives Impacted', value: '100K+', icon: Users, color: 'text-indigo-600' },
    { label: 'Schools Built', value: '45', icon: Target, color: 'text-emerald-600' },
    { label: 'Homes Provided', value: '120', icon: Heart, color: 'text-amber-600' },
    { label: 'Trees Planted', value: '25K+', icon: TrendingUp, color: 'text-slate-600' }
  ];

  const recentDonations = [
    { date: '2025-01-10', amount: 189.90, charity: 'Education for All', product: 'MacBook Pro 2023', seller: 'TechDeals' },
    { date: '2025-01-10', amount: 156.80, charity: 'Tech for Kids', product: 'Gaming Setup', seller: 'GamerHub' },
    { date: '2025-01-09', amount: 67.50, charity: 'Habitat for Humanity', product: 'Vintage Sofa', seller: 'FurnitureLovers' },
    { date: '2025-01-09', amount: 78.00, charity: 'Arts Education', product: 'Camera Kit', seller: 'PhotoPro' },
    { date: '2025-01-08', amount: 24.00, charity: 'Warmth for All', product: 'Winter Coat', seller: 'FashionForward' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-6 dark:bg-slate-900 min-h-screen transition-colors bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">Donation Analytics</h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base">Detailed breakdown of charitable impact through Trade2Help</p>
      </div>

      {/* Period Selector */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200/60 dark:border-slate-700/60 p-4 mb-6 transition-colors">
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

      {/* Key Metrics - Using Website Theme Colors */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-indigo-900 via-slate-800 to-slate-900 text-white p-6 rounded-2xl shadow-lg border border-indigo-700/30">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-8 h-8" />
            <div className="flex items-center text-indigo-200">
              <ArrowUp className="w-4 h-4 mr-1" />
              <span className="text-sm">+12.5%</span>
            </div>
          </div>
          <div className="text-2xl font-bold mb-1">{formatPrice(totalDonated)}</div>
          <div className="text-indigo-200 text-sm">Total Donated</div>
        </div>

        <div className="bg-gradient-to-br from-emerald-900 via-slate-800 to-slate-900 text-white p-6 rounded-2xl shadow-lg border border-emerald-700/30">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="w-8 h-8" />
            <div className="flex items-center text-emerald-200">
              <ArrowUp className="w-4 h-4 mr-1" />
              <span className="text-sm">+8.3%</span>
            </div>
          </div>
          <div className="text-2xl font-bold mb-1">{formatPrice(monthlyDonations)}</div>
          <div className="text-emerald-200 text-sm">This Month</div>
        </div>

        <div className="bg-gradient-to-br from-amber-900 via-slate-800 to-slate-900 text-white p-6 rounded-2xl shadow-lg border border-amber-700/30">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8" />
            <div className="flex items-center text-amber-200">
              <ArrowUp className="w-4 h-4 mr-1" />
              <span className="text-sm">+15.2%</span>
            </div>
          </div>
          <div className="text-2xl font-bold mb-1">{formatPrice(weeklyDonations)}</div>
          <div className="text-amber-200 text-sm">This Week</div>
        </div>

        <div className="bg-slate-800 text-white p-6 rounded-2xl shadow-lg border border-slate-700/60">
          <div className="flex items-center justify-between mb-2">
            <BarChart3 className="w-8 h-8" />
            <div className="flex items-center text-slate-200">
              <ArrowUp className="w-4 h-4 mr-1" />
              <span className="text-sm">+6.7%</span>
            </div>
          </div>
          <div className="text-2xl font-bold mb-1">{formatPrice(dailyAverage)}</div>
          <div className="text-slate-200 text-sm">Daily Average</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Monthly Trend Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200/60 dark:border-slate-700/60 p-5 transition-colors">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Monthly Donation Trends</h2>
          <div className="space-y-3">
            {monthlyData.slice(-6).map((month, index) => (
              <div key={month.month} className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400 w-10">{month.month}</span>
                  <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(month.amount / 250000) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 ml-4">
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">{formatPrice(month.amount)}</span>
                  <div className={`flex items-center text-xs ${month.growth > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                    {month.growth > 0 ? <ArrowUp className="w-3 h-3 mr-1" /> : <ArrowDown className="w-3 h-3 mr-1" />}
                    {Math.abs(month.growth)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200/60 dark:border-slate-700/60 p-5 transition-colors">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Donations by Category</h2>
          <div className="space-y-4">
            {categoryBreakdown.map((category, index) => (
              <div key={category.category}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{category.category}</span>
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">{category.percentage}%</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${category.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-slate-600 dark:text-slate-400">{formatPrice(category.amount)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Impact Metrics */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200/60 dark:border-slate-700/60 p-5 mb-6 transition-colors">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-6">Real-World Impact</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {impactMetrics.map((metric, index) => {
            const IconComponent = metric.icon;
            return (
              <div key={index} className="text-center">
                <div className={`w-12 h-12 ${metric.color.replace('text-', 'bg-').replace('-600', '-100')} dark:${metric.color.replace('text-', 'bg-').replace('-600', '-900')} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                  <IconComponent className={`w-6 h-6 ${metric.color} dark:${metric.color.replace('-600', '-400')}`} />
                </div>
                <div className="text-lg font-bold text-slate-900 dark:text-white mb-1">{metric.value}</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">{metric.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Charity Rankings */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200/60 dark:border-slate-700/60 p-5 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Top Charities This Month</h2>
            <Award className="w-6 h-6 text-amber-500" />
          </div>
          <div className="space-y-3">
            {charityRankings.slice(0, 6).map((charity) => (
              <div key={charity.rank} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-white text-xs ${
                  charity.rank === 1 ? 'bg-amber-500' :
                  charity.rank === 2 ? 'bg-slate-400' :
                  charity.rank === 3 ? 'bg-amber-600' : 'bg-slate-300'
                }`}>
                  {charity.rank}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-900 dark:text-white text-sm truncate">{charity.name}</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white ml-2">{formatPrice(charity.amount)}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 mt-1">
                    <span className="truncate">{charity.category}</span>
                    <div className="flex items-center text-emerald-600 dark:text-emerald-400 ml-2">
                      <ArrowUp className="w-3 h-3 mr-1" />
                      {charity.growth}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Donations */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200/60 dark:border-slate-700/60 p-5 transition-colors">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Recent Donations</h2>
          <div className="space-y-3">
            {recentDonations.slice(0, 4).map((donation, index) => (
              <div key={index} className="flex items-center space-x-3 p-2 border border-slate-200 dark:border-slate-600 rounded-lg">
                <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center">
                  <Heart className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-900 dark:text-white text-sm">{formatPrice(donation.amount)}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{donation.date}</span>
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    <span className="truncate">to {donation.charity} • {donation.product}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationAnalytics;