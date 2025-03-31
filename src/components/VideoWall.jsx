// src/components/VideoWall.jsx
import React, { Suspense, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import * as THREE from 'three';

/**
 * VideoWall component for creating interior walls with video displays
 * Uses a fallback pattern instead of useVideoTexture to avoid crossOrigin issues
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
  videoUrl = "/video/kobe.mp4" // Default video
}) => {
  const wallRef = useRef();
  const videoRef = useRef();
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoTexture, setVideoTexture] = useState(null);
  const [error, setError] = useState(false);

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

  // Load video texture manually
  React.useEffect((videoTexture) => {
    // Create video element
    const video = document.createElement('video');
    video.src = videoUrl;
    video.crossOrigin = 'anonymous';
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    videoRef.current = video;

    // Handle successful loading
    video.addEventListener('canplaythrough', () => {
      try {
        // Create texture from video
        const texture = new THREE.VideoTexture(video);
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.format = THREE.RGBAFormat;
        
        setVideoTexture(texture);
        setVideoLoaded(true);
        
        // Start playing
        video.play().catch(e => {
          console.error("Video playback error:", e);
          setError(true);
        });
      } catch (err) {
        console.error("Error creating video texture:", err);
        setError(true);
      }
    });

    // Handle loading errors
    video.addEventListener('error', (e) => {
      console.error("Video loading error:", e);
      setError(true);
    });

    // Load the video
    video.load();

    // Clean up on unmount
    return () => {
      if (video) {
        video.pause();
        video.src = '';
        video.load();
      }
      if (videoTexture) {
        videoTexture.dispose();
      }
    };
  }, [videoUrl]);

  // Create a gradient texture as fallback
  const createGradientTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#333333');
    gradient.addColorStop(0.5, '#666666');
    gradient.addColorStop(1, '#333333');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  };

  return (
    <group ref={wallRef} position={center} rotation={[0, angle, 0]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[length, height, thickness]} />
        {videoLoaded && !error ? (
          <meshStandardMaterial map={videoTexture} toneMapped={false} />
        ) : (
          <meshStandardMaterial>
            <canvasTexture attach="map" args={[createGradientTexture().image]} />
          </meshStandardMaterial>
        )}
      </mesh>
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