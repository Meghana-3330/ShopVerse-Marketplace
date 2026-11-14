import React from 'react';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';

const AlertBanner = ({ type = 'info', message, onClose }) => {
  if (!message) return null;

  const styles = {
    info: {
      bg: 'var(--primary-light)',
      border: '#C7D2FE',
      text: 'var(--primary-text)',
      icon: <Info size={18} />
    },
    success: {
      bg: 'var(--success-light)',
      border: '#A7F3D0',
      text: 'var(--success-dark)',
      icon: <CheckCircle size={18} />
    },
    warning: {
      bg: 'var(--warning-light)',
      border: '#FDE68A',
      text: 'var(--warning-dark)',
      icon: <AlertCircle size={18} />
    },
    error: {
      bg: 'var(--danger-light)',
      border: '#FECACA',
      text: 'var(--danger-dark)',
      icon: <XCircle size={18} />
    }
  };

  const currentStyle = styles[type] || styles.info;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.85rem 1.15rem',
        borderRadius: 'var(--radius-md)',
        backgroundColor: currentStyle.bg,
        border: `1px solid ${currentStyle.border}`,
        color: currentStyle.text,
        fontSize: '0.9rem',
        fontWeight: 500,
        marginBottom: '1.25rem'
      }}
    >
      <span style={{ flexShrink: 0, display: 'flex' }}>{currentStyle.icon}</span>
      <span style={{ flexGrow: 1 }}>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          style={{
            marginLeft: 'auto',
            color: 'inherit',
            fontSize: '1.2rem',
            lineHeight: 1,
            cursor: 'pointer'
          }}
        >
          &times;
        </button>
      )}
    </div>
  );
};

export default AlertBanner;
