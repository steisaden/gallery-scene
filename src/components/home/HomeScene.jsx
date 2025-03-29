// src/components/home/HomeScene.jsx
import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stats, Html, OrbitControls, PerspectiveCamera } from '@react-three/drei';
import FeaturedGallery from './FeaturedGallery';
import LoadingSpinner from '../ui/LoadingSpinner';
import { trackGalleryInteraction } from '../../services/analytics';
import '../../styles/HomeScene.css';

const HomeScene = ({ onNavigateToGallery }) => {
  const [debugMode, setDebugMode] = useState(false);
  const [cameraPosition, setCameraPosition] = useState([0, 5, 25]);
  
  // Handle exploring a specific gallery
  const handleExploreGallery = (galleryType) => {
    // Track interaction
    trackGalleryInteraction(galleryType, 'navigate_from_home', {
      source: 'home_screen'
    });
    
    // Trigger navigation callback
    if (onNavigateToGallery) {
      onNavigateToGallery(galleryType);
    }
  };
  
  return (
    <div className="home-scene">
      <div className="canvas-container">
        <Canvas shadows>
          {/* Debug Stats */}
          {debugMode && <Stats />}
          
          {/* Camera */}
          <PerspectiveCamera
            makeDefault
            position={cameraPosition}
            fov={50}
            near={0.1}
            far={1000}
          />
          
          {/* Orbit Controls */}
          <OrbitControls
            enableZoom={true}
            enablePan={false}
            enableRotate={true}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 6}
            maxDistance={35}
            minDistance={15}
            target={[0, 0, 0]}
            onChange={() => {
              // Track camera movement
              trackGalleryInteraction('home', 'camera_moved', {
                type: 'orbit'
              });
            }}
          />
          
          {/* Main content */}
          <Suspense fallback={
            <Html center>
              <LoadingSpinner message="Loading featured artwork..." fullScreen={false} />
            </Html>
          }>
            <FeaturedGallery />
          </Suspense>
        </Canvas>
      </div>
      
      {/* Overlay UI */}
      <div className="home-ui-overlay">
        <div className="hero-content">
          <h1>Space Gallery</h1>
          <p>Explore our immersive 3D art galleries featuring works from talented artists around the world</p>
          
          <div className="gallery-buttons">
            <button 
              className="gallery-button box-gallery"
              onClick={() => handleExploreGallery('box')}
            >
              <span className="icon">□</span>
              Box Gallery
            </button>
            
            <button 
              className="gallery-button circle-gallery"
              onClick={() => handleExploreGallery('circle')}
            >
              <span className="icon">○</span>
              Circle Gallery
            </button>
            
            <button 
              className="gallery-button triangle-gallery"
              onClick={() => handleExploreGallery('triangle')}
            >
              <span className="icon">△</span>
              Triangle Gallery
            </button>
            
            <button 
              className="gallery-button x-gallery"
              onClick={() => handleExploreGallery('x')}
            >
              <span className="icon">✕</span>
              X Gallery
            </button>
          </div>
        </div>
        
        <div className="home-footer">
          <div className="debug-toggle">
            <button 
              className={`toggle-button ${debugMode ? 'active' : ''}`}
              onClick={() => setDebugMode(!debugMode)}
            >
              {debugMode ? 'Hide Debug' : 'Show Debug'}
            </button>
          </div>
          
          <div className="camera-controls">
            <button 
              className="view-button"
              onClick={() => {
                setCameraPosition([0, 5, 25]);
                trackGalleryInteraction('home', 'camera_reset', {
                  view: 'front'
                });
              }}
            >
              Front View
            </button>
            
            <button 
              className="view-button"
              onClick={() => {
                setCameraPosition([25, 5, 0]);
                trackGalleryInteraction('home', 'camera_changed', {
                  view: 'side'
                });
              }}
            >
              Side View
            </button>
            
            <button 
              className="view-button"
              onClick={() => {
                setCameraPosition([0, 20, 5]);
                trackGalleryInteraction('home', 'camera_changed', {
                  view: 'top'
                });
              }}
            >
              Top View
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeScene;