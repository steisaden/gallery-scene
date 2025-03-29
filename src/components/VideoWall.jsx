// src/components/VideoWall.jsx
import React, { Suspense, useRef } from 'react';
import PropTypes from 'prop-types';
import { useVideoTexture } from '@react-three/drei';
/**
 * VideoWall component for creating interior walls with video displays
 * Used for non-external walls to create visual interest in the gallery
 * 
 * @param {Array} start - Start position [x, y, z]
 * @param {Array} end - End position [x, y, z]
 * @param {number} height - Wall height
 * @param {number} thickness - Wall thickness
 */
const VideoWall = ({ 
  start, 
  end, 
  height, 
  thickness = 0.5,
  videoUrl = "/video/gallery-ambience.mp4" // Default video
}) => {
  const wallRef = useRef();

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

  // VideoContent component to handle video loading
  const VideoContent = ({ length, height, thickness }) => {
    // Try to load video texture with fallback
    try {
      const videoTexture = useVideoTexture(videoUrl, {
        loop: true,
        muted: true,
        start: true,
        crossOrigin: "anonymous",
        playsInline: true,
      });
      
      return (
        <mesh castShadow receiveShadow>
          <boxGeometry args={[length, height, thickness]} />
          <meshStandardMaterial map={videoTexture} toneMapped={false} />
        </mesh>
      );
    } catch (error) {
      console.error("Error loading video texture:", error);
      // Fallback material
      return (
        <mesh castShadow receiveShadow>
          <boxGeometry args={[length, height, thickness]} />
          <meshStandardMaterial color="#333333">
            <gradientTexture
              stops={[0, 0.5, 1]}
              colors={['#333333', '#666666', '#333333']}
              size={1024}
            />
          </meshStandardMaterial>
        </mesh>
      );
    }
  };

  return (
    <group ref={wallRef} position={center} rotation={[0, angle, 0]}>
      <Suspense fallback={
        <mesh castShadow receiveShadow>
          <boxGeometry args={[length, height, thickness]} />
          <meshStandardMaterial color="#333333" />
        </mesh>
      }>
        <VideoContent 
          length={length}
          height={height}
          thickness={thickness}
        />
      </Suspense>
    </group>
  );
};

VideoWall.propTypes = {
  start: PropTypes.array.isRequired,
  end: PropTypes.array.isRequired,
  height: PropTypes.number.isRequired,
  thickness: PropTypes.number,
  videoUrl: PropTypes.string
};

export default VideoWall;