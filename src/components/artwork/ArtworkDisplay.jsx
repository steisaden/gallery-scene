// src/components/artwork/ArtworkDisplay.jsx
import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useFrame } from '@react-three/fiber';
import { useCursor, Html } from '@react-three/drei';
import * as THREE from 'three';

/**
 * ArtworkDisplay component for displaying artworks in galleries
 * Handles both 2D and 3D artwork display with interaction
 * Uses manual texture loading to avoid crossOrigin issues
 * 
 * @param {Object} artwork - Artwork data object
 * @param {Array} position - [x, y, z] position
 * @param {Array} rotation - [x, y, z] rotation in radians
 * @param {Array} size - [width, height] of display area
 * @param {string} wallId - Wall identifier (for positioning)
 * @param {boolean} is3D - Whether artwork is 3D (true) or 2D (false)
 * @param {Function} onAddToCart - Add to cart handler
 */
const ArtworkDisplay = ({
  artwork,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  size = [5, 3],
  wallId = 'wall',
  is3D = false,
  onAddToCart
}) => {
  // State management
  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState(false);
  const [texture, setTexture] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  
  // Component refs
  const meshRef = useRef();
  const frameRef = useRef();
  const labelRef = useRef();
  
  // Change cursor on hover
  useCursor(hovered);
  
  // Load artwork texture manually if 2D
  useEffect((createFallbackTexture, texture) => {
    if (is3D) return; // Skip for 3D artworks
    
    const textureLoader = new THREE.TextureLoader();
    const imageUrl = artwork?.imageUrl || '/assets/placeholder-art.jpg';
    
    try {
      textureLoader.load(
        imageUrl,
        // Success callback
        (loadedTexture) => {
          loadedTexture.encoding = THREE.sRGBEncoding;
          loadedTexture.minFilter = THREE.LinearFilter;
          loadedTexture.magFilter = THREE.LinearFilter;
          setTexture(loadedTexture);
          setLoaded(true);
          setError(false);
        },
        // Progress callback
        undefined,
        // Error callback
        (err) => {
          console.error('Failed to load artwork texture:', err);
          setError(true);
          createFallbackTexture();
        }
      );
    } catch (err) {
      console.error('Exception loading texture:', err);
      setError(true);
      createFallbackTexture();
    }
    
    // Cleanup on unmount
    return () => {
      if (texture) {
        texture.dispose();
      }
    };
  }, [artwork, is3D]);
  
  // Create fallback texture
  const createFallbackTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    // Fill background
    ctx.fillStyle = '#444444';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw error pattern
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.moveTo(canvas.width, 0);
    ctx.lineTo(0, canvas.height);
    ctx.stroke();
    
    // Add error text
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'white';
    ctx.fillText('Image Error', canvas.width/2, canvas.height/2 - 20);
    ctx.font = '24px Arial';
    ctx.fillText(artwork?.title || 'Artwork', canvas.width/2, canvas.height/2 + 20);
    
    const fallbackTexture = new THREE.CanvasTexture(canvas);
    setTexture(fallbackTexture);
  };
  
  // Animation effects
  useFrame(() => {
    if (!meshRef.current) return;
    
    // Add a gentle hover animation
    if (hovered) {
      meshRef.current.position.z = position[2] + Math.sin(Date.now() * 0.003) * 0.05;
      
      // Make frame glow on hover
      if (frameRef.current && frameRef.current.material) {
        frameRef.current.material.emissive.setRGB(0.2, 0.2, 0.2);
      }
      
      // Scale up the info label
      if (labelRef.current) {
        labelRef.current.scale.setScalar(
          THREE.MathUtils.lerp(labelRef.current.scale.x, 1.1, 0.1)
        );
      }
    } else {
      // Return to normal position when not hovered
      meshRef.current.position.z = THREE.MathUtils.lerp(
        meshRef.current.position.z, 
        position[2], 
        0.1
      );
      
      // Reset frame glow
      if (frameRef.current && frameRef.current.material) {
        frameRef.current.material.emissive.setRGB(0, 0, 0);
      }
      
      // Reset label scale
      if (labelRef.current) {
        labelRef.current.scale.setScalar(
          THREE.MathUtils.lerp(labelRef.current.scale.x, 1, 0.1)
        );
      }
    }
  });
  
  // Handle click event
  const handleClick = (e) => {
    e.stopPropagation();
    setActive(!active);
  };
  
  // Add to cart handler
  const handleAddToCart = (e) => {
    e.stopPropagation();
    
    if (onAddToCart && artwork) {
      onAddToCart(artwork);
      
      // Show visual feedback
      if (frameRef.current && frameRef.current.material) {
        frameRef.current.material.emissive.setRGB(0.4, 0.2, 0.8);
        setTimeout(() => {
          if (frameRef.current && frameRef.current.material) {
            frameRef.current.material.emissive.setRGB(0, 0, 0);
          }
        }, 300);
      }
      
      // Close the info panel
      setActive(false);
    }
  };
  
  // Calculate the display dimensions
  const frameWidth = size[0];
  const frameHeight = size[1];
  const frameDepth = 0.15;
  const framePadding = 0.2;
  
  // Size for the actual artwork canvas (slightly smaller than frame)
  const canvasWidth = frameWidth - (framePadding * 2);
  const canvasHeight = frameHeight - (framePadding * 2);
  
  // Frame material properties
  const frameMaterial = {
    color: '#222222',
    metalness: 0.5,
    roughness: 0.7
  };
  
  return (
    <group
      position={position}
      rotation={rotation}
      ref={meshRef}
    >
      {/* Artwork Frame */}
      <mesh
        ref={frameRef}
        position={[0, 0, -frameDepth / 2]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[frameWidth, frameHeight, frameDepth]} />
        <meshStandardMaterial
          color={frameMaterial.color}
          metalness={frameMaterial.metalness}
          roughness={frameMaterial.roughness}
        />
      </mesh>
      
      {/* Artwork Display */}
      {is3D ? (
        // For 3D artworks (using a simple placeholder)
        <mesh
          position={[0, 0, 0.1]}
          rotation={[0, 0, 0]}
          castShadow
          receiveShadow
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onClick={handleClick}
        >
          <boxGeometry args={[canvasWidth * 0.8, canvasHeight * 0.8, 0.2]} />
          <meshStandardMaterial
            color={artwork?.color || '#7B3FF2'}
            wireframe={hovered}
          />
        </mesh>
      ) : (
        // For 2D artworks (using image texture)
        <mesh
          position={[0, 0, -frameDepth / 2 + 0.01]}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onClick={handleClick}
        >
          <planeGeometry args={[canvasWidth, canvasHeight]} />
          <meshStandardMaterial
            map={texture}
            toneMapped={false}
          />
        </mesh>
      )}
      
      {/* Title label that appears when hovered */}
      {hovered && !active && artwork && (
        <group ref={labelRef}>
          <Html
            position={[0, -frameHeight / 2 - 0.4, 0]}
            center
            distanceFactor={15}
          >
            <div className="artwork-label">
              <div className="artwork-title">{artwork.title}</div>
              {artwork.artist && (
                <div className="artwork-artist">{artwork.artist}</div>
              )}
              {artwork.forSale && (
                <div className="artwork-price">${artwork.price}</div>
              )}
            </div>
          </Html>
        </group>
      )}
      
      {/* Detailed info panel that appears when clicked */}
      {active && artwork && (
        <Html
          position={[0, 0, 0.5]}
          center
          distanceFactor={10}
          occlude
        >
          <div className="artwork-info-panel">
            <h2 className="artwork-title">{artwork.title}</h2>
            {artwork.artist && <p className="artwork-artist">{artwork.artist}</p>}
            
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
      
      {/* Loading indicator */}
      {!loaded && !error && !is3D && (
        <Html
          position={[0, 0, 0.1]}
          center
        >
          <div className="loading-spinner"></div>
        </Html>
      )}
    </group>
  );
};

ArtworkDisplay.propTypes = {
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
    forSale: PropTypes.bool,
    color: PropTypes.string
  }),
  position: PropTypes.array,
  rotation: PropTypes.array,
  size: PropTypes.array,
  wallId: PropTypes.string,
  is3D: PropTypes.bool,
  onAddToCart: PropTypes.func
};

export default ArtworkDisplay;