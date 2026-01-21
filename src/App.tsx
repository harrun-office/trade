import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AdminProvider } from './contexts/AdminContext';
import { ChatProvider } from './contexts/ChatContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { EscrowProvider } from './contexts/EscrowContext';
import { CurrencyProvider } from './contexts/CurrencyContext';
import ScrollToTop from './components/ScrollToTop';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Verification from './pages/Verification';
import Dashboard from './pages/Dashboard';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import AdminPanel from './pages/AdminPanel';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import UserProfile from './pages/UserProfile';
import SellProduct from './pages/SellProduct';
import SearchResults from './pages/SearchResults';
import Payment from './pages/Payment';
import OrderConfirmation from './pages/OrderConfirmation';
import OrderTracking from './pages/OrderTracking';
import Charities from './pages/Charities';
import CharityDetails from './pages/CharityDetails';
import About from './pages/About';
import Settings from './pages/Settings';
import DonationAnalytics from './pages/DonationAnalytics';
import SellerAnalytics from './pages/SellerAnalytics';

const AppContent: React.FC = () => {
  const location = useLocation();
  const hideHeaderFooter = ['/login', '/signup', '/admin/login', '/verify'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors">
      {!hideHeaderFooter && <Header />}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify" element={<Verification />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/profile/:id" element={<UserProfile />} />
          <Route path="/sell" element={<SellProduct />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/order/:orderId" element={<OrderTracking />} />
          <Route path="/charities" element={<Charities />} />
          <Route path="/charity/:id" element={<CharityDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/donation-analytics" element={<DonationAnalytics />} />
          <Route path="/seller-analytics" element={<SellerAnalytics />} />
        </Routes>
      </main>
      {!hideHeaderFooter && <Footer />}
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AdminProvider>
          <ChatProvider>
            <EscrowProvider>
              <CurrencyProvider>
                <Router>
                  <ScrollToTop />
                  <AppContent />
                </Router>
              </CurrencyProvider>
            </EscrowProvider>
          </ChatProvider>
        </AdminProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;




