import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { productService } from '../services/api';
import { Plus, Trash2, Edit, X, RefreshCw, Layers, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const { user, isAdmin } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [stock, setStock] = useState('');
  const [category, setCategory] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await productService.getProducts();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error('Error fetching admin products:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!isAdmin) {
      return; // Show unauthorized screen below
    }
    fetchProducts();
  }, [user, isAdmin]);

  const resetForm = () => {
    setName('');
    setDescription('');
    setPrice('');
    setImageUrl('');
    setStock('');
    setCategory('');
    setEditingId(null);
    setIsFormOpen(false);
  };

  const handleEditInit = (product) => {
    setName(product.name);
    setDescription(product.description);
    setPrice(product.price);
    setImageUrl(product.imageUrl);
    setStock(product.stock);
    setCategory(product.category);
    setEditingId(product._id);
    setIsFormOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !description || !price || !imageUrl || !stock || !category) {
      return showToast('error', 'All fields are required');
    }

    const payload = {
      name,
      description,
      price: parseFloat(price),
      imageUrl,
      stock: parseInt(stock, 10),
      category,
    };

    try {
      if (editingId) {
        // Edit Mode
        const data = await productService.updateProduct(editingId, payload);
        if (data.success) {
          showToast('success', 'Product updated successfully');
          fetchProducts();
          resetForm();
        }
      } else {
        // Create Mode
        const data = await productService.createProduct(payload);
        if (data.success) {
          showToast('success', 'Product created successfully');
          fetchProducts();
          resetForm();
        }
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Action failed';
      showToast('error', msg);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) return;

    try {
      const data = await productService.deleteProduct(productId);
      if (data.success) {
        showToast('success', 'Product removed successfully');
        fetchProducts();
      }
    } catch (error) {
      showToast('error', 'Failed to remove product');
    }
  };

  if (user && !isAdmin) {
    return (
      <div className="container flex-center" style={{ minHeight: '400px', flexDirection: 'column', gap: '1.5rem', textAlign: 'center' }}>
        <ShieldAlert size={64} style={{ color: 'var(--danger)' }} />
        <h2>Access Denied</h2>
        <p style={{ color: 'var(--text-secondary)' }}>You do not have administrative privileges to access this panel.</p>
        <button onClick={() => navigate('/')} className="btn-primary">Return to Store</button>
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: '5rem' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '2.5rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h1 style={{ fontSize: '2rem' }}>Admin Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Configure product catalog details, stock quantities, and descriptions
          </p>
        </div>

        <button 
          onClick={() => { isFormOpen ? resetForm() : setIsFormOpen(true); }}
          className="btn-primary flex-center"
          style={{ gap: '0.5rem', padding: '0.75rem 1.25rem' }}
        >
          {isFormOpen ? (
            <>
              <X size={18} />
              <span>Cancel</span>
            </>
          ) : (
            <>
              <Plus size={18} />
              <span>Add New Product</span>
            </>
          )}
        </button>
      </div>

      {/* Form Card (Create/Edit) */}
      {isFormOpen && (
        <div className="glass-card" style={{ padding: '2rem', marginBottom: '2.5rem', border: '1px solid rgba(99, 102, 241, 0.25)' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
            {editingId ? 'Edit Product Parameters' : 'Register New Product'}
          </h3>

          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">Product Name</label>
              <input
                type="text"
                required
                className="form-control"
                placeholder="AeroSound Pro Headphones"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                required
                className="form-control"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ cursor: 'pointer' }}
              >
                <option value="">Select Category</option>
                <option value="Audio">Audio</option>
                <option value="Wearables">Wearables</option>
                <option value="Peripherals">Peripherals</option>
                <option value="Computers">Computers</option>
                <option value="Cameras">Cameras</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Price ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                className="form-control"
                placeholder="299"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Stock Quantity</label>
              <input
                type="number"
                min="0"
                required
                className="form-control"
                placeholder="15"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Image Asset URL</label>
              <input
                type="text"
                required
                className="form-control"
                placeholder="/assets/images/headphones.png"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Product Description</label>
              <textarea
                required
                rows={4}
                className="form-control"
                placeholder="Describe product attributes, warranty, acoustics, and key specifications details..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button type="button" onClick={resetForm} className="btn-secondary">
                Reset
              </button>
              <button type="submit" className="btn-primary">
                {editingId ? 'Save Product Changes' : 'Publish Product'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Catalog List */}
      <div className="glass-card" style={{ overflow: 'hidden', boxShadow: 'none' }}>
        <h3 style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Layers size={18} />
          <span>Active Product Catalog ({products.length})</span>
        </h3>

        {loading ? (
          <div className="flex-center" style={{ minHeight: '200px' }}>
            <div className="spinner"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="flex-center" style={{ minHeight: '200px', color: 'var(--text-secondary)' }}>
            No products available. Add one using the button above.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.02)' }}>
                  <th style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Image</th>
                  <th style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Name</th>
                  <th style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Category</th>
                  <th style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Price</th>
                  <th style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Stock</th>
                  <th style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((prod) => (
                  <tr key={prod._id} style={{ borderBottom: '1px solid var(--glass-border)', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.01)'} onMouseOut={(e) => e.currentTarget.style.background = 'none'}>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <div style={{ width: '40px', height: '40px', background: '#131924', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.2rem' }}>
                        <img src={prod.imageUrl} alt={prod.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>{prod.name}</td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <span className="badge badge-success" style={{ background: 'rgba(6, 182, 212, 0.12)', color: 'var(--accent-secondary)', border: '1px solid rgba(6, 182, 212, 0.25)' }}>
                        {prod.category}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>${prod.price.toLocaleString()}</td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      {prod.stock === 0 ? (
                        <span className="badge badge-danger">Out of Stock</span>
                      ) : (
                        <span>{prod.stock} units</span>
                      )}
                    </td>
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                        <button 
                          onClick={() => handleEditInit(prod)}
                          style={{ 
                            cursor: 'pointer', 
                            color: 'var(--accent-secondary)', 
                            background: 'rgba(6, 182, 212, 0.05)',
                            border: '1px solid rgba(6, 182, 212, 0.25)',
                            padding: '0.4rem', 
                            borderRadius: '4px',
                            display: 'flex'
                          }}
                        >
                          <Edit size={14} />
                        </button>
                        <button 
                          onClick={() => handleDelete(prod._id)}
                          style={{ 
                            cursor: 'pointer', 
                            color: 'var(--danger)', 
                            background: 'rgba(239, 68, 68, 0.05)',
                            border: '1px solid rgba(239, 68, 68, 0.25)',
                            padding: '0.4rem', 
                            borderRadius: '4px',
                            display: 'flex'
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
