// src/components/Wall.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { GradientTexture } from '@react-three/drei';
import * as THREE from 'three';

const Wall = ({ 
  start, 
  end, 
  height = 10, 
  thickness = 0.5, 
  color = 'white',
  hasDoor = false,
  position = 0.5,
  width = 5,
  doorHeight = 8
}) => {
  // Calculate wall dimensions and position
  const wallLength = new THREE.Vector2(
    end[0] - start[0],
    end[2] - start[2]
  ).length();
  
  const wallCenter = [
    (start[0] + end[0]) / 2,
    height / 2,
    (start[2] + end[2]) / 2
  ];
  
  // Calculate rotation
  const angle = Math.atan2(end[2] - start[2], end[0] - start[0]);
  
  // Create door cutout if needed
  let wallGeometry;
  
  if (hasDoor) {
    // Calculate door position along the wall
    const doorPosition = wallLength * position - width / 2;
    
    // Create wall with door cutout
    wallGeometry = (
      <mesh position={wallCenter} rotation={[0, angle, 0]}>
        {/* Left section */}
        <mesh position={[-wallLength/2 + doorPosition/2, 0, 0]}>
          <boxGeometry args={[doorPosition, height, thickness]} />
          <meshStandardMaterial color={color} />
        </mesh>
        
        {/* Right section */}
        <mesh position={[doorPosition/2 + width + (wallLength - doorPosition - width)/2, 0, 0]}>
          <boxGeometry args={[wallLength - doorPosition - width, height, thickness]} />
          <meshStandardMaterial color={color} />
        </mesh>
        
        {/* Top section */}
        <mesh position={[doorPosition/2 + width/2, (height - doorHeight)/2 + doorHeight/2, 0]}>
          <boxGeometry args={[width, height - doorHeight, thickness]} />
          <meshStandardMaterial color={color} />
        </mesh>
      </mesh>
    );
  } else {
    // Create solid wall
    wallGeometry = (
      <mesh position={wallCenter} rotation={[0, angle, 0]}>
        <boxGeometry args={[wallLength, height, thickness]} />
        <meshStandardMaterial color={color}>
          <GradientTexture 
            stops={[0, 1]} 
            colors={[color, '#e0e0e0']} 
            size={1024} 
          />
        </meshStandardMaterial>
      </mesh>
    );
  }
  
  return wallGeometry;
};

Wall.propTypes = {
  start: PropTypes.array.isRequired,
  end: PropTypes.array.isRequired,
  height: PropTypes.number,
  thickness: PropTypes.number,
  color: PropTypes.string,
  hasDoor: PropTypes.bool,
  position: PropTypes.number,
  width: PropTypes.number,
  doorHeight: PropTypes.number
};

export default Wall;