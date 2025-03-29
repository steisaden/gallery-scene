// src/components/RoomCeiling.jsx
import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import * as THREE from 'three';

/**
 * RoomCeiling component for creating ceilings in gallery rooms
 * 
 * @param {Array} position - [x, z] position of ceiling center
 * @param {Array} size - [width, length] of ceiling
 * @param {number} height - Height position of ceiling (y-coordinate)
 * @param {string} color - Ceiling color
 * @param {number} opacity - Ceiling opacity
 */
const RoomCeiling = ({ 
  position = [0, 0], 
  size = [10, 10], 
  height = 20, 
  color = "#f5f5f5",
  opacity = 0.3
}) => {
  const ceilingRef = useRef();

  return (
    <mesh 
      ref={ceilingRef}
      position={[position[0], height, position[1]]} 
      rotation={[Math.PI / 2, 0, 0]} 
      receiveShadow
    >
      <planeGeometry args={[size[0], size[1]]} />
      <meshStandardMaterial 
        color={color} 
        transparent={true} 
        opacity={opacity}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

RoomCeiling.propTypes = {
  position: PropTypes.array,
  size: PropTypes.array,
  height: PropTypes.number,
  color: PropTypes.string,
  opacity: PropTypes.number
};

export default RoomCeiling;