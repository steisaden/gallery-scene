import React from 'react';
import PropTypes from 'prop-types';
import { GradientTexture } from '@react-three/drei';

const RoomFloor = ({ position = [0, 0], size = [10, 10] }) => {
  return (
    <mesh 
      position={[position[0], 0, position[1]]} 
      rotation={[-Math.PI / 2, 0, 0]} 
      receiveShadow
    >
      <planeGeometry args={size} />
      <meshStandardMaterial>
        <GradientTexture 
          stops={[0, 1]} 
          colors={['#444444', '#222222']} 
          size={1024} 
        />
      </meshStandardMaterial>
    </mesh>
  );
};

RoomFloor.propTypes = {
  position: PropTypes.array,
  size: PropTypes.array
};

export default RoomFloor;