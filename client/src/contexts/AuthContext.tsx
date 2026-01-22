import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { login as apiLogin, getMe as apiGetMe, logout as apiLogout } from '../api/client';

// Define interfaces
interface User {
  id: string;
  email: string;
  username: string;
  role: string;
  is_verified: boolean;
  created_at: string;
}

interface CartItem {
  id: string;
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
  charity: string;
  donationPercent: number;
  seller: string;
}

interface WishlistItem {
  id: string;
  productId: string;
  title: string;
  price: number;
  image: string;
  charity: string;
  donationPercent: number;
  seller: string;
  condition: string;
  location: string;
  postedDate: string;
  originalPrice?: number;
}

interface Product {
  id: number;
  title: string;
  price: number;
  originalPrice?: number;
  images: string[];
  description: string;
  category: string;
  condition: string;
  charity: string;
  donationPercent: number;
  seller: string;
  sellerId: string;
  location: string;
  specifications?: string[];
  shipping?: {
    cost: string;
    time: string;
    protection: string;
  };
  postedDate: string;
  status: 'pending' | 'active' | 'rejected' | 'sold';
}

interface Purchase {
  id: string;
  productId: string;
  productName: string;
  price: number;
  date: string;
  status: string;
  isReviewed: boolean;
}

interface Review {
  id: string;
  productId: string;
  productTitle: string;
  sellerId: string;
  sellerName: string;
  rating: number;
  comment: string;
  date: string;
}

interface AuthContextType {
  user: User | null;
  cart: CartItem[];
  wishlist: WishlistItem[];
  userListings: Product[];
  purchases: Purchase[];
  reviews: Review[];
  allProducts: Product[];
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  addToCart: (product: Omit<CartItem, 'id'>) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  addToWishlist: (product: Omit<WishlistItem, 'id'>) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  addListing: (product: Omit<Product, 'id' | 'sellerId' | 'status'>) => void;
  updateListing: (productId: number, updates: Partial<Product>) => void;
  deleteListing: (productId: number) => void;
  markProductAsSold: (productId: number) => void;
  addPurchase: (purchase: Omit<Purchase, 'id'>) => void;
  markPurchaseAsReviewed: (purchaseId: string) => void;
  addReview: (review: Omit<Review, 'id'>) => void;
  isAuthenticated: boolean;
  requiresVerification: boolean;
  setRequiresVerification: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [userListings, setUserListings] = useState<Product[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [requiresVerification, setRequiresVerification] = useState(false);

  // Initialize data from localStorage and check authentication
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedListings = localStorage.getItem('userListings');
    const savedPurchases = localStorage.getItem('userPurchases');
    const savedReviews = localStorage.getItem('userReviews');
    const savedCart = localStorage.getItem('cart');
    const savedWishlist = localStorage.getItem('wishlist');
    const savedGlobalProducts = localStorage.getItem('globalProducts');
    const token = localStorage.getItem('auth_token');

    // If we have a token but no user data, try to fetch user data
    if (token && !savedUser) {
      apiGetMe()
        .then(currentUser => {
          setUser(currentUser);
        })
        .catch(error => {
          console.error('Failed to fetch user data:', error);
          // Token might be invalid, clear it
          apiLogout();
        });
    } else if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    if (savedListings) setUserListings(JSON.parse(savedListings));
    if (savedPurchases) setPurchases(JSON.parse(savedPurchases));
    if (savedReviews) setReviews(JSON.parse(savedReviews));
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    
    // Load global products or initialize with default data
    if (savedGlobalProducts) {
      setAllProducts(JSON.parse(savedGlobalProducts));
    } else {
      // Initialize with default products
      const defaultProducts: Product[] = [
        {
          id: 1,
          title: 'MacBook Pro 2023',
          price: 1899,
          originalPrice: 2199,
          images: ['https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=800'],
          description: 'Excellent condition MacBook Pro with M2 chip, 16GB RAM, 512GB SSD. Perfect for professionals and students.',
          category: 'Electronics',
          condition: 'Like New',
          charity: 'Education for All',
          donationPercent: 10,
          seller: 'TechDeals',
          sellerId: 'seller_1',
          location: 'San Francisco, CA',
          specifications: ['M2 Chip', '16GB RAM', '512GB SSD', '13-inch Display'],
          shipping: {
            cost: 'Free shipping',
            time: '2-3 business days',
            protection: 'Full buyer protection'
          },
          postedDate: '2025-01-08',
          status: 'active'
        },
        {
          id: 2,
          title: 'Vintage Leather Sofa',
          price: 450,
          originalPrice: 800,
          images: ['https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=800'],
          description: 'Beautiful vintage leather sofa in excellent condition. Comfortable and stylish, perfect for any living room.',
          category: 'Furniture',
          condition: 'Excellent',
          charity: 'Habitat for Humanity',
          donationPercent: 15,
          seller: 'FurnitureLovers',
          sellerId: 'seller_2',
          location: 'Los Angeles, CA',
          specifications: ['Genuine Leather', '3-Seater', 'Brown Color'],
          shipping: {
            cost: '$50 shipping',
            time: '5-7 business days',
            protection: 'Full buyer protection'
          },
          postedDate: '2025-01-07',
          status: 'active'
        },
        {
          id: 3,
          title: 'Designer Winter Coat',
          price: 120,
          originalPrice: 300,
          images: ['https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=800'],
          description: 'Stylish designer winter coat, size M. Warm and fashionable, perfect for cold weather.',
          category: 'Clothing',
          condition: 'Good',
          charity: 'Warmth for All',
          donationPercent: 20,
          seller: 'FashionForward',
          sellerId: 'seller_3',
          location: 'New York, NY',
          specifications: ['Size M', 'Water Resistant', 'Down Filled'],
          shipping: {
            cost: 'Free shipping',
            time: '3-5 business days',
            protection: 'Full buyer protection'
          },
          postedDate: '2025-01-06',
          status: 'active'
        },
        {
          id: 4,
          title: 'Professional Camera Kit',
          price: 650,
          originalPrice: 900,
          images: ['https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=800'],
          description: 'Complete camera kit with lenses and accessories. Perfect for photography enthusiasts.',
          category: 'Electronics',
          condition: 'Excellent',
          charity: 'Arts Education',
          donationPercent: 12,
          seller: 'PhotoPro',
          sellerId: 'seller_4',
          location: 'Chicago, IL',
          specifications: ['DSLR Camera', '2 Lenses', 'Tripod', 'Camera Bag'],
          shipping: {
            cost: 'Free shipping',
            time: '2-4 business days',
            protection: 'Full buyer protection'
          },
          postedDate: '2025-01-05',
          status: 'active'
        },
        {
          id: 5,
          title: 'Gaming Setup Complete',
          price: 1200,
          originalPrice: 1800,
          images: ['https://images.pexels.com/photos/2047905/pexels-photo-2047905.jpeg?auto=compress&cs=tinysrgb&w=800'],
          description: 'Complete gaming setup with high-end PC, monitor, keyboard, and mouse. Ready to game!',
          category: 'Electronics',
          condition: 'Like New',
          charity: 'Tech for Kids',
          donationPercent: 8,
          seller: 'GamerHub',
          sellerId: 'seller_5',
          location: 'Austin, TX',
          specifications: ['Gaming PC', '27" Monitor', 'Mechanical Keyboard', 'Gaming Mouse'],
          shipping: {
            cost: '$75 shipping',
            time: '5-7 business days',
            protection: 'Full buyer protection'
          },
          postedDate: '2025-01-04',
          status: 'active'
        },
        {
          id: 6,
          title: 'Acoustic Guitar',
          price: 280,
          originalPrice: 450,
          images: ['https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg?auto=compress&cs=tinysrgb&w=800'],
          description: 'Beautiful acoustic guitar in great condition. Perfect for beginners and experienced players.',
          category: 'Sports',
          condition: 'Good',
          charity: 'Arts Education',
          donationPercent: 18,
          seller: 'MusicMaker',
          sellerId: 'seller_6',
          location: 'Nashville, TN',
          specifications: ['Steel Strings', 'Spruce Top', 'Mahogany Back'],
          shipping: {
            cost: '$25 shipping',
            time: '3-5 business days',
            protection: 'Full buyer protection'
          },
          postedDate: '2025-01-03',
          status: 'active'
        },
        {
          id: 7,
          title: 'Dining Table Set',
          price: 350,
          originalPrice: 600,
          images: ['https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=800'],
          description: 'Solid wood dining table with 4 chairs. Perfect for family meals and entertaining.',
          category: 'Furniture',
          condition: 'Good',
          charity: 'Habitat for Humanity',
          donationPercent: 12,
          seller: 'HomeDecor',
          sellerId: 'seller_7',
          location: 'Denver, CO',
          specifications: ['Solid Wood', '4 Chairs Included', 'Seats 6 People'],
          shipping: {
            cost: '$100 shipping',
            time: '7-10 business days',
            protection: 'Full buyer protection'
          },
          postedDate: '2025-01-02',
          status: 'active'
        },
        {
          id: 8,
          title: 'Designer Handbag',
          price: 180,
          originalPrice: 350,
          images: ['https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=800'],
          description: 'Authentic designer handbag in excellent condition. Stylish and practical.',
          category: 'Clothing',
          condition: 'Excellent',
          charity: 'Warmth for All',
          donationPercent: 15,
          seller: 'LuxuryFinds',
          sellerId: 'seller_8',
          location: 'Miami, FL',
          specifications: ['Genuine Leather', 'Multiple Compartments', 'Adjustable Strap'],
          shipping: {
            cost: 'Free shipping',
            time: '2-3 business days',
            protection: 'Full buyer protection'
          },
          postedDate: '2025-01-01',
          status: 'active'
        }
      ];
      setAllProducts(defaultProducts);
      localStorage.setItem('globalProducts', JSON.stringify(defaultProducts));
    }
  }, []);

  // Listen for changes to globalProducts from admin actions
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'globalProducts' && e.newValue) {
        const updatedProducts = JSON.parse(e.newValue);
        setAllProducts(updatedProducts);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also check for updates periodically (for same-tab updates)
    const interval = setInterval(() => {
      const currentProducts = localStorage.getItem('globalProducts');
      if (currentProducts) {
        const parsedProducts = JSON.parse(currentProducts);
        setAllProducts(parsedProducts);
      }
    }, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  }, [user]);

  useEffect(() => {
    localStorage.setItem('userListings', JSON.stringify(userListings));
  }, [userListings]);

  useEffect(() => {
    localStorage.setItem('userPurchases', JSON.stringify(purchases));
  }, [purchases]);

  useEffect(() => {
    localStorage.setItem('userReviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Save allProducts to globalProducts in localStorage
  useEffect(() => {
    localStorage.setItem('globalProducts', JSON.stringify(allProducts));
  }, [allProducts]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Call API to login and get token
      const userData = await apiLogin(email, password);

      // Fetch current user data
      const currentUser = await apiGetMe();

      // Update user state
      setUser(currentUser);

      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    // Mock signup logic
    const mockUser: User = {
      id: Date.now().toString(),
      email,
      username: name,
      isVerified: false
    };
    setUser(mockUser);
    setRequiresVerification(true);
    return true;
  };

  const logout = () => {
    // Call API to clear token
    apiLogout();

    // Clear user state
    setUser(null);
    setCart([]);
    setWishlist([]);
    setUserListings([]);
    setPurchases([]);
    setReviews([]);
    setRequiresVerification(false);
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  const addToCart = (product: Omit<CartItem, 'id'>) => {
    // Convert productId to string for consistent comparison
    const productIdStr = product.productId.toString();
    
    // Check if item already exists in cart
    const existingItemIndex = cart.findIndex(item => item.productId === productIdStr);
    
    if (existingItemIndex >= 0) {
      // Update quantity of existing item
      const updatedCart = [...cart];
      updatedCart[existingItemIndex] = {
        ...updatedCart[existingItemIndex],
        quantity: updatedCart[existingItemIndex].quantity + product.quantity
      };
      setCart(updatedCart);
    } else {
      // Add new item to cart
      const newCartItem: CartItem = {
        ...product,
        id: `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        productId: productIdStr
      };
      setCart(prevCart => [...prevCart, newCartItem]);
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.productId !== productId.toString()));
  };

  const clearCart = () => {
    setCart([]);
  };

  const addToWishlist = (product: Omit<WishlistItem, 'id'>) => {
    const productIdStr = product.productId.toString();
    if (!isInWishlist(productIdStr)) {
      const newWishlistItem: WishlistItem = {
        ...product,
        id: `wishlist_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        productId: productIdStr
      };
      setWishlist(prevWishlist => [...prevWishlist, newWishlistItem]);
    }
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist(prevWishlist => prevWishlist.filter(item => item.productId !== productId.toString()));
  };

  const isInWishlist = (productId: string): boolean => {
    return wishlist.some(item => item.productId === productId.toString());
  };

  const addListing = (product: Omit<Product, 'id' | 'sellerId' | 'status'>) => {
    if (user) {
      const newId = Date.now();
      const newListing: Product = {
        ...product,
        id: newId,
        sellerId: user.id,
        status: 'pending' // Set initial status to pending
      };
      
      // Add to user listings
      setUserListings([...userListings, newListing]);
      
      // Add to admin pending items for review
      const currentPendingItems = JSON.parse(localStorage.getItem('adminPendingItems') || '[]');
      const pendingItem = {
        id: newId.toString(),
        title: product.title,
        description: product.description,
        price: product.price,
        category: product.category,
        condition: product.condition,
        images: product.images,
        seller: user.username,
        charity: product.charity,
        donationPercent: product.donationPercent,
        submittedAt: new Date(),
        status: 'pending'
      };
      
      currentPendingItems.push(pendingItem);
      localStorage.setItem('adminPendingItems', JSON.stringify(currentPendingItems));
      
      // Trigger storage event for admin to pick up the change
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'adminPendingItems',
        newValue: JSON.stringify(currentPendingItems)
      }));
    }
  };

  const updateListing = (productId: number, updates: Partial<Product>) => {
    setUserListings(userListings.map(product =>
      product.id === productId ? { ...product, ...updates } : product
    ));
    
    // Also update in global products if it exists there
    const currentGlobalProducts = JSON.parse(localStorage.getItem('globalProducts') || '[]');
    const updatedGlobalProducts = currentGlobalProducts.map((product: Product) =>
      product.id === productId ? { ...product, ...updates } : product
    );
    localStorage.setItem('globalProducts', JSON.stringify(updatedGlobalProducts));
    setAllProducts(updatedGlobalProducts);
  };

  const deleteListing = (productId: number) => {
    setUserListings(userListings.filter(product => product.id !== productId));
    
    // Also remove from global products
    const currentGlobalProducts = JSON.parse(localStorage.getItem('globalProducts') || '[]');
    const updatedGlobalProducts = currentGlobalProducts.filter((product: Product) => product.id !== productId);
    localStorage.setItem('globalProducts', JSON.stringify(updatedGlobalProducts));
    setAllProducts(updatedGlobalProducts);
  };

  const markProductAsSold = (productId: number) => {
    updateListing(productId, { status: 'sold' });
  };

  const addPurchase = (purchase: Omit<Purchase, 'id'>) => {
    setPurchases([...purchases, { ...purchase, id: Date.now().toString() }]);
  };

  const markPurchaseAsReviewed = (purchaseId: string) => {
    setPurchases(purchases.map(purchase =>
      purchase.id === purchaseId ? { ...purchase, isReviewed: true } : purchase
    ));
  };

  const addReview = (review: Omit<Review, 'id'>) => {
    setReviews([...reviews, { ...review, id: Date.now().toString() }]);
  };

  const value = {
    user,
    cart,
    wishlist,
    userListings,
    purchases,
    reviews,
    allProducts,
    login,
    signup,
    logout,
    updateUser,
    addToCart,
    removeFromCart,
    clearCart,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    addListing,
    updateListing,
    deleteListing,
    markProductAsSold,
    addPurchase,
    markPurchaseAsReviewed,
    addReview,
    isAuthenticated: !!user,
    requiresVerification,
    setRequiresVerification
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};