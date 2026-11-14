import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, TrendingUp, Flame, Award } from 'lucide-react';
import HeroBanner from '../../components/home/HeroBanner';
import CategorySection from '../../components/home/CategorySection';
import SpecialOffersBanner from '../../components/home/SpecialOffersBanner';
import VendorHighlights from '../../components/home/VendorHighlights';
import Newsletter from '../../components/home/Newsletter';
import ProductCard from '../../components/common/ProductCard';
import QuickViewModal from '../../components/common/QuickViewModal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { productService } from '../../services/productService';

const HomePage = () => {
  const [highlights, setHighlights] = useState({
    featured: [],
    trending: [],
    newArrivals: [],
    bestSellers: []
  });
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useEffect(() => {
    const fetchHighlights = async () => {
      try {
        const res = await productService.getHighlights();
        if (res.success) {
          setHighlights({
            featured: res.featured || [],
            trending: res.trending || [],
            newArrivals: res.newArrivals || [],
            bestSellers: res.bestSellers || []
          });
        }
      } catch (err) {
        console.error('Error fetching homepage highlights:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHighlights();
  }, []);

  return (
    <div className="container page-wrapper">
      {/* 1. Hero Banner */}
      <HeroBanner />

      {/* 2. Shop by Category */}
      <CategorySection />

      {/* 3. Special Offers Banner */}
      <SpecialOffersBanner />

      {loading ? (
        <LoadingSpinner text="Loading marketplace products..." />
      ) : (
        <>
          {/* 4. Featured Products Section */}
          <section style={{ marginBottom: '3.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
              <div>
                <span style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--primary)', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Sparkles size={16} /> Handpicked For You
                </span>
                <h2 style={{ fontSize: '1.75rem', marginTop: '4px' }}>Featured Marketplace Products</h2>
              </div>
              <Link
                to="/products?featured=true"
                style={{
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                View All <ArrowRight size={16} />
              </Link>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: '1.5rem'
              }}
            >
              {highlights.featured.slice(0, 4).map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onQuickView={(p) => setQuickViewProduct(p)}
                />
              ))}
            </div>
          </section>

          {/* 5. Trending Products */}
          <section style={{ marginBottom: '3.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
              <div>
                <span style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0EA5E9', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <TrendingUp size={16} /> What Shoppers Love
                </span>
                <h2 style={{ fontSize: '1.75rem', marginTop: '4px' }}>Trending Right Now</h2>
              </div>
              <Link
                to="/products?trending=true"
                style={{
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                Explore Trending <ArrowRight size={16} />
              </Link>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: '1.5rem'
              }}
            >
              {highlights.trending.slice(0, 4).map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onQuickView={(p) => setQuickViewProduct(p)}
                />
              ))}
            </div>
          </section>

          {/* 6. Vendor Highlights */}
          <VendorHighlights />

          {/* 7. Best Sellers & New Arrivals Row */}
          <section style={{ marginBottom: '3.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
              <div>
                <span style={{ fontSize: '0.825rem', fontWeight: 700, color: '#F59E0B', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Award size={16} /> Highest Rated
                </span>
                <h2 style={{ fontSize: '1.75rem', marginTop: '4px' }}>Best Sellers & Customer Favorites</h2>
              </div>
              <Link
                to="/products?bestSeller=true"
                style={{
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                See All <ArrowRight size={16} />
              </Link>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: '1.5rem'
              }}
            >
              {highlights.bestSellers.slice(0, 4).map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onQuickView={(p) => setQuickViewProduct(p)}
                />
              ))}
            </div>
          </section>
        </>
      )}

      {/* 8. Newsletter Subscription */}
      <Newsletter />

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
};

export default HomePage;
