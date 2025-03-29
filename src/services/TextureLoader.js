import * as THREE from 'three';

class TextureLoaderService {
  constructor() {
    this.manager = new THREE.LoadingManager();
    
    // Configure the manager
    this.manager.onError = (url) => {
      console.error(`Error loading resource: ${url}`);
    };
    
    // Create texture loader with proper cross-origin settings
    this.textureLoader = new THREE.TextureLoader(this.manager);
    this.textureLoader.crossOrigin = 'anonymous';
    
    // Cache for loaded textures
    this.textureCache = new Map();
  }
  
  loadTexture(url) {
    // Return cached texture if available
    if (this.textureCache.has(url)) {
      return Promise.resolve(this.textureCache.get(url));
    }
    
    return new Promise((resolve, reject) => {
      if (!url) {
        reject(new Error('Invalid texture URL'));
        return;
      }
      
      try {
        // Explicitly set crossOrigin before loading
        this.textureLoader.crossOrigin = 'anonymous';
        
        this.textureLoader.load(
          url,
          (texture) => {
            // Cache the texture
            this.textureCache.set(url, texture);
            resolve(texture);
          },
          undefined, // onProgress is optional
          (error) => {
            console.error(`Failed to load texture: ${url}`, error);
            reject(error);
          }
        );
      } catch (err) {
        console.error(`Error creating texture loader for: ${url}`, err);
        reject(err);
      }
    });
  }
  
  preloadTextures(urls) {
    return new Promise((resolve) => {
      if (!urls || urls.length === 0) {
        resolve([]);
        return;
      }
      
      const validUrls = urls.filter(url => !!url);
      const promises = validUrls.map(url => 
        this.loadTexture(url).catch(err => {
          console.warn(`Failed to load texture ${url}:`, err);
          return null; // Return null for failed textures
        })
      );
      
      // Use Promise.allSettled to handle both successful and failed texture loads
      Promise.allSettled(promises).then(results => {
        const loadedTextures = results
          .filter(result => result.status === 'fulfilled' && result.value)
          .map(result => result.value);
        
        resolve(loadedTextures);
      });
    });
  }
  
  // Create a fallback texture when loading fails
  createFallbackTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#444444';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add error pattern
    ctx.strokeStyle = '#ff0000';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(128, 128);
    ctx.moveTo(128, 0);
    ctx.lineTo(0, 128);
    ctx.stroke();
    
    return new THREE.CanvasTexture(canvas);
  }
}

const textureLoader = new TextureLoaderService();
export default textureLoader;