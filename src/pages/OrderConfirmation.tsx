import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, Package, Clock, Shield, Heart, ArrowRight } from 'lucide-react';
import { useEscrow } from '../contexts/EscrowContext';
import { useCurrency } from '../contexts/CurrencyContext';

const OrderConfirmation: React.FC = () => {
  const location = useLocation();
  const { getOrderById } = useEscrow();
  const { formatPrice } = useCurrency();
  const { orderIds, message } = location.state || { orderIds: [], message: '' };

  const orders = orderIds.map((id: string) => getOrderById(id)).filter(Boolean);
  const totalAmount = orders.reduce((sum, order) => sum + order.total, 0);
  const totalDonation = orders.reduce((sum, order) => sum + order.donationAmount, 0);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  if (orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Order Not Found</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">We couldn't find your order details.</p>
        <Link
          to="/"
          className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
        >
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 dark:bg-gray-900 min-h-screen transition-colors">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Order Confirmed!</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">{message}</p>
      </div>

      {/* Escrow Protection Notice */}
      <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-6 mb-8">
        <div className="flex items-center mb-3">
          <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3" />
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">🛡️ Your Payment is Protected</h3>
        </div>
        <div className="text-blue-700 dark:text-blue-300 text-sm space-y-2">
          <p><strong>How Escrow Protection Works:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Your payment of <strong>{formatPrice(totalAmount)}</strong> is held securely in escrow</li>
            <li>Sellers have <strong>3 days</strong> to ship with tracking numbers</li>
            <li>You'll receive tracking information once items are shipped</li>
            <li>After delivery, you have <strong>72 hours</strong> to report any issues</li>
            <li>If no issues are reported, funds are released to sellers and charities</li>
            <li>Full refund guaranteed if items don't match descriptions</li>
          </ul>
        </div>
      </div>

      {/* Order Details */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8 transition-colors">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Order Details</h2>
        
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="border-b border-gray-200 dark:border-gray-600 pb-6 last:border-b-0">
              <div className="flex items-start space-x-4">
                <img
                  src={order.productImage}
                  alt={order.productTitle}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{order.productTitle}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Sold by {order.sellerName}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Quantity: {order.quantity} • Total: {formatPrice(order.total)}
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded-full text-xs font-medium">
                        Awaiting Shipment
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center mt-2 text-sm text-green-600 dark:text-green-400">
                    <Heart className="w-4 h-4 mr-1" />
                    {formatPrice(order.donationAmount)} will be donated to {order.charity}
                  </div>
                </div>
              </div>
              
              {/* Order Timeline */}
              <div className="mt-4 ml-24">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <p><strong>Order ID:</strong> {order.id}</p>
                  <p><strong>Shipment Deadline:</strong> {order.shipmentDeadline.toLocaleDateString()} at {order.shipmentDeadline.toLocaleTimeString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* What Happens Next */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8 transition-colors">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">What Happens Next?</h2>
        
        <div className="space-y-4">
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-purple-600 dark:text-purple-400">1</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Seller Notification</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Sellers have been notified and have 3 days to ship your items with tracking numbers.</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-purple-600 dark:text-purple-400">2</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Tracking Information</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">You'll receive tracking numbers and can monitor your shipments in real-time.</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-purple-600 dark:text-purple-400">3</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Delivery & Inspection</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">After delivery, you have 72 hours to inspect items and report any issues.</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-purple-600 dark:text-purple-400">4</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Automatic Completion</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">If no issues are reported, funds are automatically released to sellers and charities.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8 transition-colors">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Order Summary</h2>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Total Amount</span>
            <span className="font-semibold text-gray-900 dark:text-white">{formatPrice(totalAmount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Total Charity Donation</span>
            <span className="font-semibold text-green-600 dark:text-green-400">{formatPrice(totalDonation)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Number of Items</span>
            <span className="font-semibold text-gray-900 dark:text-white">{orders.reduce((sum, order) => sum + order.quantity, 0)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Number of Sellers</span>
            <span className="font-semibold text-gray-900 dark:text-white">{new Set(orders.map(order => order.sellerId)).size}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          to="/dashboard"
          className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors text-center flex items-center justify-center"
        >
          <Package className="w-5 h-5 mr-2" />
          Track Your Orders
        </Link>
        <Link
          to="/search"
          className="border border-purple-600 text-purple-600 dark:text-purple-400 px-8 py-3 rounded-lg font-semibold hover:bg-purple-50 dark:hover:bg-purple-900 transition-colors text-center flex items-center justify-center"
        >
          Continue Shopping
          <ArrowRight className="w-5 h-5 ml-2" />
        </Link>
      </div>

      {/* Contact Support */}
      <div className="text-center mt-8">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Questions about your order? <a href="mailto:support@trade2help.com" className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300">Contact Support</a>
        </p>
      </div>
    </div>
  );
};

export default OrderConfirmation;