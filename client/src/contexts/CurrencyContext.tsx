import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, ReactNode } from 'react';

interface Currency {
  code: string;
  name: string;
  symbol: string;
  exchangeRate: number;
  country: string;
}

interface CurrencyContextType {
  selectedCurrency: Currency;
  currencies: Currency[];
  changeCurrency: (currencyCode: string) => void;
  convertPrice: (price: number) => number;
  formatPrice: (price: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// Available currencies with exchange rates (in real app, these would come from API)
// Moved outside component to prevent recreation on every render
const CURRENCIES: Currency[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', exchangeRate: 1.0, country: 'United States' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', exchangeRate: 1.35, country: 'Canada' },
  { code: 'GBP', name: 'British Pound', symbol: '£', exchangeRate: 0.79, country: 'United Kingdom' },
  { code: 'EUR', name: 'Euro', symbol: '€', exchangeRate: 0.92, country: 'European Union' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', exchangeRate: 1.52, country: 'Australia' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', exchangeRate: 149.50, country: 'Japan' },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM', exchangeRate: 4.72, country: 'Malaysia' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', exchangeRate: 1.34, country: 'Singapore' }
];

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

export const CurrencyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(CURRENCIES[0]); // Default to USD

  // Load saved currency preference
  useEffect(() => {
    const savedCurrency = localStorage.getItem('selectedCurrency');
    if (savedCurrency) {
      const currency = CURRENCIES.find(c => c.code === savedCurrency);
      if (currency) {
        setSelectedCurrency(currency);
      }
    }
  }, []);

  const changeCurrency = useCallback((currencyCode: string) => {
    const currency = CURRENCIES.find(c => c.code === currencyCode);
    if (currency) {
      setSelectedCurrency(currency);
      localStorage.setItem('selectedCurrency', currencyCode);
    }
  }, []);

  const convertPrice = useCallback((price: number): number => {
    return price * selectedCurrency.exchangeRate;
  }, [selectedCurrency.exchangeRate]);

  const formatPrice = useCallback((price: number): string => {
    const convertedPrice = convertPrice(price);
    
    // Format based on currency
    if (selectedCurrency.code === 'JPY') {
      return `${selectedCurrency.symbol}${Math.round(convertedPrice).toLocaleString()}`;
    } else {
      return `${selectedCurrency.symbol}${convertedPrice.toFixed(2)}`;
    }
  }, [selectedCurrency.code, selectedCurrency.symbol, convertPrice]);

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    selectedCurrency,
    currencies: CURRENCIES,
    changeCurrency,
    convertPrice,
    formatPrice
  }), [selectedCurrency, changeCurrency, convertPrice, formatPrice]);

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};