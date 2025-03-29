// src/services/seo.js

/**
 * SEO Service - Handles dynamic SEO optimization for the space gallery
 * Manages metadata, structured data, and optimization techniques
 */

/**
 * Sets dynamic page title and meta tags
 * 
 * @param {Object} options - SEO options
 * @param {string} options.title - Page title
 * @param {string} options.description - Meta description
 * @param {string} options.route - Current route
 * @param {string} options.imageUrl - Open Graph image URL
 * @param {Object} options.artwork - Current artwork for detailed pages
 */
export const updateMetaTags = ({ 
    title = 'Space Gallery | 3D Virtual Art Experience',
    description = 'Explore a 3D virtual art gallery in space. View and purchase artwork in an immersive environment.',
    route = '/',
    imageUrl = '/images/og-default.jpg',
    artwork = null
  }) => {
    // Update page title
    document.title = title;
    
    // Base URL for canonical link and OG URLs
    const baseUrl = process.env.REACT_APP_BASE_URL || 'https://spacegallery.app';
    const canonicalUrl = `${baseUrl}${route}`;
    
    // Set or create meta tags
    updateOrCreateMetaTag('description', description);
    updateOrCreateMetaTag('canonical', canonicalUrl, 'link', 'href');
    
    // Open Graph meta tags
    updateOrCreateMetaTag('og:title', title, 'meta', 'property');
    updateOrCreateMetaTag('og:description', description, 'meta', 'property');
    updateOrCreateMetaTag('og:url', canonicalUrl, 'meta', 'property');
    updateOrCreateMetaTag('og:image', imageUrl, 'meta', 'property');
    updateOrCreateMetaTag('og:type', route === '/' ? 'website' : 'article', 'meta', 'property');
    
    // Twitter Card meta tags
    updateOrCreateMetaTag('twitter:card', 'summary_large_image', 'meta', 'name');
    updateOrCreateMetaTag('twitter:title', title, 'meta', 'name');
    updateOrCreateMetaTag('twitter:description', description, 'meta', 'name');
    updateOrCreateMetaTag('twitter:image', imageUrl, 'meta', 'name');
    
    // Add structured data for artworks
    if (artwork) {
      addArtworkStructuredData(artwork);
    } else {
      removeStructuredData();
    }
    
    // Call performance-related optimization functions
    optimizeForLCP();
  };
  
  /**
   * Helper function to update or create meta tags
   * 
   * @param {string} name - Meta tag name or property
   * @param {string} content - Content value
   * @param {string} tagName - HTML tag name (default: 'meta')
   * @param {string} attributeName - HTML attribute name (default: 'name')
   */
  const updateOrCreateMetaTag = (name, content, tagName = 'meta', attributeName = 'name') => {
    // Search for existing tag
    let element;
    if (tagName === 'meta') {
      element = document.querySelector(`meta[${attributeName}="${name}"]`);
    } else if (tagName === 'link' && attributeName === 'rel') {
      element = document.querySelector(`link[${attributeName}="${name}"]`);
    } else if (tagName === 'link' && name === 'canonical') {
      element = document.querySelector('link[rel="canonical"]');
    }
    
    // Create if it doesn't exist
    if (!element) {
      element = document.createElement(tagName);
      element.setAttribute(attributeName, name);
      document.head.appendChild(element);
    }
    
    // Update content or href
    if (tagName === 'meta') {
      element.setAttribute('content', content);
    } else if (tagName === 'link') {
      element.setAttribute('href', content);
      if (name === 'canonical') {
        element.setAttribute('rel', 'canonical');
      }
    }
  };
  
  /**
   * Add structured data for artwork
   * 
   * @param {Object} artwork - Artwork data object
   */
  const addArtworkStructuredData = (artwork) => {
    // Remove any existing structured data
    removeStructuredData();
    
    // Create structured data for Visual Artwork
    const structuredData = {
      '@context': 'https://schema.org/',
      '@type': 'VisualArtwork',
      'name': artwork.title,
      'artist': {
        '@type': 'Person',
        'name': artwork.artist
      },
      'description': artwork.description,
      'artform': artwork.medium || 'Digital Art',
      'artMedium': artwork.medium || 'Digital',
      'dateCreated': artwork.year || new Date().getFullYear().toString(),
      'image': artwork.imageUrl,
      'offers': {
        '@type': 'Offer',
        'price': artwork.price.toString(),
        'priceCurrency': 'USD',
        'availability': artwork.forSale ? 'https://schema.org/InStock' : 'https://schema.org/SoldOut'
      }
    };
    
    // Add structured data to page
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'artwork-structured-data';
    script.innerHTML = JSON.stringify(structuredData);
    document.head.appendChild(script);
  };
  
  /**
   * Remove structured data from the page
   */
  const removeStructuredData = () => {
    const existingScript = document.getElementById('artwork-structured-data');
    if (existingScript) {
      existingScript.remove();
    }
  };
  
  /**
   * Optimize for Largest Contentful Paint (LCP)
   * Sets resource priorities for key visual elements
   */
  const optimizeForLCP = () => {
    // Find all important images and set fetchpriority
    document.querySelectorAll('img.featured-artwork').forEach(img => {
      img.setAttribute('fetchpriority', 'high');
      img.setAttribute('loading', 'eager');
    });
    
    // Set preload for important resources
    updateOrCreatePreload('/models/gallery-environment.glb', 'fetch', 'model/gltf-binary');
    updateOrCreatePreload('/fonts/space-gallery-font.woff2', 'font', 'font/woff2');
  };
  
  /**
   * Create or update preload link
   * 
   * @param {string} href - Resource URL
   * @param {string} as - Resource type
   * @param {string} type - MIME type
   */
  const updateOrCreatePreload = (href, as, type) => {
    let preload = document.querySelector(`link[rel="preload"][href="${href}"]`);
    
    if (!preload) {
      preload = document.createElement('link');
      preload.rel = 'preload';
      preload.href = href;
      preload.as = as;
      
      if (type) {
        preload.type = type;
      }
      
      if (as === 'font') {
        preload.setAttribute('crossorigin', 'anonymous');
      }
      
      document.head.appendChild(preload);
    }
  };
  
  /**
   * Track page views for analytics
   * 
   * @param {string} page - Page path
   */
  export const trackPageView = (page) => {
    // Check if analytics is initialized
    if (window.gtag) {
      window.gtag('config', process.env.REACT_APP_GA_TRACKING_ID, {
        page_path: page
      });
    }
    
    // Check for custom analytics
    if (window.spaceGalleryAnalytics && typeof window.spaceGalleryAnalytics.trackPageView === 'function') {
      window.spaceGalleryAnalytics.trackPageView(page);
    }
    
    // Log page view
    console.log(`Page view tracked: ${page}`);
  };
  
  /**
   * Track artwork view for analytics
   * 
   * @param {Object} artwork - Artwork data
   */
  export const trackArtworkView = (artwork) => {
    // Check if analytics is initialized
    if (window.gtag) {
      window.gtag('event', 'view_item', {
        items: [{
          id: artwork.id,
          name: artwork.title,
          category: artwork.category || 'artwork',
          price: artwork.price,
          artist: artwork.artist
        }]
      });
    }
    
    // Check for custom analytics
    if (window.spaceGalleryAnalytics && typeof window.spaceGalleryAnalytics.trackArtworkView === 'function') {
      window.spaceGalleryAnalytics.trackArtworkView(artwork);
    }
    
    // Log artwork view
    console.log(`Artwork viewed: ${artwork.title} by ${artwork.artist}`);
  };
  
  // Export default object with all functions
  const seoServices = {
    updateMetaTags,
    trackPageView,
    trackArtworkView
  };

  export default seoServices;