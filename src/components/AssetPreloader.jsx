// src/components/AssetPreloader.jsx
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { AssetManager } from './utils/AssetManager';
import '../styles/AssetPreloader.css';

/**
 * AssetPreloader component to load necessary assets before rendering the gallery
 * Shows a loading screen while assets are being loaded
 * 
 * @param {Function} onComplete - Callback when loading is complete
 * @param {ReactNode} children - Child components to render after loading
 */
const AssetPreloader = ({ onComplete, children }) => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [hasErrors, setHasErrors] = useState(false);

  useEffect(() => {
    // Start the preloading process
    const startTime = performance.now();
    
    // Create a simulated progress even if actual progress is unknown
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 95; // Hold at 95% until actually complete
        }
        return prev + (Math.random() * 3); // Random increment between 0-3%
      });
    }, 100);
    
    // Actually preload all assets
    AssetManager.preloadTextures((success) => {
      clearInterval(progressInterval);
      setHasErrors(!success);
      setProgress(100);
      
      // Add a short delay for UX purposes
      const loadTime = performance.now() - startTime;
      const minLoadTime = 1000; // Minimum 1 second loading screen
      
      setTimeout(() => {
        setLoading(false);
        if (onComplete) onComplete(success);
      }, Math.max(0, minLoadTime - loadTime));
    });
    
    return () => {
      clearInterval(progressInterval);
    };
  }, [onComplete]);

  if (loading) {
    return (
      <div className="asset-preloader">
        <h1 className="preloader-title">
          Loading Space Gallery
        </h1>
        
        <div className="progress-bar">
          <div 
            className={`progress-fill ${hasErrors ? 'error' : ''} progress-${Math.round(progress)}`}
          />
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

AssetPreloader.propTypes = {
  onComplete: PropTypes.func,
  children: PropTypes.node.isRequired
};

export default AssetPreloader;