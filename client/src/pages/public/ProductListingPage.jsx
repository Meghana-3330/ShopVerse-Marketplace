import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  SlidersHorizontal,
  X,
  Search,
  RotateCcw,
  PackageX,
  LayoutGrid,
  List,
  Star,
  Check,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import ProductCard from '../../components/common/ProductCard';
import QuickViewModal from '../../components/common/QuickViewModal';
import Pagination from '../../components/common/Pagination';
import { productService } from '../../services/productService';

const ProductListingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Query states from URL
  const currentSearch = searchParams.get('search') || '';
  const currentCategory = searchParams.get('category') || '';
  const currentBrand = searchParams.get('brand') || '';
  const currentMinRating = searchParams.get('minRating') || '';
  const currentMinDiscount = searchParams.get('minDiscount') || '';
  const currentSort = searchParams.get('sort') || 'newest';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const currentMinPrice = searchParams.get('minPrice') || '';
  const currentMaxPrice = searchParams.get('maxPrice') || '';
  const currentInStock = searchParams.get('inStock') === 'true';

  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  // Local filter form states
  const [searchInput, setSearchInput] = useState(currentSearch);
  const [minPriceInput, setMinPriceInput] = useState(currentMinPrice);
  const [maxPriceInput, setMaxPriceInput] = useState(currentMaxPrice);

  const categories = [
    'All',
    'Fashion',
    'Electronics',
    'Home & Kitchen',
    'Beauty',
    'Books',
    'Sports',
    'Accessories',
    'Footwear'
  ];

  const popularBrands = [
    'AeroTech',
    'SoundPulse',
    'Urban Chíc',
    'ChefCraft',
    'Clay & Kiln',
    'DermaGlow',
    'Aura Traditions',
    'Stride'
  ];

  useEffect(() => {
    setSearchInput(currentSearch);
    setMinPriceInput(currentMinPrice);
    setMaxPriceInput(currentMaxPrice);
  }, [currentSearch, currentMinPrice, currentMaxPrice]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {
          page: currentPage,
          limit: 12,
          search: currentSearch || undefined,
          category: currentCategory && currentCategory !== 'All' ? currentCategory : undefined,
          brand: currentBrand || undefined,
          minRating: currentMinRating || undefined,
          minDiscount: currentMinDiscount || undefined,
          sort: currentSort,
          minPrice: currentMinPrice || undefined,
          maxPrice: currentMaxPrice || undefined,
          inStock: currentInStock ? 'true' : undefined
        };

        const res = await productService.getProducts(params);
        if (res.success) {
          setProducts(res.products || []);
          setTotalPages(res.totalPages || 1);
          setTotalCount(res.total || 0);
        }
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [
    currentSearch,
    currentCategory,
    currentBrand,
    currentMinRating,
    currentMinDiscount,
    currentSort,
    currentPage,
    currentMinPrice,
    currentMaxPrice,
    currentInStock
  ]);

  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === '' || value === null || value === undefined || value === 'All') {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const removeFilter = (key) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete(key);
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handlePriceApply = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (minPriceInput) newParams.set('minPrice', minPriceInput);
    else newParams.delete('minPrice');

    if (maxPriceInput) newParams.set('maxPrice', maxPriceInput);
    else newParams.delete('maxPrice');

    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setSearchInput('');
    setMinPriceInput('');
    setMaxPriceInput('');
    setSearchParams({});
  };

  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage.toString());
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeFilters = [
    currentCategory && currentCategory !== 'All' && { key: 'category', label: `Category: ${currentCategory}` },
    currentSearch && { key: 'search', label: `Search: "${currentSearch}"` },
    currentBrand && { key: 'brand', label: `Brand: ${currentBrand}` },
    (currentMinPrice || currentMaxPrice) && {
      key: 'price',
      label: `Price: ₹${currentMinPrice || '0'} - ₹${currentMaxPrice || '∞'}`
    },
    currentMinRating && { key: 'minRating', label: `Rating: ${currentMinRating}★ & above` },
    currentMinDiscount && { key: 'minDiscount', label: `Discount: ${currentMinDiscount}%+ off` },
    currentInStock && { key: 'inStock', label: 'In Stock Only' }
  ].filter(Boolean);

  return (
    <div className="container page-wrapper">
      {/* Header & Page Title */}
      <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 600, color: '#0F172A', fontFamily: 'Playfair Display, Georgia, serif', margin: 0 }}>
              {currentCategory && currentCategory !== 'All' ? `${currentCategory}` : 'Catalog & Collections'}
            </h1>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.875rem', color: '#64748B' }}>
              Showing {totalCount} verified products from independent marketplace stores
            </p>
          </div>

          {/* Grid / List View Toggle & Mobile Filter Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="btn btn-outline btn-sm mobile-filter-btn"
              style={{ display: 'none', alignItems: 'center', gap: '6px' }}
            >
              <SlidersHorizontal size={14} /> Filter
            </button>

            <div style={{ display: 'flex', border: '1px solid #E2E8F0', borderRadius: '6px', overflow: 'hidden' }}>
              <button
                onClick={() => setViewMode('grid')}
                style={{
                  padding: '6px 10px',
                  backgroundColor: viewMode === 'grid' ? '#0F172A' : '#FFFFFF',
                  color: viewMode === 'grid' ? '#FFFFFF' : '#64748B',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center'
                }}
                title="Grid View"
                aria-label="Grid View"
              >
                <LayoutGrid size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                style={{
                  padding: '6px 10px',
                  backgroundColor: viewMode === 'list' ? '#0F172A' : '#FFFFFF',
                  color: viewMode === 'list' ? '#FFFFFF' : '#64748B',
                  border: 'none',
                  borderLeft: '1px solid #E2E8F0',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center'
                }}
                title="List View"
                aria-label="List View"
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Chips (Active removable tags) */}
        {activeFilters.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px', marginTop: '1rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Active Filters:</span>
            {activeFilters.map((f) => (
              <span key={f.key} className="filter-chip">
                {f.label}
                <button
                  onClick={() => {
                    if (f.key === 'price') {
                      const newParams = new URLSearchParams(searchParams);
                      newParams.delete('minPrice');
                      newParams.delete('maxPrice');
                      newParams.set('page', '1');
                      setSearchParams(newParams);
                    } else {
                      removeFilter(f.key);
                    }
                  }}
                  aria-label={`Remove filter ${f.label}`}
                >
                  <X size={13} />
                </button>
              </span>
            ))}
            <button
              onClick={clearAllFilters}
              style={{
                fontSize: '0.75rem',
                color: '#EF4444',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 600,
                padding: '2px 6px'
              }}
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Main Listing Layout: Sidebar + Product Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '2rem', alignItems: 'flex-start' }} className="catalog-grid-layout">
        {/* Left Sidebar Filter Panel */}
        <aside
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '10px',
            padding: '1.25rem',
            position: 'sticky',
            top: '110px'
          }}
          className="catalog-sidebar"
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid #F1F5F9' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <SlidersHorizontal size={15} /> Filters
            </span>
            {activeFilters.length > 0 && (
              <button
                onClick={clearAllFilters}
                style={{ fontSize: '0.75rem', color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}
              >
                Reset
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.75rem' }}>
              Categories
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {categories.map((cat) => {
                const isSelected = (!currentCategory && cat === 'All') || currentCategory.toLowerCase() === cat.toLowerCase();
                return (
                  <button
                    key={cat}
                    onClick={() => updateParam('category', cat === 'All' ? '' : cat)}
                    style={{
                      textAlign: 'left',
                      fontSize: '0.8125rem',
                      padding: '5px 8px',
                      borderRadius: '6px',
                      backgroundColor: isSelected ? '#F1F5F9' : 'transparent',
                      color: isSelected ? '#0F172A' : '#475569',
                      fontWeight: isSelected ? 600 : 400,
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <span>{cat}</span>
                    {isSelected && <Check size={14} color="#4F46E5" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Range Filter */}
          <div style={{ marginBottom: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #F1F5F9' }}>
            <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.75rem' }}>
              Price Range (₹)
            </h4>
            <form onSubmit={handlePriceApply} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <input
                  type="number"
                  placeholder="Min"
                  value={minPriceInput}
                  onChange={(e) => setMinPriceInput(e.target.value)}
                  style={{ width: '100%', height: '34px', fontSize: '0.8125rem', border: '1px solid #E2E8F0', borderRadius: '4px', padding: '0 6px' }}
                />
                <span style={{ color: '#94A3B8' }}>-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPriceInput}
                  onChange={(e) => setMaxPriceInput(e.target.value)}
                  style={{ width: '100%', height: '34px', fontSize: '0.8125rem', border: '1px solid #E2E8F0', borderRadius: '4px', padding: '0 6px' }}
                />
              </div>
              <button
                type="submit"
                style={{
                  backgroundColor: '#0F172A',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Apply Range
              </button>
            </form>
          </div>

          {/* Brand Filter */}
          <div style={{ marginBottom: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #F1F5F9' }}>
            <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.75rem' }}>
              Brands
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {popularBrands.map((b) => {
                const isSelected = currentBrand.toLowerCase() === b.toLowerCase();
                return (
                  <button
                    key={b}
                    onClick={() => updateParam('brand', isSelected ? '' : b)}
                    style={{
                      textAlign: 'left',
                      fontSize: '0.8125rem',
                      padding: '4px 6px',
                      borderRadius: '4px',
                      backgroundColor: isSelected ? '#F1F5F9' : 'transparent',
                      color: isSelected ? '#0F172A' : '#475569',
                      fontWeight: isSelected ? 600 : 400,
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <span>{b}</span>
                    {isSelected && <Check size={13} color="#4F46E5" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Rating Filter */}
          <div style={{ marginBottom: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #F1F5F9' }}>
            <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.75rem' }}>
              Customer Rating
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {[4, 3, 2].map((stars) => (
                <button
                  key={stars}
                  onClick={() => updateParam('minRating', currentMinRating === stars.toString() ? '' : stars.toString())}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.8125rem',
                    padding: '4px 6px',
                    borderRadius: '4px',
                    background: currentMinRating === stars.toString() ? '#F1F5F9' : 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#334155'
                  }}
                >
                  <Star size={13} fill="#F59E0B" color="#F59E0B" />
                  <span>{stars}★ & above</span>
                </button>
              ))}
            </div>
          </div>

          {/* Availability Filter */}
          <div style={{ paddingTop: '1rem', borderTop: '1px solid #F1F5F9' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.8125rem', color: '#0F172A', fontWeight: 500 }}>
              <input
                type="checkbox"
                checked={currentInStock}
                onChange={(e) => updateParam('inStock', e.target.checked ? 'true' : '')}
                style={{ width: '16px', height: '16px', accentColor: '#0F172A', cursor: 'pointer' }}
              />
              <span>In Stock Only</span>
            </label>
          </div>
        </aside>

        {/* Right Content Area */}
        <main>
          {/* Sorting and Results Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.25rem',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              padding: '10px 16px'
            }}
          >
            <span style={{ fontSize: '0.8125rem', color: '#64748B' }}>
              Showing {products.length} of {totalCount} items
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#0F172A' }}>Sort:</span>
              <select
                value={currentSort}
                onChange={(e) => updateParam('sort', e.target.value)}
                style={{
                  height: '34px',
                  borderRadius: '6px',
                  border: '1px solid #CBD5E1',
                  backgroundColor: '#FFFFFF',
                  fontSize: '0.8125rem',
                  padding: '0 8px',
                  color: '#0F172A',
                  cursor: 'pointer'
                }}
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="discount">Biggest Discount</option>
              </select>
            </div>
          </div>

          {/* Loading Skeletons */}
          {loading ? (
            <div className={viewMode === 'grid' ? 'products-grid-view' : 'products-list-view'}>
              {[...Array(8)].map((_, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    height: viewMode === 'grid' ? '360px' : '200px',
                    display: 'flex',
                    flexDirection: viewMode === 'grid' ? 'column' : 'row'
                  }}
                >
                  <div
                    className="skeleton"
                    style={{
                      width: viewMode === 'grid' ? '100%' : '220px',
                      height: viewMode === 'grid' ? '220px' : '100%'
                    }}
                  />
                  <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div className="skeleton" style={{ height: '14px', width: '40%' }} />
                    <div className="skeleton" style={{ height: '18px', width: '85%' }} />
                    <div className="skeleton" style={{ height: '14px', width: '30%', marginTop: 'auto' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            /* Empty State */
            <div
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '10px',
                padding: '4rem 2rem',
                textAlign: 'center',
                color: '#64748B'
              }}
            >
              <PackageX size={48} style={{ margin: '0 auto 12px auto', color: '#94A3B8' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#0F172A', marginBottom: '6px' }}>
                No matching products found
              </h3>
              <p style={{ fontSize: '0.875rem', marginBottom: '1.5rem', maxWidth: '400px', margin: '0 auto 1.5rem auto' }}>
                We couldn't find any products matching your specific combination of filters. Try widening your price range or clearing filters.
              </p>
              <button
                onClick={clearAllFilters}
                style={{
                  backgroundColor: '#0F172A',
                  color: '#FFFFFF',
                  padding: '8px 20px',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            /* Product List / Grid */
            <>
              <div className={viewMode === 'grid' ? 'products-grid-view' : 'products-list-view'}>
                {products.map((p) => (
                  <ProductCard
                    key={p._id}
                    product={p}
                    onQuickView={(prod) => setQuickViewProduct(prod)}
                    viewMode={viewMode}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{ marginTop: '2.5rem' }}>
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  );
};

export default ProductListingPage;
