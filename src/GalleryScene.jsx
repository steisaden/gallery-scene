import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Html, Stats } from '@react-three/drei';
import './styles/GalleryScene.css';
import PropTypes from 'prop-types';
import BoxGallery from './components/galleries/box/BoxGallery';
import CircleGallery from './components/galleries/circle/CircleGallery';
import TriangleGallery from './components/galleries/triangle/TriangleGallery';
import XGallery from './components/galleries/x/XGallery';
import GalaxyEnvironment from './components/GalaxyEnvironment';
import SpaceCameraControls from './components/SpaceCameraControls';
import ArtworkDisplay from './components/artwork/ArtworkDisplay';
import { useAuth } from './contexts/AuthContext';
import { useCart } from './contexts/CartContext';
import LoadingSpinner from './components/ui/LoadingSpinner';
import DebugComponent from './components/DebugComponent';

const GalleryScene = ({ artworks = [] }) => {
  return <GalleryApp artworks={artworks} />;
};

GalleryScene.propTypes = {
  artworks: PropTypes.array
};

function GalleryApp({ artworks }) {
  const [currentScene, setCurrentScene] = useState('overview');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [spaceMode, setSpaceMode] = useState(true); // Start in space mode
  const [controlsEnabled, setControlsEnabled] = useState(true);
  const [debugMode, setDebugMode] = useState(false);
  const { isAuthenticated } = useAuth();
  const { addItem, isInCart } = useCart();
  
  // Define gallery positions in 3D space
  const galleryPositions = {
    'box': [0, 0, 0],
    'circle': [150, 0, 150],
    'triangle': [-150, 0, 150],
    'x': [0, 0, -200]
  };
  
  // Handle navigation between galleries
  const handleNavigate = (galleryId) => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setControlsEnabled(false);
      setCurrentScene(galleryId);
      
      // Re-enable controls after transition
      setTimeout(() => {
        setIsTransitioning(false);
        setControlsEnabled(true);
      }, 2500); // Give animation time to complete
    }
  };
  
  // Toggle space/galaxy mode
  const toggleSpaceMode = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setTimeout(() => {
        setSpaceMode(!spaceMode);
        setCurrentScene('overview');
        setTimeout(() => setIsTransitioning(false), 1000);
      }, 1000);
    }
  };
  
  // Toggle debug mode
  const toggleDebug = () => {
    setDebugMode(!debugMode);
  };
  
  // Handle adding artwork to cart
  const handleAddToCart = (artwork) => {
    // Check if user is authenticated first
    if (!isAuthenticated) {
      // Show login prompt or redirect to login
      console.log('Please log in to add items to cart');
      return false;
    }
    
    if (isInCart(artwork.id)) {
      return false;
    }
    
    const success = addItem(artwork);
    
    if (success) {
      // Show success toast or notification
      console.log(`Added ${artwork.title} to cart`);
    }
    
    return success;
  };

  // Distribute artworks to different galleries
  const distributeArtworks = () => {
    if (!artworks || artworks.length === 0) return {};
    
    // Create a distribution object with artwork arrays for each gallery
    const distribution = {
      box: [],
      circle: [],
      triangle: [],
      x: []
    };
    
    // Distribute artworks evenly across galleries
    artworks.forEach((artwork, index) => {
      const galleryTypes = ['box', 'circle', 'triangle', 'x'];
      const galleryIndex = index % galleryTypes.length;
      distribution[galleryTypes[galleryIndex]].push(artwork);
    });
    
    return distribution;
  };
  
  const artworkDistribution = distributeArtworks();

  return (
    <div className="gallery-container">
      {/* Navigation UI */}
      <div className="gallery-controls">
        <div className="gallery-nav">
          <button 
            onClick={() => handleNavigate('overview')}
            disabled={currentScene === 'overview' || isTransitioning}
            className={currentScene === 'overview' ? 'active' : ''}
          >
            Overview
          </button>
          <button 
            onClick={() => handleNavigate('box')}
            disabled={currentScene === 'box' || isTransitioning}
            className={currentScene === 'box' ? 'active' : ''}
          >
            Box Gallery
          </button>
          <button 
            onClick={() => handleNavigate('circle')}
            disabled={currentScene === 'circle' || isTransitioning}
            className={currentScene === 'circle' ? 'active' : ''}
          >
            Circle Gallery
          </button>
          <button 
            onClick={() => handleNavigate('triangle')}
            disabled={currentScene === 'triangle' || isTransitioning}
            className={currentScene === 'triangle' ? 'active' : ''}
          >
            Triangle Gallery
          </button>
          <button 
            onClick={() => handleNavigate('x')}
            disabled={currentScene === 'x' || isTransitioning}
            className={currentScene === 'x' ? 'active' : ''}
          >
            X Gallery
          </button>
        </div>
        
        <div className="gallery-actions">
          <button 
            onClick={() => setControlsEnabled(!controlsEnabled)}
            className={controlsEnabled ? 'active' : ''}
          >
            {controlsEnabled ? 'Disable Controls' : 'Enable Controls'}
          </button>
          
          <button 
            onClick={toggleDebug}
            className={debugMode ? 'active' : ''}
          >
            {debugMode ? 'Hide Debug' : 'Show Debug'}
          </button>
          
          <button onClick={toggleSpaceMode}>
            {spaceMode ? 'Exit Space Mode' : 'Enter Space Mode'}
          </button>
        </div>
      </div>

      {/* Status Display */}
      {isTransitioning && (
        <div className="gallery-status">
          <LoadingSpinner message="Transitioning to gallery..." fullScreen={false} />
        </div>
      )}

      {/* Canvas with transition effect */}
      <div className={`gallery-canvas ${isTransitioning ? 'transitioning' : ''}`}>
        <Canvas className="gallery-canvas-inner">
          {/* Debug Stats */}
          {debugMode && <Stats />}
          
          <ambientLight intensity={0.2} />
          <directionalLight intensity={0.8} position={[5, 10, 5]} />

          <Suspense fallback={
            <Html center>
              <LoadingSpinner message="Loading 3D environment..." fullScreen={false} />
            </Html>
          }>
            {/* Galaxy Environment */}
            <GalaxyEnvironment>
              {/* Galleries positioned in space */}
              <group position={galleryPositions['box']}>
                <DebugComponent name="BoxGallery Container" />
                <BoxGallery artworks={artworkDistribution.box} />
                {currentScene === 'box' && (
                  <Html center position={[0, 10, 0]}>
                    <div className="gallery-label">
                      Box Gallery
                    </div>
                  </Html>
                )}
                
                {/* Artwork displays for Box Gallery */}
                {artworkDistribution.box && artworkDistribution.box.map((artwork, index) => (
                  <ArtworkDisplay
                    key={`box-artwork-${artwork.id}`}
                    position={[index * 6 - 15, 5, -5]} // Adjusted positions
                    rotation={[0, 0, 0]}
                    artwork={artwork}
                    texture={null} // In actual implementation, this would be loaded
                    size={[4, 3]}
                    wallId="north"
                    onAddToCart={() => handleAddToCart(artwork)}
                  />
                ))}
              </group>
              
              <group position={galleryPositions['circle']}>
                <CircleGallery artworks={artworkDistribution.circle} />
                {currentScene === 'circle' && (
                  <Html center position={[0, 10, 0]}>
                    <div className="gallery-label">
                      Circle Gallery
                    </div>
                  </Html>
                )}
                
                {/* Artwork displays for Circle Gallery */}
                {artworkDistribution.circle && artworkDistribution.circle.map((artwork, index) => {
                  // Calculate position around circle
                  const angle = (index / artworkDistribution.circle.length) * Math.PI * 2;
                  const radius = 30;
                  const x = Math.cos(angle) * radius;
                  const z = Math.sin(angle) * radius;
                  const rotation = [0, angle + Math.PI, 0]; // Face toward center
                  
                  return (
                    <ArtworkDisplay
                      key={`circle-artwork-${artwork.id}`}
                      position={[x, 5, z]}
                      rotation={rotation}
                      artwork={artwork}
                      texture={null}
                      size={[4, 3]}
                      wallId="circle"
                      onAddToCart={() => handleAddToCart(artwork)}
                    />
                  );
                })}
              </group>
              
              <group position={galleryPositions['triangle']}>
                <TriangleGallery artworks={artworkDistribution.triangle} />
                {currentScene === 'triangle' && (
                  <Html center position={[0, 10, 0]}>
                    <div className="gallery-label">
                      Triangle Gallery
                    </div>
                  </Html>
                )}
                
                {/* Artwork displays for Triangle Gallery */}
                {artworkDistribution.triangle && artworkDistribution.triangle.map((artwork, index) => {
                  // Triangle positioning logic
                  const trianglePoints = [
                    [-30, 5, -30],  // Point 1
                    [30, 5, -30],   // Point 2
                    [0, 5, 30]      // Point 3
                  ];
                  
                  const pointIndex = index % trianglePoints.length;
                  const position = trianglePoints[pointIndex];
                  
                  // Face outward from triangle center
                  const centerX = 0;
                  const centerZ = -10;
                  const angle = Math.atan2(position[2] - centerZ, position[0] - centerX);
                  const rotation = [0, angle, 0];
                  
                  return (
                    <ArtworkDisplay
                      key={`triangle-artwork-${artwork.id}`}
                      position={position}
                      rotation={rotation}
                      artwork={artwork}
                      texture={null}
                      size={[4, 3]}
                      wallId="triangle"
                      onAddToCart={() => handleAddToCart(artwork)}
                    />
                  );
                })}
              </group>
              
              <group position={galleryPositions['x']}>
                <XGallery artworks={artworkDistribution.x} />
                {currentScene === 'x' && (
                  <Html center position={[0, 10, 0]}>
                    <div className="gallery-label">
                      X Gallery
                    </div>
                  </Html>
                )}
                
                {/* Artwork displays for X Gallery */}
                {artworkDistribution.x && artworkDistribution.x.map((artwork, index) => {
                  // X-shaped positioning
                  const armDirections = [
                    { x: 1, z: 1, angle: Math.PI/4 },     // Northeast arm
                    { x: -1, z: 1, angle: -Math.PI/4 },   // Northwest arm
                    { x: -1, z: -1, angle: -Math.PI*3/4 },// Southwest arm
                    { x: 1, z: -1, angle: Math.PI*3/4 }   // Southeast arm
                  ];
                  
                  const armIndex = index % armDirections.length;
                  const direction = armDirections[armIndex];
                  const distance = 20 + Math.floor(index / 4) * 10; // Space along arm
                  
                  const x = direction.x * distance;
                  const z = direction.z * distance;
                  const rotation = [0, direction.angle + Math.PI, 0]; // Face outward
                  
                  return (
                    <ArtworkDisplay
                      key={`x-artwork-${artwork.id}`}
                      position={[x, 5, z]}
                      rotation={rotation}
                      artwork={artwork}
                      texture={null}
                      size={[4, 3]}
                      wallId="x"
                      onAddToCart={() => handleAddToCart(artwork)}
                    />
                  );
                })}
              </group>
            </GalaxyEnvironment>
            
            {/* Camera controls */}
            <SpaceCameraControls
              target={currentScene}
              galleryPositions={galleryPositions}
              enabled={controlsEnabled}
            />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
}

export default GalleryScene;