// src/components/PlaceholderObject.jsx
import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import '../styles/PlaceholderObject.css';

/**
 * PlaceholderObject component for creating interactive 3D objects in the gallery
 * These represent sculptures and other 3D art pieces
 */
const PlaceholderObject = ({ 
  position, 
  size = [1, 1, 1], 
  type = "pedestal", 
  id,
  artwork,
  showLabels = false,
  onAddToCart
}) => {
  const objRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  
  // Handle hover animations
  useFrame(() => {
    if (!objRef.current) return;
    
    if (hovered) {
      objRef.current.rotation.y += 0.01;
      // Subtle floating animation
      objRef.current.position.y = position[1] + Math.sin(Date.now() * 0.003) * 0.05;
    } else {
      // Smooth lerp back to original position
      objRef.current.position.y = THREE.MathUtils.lerp(
        objRef.current.position.y, 
        position[1], 
        0.1
      );
    }
  });
  
  // Define geometry, material, and label based on type
  let geometry, material, label;
  
  switch (type) {
    case "pedestal":
      geometry = <boxGeometry args={[size[0], size[1], size[2]]} />;
      material = <meshStandardMaterial color={hovered ? "#999" : "#888"} />;
      label = "Pedestal";
      break;
    case "sculpture":
      geometry = <sphereGeometry args={[size[0] / 2, 16, 16]} />;
      material = <meshStandardMaterial 
        color={hovered ? "#aaa" : "#999"} 
        wireframe={hovered}
      />;
      label = "Sculpture";
      break;
    case "interactive":
      geometry = <octahedronGeometry args={[size[0] / 2]} />;
      material = <meshStandardMaterial 
        color={hovered ? "#6af" : "#59f"} 
        wireframe={hovered}
      />;
      label = "Interactive";
      break;
    default:
      geometry = <boxGeometry args={[size[0], size[1], size[2]]} />;
      material = <meshStandardMaterial color="#888" />;
      label = "Object";
  }
  
  // Handle click to show artwork info
  const handleClick = (e) => {
    e.stopPropagation();
    setShowInfo(!showInfo);
  };
  
  // Add to cart handler
  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (onAddToCart && artwork) {
      onAddToCart(artwork);
    }
  };
  
  return (
    <group position={position}>
      <mesh 
        ref={objRef}
        castShadow 
        receiveShadow
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={handleClick}
      >
        {geometry}
        {material}
      </mesh>
      
      {/* Debug label */}
      {showLabels && (
        <Html position={[0, size[1] + 0.5, 0]} center>
          <div className="debug-label">
            {label} {id ? `#${id}` : ''}
          </div>
        </Html>
      )}
      
      {/* Artwork Info Panel */}
      {showInfo && artwork && (
        <Html
          position={[0, size[1] + 1, 0]}
          center
          distanceFactor={15}
          occlude
        >
          <div className="artwork-info">
            <h3>{artwork.title}</h3>
            <p className="artist">{artwork.artist}</p>
            
            {artwork.description && (
              <p className="description">{artwork.description.substring(0, 100)}...</p>
            )}
            
            {artwork.forSale && (
              <div className="price-container">
                <span className="price">${artwork.price}</span>
                <button 
                  className="cart-button"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </button>
              </div>
            )}
            
            <button 
              className="close-button"
              onClick={handleClick}
            >
              ×
            </button>
          </div>
        </Html>
      )}
    </group>
  );
};

PlaceholderObject.propTypes = {
  position: PropTypes.array.isRequired,
  size: PropTypes.array,
  type: PropTypes.string,
  id: PropTypes.string,
  artwork: PropTypes.object,
  showLabels: PropTypes.bool,
  onAddToCart: PropTypes.func
};

export default PlaceholderObject;