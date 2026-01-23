import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { login as apiLogin, getMe as apiGetMe, logout as apiLogout, register as apiRegister, getAllProducts as apiGetAllProducts } from '../api/client';

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
  
  // DIAGNOSTIC: Log when allProducts state changes
  useEffect(() => {
    console.log('[DIAGNOSTIC] allProducts state CHANGED - new length:', allProducts.length);
    console.log('[DIAGNOSTIC] allProducts state CHANGED - new reference:', allProducts);
    console.log('[DIAGNOSTIC] allProducts state CHANGED - timestamp:', new Date().toISOString());
    if (allProducts.length > 0) {
      console.log('[DIAGNOSTIC] allProducts state CHANGED - first product ID:', allProducts[0].id);
      console.log('[DIAGNOSTIC] allProducts state CHANGED - first product images:', allProducts[0].images);
    }
  }, [allProducts]);
  const [requiresVerification, setRequiresVerification] = useState(false);

  // Initialize data from localStorage and check authentication
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedListings = localStorage.getItem('userListings');
    const savedPurchases = localStorage.getItem('userPurchases');
    const savedReviews = localStorage.getItem('userReviews');
    const savedCart = localStorage.getItem('cart');
    const savedWishlist = localStorage.getItem('wishlist');
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
  }, []);

  // Load products ONCE on mount - no localStorage, no updates, no listeners
  useEffect(() => {
    console.log('[DIAGNOSTIC] loadProducts useEffect RUNNING at:', new Date().toISOString());
    const loadProducts = async () => {
      try {
        console.log('[DIAGNOSTIC] loadProducts - Fetching from API...');
        const apiProducts = await apiGetAllProducts();
        console.log('[DIAGNOSTIC] loadProducts - Received', apiProducts.length, 'products from API');

        // Transform backend product shape to frontend shape
        const transformedProducts: Product[] = apiProducts.map(apiProduct => ({
          id: apiProduct.id,
          title: apiProduct.title,
          price: Number(apiProduct.price),
          images: apiProduct.product_images
            .sort((a, b) => a.position - b.position)
            .map(img => img.image_url),
          description: apiProduct.description || '',
          category: apiProduct.category?.name || 'Uncategorized',
          condition: apiProduct.condition || 'Used',
          charity: apiProduct.charity?.name || '',
          donationPercent: Number(apiProduct.donation_percent) || 0,
          seller: apiProduct.seller?.username || 'Unknown Seller',
          sellerId: apiProduct.seller?.id || '',
          location: 'Remote',
          specifications: [],
          shipping: {
            cost: 'Contact seller',
            time: 'Varies',
            protection: 'Seller protection'
          },
          postedDate: apiProduct.created_at ? new Date(apiProduct.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          status: apiProduct.status as 'active' | 'pending' | 'rejected' | 'sold',
        }));

        console.log('[DIAGNOSTIC] loadProducts - About to call setAllProducts with', transformedProducts.length, 'products');
        console.log('[DIAGNOSTIC] loadProducts - First product images:', transformedProducts[0]?.images);
        // Set products ONCE - no localStorage, no comparison, no refs
        setAllProducts(transformedProducts);
        console.log('[DIAGNOSTIC] loadProducts - setAllProducts called');
      } catch (error) {
        console.error('[DIAGNOSTIC] loadProducts - Failed to fetch products from API:', error);
        // Set empty array on error - no fallbacks
        setAllProducts([]);
      }
    };

    loadProducts();
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

  const signup = async (formData: { email: string; username: string; password: string }): Promise<boolean> => {
    try {
      // Call API to register user
      await apiRegister(formData.email, formData.username, formData.password);

      // Registration successful, set verification required
      setRequiresVerification(true);
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    }
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
    // Products are read-only - no updates to allProducts
  };

  const deleteListing = (productId: number) => {
    setUserListings(userListings.filter(product => product.id !== productId));
    // Products are read-only - no updates to allProducts
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

  // Memoize the context value to prevent unnecessary re-renders
  // Only recreate when actual state values change, not when functions are recreated
  // Functions are stable in behavior (they don't change their logic), so we exclude them from deps
  const value = useMemo(() => ({
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
  }), [
    // Only include state values that actually change
    user,
    cart,
    wishlist,
    userListings,
    purchases,
    reviews,
    allProducts,
    requiresVerification
    // Functions are excluded - they're stable in behavior even if reference changes
  ]);

  // DIAGNOSTIC: Log when provider value is created
  console.log('[DIAGNOSTIC] AuthContext Provider render - allProducts length:', allProducts.length);
  console.log('[DIAGNOSTIC] AuthContext Provider render - allProducts reference:', allProducts);
  console.log('[DIAGNOSTIC] AuthContext Provider render - value object created at:', new Date().toISOString());
  console.log('[DIAGNOSTIC] AuthContext Provider render - value.allProducts reference:', value.allProducts);
  console.log('[DIAGNOSTIC] AuthContext Provider render - value.allProducts === allProducts:', value.allProducts === allProducts);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};