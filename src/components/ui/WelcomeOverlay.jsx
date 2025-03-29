// src/components/ui/WelcomeOverlay.jsx
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../../styles/WelcomeOverlay.css';

const WelcomeOverlay = ({ onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  
  // Auto-advance slides
  useEffect(() => {
    if (fadeOut) return;
    
    const timer = setTimeout(() => {
      if (currentSlide < slides.length - 1) {
        setCurrentSlide(currentSlide + 1);
      }
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [currentSlide, fadeOut]);
  
  // Handle close with fade-out animation
  const handleClose = () => {
    setFadeOut(true);
    setTimeout(onClose, 500); // Match the CSS transition duration
  };
  
  // Slides content
  const slides = [
    {
      title: "Welcome to the Virtual Art Gallery",
      content: "Explore our unique collection of artworks in an immersive 3D environment. Navigate through different gallery styles and discover amazing pieces from talented artists."
    },
    {
      title: "Navigation Controls",
      content: "Use WASD or arrow keys to move through the gallery. Click and drag to look around. Press 'L' to toggle information labels for artworks and exhibits."
    },
    {
      title: "Gallery Types",
      content: "Our virtual space features multiple gallery layouts including Box, Circle, Triangle, and X-shaped spaces. Each gallery showcases different artworks and experiences."
    },
    {
      title: "Purchase Artwork",
      content: "Found a piece you love? Click on any artwork to view details and purchase options. Create an account to save favorites and track your purchases."
    }
  ];
  
  // Go to specific slide
  const goToSlide = (index) => {
    setCurrentSlide(index);
  };
  
  return (
    <div className={`welcome-overlay ${fadeOut ? 'fade-out' : ''}`}>
      <div className="welcome-content">
        <div className="welcome-header">
          <h1>Space Gallery</h1>
          <button className="close-button" onClick={handleClose} aria-label="Close">
            ×
          </button>
        </div>
        
        <div className="welcome-slides">
          <div className="slide" key={slides[currentSlide].title}>
            <h2>{slides[currentSlide].title}</h2>
            <p>{slides[currentSlide].content}</p>
          </div>
        </div>
        
        <div className="slide-indicators">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`slide-indicator ${currentSlide === index ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        
        <div className="welcome-actions">
          {currentSlide < slides.length - 1 ? (
            <button 
              className="next-button" 
              onClick={() => setCurrentSlide(currentSlide + 1)}
            >
              Next
            </button>
          ) : (
            <button 
              className="start-button" 
              onClick={handleClose}
            >
              Enter Gallery
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

WelcomeOverlay.propTypes = {
  onClose: PropTypes.func.isRequired
};

export default WelcomeOverlay;