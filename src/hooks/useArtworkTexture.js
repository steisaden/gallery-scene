// src/hooks/useArtworkTexture.js
import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Custom hook to load and manage artwork textures
 * 
 * @param {string} imageUrl - The URL of the image to load
 * @param {Object} options - Additional options for texture loading
 * @returns {Object} The loaded texture and status information
 */
const useArtworkTexture = (imageUrl, options = {}) => {
  const [texture, setTexture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const textureRef = useRef(null);

  useEffect((options) => {
    // Don't attempt to load if no URL is provided
    if (!imageUrl) {
      setLoading(false);
      setError(new Error('No image URL provided'));
      return;
    }

    // Create texture loader
    const loader = new THREE.TextureLoader();
    
    // Apply loader options
    if (options.crossOrigin) {
      loader.crossOrigin = options.crossOrigin;
    }

    // Reset state on new URL
    setTexture(null);
    setError(null);
    setLoading(true);

    // Load the texture
    loader.load(
      // URL
      imageUrl,
      
      // onLoad callback
      (loadedTexture) => {
        // Apply texture options
        if (options.flipY !== undefined) {
          loadedTexture.flipY = options.flipY;
        }
        
        if (options.encoding) {
          loadedTexture.encoding = options.encoding;
        } else {
          // Default to sRGB encoding for most images
          loadedTexture.encoding = THREE.sRGBEncoding;
        }
        
        if (options.wrapS) {
          loadedTexture.wrapS = options.wrapS;
        }
        
        if (options.wrapT) {
          loadedTexture.wrapT = options.wrapT;
        }
        
        // Apply any additional processing
        if (options.onTextureLoad) {
          options.onTextureLoad(loadedTexture);
        }
        
        // Update state and ref
        setTexture(loadedTexture);
        textureRef.current = loadedTexture;
        setLoading(false);
        setError(null);
      },
      
      // onProgress callback
      (progressEvent) => {
        // Handle progress if needed
        if (options.onProgress) {
          options.onProgress(progressEvent);
        }
      },
      
      // onError callback
      (err) => {
        console.error('Error loading texture:', err);
        setError(err);
        setLoading(false);
        
        // Create fallback texture if specified
        if (options.fallback) {
          const fallbackTexture = createFallbackTexture(imageUrl, options.fallbackColor || '#444444');
          setTexture(fallbackTexture);
          textureRef.current = fallbackTexture;
        }
      }
    );
    
    // Cleanup function
    return () => {
      if (textureRef.current) {
        textureRef.current.dispose();
      }
    };
  }, [
    imageUrl, 
    options.flipY, 
    options.encoding, 
    options.wrapS, 
    options.wrapT, 
    options.crossOrigin,
    options.fallback,
    options.fallbackColor,
    options.onProgress,
    options.onTextureLoad
  ]);

  /**
   * Create a fallback texture with error information
   */
  const createFallbackTexture = (url, color = '#444444') => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    // Background
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Error indicator
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(128, 128);
    ctx.lineTo(384, 384);
    ctx.moveTo(384, 128);
    ctx.lineTo(128, 384);
    ctx.stroke();
    
    // Error text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Texture Error', canvas.width / 2, canvas.height / 2 - 16);
    
    // Filename text
    const filename = url.split('/').pop();
    ctx.font = '24px Arial';
    ctx.fillText(filename, canvas.width / 2, canvas.height / 2 + 32);
    
    // Create and return texture
    const fallbackTexture = new THREE.CanvasTexture(canvas);
    return fallbackTexture;
  };

  return { texture, loading, error };
};

export default useArtworkTexture;