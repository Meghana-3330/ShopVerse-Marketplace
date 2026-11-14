import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shirt, Smartphone, Home, Sparkles, BookOpen, Dumbbell, Watch, Footprints, ArrowRight } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { productService } from '../../services/productService';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await productService.getCategories();
        if (res.success) {
          setCategories(res.categories || []);
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCats();
  }, []);

  const getCategoryIcon = (name) => {
    switch (name.toLowerCase()) {
      case 'fashion': return <Shirt size={32} />;
      case 'electronics': return <Smartphone size={32} />;
      case 'home & kitchen': return <Home size={32} />;
      case 'beauty': return <Sparkles size={32} />;
      case 'books': return <BookOpen size={32} />;
      case 'sports': return <Dumbbell size={32} />;
      case 'accessories': return <Watch size={32} />;
      case 'footwear': return <Footprints size={32} />;
      default: return <Shirt size={32} />;
    }
  };

  return (
    <div className="container page-wrapper">
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.25rem', marginBottom: '0.65rem' }}>Browse All Marketplace Categories</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '600px', margin: '0 auto' }}>
          Explore curated products from trusted vendors across 8 primary lifestyle departments
        </p>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading categories..." />
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.75rem'
          }}
        >
          {categories.map((cat) => (
            <Link
              key={cat._id || cat.slug}
              to={`/products?category=${encodeURIComponent(cat.name)}`}
              className="card card-hover"
              style={{
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                padding: 0
              }}
            >
              {/* Image banner */}
              <div style={{ height: '160px', overflow: 'hidden', position: 'relative' }}>
                <img
                  src={cat.image || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&auto=format&fit=crop&q=60'}
                  alt={cat.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: '12px',
                    left: '12px',
                    width: '48px',
                    height: '48px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(4px)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  {getCategoryIcon(cat.name)}
                </div>
              </div>

              <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{cat.name}</h3>
                  <span className="badge badge-primary">{cat.itemCount || 0} Products</span>
                </div>

                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1.25rem', flexGrow: 1 }}>
                  {cat.description || 'Quality merchandise from verified sellers.'}
                </p>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    color: 'var(--primary)',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    marginTop: 'auto'
                  }}
                >
                  Shop Now <ArrowRight size={16} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;
