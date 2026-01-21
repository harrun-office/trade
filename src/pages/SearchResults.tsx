import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Filter, Grid, List, Heart, Star, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCurrency } from '../contexts/CurrencyContext';
import Dropdown from '../components/Dropdown';

const SearchResults: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || 'all';
  const { allProducts, addToWishlist, removeFromWishlist, isInWishlist, isAuthenticated } = useAuth();
  const { formatPrice } = useCurrency();
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('recent');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const conditions = ['New', 'Like New', 'Excellent', 'Good', 'Fair'];

  const sortOptions = [
    { value: 'recent', label: 'Most Recent' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' }
  ];

  const handleConditionChange = (condition: string) => {
    setSelectedConditions(prev =>
      prev.includes(condition)
        ? prev.filter(c => c !== condition)
        : [...prev, condition]
    );
  };

  const clearFilters = () => {
    setPriceRange({ min: '', max: '' });
    setSelectedConditions([]);
  };

  // Calculate real category counts from all products (only active ones)
  const categoryCounts = allProducts
    .filter(product => product.status === 'active')
    .reduce((acc, product) => {
      const cat = product.category.toLowerCase();
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  // Function to format count for display
  const formatCount = (count: number): string => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K+`;
    }
    return `${count}+`;
  };

  // Calculate realistic base numbers for categories
  const getDisplayCount = (categoryKey: string): string => {
    const baseCount = categoryCounts[categoryKey] || 0;
    
    // Add realistic base numbers to make counts look more substantial
    const baseCounts: Record<string, number> = {
      'electronics': 2500,
      'vehicles': 850,
      'furniture': 1200,
      'clothing': 3800,
      'books': 950,
      'sports': 720,
      'home-&-garden': 1100,
      'toys-&-games': 680,
      'art-&-crafts': 420,
      'musical-instruments': 350,
      'health-&-beauty': 580,
      'pet-supplies': 490
    };
    
    const totalCount = (baseCounts[categoryKey] || 0) + baseCount;
    return formatCount(totalCount);
  };

  // Filter and sort products - only show active products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = allProducts.filter(product => product.status === 'active');

    // Filter by search query
    if (query) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(query.toLowerCase()) ||
        product.seller.toLowerCase().includes(query.toLowerCase()) ||
        product.charity.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Filter by category
    if (category && category !== 'all' && category !== 'all-categories') {
      filtered = filtered.filter(product =>
        product.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Filter by price range
    if (priceRange.min) {
      filtered = filtered.filter(product => product.price >= parseFloat(priceRange.min));
    }
    if (priceRange.max) {
      filtered = filtered.filter(product => product.price <= parseFloat(priceRange.max));
    }

    // Filter by condition
    if (selectedConditions.length > 0) {
      filtered = filtered.filter(product =>
        selectedConditions.includes(product.condition)
      );
    }

    // Sort products
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'recent':
        default:
          return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
      }
    });

    return sorted;
  }, [allProducts, query, category, priceRange, selectedConditions, sortBy]);

  const handleToggleWishlist = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      alert('Please log in to add items to your wishlist');
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 dark:bg-gray-900 min-h-screen transition-colors">
      {/* Search Header - Compact */}
      <div className="mb-4">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          {query ? `Search results for "${query}"` : 'Browse Products'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm">{filteredAndSortedProducts.length} items found</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
            {(selectedConditions.length > 0 || priceRange.min || priceRange.max) && (
              <span className="ml-2 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs px-2 py-1 rounded-full">
                {selectedConditions.length + (priceRange.min ? 1 : 0) + (priceRange.max ? 1 : 0)}
              </span>
            )}
          </button>
        </div>

        {/* Filters Sidebar - Compact */}
        <div className={`lg:w-56 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 sticky top-4 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <Filter className="w-4 h-4 text-gray-600 dark:text-gray-400 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h2>
              </div>
              <button
                onClick={() => setShowFilters(false)}
                className="lg:hidden text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Price Range */}
            <div className="mb-4">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2 text-sm">Price Range</h3>
              <div className="space-y-2">
                <input
                  type="number"
                  placeholder="Min price"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <input
                  type="number"
                  placeholder="Max price"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Condition */}
            <div className="mb-4">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2 text-sm">Condition</h3>
              <div className="space-y-1.5">
                {conditions.map(condition => (
                  <label key={condition} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedConditions.includes(condition)}
                      onChange={() => handleConditionChange(condition)}
                      className="h-3 w-3 text-purple-600 focus:ring-purple-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{condition}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Category Counts */}
            <div className="mb-4">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2 text-sm">Categories</h3>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Electronics</span>
                  <span>{categoryCounts.electronics || 0}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Furniture</span>
                  <span>{categoryCounts.furniture || 0}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Clothing</span>
                  <span>{categoryCounts.clothing || 0}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Sports</span>
                  <span>{categoryCounts.sports || 0}</span>
                </div>
              </div>
            </div>

            {/* Clear Filters */}
            <button 
              onClick={clearFilters}
              className="w-full text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 text-sm font-medium"
            >
              Clear all filters
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="flex-1">
          {/* Sort and View Controls - Compact */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-40">
                <Dropdown
                  options={sortOptions}
                  value={sortBy}
                  onChange={setSortBy}
                  placeholder="Sort by"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Products Grid/List - Fixed to 5 columns with filters */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {filteredAndSortedProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:shadow-lg transition-all group relative"
                >
                  <div className="absolute top-2 right-2 z-10">
                    <button
                      onClick={(e) => handleToggleWishlist(e, product)}
                      className={`w-8 h-8 flex items-center justify-center rounded-full ${
                        isInWishlist(product.id.toString())
                          ? "bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400"
                          : "bg-white/80 dark:bg-gray-800/80 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isInWishlist(product.id.toString()) ? "fill-current" : ""}`} />
                    </button>
                  </div>
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2 text-sm leading-tight">
                      {product.title}
                    </h3>
                    <div className="flex items-center justify-between mb-1">
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
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      <div className="truncate">to {product.charity}</div>
                      <div className="flex items-center justify-between">
                        <span className="truncate">by {product.seller}</span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {product.condition} • {product.location}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredAndSortedProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 hover:shadow-lg transition-all group flex items-center space-x-3 relative"
                >
                  <div className="absolute top-2 right-2 z-10">
                    <button
                      onClick={(e) => handleToggleWishlist(e, product)}
                      className={`w-8 h-8 flex items-center justify-center rounded-full ${
                        isInWishlist(product.id.toString())
                          ? "bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400"
                          : "bg-white/80 dark:bg-gray-800/80 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isInWishlist(product.id.toString()) ? "fill-current" : ""}`} />
                    </button>
                  </div>
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
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center space-x-4">
                        <span>by {product.seller}</span>
                        <span>{product.condition}</span>
                      </div>
                      <span>{product.location}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* No Results */}
          {filteredAndSortedProducts.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No items found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Try adjusting your search terms or browse our categories
              </p>
              <Link
                to="/"
                className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
              >
                Browse Categories
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;