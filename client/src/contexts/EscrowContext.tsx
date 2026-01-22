import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type OrderStatus = 'pending_payment' | 'payment_confirmed' | 'awaiting_shipment' | 'shipped' | 'delivered' | 'completed' | 'disputed' | 'cancelled' | 'refunded';
export type DisputeStatus = 'none' | 'reported' | 'under_review' | 'return_approved' | 'return_shipped' | 'resolved' | 'closed';

export interface TrackingInfo {
  trackingNumber: string;
  carrier: string;
  status: string;
  lastUpdate: Date;
  estimatedDelivery?: Date;
  trackingEvents: TrackingEvent[];
}

export interface TrackingEvent {
  timestamp: Date;
  status: string;
  location: string;
  description: string;
}

export interface DisputeEvidence {
  photos: string[];
  videos: string[];
  description: string;
  reason: string;
}

export interface EscrowOrder {
  id: string;
  productId: number;
  productTitle: string;
  productImage: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  price: number;
  quantity: number;
  total: number;
  charity: string;
  donationPercent: number;
  donationAmount: number;
  status: OrderStatus;
  disputeStatus: DisputeStatus;
  createdAt: Date;
  paidAt?: Date;
  shippedAt?: Date;
  deliveredAt?: Date;
  completedAt?: Date;
  disputedAt?: Date;
  trackingInfo?: TrackingInfo;
  disputeEvidence?: DisputeEvidence;
  returnTrackingNumber?: string;
  escrowReleaseTimer?: Date; // 72 hours after delivery
  shipmentDeadline: Date; // 3 days after payment
  autoRefundTimer?: Date; // If seller doesn't ship in time
  returnDeadline?: Date; // 5 days to return item
}

interface EscrowContextType {
  orders: EscrowOrder[];
  createEscrowOrder: (orderData: Omit<EscrowOrder, 'id' | 'status' | 'disputeStatus' | 'createdAt' | 'shipmentDeadline'>) => string;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  addTrackingInfo: (orderId: string, trackingNumber: string, carrier: string) => void;
  reportIssue: (orderId: string, evidence: DisputeEvidence) => void;
  approveReturn: (orderId: string) => void;
  addReturnTracking: (orderId: string, trackingNumber: string) => void;
  releaseEscrow: (orderId: string) => void;
  refundOrder: (orderId: string) => void;
  getOrderById: (orderId: string) => EscrowOrder | undefined;
  getOrdersByUser: (userId: string, type: 'buyer' | 'seller') => EscrowOrder[];
  simulateDelivery: (orderId: string) => void; // For demo purposes
  simulateTrackingUpdate: (orderId: string) => void; // For demo purposes
}

const EscrowContext = createContext<EscrowContextType | undefined>(undefined);

export const useEscrow = () => {
  const context = useContext(EscrowContext);
  if (context === undefined) {
    throw new Error('useEscrow must be used within an EscrowProvider');
  }
  return context;
};

export const EscrowProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<EscrowOrder[]>([]);

  // Load orders from localStorage
  useEffect(() => {
    const savedOrders = localStorage.getItem('escrowOrders');
    if (savedOrders) {
      const parsedOrders = JSON.parse(savedOrders).map((order: any) => ({
        ...order,
        createdAt: new Date(order.createdAt),
        paidAt: order.paidAt ? new Date(order.paidAt) : undefined,
        shippedAt: order.shippedAt ? new Date(order.shippedAt) : undefined,
        deliveredAt: order.deliveredAt ? new Date(order.deliveredAt) : undefined,
        completedAt: order.completedAt ? new Date(order.completedAt) : undefined,
        disputedAt: order.disputedAt ? new Date(order.disputedAt) : undefined,
        shipmentDeadline: new Date(order.shipmentDeadline),
        escrowReleaseTimer: order.escrowReleaseTimer ? new Date(order.escrowReleaseTimer) : undefined,
        autoRefundTimer: order.autoRefundTimer ? new Date(order.autoRefundTimer) : undefined,
        returnDeadline: order.returnDeadline ? new Date(order.returnDeadline) : undefined,
        trackingInfo: order.trackingInfo ? {
          ...order.trackingInfo,
          lastUpdate: new Date(order.trackingInfo.lastUpdate),
          estimatedDelivery: order.trackingInfo.estimatedDelivery ? new Date(order.trackingInfo.estimatedDelivery) : undefined,
          trackingEvents: order.trackingInfo.trackingEvents.map((event: any) => ({
            ...event,
            timestamp: new Date(event.timestamp)
          }))
        } : undefined
      }));
      setOrders(parsedOrders);
    }
  }, []);

  // Save orders to localStorage
  useEffect(() => {
    localStorage.setItem('escrowOrders', JSON.stringify(orders));
  }, [orders]);

  // Auto-process timers
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      
      setOrders(prevOrders => {
        return prevOrders.map(order => {
          // Auto-refund if seller doesn't ship in time
          if (order.status === 'awaiting_shipment' && order.autoRefundTimer && now > order.autoRefundTimer) {
            return {
              ...order,
              status: 'cancelled' as OrderStatus,
              autoRefundTimer: undefined
            };
          }
          
          // Auto-release escrow if no dispute reported
          if (order.status === 'delivered' && order.escrowReleaseTimer && now > order.escrowReleaseTimer) {
            return {
              ...order,
              status: 'completed' as OrderStatus,
              completedAt: now,
              escrowReleaseTimer: undefined
            };
          }
          
          // Auto-close dispute if return not shipped in time
          if (order.disputeStatus === 'return_approved' && order.returnDeadline && now > order.returnDeadline) {
            return {
              ...order,
              disputeStatus: 'closed' as DisputeStatus,
              status: 'completed' as OrderStatus,
              completedAt: now
            };
          }
          
          return order;
        });
      });
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  const createEscrowOrder = (orderData: Omit<EscrowOrder, 'id' | 'status' | 'disputeStatus' | 'createdAt' | 'shipmentDeadline'>): string => {
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date();
    const shipmentDeadline = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000); // 3 days
    const autoRefundTimer = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000); // 3 days

    const newOrder: EscrowOrder = {
      ...orderData,
      id: orderId,
      status: 'payment_confirmed',
      disputeStatus: 'none',
      createdAt: now,
      paidAt: now,
      shipmentDeadline,
      autoRefundTimer
    };

    setOrders(prev => [...prev, newOrder]);
    return orderId;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        const updates: Partial<EscrowOrder> = { status };
        
        if (status === 'shipped') {
          updates.shippedAt = new Date();
          updates.autoRefundTimer = undefined;
        } else if (status === 'delivered') {
          updates.deliveredAt = new Date();
          updates.escrowReleaseTimer = new Date(Date.now() + 72 * 60 * 60 * 1000); // 72 hours
        } else if (status === 'completed') {
          updates.completedAt = new Date();
          updates.escrowReleaseTimer = undefined;
        }
        
        return { ...order, ...updates };
      }
      return order;
    }));
  };

  const addTrackingInfo = (orderId: string, trackingNumber: string, carrier: string) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        const trackingInfo: TrackingInfo = {
          trackingNumber,
          carrier,
          status: 'In Transit',
          lastUpdate: new Date(),
          estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days
          trackingEvents: [
            {
              timestamp: new Date(),
              status: 'Shipped',
              location: 'Origin Facility',
              description: 'Package has been shipped'
            }
          ]
        };
        
        return {
          ...order,
          status: 'shipped' as OrderStatus,
          shippedAt: new Date(),
          trackingInfo,
          autoRefundTimer: undefined
        };
      }
      return order;
    }));
  };

  const reportIssue = (orderId: string, evidence: DisputeEvidence) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          disputeStatus: 'reported' as DisputeStatus,
          disputedAt: new Date(),
          disputeEvidence: evidence,
          escrowReleaseTimer: undefined
        };
      }
      return order;
    }));
  };

  const approveReturn = (orderId: string) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          disputeStatus: 'return_approved' as DisputeStatus,
          returnDeadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) // 5 days
        };
      }
      return order;
    }));
  };

  const addReturnTracking = (orderId: string, trackingNumber: string) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          disputeStatus: 'return_shipped' as DisputeStatus,
          returnTrackingNumber: trackingNumber
        };
      }
      return order;
    }));
  };

  const releaseEscrow = (orderId: string) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          status: 'completed' as OrderStatus,
          completedAt: new Date(),
          escrowReleaseTimer: undefined
        };
      }
      return order;
    }));
  };

  const refundOrder = (orderId: string) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          status: 'refunded' as OrderStatus,
          disputeStatus: 'resolved' as DisputeStatus,
          completedAt: new Date()
        };
      }
      return order;
    }));
  };

  const getOrderById = (orderId: string): EscrowOrder | undefined => {
    return orders.find(order => order.id === orderId);
  };

  const getOrdersByUser = (userId: string, type: 'buyer' | 'seller'): EscrowOrder[] => {
    return orders.filter(order => 
      type === 'buyer' ? order.buyerId === userId : order.sellerId === userId
    );
  };

  // Demo functions for testing
  const simulateDelivery = (orderId: string) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId && order.trackingInfo) {
        const updatedTrackingInfo = {
          ...order.trackingInfo,
          status: 'Delivered',
          lastUpdate: new Date(),
          trackingEvents: [
            ...order.trackingInfo.trackingEvents,
            {
              timestamp: new Date(),
              status: 'Delivered',
              location: 'Destination',
              description: 'Package has been delivered'
            }
          ]
        };
        
        return {
          ...order,
          status: 'delivered' as OrderStatus,
          deliveredAt: new Date(),
          trackingInfo: updatedTrackingInfo,
          escrowReleaseTimer: new Date(Date.now() + 72 * 60 * 60 * 1000) // 72 hours
        };
      }
      return order;
    }));
  };

  const simulateTrackingUpdate = (orderId: string) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId && order.trackingInfo) {
        const statuses = ['In Transit', 'Out for Delivery', 'At Local Facility'];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        
        const updatedTrackingInfo = {
          ...order.trackingInfo,
          status: randomStatus,
          lastUpdate: new Date(),
          trackingEvents: [
            ...order.trackingInfo.trackingEvents,
            {
              timestamp: new Date(),
              status: randomStatus,
              location: 'Transit Hub',
              description: `Package is ${randomStatus.toLowerCase()}`
            }
          ]
        };
        
        return {
          ...order,
          trackingInfo: updatedTrackingInfo
        };
      }
      return order;
    }));
  };

  const value = {
    orders,
    createEscrowOrder,
    updateOrderStatus,
    addTrackingInfo,
    reportIssue,
    approveReturn,
    addReturnTracking,
    releaseEscrow,
    refundOrder,
    getOrderById,
    getOrdersByUser,
    simulateDelivery,
    simulateTrackingUpdate
  };

  return (
    <EscrowContext.Provider value={value}>
      {children}
    </EscrowContext.Provider>
  );
};