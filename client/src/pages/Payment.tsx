import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Lock, Heart, CheckCircle, Truck, Package, Clock, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useEscrow } from '../contexts/EscrowContext';
import { useCurrency } from '../contexts/CurrencyContext';

const Payment: React.FC = () => {
  const navigate = useNavigate();
  const { user, cart, clearCart } = useAuth();
  const { createEscrowOrder } = useEscrow();
  const { formatPrice } = useCurrency();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [selectedShipping, setSelectedShipping] = useState('standard');
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    billingAddress: '',
    city: '',
    state: '',
    zipCode: '',
    shippingAddress: '',
    shippingCity: '',
    shippingState: '',
    shippingZipCode: '',
    sameAsBilling: true
  });
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const shippingOptions = [
    {
      id: 'standard',
      name: 'Standard Shipping',
      description: '5-7 business days',
      price: 0,
      icon: Package,
      courier: 'Standard Post'
    },
    {
      id: 'express',
      name: 'Express Shipping',
      description: '2-3 business days',
      price: 15.99,
      icon: Truck,
      courier: 'FastTrack Express'
    },
    {
      id: 'overnight',
      name: 'Overnight Delivery',
      description: 'Next business day',
      price: 29.99,
      icon: Clock,
      courier: 'QuickCourier'
    }
  ];

  // Calculate cart totals with quantity
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalDonation = cart.reduce((sum, item) => 
    sum + (item.price * item.quantity * item.donationPercent / 100), 0
  );
  const selectedShippingOption = shippingOptions.find(option => option.id === selectedShipping);
  const shippingCost = selectedShippingOption?.price || 0;
  const total = subtotal + shippingCost;

  // Validation functions
  const validateCardNumber = (cardNumber: string): string => {
    const cleaned = cardNumber.replace(/\s/g, '');
    if (!cleaned) return 'Card number is required';
    if (cleaned.length < 13 || cleaned.length > 19) return 'Card number must be 13-19 digits';
    if (!/^\d+$/.test(cleaned)) return 'Card number must contain only digits';
    return '';
  };

  const validateExpiryDate = (expiryDate: string): string => {
    if (!expiryDate) return 'Expiry date is required';
    const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!regex.test(expiryDate)) return 'Expiry date must be in MM/YY format';
    
    const [month, year] = expiryDate.split('/');
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;
    
    const expYear = parseInt(year);
    const expMonth = parseInt(month);
    
    if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
      return 'Card has expired';
    }
    
    return '';
  };

  const validateCVV = (cvv: string): string => {
    if (!cvv) return 'CVV is required';
    if (!/^\d{3,4}$/.test(cvv)) return 'CVV must be 3-4 digits';
    return '';
  };

  const validateEmail = (email: string): string => {
    if (!email) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return '';
  };

  const validateZipCode = (zipCode: string): string => {
    if (!zipCode) return 'ZIP code is required';
    if (!/^\d{5}(-\d{4})?$/.test(zipCode)) return 'Please enter a valid ZIP code';
    return '';
  };

  const validateRequired = (value: string, fieldName: string): string => {
    if (!value.trim()) return `${fieldName} is required`;
    return '';
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Card validation (only if card payment method is selected)
    if (paymentMethod === 'card') {
      newErrors.cardNumber = validateCardNumber(formData.cardNumber);
      newErrors.expiryDate = validateExpiryDate(formData.expiryDate);
      newErrors.cvv = validateCVV(formData.cvv);
      newErrors.cardName = validateRequired(formData.cardName, 'Name on card');
    }

    // Billing address validation
    newErrors.billingAddress = validateRequired(formData.billingAddress, 'Billing address');
    newErrors.city = validateRequired(formData.city, 'City');
    newErrors.state = validateRequired(formData.state, 'State');
    newErrors.zipCode = validateZipCode(formData.zipCode);

    // Shipping address validation (only if different from billing)
    if (!formData.sameAsBilling) {
      newErrors.shippingAddress = validateRequired(formData.shippingAddress, 'Shipping address');
      newErrors.shippingCity = validateRequired(formData.shippingCity, 'Shipping city');
      newErrors.shippingState = validateRequired(formData.shippingState, 'Shipping state');
      newErrors.shippingZipCode = validateZipCode(formData.shippingZipCode);
    }

    // Remove empty errors
    Object.keys(newErrors).forEach(key => {
      if (!newErrors[key]) delete newErrors[key];
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
      
      // Clear shipping address errors if same as billing is checked
      if (name === 'sameAsBilling' && checked) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.shippingAddress;
          delete newErrors.shippingCity;
          delete newErrors.shippingState;
          delete newErrors.shippingZipCode;
          return newErrors;
        });
      }
    } else {
      let processedValue = value;
      
      // Format card number with spaces
      if (name === 'cardNumber') {
        processedValue = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
        if (processedValue.length > 23) processedValue = processedValue.slice(0, 23); // Max 19 digits + 4 spaces
      }
      
      // Format expiry date
      if (name === 'expiryDate') {
        processedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
        if (processedValue.length > 5) processedValue = processedValue.slice(0, 5);
      }
      
      // Format CVV (numbers only)
      if (name === 'cvv') {
        processedValue = value.replace(/\D/g, '').slice(0, 4);
      }
      
      // Format ZIP code (numbers and dash only)
      if (name === 'zipCode' || name === 'shippingZipCode') {
        processedValue = value.replace(/[^\d-]/g, '');
      }
      
      setFormData(prev => ({
        ...prev,
        [name]: processedValue
      }));
      
      // Mark field as touched
      setTouched(prev => ({ ...prev, [name]: true }));
      
      // Clear error for this field if it exists
      if (errors[name]) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // Validate individual field on blur
    let error = '';
    switch (name) {
      case 'cardNumber':
        error = validateCardNumber(formData.cardNumber);
        break;
      case 'expiryDate':
        error = validateExpiryDate(formData.expiryDate);
        break;
      case 'cvv':
        error = validateCVV(formData.cvv);
        break;
      case 'zipCode':
      case 'shippingZipCode':
        error = validateZipCode(formData[name as keyof typeof formData] as string);
        break;
      default:
        if (formData[name as keyof typeof formData]) {
          error = validateRequired(formData[name as keyof typeof formData] as string, name);
        }
    }
    
    if (error) {
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    // Mark all fields as touched
    const allFields = Object.keys(formData);
    setTouched(allFields.reduce((acc, field) => ({ ...acc, [field]: true }), {}));
    
    // Validate form
    if (!validateForm()) {
      // Scroll to first error
      const firstErrorField = Object.keys(errors)[0];
      const element = document.getElementById(firstErrorField);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
      }
      return;
    }
    
    setProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create escrow orders for each cart item
      const orderIds: string[] = [];
      
      for (const item of cart) {
        const orderId = createEscrowOrder({
          productId: parseInt(item.productId),
          productTitle: item.title,
          productImage: item.image,
          buyerId: user.id,
          buyerName: user.username,
          sellerId: 'seller_' + item.productId, // In real app, this would come from the product data
          sellerName: item.seller,
          price: item.price,
          quantity: item.quantity,
          total: item.price * item.quantity,
          charity: item.charity,
          donationPercent: item.donationPercent,
          donationAmount: (item.price * item.quantity * item.donationPercent / 100)
        });
        orderIds.push(orderId);
      }
      
      // Clear cart after successful payment
      clearCart();
      
      setProcessing(false);
      
      // Navigate to order confirmation with order IDs
      navigate('/order-confirmation', { 
        state: { 
          orderIds,
          message: 'Payment successful! Your funds are held in escrow until delivery is confirmed.'
        }
      });
    } catch (error) {
      setProcessing(false);
      alert('Payment failed. Please try again.');
    }
  };

  const getFieldError = (fieldName: string): string => {
    return touched[fieldName] ? errors[fieldName] || '' : '';
  };

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 dark:bg-gray-900 min-h-screen transition-colors">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Secure Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Payment Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6" id="payment-form">
            {/* Form Validation Summary */}
            {hasErrors && Object.keys(touched).length > 0 && (
              <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Please fix the following errors:</h3>
                </div>
                <ul className="text-sm text-red-700 dark:text-red-300 list-disc list-inside">
                  {Object.entries(errors).map(([field, error]) => (
                    <li key={field}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Escrow Protection Notice */}
            <div className="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg p-6">
              <div className="flex items-center mb-3">
                <Lock className="w-6 h-6 text-green-600 dark:text-green-400 mr-3" />
                <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">🛡️ Escrow Protection</h3>
              </div>
              <div className="text-green-700 dark:text-green-300 text-sm space-y-2">
                <p><strong>Your payment is 100% protected:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Funds are held securely in escrow until delivery is confirmed</li>
                  <li>Seller has 3 days to ship with tracking number</li>
                  <li>You have 72 hours after delivery to report any issues</li>
                  <li>Full refund if item doesn't match description</li>
                  <li>Automatic charity donation upon successful completion</li>
                </ul>
              </div>
            </div>

            {/* Shipping Options */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Shipping Options</h2>
              
              <div className="space-y-4">
                {shippingOptions.map((option) => {
                  const IconComponent = option.icon;
                  return (
                    <label key={option.id} className="flex items-center p-4 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <input
                        type="radio"
                        name="shippingOption"
                        value={option.id}
                        checked={selectedShipping === option.id}
                        onChange={(e) => setSelectedShipping(e.target.value)}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500"
                        required
                      />
                      <IconComponent className="w-5 h-5 text-gray-600 dark:text-gray-400 ml-3 mr-3" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-900 dark:text-white">{option.name}</span>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {option.price === 0 ? 'Free' : formatPrice(option.price)}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {option.description} • via {option.courier}
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Shipping Address</h2>
              
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="sameAsBilling"
                    checked={formData.sameAsBilling}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 dark:border-gray-600 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Same as billing address</span>
                </label>
              </div>

              {!formData.sameAsBilling && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label htmlFor="shippingAddress" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Address *
                    </label>
                    <input
                      type="text"
                      id="shippingAddress"
                      name="shippingAddress"
                      required={!formData.sameAsBilling}
                      value={formData.shippingAddress}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={`w-full border rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        getFieldError('shippingAddress') ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder="123 Main Street"
                    />
                    {getFieldError('shippingAddress') && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{getFieldError('shippingAddress')}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="shippingCity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      id="shippingCity"
                      name="shippingCity"
                      required={!formData.sameAsBilling}
                      value={formData.shippingCity}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={`w-full border rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        getFieldError('shippingCity') ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder="San Francisco"
                    />
                    {getFieldError('shippingCity') && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{getFieldError('shippingCity')}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="shippingState" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      State *
                    </label>
                    <select
                      id="shippingState"
                      name="shippingState"
                      required={!formData.sameAsBilling}
                      value={formData.shippingState}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={`w-full border rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        getFieldError('shippingState') ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      <option value="">Select State</option>
                      <option value="CA">California</option>
                      <option value="NY">New York</option>
                      <option value="TX">Texas</option>
                      <option value="FL">Florida</option>
                      <option value="IL">Illinois</option>
                      <option value="PA">Pennsylvania</option>
                      <option value="OH">Ohio</option>
                      <option value="GA">Georgia</option>
                      <option value="NC">North Carolina</option>
                      <option value="MI">Michigan</option>
                    </select>
                    {getFieldError('shippingState') && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{getFieldError('shippingState')}</p>
                    )}
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="shippingZipCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      id="shippingZipCode"
                      name="shippingZipCode"
                      required={!formData.sameAsBilling}
                      value={formData.shippingZipCode}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={`w-full border rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        getFieldError('shippingZipCode') ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder="94102"
                    />
                    {getFieldError('shippingZipCode') && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{getFieldError('shippingZipCode')}</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Payment Method</h2>
              
              <div className="space-y-4">
                <label className="flex items-center p-4 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500"
                    required
                  />
                  <CreditCard className="w-5 h-5 text-gray-600 dark:text-gray-400 ml-3 mr-2" />
                  <span className="font-medium text-gray-900 dark:text-white">Credit/Debit Card</span>
                </label>
                
                <label className="flex items-center p-4 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="paypal"
                    checked={paymentMethod === 'paypal'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500"
                  />
                  <div className="w-5 h-5 bg-blue-600 rounded ml-3 mr-2"></div>
                  <span className="font-medium text-gray-900 dark:text-white">PayPal</span>
                </label>
              </div>
            </div>

            {/* Card Details */}
            {paymentMethod === 'card' && (
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Card Details</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Card Number *
                    </label>
                    <input
                      type="text"
                      id="cardNumber"
                      name="cardNumber"
                      required
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      placeholder="1234 5678 9012 3456"
                      className={`w-full border rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        getFieldError('cardNumber') ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                      }`}
                    />
                    {getFieldError('cardNumber') && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{getFieldError('cardNumber')}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Expiry Date *
                    </label>
                    <input
                      type="text"
                      id="expiryDate"
                      name="expiryDate"
                      required
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      placeholder="MM/YY"
                      className={`w-full border rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        getFieldError('expiryDate') ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                      }`}
                    />
                    {getFieldError('expiryDate') && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{getFieldError('expiryDate')}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      CVV *
                    </label>
                    <input
                      type="text"
                      id="cvv"
                      name="cvv"
                      required
                      value={formData.cvv}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      placeholder="123"
                      className={`w-full border rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        getFieldError('cvv') ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                      }`}
                    />
                    {getFieldError('cvv') && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{getFieldError('cvv')}</p>
                    )}
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Name on Card *
                    </label>
                    <input
                      type="text"
                      id="cardName"
                      name="cardName"
                      required
                      value={formData.cardName}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      placeholder="John Doe"
                      className={`w-full border rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        getFieldError('cardName') ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                      }`}
                    />
                    {getFieldError('cardName') && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{getFieldError('cardName')}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Billing Address */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Billing Address</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label htmlFor="billingAddress" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Address *
                  </label>
                  <input
                    type="text"
                    id="billingAddress"
                    name="billingAddress"
                    required
                    value={formData.billingAddress}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="123 Main Street"
                    className={`w-full border rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      getFieldError('billingAddress') ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                    }`}
                  />
                  {getFieldError('billingAddress') && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{getFieldError('billingAddress')}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="San Francisco"
                    className={`w-full border rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      getFieldError('city') ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                    }`}
                  />
                  {getFieldError('city') && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{getFieldError('city')}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    State *
                  </label>
                  <select
                    id="state"
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`w-full border rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      getFieldError('state') ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    <option value="">Select State</option>
                    <option value="CA">California</option>
                    <option value="NY">New York</option>
                    <option value="TX">Texas</option>
                    <option value="FL">Florida</option>
                    <option value="IL">Illinois</option>
                    <option value="PA">Pennsylvania</option>
                    <option value="OH">Ohio</option>
                    <option value="GA">Georgia</option>
                    <option value="NC">North Carolina</option>
                    <option value="MI">Michigan</option>
                  </select>
                  {getFieldError('state') && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{getFieldError('state')}</p>
                  )}
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    required
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="94102"
                    className={`w-full border rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      getFieldError('zipCode') ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                    }`}
                  />
                  {getFieldError('zipCode') && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{getFieldError('zipCode')}</p>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 sticky top-4 transition-colors">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Order Summary</h2>
            
            {/* Items */}
            <div className="space-y-3 mb-6">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{item.title}</p>
                    <p className="text-gray-600 dark:text-gray-400">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
            
            {/* Totals */}
            <div className="space-y-2 mb-6 border-t border-gray-200 dark:border-gray-600 pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Shipping ({selectedShippingOption?.name})</span>
                <span className="font-medium">
                  {shippingCost === 0 ? 'Free' : formatPrice(shippingCost)}
                </span>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-600 pt-2">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-lg font-semibold">{formatPrice(total)}</span>
                </div>
              </div>
            </div>

            {/* Charity Impact */}
            <div className="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg p-4 mb-6">
              <div className="flex items-center mb-2">
                <Heart className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
                <span className="font-semibold text-green-900 dark:text-green-100">Charity Impact</span>
              </div>
              <p className="text-sm text-green-700 dark:text-green-300">
                Your purchase will donate <span className="font-semibold">{formatPrice(totalDonation)}</span> to various charities
              </p>
            </div>

            {/* Security Notice */}
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-6">
              <Lock className="w-4 h-4 mr-2" />
              <span>Your payment information is secure and encrypted</span>
            </div>

            {/* Place Order Button */}
            <button
              type="submit"
              form="payment-form"
              disabled={processing || hasErrors}
              onClick={handleSubmit}
              className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing Payment...
                </div>
              ) : (
                `Place Order - ${formatPrice(total)}`
              )}
            </button>
            
            <div className="mt-3 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Funds held in escrow until delivery confirmed
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;