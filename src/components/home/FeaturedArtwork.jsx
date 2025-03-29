// src/components/home/FeaturedArtwork.jsx
import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import useArtworkTexture from '../../hooks/useArtworkTexture';
import { useCart } from '../../contexts/CartContext';
import { trackArtworkView, trackArtworkInteraction } from '../../services/analytics';
import '../../styles/FeaturedArtwork.css';

const FeaturedArtwork = ({ 
  artwork, 
  position = [0, 0, 0], 
  rotation = [0, 0, 0],
  size = [8, 5], 
  spotlightIntensity = 1.0, 
  hover = true,
  onClick
}) => {
  const { addItem, isInCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const groupRef = useRef();
  const spotlightRef = useRef();
  const frameRef = useRef();
  const meshRef = useRef();
  
  // Load artwork texture
  const { texture, loading, error } = useArtworkTexture(artwork.imageUrl, {
    fallback: true,
    fallbackColor: '#333333'
  });
  
  // Calculate dimensions based on texture aspect ratio
  const aspectRatio = texture && texture.image ? 
    texture.image.width / texture.image.height : 1.5;
  const width = size[0];
  const height = width / aspectRatio;
  
  // Animate on hover
  useFrame((state) => {
    if (!hover || !groupRef.current) return;
    
    const time = state.clock.getElapsedTime();
    
    // Subtle floating animation
    if (isHovered) {
      groupRef.current.position.y = position[1] + Math.sin(time * 2) * 0.05;
    } else {
      // Move back to original position
      groupRef.current.position.y = THREE.MathUtils.lerp(
        groupRef.current.position.y, 
        position[1], 
        0.1
      );
    }
    
    // Animate spotlight intensity
    if (spotlightRef.current) {
      if (isHovered) {
        spotlightRef.current.intensity = THREE.MathUtils.lerp(
          spotlightRef.current.intensity, 
          spotlightIntensity * 1.5, 
          0.1
        );
      } else {
        spotlightRef.current.intensity = THREE.MathUtils.lerp(
          spotlightRef.current.intensity, 
          spotlightIntensity, 
          0.1
        );
      }
    }
    
    // Animate frame scale
    if (frameRef.current) {
      if (isHovered) {
        frameRef.current.scale.x = THREE.MathUtils.lerp(frameRef.current.scale.x, 1.03, 0.1);
        frameRef.current.scale.y = THREE.MathUtils.lerp(frameRef.current.scale.y, 1.03, 0.1);
      } else {
        frameRef.current.scale.x = THREE.MathUtils.lerp(frameRef.current.scale.x, 1, 0.1);
        frameRef.current.scale.y = THREE.MathUtils.lerp(frameRef.current.scale.y, 1, 0.1);
      }
    }
  });
  
  // Event handlers
  const handlePointerOver = () => {
    setIsHovered(true);
    
    
    // Track hover interaction
    trackArtworkInteraction(artwork.id, 'hover', {
      isFeatured: true,
      title: artwork.title
    });
  };
  
  const handlePointerOut = () => {
    setIsHovered(false);
  };
  
  const handleClick = (e) => {
    e.stopPropagation();
    setShowInfo(!showInfo);
    
    // Track click interaction
    trackArtworkInteraction(artwork.id, 'click', {
      isFeatured: true,
      title: artwork.title
    });
    
    // Fire custom click handler if provided
    if (onClick) {
      onClick(artwork);
    }
    
    // Track artwork view
    if (!showInfo) {
      trackArtworkView(artwork);
    }
  };
  
  const handleAddToCart = (e) => {
    e.stopPropagation();
    
    if (!isInCart(artwork.id)) {
      addItem(artwork);
    }
  };
  
  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      {/* Spotlight */}
      <spotLight
        ref={spotlightRef}
        position={[0, 10, 5]}
        angle={0.15}
        penumbra={0.5}
        intensity={spotlightIntensity}
        castShadow
        shadow-mapSize={[2048, 2048]}
        target-position={[0, 0, 0]}
        color="#ffffff"
      />
      
      {/* Frame */}
      <mesh 
        ref={frameRef}
        position={[0, 0, -0.05]} 
        castShadow
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
        cursor="pointer"
      >
        <boxGeometry args={[width + 0.4, height + 0.4, 0.1]} />
        <meshStandardMaterial 
          color={isHovered ? "#444444" : "#222222"}
          metalness={0.5}
          roughness={0.7}
        />
      </mesh>
      
      {/* Artwork Image */}
      <mesh 
        ref={meshRef}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
        cursor="pointer"
      >
        <planeGeometry args={[width, height]} />
        {loading ? (
          <meshStandardMaterial color="#333333" />
        ) : error ? (
          <meshStandardMaterial color="#aa3333" />
        ) : (
          <meshStandardMaterial 
            map={texture} 
            toneMapped={true}
          />
        )}
      </mesh>
      
      {/* Title label below artwork */}
      <Html position={[0, -height/2 - 0.5, 0]} center>
        <div className="artwork-label">
          <h3>{artwork.title}</h3>
          <p>by {artwork.artist}</p>
          {artwork.forSale && (
            <div className="price">${artwork.price}</div>
          )}
        </div>
      </Html>
      
      {/* Info Panel (shown when clicked) */}
      {showInfo && (
        <Html position={[width/2 + 1, 0, 0]} center>
          <div className="artwork-info-panel">
            <h2>{artwork.title}</h2>
            <p className="artist">by {artwork.artist}</p>
            
            {artwork.description && (
              <div className="description">{artwork.description}</div>
            )}
            
            <div className="details">
              {artwork.year && <span>Year: {artwork.year}</span>}
              {artwork.medium && <span>Medium: {artwork.medium}</span>}
              {artwork.dimensions && <span>Size: {artwork.dimensions}</span>}
            </div>
            
            {artwork.forSale && (
              <div className="purchase-options">
                <div className="price">${artwork.price}</div>
                
                {isInCart(artwork.id) ? (
                  <div className="in-cart">Added to Cart</div>
                ) : (
                  <button className="add-to-cart" onClick={handleAddToCart}>
                    Add to Cart
                  </button>
                )}
              </div>
            )}
            
            <button className="close-button" onClick={handleClick}>✕</button>
          </div>
        </Html>
      )}
      
      {/* Remove the style jsx tag */}
    </group>
  );
};

FeaturedArtwork.propTypes = {
  artwork: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    artist: PropTypes.string.isRequired,
    description: PropTypes.string,
    year: PropTypes.string,
    medium: PropTypes.string,
    dimensions: PropTypes.string,
    price: PropTypes.number,
    forSale: PropTypes.bool,
    imageUrl: PropTypes.string.isRequired
  }).isRequired,
  position: PropTypes.array,
  rotation: PropTypes.array,
  size: PropTypes.array,
  spotlightIntensity: PropTypes.number,
  hover: PropTypes.bool,
  onClick: PropTypes.func
};

export default FeaturedArtwork;