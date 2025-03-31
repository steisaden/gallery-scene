// src/components/artwork/PurchasePanel.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import '../../styles/components/PurchasePanel.css';

/**
 * PurchasePanel component for managing artwork purchases
 * 
 * @param {Object} artwork - Artwork data object
 * @param {Function} onAddToCart - Add to cart handler
 * @param {Function} onPurchase - Direct purchase handler
 * @param {Function} onClose - Close panel handler
 */
const PurchasePanel = ({ artwork, onAddToCart, onPurchase, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [purchaseOption, setPurchaseOption] = useState('digital');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Handle quantity change
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= 10) {
      setQuantity(value);
    }
  };
  
  // Handle purchase option change
  const handleOptionChange = (e) => {
    setPurchaseOption(e.target.value);
  };
  
  // Calculate total price
  const calculateTotal = () => {
    if (!artwork) return 0;
    
    let basePrice = artwork.price || 0;
    
    // Add shipping cost for physical items
    if (purchaseOption === 'physical') {
      basePrice += 15; // Shipping fee
    }
    
    return (basePrice * quantity).toFixed(2);
  };
  
  // Handle add to cart
  const handleAddToCart = () => {
    if (!artwork) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const purchaseDetails = {
        artwork: artwork,
        quantity: quantity,
        option: purchaseOption,
        total: parseFloat(calculateTotal())
      };
      
      // Call the onAddToCart callback
      if (onAddToCart) {
        onAddToCart(purchaseDetails);
      }
      
      // Reset form
      setQuantity(1);
      setPurchaseOption('digital');
      
      // Close panel after a short delay
      setTimeout(() => {
        setLoading(false);
        if (onClose) {
          onClose();
        }
      }, 500);
    } catch (err) {
      setLoading(false);
      setError('Failed to add artwork to cart. Please try again.');
      console.error('Add to cart error:', err);
    }
  };
  
  // Handle direct purchase
  const handlePurchase = () => {
    if (!artwork) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const purchaseDetails = {
        artwork: artwork,
        quantity: quantity,
        option: purchaseOption,
        total: parseFloat(calculateTotal())
      };
      
      // Call the onPurchase callback
      if (onPurchase) {
        onPurchase(purchaseDetails);
      }
      
      // Keep panel open during checkout process
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError('Failed to process purchase. Please try again.');
      console.error('Purchase error:', err);
    }
  };
  
  // If no artwork, show empty state
  if (!artwork) {
    return (
      <div className="purchase-panel purchase-panel-empty">
        <p>No artwork selected for purchase.</p>
        {onClose && (
          <button className="close-button" onClick={onClose}>×</button>
        )}
      </div>
    );
  }
  
  return (
    <div className="purchase-panel">
      <div className="purchase-header">
        <h2 className="purchase-title">Purchase Artwork</h2>
        {onClose && (
          <button className="close-button" onClick={onClose}>×</button>
        )}
      </div>
      
      <div className="artwork-preview">
        <div className="preview-image-container">
          <img 
            src={artwork.imageUrl || '/assets/placeholder-art.jpg'} 
            alt={artwork.title}
            className="preview-image"
          />
        </div>
        
        <div className="preview-details">
          <h3 className="preview-title">{artwork.title}</h3>
          {artwork.artist && (
            <p className="preview-artist">{artwork.artist}</p>
          )}
          <p className="preview-price">${artwork.price}</p>
        </div>
      </div>
      
      <div className="purchase-form">
        <div className="form-group">
          <label className="form-label">Purchase Option</label>
          <div className="purchase-options">
            <label className={`option-label ${purchaseOption === 'digital' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="purchaseOption"
                value="digital"
                checked={purchaseOption === 'digital'}
                onChange={handleOptionChange}
              />
              <div className="option-content">
                <div className="option-title">Digital</div>
                <div className="option-description">Receive a high-resolution digital file</div>
              </div>
            </label>
            
            <label className={`option-label ${purchaseOption === 'physical' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="purchaseOption"
                value="physical"
                checked={purchaseOption === 'physical'}
                onChange={handleOptionChange}
              />
              <div className="option-content">
                <div className="option-title">Physical Print</div>
                <div className="option-description">Receive a physical print (+ $15 shipping)</div>
              </div>
            </label>
          </div>
        </div>
        
        <div className="form-group">
          <label className="form-label" htmlFor="quantity">Quantity</label>
          <div className="quantity-input">
            <button 
              className="quantity-btn"
              onClick={() => quantity > 1 && setQuantity(quantity - 1)}
              disabled={quantity <= 1}
            >
              -
            </button>
            <input
              id="quantity"
              type="number"
              min="1"
              max="10"
              value={quantity}
              onChange={handleQuantityChange}
              className="quantity-field"
            />
            <button 
              className="quantity-btn"
              onClick={() => quantity < 10 && setQuantity(quantity + 1)}
              disabled={quantity >= 10}
            >
              +
            </button>
          </div>
        </div>
        
        <div className="purchase-summary">
          <div className="summary-row">
            <span className="summary-label">Subtotal:</span>
            <span className="summary-value">${(artwork.price * quantity).toFixed(2)}</span>
          </div>
          
          {purchaseOption === 'physical' && (
            <div className="summary-row">
              <span className="summary-label">Shipping:</span>
              <span className="summary-value">$15.00</span>
            </div>
          )}
          
          <div className="summary-row total">
            <span className="summary-label">Total:</span>
            <span className="summary-value">${calculateTotal()}</span>
          </div>
        </div>
        
        {error && (
          <div className="error-message">{error}</div>
        )}
        
        <div className="purchase-actions">
          <button 
            className="add-to-cart-button"
            onClick={handleAddToCart}
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add to Cart'}
          </button>
          
          <button 
            className="buy-now-button"
            onClick={handlePurchase}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Buy Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

PurchasePanel.propTypes = {
  artwork: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string,
    artist: PropTypes.string,
    imageUrl: PropTypes.string,
    price: PropTypes.number,
    originalPrice: PropTypes.number
  }),
  onAddToCart: PropTypes.func,
  onPurchase: PropTypes.func,
  onClose: PropTypes.func
};

export default PurchasePanel;