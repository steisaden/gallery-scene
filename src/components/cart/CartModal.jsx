// src/components/cart/CartModal.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import CheckoutForm from './CheckoutForm';
import '../../styles/CartModal.css';

const CartModal = ({ onClose }) => {
  const { items, removeItem, clearCart, subtotal, tax, total, currency } = useCart();
  const { isAuthenticated } = useAuth();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  
  // Handle proceed to checkout
  const handleCheckout = () => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }
    
    setIsCheckingOut(true);
  };
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD'
    }).format(amount);
  };
  
  return (
    <div className="modal-overlay">
      <div className="modal-container cart-modal">
        <div className="modal-header">
          <h2>Your Cart</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-content">
          {items.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-cart-icon">🛒</div>
              <h3>Your Cart is Empty</h3>
              <p>Explore our gallery and add artworks to your cart!</p>
              <button className="primary-button" onClick={onClose}>
                Continue Browsing
              </button>
            </div>
          ) : isCheckingOut ? (
            <CheckoutForm 
              items={items} 
              subtotal={subtotal}
              tax={tax}
              total={total}
              onCancel={() => setIsCheckingOut(false)}
              onComplete={() => {
                clearCart();
                onClose();
              }}
            />
          ) : showLoginPrompt ? (
            <div className="login-prompt">
              <h3>Please Log In to Continue</h3>
              <p>You need to be logged in to complete your purchase.</p>
              <div className="login-prompt-actions">
                <button 
                  className="secondary-button"
                  onClick={() => setShowLoginPrompt(false)}
                >
                  Back to Cart
                </button>
                <button 
                  className="primary-button"
                  onClick={onClose}
                >
                  Log In
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {items.map(item => (
                  <div key={item.id} className="cart-item">
                    <div className="item-image">
                      <img src={item.imageUrl} alt={item.title} />
                    </div>
                    <div className="item-details">
                      <h3 className="item-title">{item.title}</h3>
                      <p className="item-artist">by {item.artist}</p>
                      <p className="item-price">{formatCurrency(item.price)}</p>
                    </div>
                    <button
                      className="remove-item-button"
                      onClick={() => removeItem(item.id)}
                      aria-label="Remove item"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="cart-footer">
                <div className="cart-totals">
                  <div className="totals-row">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="totals-row">
                    <span>Tax</span>
                    <span>{formatCurrency(tax)}</span>
                  </div>
                  <div className="totals-row total">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>
                
                <div className="cart-actions">
                  <button 
                    className="secondary-button"
                    onClick={clearCart}
                  >
                    Clear Cart
                  </button>
                  <button 
                    className="primary-button"
                    onClick={handleCheckout}
                  >
                    Checkout
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

CartModal.propTypes = {
  onClose: PropTypes.func.isRequired
};

export default CartModal;