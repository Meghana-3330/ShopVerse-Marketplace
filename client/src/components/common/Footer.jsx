import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ShieldCheck, Truck, RefreshCw, Headphones, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#0F172A', color: '#94A3B8', marginTop: 'auto' }}>
      {/* Feature highlights strip */}
      <div style={{ borderBottom: '1px solid #1E293B', padding: '2.5rem 0' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1.5rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(79, 70, 229, 0.15)',
                  color: '#818CF8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <Truck size={24} />
              </div>
              <div>
                <h4 style={{ color: '#F8FAFC', fontSize: '0.95rem', marginBottom: '2px' }}>Fast Free Delivery</h4>
                <p style={{ fontSize: '0.8rem', color: '#64748B', margin: 0 }}>On all orders above ₹1,000</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: '#34D399',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <ShieldCheck size={24} />
              </div>
              <div>
                <h4 style={{ color: '#F8FAFC', fontSize: '0.95rem', marginBottom: '2px' }}>Verified Vendors</h4>
                <p style={{ fontSize: '0.8rem', color: '#64748B', margin: 0 }}>100% Genuine, tested merchandise</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(245, 158, 11, 0.15)',
                  color: '#FBBF24',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <RefreshCw size={24} />
              </div>
              <div>
                <h4 style={{ color: '#F8FAFC', fontSize: '0.95rem', marginBottom: '2px' }}>7 Days Easy Return</h4>
                <p style={{ fontSize: '0.8rem', color: '#64748B', margin: 0 }}>Hassle-free replacement policy</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(14, 165, 233, 0.15)',
                  color: '#38BDF8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <Headphones size={24} />
              </div>
              <div>
                <h4 style={{ color: '#F8FAFC', fontSize: '0.95rem', marginBottom: '2px' }}>24/7 Dedicated Support</h4>
                <p style={{ fontSize: '0.8rem', color: '#64748B', margin: 0 }}>Email and ticket assistance</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer navigation */}
      <div style={{ padding: '3.5rem 0 2.5rem' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '2.5rem'
            }}
          >
            {/* Column 1: Brand & Contact */}
            <div style={{ maxWidth: '320px' }}>
              <Link
                to="/"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  fontWeight: 800,
                  fontSize: '1.45rem',
                  color: '#FFFFFF',
                  marginBottom: '1rem'
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 'var(--radius-md)',
                    background: 'linear-gradient(135deg, #4F46E5, #8B5CF6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF'
                  }}
                >
                  <ShoppingBag size={20} />
                </div>
                <span>Shop<span style={{ color: '#818CF8' }}>Verse</span></span>
              </Link>
              <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: '#94A3B8', marginBottom: '1.25rem' }}>
                Next-generation multi-vendor shopping marketplace empowering independent sellers and offering shoppers curated, quality lifestyle essentials.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MapPin size={16} color="#818CF8" /> Bengaluru Tech Park, Karnataka, India
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Phone size={16} color="#818CF8" /> +91 (80) 4123-5678
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Mail size={16} color="#818CF8" /> support@shopverse-marketplace.com
                </span>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h4 style={{ color: '#F8FAFC', fontSize: '1rem', marginBottom: '1.25rem', fontWeight: 700 }}>
                Explore Marketplace
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
                <li><Link to="/products" style={{ color: '#94A3B8' }}>All Products</Link></li>
                <li><Link to="/products?featured=true" style={{ color: '#94A3B8' }}>Featured Collections</Link></li>
                <li><Link to="/products?trending=true" style={{ color: '#94A3B8' }}>Trending Deals</Link></li>
                <li><Link to="/products?bestSeller=true" style={{ color: '#94A3B8' }}>Best Selling</Link></li>
                <li><Link to="/about" style={{ color: '#94A3B8' }}>About ShopVerse</Link></li>
                <li><Link to="/contact" style={{ color: '#94A3B8' }}>Contact & Help Center</Link></li>
              </ul>
            </div>

            {/* Column 3: Categories */}
            <div>
              <h4 style={{ color: '#F8FAFC', fontSize: '1rem', marginBottom: '1.25rem', fontWeight: 700 }}>
                Popular Categories
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
                <li><Link to="/products?category=Fashion" style={{ color: '#94A3B8' }}>Fashion & Ethnic Wear</Link></li>
                <li><Link to="/products?category=Electronics" style={{ color: '#94A3B8' }}>Consumer Electronics</Link></li>
                <li><Link to="/products?category=Home%20%26%20Kitchen" style={{ color: '#94A3B8' }}>Home & Kitchenware</Link></li>
                <li><Link to="/products?category=Beauty" style={{ color: '#94A3B8' }}>Beauty & Skincare</Link></li>
                <li><Link to="/products?category=Footwear" style={{ color: '#94A3B8' }}>Footwear & Sneakers</Link></li>
                <li><Link to="/products?category=Sports" style={{ color: '#94A3B8' }}>Sports & Fitness</Link></li>
              </ul>
            </div>

            {/* Column 4: Sell on Marketplace */}
            <div>
              <h4 style={{ color: '#F8FAFC', fontSize: '1rem', marginBottom: '1.25rem', fontWeight: 700 }}>
                Vendor Partnerships
              </h4>
              <p style={{ fontSize: '0.85rem', lineHeight: 1.5, color: '#94A3B8', marginBottom: '1rem' }}>
                Expand your reach to thousands of verified customers across the nation with zero onboarding friction.
              </p>
              <Link to="/vendor/register" className="btn btn-primary btn-sm" style={{ width: '100%', marginBottom: '0.85rem' }}>
                Register as a Vendor
              </Link>
              <Link to="/login" className="btn btn-outline btn-sm" style={{ width: '100%', borderColor: '#334155', color: '#F8FAFC' }}>
                Vendor Portal Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{ borderTop: '1px solid #1E293B', padding: '1.5rem 0', fontSize: '0.825rem' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            &copy; {new Date().getFullYear()} ShopVerse Multi-Vendor Marketplace. Full-Stack MERN Academic Internship Demonstration.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ color: '#64748B' }}>Simulated Payments Supported:</span>
            <span className="badge" style={{ background: '#1E293B', color: '#94A3B8' }}>UPI / QR</span>
            <span className="badge" style={{ background: '#1E293B', color: '#94A3B8' }}>Credit / Debit</span>
            <span className="badge" style={{ background: '#1E293B', color: '#94A3B8' }}>COD</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
