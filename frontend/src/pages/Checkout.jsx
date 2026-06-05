import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { orderService } from '../services/api';
import { useToast } from '../context/ToastContext';
import { ShoppingCart, CreditCard, ChevronRight, Lock } from 'lucide-react';

const Checkout = () => {
  const { cart, cartTotalAmount, clearCart, cartItemsCount } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const estShipping = cartTotalAmount > 500 ? 0 : 25;
  const grandTotal = cartTotalAmount + estShipping;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!shippingAddress || !contactNumber) {
      return showToast('error', 'Please fill in shipping details');
    }
    if (!cardNumber || !cardExpiry || !cardCvv) {
      return showToast('error', 'Please fill in mock card billing credentials');
    }

    setIsSubmitting(true);
    try {
      const data = await orderService.createOrder({
        shippingAddress,
        contactNumber,
      });

      if (data.success) {
        showToast('success', 'Order created successfully!');
        await clearCart();
        navigate('/orders');
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to place order';
      showToast('error', msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="flex-center" style={{ minHeight: '400px', flexDirection: 'column', gap: '1rem' }}>
        <h2>No items to checkout</h2>
        <Link to="/" className="btn-primary">Go Home</Link>
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: '5rem' }}>
      {/* Breadcrumb indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
        <Link to="/cart">Cart</Link>
        <ChevronRight size={14} />
        <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Checkout</span>
      </div>

      <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Complete Checkout</h1>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr', 
        gap: '2.5rem',
        alignItems: 'start'
      }}
      className="checkout-grid"
      >
        {/* Left: Input Forms */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Card: Shipping Address */}
          <div className="glass-card" style={{ padding: '2rem', boxShadow: 'none' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>1. Shipping Details</span>
            </h3>

            <div className="form-group">
              <label className="form-label" htmlFor="address">Delivery Address</label>
              <textarea
                id="address"
                required
                rows={3}
                placeholder="Street name, City, Zipcode, State"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                className="form-control"
                style={{ resize: 'vertical' }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="phone">Contact Number</label>
              <input
                id="phone"
                type="tel"
                required
                placeholder="+1 (555) 000-0000"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                className="form-control"
              />
            </div>
          </div>

          {/* Card: Billing Credential */}
          <div className="glass-card" style={{ padding: '2rem', boxShadow: 'none' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CreditCard size={20} />
              <span>2. Mock Billing (Payment)</span>
            </h3>

            <div className="form-group">
              <label className="form-label" htmlFor="card-number">Card Number</label>
              <input
                id="card-number"
                type="text"
                required
                maxLength={19}
                placeholder="4111 2222 3333 4444"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="form-control"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="expiry">Expiration Date</label>
                <input
                  id="expiry"
                  type="text"
                  required
                  maxLength={5}
                  placeholder="MM/YY"
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value)}
                  className="form-control"
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="cvv">CVV Code</label>
                <input
                  id="cvv"
                  type="password"
                  required
                  maxLength={3}
                  placeholder="•••"
                  value={cardCvv}
                  onChange={(e) => setCardCvv(e.target.value)}
                  className="form-control"
                />
              </div>
            </div>

            <div style={{ 
              marginTop: '1.5rem', 
              background: 'rgba(99, 102, 241, 0.05)', 
              border: '1px solid rgba(99, 102, 241, 0.15)',
              borderRadius: 'var(--border-radius-sm)',
              padding: '0.75rem 1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              fontSize: '0.8rem',
              color: 'var(--text-secondary)'
            }}>
              <Lock size={16} style={{ color: 'var(--success)' }} />
              <span>Mock payment module. No actual funds will be charged.</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`btn-primary flex-center ${isSubmitting ? 'btn-disabled' : ''}`}
            style={{ width: '100%', padding: '0.95rem', gap: '0.6rem' }}
          >
            {isSubmitting ? (
              <span className="spinner" style={{ width: '22px', height: '22px', borderWidth: '2.5px' }}></span>
            ) : (
              <>
                <ShoppingCart size={18} />
                <span>Place Order (${grandTotal.toLocaleString()})</span>
              </>
            )}
          </button>
        </form>

        {/* Right: Cart Review Summary */}
        <div className="glass-card" style={{ padding: '2rem', boxShadow: 'none', position: 'sticky', top: '100px' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.75rem' }}>
            Review Items
          </h3>

          <div style={{ 
            maxHeight: '250px', 
            overflowY: 'auto', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1rem',
            marginBottom: '1.5rem',
            paddingRight: '0.5rem'
          }}>
            {cart.items.map((item) => {
              const product = item.productId;
              if (!product) return null;

              return (
                <div key={item._id} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ 
                    width: '50px', 
                    height: '50px', 
                    background: '#131924', 
                    borderRadius: 'var(--border-radius-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0.25rem',
                    flexShrink: 0
                  }}>
                    <img src={product.imageUrl} alt={product.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                  </div>
                  <div style={{ flexGrow: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {product.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      Qty: {item.quantity} × ${product.price.toLocaleString()}
                    </div>
                  </div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                    ${(product.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Items Total ({cartItemsCount})</span>
              <span>${cartTotalAmount.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Shipping Fee</span>
              <span>{estShipping === 0 ? <span style={{ color: 'var(--success)', fontWeight: 600 }}>FREE</span> : `$${estShipping}`}</span>
            </div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              fontSize: '1.125rem', 
              fontWeight: 700, 
              color: 'var(--text-primary)',
              borderTop: '1px solid var(--glass-border)', 
              paddingTop: '0.85rem',
              marginTop: '0.25rem'
            }}>
              <span>Total Price</span>
              <span>${grandTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
