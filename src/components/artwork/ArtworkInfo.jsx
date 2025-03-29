// src/components/artwork/ArtworkInfo.jsx
import React from 'react';
import PropTypes from 'prop-types';
import '../../styles/ArtworkInfo.css';

const ArtworkInfo = ({ artwork, onClose, onPurchase, onAddToCart, isInCart }) => {
  // Format categories for display
  const categories = artwork.categories ? artwork.categories.join(', ') : '';
  
  return (
    <div className="artwork-info-panel">
      <button className="close-button" onClick={onClose}>×</button>
      
      <h2 className="artwork-title">{artwork.title}</h2>
      <p className="artwork-artist">by {artwork.artist}</p>
      
      <div className="artwork-details">
        {artwork.year && (
          <>
            <span className="detail-label">Year:</span>
            <span className="detail-value">{artwork.year}</span>
          </>
        )}
        
        {artwork.medium && (
          <>
            <span className="detail-label">Medium:</span>
            <span className="detail-value">{artwork.medium}</span>
          </>
        )}
        
        {artwork.dimensions && (
          <>
            <span className="detail-label">Dimensions:</span>
            <span className="detail-value">{artwork.dimensions}</span>
          </>
        )}
        
        {categories && (
          <>
            <span className="detail-label">Categories:</span>
            <span className="detail-value">{categories}</span>
          </>
        )}
        
        {artwork.forSale && (
          <>
            <span className="detail-label">Price:</span>
            <span className="detail-value">${artwork.price}</span>
          </>
        )}
      </div>
      
      {artwork.description && (
        <div className="artwork-description">
          <p>{artwork.description}</p>
        </div>
      )}
      
      {isInCart && (
        <div className="in-cart-badge">Added to Cart</div>
      )}
      
      {artwork.forSale && !isInCart && (
        <div className="artwork-actions">
          {onAddToCart && (
            <button className="cart-button" onClick={onAddToCart}>
              Add to Cart
            </button>
          )}
          
          {onPurchase && (
            <button className="purchase-button" onClick={onPurchase}>
              Buy Now
            </button>
          )}
        </div>
      )}
    </div>
  );
};

ArtworkInfo.propTypes = {
  artwork: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    artist: PropTypes.string,
    description: PropTypes.string,
    year: PropTypes.string,
    medium: PropTypes.string,
    dimensions: PropTypes.string,
    categories: PropTypes.arrayOf(PropTypes.string),
    price: PropTypes.number,
    forSale: PropTypes.bool
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onPurchase: PropTypes.func,
  onAddToCart: PropTypes.func,
  isInCart: PropTypes.bool
};

export default ArtworkInfo;