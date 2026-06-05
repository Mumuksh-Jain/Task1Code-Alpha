import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { productService } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, ShoppingCart, ShieldCheck, Truck, RefreshCw, Plus, Minus } from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const data = await productService.getProductById(id);
        if (data.success) {
          setProduct(data.product);
        }
      } catch (error) {
        console.error('Error fetching product detail:', error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [id]);

  const handleIncrement = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setIsAdding(true);
    await addToCart(product._id, quantity);
    setIsAdding(false);
  };

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: '400px' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container flex-center" style={{ minHeight: '400px', flexDirection: 'column', gap: '1.5rem' }}>
        <h2>Product Not Found</h2>
        <Link to="/" className="btn-primary flex-center" style={{ gap: '0.5rem' }}>
          <ArrowLeft size={18} />
          <span>Back to Store</span>
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;

  return (
    <div style={{ paddingBottom: '5rem' }}>
      {/* Back Button */}
      <Link to="/" style={{ 
        display: 'inline-flex', 
        alignItems: 'center', 
        gap: '0.5rem', 
        marginBottom: '2rem', 
        color: 'var(--text-secondary)',
        fontWeight: 500
      }}
      onMouseOver={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
      onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
      >
        <ArrowLeft size={18} />
        <span>Back to Store</span>
      </Link>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
        gap: '3.5rem',
        alignItems: 'start'
      }}>
        {/* Left: Product Image Box */}
        <div className="glass-card flex-center" style={{ 
          padding: '3rem', 
          background: '#131924',
          borderRadius: 'var(--border-radius-lg)',
          boxShadow: 'none',
          minHeight: '400px'
        }}>
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            style={{ 
              maxWidth: '100%', 
              maxHeight: '380px', 
              objectFit: 'contain'
            }} 
          />
        </div>

        {/* Right: Info Area */}
        <div>
          {/* Category Tag */}
          <span style={{ 
            color: 'var(--accent-secondary)', 
            fontSize: '0.875rem', 
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            {product.category}
          </span>
          
          <h1 style={{ fontSize: '2.5rem', marginTop: '0.5rem', marginBottom: '1rem', lineHeight: '1.2' }}>
            {product.name}
          </h1>

          {/* Stock Badges */}
          <div style={{ marginBottom: '1.5rem' }}>
            {isOutOfStock ? (
              <span className="badge badge-danger">Out of Stock</span>
            ) : product.stock <= 3 ? (
              <span className="badge badge-warning">Only {product.stock} items left in stock</span>
            ) : (
              <span className="badge badge-success">In Stock ({product.stock} units available)</span>
            )}
          </div>

          <h2 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
            ${product.price.toLocaleString()}
          </h2>

          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '2.5rem' }}>
            {product.description}
          </p>

          {/* Interaction Area */}
          {!isOutOfStock && (
            <div style={{ marginBottom: '2rem' }}>
              <div className="form-label">Quantity</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {/* Quantity Toggles */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: 'var(--border-radius-sm)',
                  padding: '0.35rem'
                }}>
                  <button 
                    onClick={handleDecrement}
                    disabled={quantity <= 1}
                    className="flex-center"
                    style={{ 
                      width: '32px', 
                      height: '32px', 
                      borderRadius: 'var(--border-radius-sm)',
                      cursor: 'pointer',
                      background: 'rgba(255,255,255,0.03)',
                      opacity: quantity <= 1 ? 0.3 : 1
                    }}
                  >
                    <Minus size={14} />
                  </button>
                  <span style={{ minWidth: '40px', textAlign: 'center', fontWeight: 600 }}>{quantity}</span>
                  <button 
                    onClick={handleIncrement}
                    disabled={quantity >= product.stock}
                    className="flex-center"
                    style={{ 
                      width: '32px', 
                      height: '32px', 
                      borderRadius: 'var(--border-radius-sm)',
                      cursor: 'pointer',
                      background: 'rgba(255,255,255,0.03)',
                      opacity: quantity >= product.stock ? 0.3 : 1
                    }}
                  >
                    <Plus size={14} />
                  </button>
                </div>

                {/* Add Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  className="btn-primary flex-center"
                  style={{ gap: '0.6rem', padding: '0.85rem 2.5rem', flexGrow: 1 }}
                >
                  {isAdding ? (
                    <span className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></span>
                  ) : (
                    <>
                      <ShoppingCart size={18} />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Guarantee Badges */}
          <div style={{ 
            borderTop: '1px solid var(--glass-border)', 
            paddingTop: '2rem', 
            marginTop: '2rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1rem',
            textAlign: 'center'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={24} style={{ color: 'var(--accent-secondary)' }} />
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Secure Warranty</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <Truck size={24} style={{ color: 'var(--accent-secondary)' }} />
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Express Shipping</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <RefreshCw size={24} style={{ color: 'var(--accent-secondary)' }} />
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>30-Day Exchange</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
