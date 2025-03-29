// src/components/RoomFloor.jsx
import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { MeshReflectorMaterial } from '@react-three/drei';
/**
 * RoomFloor component for creating reflective floors in gallery rooms
 * 
 * @param {Array} position - [x, z] position of floor center
 * @param {Array} size - [width, length] of floor
 * @param {number} height - Height position of floor (y-coordinate)
 * @param {string} color - Base floor color
 */
const RoomFloor = ({ 
  position = [0, 0], 
  size = [10, 10], 
  height = 0, 
  color = "#ffffff" 
}) => {
  const floorRef = useRef();

  return (
    <mesh 
      ref={floorRef}
      position={[position[0], height, position[1]]} 
      rotation={[-Math.PI / 2, 0, 0]} 
      receiveShadow
    >
      <planeGeometry args={[size[0], size[1]]} />
      <MeshReflectorMaterial
        blur={[300, 100]}  // Blur ground reflections (width, height)
        resolution={1024}  // Off-buffer resolution
        mirror={0.5}       // Mirror environment, 0 = texture colors, 1 = pick up env colors
        mixBlur={10}       // How much blur mixes with surface roughness
        mixStrength={1}    // Strength of the reflections
        roughness={0.1}    // Roughness of the reflections
        depthScale={1}     // Scale the depth factor
        minDepthThreshold={0.9} // Lower edge for the depthTexture interpolation
        maxDepthThreshold={1}   // Upper edge for the depthTexture interpolation
        color={color}      // Base color
        metalness={0.8}    // Metalness of the material
        reflectorOffset={0.5} // Offsets the virtual camera that projects the reflection
      />
    </mesh>
  );
};

RoomFloor.propTypes = {
  position: PropTypes.array,
  size: PropTypes.array,
  height: PropTypes.number,
  color: PropTypes.string
};

export default RoomFloor;