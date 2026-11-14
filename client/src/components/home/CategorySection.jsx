import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const CategorySection = () => {
  const categories = [
    {
      name: 'Fashion',
      slug: 'Fashion',
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&auto=format&fit=crop&q=70',
      tagline: 'Handloom & Designer'
    },
    {
      name: 'Electronics',
      slug: 'Electronics',
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&auto=format&fit=crop&q=70',
      tagline: 'Audio, Wearables & Tech'
    },
    {
      name: 'Home & Kitchen',
      slug: 'Home & Kitchen',
      image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=70',
      tagline: 'Artisanal Ceramic & Living'
    },
    {
      name: 'Beauty',
      slug: 'Beauty',
      image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=70',
      tagline: 'Clean Beauty & Serums'
    },
    {
      name: 'Books',
      slug: 'Books',
      image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=70',
      tagline: 'Bestsellers & Craft'
    },
    {
      name: 'Sports',
      slug: 'Sports',
      image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=70',
      tagline: 'Active Gear & Mats'
    },
    {
      name: 'Accessories',
      slug: 'Accessories',
      image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&auto=format&fit=crop&q=70',
      tagline: 'Top-Grain Leather Goods'
    },
    {
      name: 'Footwear',
      slug: 'Footwear',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=70',
      tagline: 'Sneakers & Casuals'
    }
  ];

  return (
    <section style={{ marginBottom: '4rem' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          marginBottom: '1.75rem',
          borderBottom: '1px solid #E2E8F0',
          paddingBottom: '1rem'
        }}
      >
        <div>
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#4F46E5',
              letterSpacing: '0.1em',
              textTransform: 'uppercase'
            }}
          >
            Curated Categories
          </span>
          <h2
            style={{
              fontSize: '1.75rem',
              fontWeight: 600,
              color: '#0F172A',
              margin: '4px 0 0 0',
              fontFamily: 'Playfair Display, Georgia, serif'
            }}
          >
            Shop by Department
          </h2>
        </div>

        <Link
          to="/categories"
          style={{
            fontSize: '0.8125rem',
            fontWeight: 600,
            color: '#0F172A',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            textDecoration: 'none'
          }}
        >
          <span>View All Departments</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
          gap: '1.25rem'
        }}
      >
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            to={`/products?category=${encodeURIComponent(cat.name)}`}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textDecoration: 'none',
              group: 'category-item'
            }}
          >
            <div
              style={{
                width: '100%',
                aspectRatio: '1/1',
                borderRadius: '8px',
                overflow: 'hidden',
                backgroundColor: '#F1F5F9',
                border: '1px solid #E2E8F0',
                marginBottom: '10px',
                transition: 'transform 0.25s ease, border-color 0.25s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.borderColor = '#0F172A';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = '#E2E8F0';
              }}
            >
              <img
                src={cat.image}
                alt={cat.name}
                loading="lazy"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>

            <span
              style={{
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#0F172A',
                textAlign: 'center'
              }}
            >
              {cat.name}
            </span>
            <span
              style={{
                fontSize: '0.725rem',
                color: '#94A3B8',
                textAlign: 'center',
                marginTop: '2px'
              }}
            >
              {cat.tagline}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategorySection;
