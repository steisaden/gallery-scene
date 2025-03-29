// src/components/galleries/CircleGallery.jsx
import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useFrame } from '@react-three/fiber';
import { Reflector, Html } from '@react-three/drei';
import * as THREE from 'three';

import ArtworkDisplay from '../../artwork/ArtworkDisplay';
import PlaceholderObject from '../../PlaceholderObject';
import '../../../styles/CircleGallery.css';

// Standardized dimensions for the circular gallery
const galleryDimensions = {
  width: 140,      // Overall width of the gallery space
  length: 140,     // Overall length of the gallery space
  height: 20,      // Ceiling height
  radius: 70,      // Outer radius of the circular gallery
  innerRadius: 35, // Inner radius
  segments: 24     // Number of wall segments for smooth appearance
};

/**
 * CircleGallery component - Creates a circular gallery layout
 * Features concentric circular design with rotating elements
 * 
 * @param {Array} artworks - Array of artwork objects to display
 * @param {boolean} debug - Whether to show debug information
 * @param {Function} onAddToCart - Function to handle adding artworks to cart
 */
const CircleGallery = ({ 
  artworks = [], 
  debug = false,
  onAddToCart
}) => {
  // State and refs
  const [showLabels, setShowLabels] = useState(debug);
  const innerCircleRef = useRef();
  const outerCircleRef = useRef();
  const spotlightsRef = useRef([]);
  
  // Rotation speeds
  const rotationSpeed = 0.0005; // Slow rotation
  
  // Toggle debug labels with 'L' key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'l' || e.key === 'L') {
        setShowLabels(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  // Rotate the inner and outer circles
  useFrame(() => {
    if (innerCircleRef.current) {
      innerCircleRef.current.rotation.y += rotationSpeed;
    }
    if (outerCircleRef.current) {
      outerCircleRef.current.rotation.y -= rotationSpeed / 2;
    }
    
    // Animate spotlights
    spotlightsRef.current.forEach((spotlight, i) => {
      if (spotlight) {
        const time = Date.now() * 0.001;
        // Subtle intensity pulsing
        spotlight.intensity = 0.8 + Math.sin(time * 0.5 + i) * 0.2;
      }
    });
  });

  // Create circular wall segments
  const createCircularWall = (radius, height, segments, color) => {
    const walls = [];
    const segmentAngle = (2 * Math.PI) / segments;
    
    for (let i = 0; i < segments; i++) {
      const angle = i * segmentAngle;
      const nextAngle = (i + 1) * segmentAngle;
      
      // Calculate positions
      const x1 = radius * Math.cos(angle);
      const z1 = radius * Math.sin(angle);
      const x2 = radius * Math.cos(nextAngle);
      const z2 = radius * Math.sin(nextAngle);
      
      // Wall segment
      walls.push(
        <mesh 
          key={`wall-${radius}-${i}`}
          position={[(x1 + x2) / 2, height / 2, (z1 + z2) / 2]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[
            Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(z2 - z1, 2)), 
            height, 
            0.5
          ]} />
          <meshStandardMaterial color={color} />
        </mesh>
      );
    }
    
    return walls;
  };
  
  // Distribute artworks around the circle
  const createCircularArtworks = () => {
    const artworkDisplays = [];
    
    // Calculate how many artworks to place
    const availableArtworks = artworks ? artworks.length : 0;
    if (availableArtworks === 0) return artworkDisplays;
    
    // Setup for outer circle artwork placement
    const outerPositions = [];
    const segmentAngle = (2 * Math.PI) / galleryDimensions.segments;
    
    // Distribute artworks evenly around outer circle
    const outerCount = Math.min(availableArtworks, galleryDimensions.segments);
    for (let i = 0; i < outerCount; i++) {
      // Skip some positions to create doorways/open spaces
      if (i % 6 === 0) continue;
      
      const angle = i * segmentAngle;
      const wallOffset = 0.3; // Distance from wall
      const radius = galleryDimensions.radius - wallOffset;
      
      const position = [
        radius * Math.cos(angle),
        galleryDimensions.height / 2,
        radius * Math.sin(angle)
      ];
      
      // Face inward
      const rotation = [0, angle + Math.PI, 0];
      
      outerPositions.push({ position, rotation, index: i });
    }
    
    // Setup for inner circle artwork placement
    const innerPositions = [];
    const innerRadius = galleryDimensions.innerRadius;
    const innerSegments = Math.min(availableArtworks - outerCount, 12);
    
    for (let i = 0; i < innerSegments; i++) {
      const angle = i * (2 * Math.PI / innerSegments) + Math.PI / innerSegments; // Offset to stagger
      
      const position = [
        innerRadius * Math.cos(angle),
        galleryDimensions.height / 2,
        innerRadius * Math.sin(angle)
      ];
      
      // Face outward
      const rotation = [0, angle, 0];
      
      innerPositions.push({ position, rotation, index: i + outerCount });
    }
    
    // Create ArtworkDisplay components for outer circle
    outerPositions.forEach(({ position, rotation, index }) => {
      if (index < availableArtworks) {
        artworkDisplays.push(
          <ArtworkDisplay
            key={`artwork-outer-${index}`}
            position={position}
            rotation={rotation}
            artwork={artworks[index]}
            size={[6, 4]}
            wallId="outer"
            onAddToCart={onAddToCart}
          />
        );
      }
    });
    
    // Create ArtworkDisplay components for inner circle
    innerPositions.forEach(({ position, rotation, index }) => {
      if (index < availableArtworks) {
        artworkDisplays.push(
          <ArtworkDisplay
            key={`artwork-inner-${index}`}
            position={position}
            rotation={rotation}
            artwork={artworks[index]}
            size={[5, 3.5]}
            wallId="inner"
            onAddToCart={onAddToCart}
          />
        );
      }
    });
    
    return artworkDisplays;
  };
  
  // Create exhibition pedestals in a circle
  const createCircularPedestals = () => {
    const pedestals = [];
    const count = 8; // Number of pedestals
    const radius = galleryDimensions.innerRadius * 0.5; // Smaller inner circle
    
    for (let i = 0; i < count; i++) {
      // Skip if no more artworks available
      if (i + galleryDimensions.segments >= artworks.length) break;
      
      const angle = (i / count) * Math.PI * 2;
      const x = radius * Math.cos(angle);
      const z = radius * Math.sin(angle);
      
      // Alternate between different pedestal types
      const type = i % 3 === 0 ? "interactive" : 
                 i % 2 === 0 ? "sculpture" : "pedestal";
      
      pedestals.push(
        <PlaceholderObject
          key={`pedestal-${i}`}
          position={[x, 1, z]}
          size={[3, 4, 3]}
          type={type}
          id={i + 1}
          artwork={artworks[i + galleryDimensions.segments]}
          showLabels={showLabels}
          onAddToCart={onAddToCart}
        />
      );
    }
    
    return pedestals;
  };
  
  // Create spotlights for dramatic lighting
  const createSpotlights = () => {
    const lights = [];
    const count = 8;
    
    // Create array of refs
    spotlightsRef.current = new Array(count);
    
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = galleryDimensions.radius * 0.7;
      const x = radius * Math.cos(angle);
      const z = radius * Math.sin(angle);
      
      // Alternate colors
      const color = i % 2 === 0 ? "#ffffff" : "#f0f8ff";
      
      lights.push(
        <spotLight
          key={`spotlight-${i}`}
          ref={el => spotlightsRef.current[i] = el}
          position={[x, galleryDimensions.height - 2, z]}
          angle={0.2}
          penumbra={0.8}
          intensity={0.8}
          color={color}
          castShadow
          target-position={[0, 0, 0]}
          distance={150}
        />
      );
    }
    
    return lights;
  };

  return (
    <group>
      {/* Reflective Floor */}
      <Reflector
        position={[0, 0, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        args={[galleryDimensions.width, galleryDimensions.length]}
        resolution={512}
        mirror={0.75}
        mixBlur={10}
        mixStrength={1}
        blur={[300, 100]}
        metalness={0.6}
        roughness={0.2}
      />
      
      {/* Transparent ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, galleryDimensions.height, 0]}>
        <circleGeometry args={[galleryDimensions.radius, 64]} />
        <meshStandardMaterial 
          color="#f5f5f5" 
          transparent={true} 
          opacity={0.3} 
          side={THREE.DoubleSide} 
        />
      </mesh>

      {/* Rotating Inner Circle */}
      <group ref={innerCircleRef}>
        {/* Inner Walls */}
        {createCircularWall(galleryDimensions.innerRadius, galleryDimensions.height, galleryDimensions.segments / 2, '#dddddd')}
        
        {/* Central Pedestals */}
        {createCircularPedestals()}
      </group>
      
      {/* Rotating Outer Circle */}
      <group ref={outerCircleRef}>
        {/* Outer Walls */}
        {createCircularWall(galleryDimensions.radius, galleryDimensions.height, galleryDimensions.segments, 'white')}
      </group>
      
      {/* Artworks */}
      {createCircularArtworks()}
      
      {/* Spotlights */}
      {createSpotlights()}
      
      {/* Additional lighting */}
      <ambientLight intensity={0.4} />
      <hemisphereLight intensity={0.3} color="#ffffff" groundColor="#bbbbff" />
      
      {/* Debug information */}
      {showLabels && (
        <Html position={[0, galleryDimensions.height - 1, 0]} center>
          <div className="debug-info">
            <div className="debug-title">Circle Gallery</div>
            <div>Press 'L' to toggle labels</div>
            <div>Dimensions: {galleryDimensions.width}m × {galleryDimensions.length}m × {galleryDimensions.height}m</div>
          </div>
        </Html>
      )}
    </group>
  );
};

CircleGallery.propTypes = {
  artworks: PropTypes.array,
  debug: PropTypes.bool,
  onAddToCart: PropTypes.func
};

export default CircleGallery;