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

  useEffect(() => {
    // Don't attempt to load if no URL is provided
    if (!imageUrl) {
      setLoading(false);
      setError(new Error('No image URL provided'));
      return;
    }

    // Create texture loader with safe cross-origin setting
    const loader = new THREE.TextureLoader();
    
    // Apply cross-origin setting - use a default if not provided
    loader.setCrossOrigin(options?.crossOrigin || 'anonymous');

    // Reset state on new URL
    setTexture(null);
    setError(null);
    setLoading(true);

    // Use a safe version of options to prevent undefined access
    const safeOptions = options || {};

    try {
      // Ensure the URL is valid and accessible
      const normalizedUrl = imageUrl.startsWith('/') 
        ? imageUrl 
        : `/${imageUrl}`;
      
      // Load the texture
      loader.load(
        // URL - ensure it's properly formatted
        normalizedUrl,
        
        // onLoad callback
        (loadedTexture) => {
          // Apply texture options if they exist
          if (loadedTexture) {
            if (safeOptions.flipY !== undefined) {
              loadedTexture.flipY = safeOptions.flipY;
            }
            
            if (safeOptions.colorSpace) {
              loadedTexture.colorSpace = safeOptions.colorSpace;
            } else {
              // Default to sRGB colorspace for most images
              loadedTexture.colorSpace = THREE.SRGBColorSpace;
            }
            
            if (safeOptions.wrapS) {
              loadedTexture.wrapS = safeOptions.wrapS;
            }
            
            if (safeOptions.wrapT) {
              loadedTexture.wrapT = safeOptions.wrapT;
            }
            
            // Apply any additional processing
            if (safeOptions.onTextureLoad) {
              safeOptions.onTextureLoad(loadedTexture);
            }
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
          if (safeOptions.onProgress) {
            safeOptions.onProgress(progressEvent);
          }
        },
        
        // onError callback
        (err) => {
          console.error('Error loading texture:', err, 'URL:', imageUrl);
          setError(err);
          setLoading(false);
          
          // Create fallback texture if specified
          if (safeOptions.fallback) {
            const fallbackTexture = createFallbackTexture(imageUrl, safeOptions.fallbackColor || '#444444');
            setTexture(fallbackTexture);
            textureRef.current = fallbackTexture;
          }
        }
      );
      
      // Cleanup function - carefully handle disposal
      return () => {
        if (textureRef.current) {
          try {
            textureRef.current.dispose();
            textureRef.current = null;
          } catch (err) {
            console.error('Error disposing texture:', err);
          }
        }
      };
    } catch (err) {
      // Catch any unexpected errors in the effect itself
      console.error('Error in texture loading effect:', err);
      setError(err);
      setLoading(false);
      
      // Create fallback if specified
      if (options?.fallback) {
        const fallbackTexture = createFallbackTexture(imageUrl, options.fallbackColor || '#444444');
        setTexture(fallbackTexture);
        textureRef.current = fallbackTexture;
      }
      
      // Return a no-op cleanup function
      return () => {};
    }
  }, [
    imageUrl, 
    options?.flipY, 
    options?.colorSpace, 
    options?.wrapS, 
    options?.wrapT, 
    options?.crossOrigin,
    options?.fallback,
    options?.fallbackColor
  ]);

  /**
   * Create a fallback texture with error information
   */
  const createFallbackTexture = (url, color = '#444444') => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        console.error('Could not get 2D context for fallback texture canvas');
        return null;
      }
      
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
      
      // Filename text if URL is available
      if (url) {
        const filename = url.split('/').pop();
        ctx.font = '24px Arial';
        ctx.fillText(filename, canvas.width / 2, canvas.height / 2 + 32);
      }
      
      // Create and return texture
      const fallbackTexture = new THREE.CanvasTexture(canvas);
      return fallbackTexture;
    } catch (err) {
      console.error('Error creating fallback texture:', err);
      return null;
    }
  };

  return { texture, loading, error };
};

export default useArtworkTexture;