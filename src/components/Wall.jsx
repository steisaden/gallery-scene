// src/components/Wall.jsx
import React from 'react';
import PropTypes from 'prop-types';

/**
 * Wall component for creating gallery walls with optional doorways
 * 
 * @param {Array} start - Start position [x, y, z]
 * @param {Array} end - End position [x, y, z]
 * @param {number} height - Wall height
 * @param {number} thickness - Wall thickness
 * @param {string} color - Wall color
 * @param {boolean} hasDoor - Whether the wall has a door
 * @param {number} doorPosition - Position of door (0-1 along wall length)
 * @param {number} doorWidth - Width of doorway
 * @param {number} doorHeight - Height of doorway
 */
const Wall = ({ 
  start, 
  end, 
  height, 
  thickness = 0.5,
  color = "white",
  hasDoor = false, 
  doorPosition = 0.5, // 0 to 1, position along the wall
  doorWidth = 7,
  doorHeight = 12
}) => {
  // Calculate wall properties
  const length = Math.sqrt(
    Math.pow(end[0] - start[0], 2) + 
    Math.pow(end[2] - start[2], 2)
  );
  
  const center = [
    (start[0] + end[0]) / 2,
    height / 2,
    (start[2] + end[2]) / 2
  ];
  
  const angle = Math.atan2(end[2] - start[2], end[0] - start[0]);
  
  // If it has a door, we need to create multiple sections
  if (hasDoor) {
    // Calculate door position along the wall
    const doorCenter = length * doorPosition;
    const doorStart = doorCenter - doorWidth / 2;
    const doorEnd = doorCenter + doorWidth / 2;

    // Create wall sections
    return (
      <group position={[0, 0, 0]} rotation={[0, angle, 0]}>
        {/* Section before door (if any) */}
        {doorStart > 0 && (
          <mesh position={[doorStart / 2 - length / 2, height / 2, 0]} castShadow receiveShadow>
            <boxGeometry args={[doorStart, height, thickness]} />
            <meshStandardMaterial color={color} />
          </mesh>
        )}
        
        {/* Section above door */}
        <mesh 
          position={[doorCenter - length / 2, height - (height - doorHeight) / 2, 0]} 
          castShadow 
          receiveShadow
        >
          <boxGeometry args={[doorWidth, height - doorHeight, thickness]} />
          <meshStandardMaterial color={color} />
        </mesh>
        
        {/* Section after door (if any) */}
        {doorEnd < length && (
          <mesh 
            position={[length / 2 - (length - doorEnd) / 2, height / 2, 0]} 
            castShadow 
            receiveShadow
          >
            <boxGeometry args={[length - doorEnd, height, thickness]} />
            <meshStandardMaterial color={color} />
          </mesh>
        )}
      </group>
    );
  }
  
  // Regular wall without door
  return (
    <mesh position={center} rotation={[0, angle, 0]} castShadow receiveShadow>
      <boxGeometry args={[length, height, thickness]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

Wall.propTypes = {
  start: PropTypes.array.isRequired,
  end: PropTypes.array.isRequired,
  height: PropTypes.number.isRequired,
  thickness: PropTypes.number,
  color: PropTypes.string,
  hasDoor: PropTypes.bool,
  doorPosition: PropTypes.number,
  doorWidth: PropTypes.number,
  doorHeight: PropTypes.number
};

export default Wall;