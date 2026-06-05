import React, { useState, useEffect } from 'react';
import { orderService } from '../services/api';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Phone, DollarSign, PackageOpen } from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await orderService.getOrders();
        if (data.success) {
          setOrders(data.orders);
        }
      } catch (error) {
        console.error('Error fetching orders:', error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: '400px' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (orders.length === 0) {
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
          <PackageOpen size={30} />
        </div>
        <div>
          <h2>No Orders Found</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>You haven't placed any orders yet.</p>
        </div>
        <Link to="/" className="btn-primary">Shop Our Products</Link>
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: '5rem' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Your Orders ({orders.length})</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {orders.map((order) => (
          <div key={order._id} className="glass-card" style={{ padding: '2rem', boxShadow: 'none' }}>
            {/* Header info */}
            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              gap: '1rem',
              borderBottom: '1px solid var(--glass-border)',
              paddingBottom: '1.25rem',
              marginBottom: '1.5rem'
            }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Order ID: <span style={{ fontFamily: 'monospace', color: 'var(--text-primary)', fontWeight: 600 }}>{order._id}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                  <Calendar size={14} />
                  <span>Placed on: {new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'right' }}>Total Cost</div>
                  <div style={{ fontWeight: 700, fontSize: '1.15rem', display: 'flex', alignItems: 'center', color: 'var(--text-primary)' }}>
                    ${order.totalAmount.toLocaleString()}
                  </div>
                </div>
                <span className={`badge ${order.status === 'Completed' ? 'badge-success' : 'badge-warning'}`}>
                  {order.status}
                </span>
              </div>
            </div>

            {/* Main info row: Products & Delivery Details */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
              {/* Products list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Items Purchased</div>
                {order.products.map((item) => (
                  <div key={item._id} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ 
                      width: '45px', 
                      height: '45px', 
                      background: '#131924', 
                      borderRadius: 'var(--border-radius-sm)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      padding: '0.25rem',
                      flexShrink: 0
                    }}>
                      <img src={item.imageUrl} alt={item.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                    </div>
                    <div style={{ flexGrow: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        Quantity: {item.quantity} × ${item.price.toLocaleString()}
                      </div>
                    </div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', flexShrink: 0 }}>
                      ${(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery info */}
              <div style={{ 
                borderLeft: '1px solid var(--glass-border)', 
                paddingLeft: '2rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}
              className="delivery-info-section"
              >
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Delivery Information</div>
                
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <MapPin size={18} style={{ color: 'var(--accent-secondary)', flexShrink: 0, marginTop: '0.2rem' }} />
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Shipping Destination</div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: '1.4' }}>{order.shippingAddress}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <Phone size={18} style={{ color: 'var(--accent-secondary)', flexShrink: 0, marginTop: '0.2rem' }} />
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Contact Information</div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{order.contactNumber}</div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
