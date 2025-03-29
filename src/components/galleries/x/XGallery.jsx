// src/components/galleries/XGallery.jsx
import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useFrame } from '@react-three/fiber';
import { Reflector, Html } from '@react-three/drei';
import * as THREE from 'three';

import ArtworkDisplay from '../../artwork/ArtworkDisplay';
import PlaceholderObject from '../../PlaceholderObject';
import '../../../styles/XGallery.css';

// Standardized dimensions for the X-shaped gallery
const galleryDimensions = {
  width: 140,       // Overall width
  length: 140,      // Overall length
  height: 20,       // Ceiling height
  armLength: 70,    // Length of each arm of the X
  armWidth: 20,     // Width of each arm
  wallHeight: 20,   // Wall height
  wallThickness: 0.5 // Wall thickness
};

/**
 * XGallery component - Creates an X-shaped gallery layout
 * Features four arms with different lighting themes
 * 
 * @param {Array} artworks - Array of artwork objects to display
 * @param {boolean} debug - Whether to show debug information
 * @param {Function} onAddToCart - Function to handle adding artworks to cart
 */
const XGallery = ({ 
  artworks = [], 
  debug = false,
  onAddToCart
}) => {
  // State and refs
  const [showLabels, setShowLabels] = useState(debug);
  const armsRef = useRef([]);
  const spotlightsRef = useRef([]);
  
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
  
  // Animate the arms and lights
  useFrame(() => {
    // Subtle breathing animation for arms
    armsRef.current.forEach((arm, i) => {
      if (!arm) return;
      
      const time = Date.now() * 0.001;
      const breathe = Math.sin(time * 0.5 + i) * 0.03;
      
      // Y-scale breathing
      arm.scale.y = 1 + breathe;
    });
    
    // Animate spotlights
    spotlightsRef.current.forEach((spotlight, i) => {
      if (!spotlight) return;
      
      const time = Date.now() * 0.001;
      
      // Color shifting based on arm
      const hue = (i / 4) + time * 0.05;
      const color = new THREE.Color().setHSL(hue % 1, 0.6, 0.5);
      
      spotlight.color = color;
      spotlight.intensity = 0.7 + Math.sin(time * 0.8 + i) * 0.3;
    });
  });

  // Create X-shaped structure
  const createXStructure = () => {
    // Initialize refs array
    armsRef.current = new Array(4);
    spotlightsRef.current = new Array(4);
    
    // Arms of the X - oriented at 45-degree angles
    const arms = [];
    const armAngles = [
      Math.PI / 4,    // NE arm - 45 degrees
      (3 * Math.PI) / 4,  // NW arm - 135 degrees
      (5 * Math.PI) / 4,  // SW arm - 225 degrees
      (7 * Math.PI) / 4   // SE arm - 315 degrees
    ];
    
    // Arm colors - each arm has a unique theme
    const armColors = [
      '#e6e6ff', // Cool blue-white
      '#ffe6e6', // Warm red-white
      '#e6ffe6', // Green-white
      '#fff6e6'  // Yellow-white
    ];
    
    // Create each arm
    armAngles.forEach((angle, i) => {
      // Arm material and geometry
      arms.push(
        <group 
          key={`arm-${i}`} 
          ref={el => armsRef.current[i] = el}
          rotation={[0, angle, 0]}
        >
          {/* Arm structure */}
          <mesh
            position={[galleryDimensions.armLength / 2, galleryDimensions.height / 2, 0]}
            castShadow
            receiveShadow
          >
            <boxGeometry 
              args={[
                galleryDimensions.armLength, 
                galleryDimensions.height, 
                galleryDimensions.armWidth
              ]} 
            />
            <meshStandardMaterial color={armColors[i]} />
          </mesh>
          
          {/* Arm spotlight */}
          <spotLight
            ref={el => spotlightsRef.current[i] = el}
            position={[galleryDimensions.armLength / 2, galleryDimensions.height - 2, 0]}
            intensity={0.8}
            angle={0.4}
            penumbra={0.5}
            castShadow
            color={new THREE.Color().setHSL(i / 4, 0.6, 0.5)}
            distance={100}
          />
        </group>
      );
    });
    
    return arms;
  };
  
  // Create artwork displays along the arms
  const createArmArtworks = () => {
    if (!artworks || artworks.length === 0) return [];
    
    const artworkDisplays = [];
    
    // Arm directions and orientations
    const armDirections = [
      { x: 1, z: 1, angle: Math.PI / 4 },      // NE arm
      { x: -1, z: 1, angle: (3 * Math.PI) / 4 },   // NW arm
      { x: -1, z: -1, angle: (5 * Math.PI) / 4 },  // SW arm
      { x: 1, z: -1, angle: (7 * Math.PI) / 4 }    // SE arm
    ];
    
    // Determine how many artworks per arm
    const artworksPerArm = Math.ceil(artworks.length / 4);
    
    // Place artworks along each arm
    armDirections.forEach((direction, armIndex) => {
      // Place artworks on both sides of each arm
      for (let side = -1; side <= 1; side += 2) {
        // Skip center
        if (side === 0) continue;
        
        // Determine how many per side
        const artworksPerSide = Math.ceil(artworksPerArm / 2);
        
        // Place artworks along each side
        for (let i = 0; i < artworksPerSide; i++) {
          // Calculate overall artwork index
          const artworkIndex = armIndex * artworksPerArm + 
                              (side === -1 ? i : artworksPerSide + i);
          
          // Skip if we're out of artworks
          if (artworkIndex >= artworks.length) continue;
          
          // Distance along arm
          const distance = 20 + i * 15; // Space between artworks
          
          // Wall offset
          const wallOffset = galleryDimensions.armWidth / 2 * 0.9;
          
          // Calculate position with perpendicular offset
          const perpAngle = direction.angle + (side * Math.PI / 2);
          
          const position = [
            direction.x * distance * Math.cos(direction.angle) + 
              Math.cos(perpAngle) * wallOffset,
            galleryDimensions.height / 2,
            direction.x * distance * Math.sin(direction.angle) + 
              Math.sin(perpAngle) * wallOffset
          ];
          
          // Rotation - face inward on the wall
          const rotation = [0, direction.angle + Math.PI + (side * Math.PI / 2), 0];
          
          // Create artwork display
          artworkDisplays.push(
            <ArtworkDisplay
              key={`artwork-${armIndex}-${side}-${i}`}
              position={position}
              rotation={rotation}
              artwork={artworks[artworkIndex]}
              size={[6, 4]}
              wallId={`arm-${armIndex}-${side}`}
              onAddToCart={onAddToCart}
            />
          );
        }
      }
    });
    
    return artworkDisplays;
  };
  
  // Create central objects where the X intersects
  const createCentralObjects = () => {
    if (!artworks || artworks.length === 0) return null;
    
    // Use the last few artworks for central display
    const centerArtworkIndex = artworks.length - 1;
    
    // Create a central feature
    return (
      <group position={[0, 0, 0]}>
        {/* Central pedestal */}
        <PlaceholderObject
          position={[0, 1, 0]}
          size={[5, 6, 5]}
          type="interactive"
          id="central"
          artwork={artworks[centerArtworkIndex]}
          showLabels={showLabels}
          onAddToCart={onAddToCart}
        />
        
        {/* Central spotlight */}
        <spotLight
          position={[0, galleryDimensions.height - 2, 0]}
          intensity={1.2}
          angle={0.6}
          penumbra={0.7}
          castShadow
          color="#ffffff"
        />
      </group>
    );
  };

  return (
    <group>
      {/* Reflective Floor */}
      <Reflector
        position={[0, 0, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        args={[galleryDimensions.width, galleryDimensions.length]}
        resolution={512}
        mirror={0.6}
        mixBlur={10}
        mixStrength={0.8}
        blur={[400, 100]}
        metalness={0.6}
        roughness={0.4}
      >
        {(Material, props) => (
          <Material 
            color='#222222' 
            {...props} 
          />
        )}
      </Reflector>
      
      {/* X-Structure Arms */}
      {createXStructure()}
      
      {/* Central intersection feature */}
      {createCentralObjects()}
      
      {/* Ceiling */}
      <mesh position={[0, galleryDimensions.height, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[galleryDimensions.width, galleryDimensions.length]} />
        <meshStandardMaterial 
          color="#f5f5f5" 
          transparent={true} 
          opacity={0.3} 
          side={THREE.DoubleSide} 
        />
      </mesh>
      
      {/* Artworks */}
      {createArmArtworks()}
      
      {/* Additional lighting */}
      <ambientLight intensity={0.3} />
      <hemisphereLight 
        intensity={0.2} 
        color="#ffffff" 
        groundColor="#000000" 
      />
      
      {/* Debug information */}
      {showLabels && (
        <Html position={[0, galleryDimensions.height - 1, 0]} center>
          <div className="debug-info">
            <div className="debug-title">X Gallery</div>
            <div>Press 'L' to toggle labels</div>
            <div>Dimensions: {galleryDimensions.width}m × {galleryDimensions.length}m × {galleryDimensions.height}m</div>
          </div>
        </Html>
      )}
    </group>
  );
};

XGallery.propTypes = {
  artworks: PropTypes.array,
  debug: PropTypes.bool,
  onAddToCart: PropTypes.func
};

export default XGallery;