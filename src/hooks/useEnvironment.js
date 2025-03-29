import { useEffect, useState } from 'react';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import * as THREE from 'three';

const useEnvironment = (path = '/assets/videos/kobe.mp4', options = {}) => {
  const [envMap, setEnvMap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loader = new RGBELoader();
    
    setLoading(true);
    setError(null);
    
    loader.load(
      path,
      (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        setEnvMap(texture);
        setLoading(false);
      },
      undefined,
      (err) => {
        console.warn(`Could not load environment map: ${path}`, err);
        setError(err);
        setLoading(false);
        
        // Create a fallback environment map
        if (options.fallback) {
          const fallbackColor = options.fallbackColor || '#111111';
          const fallbackCubeMap = createFallbackCubeMap(fallbackColor);
          setEnvMap(fallbackCubeMap);
        }
      }
    );
    
    return () => {
      // Cleanup
      if (envMap) {
        envMap.dispose();
      }
    };
  }, [path, options.fallback, options.fallbackColor]);
  
  // Helper function to create a simple fallback environment map
  const createFallbackCubeMap = (color) => {
    const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(128);
    const cubeCamera = new THREE.CubeCamera(0.1, 1000, cubeRenderTarget);
    
    // Create a simple scene with a colored background
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(color);
    
    // Render the cube map
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(128, 128);
    cubeCamera.update(renderer, scene);
    
    return cubeRenderTarget.texture;
  };
  
  return { envMap, loading, error };
};

export default useEnvironment;