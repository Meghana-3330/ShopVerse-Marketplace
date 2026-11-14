import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../../context/SocketContext';
import { Bell, Package, CheckCircle2, AlertCircle, X } from 'lucide-react';

const ToastContainer = () => {
  const { toasts, removeToast } = useSocket();
  const navigate = useNavigate();

  if (!toasts || toasts.length === 0) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'new_order':
        return <Package size={18} className="text-emerald-500" />;
      case 'order_status':
        return <CheckCircle2 size={18} className="text-indigo-500" />;
      case 'vendor_approval':
        return <AlertCircle size={18} className="text-amber-500" />;
      default:
        return <Bell size={18} className="text-blue-500" />;
    }
  };

  return (
    <aside
      aria-label="Notifications"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        maxWidth: '380px',
        width: 'calc(100vw - 48px)',
        pointerEvents: 'none'
      }}
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          style={{
            pointerEvents: 'auto',
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderLeft: '4px solid #4F46E5',
            borderRadius: '8px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            cursor: toast.link ? 'pointer' : 'default',
            transition: 'all 0.25s ease',
            animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
          onClick={() => {
            if (toast.link) {
              navigate(toast.link);
              removeToast(toast.id);
            }
          }}
        >
          <div style={{ marginTop: '2px', flexShrink: 0 }}>
            {getIcon(toast.type)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
              <h4 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, color: '#0F172A' }}>
                {toast.title}
              </h4>
              <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>Just now</span>
            </div>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.8125rem', color: '#475569', lineHeight: 1.4 }}>
              {toast.message}
            </p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              removeToast(toast.id);
            }}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#94A3B8',
              padding: '2px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '4px'
            }}
            aria-label="Dismiss toast notification"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </aside>
  );
};

export default ToastContainer;
