// src/components/home/FeaturedGallery.jsx
import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import FeaturedArtwork from './FeaturedArtwork';
import { getFeaturedArtworks } from '../../services/artwork';
import textureLoader from '../../services/TextureLoader';
import * as THREE from 'three';

const FeaturedGallery = () => {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const groupRef = useRef();
  
  // Load featured artworks
  useEffect(() => {
    const loadFeaturedArt = async () => {
      try {
        setLoading(true);
        const featured = await getFeaturedArtworks(6);
        setArtworks(featured);
        
        // Safely preload textures
        if (featured && featured.length > 0) {
          const textureUrls = featured
            .map(artwork => artwork.imageUrl)
            .filter(Boolean);
            
          if (textureUrls.length > 0) {
            try {
              await textureLoader.preloadTextures(textureUrls);
            } catch (textureErr) {
              console.warn('Some textures failed to load:', textureErr);
              // Continue execution even if texture loading fails
            }
          }
        }
        
        setError(null);
      } catch (err) {
        console.error('Error loading featured artworks:', err);
        setError('Failed to load featured artworks');
      } finally {
        setLoading(false);
      }
    };
    
    loadFeaturedArt();
  }, []);
  
  // Animation frame update
  useFrame((state, delta) => {
    if (groupRef.current) {
      // Add any animations or updates here
    }
  });
  
  // Render featured artworks
  const renderArtworks = () => {
    if (!artworks || artworks.length === 0) {
      return null;
    }
    
    return artworks.map((artwork, index) => (
      <FeaturedArtwork
        key={artwork.id}
        artwork={artwork}
        position={[
          (index % 3 - 1) * 4,  // X position
          1.5,                  // Y position
          Math.floor(index / 3) * 4 - 2  // Z position
        ]}
        textureLoader={textureLoader}
      />
    ));
  };
  
  return (
    <>
      <Environment preset="city" />
      
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      
      {/* Gallery floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#333333" roughness={0.8} />
      </mesh>
      
      {/* Featured artworks container */}
      <group ref={groupRef}>
        {renderArtworks()}
      </group>
    </>
  );
};

export default FeaturedGallery;