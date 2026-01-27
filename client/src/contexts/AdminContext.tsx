import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';

interface Admin {
  id: string;
  username: string;
  email: string;
  role: 'super_admin' | 'admin';
  lastLogin: Date;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  isActive: boolean;
  createdAt: Date;
}

interface Charity {
  id: string;
  name: string;
  description: string;
  website: string;
  category: string;
  isActive: boolean;
  totalReceived: number;
  createdAt: Date;
}

interface PendingItem {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  condition: string;
  images: string[];
  seller: string;
  charity: string;
  donationPercent: number;
  submittedAt: Date;
  status: 'pending' | 'approved' | 'rejected';
}

interface CarouselSlide {
  id: string;
  title: string;
  type: 'donation-counter' | 'hot-deals' | 'new-charity' | 'trending-fashion' | 'flash-sale' | 'charity-spotlight' | 'custom';
  isActive: boolean;
  order: number;
  content?: {
    heading?: string;
    subheading?: string;
    buttonText?: string;
    buttonLink?: string;
    backgroundColor?: string;
    textColor?: string;
    customImage?: string;
    images?: string[];
    customHtml?: string;
  };
  createdAt: Date;
}

interface AdminContextType {
  admin: Admin | null;
  categories: Category[];
  charities: Charity[];
  pendingItems: PendingItem[];
  carouselSlides: CarouselSlide[];
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  addCategory: (category: Omit<Category, 'id' | 'createdAt'>) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  addCharity: (charity: Omit<Charity, 'id' | 'createdAt' | 'totalReceived'>) => void;
  updateCharity: (id: string, updates: Partial<Charity>) => void;
  deleteCharity: (id: string) => void;
  approveItem: (id: string) => void;
  rejectItem: (id: string) => void;
  addCarouselSlide: (slide: Omit<CarouselSlide, 'id' | 'createdAt'>) => void;
  updateCarouselSlide: (id: string, updates: Partial<CarouselSlide>) => void;
  deleteCarouselSlide: (id: string) => void;
  reorderCarouselSlides: (slides: CarouselSlide[]) => void;
  getStats: () => {
    totalUsers: number;
    totalItems: number;
    totalSales: number;
    totalDonations: number;
    pendingApprovals: number;
  };
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [charities, setCharities] = useState<Charity[]>([]);
  const [pendingItems, setPendingItems] = useState<PendingItem[]>([]);
  const [carouselSlides, setCarouselSlides] = useState<CarouselSlide[]>([]);

  // Initialize data from localStorage or defaults
  useEffect(() => {
    const savedAdmin = localStorage.getItem('admin');
    const savedCategories = localStorage.getItem('adminCategories');
    const savedCharities = localStorage.getItem('adminCharities');
    const savedPendingItems = localStorage.getItem('adminPendingItems');
    const savedCarouselSlides = localStorage.getItem('adminCarouselSlides');

    if (savedAdmin) {
      setAdmin(JSON.parse(savedAdmin));
    }

    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    } else {
      // Default categories - removed emojis
      const defaultCategories = [
        {
          id: '1',
          name: 'Electronics',
          icon: 'Electronics',
          description: 'Phones, computers, gadgets and electronic devices',
          isActive: true,
          createdAt: new Date('2024-01-01')
        },
        {
          id: '2',
          name: 'Vehicles',
          icon: 'Vehicles',
          description: 'Cars, motorcycles, bikes and transportation',
          isActive: true,
          createdAt: new Date('2024-01-01')
        },
        {
          id: '3',
          name: 'Furniture',
          icon: 'Furniture',
          description: 'Home and office furniture',
          isActive: true,
          createdAt: new Date('2024-01-01')
        },
        {
          id: '4',
          name: 'Clothing',
          icon: 'Clothing',
          description: 'Fashion, apparel and accessories',
          isActive: true,
          createdAt: new Date('2024-01-01')
        },
        {
          id: '5',
          name: 'Books',
          icon: 'Books',
          description: 'Books, magazines and educational materials',
          isActive: true,
          createdAt: new Date('2024-01-01')
        },
        {
          id: '6',
          name: 'Sports',
          icon: 'Sports',
          description: 'Sports equipment and fitness gear',
          isActive: true,
          createdAt: new Date('2024-01-01')
        }
      ];
      setCategories(defaultCategories);
      localStorage.setItem('adminCategories', JSON.stringify(defaultCategories));
    }

    if (savedCharities) {
      setCharities(JSON.parse(savedCharities));
    } else {
      // Default charities
      const defaultCharities = [
        {
          id: '1',
          name: 'Education for All',
          description: 'Providing quality education to underprivileged children worldwide',
          website: 'https://educationforall.org',
          category: 'Education',
          isActive: true,
          totalReceived: 125000,
          createdAt: new Date('2024-01-01')
        },
        {
          id: '2',
          name: 'Habitat for Humanity',
          description: 'Building homes and communities for families in need',
          website: 'https://habitat.org',
          category: 'Housing',
          isActive: true,
          totalReceived: 98500,
          createdAt: new Date('2024-01-01')
        },
        {
          id: '3',
          name: 'Warmth for All',
          description: 'Providing clothing and shelter for homeless individuals',
          website: 'https://warmthforall.org',
          category: 'Social Services',
          isActive: true,
          totalReceived: 76200,
          createdAt: new Date('2024-01-01')
        },
        {
          id: '4',
          name: 'Arts Education',
          description: 'Supporting arts programs in schools and communities',
          website: 'https://artseducation.org',
          category: 'Education',
          isActive: true,
          totalReceived: 54300,
          createdAt: new Date('2024-01-01')
        },
        {
          id: '5',
          name: 'Tech for Kids',
          description: 'Bringing technology education to underserved youth',
          website: 'https://techforkids.org',
          category: 'Education',
          isActive: true,
          totalReceived: 43200,
          createdAt: new Date('2024-01-01')
        }
      ];
      setCharities(defaultCharities);
      localStorage.setItem('adminCharities', JSON.stringify(defaultCharities));
    }

    if (savedPendingItems) {
      setPendingItems(JSON.parse(savedPendingItems));
    } else {
      // Initialize with 3 example pending items for testing
      const examplePendingItems = [
        {
          id: '1001',
          title: 'iPhone 14 Pro Max',
          description: 'Brand new iPhone 14 Pro Max, 256GB, Space Black. Still in original packaging with all accessories.',
          price: 999,
          category: 'Electronics',
          condition: 'New',
          images: ['https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=800'],
          seller: 'TechSeller123',
          charity: 'Tech for Kids',
          donationPercent: 15,
          submittedAt: new Date('2025-01-10T10:30:00'),
          status: 'pending' as const
        },
        {
          id: '1002',
          title: 'Vintage Wooden Bookshelf',
          description: 'Beautiful handcrafted wooden bookshelf from the 1960s. Solid oak construction with 5 shelves. Perfect for any home library.',
          price: 180,
          category: 'Furniture',
          condition: 'Good',
          images: ['https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=800'],
          seller: 'VintageCollector',
          charity: 'Education for All',
          donationPercent: 20,
          submittedAt: new Date('2025-01-10T14:15:00'),
          status: 'pending' as const
        },
        {
          id: '1003',
          title: 'Professional Road Bike',
          description: 'High-end carbon fiber road bike, barely used. Perfect for serious cyclists. Includes helmet and accessories.',
          price: 850,
          category: 'Sports',
          condition: 'Like New',
          images: ['https://images.pexels.com/photos/100582/pexels-photo-100582.jpeg?auto=compress&cs=tinysrgb&w=800'],
          seller: 'CyclingPro',
          charity: 'Habitat for Humanity',
          donationPercent: 12,
          submittedAt: new Date('2025-01-10T16:45:00'),
          status: 'pending' as const
        }
      ];
      setPendingItems(examplePendingItems);
      localStorage.setItem('adminPendingItems', JSON.stringify(examplePendingItems));
    }

    if (savedCarouselSlides) {
      setCarouselSlides(JSON.parse(savedCarouselSlides));
    } else {
      // Default carousel slides
      const defaultSlides = [
        {
          id: '1',
          title: 'Live Donation Counter',
          type: 'donation-counter' as const,
          isActive: true,
          order: 1,
          createdAt: new Date('2024-01-01')
        },
        {
          id: '2',
          title: 'Hot Electronics Deals',
          type: 'hot-deals' as const,
          isActive: true,
          order: 2,
          createdAt: new Date('2024-01-01')
        },
        {
          id: '3',
          title: 'New Partner Charity',
          type: 'new-charity' as const,
          isActive: true,
          order: 3,
          createdAt: new Date('2024-01-01')
        },
        {
          id: '4',
          title: 'Trending Fashion',
          type: 'trending-fashion' as const,
          isActive: true,
          order: 4,
          createdAt: new Date('2024-01-01')
        },
        {
          id: '5',
          title: 'Flash Sale',
          type: 'flash-sale' as const,
          isActive: true,
          order: 5,
          createdAt: new Date('2024-01-01')
        },
        {
          id: '6',
          title: 'Charity Spotlight',
          type: 'charity-spotlight' as const,
          isActive: true,
          order: 6,
          createdAt: new Date('2024-01-01'),
          content: {
            heading: 'Support Education for All',
            subheading: 'Help us reach our goal',
            buttonText: 'Learn More',
            buttonLink: '/charity/education-for-all'
          }
        },
        {
          id: '7',
          title: 'Custom Advertisement',
          type: 'custom' as const,
          isActive: true,
          order: 7,
          createdAt: new Date('2024-01-01'),
          content: {
            customImage: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
            heading: 'Join Our Community',
            subheading: 'Buy and sell while supporting great causes',
            buttonText: 'Sign Up Today',
            buttonLink: '/signup',
            backgroundColor: '#4f46e5',
            textColor: '#ffffff'
          }
        }
      ];
      setCarouselSlides(defaultSlides);
      localStorage.setItem('adminCarouselSlides', JSON.stringify(defaultSlides));
    }
  }, []);

  // Listen for changes to pending items from user submissions
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'adminPendingItems' && e.newValue) {
        const updatedItems = JSON.parse(e.newValue);
        setPendingItems(updatedItems);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also check for updates periodically (for same-tab updates)
    const interval = setInterval(() => {
      const currentItems = localStorage.getItem('adminPendingItems');
      if (!currentItems) {
        return;
      }

      const parsedItems: PendingItem[] = JSON.parse(currentItems);

      setPendingItems(prevItems => {
        // If nothing meaningfully changed, bail out to avoid re-renders
        if (
          prevItems.length === parsedItems.length &&
          prevItems.every((item, index) => {
            const next = parsedItems[index];
            return (
              item.id === next.id &&
              item.status === next.status &&
              item.price === next.price &&
              item.donationPercent === next.donationPercent
            );
          })
        ) {
          return prevItems;
        }

        // SINGLE diagnostic log at the actual state change trigger
        console.log(
          '[DIAGNOSTIC] AdminContext interval updating pendingItems at',
          new Date().toISOString()
        );

        return parsedItems;
      });
    }, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // Mock admin login
      if (username === 'admin' && password === 'admin123') {
        const adminUser: Admin = {
          id: '1',
          username: 'admin',
          email: 'admin@trade2help.com',
          role: 'super_admin',
          lastLogin: new Date()
        };
        setAdmin(adminUser);
        localStorage.setItem('admin', JSON.stringify(adminUser));
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem('admin');
  };

  const addCategory = (categoryData: Omit<Category, 'id' | 'createdAt'>) => {
    const newCategory: Category = {
      ...categoryData,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    const updated = [...categories, newCategory];
    setCategories(updated);
    localStorage.setItem('adminCategories', JSON.stringify(updated));
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    const updated = categories.map(cat => 
      cat.id === id ? { ...cat, ...updates } : cat
    );
    setCategories(updated);
    localStorage.setItem('adminCategories', JSON.stringify(updated));
  };

  const deleteCategory = (id: string) => {
    const updated = categories.filter(cat => cat.id !== id);
    setCategories(updated);
    localStorage.setItem('adminCategories', JSON.stringify(updated));
  };

  const addCharity = (charityData: Omit<Charity, 'id' | 'createdAt' | 'totalReceived'>) => {
    const newCharity: Charity = {
      ...charityData,
      id: Date.now().toString(),
      totalReceived: 0,
      createdAt: new Date()
    };
    const updated = [...charities, newCharity];
    setCharities(updated);
    localStorage.setItem('adminCharities', JSON.stringify(updated));
  };

  const updateCharity = (id: string, updates: Partial<Charity>) => {
    const updated = charities.map(charity => 
      charity.id === id ? { ...charity, ...updates } : charity
    );
    setCharities(updated);
    localStorage.setItem('adminCharities', JSON.stringify(updated));
  };

  const deleteCharity = (id: string) => {
    const updated = charities.filter(charity => charity.id !== id);
    setCharities(updated);
    localStorage.setItem('adminCharities', JSON.stringify(updated));
  };

  const approveItem = (id: string) => {
    // Update pending item status
    const updated = pendingItems.map(item => 
      item.id === id ? { ...item, status: 'approved' as const } : item
    );
    setPendingItems(updated);
    localStorage.setItem('adminPendingItems', JSON.stringify(updated));

    // Update the user's listing status and add to global products
    const userListings = JSON.parse(localStorage.getItem('userListings') || '[]');
    const globalProducts = JSON.parse(localStorage.getItem('globalProducts') || '[]');
    
    const updatedUserListings = userListings.map((listing: any) => 
      listing.id === parseInt(id) ? { ...listing, status: 'active' } : listing
    );
    localStorage.setItem('userListings', JSON.stringify(updatedUserListings));

    // Add approved item to global products if not already there
    const approvedItem = userListings.find((listing: any) => listing.id === parseInt(id));
    if (approvedItem && !globalProducts.find((p: any) => p.id === parseInt(id))) {
      const updatedGlobalProducts = [...globalProducts, { ...approvedItem, status: 'active' }];
      localStorage.setItem('globalProducts', JSON.stringify(updatedGlobalProducts));
      
      // Trigger a storage event to update the AuthContext
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'globalProducts',
        newValue: JSON.stringify(updatedGlobalProducts)
      }));
    } else if (approvedItem) {
      // Update existing item in global products
      const updatedGlobalProducts = globalProducts.map((product: any) =>
        product.id === parseInt(id) ? { ...product, status: 'active' } : product
      );
      localStorage.setItem('globalProducts', JSON.stringify(updatedGlobalProducts));
      
      // Trigger a storage event to update the AuthContext
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'globalProducts',
        newValue: JSON.stringify(updatedGlobalProducts)
      }));
    }
  };

  const rejectItem = (id: string) => {
    // Update pending item status
    const updated = pendingItems.map(item => 
      item.id === id ? { ...item, status: 'rejected' as const } : item
    );
    setPendingItems(updated);
    localStorage.setItem('adminPendingItems', JSON.stringify(updated));

    // Update the user's listing status
    const userListings = JSON.parse(localStorage.getItem('userListings') || '[]');
    const updatedUserListings = userListings.map((listing: any) => 
      listing.id === parseInt(id) ? { ...listing, status: 'rejected' } : listing
    );
    localStorage.setItem('userListings', JSON.stringify(updatedUserListings));

    // Remove from global products if it exists there
    const globalProducts = JSON.parse(localStorage.getItem('globalProducts') || '[]');
    const updatedGlobalProducts = globalProducts.filter((product: any) => product.id !== parseInt(id));
    localStorage.setItem('globalProducts', JSON.stringify(updatedGlobalProducts));
    
    // Trigger a storage event to update the AuthContext
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'globalProducts',
      newValue: JSON.stringify(updatedGlobalProducts)
    }));
  };

  const addCarouselSlide = (slideData: Omit<CarouselSlide, 'id' | 'createdAt'>) => {
    const newSlide: CarouselSlide = {
      ...slideData,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    const updated = [...carouselSlides, newSlide];
    setCarouselSlides(updated);
    localStorage.setItem('adminCarouselSlides', JSON.stringify(updated));
  };

  const updateCarouselSlide = (id: string, updates: Partial<CarouselSlide>) => {
    const updated = carouselSlides.map(slide => {
      if (slide.id === id) {
        // Merge content objects if both exist
        const updatedContent = updates.content && slide.content
          ? { ...slide.content, ...updates.content }
          : updates.content || slide.content;
        
        return { 
          ...slide, 
          ...updates,
          content: updatedContent
        };
      }
      return slide;
    });
    
    setCarouselSlides(updated);
    localStorage.setItem('adminCarouselSlides', JSON.stringify(updated));
  };

  const deleteCarouselSlide = (id: string) => {
    const updated = carouselSlides.filter(slide => slide.id !== id);
    setCarouselSlides(updated);
    localStorage.setItem('adminCarouselSlides', JSON.stringify(updated));
  };

  const reorderCarouselSlides = (slides: CarouselSlide[]) => {
    setCarouselSlides(slides);
    localStorage.setItem('adminCarouselSlides', JSON.stringify(slides));
  };

  const getStats = () => ({
    totalUsers: 15420,
    totalItems: 8950,
    totalSales: 6780,
    totalDonations: 2450000,
    pendingApprovals: pendingItems.filter(item => item.status === 'pending').length
  });

  // Memoize context value to prevent unnecessary re-renders
  // Only recreate when state values change, not when functions are recreated
  const value = useMemo(() => ({
    admin,
    categories,
    charities,
    pendingItems,
    carouselSlides,
    isAuthenticated: !!admin,
    login,
    logout,
    addCategory,
    updateCategory,
    deleteCategory,
    addCharity,
    updateCharity,
    deleteCharity,
    approveItem,
    rejectItem,
    addCarouselSlide,
    updateCarouselSlide,
    deleteCarouselSlide,
    reorderCarouselSlides,
    getStats
  }), [
    // Only include state values that actually change
    admin,
    categories,
    charities,
    pendingItems,
    carouselSlides
    // Functions are excluded - they're stable in behavior even if reference changes
  ]);

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};