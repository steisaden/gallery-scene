import React from 'react';
import PropTypes from 'prop-types';
import { GradientTexture } from '@react-three/drei';

const RoomCeiling = ({ position = [0, 0], size = [10, 10], height = 10 }) => {
  return (
    <mesh 
      position={[position[0], height, position[1]]} 
      rotation={[Math.PI / 2, 0, 0]} 
      receiveShadow
    >
      <planeGeometry args={size} />
      <meshStandardMaterial>
        <GradientTexture 
          stops={[0, 1]} 
          colors={['#333333', '#111111']} 
          size={1024} 
        />
      </meshStandardMaterial>
    </mesh>
  );
};

RoomCeiling.propTypes = {
  position: PropTypes.array,
  size: PropTypes.array,
  height: PropTypes.number
};

export default RoomCeiling;