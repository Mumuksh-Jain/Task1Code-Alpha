import React, { useState, useEffect } from 'react';
import { productService } from '../services/api';
import ProductCard from '../components/ProductCard';
import { Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

const categories = ['All', 'Audio', 'Wearables', 'Peripherals', 'Computers', 'Cameras'];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await productService.getProducts({
        category: selectedCategory,
        search: search,
        sortBy: sortBy,
      });
      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error('Error fetching products:', error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch products when category or sorting changes
  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  return (
    <div style={{ paddingBottom: '4rem' }}>
      {/* Hero Section */}
      <section className="hero-gradient" style={{ 
        padding: '3.5rem 2.5rem', 
        marginBottom: '3rem', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ maxWidth: '600px', zIndex: 2 }}>
          <span style={{ 
            background: 'rgba(99, 102, 241, 0.15)', 
            border: '1px solid rgba(99, 102, 241, 0.3)', 
            padding: '0.4rem 1rem', 
            borderRadius: 'var(--border-radius-full)', 
            fontSize: '0.75rem', 
            fontWeight: 700, 
            color: 'var(--accent-primary)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            display: 'inline-block',
            marginBottom: '1rem'
          }}>
            Summer Collection 2026
          </span>
          <h1 style={{ fontSize: '3rem', lineHeight: '1.15', marginBottom: '1rem', fontWeight: 800 }}>
            Next-Gen Gear for <span style={{ background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Modern Minds</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem', marginBottom: '1.75rem' }}>
            Elevate your setup with premium peripherals, wearables, and audio technology engineered for maximum output.
          </p>
        </div>
      </section>

      {/* Control Panel (Search, Filter, Sort) */}
      <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '1.25rem' 
        }}>
          {/* Top Row: Search and Sort */}
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '1rem', 
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} style={{ 
              position: 'relative', 
              flexGrow: 1, 
              maxWidth: '500px',
              width: '100%'
            }}>
              <input
                type="text"
                placeholder="Search premium products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="form-control"
                style={{ paddingLeft: '2.75rem', borderRadius: 'var(--border-radius-md)' }}
              />
              <span style={{ 
                position: 'absolute', 
                left: '1rem', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                color: 'var(--text-muted)',
                pointerEvents: 'none'
              }}>
                <Search size={18} />
              </span>
              <button 
                type="submit" 
                className="btn-primary" 
                style={{ 
                  position: 'absolute', 
                  right: '0.35rem', 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  padding: '0.4rem 1rem',
                  fontSize: '0.875rem',
                  borderRadius: 'var(--border-radius-sm)',
                  boxShadow: 'none'
                }}
              >
                Find
              </button>
            </form>

            {/* Sort Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: '220px' }}>
              <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem' }}>
                <ArrowUpDown size={16} />
                Sort:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="form-control"
                style={{ 
                  borderRadius: 'var(--border-radius-md)', 
                  cursor: 'pointer',
                  padding: '0.6rem 2rem 0.6rem 1rem'
                }}
              >
                <option value="newest">Newest Arrival</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Bottom Row: Category Filter Tabs */}
          <div style={{ 
            borderTop: '1px solid var(--glass-border)', 
            paddingTop: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            overflowX: 'auto',
            whiteSpace: 'nowrap',
            paddingBottom: '0.25rem'
          }}>
            <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', marginRight: '0.5rem' }}>
              <SlidersHorizontal size={16} />
              Filter:
            </span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '0.5rem 1.2rem',
                    borderRadius: 'var(--border-radius-full)',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'var(--transition-smooth)',
                    background: selectedCategory === cat ? 'var(--accent-gradient)' : 'rgba(255, 255, 255, 0.04)',
                    color: selectedCategory === cat ? 'white' : 'var(--text-secondary)',
                    border: selectedCategory === cat ? 'none' : '1px solid var(--glass-border)'
                  }}
                  onMouseOver={(e) => {
                    if (selectedCategory !== cat) {
                      e.currentTarget.style.borderColor = 'var(--accent-primary)';
                      e.currentTarget.style.color = 'var(--text-primary)';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (selectedCategory !== cat) {
                      e.currentTarget.style.borderColor = 'var(--glass-border)';
                      e.currentTarget.style.color = 'var(--text-secondary)';
                    }
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="flex-center" style={{ minHeight: '300px' }}>
          <div className="spinner"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="glass-card flex-center" style={{ minHeight: '300px', flexDirection: 'column', gap: '1rem', padding: '2rem' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem' }}>No products match your criteria.</p>
          <button onClick={() => { setSearch(''); setSelectedCategory('All'); }} className="btn-secondary">
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid-products">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
