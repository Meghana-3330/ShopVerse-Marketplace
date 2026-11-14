import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ArrowRight, Package } from 'lucide-react';
import CustomerSidebar from '../../components/dashboard/CustomerSidebar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { productService } from '../../services/productService';

const WishlistPage = () => {
  const { user, toggleWishlist } = useAuth();
  const { addToCart } = useCart();
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlistProducts = async () => {
      if (!user?.wishlist || user.wishlist.length === 0) {
        setWishlistProducts([]);
        setLoading(false);
        return;
      }

      try {
        // Fetch detailed product items for IDs in user.wishlist
        const productPromises = user.wishlist.map((item) => {
          const id = typeof item === 'object' ? item._id : item;
          return productService.getProductById(id).then((res) => res.product).catch(() => null);
        });

        const results = await Promise.all(productPromises);
        setWishlistProducts(results.filter(Boolean));
      } catch (err) {
        console.error('Failed to load wishlist products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistProducts();
  }, [user]);

  const handleMoveToCart = (product) => {
    addToCart(product, 1);
    toggleWishlist(product._id);
  };

  const handleRemove = (productId) => {
    toggleWishlist(productId);
    setWishlistProducts((prev) => prev.filter((p) => p._id !== productId));
  };

  return (
    <div className="container page-wrapper">
      <div className="dashboard-layout">
        <CustomerSidebar />

        <main className="dashboard-content">
          <div style={{ marginBottom: '1.75rem' }}>
            <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>My Wishlist</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Saved items you're interested in purchasing later
            </p>
          </div>

          {loading ? (
            <LoadingSpinner text="Loading saved items..." />
          ) : wishlistProducts.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
              <Heart size={44} color="var(--text-light)" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.4rem' }}>Your Wishlist is Empty</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Tap the heart icon on any product card to save it for later.
              </p>
              <Link to="/products" className="btn btn-primary btn-sm">
                Explore Marketplace Products
              </Link>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: '1.5rem'
              }}
            >
              {wishlistProducts.map((p) => (
                <div key={p._id} className="product-card">
                  <div className="product-image-container">
                    <img src={p.images?.[0]} alt={p.name} />
                  </div>

                  <div className="product-info">
                    <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>
                      {p.category} • {p.vendorStoreName || 'Marketplace Seller'}
                    </span>
                    <Link to={`/products/${p._id}`}>
                      <h3 className="product-title">{p.name}</h3>
                    </Link>

                    <div className="product-price-row">
                      <span className="current-price">₹{p.price.toLocaleString('en-IN')}</span>
                      {p.originalPrice > p.price && (
                        <span className="original-price">₹{p.originalPrice.toLocaleString('en-IN')}</span>
                      )}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.5rem', marginTop: 'auto' }}>
                      <button
                        onClick={() => handleMoveToCart(p)}
                        className="btn btn-primary btn-sm"
                        disabled={p.stock <= 0}
                      >
                        <ShoppingBag size={15} /> Move to Cart
                      </button>
                      <button
                        onClick={() => handleRemove(p._id)}
                        className="btn btn-outline btn-sm btn-icon"
                        title="Remove"
                      >
                        <Trash2 size={15} color="var(--danger)" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default WishlistPage;
