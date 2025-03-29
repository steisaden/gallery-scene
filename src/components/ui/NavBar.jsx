// src/components/ui/NavBar.jsx
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import '../../styles/NavBar.css';

const NavBar = ({ 
  onLoginClick, 
  onProfileClick, 
  onCartClick,
  onHomeClick,
  currentView
}) => {
  const { user, isAuthenticated } = useAuth();
  const { items, itemCount } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Handle scroll event to change navbar style
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Toggle mobile menu
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  
  // Close mobile menu
  const closeMenu = () => {
    setMenuOpen(false);
  };
  
  // Handle user-related button clicks
  const handleUserAction = () => {
    if (isAuthenticated) {
      onProfileClick();
    } else {
      onLoginClick();
    }
    closeMenu();
  };
  
  // Handle cart click
  const handleCartClick = () => {
    onCartClick();
    closeMenu();
  };
  
  // Handle home navigation
  const handleHomeClick = () => {
    if (onHomeClick) {
      onHomeClick();
    }
    closeMenu();
  };
  
  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo">
          <a href="#home" onClick={(e) => { e.preventDefault(); handleHomeClick(); }}>
            Space Gallery
          </a>
        </div>
        
        {/* Navigation Links - Desktop */}
        <div className="navbar-links">
          {currentView === 'gallery' && (
            <a 
              href="#home" 
              className="nav-link home-link"
              onClick={(e) => { e.preventDefault(); handleHomeClick(); }}
            >
              Back to Home
            </a>
          )}
          <a href="#gallery" className="nav-link">Gallery</a>
          <a href="#artists" className="nav-link">Artists</a>
          <a href="#exhibitions" className="nav-link">Exhibitions</a>
          <a href="#about" className="nav-link">About</a>
        </div>
        
        {/* User Controls */}
        <div className="navbar-controls">
          <button 
            className="control-button user-button"
            onClick={handleUserAction}
            aria-label={isAuthenticated ? "Profile" : "Login"}
          >
            {isAuthenticated ? (
              <div className="user-avatar" title={user.name}>
                {user.name.charAt(0).toUpperCase()}
              </div>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            )}
          </button>
          
          <button 
            className="control-button cart-button"
            onClick={handleCartClick}
            aria-label="Cart"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            {items.length > 0 && (
              <span className="cart-badge">{itemCount}</span>
            )}
          </button>
          
          {/* Mobile Menu Button */}
          <button 
            className="mobile-menu-button"
            onClick={toggleMenu}
            aria-label="Menu"
          >
            <span className={`menu-icon ${menuOpen ? 'open' : ''}`}></span>
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-links">
          {currentView === 'gallery' && (
            <a 
              href="#home" 
              className="mobile-link"
              onClick={(e) => { e.preventDefault(); handleHomeClick(); }}
            >
              Back to Home
            </a>
          )}
          <a href="#gallery" className="mobile-link" onClick={closeMenu}>Gallery</a>
          <a href="#artists" className="mobile-link" onClick={closeMenu}>Artists</a>
          <a href="#exhibitions" className="mobile-link" onClick={closeMenu}>Exhibitions</a>
          <a href="#about" className="mobile-link" onClick={closeMenu}>About</a>
        </div>
        
        <div className="mobile-menu-actions">
          <button 
            className="mobile-action-button"
            onClick={handleUserAction}
          >
            {isAuthenticated ? 'My Profile' : 'Login / Register'}
          </button>
          
          <button 
            className="mobile-action-button"
            onClick={handleCartClick}
          >
            Cart {items.length > 0 && `(${items.length})`}
          </button>
        </div>
      </div>
    </nav>
  );
};

NavBar.propTypes = {
  onLoginClick: PropTypes.func.isRequired,
  onProfileClick: PropTypes.func.isRequired,
  onCartClick: PropTypes.func.isRequired,
  onHomeClick: PropTypes.func,
  currentView: PropTypes.string
};

export default NavBar;