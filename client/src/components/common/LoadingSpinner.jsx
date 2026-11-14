import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ text = 'Loading...', size = 'default' }) => {
  const iconSize = size === 'small' ? 18 : size === 'large' ? 36 : 24;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1rem',
        gap: '0.85rem',
        color: 'var(--text-muted)'
      }}
    >
      <Loader2
        size={iconSize}
        className="animate-spin"
        style={{ color: 'var(--primary)' }}
      />
      {text && <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{text}</span>}
    </div>
  );
};

export default LoadingSpinner;
