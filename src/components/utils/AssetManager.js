// src/components/utils/AssetManager.js
import * as THREE from 'three';

/**
 * AssetManager utility for managing textures and other assets
 * Handles loading, caching, error handling, and fallbacks
 */
class AssetManagerClass {
  constructor() {
    // Create registry of assets
    this.assetRegistry = {
      // List of available images for textures
      availableImages: [
        'img1.jpg', 'img2.jpg', 'img3.jpg', 'img4.jpg', 'img5.jpg',
        'img6.jpg', 'img7.jpg', 'img8.jpg', 'img9.jpg', 'img10.jpg',
        'img11.jpg', 'img12.jpg', 'img13.jpg', 'img14.jpg', 'img15.jpg',
        'img16.jpg', 'img17.jpg', 'img18.jpg', 'img19.jpg', 'img20.jpg',
        'img21.jpg'
      ],
      
      // Storage for preloaded textures
      loadedTextures: {},
      
      // Fallback textures for when loading fails
      fallbackTextures: {}
    };
    
    // Create texture loader
    this.textureLoader = new THREE.TextureLoader();
    
    // Initialize
    this.initialize();
  }
  
  /**
   * Initialize the asset manager
   */
  initialize() {
    // Configure texture loader
    this.textureLoader.setCrossOrigin('anonymous');
    
    // Set up preloading options
    this.preloadOptions = {
      enabled: true, // Whether preloading is enabled
      batch: 5, // Number of textures to load at once
      delay: 100 // Delay between batches
    };
    
    console.log('AssetManager initialized');
  }
  
  /**
   * Create a fallback texture with specified properties
   * 
   * @param {string} name - Filename or identifier
   * @param {string} color - Background color
   * @returns {THREE.Texture} Fallback texture
   */
  createFallbackTexture(name, color = '#4444aa') {
    console.log(`Creating fallback texture for: ${name}`);
    
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    
    // Fill with color
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add a pattern to make it clear it's a fallback
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.moveTo(canvas.width, 0);
    ctx.lineTo(0, canvas.height);
    ctx.stroke();
    
    // Add filename text
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'white';
    ctx.fillText(`Missing: ${name}`, canvas.width/2, canvas.height/2 - 12);
    ctx.font = '18px Arial';
    ctx.fillText('Image Not Found', canvas.width/2, canvas.height/2 + 20);
    
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }
  
  /**
   * Get a texture, either from cache or creating a fallback
   * 
   * @param {string} filename - Texture filename
   * @returns {THREE.Texture} Texture
   */
  getSafeTexture(filename) {
    // Check if we already have this texture
    if (this.assetRegistry.loadedTextures[filename]) {
      return this.assetRegistry.loadedTextures[filename];
    }
    
    // Check if we have a fallback for this file
    if (this.assetRegistry.fallbackTextures[filename]) {
      return this.assetRegistry.fallbackTextures[filename];
    }
    
    // Create a new fallback
    const colors = ['#4444aa', '#aa4444', '#44aa44', '#aaaa44'];
    const colorIndex = filename.length % colors.length;
    const fallback = this.createFallbackTexture(filename, colors[colorIndex]);
    this.assetRegistry.fallbackTextures[filename] = fallback;
    
    return fallback;
  }
  
  /**
   * Preload all available textures
   * 
   * @param {Function} callback - Callback when complete
   */
  preloadTextures(callback) {
    if (!this.preloadOptions.enabled) {
      if (callback) callback(true);
      return;
    }
    
    const images = this.assetRegistry.availableImages;
    let loadedCount = 0;
    const totalToLoad = images.length;
    let hasErrors = false;
    
    console.log(`Preloading ${totalToLoad} textures...`);
    
    // Helper function to load a batch of textures
    const loadBatch = (startIndex) => {
      // Check if we're done
      if (startIndex >= totalToLoad) {
        console.log(`Texture preloading complete. Loaded: ${loadedCount}, Failed: ${totalToLoad - loadedCount}`);
        if (callback) callback(!hasErrors);
        return;
      }
      
      // Determine batch size
      const endIndex = Math.min(startIndex + this.preloadOptions.batch, totalToLoad);
      const batchSize = endIndex - startIndex;
      
      // Load current batch
      console.log(`Loading texture batch ${startIndex} to ${endIndex-1}`);
      
      // Counter for completed loads in this batch
      let batchCompleted = 0;
      
      for (let i = startIndex; i < endIndex; i++) {
        const filename = images[i];
        const url = `/assets/imgs/${filename}`;
        
        this.textureLoader.load(
          // URL
          url,
          
          // Success
          (texture) => {
            this.assetRegistry.loadedTextures[filename] = texture;
            loadedCount++;
            batchCompleted++;
            
            // Check if batch is complete
            if (batchCompleted === batchSize) {
              // Schedule next batch
              setTimeout(() => loadBatch(endIndex), this.preloadOptions.delay);
            }
          },
          
          // Progress
          undefined,
          
          // Error
          (error) => {
            console.warn(`Failed to preload texture ${filename}:`, error);
            hasErrors = true;
            
            // Create a fallback
            const fallback = this.createFallbackTexture(filename);
            this.assetRegistry.fallbackTextures[filename] = fallback;
            
            batchCompleted++;
            
            // Check if batch is complete
            if (batchCompleted === batchSize) {
              // Schedule next batch
              setTimeout(() => loadBatch(endIndex), this.preloadOptions.delay);
            }
          }
        );
      }
    };
    
    // Start loading first batch
    loadBatch(0);
  }
  
  /**
   * Get sample textures for a gallery
   * 
   * @param {number} count - Number of textures to get
   * @returns {Array<THREE.Texture>} Array of textures
   */
  getSampleTexturesForGallery(count = 8) {
    const textures = [];
    const availableCount = Math.min(count, this.assetRegistry.availableImages.length);
    
    // Use available images
    for (let i = 0; i < availableCount; i++) {
      const filename = this.assetRegistry.availableImages[i];
      textures.push(this.getSafeTexture(filename));
    }
    
    // Add fallbacks if needed
    if (count > availableCount) {
      for (let i = availableCount; i < count; i++) {
        const placeholderName = `placeholder-${i+1}.jpg`;
        
        // Create a unique fallback for each position
        if (!this.assetRegistry.fallbackTextures[placeholderName]) {
          const colors = ['#4444aa', '#aa4444', '#44aa44', '#aaaa44'];
          const fallback = this.createFallbackTexture(
            placeholderName, 
            colors[i % colors.length]
          );
          this.assetRegistry.fallbackTextures[placeholderName] = fallback;
        }
        
        textures.push(this.assetRegistry.fallbackTextures[placeholderName]);
      }
    }
    
    return textures;
  }
  
  /**
   * Cleanup all loaded textures
   */
  cleanupTextures() {
    // Dispose loaded textures
    Object.values(this.assetRegistry.loadedTextures).forEach(texture => {
      if (texture && texture.dispose) texture.dispose();
    });
    
    // Dispose fallback textures
    Object.values(this.assetRegistry.fallbackTextures).forEach(texture => {
      if (texture && texture.dispose) texture.dispose();
    });
    
    // Clear the registry
    this.assetRegistry.loadedTextures = {};
    this.assetRegistry.fallbackTextures = {};
    
    console.log('All textures disposed');
  }
}

// Create singleton instance
export const AssetManager = new AssetManagerClass();

export default AssetManager;