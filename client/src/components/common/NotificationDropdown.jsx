import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../../context/SocketContext';
import { useAuth } from '../../context/AuthContext';
import { Bell, Check, Package, CheckCircle2, AlertCircle, ShoppingBag, ExternalLink } from 'lucide-react';

const NotificationDropdown = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useSocket();
  const { isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isAuthenticated) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'new_order':
        return <Package size={16} color="#10B981" />;
      case 'order_status':
        return <CheckCircle2 size={16} color="#4F46E5" />;
      case 'vendor_approval':
        return <AlertCircle size={16} color="#F59E0B" />;
      default:
        return <ShoppingBag size={16} color="#64748B" />;
    }
  };

  const handleNotificationClick = (item) => {
    if (!item.isRead) {
      markAsRead(item._id);
    }
    setIsOpen(false);
    if (item.link) {
      navigate(item.link);
    }
  };

  const formatTimeAgo = (dateStr) => {
    const diff = Math.floor((new Date() - new Date(dateStr)) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          color: '#334155',
          borderRadius: '50%',
          transition: 'background-color 0.15s ease'
        }}
        aria-label="View notifications"
        title="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              backgroundColor: '#EF4444',
              color: '#FFFFFF',
              fontSize: '0.65rem',
              fontWeight: 700,
              minWidth: '16px',
              height: '16px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 4px',
              boxShadow: '0 0 0 2px #FFFFFF'
            }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            width: '340px',
            maxWidth: 'calc(100vw - 32px)',
            backgroundColor: '#FFFFFF',
            borderRadius: '10px',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
            border: '1px solid #E2E8F0',
            zIndex: 1000,
            overflow: 'hidden',
            animation: 'fadeInDown 0.2s ease-out'
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '12px 16px',
              borderBottom: '1px solid #F1F5F9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#FAFAFA'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontWeight: 600, fontSize: '0.875rem', color: '#0F172A' }}>
                Notifications
              </span>
              {unreadCount > 0 && (
                <span
                  style={{
                    backgroundColor: '#EEF2FF',
                    color: '#4F46E5',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    padding: '2px 6px',
                    borderRadius: '12px'
                  }}
                >
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#4F46E5',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px'
                }}
              >
                <Check size={13} />
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div style={{ maxHeight: '360px', overflowY: 'auto' }}>
            {notifications && notifications.length > 0 ? (
              notifications.map((item) => (
                <div
                  key={item._id}
                  onClick={() => handleNotificationClick(item)}
                  style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid #F8FAFC',
                    backgroundColor: item.isRead ? '#FFFFFF' : '#F8FAFC',
                    cursor: 'pointer',
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'flex-start',
                    transition: 'background-color 0.15s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F1F5F9')}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = item.isRead ? '#FFFFFF' : '#F8FAFC')
                  }
                >
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '6px',
                      backgroundColor: item.isRead ? '#F1F5F9' : '#EEF2FF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '2px'
                    }}
                  >
                    {getIcon(item.type)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                      <span
                        style={{
                          fontSize: '0.8125rem',
                          fontWeight: item.isRead ? 500 : 600,
                          color: item.isRead ? '#334155' : '#0F172A'
                        }}
                      >
                        {item.title}
                      </span>
                      <span style={{ fontSize: '0.6875rem', color: '#94A3B8', flexShrink: 0 }}>
                        {formatTimeAgo(item.createdAt)}
                      </span>
                    </div>
                    <p
                      style={{
                        margin: '4px 0 0 0',
                        fontSize: '0.75rem',
                        color: '#64748B',
                        lineHeight: 1.4,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {item.message}
                    </p>
                  </div>
                  {!item.isRead && (
                    <div
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: '#4F46E5',
                        marginTop: '6px',
                        flexShrink: 0
                      }}
                    />
                  )}
                </div>
              ))
            ) : (
              <div style={{ padding: '36px 16px', textAlign: 'center', color: '#94A3B8' }}>
                <Bell size={28} style={{ margin: '0 auto 8px auto', opacity: 0.4 }} />
                <p style={{ margin: 0, fontSize: '0.8125rem' }}>No notifications at this time.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
