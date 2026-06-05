import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart } from 'lucide-react';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault(); // Stop click from bubbling up to card link
    if (!user) {
      navigate('/login');
      return;
    }
    
    setIsAdding(true);
    await addToCart(product._id, 1);
    setIsAdding(false);
  };

  const isOutOfStock = product.stock <= 0;

  return (
    <Link to={`/product/${product._id}`} className="glass-card" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      overflow: 'hidden',
      height: '100%',
      position: 'relative'
    }}>
      {/* Category Tag */}
      <span style={{
        position: 'absolute',
        top: '1rem',
        left: '1rem',
        background: 'rgba(11, 15, 25, 0.7)',
        border: '1px solid var(--glass-border)',
        padding: '0.25rem 0.75rem',
        borderRadius: 'var(--border-radius-full)',
        fontSize: '0.75rem',
        fontWeight: 600,
        color: 'var(--accent-secondary)',
        zIndex: 2
      }}>
        {product.category}
      </span>

      {/* Product Image */}
      <div style={{ 
        width: '100%', 
        height: '240px', 
        background: '#131924', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '1.5rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          style={{ 
            maxWidth: '100%', 
            maxHeight: '100%', 
            objectFit: 'contain',
            transition: 'transform 0.5s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        />
      </div>

      {/* Details Area */}
      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem', lineClamp: 1, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
          {product.name}
        </h3>
        
        <p style={{ 
          color: 'var(--text-secondary)', 
          fontSize: '0.875rem', 
          marginBottom: '1.25rem',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          height: '42px'
        }}>
          {product.description}
        </p>

        <div style={{ 
          marginTop: 'auto', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Price</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              ${product.price.toLocaleString()}
            </div>
          </div>

          {isOutOfStock ? (
            <span className="badge badge-danger">Out of Stock</span>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className="btn-primary flex-center"
              style={{ 
                padding: '0.6rem 1rem', 
                borderRadius: 'var(--border-radius-sm)', 
                gap: '0.4rem', 
                fontSize: '0.875rem',
                boxShadow: 'none'
              }}
            >
              {isAdding ? (
                <span className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }}></span>
              ) : (
                <>
                  <ShoppingCart size={16} />
                  <span>Add</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
