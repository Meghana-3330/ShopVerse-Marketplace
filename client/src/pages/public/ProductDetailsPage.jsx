import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star,
  ShoppingBag,
  Zap,
  Heart,
  Truck,
  RotateCcw,
  ShieldCheck,
  Store,
  ChevronRight,
  Check,
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import ProductCard from '../../components/common/ProductCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import AlertBanner from '../../components/common/AlertBanner';
import { productService } from '../../services/productService';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated, isProductInWishlist, toggleWishlist, user } = useAuth();
  const { socket } = useSocket();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Selected image index
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  // Review Form State
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState('');
  const [reviewError, setReviewError] = useState('');

  // Real-time stock listener
  useEffect(() => {
    if (!socket || !product?._id) return;
    const handleStockUpdate = (data) => {
      if (data.productId === product._id) {
        setProduct((prev) => (prev ? { ...prev, stock: data.newStock } : prev));
      }
    };
    socket.on('stock_update', handleStockUpdate);
    return () => socket.off('stock_update', handleStockUpdate);
  }, [socket, product?._id]);

  // Load recently viewed
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('recently_viewed_products') || '[]');
      setRecentlyViewed(stored.filter((p) => p._id !== id).slice(0, 4));
    } catch (e) {
      // Ignore
    }
  }, [id]);

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await productService.getProductById(id);
        if (res.success && res.product) {
          setProduct(res.product);
          setReviews(res.reviews || []);
          setRelatedProducts(res.relatedProducts || []);
          setSelectedImageIndex(0);
          setQuantity(1);

          // Save to recently viewed
          try {
            const stored = JSON.parse(localStorage.getItem('recently_viewed_products') || '[]');
            const filtered = stored.filter((p) => p._id !== res.product._id);
            const updated = [
              {
                _id: res.product._id,
                name: res.product.name,
                price: res.product.price,
                originalPrice: res.product.originalPrice,
                discount: res.product.discount,
                images: res.product.images,
                category: res.product.category,
                vendorStoreName: res.product.vendorStoreName,
                rating: res.product.rating,
                stock: res.product.stock
              },
              ...filtered
            ].slice(0, 8);
            localStorage.setItem('recently_viewed_products', JSON.stringify(updated));
          } catch (e) {
            // Ignore
          }
        } else {
          setError('Product not found or has been removed by seller.');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Error loading product details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (loading) {
    return <LoadingSpinner text="Fetching product details..." size="large" />;
  }

  if (error || !product) {
    return (
      <div className="container page-wrapper" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <AlertCircle size={48} color="var(--danger)" style={{ margin: '0 auto 1rem' }} />
        <h2>Product Unavailable</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{error || 'This product does not exist.'}</p>
        <Link to="/products" className="btn btn-primary">
          Browse Marketplace Catalog
        </Link>
      </div>
    );
  }

  const isWishlisted = isProductInWishlist(product._id);
  const isOutOfStock = product.stock <= 0;
  const images = product.images && product.images.length > 0 ? product.images : [
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=60'
  ];

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
    navigate('/checkout');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setReviewSubmitting(true);
    setReviewError('');
    setReviewSuccess('');

    try {
      const res = await productService.addReview(product._id, {
        rating: reviewRating,
        comment: reviewComment
      });

      if (res.success) {
        setReviewSuccess('Review published successfully!');
        setReviews([res.review, ...reviews]);
        setReviewComment('');
        // Update product rating
        setProduct((prev) => ({
          ...prev,
          rating: res.productRating,
          numReviews: res.numReviews
        }));
      }
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setReviewSubmitting(false);
    }
  };

  return (
    <div className="container page-wrapper">
      {/* Breadcrumb Navigation */}
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.85rem',
          color: 'var(--text-muted)',
          marginBottom: '1.75rem',
          flexWrap: 'wrap'
        }}
      >
        <Link to="/" style={{ color: 'inherit' }}>Home</Link>
        <ChevronRight size={14} />
        <Link to="/products" style={{ color: 'inherit' }}>Products</Link>
        <ChevronRight size={14} />
        <Link to={`/products?category=${encodeURIComponent(product.category)}`} style={{ color: 'inherit' }}>
          {product.category}
        </Link>
        <ChevronRight size={14} />
        <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{product.name}</span>
      </nav>

      {/* Main Product Showcase Section */}
      <div
        className="card"
        style={{
          padding: '2rem',
          marginBottom: '3rem',
          boxShadow: 'var(--shadow-md)'
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2.5rem'
          }}
        >
          {/* Left: Product Images Gallery */}
          <div>
            {/* Main Featured Image */}
            <div
              style={{
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
                background: '#F8FAFC',
                aspectRatio: '1',
                position: 'relative',
                border: '1px solid var(--border-color)',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <img
                src={images[selectedImageIndex] || images[0]}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />

              {/* Wishlist Floating Button */}
              <button
                onClick={() => {
                  if (!isAuthenticated) navigate('/login');
                  else toggleWishlist(product._id);
                }}
                className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
                style={{ top: '16px', right: '16px', width: '42px', height: '42px' }}
                title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
              >
                <Heart size={22} fill={isWishlisted ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '4px' }}>
                {images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    style={{
                      width: '70px',
                      height: '70px',
                      borderRadius: 'var(--radius-md)',
                      overflow: 'hidden',
                      border: `2px solid ${idx === selectedImageIndex ? 'var(--primary)' : 'var(--border-color)'}`,
                      padding: 0,
                      cursor: 'pointer',
                      flexShrink: 0
                    }}
                  >
                    <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Purchase & Info Column */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {/* Category & Brand info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.65rem' }}>
              <span className="badge badge-primary">{product.category}</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Brand: <strong>{product.brand || 'Generic'}</strong></span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>SKU: {product.sku || 'N/A'}</span>
            </div>

            <h1 style={{ fontSize: '1.85rem', lineHeight: 1.25, marginBottom: '0.85rem' }}>
              {product.name}
            </h1>

            {/* Rating & Review stats */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
              <div className="stars">
                <Star size={18} fill="#F59E0B" color="#F59E0B" />
              </div>
              <span style={{ fontWeight: 800, fontSize: '1.05rem' }}>{product.rating || '4.5'}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                ({product.numReviews || reviews.length} verified customer ratings)
              </span>
            </div>

            {/* Pricing Section */}
            <div
              style={{
                backgroundColor: 'var(--bg-subtle)',
                padding: '1.25rem',
                borderRadius: 'var(--radius-lg)',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'baseline',
                gap: '1rem',
                flexWrap: 'wrap'
              }}
            >
              <span style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--primary)' }}>
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice > product.price && (
                <span style={{ fontSize: '1.25rem', color: 'var(--text-light)', textDecoration: 'line-through' }}>
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
              {product.discount > 0 && (
                <span className="badge badge-danger" style={{ fontSize: '0.85rem', padding: '4px 10px' }}>
                  Save {product.discount}% OFF
                </span>
              )}
              <span style={{ marginLeft: 'auto', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Inclusive of all taxes
              </span>
            </div>

            {/* Vendor / Store Showcase */}
            <div
              style={{
                border: '1.5px dashed var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '0.95rem 1.15rem',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.75rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--primary-light)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Store size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Marketplace Seller</div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                    {product.vendorStoreName || product.vendor?.vendorProfile?.storeName || 'Marketplace Vendor'}
                  </div>
                </div>
              </div>

              <Link
                to={`/products?vendor=${product.vendor?._id || product.vendor}`}
                className="btn btn-outline btn-sm"
              >
                View Seller's Shop
              </Link>
            </div>

            {/* Stock Availability */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '0.925rem' }}>
                <span
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: isOutOfStock ? 'var(--danger)' : 'var(--success)'
                  }}
                />
                <span style={{ color: isOutOfStock ? 'var(--danger)' : 'var(--success-dark)' }}>
                  {isOutOfStock ? 'Currently Out of Stock' : `In Stock: ${product.stock} units available`}
                </span>
              </div>
            </div>

            {/* Quantity Selector + Add to Cart + Buy Now */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Quantity:</span>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    border: '1.5px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden'
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    style={{ padding: '0.6rem 1rem', fontWeight: 700 }}
                    disabled={isOutOfStock}
                  >
                    -
                  </button>
                  <span style={{ minWidth: '40px', textAlign: 'center', fontWeight: 700 }}>
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(product.stock || 99, q + 1))}
                    style={{ padding: '0.6rem 1rem', fontWeight: 700 }}
                    disabled={isOutOfStock}
                  >
                    +
                  </button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className="btn btn-lg btn-outline"
                  style={{
                    borderColor: 'var(--primary)',
                    color: 'var(--primary)',
                    backgroundColor: addedAnimation ? 'var(--success-light)' : undefined
                  }}
                >
                  {addedAnimation ? (
                    <>
                      <Check size={20} color="var(--success)" /> Added to Cart!
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={20} /> Add to Cart
                    </>
                  )}
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                  className="btn btn-lg btn-primary"
                >
                  <Zap size={20} /> Buy Now
                </button>
              </div>
            </div>

            {/* Guarantees Strip */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
                marginTop: '1.75rem',
                paddingTop: '1.25rem',
                borderTop: '1px solid var(--border-color)',
                fontSize: '0.8rem',
                color: 'var(--text-muted)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Truck size={18} color="var(--primary)" />
                <span>Free delivery over ₹1,000</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <RotateCcw size={18} color="var(--primary)" />
                <span>7 days return guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Description & Specifications */}
      <div className="card" style={{ padding: '2rem', marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.4rem', marginBottom: '1.25rem' }}>Product Description</h2>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.975rem', marginBottom: '1.75rem' }}>
          {product.description}
        </p>

        <h3 style={{ fontSize: '1.15rem', marginBottom: '0.85rem' }}>Detailed Specifications</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Category</span>
            <div style={{ fontWeight: 600 }}>{product.category}</div>
          </div>
          <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Brand Name</span>
            <div style={{ fontWeight: 600 }}>{product.brand || 'Generic'}</div>
          </div>
          <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Stock Keeping Unit (SKU)</span>
            <div style={{ fontWeight: 600 }}>{product.sku || 'N/A'}</div>
          </div>
          <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Fulfillment Store</span>
            <div style={{ fontWeight: 600 }}>{product.vendorStoreName || 'Marketplace Vendor'}</div>
          </div>
        </div>
      </div>

      {/* Customer Reviews & Feedback Section */}
      <div className="card" style={{ padding: '2rem', marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MessageSquare size={22} color="var(--primary)" /> Customer Reviews ({reviews.length})
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Real feedback from shoppers who ordered this product
            </p>
          </div>
        </div>

        {/* Submit Review Form */}
        <div
          style={{
            backgroundColor: 'var(--bg-subtle)',
            padding: '1.5rem',
            borderRadius: 'var(--radius-lg)',
            marginBottom: '2rem'
          }}
        >
          <h3 style={{ fontSize: '1.05rem', marginBottom: '0.75rem' }}>Write a Review</h3>

          {reviewSuccess && <AlertBanner type="success" message={reviewSuccess} />}
          {reviewError && <AlertBanner type="error" message={reviewError} />}

          {!isAuthenticated ? (
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Please <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700 }}>log in</Link> to write a verified customer review.
            </p>
          ) : (
            <form onSubmit={handleReviewSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label className="form-label">Your Rating (1 to 5 Stars):</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      style={{ padding: '4px', cursor: 'pointer' }}
                    >
                      <Star
                        size={24}
                        fill={star <= reviewRating ? '#F59E0B' : 'none'}
                        color={star <= reviewRating ? '#F59E0B' : '#94A3B8'}
                      />
                    </button>
                  ))}
                  <span style={{ alignSelf: 'center', marginLeft: '0.5rem', fontWeight: 700 }}>
                    {reviewRating} out of 5
                  </span>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Review Comment:</label>
                <textarea
                  required
                  rows={3}
                  className="form-control"
                  placeholder="Share details of your experience with this item (fit, quality, delivery)..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={reviewSubmitting}
                className="btn btn-primary btn-sm"
              >
                {reviewSubmitting ? 'Publishing...' : 'Submit Verified Review'}
              </button>
            </form>
          )}
        </div>

        {/* Reviews List */}
        {reviews.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            No reviews yet for this product. Be the first to share your thoughts!
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {reviews.map((r, i) => (
              <div
                key={r._id || i}
                style={{
                  paddingBottom: '1.25rem',
                  borderBottom: i < reviews.length - 1 ? '1px solid var(--border-color)' : 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        backgroundColor: 'var(--primary-light)',
                        color: 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '0.85rem'
                      }}
                    >
                      {r.userName ? r.userName.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <strong>{r.userName || 'Verified Buyer'}</strong>
                    <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>Verified Purchase</span>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : 'Recent'}
                  </span>
                </div>

                <div className="stars" style={{ marginBottom: '0.4rem' }}>
                  {[...Array(5)].map((_, idx) => (
                    <Star
                      key={idx}
                      size={14}
                      fill={idx < r.rating ? '#F59E0B' : 'none'}
                      color={idx < r.rating ? '#F59E0B' : '#CBD5E1'}
                    />
                  ))}
                </div>

                <p style={{ color: 'var(--text-main)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                  {r.comment}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontFamily: 'Playfair Display, Georgia, serif' }}>
            More Items in {product.category}
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: '1.5rem'
            }}
          >
            {relatedProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Recently Viewed Products */}
      {recentlyViewed.length > 0 && (
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontFamily: 'Playfair Display, Georgia, serif' }}>
            Recently Viewed
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: '1.5rem'
            }}
          >
            {recentlyViewed.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetailsPage;
