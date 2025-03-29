// src/components/GalaxyEnvironment.jsx
import React, { useRef, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';

/**
 * GalaxyEnvironment component for creating a space background
 * Adds stars, nebulae, and other cosmic elements to surround the galleries
 * 
 * @param {ReactNode} children - Child components (galleries)
 * @param {Array} galleryZones - Zones where galaxies shouldn't be placed
 */
const GalaxyEnvironment = ({ children, galleryZones = [] }) => {
  const galaxyRef = useRef();
  const instancedMeshRef = useRef();
  const instancedNebulasRef = useRef();
  const dummyObject = useMemo(() => new THREE.Object3D(), []);
  const rotationSpeed = 0.0001;
  
  // Function to check if a position is inside any gallery zone
  const isInsideGalleryZone = (position, galleryZones) => {
    // If no gallery zones are defined, use default gallery positions
    const zones = galleryZones.length > 0 ? galleryZones : [
      // Default gallery positions - boxes defined as [center, size]
      // Format: [centerX, centerY, centerZ, width, length, height]
      [0, 0, 0, 150, 150, 25],           // Box gallery (with buffer)
      [150, 0, 150, 150, 150, 25],       // Circle gallery (with buffer)
      [-150, 0, 150, 150, 150, 25],      // Triangle gallery (with buffer)
      [0, 0, -200, 150, 150, 25]         // X gallery (with buffer)
    ];
    
    // Check if position is inside any of the zones with an extra buffer for safety
    const buffer = 20; // Extra buffer distance around galleries
    for (const zone of zones) {
      if (zone && zone.length >= 6) {
        const [x, y, z, width, length, height] = zone;
        if (
          position.x > x - (width/2 + buffer) && position.x < x + (width/2 + buffer) &&
          position.y > y - (height/2 + buffer) && position.y < y + (height/2 + buffer) &&
          position.z > z - (length/2 + buffer) && position.z < z + (length/2 + buffer)
        ) {
          return true;
        }
      }
    }
    
    return false;
  };

  // Generate particle data for stars
  const { positions, colors, scales, count } = useMemo(() => {
    // Pre-define colors for the stars
    const starColors = [
      new THREE.Color(0x4D7EFF), // Blue
      new THREE.Color(0xA2B9FF), // Blue-white
      new THREE.Color(0xFFFFFF), // White
      new THREE.Color(0xFFF4D2), // Yellow-white
      new THREE.Color(0xFFD2A1), // Yellow
      new THREE.Color(0xFFAA33), // Orange
      new THREE.Color(0xFF6C3B)  // Red
    ];
    
    // Prepare arrays to store data
    const targetParticleCount = 4000;
    let validCount = 0;
    
    // We'll collect positions, colors, and scales in arrays
    const positionsArray = [];
    const colorsArray = [];
    const scalesArray = [];
    
    // Generate particles ensuring they're outside gallery zones
    let attempts = 0;
    const maxAttempts = targetParticleCount * 5;
    
    while (validCount < targetParticleCount && attempts < maxAttempts) {
      attempts++;
      
      // Generate position based on distribution type
      let position = new THREE.Vector3();
      const distributionType = Math.random();
      
      if (distributionType < 0.6) {
        // Spiral galaxy distribution
        const radius = Math.random() * 200 + 150;
        const spinAngle = radius * 0.008;
        const branchAngle = (attempts % 4) * Math.PI * 2 / 4; // 4 spiral arms
        
        const x = radius * Math.cos(spinAngle + branchAngle);
        const y = (Math.random() - 0.5) * 30;
        const z = radius * Math.sin(spinAngle + branchAngle);
        
        // Add randomness within the arm
        const randomOffset = new THREE.Vector3(
          (Math.random() - 0.5) * 30,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 30
        );
        
        position.set(x, y, z).add(randomOffset);
      } 
      else if (distributionType < 0.9) {
        // Random background stars
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const radius = Math.random() * 300 + 250;
        
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);
        
        position.set(x, y, z);
      } 
      else {
        // Nearby bright stars
        const theta = Math.random() * Math.PI * 2;
        const radius = 250 + Math.random() * 100;
        
        const x = radius * Math.cos(theta);
        const y = (Math.random() - 0.5) * 50;
        const z = radius * Math.sin(theta);
        
        position.set(x, y, z);
      }
      
      // Skip if inside a gallery zone
      if (isInsideGalleryZone(position, galleryZones)) {
        continue;
      }
      
      // Determine star color and size
      const colorType = Math.random();
      let colorIndex;
      let scale;
      
      if (colorType < 0.5) {
        // Common white/yellow stars
        colorIndex = Math.random() < 0.5 ? 2 : 3; // White or yellow-white
        scale = Math.random() * 0.3 + 0.1;
      }
      else if (colorType < 0.8) {
        // Blue/white stars
        colorIndex = Math.random() < 0.5 ? 0 : 1; // Blue or blue-white
        scale = Math.random() * 0.4 + 0.2;
      }
      else {
        // Red/orange stars
        colorIndex = Math.random() < 0.5 ? 5 : 6; // Orange or red
        scale = Math.random() * 0.5 + 0.3;
      }
      
      // Add to our arrays
      positionsArray.push(position.x, position.y, position.z);
      
      const color = starColors[colorIndex];
      colorsArray.push(color.r, color.g, color.b);
      
      scalesArray.push(scale);
      
      validCount++;
    }
    
    console.log(`Generated ${validCount} stars after ${attempts} attempts`);
    
    return {
      positions: positionsArray,
      colors: colorsArray,
      scales: scalesArray,
      count: validCount
    };
  }, [galleryZones]);
  
  // Generate nebula data for instancing
  const nebulaData = useMemo(() => {
    return {
      positions: [
        [300, 40, -200],  // Position 1
        [-350, 30, -150], // Position 2
        [200, -80, 350],  // Position 3
        [-250, 60, 280]   // Position 4
      ],
      colors: [
        new THREE.Color('#4422bb'), // Blue nebula
        new THREE.Color('#dd2244'), // Red nebula
        new THREE.Color('#22dd88'), // Green nebula
        new THREE.Color('#ddaa22')  // Yellow/orange nebula
      ],
      scales: [100, 150, 120, 130]
    };
  }, []);
  
  // Initialize the instanced meshes
  useEffect(() => {
    // Initialize star instances
    if (instancedMeshRef.current) {
      // Make sure instance count matches our data
      if (instancedMeshRef.current.count !== count) {
        console.warn(`InstancedMesh count (${instancedMeshRef.current.count}) doesn't match data count (${count})`);
      }
      
      const actualCount = Math.min(count, instancedMeshRef.current.count);
      
      for (let i = 0; i < actualCount; i++) {
        const x = positions[i * 3];
        const y = positions[i * 3 + 1];
        const z = positions[i * 3 + 2];
        
        const scale = scales[i];
        
        dummyObject.position.set(x, y, z);
        dummyObject.scale.set(scale, scale, scale);
        dummyObject.updateMatrix();
        
        instancedMeshRef.current.setMatrixAt(i, dummyObject.matrix);
        
        // Set color for this instance if the method exists
        if (instancedMeshRef.current.setColorAt) {
          instancedMeshRef.current.setColorAt(
            i, 
            new THREE.Color(
              colors[i * 3], 
              colors[i * 3 + 1], 
              colors[i * 3 + 2]
            )
          );
        }
      }
      
      instancedMeshRef.current.instanceMatrix.needsUpdate = true;
      
      // Only update instance color if it exists
      if (instancedMeshRef.current.instanceColor) {
        instancedMeshRef.current.instanceColor.needsUpdate = true;
      }
    }
    
    // Initialize nebula instances
    if (instancedNebulasRef.current && nebulaData.positions.length > 0) {
      const nebulaCount = Math.min(nebulaData.positions.length, instancedNebulasRef.current.count);
      
      for (let i = 0; i < nebulaCount; i++) {
        // Safely access position data
        if (nebulaData.positions[i] && nebulaData.positions[i].length >= 3) {
          const x = nebulaData.positions[i][0];
          const y = nebulaData.positions[i][1];
          const z = nebulaData.positions[i][2];
          
          const scale = nebulaData.scales[i] || 100;
          
          dummyObject.position.set(x, y, z);
          dummyObject.scale.set(scale, scale, scale);
          dummyObject.updateMatrix();
          
          instancedNebulasRef.current.setMatrixAt(i, dummyObject.matrix);
          
          // Set color if the method exists
          if (instancedNebulasRef.current.setColorAt && nebulaData.colors[i]) {
            instancedNebulasRef.current.setColorAt(i, nebulaData.colors[i]);
          }
        }
      }
      
      instancedNebulasRef.current.instanceMatrix.needsUpdate = true;
      
      // Only update instance color if it exists
      if (instancedNebulasRef.current.instanceColor) {
        instancedNebulasRef.current.instanceColor.needsUpdate = true;
      }
    }
  }, [positions, colors, scales, count, nebulaData, dummyObject]);
  
  // Add subtle rotation to the galaxy
  useFrame((state, delta) => {
    if (galaxyRef.current) {
      galaxyRef.current.rotation.y += rotationSpeed * delta * 60; // Frame-rate independent rotation
    }
    
    // Rotate nebulas individually
    if (instancedNebulasRef.current && nebulaData.positions.length > 0) {
      const nebulaCount = Math.min(nebulaData.positions.length, instancedNebulasRef.current.count);
      
      for (let i = 0; i < nebulaCount; i++) {
        // Safely access position data
        if (nebulaData.positions[i] && nebulaData.positions[i].length >= 3) {
          const x = nebulaData.positions[i][0];
          const y = nebulaData.positions[i][1];
          const z = nebulaData.positions[i][2];
          
          dummyObject.position.set(x, y, z);
          
          const time = state.clock.elapsedTime;
          // Create different rotation speeds for each nebula
          const rotX = Math.sin(time * 0.05 + i) * 0.01;
          const rotY = Math.cos(time * 0.03 + i * 2) * 0.01;
          
          dummyObject.rotation.x += rotX;
          dummyObject.rotation.y += rotY;
          
          const scale = nebulaData.scales[i] || 100;
          dummyObject.scale.set(scale, scale, scale);
          
          dummyObject.updateMatrix();
          instancedNebulasRef.current.setMatrixAt(i, dummyObject.matrix);
        }
      }
      
      instancedNebulasRef.current.instanceMatrix.needsUpdate = true;
    }
  });
  
  return (
    <group ref={galaxyRef}>
      {/* Base layer of stars using drei's Stars component */}
      <Stars 
        radius={400} 
        depth={50} 
        count={2000} // Base stars
        factor={5} 
        saturation={0} 
        fade 
        speed={0.5}
      />
      
      {/* Custom galaxy particles using instanced mesh */}
      <instancedMesh 
        ref={instancedMeshRef} 
        args={[null, null, count || 4000]}
        frustumCulled={true}
      >
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial toneMapped={false} vertexColors />
      </instancedMesh>
      
      {/* Nebula effect using instanced mesh */}
      <instancedMesh
        ref={instancedNebulasRef}
        args={[null, null, nebulaData.positions.length || 4]}
        frustumCulled={true}
      >
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial
          transparent={true}
          opacity={0.15}
          side={THREE.BackSide}
          vertexColors
        />
      </instancedMesh>
      
      {/* Pass through any children (galleries) */}
      {children}
    </group>
  );
};

GalaxyEnvironment.propTypes = {
  children: PropTypes.node,
  galleryZones: PropTypes.array
};

export default GalaxyEnvironment;