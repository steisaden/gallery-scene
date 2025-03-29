// src/services/LoadingManager.js
import * as THREE from 'three';

/**
 * LoadingManager for efficient texture and asset loading
 * 
 * This service manages the loading of textures and other assets,
 * providing progress tracking, caching, and error handling.
 */
class LoadingManager {
  constructor() {
    // Create THREE.js LoadingManager
    this.manager = new THREE.LoadingManager();
    
    // Initialize loaders
    this.textureLoader = new THREE.TextureLoader(this.manager);
    
    // Asset tracking and caching
    this.textureCache = new Map();
    this.loadingQueue = new Set();
    this.loadingPromises = new Map();
    
    // Loading statistics
    this.stats = {
      totalItems: 0,
      loadedItems: 0,
      failedItems: 0,
      cachedItems: 0
    };
    
    // Progress callbacks
    this.progressCallbacks = [];
    this.completeCallbacks = [];
    
    // Configure manager event handlers
    this._configureManager();
  }
  
  /**
   * Configure the THREE.js LoadingManager event handlers
   * 
   * @private
   */
  _configureManager() {
    // Start handler
    this.manager.onStart = (url, itemsLoaded, itemsTotal) => {
      this.stats.totalItems = itemsTotal;
      this._notifyProgress({
        url,
        loaded: itemsLoaded,
        total: itemsTotal,
        progress: 0
      });
      
      if (process.env.NODE_ENV !== 'production') {
        console.log(`Loading started: ${url}, items: ${itemsLoaded}/${itemsTotal}`);
      }
    };
    
    // Progress handler
    this.manager.onProgress = (url, itemsLoaded, itemsTotal) => {
      this.stats.loadedItems = itemsLoaded;
      this.stats.totalItems = itemsTotal;
      
      const progress = itemsTotal > 0 ? itemsLoaded / itemsTotal : 0;
      
      this._notifyProgress({
        url,
        loaded: itemsLoaded,
        total: itemsTotal,
        progress
      });
    };
    
    // Load error handler
    this.manager.onError = (url) => {
      this.stats.failedItems++;
      
      if (process.env.NODE_ENV !== 'production') {
        console.error(`Error loading: ${url}`);
      }
      
      // Notify progress with error
      this._notifyProgress({
        url,
        error: true,
        errorMessage: `Failed to load: ${url}`,
        loaded: this.stats.loadedItems,
        total: this.stats.totalItems,
        progress: this.stats.totalItems > 0 ? 
          this.stats.loadedItems / this.stats.totalItems : 0
      });
      
      // Remove from loading queue
      this.loadingQueue.delete(url);
      
      // Reject the specific loading promise
      if (this.loadingPromises.has(url)) {
        this.loadingPromises.get(url).reject(new Error(`Failed to load: ${url}`));
        this.loadingPromises.delete(url);
      }
    };
    
    // Load completion handler
    this.manager.onLoad = () => {
      if (process.env.NODE_ENV !== 'production') {
        console.log(`Loading complete. Loaded: ${this.stats.loadedItems}, Failed: ${this.stats.failedItems}, Cached: ${this.stats.cachedItems}`);
      }
      
      // Notify complete
      this._notifyComplete({
        success: this.stats.failedItems === 0,
        stats: { ...this.stats }
      });
    };
  }
  
  /**
   * Notify progress callbacks
   * 
   * @private
   * @param {Object} progressData Progress information
   */
  _notifyProgress(progressData) {
    this.progressCallbacks.forEach(callback => {
      try {
        callback(progressData);
      } catch (error) {
        console.error('Error in progress callback:', error);
      }
    });
  }
  
  /**
   * Notify complete callbacks
   * 
   * @private
   * @param {Object} completeData Completion information
   */
  _notifyComplete(completeData) {
    this.completeCallbacks.forEach(callback => {
      try {
        callback(completeData);
      } catch (error) {
        console.error('Error in complete callback:', error);
      }
    });
  }
  
  /**
   * Register progress callback
   * 
   * @param {Function} callback Progress callback function
   * @returns {Function} Unsubscribe function
   */
  onProgress(callback) {
    this.progressCallbacks.push(callback);
    
    // Return unsubscribe function
    return () => {
      this.progressCallbacks = this.progressCallbacks.filter(cb => cb !== callback);
    };
  }
  
  /**
   * Register complete callback
   * 
   * @param {Function} callback Complete callback function
   * @returns {Function} Unsubscribe function
   */
  onComplete(callback) {
    this.completeCallbacks.push(callback);
    
    // Return unsubscribe function
    return () => {
      this.completeCallbacks = this.completeCallbacks.filter(cb => cb !== callback);
    };
  }
  
  /**
   * Load texture with caching
   * 
   * @param {string} url Texture URL
   * @param {Object} options Loading options
   * @returns {Promise<THREE.Texture>} Loaded texture
   */
  loadTexture(url, options = {}) {
    // Return cached texture if available
    if (this.textureCache.has(url)) {
      this.stats.cachedItems++;
      return Promise.resolve(this.textureCache.get(url));
    }
    
    // Add to loading queue if not already loading
    if (!this.loadingQueue.has(url)) {
      this.loadingQueue.add(url);
      
      // Create promise for this specific load
      const promise = new Promise((resolve, reject) => {
        this.loadingPromises.set(url, { resolve, reject });
        
        // Configure texture loader
        this.textureLoader.setCrossOrigin(options.crossOrigin || 'anonymous');
        
        // Load the texture
        this.textureLoader.load(
          // URL
          url,
          
          // onLoad callback
          (texture) => {
            // Apply texture options
            if (options.flipY !== undefined) {
              texture.flipY = options.flipY;
            }
            
            if (options.encoding) {
              texture.encoding = options.encoding;
            } else {
              // Default to sRGB encoding for most images
              texture.encoding = THREE.sRGBEncoding;
            }
            
            if (options.wrapS) {
              texture.wrapS = options.wrapS;
            }
            
            if (options.wrapT) {
              texture.wrapT = options.wrapT;
            }
            
            // Cache the texture
            this.textureCache.set(url, texture);
            
            // Remove from loading queue
            this.loadingQueue.delete(url);
            
            // Resolve the promise
            resolve(texture);
            
            // Remove from loading promises
            this.loadingPromises.delete(url);
          },
          
          // onProgress callback - handled by manager
          undefined,
          
          // onError callback - handled by manager
          (error) => {
            // Additional error handling if needed
            if (options.onError) {
              options.onError(error);
            }
          }
        );
      });
      
      return promise;
    }
    
    // Already loading this texture, return existing promise
    return new Promise((resolve, reject) => {
      // Check periodically if texture is loaded
      const checkInterval = setInterval(() => {
        if (this.textureCache.has(url)) {
          clearInterval(checkInterval);
          resolve(this.textureCache.get(url));
        } else if (!this.loadingQueue.has(url)) {
          // Loading failed
          clearInterval(checkInterval);
          reject(new Error(`Failed to load texture: ${url}`));
        }
      }, 100);
    });
  }
  
  /**
   * Preload multiple textures
   * 
   * @param {Array<string>} urls Texture URLs to preload
   * @param {Object} options Loading options
   * @returns {Promise<Array<THREE.Texture>>} Loaded textures
   */
  preloadTextures(urls, options = {}) {
    if (!urls || urls.length === 0) {
      return Promise.resolve([]);
    }
    
    // Filter out any null or undefined URLs
    const validUrls = urls.filter(url => url);
    
    // Create loading promises for all textures
    const loadingPromises = validUrls.map(url => this.loadTexture(url, options));
    
    // Return promise that resolves when all textures are loaded
    return Promise.allSettled(loadingPromises).then(results => {
      // Filter for fulfilled promises only
      return results
        .filter(result => result.status === 'fulfilled')
        .map(result => result.value);
    });
  }
  
  /**
   * Get texture from cache
   * 
   * @param {string} url Texture URL
   * @returns {THREE.Texture|null} Cached texture or null
   */
  getCachedTexture(url) {
    return this.textureCache.get(url) || null;
  }
  
  /**
   * Check if texture is cached
   * 
   * @param {string} url Texture URL
   * @returns {boolean} True if texture is cached
   */
  isTextureCached(url) {
    return this.textureCache.has(url);
  }
  
  /**
   * Dispose a specific texture and remove from cache
   * 
   * @param {string} url Texture URL
   */
  disposeTexture(url) {
    if (this.textureCache.has(url)) {
      const texture = this.textureCache.get(url);
      texture.dispose();
      this.textureCache.delete(url);
    }
  }
  
  /**
   * Dispose all cached textures
   */
  disposeAllTextures() {
    this.textureCache.forEach(texture => {
      texture.dispose();
    });
    
    this.textureCache.clear();
  }
  
  /**
   * Get loading statistics
   * 
   * @returns {Object} Loading statistics
   */
  getStats() {
    return { ...this.stats };
  }
  
  /**
   * Create a fallback texture for when loading fails
   * 
   * @param {string} url Failed texture URL
   * @param {string} color Fallback color
   * @returns {THREE.Texture} Fallback texture
   */
  createFallbackTexture(url, color = '#444444') {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    // Background
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Error indicator
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(128, 128);
    ctx.lineTo(384, 384);
    ctx.moveTo(384, 128);
    ctx.lineTo(128, 384);
    ctx.stroke();
    
    // Error text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Texture Error', canvas.width / 2, canvas.height / 2 - 16);
    
    // Filename text
    const filename = url.split('/').pop();
    ctx.font = '24px Arial';
    ctx.fillText(filename, canvas.width / 2, canvas.height / 2 + 32);
    
    // Create and return texture
    const fallbackTexture = new THREE.CanvasTexture(canvas);
    this.textureCache.set(url, fallbackTexture);
    
    return fallbackTexture;
  }
}

// Create and export singleton instance
const loadingManager = new LoadingManager();
export default loadingManager;