import React from 'react';
import { Link } from 'react-router-dom';
import { Store, ShieldCheck, Star, ExternalLink, Package } from 'lucide-react';

const VendorHighlights = () => {
  const vendors = [
    {
      name: 'Fashion Aura & Apparels',
      tagline: 'Ethnic Kurtis, Handbags & Accessories',
      rating: 4.8,
      reviewsCount: 142,
      productCount: '15+ Products',
      logo: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&auto=format&fit=crop&q=60',
      badge: 'Top Rated Vendor',
      category: 'Fashion'
    },
    {
      name: 'ElectroTech Gadgets',
      tagline: 'Wireless Audio, Smart Watches & GaN Chargers',
      rating: 4.9,
      reviewsCount: 218,
      productCount: '25+ Products',
      logo: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=300&auto=format&fit=crop&q=60',
      badge: 'Electronics Leader',
      category: 'Electronics'
    },
    {
      name: 'Luxe Home & Living',
      tagline: 'Ceramics, Air Fryers & Smart Essentials',
      rating: 4.7,
      reviewsCount: 95,
      productCount: '18+ Products',
      logo: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=300&auto=format&fit=crop&q=60',
      badge: 'Artisan Verified',
      category: 'Home & Kitchen'
    }
  ];

  return (
    <section style={{ marginBottom: '3.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
        <div>
          <span style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--primary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Verified Partner Stores
          </span>
          <h2 style={{ fontSize: '1.75rem', marginTop: '4px' }}>Top Marketplace Vendors</h2>
        </div>
        <Link
          to="/vendor/register"
          style={{
            fontSize: '0.9rem',
            fontWeight: 700,
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          Sell Your Brand <ExternalLink size={16} />
        </Link>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem'
        }}
      >
        {vendors.map((vendor, idx) => (
          <div key={idx} className="card card-hover" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.15rem' }}>
              <div
                style={{
                  width: 58,
                  height: 58,
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  flexShrink: 0,
                  boxShadow: 'var(--shadow-xs)'
                }}
              >
                <img
                  src={vendor.logo}
                  alt={vendor.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              <div>
                <span className="badge badge-primary" style={{ marginBottom: '4px' }}>
                  {vendor.badge}
                </span>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{vendor.name}</h3>
              </div>
            </div>

            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.25rem', flexGrow: 1 }}>
              {vendor.tagline}
            </p>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '0.85rem',
                borderTop: '1px solid var(--border-color)',
                marginTop: 'auto',
                fontSize: '0.825rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700 }}>
                <Star size={15} fill="#F59E0B" color="#F59E0B" />
                <span>{vendor.rating}</span>
                <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({vendor.reviewsCount})</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)' }}>
                <Package size={15} />
                <span>{vendor.productCount}</span>
              </div>

              <Link
                to={`/products?category=${encodeURIComponent(vendor.category)}`}
                className="btn btn-sm btn-outline"
                style={{ padding: '0.35rem 0.75rem' }}
              >
                Visit Store
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default VendorHighlights;
