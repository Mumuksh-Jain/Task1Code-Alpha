import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartService } from '../services/api';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { showToast } = useToast();

  const fetchCart = async () => {
    if (!user) {
      setCart({ items: [] });
      return;
    }
    setLoading(true);
    try {
      const data = await cartService.getCart();
      if (data.success) {
        setCart(data.cart || { items: [] });
      }
    } catch (error) {
      console.error('Error fetching cart:', error.message);
    } finally {
      setLoading(false);
    }
  };

  // Sync cart when user signs in or out
  useEffect(() => {
    fetchCart();
  }, [user]);

  const addToCart = async (productId, quantity = 1) => {
    if (!user) {
      showToast('info', 'Please sign in to add products to your cart');
      return false;
    }
    
    try {
      const data = await cartService.addToCart(productId, quantity);
      if (data.success) {
        setCart(data.cart);
        showToast('success', 'Product added to cart');
        return true;
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to add product to cart';
      showToast('error', msg);
      return false;
    }
  };

  const updateCartItem = async (productId, quantity) => {
    try {
      const data = await cartService.updateCartItem(productId, quantity);
      if (data.success) {
        setCart(data.cart);
        return true;
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to update quantity';
      showToast('error', msg);
      return false;
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const data = await cartService.removeFromCart(productId);
      if (data.success) {
        setCart(data.cart);
        showToast('info', 'Product removed from cart');
        return true;
      }
    } catch (error) {
      showToast('error', 'Failed to remove product');
      return false;
    }
  };

  const clearCart = async () => {
    try {
      const data = await cartService.clearCart();
      if (data.success) {
        setCart({ items: [] });
        return true;
      }
    } catch (error) {
      console.error('Error clearing cart:', error.message);
      return false;
    }
  };

  const cartItemsCount = cart.items.reduce((total, item) => total + item.quantity, 0);

  const cartTotalAmount = cart.items.reduce((total, item) => {
    const price = item.productId?.price || 0;
    return total + (price * item.quantity);
  }, 0);

  return (
    <CartContext.Provider value={{ 
      cart, 
      loading, 
      addToCart, 
      updateCartItem, 
      removeFromCart, 
      clearCart, 
      fetchCart,
      cartItemsCount,
      cartTotalAmount
    }}>
      {children}
    </CartContext.Provider>
  );
};
