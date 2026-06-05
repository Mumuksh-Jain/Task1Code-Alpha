import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, LogOut, User, LayoutDashboard, ShoppingBag } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { cartItemsCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="navbar-glass">
      <div className="container" style={{ 
        height: '70px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between'
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div className="flex-center" style={{ 
            width: '38px', 
            height: '38px', 
            borderRadius: '10px', 
            background: 'var(--accent-gradient)',
            boxShadow: '0 0 10px var(--accent-glow)',
            color: 'white'
          }}>
            <ShoppingBag size={20} />
          </div>
          <span style={{ 
            fontFamily: 'var(--font-display)', 
            fontWeight: 800, 
            fontSize: '1.35rem', 
            letterSpacing: '-0.02em',
            background: 'var(--accent-gradient)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            AEROSTORE
          </span>
        </Link>

        {/* Action Panel */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Link to="/" style={{ fontWeight: 500, fontSize: '0.925rem', color: 'var(--text-secondary)' }}
            onMouseOver={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
            onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
          >
            Store
          </Link>

          {user && (
            <Link to="/orders" style={{ fontWeight: 500, fontSize: '0.925rem', color: 'var(--text-secondary)' }}
              onMouseOver={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
              onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
            >
              My Orders
            </Link>
          )}

          {isAdmin && (
            <Link to="/admin" style={{ 
              fontWeight: 500, 
              fontSize: '0.925rem', 
              color: 'var(--accent-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}
            onMouseOver={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
            onMouseOut={(e) => e.currentTarget.style.color = 'var(--accent-secondary)'}
            >
              <LayoutDashboard size={16} />
              <span>Admin</span>
            </Link>
          )}
        </div>

        {/* User profile controls & cart */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          {/* Cart Icon Link */}
          <Link to="/cart" style={{ position: 'relative', display: 'flex', padding: '0.4rem', color: 'var(--text-secondary)' }}
            onMouseOver={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
            onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
          >
            <ShoppingCart size={22} />
            {cartItemsCount > 0 && (
              <span className="flex-center" style={{
                position: 'absolute',
                top: '-0.3rem',
                right: '-0.3rem',
                background: 'var(--accent-primary)',
                color: 'white',
                fontSize: '0.7rem',
                fontWeight: 700,
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                boxShadow: '0 0 5px var(--accent-glow)'
              }}>
                {cartItemsCount}
              </span>
            )}
          </Link>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '1px solid var(--glass-border)', paddingLeft: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                <User size={16} style={{ color: 'var(--accent-secondary)' }} />
                <span>{user.name.split(' ')[0]}</span>
              </div>
              <button 
                onClick={handleLogout} 
                className="flex-center" 
                style={{ 
                  cursor: 'pointer', 
                  color: 'var(--text-secondary)',
                  padding: '0.4rem'
                }}
                onMouseOver={(e) => e.currentTarget.style.color = 'var(--danger)'}
                onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                title="Log Out"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderLeft: '1px solid var(--glass-border)', paddingLeft: '1.25rem' }}>
              <Link to="/login" className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', borderRadius: 'var(--border-radius-sm)' }}>
                Sign In
              </Link>
              <Link to="/register" className="btn-primary" style={{ padding: '0.5rem 1.1rem', fontSize: '0.875rem', borderRadius: 'var(--border-radius-sm)', boxShadow: 'none' }}>
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
