// src/components/artwork/ArtworkDisplay.jsx
import React, { useState, useRef } from 'react';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import PropTypes from 'prop-types';
import * as THREE from 'three';
import ArtworkInfo from './ArtworkInfo';
import PurchasePanel from './PurchasePanel';
import useArtworkTexture from '../../hooks/useArtworkTexture';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/ArtworkDisplay.css';

const ArtworkDisplay = ({ 
  position, 
  rotation, 
  artwork, 
  size = [3, 2], 
  showDetails = false,
  wallId,
  onAddToCart
}) => {
  const { isAuthenticated } = useAuth();
  const [isInfoVisible, setIsInfoVisible] = useState(showDetails);
  const [isPurchasePanelOpen, setIsPurchasePanelOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFrameHovered, setIsFrameHovered] = useState(false);
  const [cursorStyle, setCursorStyle] = useState('auto'); // Add this state
  const frameRef = useRef();
  const imageRef = useRef();
  
  // Load artwork texture
  const { texture, loading, error } = useArtworkTexture(artwork.imageUrl, {
    fallback: true,
    fallbackColor: '#333333'
  });
  
  // Calculate dimensions based on texture aspect ratio if available
  const aspectRatio = texture && texture.image ? 
    texture.image.width / texture.image.height : 1.5;
  const width = size[0];
  const height = width / aspectRatio;
  
  // Add a subtle hover animation to the artwork
  useFrame(() => {
    if (frameRef.current) {
      // Subtle pulsing animation when hovered
      if (isFrameHovered) {
        frameRef.current.scale.x = THREE.MathUtils.lerp(frameRef.current.scale.x, 1.02, 0.1);
        frameRef.current.scale.y = THREE.MathUtils.lerp(frameRef.current.scale.y, 1.02, 0.1);
      } else {
        frameRef.current.scale.x = THREE.MathUtils.lerp(frameRef.current.scale.x, 1, 0.1);
        frameRef.current.scale.y = THREE.MathUtils.lerp(frameRef.current.scale.y, 1, 0.1);
      }
    }
    
    if (imageRef.current) {
      // Subtle z-position animation when hovered
      if (isHovered) {
        imageRef.current.position.z = THREE.MathUtils.lerp(imageRef.current.position.z, 0.03, 0.1);
      } else {
        imageRef.current.position.z = THREE.MathUtils.lerp(imageRef.current.position.z, 0, 0.1);
      }
    }
  });
  
  // Toggle info panel visibility
  const toggleInfo = (e) => {
    if (e) e.stopPropagation();
    setIsInfoVisible(!isInfoVisible);
    
    // If purchase panel is open, close it when toggling info
    if (isPurchasePanelOpen) {
      setIsPurchasePanelOpen(false);
    }
  };
  
  // Open purchase panel
  const openPurchasePanel = (e) => {
    if (e) e.stopPropagation();
    
    if (!isAuthenticated) {
      // If not authenticated, show login prompt instead
      // This could be improved with a custom event that the parent component handles
      console.log('User needs to log in to purchase');
      return;
    }
    
    setIsPurchasePanelOpen(true);
    setIsInfoVisible(false);
  };
  
  // Close purchase panel
  const closePurchasePanel = (e) => {
    if (e) e.stopPropagation();
    setIsPurchasePanelOpen(false);
  };
  
  // Handle clicking on the artwork frame
  const handleArtworkClick = (e) => {
    e.stopPropagation();
    if (!isInfoVisible && !isPurchasePanelOpen) {
      setIsInfoVisible(true);
    }
  };
  
  // Handle cursor pointers for interactivity
  // Update the pointer handlers
  const handlePointerOver = () => {
    setIsHovered(true);
    setCursorStyle('pointer');
  };
  
  const handlePointerOut = () => {
    setIsHovered(false);
    setCursorStyle('auto');
  };
  
  const handleFramePointerOver = () => {
    setIsFrameHovered(true);
    setCursorStyle('pointer');
  };
  
  const handleFramePointerOut = () => {
    setIsFrameHovered(false);
    setCursorStyle('auto');
  };
  
  // Add to cart handler
  const handleAddToCart = (e) => {
    if (e) e.stopPropagation();
    
    if (onAddToCart) {
      const success = onAddToCart(artwork);
      
      if (success) {
        // Optionally, close panels after successful add
        setIsPurchasePanelOpen(false);
        setIsInfoVisible(false);
      }
    }
  };
  
  return (
    <group position={position} rotation={rotation} className={`cursor-${cursorStyle}`}>
      {/* Frame - with slight interaction effect on hover */}
      <mesh 
        ref={frameRef}
        position={[0, 0, -0.05]} 
        castShadow
        onClick={handleArtworkClick}
        onPointerOver={handleFramePointerOver}
        onPointerOut={handleFramePointerOut}
      >
        <boxGeometry args={[width + 0.2, height + 0.2, 0.1]} />
        <meshStandardMaterial 
          color={isFrameHovered ? "#555555" : "black"}
          metalness={0.5}
          roughness={0.7}
        />
      </mesh>
      
      {/* Artwork Image */}
      <mesh 
        ref={imageRef}
        onClick={handleArtworkClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
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
            transparent={false}
          />
        )}
      </mesh>
      
      {/* Info Button */}
      <Html position={[width/2 - 0.3, height/2 - 0.3, 0.1]}>
        <button 
          onClick={toggleInfo}
          className={`artwork-button info-button ${isInfoVisible ? 'active' : ''}`}
        >
          i
        </button>
      </Html>
      
      {/* Purchase Button - only show if for sale */}
      {artwork.forSale && (
        <Html position={[width/2 - 0.7, height/2 - 0.3, 0.1]}>
          <button 
            onClick={isAuthenticated ? openPurchasePanel : handleArtworkClick}
            className="artwork-button price-button"
          >
            ${artwork.price}
          </button>
        </Html>
      )}
      
      {/* Information Panel */}
      {isInfoVisible && (
        <Html 
          position={[0, 0, 0.2]} 
          className="artwork-info-container"
          style={{ width: `${width * 300}px` }}
          transform
          occlude
        >
          <ArtworkInfo 
            artwork={artwork} 
            onClose={toggleInfo}
            onPurchase={artwork.forSale ? (isAuthenticated ? openPurchasePanel : null) : null}
            onAddToCart={isAuthenticated && artwork.forSale ? handleAddToCart : null}
            isInCart={false} // This should be passed from parent
          />
        </Html>
      )}
      
      {/* Purchase Panel */}
      {isPurchasePanelOpen && (
        <Html 
          position={[0, 0, 0.2]} 
          className="artwork-purchase-container"
          style={{ width: `${width * 350}px` }}
          transform
          occlude
        >
          <PurchasePanel 
            artwork={artwork} 
            onClose={closePurchasePanel}
            onComplete={(result) => {
              closePurchasePanel();
              // Handle purchase completion (e.g., show confirmation)
              console.log('Purchase completed:', result);
            }}
          />
        </Html>
      )}
    </group>
  );
};

ArtworkDisplay.propTypes = {
  position: PropTypes.array.isRequired,
  rotation: PropTypes.array.isRequired,
  artwork: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    artist: PropTypes.string,
    description: PropTypes.string,
    year: PropTypes.string,
    medium: PropTypes.string,
    dimensions: PropTypes.string,
    price: PropTypes.number,
    forSale: PropTypes.bool,
    imageUrl: PropTypes.string
  }).isRequired,
  size: PropTypes.array,
  showDetails: PropTypes.bool,
  wallId: PropTypes.string,
  onAddToCart: PropTypes.func
};

export default ArtworkDisplay;