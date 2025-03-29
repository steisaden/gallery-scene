// src/contexts/CartContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from './AuthContext';

// Create the cart context
const CartContext = createContext(null);

// Local storage key
const CART_STORAGE_KEY = 'gallery_cart';

// Cart provider component
export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  // Initialize cart from local storage on mount
  useEffect(() => {
    const loadCart = () => {
      try {
        const storedCart = localStorage.getItem(CART_STORAGE_KEY);
        if (storedCart) {
          setItems(JSON.parse(storedCart));
        }
      } catch (err) {
        console.error('Error loading cart from storage', err);
        // Reset cart if corrupted
        localStorage.removeItem(CART_STORAGE_KEY);
      } finally {
        setLoading(false);
      }
    };
    
    loadCart();
  }, []);
  
  // Save cart to local storage whenever items change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, loading]);
  
  // Add item to cart
  const addItem = (artwork) => {
    // Check if item already exists in cart
    if (items.some(item => item.id === artwork.id)) {
      return false; // Item already in cart
    }
    
    setItems(prevItems => [...prevItems, {
      id: artwork.id,
      title: artwork.title,
      artist: artwork.artist,
      price: artwork.price,
      currency: artwork.currency || 'USD',
      imageUrl: artwork.imageUrl,
      addedAt: new Date().toISOString()
    }]);
    
    return true; // Item added successfully
  };
  
  // Remove item from cart
  const removeItem = (artworkId) => {
    setItems(prevItems => prevItems.filter(item => item.id !== artworkId));
  };
  
  // Clear entire cart
  const clearCart = () => {
    setItems([]);
  };
  
  // Check if item is in cart
  const isInCart = (artworkId) => {
    return items.some(item => item.id === artworkId);
  };
  
  // Calculate cart totals
  const getCartTotals = () => {
    const itemCount = items.length;
    const subtotal = items.reduce((sum, item) => sum + item.price, 0);
    
    // Apply taxes (could be more sophisticated in a real app)
    const taxRate = 0.08; // 8% tax
    const tax = subtotal * taxRate;
    
    // Calculate total
    const total = subtotal + tax;
    
    return {
      itemCount,
      subtotal,
      tax,
      total,
      currency: items.length > 0 ? items[0].currency : 'USD' // Assuming same currency for all
    };
  };
  
  // Context value
  const value = {
    items,
    loading,
    addItem,
    removeItem,
    clearCart,
    isInCart,
    ...getCartTotals(),
    getCartTotals
  };
  
  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

CartProvider.propTypes = {
  children: PropTypes.node.isRequired
};

// Custom hook for using the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  
  return context;
};

export default CartContext;