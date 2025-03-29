// src/components/galleries/TriangleGallery.jsx
import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useFrame } from '@react-three/fiber';
import { Reflector, Html } from '@react-three/drei';
import * as THREE from 'three';

import ArtworkDisplay from '../../artwork/ArtworkDisplay';
import PlaceholderObject from '../../PlaceholderObject';
import '../../../styles/TriangleGallery.css';

// Standardized dimensions for the triangular gallery
const galleryDimensions = {
  width: 140,         // Overall width
  length: 140,        // Overall length
  height: 20,         // Ceiling height
  triangleSize: 70,   // Size from center to corner
  wallHeight: 20,     // Wall height
  wallThickness: 0.5  // Wall thickness
};

/**
 * TriangleGallery component - Creates a triangular gallery layout
 * Features three distinct sections with unique lighting
 * 
 * @param {Array} artworks - Array of artwork objects to display
 * @param {boolean} debug - Whether to show debug information
 * @param {Function} onAddToCart - Function to handle adding artworks to cart
 */
const TriangleGallery = ({ 
  artworks = [], 
  debug = false,
  onAddToCart
}) => {
  // State and refs
  const [showLabels, setShowLabels] = useState(debug);
  const triangleRef = useRef();
  const spotlightsRef = useRef([]);
  
  // Rotation speed
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
  
  // Rotate the triangle gallery
  useFrame(() => {
    if (triangleRef.current) {
      triangleRef.current.rotation.y += rotationSpeed;
    }
    
    // Animate spotlights
    spotlightsRef.current.forEach((spotlight, i) => {
      if (spotlight) {
        const time = Date.now() * 0.001;
        // Unique color pulsing for each wall section
        const hue = (i / 3) + time * 0.05;
        const color = new THREE.Color().setHSL(hue % 1, 0.5, 0.5);
        spotlight.color = color;
      }
    });
  });

  // Create triangular wall structure
  const createTriangleWall = (size, height, yPosition = 0) => {
    const walls = [];
    
    // Equilateral triangle vertices
    const points = [
      [-size, 0, -size],                  // Point 1 (bottom left)
      [size, 0, -size],                   // Point 2 (bottom right)
      [0, 0, size * 1.732]                // Point 3 (top) - 1.732 is √3
    ];
    
    // Create walls for each side of the triangle
    for (let i = 0; i < 3; i++) {
      const start = points[i];
      const end = points[(i + 1) % 3];
      
      // Calculate wall dimensions
      const dx = end[0] - start[0];
      const dz = end[2] - start[2];
      const length = Math.sqrt(dx * dx + dz * dz);
      const angle = Math.atan2(dz, dx);
      
      // Create wall mesh
      walls.push(
        <mesh
          key={`wall-${i}`}
          position={[
            (start[0] + end[0]) / 2,
            yPosition + height / 2,
            (start[2] + end[2]) / 2
          ]}
          rotation={[0, angle, 0]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[length, height, galleryDimensions.wallThickness]} />
          <meshStandardMaterial color="white" />
        </mesh>
      );
      
      // Add a unique spotlight for each wall
      spotlightsRef.current = new Array(3);
      walls.push(
        <spotLight
          key={`spotlight-${i}`}
          ref={el => spotlightsRef.current[i] = el}
          position={[
            (start[0] + end[0]) / 2,
            galleryDimensions.height - 2,
            (start[2] + end[2]) / 2
          ]}
          angle={0.5}
          penumbra={0.8}
          intensity={0.8}
          color={new THREE.Color().setHSL(i / 3, 0.5, 0.5)}
          castShadow
          target-position={[0, 0, 0]}
          distance={150}
        />
      );
    }
    
    return walls;
  };
  
  // Create pedestals in a triangular arrangement
  const createTrianglePedestals = (count = 6) => {
    const pedestals = [];
    const size = galleryDimensions.triangleSize * 0.6; // Scale for inner triangle
    
    // Create points for an inner triangle
    const innerPoints = [
      [-size * 0.5, 0, -size * 0.5],  // Point 1
      [size * 0.5, 0, -size * 0.5],   // Point 2
      [0, 0, size * 0.5]              // Point 3
    ];
    
    // Place pedestals at vertices and along edges
    for (let i = 0; i < count; i++) {
      // Skip if no more artworks available
      if (i + (artworks.length * 0.5) >= artworks.length) break;
      
      let position;
      
      if (i < 3) {
        // Place at vertices with slight inset
        const vertex = innerPoints[i];
        position = [vertex[0] * 0.8, 1, vertex[2] * 0.8];
      } else {
        // Place along edges
        const edge = i % 3;
        const start = innerPoints[edge];
        const end = innerPoints[(edge + 1) % 3];
        const t = (i % 2 === 0) ? 0.33 : 0.66; // Placement along the edge
        
        position = [
          start[0] + (end[0] - start[0]) * t,
          1,
          start[2] + (end[2] - start[2]) * t
        ];
      }
      
      // Alternate between different pedestal types
      const type = i % 3 === 0 ? "interactive" : 
                 i % 2 === 0 ? "sculpture" : "pedestal";
      
      pedestals.push(
        <PlaceholderObject
          key={`pedestal-${i}`}
          position={position}
          size={[3, 4, 3]}
          type={type}
          id={i + 1}
          artwork={artworks[i + Math.floor(artworks.length * 0.5)]}
          showLabels={showLabels}
          onAddToCart={onAddToCart}
        />
      );
    }
    
    return pedestals;
  };
  
  // Create artwork displays along the walls
  const createWallArtworks = () => {
    const artworkDisplays = [];
    
    // Skip if no artworks available
    if (!artworks || artworks.length === 0) return artworkDisplays;
    
    // Equilateral triangle vertices
    const size = galleryDimensions.triangleSize;
    const points = [
      [-size, 0, -size],                  // Point 1 (bottom left)
      [size, 0, -size],                   // Point 2 (bottom right)
      [0, 0, size * 1.732]                // Point 3 (top) - 1.732 is √3
    ];
    
    // Place artworks along each wall - 3 per wall
    for (let wall = 0; wall < 3; wall++) {
      const start = points[wall];
      const end = points[(wall + 1) % 3];
      
      // Define how many artworks per wall
      const artworksPerWall = Math.min(3, Math.ceil(artworks.length / 3));
      
      for (let i = 0; i < artworksPerWall; i++) {
        // Calculate index in the artworks array
        const artworkIndex = wall * artworksPerWall + i;
        
        // Skip if no more artworks available
        if (artworkIndex >= artworks.length) break;
        
        // Calculate position along the wall
        const t = (i + 1) / (artworksPerWall + 1); // Position along wall (0-1)
        
        // Interpolate position
        const x = start[0] + (end[0] - start[0]) * t;
        const z = start[2] + (end[2] - start[2]) * t;
        
        // Calculate wall angle
        const angle = Math.atan2(end[2] - start[2], end[0] - start[0]);
        
        // Wall offset
        const wallOffset = 0.3;
        
        // Position accounting for wall offset (move slightly inward)
        const offsetX = wallOffset * Math.sin(angle);
        const offsetZ = -wallOffset * Math.cos(angle);
        
        // Create artwork display
        artworkDisplays.push(
          <ArtworkDisplay
            key={`artwork-${wall}-${i}`}
            position={[
              x + offsetX, 
              galleryDimensions.height / 2, 
              z + offsetZ
            ]}
            rotation={[0, angle + Math.PI, 0]} // Face inward
            artwork={artworks[artworkIndex]}
            size={[7, 4.5]}
            wallId={`wall-${wall}`}
            onAddToCart={onAddToCart}
          />
        );
      }
    }
    
    return artworkDisplays;
  };

  return (
    <group ref={triangleRef}>
      {/* Reflective Floor */}
      <Reflector
        position={[0, 0, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        args={[galleryDimensions.width, galleryDimensions.length]}
        resolution={512}
        mirror={0.5}
        mixBlur={8}
        mixStrength={0.8}
        blur={[500, 100]}
        metalness={0.5}
        roughness={0.4}
      >
        {(Material, props) => (
          <Material 
            color='#555555' 
            {...props} 
          />
        )}
      </Reflector>
      
      {/* Triangular ceiling */}
      <mesh position={[0, galleryDimensions.height, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[galleryDimensions.triangleSize * 1.2, 3]} />
        <meshStandardMaterial 
          color="#f5f5f5" 
          transparent={true} 
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Walls */}
      {createTriangleWall(galleryDimensions.triangleSize, galleryDimensions.wallHeight)}
      
      {/* Pedestals */}
      {createTrianglePedestals()}
      
      {/* Wall Artworks */}
      {createWallArtworks()}
      
      {/* Additional lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[0, galleryDimensions.height - 1, 0]} intensity={0.4} castShadow />
      
      {/* Debug information */}
      {showLabels && (
        <Html position={[0, galleryDimensions.height - 1, 0]} center>
          <div className="debug-info">
            <div className="debug-title">Triangle Gallery</div>
            <div>Press 'L' to toggle labels</div>
            <div>Dimensions: {galleryDimensions.width}m × {galleryDimensions.length}m × {galleryDimensions.height}m</div>
          </div>
        </Html>
      )}
    </group>
  );
};

TriangleGallery.propTypes = {
  artworks: PropTypes.array,
  debug: PropTypes.bool,
  onAddToCart: PropTypes.func
};

export default TriangleGallery;