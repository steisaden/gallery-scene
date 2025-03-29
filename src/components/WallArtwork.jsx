// src/components/WallArtwork.jsx
import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useFrame } from '@react-three/fiber';
import { useCursor, Html, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import '../styles/WallArtwork.css';

import { AssetManager } from './utils/AssetManager';

/**
 * WallArtwork component for displaying artworks on walls
 * Includes interactivity, hover effects, and information display
 * 
 * @param {Object} artwork - Artwork data object
 * @param {Array} position - [x, y, z] position
 * @param {Array} rotation - [x, y, z] rotation in radians
 * @param {Array} size - [width, height] of artwork frame
 * @param {number} depth - Depth/thickness of artwork
 * @param {string} frameColor - Color of the frame
 * @param {Function} onArtworkClick - Click handler
 * @param {Function} onAddToCart - Add to cart handler
 */
const WallArtwork = ({ 
  artwork, 
  position = [0, 0, 0], 
  rotation = [0, 0, 0], 
  size = [5, 3], 
  depth = 0.1,
  frameColor = '#222222',
  onArtworkClick,
  onAddToCart
}) => {
  // State for interaction
  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState(false);
  const [error, setError] = useState(false);
  
  // Use a ref for the mesh
  const meshRef = useRef();
  const frameRef = useRef();
  
  // Update cursor on hover
  useCursor(hovered);
  
  // Get texture for the artwork
  // First try to get the actual texture, fall back to a default if needed
  const texture = useTexture(
    artwork?.imageUrl || '/assets/placeholder-art.jpg',
    (texture) => {
      // Success handler
      texture.encoding = THREE.sRGBEncoding;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.flipY = false; // Prevent upside-down textures
      setError(false);
    },
    (error) => {
      // Error handler
      console.error('Failed to load artwork texture:', error);
      setError(true);
    }
  );
  
  // Calculate aspect ratio and adjust dimensions
  const aspectRatio = texture ? (texture.image?.width || 1) / (texture.image?.height || 1) : 1.5;
  
  // Keep original width, adjust height based on aspect ratio
  const frameWidth = size[0];
  const frameHeight = isNaN(aspectRatio) || aspectRatio <= 0 ? size[1] : frameWidth / aspectRatio;
  
  // Frame padding
  const framePadding = 0.2;
  
  // Artwork canvas dimensions (slightly smaller than frame)
  const canvasWidth = frameWidth - framePadding * 2;
  const canvasHeight = frameHeight - framePadding * 2;
  
  // Add subtle animation on hover
  useFrame(() => {
    if (!meshRef.current) return;
    
    // Subtle floating effect when hovered
    if (hovered) {
      meshRef.current.position.y = position[1] + Math.sin(Date.now() * 0.003) * 0.05;
      
      // Slight glow for the frame
      if (frameRef.current && frameRef.current.material) {
        frameRef.current.material.emissive.setRGB(0.1, 0.1, 0.1);
      }
    } else {
      // Reset position smoothly
      meshRef.current.position.y = THREE.MathUtils.lerp(
        meshRef.current.position.y, 
        position[1], 
        0.1
      );
      
      // Reset frame glow
      if (frameRef.current && frameRef.current.material) {
        frameRef.current.material.emissive.setRGB(0, 0, 0);
      }
    }
  });
  
  // Handle click on artwork
  const handleClick = (e) => {
    e.stopPropagation();
    setActive(!active);
    
    if (onArtworkClick) {
      onArtworkClick(artwork);
    }
  };
  
  // Handle add to cart
  const handleAddToCart = (e) => {
    e.stopPropagation();
    
    if (onAddToCart) {
      onAddToCart(artwork);
    }
    
    // Briefly close the info panel
    setActive(false);
  };
  
  // Create fallback texture in case of error
  useEffect(() => {
    if (error && artwork) {
      // Use AssetManager to create a fallback texture
      // This might be used if the useTexture hook can't handle the error internally
      const fallbackTexture = AssetManager.createFallbackTexture(
        artwork.title || 'Artwork',
        '#334455'
      );
      
      // Use fallback texture if mesh material exists
      if (meshRef.current && meshRef.current.material) {
        meshRef.current.material.map = fallbackTexture;
        meshRef.current.material.needsUpdate = true;
      }
    }
  }, [error, artwork]);
  
  return (
    <group 
      position={position}
      rotation={rotation}
      ref={meshRef}
    >
      {/* Frame - appears as a border around the artwork */}
      <mesh 
        ref={frameRef}
        position={[0, 0, -depth / 2]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[frameWidth, frameHeight, depth]} />
        <meshStandardMaterial 
          color={frameColor} 
          metalness={0.5}
          roughness={0.7}
        />
      </mesh>
      
      {/* Artwork display surface */}
      <mesh 
        position={[0, 0, -depth / 2 + 0.01]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={handleClick}
      >
        <planeGeometry args={[canvasWidth, canvasHeight]} />
        <meshStandardMaterial
          map={texture}
          toneMapped={false}
          metalness={0.1}
          roughness={0.8}
        />
      </mesh>
      
      {/* Information panel that appears when artwork is clicked */}
      {active && artwork && (
        <Html
          position={[0, -frameHeight / 2 - 0.5, 0.1]}
          center
          distanceFactor={10}
          occlude
        >
          <div className="artwork-info-panel">
            <h2 className="artwork-title">{artwork.title}</h2>
            <p className="artwork-artist">{artwork.artist}</p>
            
            {artwork.description && (
              <p className="artwork-description">{artwork.description}</p>
            )}
            
            <div className="artwork-details">
              {artwork.year && <span className="artwork-year">{artwork.year}</span>}
              {artwork.medium && <span className="artwork-medium">{artwork.medium}</span>}
              {artwork.dimensions && <span className="artwork-dimensions">{artwork.dimensions}</span>}
            </div>
            
            {artwork.forSale && (
              <div className="artwork-purchase">
                <div className="artwork-price">${artwork.price}</div>
                <button 
                  className="add-to-cart-button"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </button>
              </div>
            )}
            
            <button 
              className="close-panel-button"
              onClick={() => setActive(false)}
            >
              ×
            </button>
          </div>
        </Html>
      )}
      
      {/* Small label that appears on hover */}
      {hovered && !active && artwork && (
        <Html
          position={[0, -frameHeight / 2 - 0.3, 0.05]}
          center
          distanceFactor={20}
        >
          <div className="artwork-hover-label">
            <div className="hover-title">{artwork.title}</div>
            <div className="hover-artist">{artwork.artist}</div>
            
            {artwork.forSale && (
              <div className="hover-price">${artwork.price}</div>
            )}
          </div>
        </Html>
      )}
    </group>
  );
};

WallArtwork.propTypes = {
  artwork: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string,
    artist: PropTypes.string,
    description: PropTypes.string,
    year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    medium: PropTypes.string,
    dimensions: PropTypes.string,
    imageUrl: PropTypes.string,
    price: PropTypes.number,
    forSale: PropTypes.bool
  }),
  position: PropTypes.array,
  rotation: PropTypes.array,
  size: PropTypes.array,
  depth: PropTypes.number,
  frameColor: PropTypes.string,
  onArtworkClick: PropTypes.func,
  onAddToCart: PropTypes.func
};

export default WallArtwork;