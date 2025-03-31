import React, { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, Plane, Box, useTexture } from "@react-three/drei";

const UrbanGallery = ({ images }) => {
  const wallTexture = useTexture("/textures/brick.jpg");
  const floorTexture = useTexture("/textures/concrete.jpg");
  
  return (
    <Canvas camera={{ position: [0, 5, 10], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <spotLight position={[5, 10, 5]} angle={0.3} intensity={1} castShadow />
      
      {/* Walls */}
      <Box args={[10, 5, 0.2]} position={[0, 2.5, -5]}>
        <meshStandardMaterial map={wallTexture} />
      </Box>
      <Box args={[0.2, 5, 10]} position={[-5, 2.5, 0]}>
        <meshStandardMaterial map={wallTexture} />
      </Box>
      <Box args={[0.2, 5, 10]} position={[5, 2.5, 0]}>
        <meshStandardMaterial map={wallTexture} />
      </Box>

      {/* Floor */}
      <Plane args={[10, 10]} rotation={[-Math.PI / 2, 0, 0]}>
        <meshStandardMaterial map={floorTexture} />
      </Plane>

      {/* Image Frames */}
      {images.map((src, index) => (
        <Frame key={index} src={src} position={[index * 2 - 4, 2, -4.9]} />
      ))}
      
      <OrbitControls />
      <Environment preset="city" />
    </Canvas>
  );
};

const Frame = ({ src, position }) => {
  return (
    <group position={position}>
      <Box args={[1.5, 2, 0.1]}>
        <meshStandardMaterial color="black" />
      </Box>
      <Plane args={[1.4, 1.9]} position={[0, 0, 0.06]}>
        <meshStandardMaterial map={useTexture(src)} />
      </Plane>
    </group>
  );
};

export default UrbanGallery;
