import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Search, Filter, MapPin, ExternalLink, TrendingUp, ArrowRight } from 'lucide-react';
import { useCurrency } from '../contexts/CurrencyContext';

// Charity Card Component with image error handling (matching Home page ProductCard pattern)
const CharityCard = ({ charity, formatPrice }: { charity: any, formatPrice: (price: number) => string }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <Link
      key={charity.id}
      to={`/charity/${charity.id}`}
      className="group bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 relative hover:border-indigo-300 dark:hover:border-indigo-500 hover:-translate-y-1"
      aria-label={`View ${charity.name} charity details`}
    >
      {/* Enhanced image container with loading state */}
      <div className="aspect-video overflow-hidden relative bg-slate-100 dark:bg-slate-700">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
          </div>
        )}

        {imageError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-200 dark:bg-slate-600">
            <div className="text-center text-slate-400">
              <Heart className="w-12 h-12 mx-auto mb-2 opacity-50 text-indigo-400" />
              <div className="text-xs font-medium">Image unavailable</div>
            </div>
          </div>
        ) : (
          <img
            src={charity.image}
            alt={charity.name}
            className={`w-full h-full object-cover group-hover:scale-110 transition-all duration-700 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            loading="lazy"
          />
        )}

        {/* Subtle overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      
      <div className="p-5 space-y-3">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 text-base leading-tight flex-1">
            {charity.name}
          </h3>
          <span className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-2.5 py-1 rounded-full text-xs font-semibold ml-2 border border-indigo-200 dark:border-indigo-700">
            {charity.category}
          </span>
        </div>
        
        <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2 leading-relaxed">{charity.description}</p>
        
        <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-700">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">Total Received</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">{formatPrice(charity.totalReceived)}</span>
          </div>
          
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">Beneficiaries</span>
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">{charity.beneficiaries.toLocaleString()}</span>
          </div>
          
          <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
            <MapPin className="w-3.5 h-3.5 mr-1.5" />
            <span className="truncate">{charity.location}</span>
          </div>
          
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700">
            <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
              <TrendingUp className="w-3.5 h-3.5 mr-1.5" />
              <span>{charity.projectsCompleted} projects</span>
            </div>
            <div className="flex items-center text-indigo-600 dark:text-indigo-400 text-xs font-medium group-hover:gap-1.5 transition-all">
              <span>Learn more</span>
              <ExternalLink className="w-3.5 h-3.5 ml-1 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* Subtle focus ring for accessibility */}
      <div className="absolute inset-0 rounded-2xl ring-2 ring-indigo-500/20 ring-offset-2 ring-offset-white dark:ring-offset-slate-800 opacity-0 focus-within:opacity-100 transition-opacity"></div>
    </Link>
  );
};

const Charities: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('impact');
  const { formatPrice } = useCurrency();

  const charities = [
    {
      id: '1',
      name: 'Education for All',
      description: 'Providing quality education to underprivileged children worldwide through innovative programs and technology.',
      longDescription: 'Education for All is a global initiative dedicated to breaking the cycle of poverty through education. We work in over 50 countries to provide access to quality learning opportunities for children who need it most.',
      category: 'Education',
      website: 'https://educationforall.org',
      location: 'Global',
      totalReceived: 125000,
      beneficiaries: 15000,
      projectsCompleted: 45,
      image: 'https://images.pexels.com/photos/1720186/pexels-photo-1720186.jpeg?auto=compress&cs=tinysrgb&w=600',
      impact: 'High',
      founded: 2015,
      isActive: true
    },
    {
      id: '2',
      name: 'Habitat for Humanity',
      description: 'Building homes and communities for families in need, creating a world where everyone has a decent place to live.',
      longDescription: 'Habitat for Humanity brings people together to build homes, communities and hope. We work alongside families to help them build or improve a place they can call home.',
      category: 'Housing',
      website: 'https://habitat.org',
      location: 'Worldwide',
      totalReceived: 98500,
      beneficiaries: 8500,
      projectsCompleted: 120,
      image: 'https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg?auto=compress&cs=tinysrgb&w=600',
      impact: 'High',
      founded: 1976,
      isActive: true
    },
    {
      id: '3',
      name: 'Warmth for All',
      description: 'Providing clothing and shelter for homeless individuals and families during harsh weather conditions.',
      longDescription: 'Warmth for All operates emergency shelters and distributes warm clothing to those experiencing homelessness. Our mission is to ensure no one faces the cold alone.',
      category: 'Social Services',
      website: 'https://warmthforall.org',
      location: 'North America',
      totalReceived: 76200,
      beneficiaries: 12000,
      projectsCompleted: 85,
      image: 'https://images.pexels.com/photos/6995247/pexels-photo-6995247.jpeg?auto=compress&cs=tinysrgb&w=600',
      impact: 'Medium',
      founded: 2010,
      isActive: true
    },
    {
      id: '4',
      name: 'Arts Education',
      description: 'Supporting arts programs in schools and communities to foster creativity and cultural expression.',
      longDescription: 'Arts Education believes in the transformative power of creative expression. We fund arts programs in underserved schools and provide scholarships for talented young artists.',
      category: 'Education',
      website: 'https://artseducation.org',
      location: 'United States',
      totalReceived: 54300,
      beneficiaries: 6500,
      projectsCompleted: 35,
      image: 'https://images.pexels.com/photos/1153213/pexels-photo-1153213.jpeg?auto=compress&cs=tinysrgb&w=600',
      impact: 'Medium',
      founded: 2018,
      isActive: true
    },
    {
      id: '5',
      name: 'Tech for Kids',
      description: 'Bringing technology education to underserved youth and bridging the digital divide.',
      longDescription: 'Tech for Kids provides computer labs, coding classes, and digital literacy programs to children in low-income communities, preparing them for the digital future.',
      category: 'Education',
      website: 'https://techforkids.org',
      location: 'Global',
      totalReceived: 43200,
      beneficiaries: 9200,
      projectsCompleted: 28,
      image: 'https://images.pexels.com/photos/5905709/pexels-photo-5905709.jpeg?auto=compress&cs=tinysrgb&w=600',
      impact: 'High',
      founded: 2019,
      isActive: true
    },
    {
      id: '6',
      name: 'Ocean Conservation',
      description: 'Protecting marine ecosystems and promoting sustainable fishing practices worldwide.',
      longDescription: 'Ocean Conservation works to preserve our oceans through research, education, and direct action. We partner with local communities to implement sustainable practices.',
      category: 'Environment',
      website: 'https://oceanconservation.org',
      location: 'Global',
      totalReceived: 67800,
      beneficiaries: 25000,
      projectsCompleted: 52,
      image: 'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=600',
      impact: 'High',
      founded: 2012,
      isActive: true
    },
    {
      id: '7',
      name: 'Animal Rescue Network',
      description: 'Rescuing and rehabilitating abandoned and abused animals, finding them loving homes.',
      longDescription: 'Animal Rescue Network operates shelters and rescue programs across multiple states, providing medical care, rehabilitation, and adoption services for animals in need.',
      category: 'Animal Welfare',
      website: 'https://animalrescuenetwork.org',
      location: 'United States',
      totalReceived: 38900,
      beneficiaries: 5500,
      projectsCompleted: 95,
      image: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=600',
      impact: 'Medium',
      founded: 2014,
      isActive: true
    },
    {
      id: '8',
      name: 'Clean Water Initiative',
      description: 'Providing access to clean, safe drinking water in developing communities around the world.',
      longDescription: 'Clean Water Initiative builds wells, water treatment facilities, and sanitation systems in communities lacking access to clean water, improving health and quality of life.',
      category: 'Health',
      website: 'https://cleanwaterinitiative.org',
      location: 'Africa & Asia',
      totalReceived: 89400,
      beneficiaries: 18500,
      projectsCompleted: 67,
      image: 'https://images.pexels.com/photos/1739855/pexels-photo-1739855.jpeg?auto=compress&cs=tinysrgb&w=600',
      impact: 'High',
      founded: 2011,
      isActive: true
    }
  ];

  const categories = ['All', 'Education', 'Health', 'Environment', 'Housing', 'Social Services', 'Animal Welfare'];

  const filteredCharities = charities.filter(charity => {
    const matchesSearch = charity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         charity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         charity.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || charity.category === selectedCategory;
    return matchesSearch && matchesCategory && charity.isActive;
  });

  const sortedCharities = [...filteredCharities].sort((a, b) => {
    switch (sortBy) {
      case 'impact':
        return b.totalReceived - a.totalReceived;
      case 'name':
        return a.name.localeCompare(b.name);
      case 'beneficiaries':
        return b.beneficiaries - a.beneficiaries;
      default:
        return 0;
    }
  });

  const totalDonated = charities.reduce((sum, charity) => sum + charity.totalReceived, 0);
  const totalBeneficiaries = charities.reduce((sum, charity) => sum + charity.beneficiaries, 0);

  return (
    <div className="dark:bg-slate-900 transition-colors min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-indigo-50 to-amber-50 dark:from-indigo-950/50 dark:to-amber-950/50 rounded-full px-5 py-2.5 mb-3 border border-indigo-200/50 dark:border-indigo-800/50">
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">Partner Organizations</span>
            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3 leading-tight">
            Our Partner
            <span className="block text-indigo-600 dark:text-indigo-400">Charities</span>
          </h1>
          <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed mb-6">
            Every purchase on Trade2Help supports these amazing organizations making a real difference in the world.
          </p>
          
          <div className="w-32 h-1.5 bg-gradient-to-r from-indigo-500 via-indigo-600 to-amber-500 rounded-full mx-auto mb-6"></div>
          
          {/* Impact Stats - Matching Home page metric style */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-lg border border-slate-200/60 dark:border-slate-700/60 backdrop-blur-sm">
              <div className="flex items-center justify-center w-12 h-12 bg-emerald-50 dark:bg-emerald-900/50 rounded-xl mx-auto mb-4">
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{formatPrice(totalDonated)}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Total Donated</div>
            </div>
            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-lg border border-slate-200/60 dark:border-slate-700/60 backdrop-blur-sm">
              <div className="flex items-center justify-center w-12 h-12 bg-amber-50 dark:bg-amber-900/50 rounded-xl mx-auto mb-4">
                <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse"></div>
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{totalBeneficiaries.toLocaleString()}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Lives Impacted</div>
            </div>
            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-lg border border-slate-200/60 dark:border-slate-700/60 backdrop-blur-sm">
              <div className="flex items-center justify-center w-12 h-12 bg-indigo-50 dark:bg-indigo-900/50 rounded-xl mx-auto mb-4">
                <div className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse"></div>
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{charities.length}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Partner Charities</div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-lg border border-slate-200/60 dark:border-slate-700/60 mb-6 transition-colors">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search charities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              />
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2.5 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-sm"
                >
                  {categories.map(category => (
                    <option key={category} value={category.toLowerCase()}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2.5 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-sm"
              >
                <option value="impact">Sort by Impact</option>
                <option value="name">Sort by Name</option>
                <option value="beneficiaries">Sort by Beneficiaries</option>
              </select>
            </div>
          </div>
        </div>

        {/* Charities Grid - Matching Home page ProductCard style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sortedCharities.map((charity) => (
            <CharityCard key={charity.id} charity={charity} formatPrice={formatPrice} />
          ))}
        </div>

        {/* No Results */}
        {sortedCharities.length === 0 && (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No charities found</h3>
            <p className="text-slate-600 dark:text-slate-400">Try adjusting your search terms or filters</p>
          </div>
        )}

        {/* Call to Action - Matching Home page CTA style */}
        <div className="mt-10 py-10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white relative overflow-hidden rounded-3xl">
          {/* Background effects matching Home */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          </div>

          <div className="relative z-10 text-center px-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 leading-tight">
              Ready to Make a <span className="text-amber-400 relative inline-block">
                Difference
                <div className="absolute -bottom-2 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 rounded-full opacity-80 animate-pulse"></div>
              </span>?
            </h2>
            <p className="text-base md:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto mb-6">
              Start shopping and automatically support these amazing causes with every purchase.
            </p>
            <Link
              to="/search"
              className="group relative bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 text-white px-8 py-3.5 rounded-2xl font-bold text-base hover:shadow-2xl hover:shadow-indigo-500/40 transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 flex items-center justify-center mx-auto w-fit overflow-hidden"
              aria-label="Start shopping to support charities"
            >
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              {/* Shine effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
              </div>

              <span className="relative z-10 tracking-wide">Start Shopping for Good</span>
              <ArrowRight className="w-5 h-5 ml-3 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />

              {/* Focus ring for accessibility */}
              <div className="absolute inset-0 rounded-2xl ring-2 ring-indigo-400/30 ring-offset-2 ring-offset-slate-950 opacity-0 group-focus:opacity-100 transition-opacity"></div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Charities;