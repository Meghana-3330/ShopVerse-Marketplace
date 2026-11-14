import React from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary] Caught runtime exception:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '80vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            backgroundColor: '#F8FAFC',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}
        >
          <div
            style={{
              maxWidth: '560px',
              width: '100%',
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              border: '1px solid #E2E8F0',
              padding: '2.5rem',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.08)',
              textAlign: 'center'
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                backgroundColor: '#FEF2F2',
                color: '#EF4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem auto'
              }}
            >
              <AlertCircle size={32} />
            </div>

            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
              Something went wrong loading this section
            </h2>

            <p style={{ fontSize: '0.875rem', color: '#64748B', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              {this.state.error?.message || 'An unexpected rendering error occurred. Please refresh or return to the marketplace storefront.'}
            </p>

            {this.state.errorInfo && (
              <details
                style={{
                  textAlign: 'left',
                  backgroundColor: '#F1F5F9',
                  padding: '10px 14px',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  color: '#475569',
                  marginBottom: '1.5rem',
                  overflowX: 'auto',
                  maxHeight: '160px'
                }}
              >
                <summary style={{ cursor: 'pointer', fontWeight: 600 }}>Technical Details</summary>
                <pre style={{ margin: '8px 0 0 0', whiteSpace: 'pre-wrap' }}>
                  {this.state.error?.stack}
                </pre>
              </details>
            )}

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                onClick={this.handleReload}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#0F172A',
                  color: '#FFFFFF',
                  padding: '8px 18px',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <RefreshCw size={15} /> Reload Page
              </button>

              <button
                onClick={this.handleGoHome}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#FFFFFF',
                  color: '#0F172A',
                  padding: '8px 18px',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  border: '1px solid #CBD5E1',
                  cursor: 'pointer'
                }}
              >
                <Home size={15} /> Home Storefront
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
