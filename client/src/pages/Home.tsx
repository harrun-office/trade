import React, { useState, useEffect, useMemo, memo } from 'react';
import { Link } from 'react-router-dom';

// Add custom animations
const styles = `
  @keyframes fade-in-up {
    from {
      opacity: 0;
      transform: translateY(1rem);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .animate-fade-in-up {
    animation: fade-in-up 0.6s ease-out forwards;
  }

  .animate-fade-in {
    animation: fade-in 0.8s ease-out forwards;
  }
`;

const StyleComponent = () => (
  <style dangerouslySetInnerHTML={{ __html: styles }} />
);
import { ArrowRight, ShoppingBag, Heart, Shield, TrendingUp, ChevronDown, ChevronUp, Truck, Smartphone, Car, Armchair, Shirt, BookOpen, Dumbbell, Home as HomeIcon, Gamepad2, Palette, Music, Sparkles, Package, ChevronLeft, ChevronRight, Star, Zap, Clock, Award, Tag, Percent, Gift } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { useAdmin } from '../contexts/AdminContext';

const HomePage: React.FC = () => {
  const { userListings, cart, isAuthenticated, allProducts } = useAuth();
  const { formatPrice } = useCurrency();
  const { carouselSlides } = useAdmin();
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [statsAnimated, setStatsAnimated] = useState(false);

  // DIAGNOSTIC: Log Home page renders
  console.log('[DIAGNOSTIC] HomePage RENDER - timestamp:', new Date().toISOString());
  console.log('[DIAGNOSTIC] HomePage RENDER - allProducts length:', allProducts.length);
  console.log('[DIAGNOSTIC] HomePage RENDER - allProducts reference:', allProducts);

  // Calculate real donation counter based on actual data
  const mockSalesData = [
    { price: 1899, donationPercent: 10 }, // MacBook
    { price: 450, donationPercent: 15 },  // Sofa
    { price: 120, donationPercent: 20 },  // Coat
    { price: 650, donationPercent: 12 },  // Camera
    { price: 1200, donationPercent: 8 },  // Gaming setup
    { price: 800, donationPercent: 18 },  // Guitar
    { price: 350, donationPercent: 12 },  // Table
    { price: 280, donationPercent: 15 }   // Handbag
  ];

  // Add user listings to donation calculation
  const userDonations = userListings.reduce((total, listing) => {
    return total + (listing.price * listing.donationPercent / 100);
  }, 0);

  const mockDonations = mockSalesData.reduce((total, sale) => {
    return total + (sale.price * sale.donationPercent / 100);
  }, 0);

  // Base amount plus calculated donations
  const totalDonated = 2450000 + mockDonations + userDonations;

  // Get active carousel slides from admin context
  const activeCarouselSlides = carouselSlides
    .filter(slide => slide.isActive)
    .sort((a, b) => a.order - b.order);

  // Keep current slide in bounds when slides change
  useEffect(() => {
    if (activeCarouselSlides.length === 0) {
      setCurrentSlide(0);
      return;
    }
    setCurrentSlide((prev) => Math.min(prev, activeCarouselSlides.length - 1));
  }, [activeCarouselSlides.length]);

  // Auto-advance carousel every 5 seconds
  useEffect(() => {
    if (activeCarouselSlides.length === 0) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeCarouselSlides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [activeCarouselSlides.length]);

  // Hero entrance animation
  useEffect(() => {
    const timer = setTimeout(() => setHeroLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Stats animation trigger
  useEffect(() => {
    const handleScroll = () => {
      const statsSection = document.querySelector('[data-stats]');
      if (statsSection) {
        const rect = statsSection.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.8) {
          setStatsAnimated(true);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const nextSlide = () => {
    if (activeCarouselSlides.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % activeCarouselSlides.length);
  };

  const prevSlide = () => {
    if (activeCarouselSlides.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + activeCarouselSlides.length) % activeCarouselSlides.length);
  };

  // Render carousel slide content based on type
  const renderSlideContent = (slide: any) => {
    switch (slide.type) {
      case 'donation-counter':
        return (
          <Link
            to="/donation-analytics"
            className="group block bg-gradient-to-br from-emerald-900/90 via-slate-800 to-slate-900 rounded-xl p-8 hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] cursor-pointer text-white h-full flex flex-col justify-center border border-emerald-700/30 relative overflow-hidden"
          >
            {/* Subtle background pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-50"></div>

            <div className="relative z-10 flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-emerald-500/20 backdrop-blur-md rounded-2xl flex items-center justify-center mr-4 border border-emerald-400/40 shadow-lg">
                <Heart className="w-8 h-8 text-emerald-400" />
              </div>
              <div>
                <span className="text-2xl font-bold text-white block">Live Impact</span>
                <span className="text-sm text-emerald-300 font-medium">Real-time donations</span>
              </div>
            </div>

            <div className="relative z-10 text-center space-y-4">
              <div className="text-5xl font-bold text-amber-400 mb-4 animate-pulse drop-shadow-lg">
                {formatPrice(Math.round(totalDonated))}
              </div>
              <p className="text-lg text-slate-200 font-medium">
                Total donated through Trade2Help
              </p>
              <div className="bg-slate-700/60 backdrop-blur-md rounded-xl p-4 border border-slate-600/50 shadow-inner">
                <p className="text-sm text-slate-300 font-medium">
                  📊 Click to see detailed analytics & impact stats
                </p>
              </div>
            </div>
          </Link>
        );
      
      case 'hot-deals':
        return (
          <Link
            to="/search?category=electronics"
            className="group block bg-gradient-to-br from-amber-900 to-slate-900 rounded-xl p-6 hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] cursor-pointer text-white h-full flex flex-col justify-between border border-amber-700/50 relative overflow-hidden"
          >
            {/* Animated background effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-slate-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="relative z-10 flex items-center justify-center mb-6">
              <div className="w-14 h-14 bg-amber-500/20 backdrop-blur-md rounded-2xl flex items-center justify-center mr-3 border border-amber-400/40 shadow-lg">
                <Zap className="w-7 h-7 text-amber-400" />
              </div>
              <div className="text-left">
                <span className="text-xl font-bold text-white block">Hot Electronics</span>
                <span className="text-sm text-amber-300 font-medium">Limited time deals</span>
              </div>
              <div className="ml-4 bg-amber-500 text-slate-900 px-3 py-1 rounded-full text-xs font-bold animate-bounce shadow-lg">
                SALE
              </div>
            </div>

            <div className="relative z-10 grid grid-cols-2 gap-4 mb-4">
              <div className="bg-slate-700/60 backdrop-blur-md rounded-xl p-4 text-center border border-slate-600/50 shadow-inner">
                <img
                  src="https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=200"
                  alt="MacBook"
                  className="w-full h-20 object-cover rounded-lg mb-3"
                />
                <div className="text-amber-400 font-bold text-lg">{formatPrice(1899)}</div>
                <div className="text-slate-300 text-sm font-medium">MacBook Pro</div>
              </div>
              <div className="bg-slate-700/60 backdrop-blur-md rounded-xl p-4 text-center border border-slate-600/50 shadow-inner">
                <img
                  src="https://images.pexels.com/photos/2047905/pexels-photo-2047905.jpeg?auto=compress&cs=tinysrgb&w=200"
                  alt="Gaming Setup"
                  className="w-full h-20 object-cover rounded-lg mb-3"
                />
                <div className="text-amber-400 font-bold text-lg">{formatPrice(1200)}</div>
                <div className="text-slate-300 text-sm font-medium">Gaming Setup</div>
              </div>
            </div>

            <div className="relative z-10 text-center bg-slate-700/60 backdrop-blur-md rounded-xl p-4 border border-slate-600/50 shadow-inner">
              <div className="text-xl font-bold text-amber-400 mb-2">Up to 70% OFF</div>
              <div className="flex items-center justify-center text-sm text-slate-300">
                <Clock className="w-4 h-4 mr-2" />
                Limited time offer!
              </div>
            </div>
          </Link>
        );
      
      case 'new-charity':
        return (
          <Link
            to="/charity/ocean-conservation"
            className="group block bg-gradient-to-br from-emerald-900 to-blue-900 rounded-xl p-6 hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] cursor-pointer text-white h-full flex flex-col justify-between border border-emerald-700/50 relative overflow-hidden"
          >
            {/* Ocean-like background effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-50"></div>

            <div className="relative z-10 flex items-center justify-center mb-6">
              <div className="w-14 h-14 bg-emerald-500/20 backdrop-blur-md rounded-2xl flex items-center justify-center mr-3 border border-emerald-400/40 shadow-lg">
                <Sparkles className="w-7 h-7 text-emerald-400" />
              </div>
              <div className="text-left">
                <span className="text-xl font-bold text-white block">New Partner</span>
                <span className="text-sm text-emerald-300 font-medium">Fresh collaboration</span>
              </div>
              <div className="ml-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                NEW
              </div>
            </div>

            <div className="relative z-10 text-center space-y-4">
              <div className="w-24 h-24 bg-slate-700/60 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-4 border-4 border-slate-600 shadow-lg">
                <div className="text-4xl">🌊</div>
              </div>
              <h4 className="font-bold text-white mb-3 text-xl">Ocean Conservation</h4>
              <p className="text-sm text-slate-300 mb-4 leading-relaxed">Protecting marine ecosystems worldwide</p>
              <div className="bg-slate-700/60 backdrop-blur-md rounded-xl p-4 border border-slate-600/50 shadow-inner">
                <div className="text-2xl font-bold text-emerald-400 mb-1">{formatPrice(67000)}</div>
                <div className="text-sm text-slate-300">Help us reach our {formatPrice(100000)} goal!</div>
              </div>
            </div>
          </Link>
        );
      
      case 'trending-fashion':
        return (
          <Link
            to="/search?category=clothing"
            className="group block bg-gradient-to-br from-indigo-900 to-blue-900 rounded-xl p-6 hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] cursor-pointer text-white h-full flex flex-col justify-between border border-indigo-700/50 relative overflow-hidden"
          >
            {/* Fashion-like background effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-blue-500/5 opacity-50"></div>

            <div className="relative z-10 flex items-center justify-center mb-6">
              <div className="w-14 h-14 bg-amber-500/20 backdrop-blur-md rounded-2xl flex items-center justify-center mr-3 border border-amber-400/40 shadow-lg">
                <TrendingUp className="w-7 h-7 text-amber-400" />
              </div>
              <div className="text-left">
                <span className="text-xl font-bold text-white block">Trending Fashion</span>
                <span className="text-sm text-amber-300 font-medium">What's hot now</span>
              </div>
              <div className="ml-4 bg-amber-500 text-slate-900 px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                TREND
              </div>
            </div>

            <div className="relative z-10 grid grid-cols-2 gap-4 mb-4">
              <div className="bg-slate-700/60 backdrop-blur-md rounded-xl p-4 text-center border border-slate-600/50 shadow-inner">
                <img
                  src="https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=200"
                  alt="Designer Coat"
                  className="w-full h-20 object-cover rounded-lg mb-3"
                />
                <div className="text-amber-400 font-bold text-lg">{formatPrice(120)}</div>
                <div className="text-slate-300 text-sm font-medium">Designer Coat</div>
              </div>
              <div className="bg-slate-700/60 backdrop-blur-md rounded-xl p-4 text-center border border-slate-600/50 shadow-inner">
                <img
                  src="https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=200"
                  alt="Luxury Handbag"
                  className="w-full h-20 object-cover rounded-lg mb-3"
                />
                <div className="text-amber-400 font-bold text-lg">{formatPrice(280)}</div>
                <div className="text-slate-300 text-sm font-medium">Luxury Handbag</div>
              </div>
            </div>

            <div className="relative z-10 text-center bg-slate-700/60 backdrop-blur-md rounded-xl p-4 border border-slate-600/50 shadow-inner">
              <div className="text-xl font-bold text-amber-400 mb-2">Fashion Week Sale</div>
              <div className="flex items-center justify-center text-sm text-slate-300">
                <Star className="w-4 h-4 mr-2" />
                20% to Fashion Forward charity
              </div>
            </div>
          </Link>
        );
      
      case 'flash-sale':
        return (
          <Link
            to="/search?category=furniture"
            className="group block bg-gradient-to-br from-amber-900 to-slate-900 rounded-xl p-6 hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] cursor-pointer text-white h-full flex flex-col justify-between border border-amber-700/50 relative overflow-hidden"
          >
            {/* Urgency background effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-slate-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="relative z-10 flex items-center justify-center mb-6">
              <div className="w-14 h-14 bg-amber-500/20 backdrop-blur-md rounded-2xl flex items-center justify-center mr-3 border border-amber-400/40 shadow-lg">
                <Tag className="w-7 h-7 text-amber-400" />
              </div>
              <div className="text-left">
                <span className="text-xl font-bold text-white block">Flash Sale</span>
                <span className="text-sm text-amber-300 font-medium">Ending soon</span>
              </div>
              <div className="ml-4 bg-amber-500 text-slate-900 px-3 py-1 rounded-full text-xs font-bold animate-pulse shadow-lg">
                24H
              </div>
            </div>

            <div className="relative z-10 grid grid-cols-2 gap-4 mb-4">
              <div className="bg-slate-700/60 backdrop-blur-md rounded-xl p-4 text-center border border-slate-600/50 shadow-inner">
                <img
                  src="https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=200"
                  alt="Vintage Sofa"
                  className="w-full h-20 object-cover rounded-lg mb-3"
                />
                <div className="text-amber-400 font-bold text-lg">{formatPrice(450)}</div>
                <div className="text-slate-300 text-sm font-medium">Vintage Sofa</div>
              </div>
              <div className="bg-slate-700/60 backdrop-blur-md rounded-xl p-4 text-center border border-slate-600/50 shadow-inner">
                <img
                  src="https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=200"
                  alt="Dining Set"
                  className="w-full h-20 object-cover rounded-lg mb-3"
                />
                <div className="text-amber-400 font-bold text-lg">{formatPrice(650)}</div>
                <div className="text-slate-300 text-sm font-medium">Dining Set</div>
              </div>
            </div>

            <div className="relative z-10 text-center bg-slate-700/60 backdrop-blur-md rounded-xl p-4 border border-slate-600/50 shadow-inner">
              <div className="text-xl font-bold text-amber-400 mb-2">24 Hours Only!</div>
              <div className="bg-amber-500 text-slate-900 rounded-full px-4 py-2 text-sm font-bold shadow-lg">
                ⚡ HURRY! Limited Stock
              </div>
            </div>
          </Link>
        );
      
      case 'charity-spotlight':
        return (
          <Link
            to="/charity/education-for-all"
            className="group block bg-gradient-to-br from-indigo-900 to-blue-900 rounded-xl p-6 hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] cursor-pointer text-white h-full flex flex-col justify-between border border-indigo-700/50 relative overflow-hidden"
          >
            {/* Trust background effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-blue-500/5 opacity-50"></div>

            <div className="relative z-10 flex items-center justify-center mb-6">
              <div className="w-14 h-14 bg-emerald-500/20 backdrop-blur-md rounded-2xl flex items-center justify-center mr-3 border border-emerald-400/40 shadow-lg">
                <Award className="w-7 h-7 text-emerald-400" />
              </div>
              <div className="text-left">
                <span className="text-xl font-bold text-white block">Charity Spotlight</span>
                <span className="text-sm text-emerald-300 font-medium">Making a difference</span>
              </div>
              <div className="ml-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                TOP
              </div>
            </div>

            <div className="relative z-10 text-center space-y-4">
              <div className="w-24 h-24 bg-slate-700/60 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-4 border-4 border-slate-600 shadow-lg">
                <img
                  src="https://images.pexels.com/photos/1720186/pexels-photo-1720186.jpeg?auto=compress&cs=tinysrgb&w=100"
                  alt="Education"
                  className="w-20 h-20 rounded-2xl object-cover"
                />
              </div>
              <h4 className="font-bold text-white mb-3 text-xl">Education for All</h4>
              <p className="text-sm text-slate-300 mb-4 leading-relaxed">This month's top charity</p>
              <div className="bg-slate-700/60 backdrop-blur-md rounded-xl p-4 border border-slate-600/50 shadow-inner">
                <div className="text-2xl font-bold text-emerald-400 mb-1">{formatPrice(285000)}</div>
                <div className="text-sm text-slate-300">15,000 children helped this year!</div>
              </div>
            </div>
          </Link>
        );
      
      case 'custom':
        return (
          <Link 
            to={slide.content?.buttonLink || '#'}
            className="block rounded-xl p-4 hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer h-full flex flex-col justify-center relative overflow-hidden"
            style={{ backgroundColor: slide.content?.backgroundColor || '#6366f1' }}
          >
            {slide.content?.customImage && (
              <img
                src={slide.content.customImage}
                alt={slide.title}
                className="absolute inset-0 w-full h-full object-contain"
              />
            )}
            
            {(slide.content?.heading || slide.content?.subheading || slide.content?.buttonText) && (
              <div className="relative z-10 text-center p-4">
                {slide.content?.heading && (
                  <h3 
                    className="text-xl font-bold mb-2"
                    style={{ color: slide.content?.textColor || '#ffffff' }}
                  >
                    {slide.content.heading}
                  </h3>
                )}
                
                {slide.content?.subheading && (
                  <p 
                    className="text-sm mb-4"
                    style={{ color: slide.content?.textColor || '#ffffff' }}
                  >
                    {slide.content.subheading}
                  </p>
                )}
                
                {slide.content?.buttonText && (
                  <button 
                    className="px-4 py-2 rounded-lg text-sm font-medium inline-block"
                    style={{ 
                      backgroundColor: slide.content?.textColor || '#ffffff',
                      color: slide.content?.backgroundColor || '#6366f1'
                    }}
                  >
                    {slide.content.buttonText}
                  </button>
                )}
              </div>
            )}
          </Link>
        );
      
      default:
        return (
          <div className="bg-zinc-200 rounded-xl p-6 h-full flex items-center justify-center">
            <p className="text-zinc-600">Slide content not available</p>
          </div>
        );
    }
  };

  // Memoize filtered products to prevent unnecessary recalculations
  const activeProducts = useMemo(() => 
    allProducts.filter(product => product.status === 'active'),
    [allProducts]
  );
  console.log('[DIAGNOSTIC] HomePage - activeProducts length:', activeProducts.length);

  // Premium Electronics Row - filter from active products
  const premiumElectronics = useMemo(() => 
    activeProducts
      .filter(product => product.category.toLowerCase() === 'electronics')
      .slice(0, 6),
    [activeProducts]
  );
  console.log('[DIAGNOSTIC] HomePage - premiumElectronics length:', premiumElectronics.length);
  if (premiumElectronics.length > 0) {
    console.log('[DIAGNOSTIC] HomePage - premiumElectronics[0] ID:', premiumElectronics[0].id);
    console.log('[DIAGNOSTIC] HomePage - premiumElectronics[0] images:', premiumElectronics[0].images);
  }

  // Fashion & Lifestyle Row - filter from active products
  const fashionLifestyle = useMemo(() => 
    activeProducts
      .filter(product => product.category.toLowerCase() === 'clothing')
      .slice(0, 6),
    [activeProducts]
  );

  // Home & Furniture Row - filter from active products
  const homeFurniture = useMemo(() => 
    activeProducts
      .filter(product => product.category.toLowerCase() === 'furniture')
      .slice(0, 6),
    [activeProducts]
  );

  // Sports & Hobbies Row - filter from active products
  const sportsHobbies = useMemo(() => 
    activeProducts
      .filter(product => product.category.toLowerCase() === 'sports')
      .slice(0, 6),
    [activeProducts]
  );

  // Calculate real category counts
  const categoryCounts = activeProducts.reduce((acc, product) => {
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

  const allCategories = [
    { 
      name: 'Electronics', 
      icon: Smartphone, 
      count: getDisplayCount('electronics'), 
      description: 'Phones, laptops, gadgets' 
    },
    { 
      name: 'Vehicles', 
      icon: Car, 
      count: getDisplayCount('vehicles'), 
      description: 'Cars, bikes, motorcycles' 
    },
    { 
      name: 'Furniture', 
      icon: Armchair, 
      count: getDisplayCount('furniture'), 
      description: 'Home & office furniture' 
    },
    { 
      name: 'Clothing', 
      icon: Shirt, 
      count: getDisplayCount('clothing'), 
      description: 'Fashion & accessories' 
    },
    { 
      name: 'Books', 
      icon: BookOpen, 
      count: getDisplayCount('books'), 
      description: 'Books & educational materials' 
    },
    { 
      name: 'Sports', 
      icon: Dumbbell, 
      count: getDisplayCount('sports'), 
      description: 'Sports & fitness equipment' 
    },
    { 
      name: 'Home & Garden', 
      icon: HomeIcon, 
      count: getDisplayCount('home-&-garden'), 
      description: 'Home improvement & garden' 
    },
    { 
      name: 'Toys & Games', 
      icon: Gamepad2, 
      count: getDisplayCount('toys-&-games'), 
      description: 'Toys, games & collectibles' 
    },
    { 
      name: 'Art & Crafts', 
      icon: Palette, 
      count: getDisplayCount('art-&-crafts'), 
      description: 'Art supplies & handmade items' 
    },
    { 
      name: 'Musical Instruments', 
      icon: Music, 
      count: getDisplayCount('musical-instruments'), 
      description: 'Instruments & audio equipment' 
    },
    { 
      name: 'Health & Beauty', 
      icon: Sparkles, 
      count: getDisplayCount('health-&-beauty'), 
      description: 'Beauty & wellness products' 
    },
    { 
      name: 'Pet Supplies', 
      icon: Package, 
      count: getDisplayCount('pet-supplies'), 
      description: 'Pet food, toys & accessories' 
    }
  ];

  const displayedCategories = showAllCategories ? allCategories : allCategories.slice(0, 6);

  const shippingPartners = [
    {
      name: 'FastTrack Express',
      logo: Truck,
      description: 'Same-day delivery in major cities',
      coverage: 'Nationwide',
      features: ['Real-time tracking', 'Insurance included', 'Eco-friendly vehicles']
    },
    {
      name: 'GreenDelivery Co.',
      logo: Shield,
      description: 'Carbon-neutral shipping solutions',
      coverage: 'Regional',
      features: ['Electric vehicles', 'Sustainable packaging', 'Tree planting program']
    },
    {
      name: 'QuickCourier',
      logo: TrendingUp,
      description: 'Express delivery specialists',
      coverage: 'Urban areas',
      features: ['2-hour delivery', 'SMS notifications', 'Contactless delivery']
    }
  ];

  // Memoize ProductCard to prevent unnecessary re-renders when product data hasn't changed
  const ProductCard = memo(({ product, badge }: { product: any, badge?: string }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    // DIAGNOSTIC: Log ProductCard renders
    console.log('[DIAGNOSTIC] ProductCard RENDER - product ID:', product.id);
    console.log('[DIAGNOSTIC] ProductCard RENDER - product images:', product.images);
    console.log('[DIAGNOSTIC] ProductCard RENDER - image src:', product.images[0]);
    console.log('[DIAGNOSTIC] ProductCard RENDER - timestamp:', new Date().toISOString());

    return (
      <Link
        key={product.id}
        to={`/product/${product.id}`}
        className="group bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 relative hover:border-indigo-300 dark:hover:border-indigo-500 hover:-translate-y-1"
        aria-label={`View ${product.title} - ${formatPrice(product.price)}`}
      >
        {/* Premium badge with enhanced styling */}
        {badge && (
          <div className="absolute top-3 left-3 z-20 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg backdrop-blur-sm border border-amber-400/20">
            <div className="flex items-center space-x-1">
              <span>⭐</span>
              <span>{badge}</span>
            </div>
          </div>
        )}

        {/* Enhanced image container with loading state */}
        <div className="aspect-square overflow-hidden relative bg-slate-100 dark:bg-slate-700">
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
            </div>
          )}

          {imageError ? (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-200 dark:bg-slate-600">
              <div className="text-center text-slate-400">
                <div className="w-12 h-12 mx-auto mb-2 opacity-50">📷</div>
                <div className="text-xs">Image unavailable</div>
              </div>
            </div>
          ) : (
            <img
              src={product.images[0]}
              alt={product.title}
              className={`w-full h-full object-cover group-hover:scale-110 transition-all duration-700 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => {
                console.log('[DIAGNOSTIC] ProductCard IMAGE onLoad - product ID:', product.id, 'src:', product.images[0]);
                setImageLoaded(true);
              }}
              onError={() => {
                console.log('[DIAGNOSTIC] ProductCard IMAGE onError - product ID:', product.id, 'src:', product.images[0]);
                setImageError(true);
              }}
              loading="lazy"
            />
          )}

          {/* Subtle overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        {/* Enhanced content section */}
        <div className="p-5 space-y-3">
          <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 text-base leading-tight min-h-[3rem] flex items-center">
            {product.title}
          </h3>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-slate-900 dark:text-white">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="text-sm text-slate-500 line-through">{formatPrice(product.originalPrice)}</span>
              )}
            </div>

            {/* Enhanced donation badge */}
            <div className="flex items-center bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-full border border-emerald-200 dark:border-emerald-700">
              <Heart className="w-3 h-3 mr-1 text-emerald-600 dark:text-emerald-400 fill-current" />
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">{product.donationPercent}%</span>
            </div>
          </div>

          {/* Enhanced seller info */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-700">
            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center space-x-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                <span className="font-medium truncate">to {product.charity}</span>
              </div>
              <div className="flex items-center space-x-1 text-slate-500">
                <span>by</span>
                <span className="font-medium truncate">{product.seller}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Subtle focus ring for accessibility */}
        <div className="absolute inset-0 rounded-2xl ring-2 ring-indigo-500/20 ring-offset-2 ring-offset-white dark:ring-offset-slate-800 opacity-0 focus-within:opacity-100 transition-opacity"></div>
      </Link>
    );
  }, (prevProps, nextProps) => {
    // Custom comparison: skip re-render if product data is the same
    // Return true to skip re-render, false to re-render
    return (
      prevProps.product.id === nextProps.product.id &&
      prevProps.product.images[0] === nextProps.product.images[0] &&
      prevProps.product.price === nextProps.product.price &&
      prevProps.product.title === nextProps.product.title &&
      prevProps.badge === nextProps.badge
    );
  });

  return (
    <>
      <div className="dark:bg-slate-900 transition-colors min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Hero Section - Ultra Premium Design */}
      <section className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white py-5 md:py-7 overflow-hidden">
        {/* Premium Background Elements */}
        <div className="absolute inset-0">
          {/* Primary geometric shapes */}
          <div className="absolute top-20 left-16 w-80 h-80 bg-indigo-500/8 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-16 w-96 h-96 bg-amber-500/6 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-emerald-500/4 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '4s' }}></div>

          {/* Subtle grid pattern overlay */}
          <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
            backgroundSize: '50px 50px'
          }}></div>

          {/* Gradient mesh overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-indigo-950/20 to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center min-h-[45vh]">
            {/* Left Side - Ultra Premium Typography */}
            <div className={`text-left space-y-4 transition-all duration-1200 ${
              heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}>
              {/* Main headline with premium styling */}
              <div className="space-y-3">
                <div className="inline-flex items-center space-x-3 bg-white/10 backdrop-blur-md rounded-full px-5 py-2.5 border border-white/20">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-slate-200">Trusted by 10,000+ users</span>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[0.9] tracking-tight">
                  <span className="block text-white">Buy & Sell</span>
                  <span className="block relative mt-2">
                    <span className="text-amber-400">for Good</span>
                    <div className="absolute -bottom-3 left-0 right-0 h-2 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 rounded-full opacity-80 animate-pulse"></div>
                    <div className="absolute -bottom-3 left-0 right-0 h-2 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full blur-sm opacity-60"></div>
                  </span>
                </h1>

                <div className={`w-24 h-1.5 bg-gradient-to-r from-indigo-400 via-indigo-500 to-amber-400 rounded-full transition-all duration-1500 delay-500 ${
                  heroLoaded ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'
                }`}></div>
              </div>

              {/* Enhanced description */}
              <div className={`space-y-2.5 transition-all duration-1200 delay-700 ${
                heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}>
                <p className="text-base md:text-lg text-slate-300 leading-relaxed max-w-xl font-light">
                  Every purchase supports a charity. Join thousands making commerce
                  <span className="text-amber-400 font-medium"> compassionate</span>.
                </p>

                {/* Feature highlights */}
                <div className="flex flex-wrap gap-2.5">
                  <div className="flex items-center space-x-2 bg-white/5 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/10">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                    <span className="text-sm text-slate-200">Free Shipping</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-white/5 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/10">
                    <div className="w-1.5 h-1.5 bg-amber-400 rounded-full"></div>
                    <span className="text-sm text-slate-200">$2.5M+ Donated</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-white/5 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/10">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></div>
                    <span className="text-sm text-slate-200">Secure Payments</span>
                  </div>
                </div>
              </div>

              {/* Premium CTA Section */}
              <div className={`space-y-4 transition-all duration-1200 delay-900 ${
                heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                <div className="flex flex-col sm:flex-row gap-3">
                  {/* Primary CTA - Ultra Premium */}
                  <Link
                    to="/search"
                    className="group relative bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 text-white px-8 py-3 rounded-2xl font-bold text-base hover:shadow-2xl hover:shadow-indigo-500/40 transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 flex items-center justify-center overflow-hidden"
                    aria-label="Start shopping for products"
                  >
                    {/* Animated background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    {/* Shine effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                    </div>

                    <ShoppingBag className="w-6 h-6 mr-4 relative z-10 group-hover:animate-bounce transition-transform duration-300" />
                    <span className="relative z-10 tracking-wide">Start Shopping</span>

                    {/* Focus ring for accessibility */}
                    <div className="absolute inset-0 rounded-2xl ring-2 ring-indigo-400/30 ring-offset-2 ring-offset-slate-950 opacity-0 group-focus:opacity-100 transition-opacity"></div>
                  </Link>

                  {/* Secondary CTA - Sophisticated */}
                  <Link
                    to="/sell"
                    className="group relative border-2 border-amber-400/50 text-amber-400 px-8 py-3 rounded-2xl font-bold text-base hover:bg-amber-400/10 hover:border-amber-400/80 hover:shadow-xl hover:shadow-amber-500/20 transition-all duration-500 flex items-center justify-center backdrop-blur-sm"
                    aria-label="Start selling your products"
                  >
                    <span className="tracking-wide">Start Selling</span>
                    <ArrowRight className="w-6 h-6 ml-4 group-hover:translate-x-2 transition-transform duration-300" />

                    {/* Subtle glow effect */}
                    <div className="absolute inset-0 rounded-2xl bg-amber-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    {/* Focus ring */}
                    <div className="absolute inset-0 rounded-2xl ring-2 ring-amber-400/30 ring-offset-2 ring-offset-slate-950 opacity-0 group-focus:opacity-100 transition-opacity"></div>
                  </Link>
                </div>

                {/* Trust metrics */}
                <div className="flex items-center justify-center space-x-6 text-slate-400">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">500+ Products</span>
                  </div>
                  <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">Secure Platform</span>
                  </div>
                </div>
              </div>

              {/* Trust indicators with animations */}
              <div className={`flex items-center space-x-6 pt-4 transition-all duration-1000 delay-1000 ${
                heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}>
                <div className="flex items-center space-x-2 text-slate-400">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Trusted by 10,000+ users</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-400">
                  <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">$2.5M+ donated</span>
                </div>
              </div>
            </div>

            {/* Right Side - Ultra Premium Interactive Showcase */}
            <div className={`relative transition-all duration-1200 delay-500 ${
              heroLoaded ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-12 scale-95'
            }`}>
              {/* Main showcase container */}
              <div className="relative">
                {/* Premium glass morphism container */}
                <div className="relative overflow-hidden rounded-3xl shadow-2xl bg-gradient-to-br from-slate-800/90 to-slate-900/95 backdrop-blur-xl border border-slate-700/60">
                  {/* Subtle inner glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-amber-500/5 rounded-3xl"></div>

                  <div
                    className="flex items-stretch transition-transform duration-800 ease-out"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                  >
                    {activeCarouselSlides.map((slide) => (
                      <div key={slide.id} className="w-full flex-shrink-0 min-h-[16rem] md:min-h-[18rem] lg:min-h-[20rem] relative">
                        {renderSlideContent(slide)}

                        {/* Subtle vignette effect */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-transparent rounded-3xl pointer-events-none"></div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Premium Progress Indicators */}
                <div className="flex flex-col items-center mt-4 space-y-2">
                  <div className="flex justify-center space-x-2">
                    {activeCarouselSlides.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`relative transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 rounded-full ${
                          index === currentSlide
                            ? 'w-10 h-3 bg-gradient-to-r from-amber-500 to-amber-600 shadow-lg'
                            : 'w-3 h-3 bg-slate-600/60 hover:bg-slate-500/80 hover:scale-110 backdrop-blur-sm'
                        }`}
                        aria-label={`View showcase ${index + 1}`}
                      >
                        {index === currentSlide && (
                          <>
                            <div className="absolute inset-0 bg-amber-400/30 rounded-full animate-ping"></div>
                            <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full shadow-lg"></div>
                          </>
                        )}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-slate-500 font-medium">Swipe or click to explore</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories - Luxury Discovery Grid */}
      <section className="py-8 bg-gradient-to-br from-slate-50 via-slate-100/30 to-slate-50 dark:from-slate-900 dark:via-slate-800/20 dark:to-slate-900 transition-colors relative overflow-hidden">
        {/* Sophisticated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-32 left-24 w-80 h-80 bg-indigo-500/6 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-32 right-24 w-96 h-96 bg-amber-500/4 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/3 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '6s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
          {/* Premium header section */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-indigo-50 to-amber-50 dark:from-indigo-950/50 dark:to-amber-950/50 rounded-full px-5 py-2.5 mb-3 border border-indigo-200/50 dark:border-indigo-800/50">
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">Explore & Discover</span>
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3 leading-tight">
              Find Your Perfect
              <span className="block text-indigo-600 dark:text-indigo-400">Category</span>
            </h2>

            <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed mb-4">
              Discover amazing items across all categories while supporting charities that matter to you.
              Every purchase creates positive change.
            </p>

            <div className="w-32 h-1.5 bg-gradient-to-r from-indigo-500 via-indigo-600 to-amber-500 rounded-full mx-auto"></div>
          </div>

          {/* Luxury category grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5 mb-6">
            {displayedCategories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <Link
                  key={category.name}
                  to={`/search?category=${category.name.toLowerCase()}`}
                  className={`group relative bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-600 text-center hover:scale-105 hover:-translate-y-2 border border-slate-200/60 dark:border-slate-700/60 hover:border-indigo-300/80 dark:hover:border-indigo-500/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900 ${
                    heroLoaded ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'
                  }`}
                  style={{ animationDelay: `${index * 100 + 800}ms` }}
                  aria-label={`Browse ${category.name} category with ${category.count} items`}
                >
                  {/* Premium gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/0 via-amber-50/0 to-emerald-50/0 dark:from-indigo-950/0 dark:via-amber-950/0 dark:to-emerald-950/0 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

                  {/* Featured badge for popular categories */}
                  {index < 3 && (
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 px-3 py-1 rounded-full text-xs font-bold shadow-xl animate-pulse">
                      HOT
                    </div>
                  )}

                  <div className="relative z-10 space-y-3">
                    {/* Enhanced icon with premium styling */}
                    <div className="relative mx-auto w-14 h-14 flex items-center justify-center">
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-amber-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <IconComponent className="w-10 h-10 text-indigo-600 group-hover:text-indigo-500 dark:text-indigo-400 dark:group-hover:text-indigo-300 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 transform relative z-10" />
                    </div>

                    {/* Premium typography */}
                    <div className="space-y-1.5">
                      <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors text-base leading-tight">
                        {category.name}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 font-semibold group-hover:text-slate-700 dark:group-hover:text-slate-300">
                        {category.count}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-500 hidden md:block leading-tight group-hover:text-slate-600 dark:group-hover:text-slate-400">
                        {category.description}
                      </p>
                    </div>
                  </div>

                  {/* Luxury shine effect */}
                  <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1200"></div>
                  </div>

                  {/* Subtle border glow */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-indigo-500/0 via-amber-500/0 to-emerald-500/0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 border border-transparent group-hover:border-indigo-300/50"></div>
                </Link>
              );
            })}
          </div>

          {/* Ultra Premium CTA Button */}
          <div className="text-center mt-2">
            <button
              onClick={() => setShowAllCategories(!showAllCategories)}
              className={`group inline-flex items-center px-7 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold text-sm md:text-base rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-indigo-500/30 transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900 ${
                heroLoaded ? 'animate-fade-in' : 'opacity-0'
              }`}
              style={{ animationDelay: '2000ms' }}
              aria-expanded={showAllCategories}
              aria-label={showAllCategories ? 'Show fewer categories' : `Show all ${allCategories.length} categories`}
            >
              <span className="relative z-10">
                {showAllCategories ? 'Show Less Categories' : `Explore All ${allCategories.length} Categories`}
              </span>
              {showAllCategories ? (
                <ChevronUp className="w-6 h-6 ml-4 transition-transform duration-300 group-hover:-translate-y-1" />
              ) : (
                <ChevronDown className="w-6 h-6 ml-4 transition-transform duration-300 group-hover:translate-y-1" />
              )}

              {/* Shine effect */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
              </div>
            </button>

            {/* Subtle encouragement text */}
              <p className="text-slate-500 dark:text-slate-400 mt-3 text-xs md:text-sm font-medium">
              ✨ Each category supports different charities worldwide
            </p>
          </div>
        </div>
      </section>

      {/* Premium Electronics Section - Ultra Luxury */}
      <section className="py-10 bg-gradient-to-br from-slate-50 via-slate-100/40 to-slate-50 dark:from-slate-900 dark:via-slate-800/30 dark:to-slate-900 transition-colors relative overflow-hidden">
        {/* Sophisticated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-16 right-16 w-72 h-72 bg-indigo-500/8 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-16 left-16 w-80 h-80 bg-amber-500/6 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
          {/* Luxury section header */}
          <div className={`text-center mb-8 transition-all duration-1200 ${
            heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`} style={{ transitionDelay: '400ms' }}>
            <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-indigo-50 to-amber-50 dark:from-indigo-950/50 dark:to-amber-950/50 rounded-full px-5 py-2.5 mb-3 border border-indigo-200/50 dark:border-indigo-800/50">
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">Premium Collection</span>
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3 leading-tight">
              Cutting-Edge
              <span className="block text-indigo-600 dark:text-indigo-400">Electronics</span>
            </h2>

            <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed mb-5">
              Discover the latest technology at unbeatable prices. Every purchase powers innovation and charity.
            </p>

            <div className="w-32 h-1.5 bg-gradient-to-r from-indigo-500 via-indigo-600 to-amber-500 rounded-full mx-auto mb-6"></div>

            <Link
              to="/search?category=electronics"
              className="group inline-flex items-center px-7 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold text-base rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-indigo-500/30 transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900"
              aria-label="Explore premium electronics collection"
            >
              <span className="relative z-10">Explore Electronics</span>
              <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform duration-300" />

              {/* Shine effect */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
              </div>
            </Link>
          </div>

          {/* Premium product showcase */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5 mb-8">
            {premiumElectronics.map((product, index) => {
              console.log('[DIAGNOSTIC] HomePage - Mapping product to ProductCard - ID:', product.id, 'key:', product.id, 'index:', index);
              return (
                <div
                  key={product.id}
                  className={`${heroLoaded ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`}
                  style={{ animationDelay: `${index * 150 + 1000}ms` }}
                >
                  <ProductCard product={product} />
                </div>
              );
            })}
          </div>

          {/* Luxury section metrics */}
          <div className={`text-center transition-all duration-1200 ${
            heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`} style={{ transitionDelay: '1800ms' }}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-lg border border-slate-200/60 dark:border-slate-700/60 backdrop-blur-sm">
                <div className="flex items-center justify-center w-12 h-12 bg-emerald-50 dark:bg-emerald-900/50 rounded-xl mx-auto mb-4">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">500+</div>
                <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Premium Products</div>
              </div>

              <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-lg border border-slate-200/60 dark:border-slate-700/60 backdrop-blur-sm">
                <div className="flex items-center justify-center w-12 h-12 bg-amber-50 dark:bg-amber-900/50 rounded-xl mx-auto mb-4">
                  <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse"></div>
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">4.9★</div>
                <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Average Rating</div>
              </div>

              <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-lg border border-slate-200/60 dark:border-slate-700/60 backdrop-blur-sm">
                <div className="flex items-center justify-center w-12 h-12 bg-indigo-50 dark:bg-indigo-900/50 rounded-xl mx-auto mb-4">
                  <div className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse"></div>
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">24/7</div>
                <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Expert Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fashion & Lifestyle Section */}
      <section className="py-8 bg-white dark:bg-slate-800 transition-colors relative">
        {/* Section background pattern */}
        <div className="absolute inset-0 opacity-2">
          <div className="absolute bottom-10 left-20 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex justify-between items-center mb-6">
            <div className="space-y-1">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Fashion & Lifestyle</h2>
              <p className="text-slate-600 dark:text-slate-400 text-base">Style that makes a statement</p>
            </div>
            <Link
              to="/search?category=clothing"
              className="group text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-semibold flex items-center text-base transition-all duration-300"
            >
              View All Fashion
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
            {fashionLifestyle.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Home & Furniture Section */}
      <section className="py-8 bg-slate-50 dark:bg-slate-900 transition-colors relative">
        {/* Section background pattern */}
        <div className="absolute inset-0 opacity-2">
          <div className="absolute top-20 left-10 w-56 h-56 bg-emerald-500/10 rounded-full blur-2xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex justify-between items-center mb-6">
            <div className="space-y-1">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Home & Furniture</h2>
              <p className="text-slate-600 dark:text-slate-400 text-base">Transform your living space</p>
            </div>
            <Link
              to="/search?category=furniture"
              className="group text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-semibold flex items-center text-base transition-all duration-300"
            >
              View All Furniture
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
            {homeFurniture.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Sports & Hobbies Section */}
      <section className="py-8 bg-white dark:bg-slate-800 transition-colors relative">
        {/* Section background pattern */}
        <div className="absolute inset-0 opacity-2">
          <div className="absolute bottom-20 right-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex justify-between items-center mb-6">
            <div className="space-y-1">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Sports & Hobbies</h2>
              <p className="text-slate-600 dark:text-slate-400 text-base">Gear up for your passions</p>
            </div>
            <Link
              to="/search?category=sports"
              className="group text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-semibold flex items-center text-base transition-all duration-300"
            >
              View All Sports
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
            {sportsHobbies.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Shipping Partners Section */}
      <section className="py-8 bg-slate-50 dark:bg-slate-900 transition-colors relative">
        {/* Section background pattern */}
        <div className="absolute inset-0 opacity-3">
          <div className="absolute top-16 left-16 w-80 h-80 bg-emerald-500/8 rounded-full blur-3xl"></div>
          <div className="absolute bottom-16 right-16 w-72 h-72 bg-indigo-500/8 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2">Trusted Shipping Partners</h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
              Fast, reliable, and eco-friendly delivery options for your peace of mind
            </p>
            <div className="w-20 h-1 bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full mx-auto mt-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
            {shippingPartners.map((partner, index) => {
              const LogoComponent = partner.logo;
              return (
                <div key={index} className="group bg-white dark:bg-slate-800 rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 relative overflow-hidden">
                  {/* Subtle hover effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-emerald-50/50 dark:from-indigo-950/50 dark:to-emerald-950/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  <div className="relative z-10">
                    <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:shadow-lg transition-shadow duration-300">
                      <LogoComponent className="w-10 h-10 text-indigo-600 group-hover:text-indigo-500 transition-colors" />
                    </div>
                    <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">{partner.name}</h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">{partner.description}</p>
                    <div className="inline-block bg-indigo-50 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 px-4 py-2 rounded-full text-sm font-medium mb-6 shadow-sm">
                      {partner.coverage}
                    </div>
                    <ul className="space-y-3">
                      {partner.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center justify-center text-sm text-slate-600 dark:text-slate-400">
                          <Shield className="w-5 h-5 text-emerald-600 mr-3" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <div className="inline-flex items-center bg-emerald-50 dark:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-700 rounded-2xl px-8 py-6 shadow-lg backdrop-blur-sm">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-800 rounded-2xl flex items-center justify-center mr-4">
                <Truck className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-emerald-900 dark:text-emerald-100 text-lg">Free Shipping Available</div>
                <div className="text-sm text-emerald-700 dark:text-emerald-300">On orders over {formatPrice(50)} with participating sellers</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section with Premium Animations */}
      {!isAuthenticated && (
        <section className="py-12 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white relative overflow-hidden">
          {/* Dramatic background effects */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          </div>

          {/* Floating particles effect */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-amber-400/20 rounded-full animate-ping"
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${30 + (i % 2) * 40}%`,
                  animationDelay: `${i * 0.5}s`,
                  animationDuration: '3s'
                }}
              ></div>
            ))}
          </div>

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <div className={`space-y-6 transition-all duration-1000 ${
              heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`} style={{ transitionDelay: '300ms' }}>
              <div className="space-y-3">
                <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                  Ready to Make a <span className="text-amber-400 relative inline-block">
                    Difference
                    <div className="absolute -bottom-3 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 rounded-full opacity-80 animate-pulse"></div>
                    <div className="absolute -bottom-3 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full opacity-60 animate-pulse blur-sm"></div>
                  </span>?
                </h2>
                <div className={`w-32 h-1 bg-gradient-to-r from-amber-400 to-indigo-400 rounded-full mx-auto transition-all duration-1000 delay-500 ${
                  heroLoaded ? 'scale-x-100' : 'scale-x-0'
                }`}></div>
              </div>

              <p className={`text-lg md:text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto transition-all duration-1000 delay-700 ${
                heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}>
                Join our community of conscious buyers and sellers today. Every purchase creates positive change.
              </p>

              <div className={`flex flex-col sm:flex-row gap-6 justify-center pt-6 transition-all duration-1000 delay-1000 ${
                heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}>
                <Link
                  to="/signup"
                  className="group bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 text-white px-12 py-5 rounded-3xl font-black text-lg hover:shadow-2xl hover:shadow-indigo-500/40 transition-all duration-500 transform hover:scale-110 hover:-translate-y-2 flex items-center justify-center relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:ring-offset-2 focus:ring-offset-slate-950"
                  aria-label="Sign up to start your compassionate journey"
                >
                  {/* Multi-layer gradient effects */}
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 via-indigo-500 to-indigo-600 opacity-0 group-hover:opacity-50 transition-opacity duration-700"></div>

                  <span className="relative z-10 tracking-wide">Start Your Journey</span>

                  {/* Epic shine effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1200"></div>
                  </div>
                </Link>
                <Link
                  to="/search"
                  className="group border-2 border-amber-400/40 text-amber-400 px-10 py-4 rounded-2xl font-bold hover:bg-amber-400/10 hover:border-amber-400/60 transition-all duration-300 backdrop-blur-sm flex items-center justify-center text-base focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:ring-offset-2 focus:ring-offset-slate-950"
                  aria-label="Explore the marketplace"
                >
                  Explore Marketplace
                  <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
              </div>

              {/* Enhanced Social Proof */}
              <div className={`flex flex-col sm:flex-row items-center justify-center space-y-6 sm:space-y-0 sm:space-x-12 pt-10 transition-all duration-1200 delay-1400 ${
                heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}>
                <div className="flex items-center space-x-4">
                  <div className="flex -space-x-2">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="w-10 h-10 bg-gradient-to-br from-indigo-400 via-purple-500 to-amber-400 rounded-full border-2 border-slate-950 animate-pulse shadow-lg" style={{ animationDelay: `${i * 0.3}s` }}></div>
                    ))}
                  </div>
                  <div className="text-left">
                    <div className="text-2xl font-bold text-white">10,000+</div>
                    <div className="text-sm text-slate-400 font-medium">Happy Members</div>
                  </div>
                </div>

                <div className="hidden sm:block w-px h-12 bg-gradient-to-b from-transparent via-slate-600 to-transparent"></div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-2xl">💚</span>
                  </div>
                  <div className="text-left">
                    <div className="text-2xl font-bold text-emerald-400">$2.5M+</div>
                    <div className="text-sm text-slate-400 font-medium">Donated Globally</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
    <StyleComponent />
    </>
  );
};

export default HomePage;