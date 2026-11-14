import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Truck, RefreshCw, Sparkles, Store } from 'lucide-react';

const HeroBanner = () => {
  return (
    <section style={{ marginBottom: '3.5rem' }}>
      {/* Editorial Luxury Split Hero */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          backgroundColor: '#F8FAFC',
          borderRadius: '12px',
          border: '1px solid #E2E8F0',
          overflow: 'hidden',
          minHeight: '480px'
        }}
      >
        {/* Left Column: Editorial Copy */}
        <div
          style={{
            padding: 'clamp(2.5rem, 5vw, 4.5rem)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            backgroundColor: '#FFFFFF'
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: '#4F46E5',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: '1rem'
            }}
          >
            <Sparkles size={14} />
            <span>Curated Multi-Vendor Marketplace • 2026 Collection</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(2rem, 3.8vw, 3.4rem)',
              fontWeight: 700,
              lineHeight: 1.12,
              color: '#0F172A',
              marginBottom: '1.25rem',
              letterSpacing: '-0.03em',
              fontFamily: 'Playfair Display, Georgia, serif'
            }}
          >
            The Art of Thoughtful Living & Design
          </h1>

          <p
            style={{
              color: '#475569',
              fontSize: '1rem',
              lineHeight: 1.6,
              marginBottom: '2rem',
              maxWidth: '480px'
            }}
          >
            Explore handcrafted fashion, premium audio, artisanal home pieces, and everyday luxuries direct from verified independent creators.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
            <Link
              to="/products"
              style={{
                backgroundColor: '#0F172A',
                color: '#FFFFFF',
                padding: '0.8rem 1.8rem',
                borderRadius: '6px',
                fontSize: '0.875rem',
                fontWeight: 600,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1E293B')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#0F172A')}
            >
              <span>Explore Collection</span>
              <ArrowRight size={16} />
            </Link>

            <Link
              to="/categories"
              style={{
                backgroundColor: '#FFFFFF',
                color: '#0F172A',
                padding: '0.8rem 1.6rem',
                borderRadius: '6px',
                fontSize: '0.875rem',
                fontWeight: 600,
                textDecoration: 'none',
                border: '1px solid #CBD5E1',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#0F172A')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#CBD5E1')}
            >
              <Store size={15} />
              <span>Shop by Store</span>
            </Link>
          </div>
        </div>

        {/* Right Column: Hero High-Res Lifestyle Editorial Imagery */}
        <div
          style={{
            position: 'relative',
            minHeight: '340px',
            backgroundColor: '#F1F5F9',
            overflow: 'hidden'
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&auto=format&fit=crop&q=80"
            alt="ShopVerse Editorial Lifestyle Collection"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center 20%'
            }}
          />
          {/* Subtle bottom tag */}
          <div
            style={{
              position: 'absolute',
              bottom: '20px',
              right: '20px',
              backgroundColor: 'rgba(255, 255, 255, 0.92)',
              backdropFilter: 'blur(8px)',
              padding: '8px 14px',
              borderRadius: '6px',
              border: '1px solid #E2E8F0',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: '#0F172A'
            }}
          >
            Spring / Summer '26
          </div>
        </div>
      </div>

      {/* Trust & Guarantee Highlights Bar */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
          marginTop: '1.5rem',
          padding: '1.25rem 1.5rem',
          backgroundColor: '#FFFFFF',
          borderRadius: '8px',
          border: '1px solid #E2E8F0'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ color: '#4F46E5' }}>
            <Truck size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#0F172A' }}>
              Free Express Shipping
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
              On all qualifying orders over ₹1,000
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ color: '#10B981' }}>
            <ShieldCheck size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#0F172A' }}>
              Verified Multi-Vendors
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
              Vetted artisan brands & direct sellers
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ color: '#F59E0B' }}>
            <RefreshCw size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#0F172A' }}>
              Live Order Tracking
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
              Instant Socket.IO status notifications
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ color: '#8B5CF6' }}>
            <Store size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#0F172A' }}>
              Multi-Vendor Cart
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
              Single seamless checkout for all stores
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
