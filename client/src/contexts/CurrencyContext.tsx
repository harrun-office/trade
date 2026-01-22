import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

export const CurrencyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Available currencies with exchange rates (in real app, these would come from API)
  const currencies: Currency[] = [
    { code: 'USD', name: 'US Dollar', symbol: '$', exchangeRate: 1.0, country: 'United States' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', exchangeRate: 1.35, country: 'Canada' },
    { code: 'GBP', name: 'British Pound', symbol: '£', exchangeRate: 0.79, country: 'United Kingdom' },
    { code: 'EUR', name: 'Euro', symbol: '€', exchangeRate: 0.92, country: 'European Union' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', exchangeRate: 1.52, country: 'Australia' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥', exchangeRate: 149.50, country: 'Japan' },
    { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM', exchangeRate: 4.72, country: 'Malaysia' },
    { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', exchangeRate: 1.34, country: 'Singapore' }
  ];

  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(currencies[0]); // Default to USD

  // Load saved currency preference
  useEffect(() => {
    const savedCurrency = localStorage.getItem('selectedCurrency');
    if (savedCurrency) {
      const currency = currencies.find(c => c.code === savedCurrency);
      if (currency) {
        setSelectedCurrency(currency);
      }
    }
  }, []);

  const changeCurrency = (currencyCode: string) => {
    const currency = currencies.find(c => c.code === currencyCode);
    if (currency) {
      setSelectedCurrency(currency);
      localStorage.setItem('selectedCurrency', currencyCode);
    }
  };

  const convertPrice = (price: number): number => {
    return price * selectedCurrency.exchangeRate;
  };

  const formatPrice = (price: number): string => {
    const convertedPrice = convertPrice(price);
    
    // Format based on currency
    if (selectedCurrency.code === 'JPY') {
      return `${selectedCurrency.symbol}${Math.round(convertedPrice).toLocaleString()}`;
    } else {
      return `${selectedCurrency.symbol}${convertedPrice.toFixed(2)}`;
    }
  };

  const value = {
    selectedCurrency,
    currencies,
    changeCurrency,
    convertPrice,
    formatPrice
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};