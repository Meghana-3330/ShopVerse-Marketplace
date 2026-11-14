import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import {
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead
} from '../services/notificationService';

const SocketContext = createContext();

// Elegant synthesized chime using browser Web Audio API
const playNotificationChime = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    // Gentle two-tone chime (E5 -> G#5)
    osc.frequency.setValueAtTime(659.25, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(830.61, ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  } catch (e) {
    // Ignore audio autoplay restrictions
  }
};

export const SocketProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [toasts, setToasts] = useState([]);
  const socketRef = useRef(null);

  const addToast = useCallback((toast) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 5);
    const newToast = { id, ...toast, timestamp: new Date() };
    setToasts((prev) => [newToast, ...prev].slice(0, 5)); // Keep max 5 visible toasts
    playNotificationChime();

    // Auto dismiss after 6 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 6000);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }
    try {
      const res = await getMyNotifications(1, 15);
      if (res.success && res.data) {
        setNotifications(res.data.notifications || []);
        setUnreadCount(res.data.unreadCount || 0);
      }
    } catch (err) {
      console.warn('Could not fetch notifications:', err.message);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Connect socket
  useEffect(() => {
    const token = localStorage.getItem('token');
    const socketUrl = import.meta.env.VITE_API_URL
      ? import.meta.env.VITE_API_URL.replace('/api', '')
      : (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
        ? 'http://localhost:5000'
        : window.location.origin;

    const s = io(socketUrl, {
      auth: { token: token || '' },
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    socketRef.current = s;
    setSocket(s);

    s.on('connect', () => {
      console.log('[Socket.IO] Connected to real-time server with ID:', s.id);
    });

    s.on('order_status_update', (data) => {
      console.log('[Socket.IO] Real-time order status update received:', data);
      addToast({
        title: 'Order Status Updated',
        message: data.notification?.message || `Order #${data.orderNumber} is now ${data.orderStatus?.toUpperCase() || data.itemStatus?.toUpperCase()}`,
        type: 'order_status',
        link: `/customer/orders/${data.orderId}`
      });
      fetchNotifications();
    });

    s.on('new_order', (data) => {
      console.log('[Socket.IO] Real-time new order received for vendor:', data);
      addToast({
        title: 'New Order Received!',
        message: `Order #${data.orderNumber} placed for ${data.items?.length || 1} item(s) (₹${(data.total || 0).toLocaleString()})`,
        type: 'new_order',
        link: '/vendor/orders'
      });
      fetchNotifications();
    });

    s.on('admin_order_alert', (data) => {
      console.log('[Socket.IO] Admin order alert:', data);
      addToast({
        title: 'Marketplace Order Activity',
        message: data.message || `Order #${data.orderNumber} placed by ${data.customerName || 'customer'} (₹${(data.grandTotal || 0).toLocaleString()})`,
        type: 'admin',
        link: '/admin/orders'
      });
    });

    s.on('vendor_status_update', (data) => {
      console.log('[Socket.IO] Vendor status updated:', data);
      addToast({
        title: 'Store Account Update',
        message: `Your store status was updated to "${data.status?.toUpperCase()}" by marketplace admin.`,
        type: 'vendor_approval',
        link: '/vendor/dashboard'
      });
      fetchNotifications();
    });

    return () => {
      if (s && typeof s.disconnect === 'function') {
        s.disconnect();
      }
    };
  }, [user?._id, isAuthenticated, addToast, fetchNotifications]);

  const markAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Mark notification as read failed:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Mark all notifications read failed:', err);
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        notifications,
        unreadCount,
        toasts,
        addToast,
        removeToast,
        markAsRead,
        markAllAsRead,
        fetchNotifications
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    return {
      socket: null,
      notifications: [],
      unreadCount: 0,
      toasts: [],
      addToast: () => {},
      removeToast: () => {},
      markAsRead: () => {},
      markAllAsRead: () => {},
      fetchNotifications: () => {}
    };
  }
  return context;
};
