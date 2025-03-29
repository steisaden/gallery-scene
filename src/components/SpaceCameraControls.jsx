// src/components/SpaceCameraControls.jsx
import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

/**
 * SpaceCameraControls component for handling camera movement in the gallery
 * Provides smooth transitions between gallery views and prevents zooming
 * 
 * @param {string} target - Target gallery ID
 * @param {Object} galleryPositions - Object mapping gallery IDs to positions
 * @param {boolean} enabled - Whether controls are enabled
 */
const SpaceCameraControls = ({ 
  target = 'overview', 
  galleryPositions = {}, 
  enabled = true 
}) => {
  const { camera, gl } = useThree();
  const [currentTarget, setCurrentTarget] = useState(target);
  const [isMoving, setIsMoving] = useState(false);
  const startPosition = useRef(new THREE.Vector3(0, 10, 50));
  const controlsRef = useRef();
  const [progress, setProgress] = useState(0);
  
  // Define positions for different views
  const cameraPositions = {
    'overview': {
      position: new THREE.Vector3(0, 30, 100),
      lookAt: new THREE.Vector3(0, 0, 0)
    },
    ...Object.fromEntries(
      Object.entries(galleryPositions || {}).map(([key, pos]) => [
        key, 
        {
          position: new THREE.Vector3(pos[0], pos[1] + 10, pos[2] + 30),
          lookAt: new THREE.Vector3(pos[0], pos[1], pos[2])
        }
      ])
    )
  };
  
  // Initialize camera position
  useEffect(() => {
    console.log("Initializing camera at:", cameraPositions['overview'].position);
    camera.position.copy(cameraPositions['overview'].position);
    camera.lookAt(cameraPositions['overview'].lookAt);
    startPosition.current.copy(camera.position);
  }, [camera]);
  
  // Handle target change
  useEffect(() => {
    if (target !== currentTarget && !isMoving) {
      console.log(`Camera moving to: ${target}`);
      startPosition.current.copy(camera.position);
      setIsMoving(true);
      setProgress(0);
      setCurrentTarget(target);
      
      // Disable orbit controls during camera movement
      if (controlsRef.current) {
        controlsRef.current.enabled = false;
      }
    }
  }, [target, currentTarget, isMoving, camera]);
  
  // Camera movement animation
  useFrame(() => {
    if (isMoving && enabled) {
      // Get target position
      const targetPosition = cameraPositions[currentTarget].position;
      const targetLookAt = cameraPositions[currentTarget].lookAt;
      
      // Increment progress with a smoother speed
      setProgress(prev => {
        const newProgress = Math.min(prev + 0.01, 1);
        
        // Update camera position with smooth easing
        camera.position.lerpVectors(
          startPosition.current, 
          targetPosition,
          THREE.MathUtils.smootherstep(newProgress, 0, 1)
        );
        
        // Make the camera look at the target
        camera.lookAt(targetLookAt);
        
        // End movement when progress is complete
        if (newProgress >= 1) {
          setIsMoving(false);
          // Re-enable orbit controls after movement
          if (controlsRef.current) {
            controlsRef.current.enabled = true;
          }
          console.log(`Camera arrived at: ${currentTarget}`);
        }
        
        return newProgress;
      });
    }
    
    // Apply camera constraints
    if (camera.position.y < 5) camera.position.y = 5;
    if (camera.position.y > 30) camera.position.y = 30;
  });
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      // Update camera aspect ratio
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [camera]);
  
  return (
    <OrbitControls
      ref={controlsRef}
      args={[camera, gl.domElement]}
      enableDamping={true}
      dampingFactor={0.05}
      rotateSpeed={0.5}
      // Disable zoom to prevent user from zooming in/out
      enableZoom={false}
      // Constrain rotation for better UX
      minPolarAngle={Math.PI / 6} // Limit upward looking
      maxPolarAngle={Math.PI / 2} // Limit downward looking to horizon
      minDistance={10} // Prevent getting too close
      maxDistance={150} // Prevent getting too far
      enabled={!isMoving && enabled}
    />
  );
};

SpaceCameraControls.propTypes = {
  target: PropTypes.string,
  galleryPositions: PropTypes.object,
  enabled: PropTypes.bool
};

export default SpaceCameraControls;