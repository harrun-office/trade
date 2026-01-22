import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, Package, Truck, MapPin, Clock, CheckCircle, AlertTriangle, 
  Camera, Upload, MessageCircle, Shield, Calendar, Eye, RefreshCw 
} from 'lucide-react';
import { useEscrow, type EscrowOrder } from '../contexts/EscrowContext';
import { useCurrency } from '../contexts/CurrencyContext';

const OrderTracking: React.FC = () => {
  const { orderId } = useParams();
  const { getOrderById, reportIssue, simulateDelivery, simulateTrackingUpdate } = useEscrow();
  const { formatPrice } = useCurrency();
  const [showReportIssue, setShowReportIssue] = useState(false);
  const [issueForm, setIssueForm] = useState({
    reason: '',
    description: '',
    photos: [] as string[]
  });

  const order = orderId ? getOrderById(orderId) : undefined;

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Order Not Found</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">We couldn't find the order you're looking for.</p>
        <Link
          to="/dashboard"
          className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'payment_confirmed':
      case 'awaiting_shipment':
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
      case 'shipped':
        return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
      case 'delivered':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      case 'completed':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      case 'disputed':
        return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
      case 'cancelled':
      case 'refunded':
        return 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200';
      default:
        return 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'payment_confirmed':
        return 'Payment Confirmed';
      case 'awaiting_shipment':
        return 'Awaiting Shipment';
      case 'shipped':
        return 'Shipped';
      case 'delivered':
        return 'Delivered';
      case 'completed':
        return 'Completed';
      case 'disputed':
        return 'Disputed';
      case 'cancelled':
        return 'Cancelled';
      case 'refunded':
        return 'Refunded';
      default:
        return status;
    }
  };

  const canReportIssue = order.status === 'delivered' && order.escrowReleaseTimer && new Date() < order.escrowReleaseTimer;
  const timeRemaining = order.escrowReleaseTimer ? Math.max(0, order.escrowReleaseTimer.getTime() - Date.now()) : 0;
  const hoursRemaining = Math.floor(timeRemaining / (1000 * 60 * 60));
  const minutesRemaining = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));

  const handleReportIssue = () => {
    if (issueForm.reason && issueForm.description) {
      reportIssue(order.id, {
        reason: issueForm.reason,
        description: issueForm.description,
        photos: issueForm.photos,
        videos: []
      });
      setShowReportIssue(false);
      setIssueForm({ reason: '', description: '', photos: [] });
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setIssueForm(prev => ({
          ...prev,
          photos: [...prev.photos, e.target?.result as string]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 dark:bg-gray-900 min-h-screen transition-colors">
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/dashboard"
          className="inline-flex items-center text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Order Tracking</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Order ID: {order.id.substring(0, 8)}...</p>
      </div>

      {/* Order Status */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8 transition-colors">
        <div className="flex items-start space-x-4">
          <img
            src={order.productImage}
            alt={order.productTitle}
            className="w-20 h-20 object-cover rounded-lg"
          />
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{order.productTitle}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-2">Sold by {order.sellerName}</p>
            <div className="flex items-center space-x-4 mb-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                {getStatusText(order.status)}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Quantity: {order.quantity} • Total: {formatPrice(order.total)}
              </span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Ordered on {order.createdAt.toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      {/* Escrow Timer */}
      {canReportIssue && (
        <div className="bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-lg p-6 mb-8">
          <div className="flex items-center mb-3">
            <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400 mr-3" />
            <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100">⏰ Inspection Period Active</h3>
          </div>
          <p className="text-yellow-700 dark:text-yellow-300 mb-3">
            You have <strong>{hoursRemaining}h {minutesRemaining}m</strong> remaining to report any issues with your order.
          </p>
          <p className="text-sm text-yellow-600 dark:text-yellow-400 mb-4">
            If no issues are reported, funds will be automatically released to the seller and charity.
          </p>
          <button
            onClick={() => setShowReportIssue(true)}
            className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors flex items-center"
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            Report an Issue
          </button>
        </div>
      )}

      {/* Tracking Information */}
      {order.trackingInfo && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8 transition-colors">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Tracking Information</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => simulateTrackingUpdate(order.id)}
                className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 text-sm flex items-center"
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                Refresh
              </button>
              {order.status === 'shipped' && (
                <button
                  onClick={() => simulateDelivery(order.id)}
                  className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                >
                  Simulate Delivery
                </button>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Tracking Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Tracking Number:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{order.trackingInfo.trackingNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Carrier:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{order.trackingInfo.carrier}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Status:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{order.trackingInfo.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Last Update:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {order.trackingInfo.lastUpdate.toLocaleDateString()} {order.trackingInfo.lastUpdate.toLocaleTimeString()}
                  </span>
                </div>
                {order.trackingInfo.estimatedDelivery && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Est. Delivery:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {order.trackingInfo.estimatedDelivery.toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Tracking History</h4>
              <div className="space-y-3">
                {order.trackingInfo.trackingEvents.map((event, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900 dark:text-white text-sm">{event.status}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {event.timestamp.toLocaleDateString()} {event.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{event.description}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{event.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dispute Information */}
      {order.disputeStatus !== 'none' && (
        <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-6 mb-8">
          <div className="flex items-center mb-3">
            <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400 mr-3" />
            <h3 className="text-lg font-semibold text-red-900 dark:text-red-100">Dispute Status</h3>
          </div>
          <p className="text-red-700 dark:text-red-300 mb-3">
            Status: <strong>{order.disputeStatus.replace('_', ' ').toUpperCase()}</strong>
          </p>
          {order.disputeEvidence && (
            <div className="text-sm text-red-600 dark:text-red-400">
              <p><strong>Reason:</strong> {order.disputeEvidence.reason}</p>
              <p><strong>Description:</strong> {order.disputeEvidence.description}</p>
              {order.disputeEvidence.photos.length > 0 && (
                <p><strong>Evidence:</strong> {order.disputeEvidence.photos.length} photo(s) submitted</p>
              )}
            </div>
          )}
          {order.returnDeadline && (
            <p className="text-sm text-red-600 dark:text-red-400 mt-2">
              <strong>Return Deadline:</strong> {order.returnDeadline.toLocaleDateString()}
            </p>
          )}
        </div>
      )}

      {/* Order Timeline */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8 transition-colors">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Order Timeline</h3>
        
        <div className="space-y-4">
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900 dark:text-white">Order Placed</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {order.createdAt.toLocaleDateString()} at {order.createdAt.toLocaleTimeString()}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Payment confirmed and held in escrow</p>
            </div>
          </div>

          {order.shippedAt && (
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <Truck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 dark:text-white">Shipped</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {order.shippedAt.toLocaleDateString()} at {order.shippedAt.toLocaleTimeString()}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Item shipped with tracking number</p>
              </div>
            </div>
          )}

          {order.deliveredAt && (
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <Package className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 dark:text-white">Delivered</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {order.deliveredAt.toLocaleDateString()} at {order.deliveredAt.toLocaleTimeString()}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">72-hour inspection period started</p>
              </div>
            </div>
          )}

          {order.completedAt && (
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 dark:text-white">Completed</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {order.completedAt.toLocaleDateString()} at {order.completedAt.toLocaleTimeString()}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Funds released to seller and {formatPrice(order.donationAmount)} donated to {order.charity}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Contact Seller */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Need Help?</h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <button className="flex items-center justify-center bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
            <MessageCircle className="w-4 h-4 mr-2" />
            Contact Seller
          </button>
          <button className="flex items-center justify-center border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Shield className="w-4 h-4 mr-2" />
            Contact Support
          </button>
        </div>
      </div>

      {/* Report Issue Modal */}
      {showReportIssue && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Report an Issue</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  What's the issue?
                </label>
                <select
                  value={issueForm.reason}
                  onChange={(e) => setIssueForm(prev => ({ ...prev, reason: e.target.value }))}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select a reason</option>
                  <option value="not_as_described">Item not as described</option>
                  <option value="damaged">Item arrived damaged</option>
                  <option value="wrong_item">Wrong item received</option>
                  <option value="missing_parts">Missing parts or accessories</option>
                  <option value="quality_issues">Quality issues</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Describe the issue
                </label>
                <textarea
                  value={issueForm.description}
                  onChange={(e) => setIssueForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Please provide details about the issue..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Upload Photos (Optional)
                </label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                  <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Upload photos of the issue</p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label
                    htmlFor="photo-upload"
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors cursor-pointer inline-flex items-center"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Choose Photos
                  </label>
                </div>
                {issueForm.photos.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {issueForm.photos.map((photo, index) => (
                      <img
                        key={index}
                        src={photo}
                        alt={`Evidence ${index + 1}`}
                        className="w-full h-20 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowReportIssue(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReportIssue}
                disabled={!issueForm.reason || !issueForm.description}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTracking;