import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';

const Cart = () => {
  const { cart, updateCartItem, removeFromCart, cartTotalAmount, cartItemsCount } = useCart();
  const navigate = useNavigate();

  const handleQtyChange = async (productId, currentQty, amount, stock) => {
    const nextQty = currentQty + amount;
    if (nextQty < 1) return;
    if (nextQty > stock) return;
    await updateCartItem(productId, nextQty);
  };

  const estShipping = cartTotalAmount > 500 || cartTotalAmount === 0 ? 0 : 25;
  const grandTotal = cartTotalAmount + estShipping;

  if (cart.items.length === 0) {
    return (
      <div className="flex-center" style={{ minHeight: '400px', flexDirection: 'column', gap: '1.5rem', textAlign: 'center' }}>
        <div className="flex-center" style={{ 
          width: '70px', 
          height: '70px', 
          borderRadius: '50%', 
          background: 'rgba(255,255,255,0.03)', 
          border: '1px solid var(--glass-border)',
          color: 'var(--text-secondary)'
        }}>
          <ShoppingBag size={30} />
        </div>
        <div>
          <h2>Your Cart is Empty</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Add premium products to get started.</p>
        </div>
        <Link to="/" className="btn-primary">Browse Products</Link>
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: '5rem' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Shopping Cart ({cartItemsCount})</h1>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr',
        gap: '2rem',
        alignItems: 'start'
      }}
      className="cart-grid"
      >
        {/* Left: Cart Items List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {cart.items.map((item) => {
            const product = item.productId;
            if (!product) return null;

            return (
              <div key={item._id} className="glass-card" style={{ 
                padding: '1.25rem', 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: '1.5rem', 
                alignItems: 'center',
                boxShadow: 'none'
              }}>
                {/* Image */}
                <div style={{ 
                  width: '80px', 
                  height: '80px', 
                  background: '#131924', 
                  borderRadius: 'var(--border-radius-sm)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  padding: '0.5rem'
                }}>
                  <img src={product.imageUrl} alt={product.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                </div>

                {/* Details */}
                <div style={{ flexGrow: 1, minWidth: '200px' }}>
                  <Link to={`/product/${product._id}`} style={{ fontWeight: 600, fontSize: '1.05rem', hover: { color: 'var(--accent-primary)' } }}>
                    {product.name}
                  </Link>
                  <div style={{ color: 'var(--accent-secondary)', fontSize: '0.85rem', marginTop: '0.25rem', fontWeight: 600 }}>
                    {product.category}
                  </div>
                </div>

                {/* Pricing unit */}
                <div style={{ width: '100px' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Unit Price</div>
                  <div style={{ fontWeight: 600 }}>${product.price.toLocaleString()}</div>
                </div>

                {/* Quantity Manager */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  background: 'rgba(255,255,255,0.03)', 
                  border: '1px solid var(--glass-border)',
                  borderRadius: 'var(--border-radius-sm)',
                  padding: '0.25rem'
                }}>
                  <button 
                    onClick={() => handleQtyChange(product._id, item.quantity, -1, product.stock)}
                    disabled={item.quantity <= 1}
                    style={{ width: '28px', height: '28px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: item.quantity <= 1 ? 0.3 : 0.8 }}
                  >
                    <Minus size={12} />
                  </button>
                  <span style={{ minWidth: '30px', textAlign: 'center', fontWeight: 600, fontSize: '0.9rem' }}>{item.quantity}</span>
                  <button 
                    onClick={() => handleQtyChange(product._id, item.quantity, 1, product.stock)}
                    disabled={item.quantity >= product.stock}
                    style={{ width: '28px', height: '28px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: item.quantity >= product.stock ? 0.3 : 0.8 }}
                  >
                    <Plus size={12} />
                  </button>
                </div>

                {/* Subtotal */}
                <div style={{ width: '120px' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Price</div>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                    ${(product.price * item.quantity).toLocaleString()}
                  </div>
                </div>

                {/* Delete Button */}
                <button 
                  onClick={() => removeFromCart(product._id)}
                  style={{ 
                    cursor: 'pointer', 
                    color: 'var(--danger)', 
                    opacity: 0.8, 
                    padding: '0.5rem',
                    borderRadius: 'var(--border-radius-sm)',
                    background: 'rgba(239, 68, 68, 0.05)',
                    border: '1px solid rgba(239, 68, 68, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)'}
                  onMouseOut={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.05)'}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            );
          })}
        </div>

        {/* Right: Summary panel */}
        <div className="glass-card" style={{ padding: '2rem', boxShadow: 'none', position: 'sticky', top: '100px' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.75rem' }}>
            Order Summary
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Items Subtotal</span>
              <span>${cartTotalAmount.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Shipping Fee</span>
              <span>{estShipping === 0 ? <span style={{ color: 'var(--success)', fontWeight: 600 }}>FREE</span> : `$${estShipping}`}</span>
            </div>
            {estShipping > 0 && (
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Add ${(500 - cartTotalAmount).toLocaleString()} more for free shipping!
              </div>
            )}
          </div>

          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            fontSize: '1.25rem', 
            fontWeight: 700, 
            borderTop: '1px solid var(--glass-border)', 
            paddingTop: '1rem',
            marginBottom: '2rem'
          }}>
            <span>Total</span>
            <span style={{ color: 'var(--text-primary)' }}>${grandTotal.toLocaleString()}</span>
          </div>

          <button 
            onClick={() => navigate('/checkout')}
            className="btn-primary flex-center"
            style={{ width: '100%', gap: '0.5rem', padding: '0.9rem' }}
          >
            <span>Proceed to Checkout</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
