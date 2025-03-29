// src/services/analytics.js

/**
 * Analytics Service
 * 
 * Handles tracking user behavior, events, and conversions.
 * In production, this would integrate with services like Google Analytics,
 * Mixpanel, Amplitude, etc., but for now we'll implement a simple mock.
 */

// Mock analytics storage
const analyticsEvents = [];
const sessionStartTime = new Date();
let userId = null;
let hasInitialized = false;

// Generate a unique session ID
const sessionId = 'sess_' + Math.random().toString(36).substring(2, 15);

/**
 * Initialize analytics service
 * 
 * @param {Object} options Configuration options
 * @returns {boolean} Success status
 */
export const initAnalytics = (options = {}) => {
  if (hasInitialized) {
    console.warn('Analytics already initialized');
    return false;
  }
  
  // Log initialization
  console.log('Analytics initialized with session ID:', sessionId);
  
  // Track page view on initialization
  trackPageView(window.location.pathname);
  
  // Set up user ID if available
  if (options.userId) {
    identifyUser(options.userId);
  }
  
  hasInitialized = true;
  return true;
};

/**
 * Identify authenticated user
 * 
 * @param {string} newUserId User identifier
 */
export const identifyUser = (newUserId) => {
  // Don't update if same ID
  if (userId === newUserId) return;
  
  // Store user ID
  userId = newUserId;
  
  // Track user identification
  trackEvent('user_identified', { 
    userId, 
    isAuthenticated: true 
  });
};

/**
 * Clear user identification (on logout)
 */
export const clearUserIdentity = () => {
  if (!userId) return;
  
  trackEvent('user_logged_out', { 
    previousUserId: userId 
  });
  
  userId = null;
};

/**
 * Track page view
 * 
 * @param {string} pagePath Page path
 * @param {Object} pageProps Additional page properties
 */
export const trackPageView = (pagePath, pageProps = {}) => {
  const event = {
    type: 'page_view',
    pagePath,
    timestamp: new Date().toISOString(),
    sessionId,
    userId: userId || 'anonymous',
    ...pageProps
  };
  
  // Log event
  analyticsEvents.push(event);
  
  // Log to console in development
  if (process.env.NODE_ENV !== 'production') {
    console.log('Analytics [Page View]:', pagePath);
  }
  
  // In production: send to analytics service
  // analyticsProvider.trackPageView(pagePath, pageProps);
};

/**
 * Track event
 * 
 * @param {string} eventName Name of the event
 * @param {Object} eventProps Event properties
 */
export const trackEvent = (eventName, eventProps = {}) => {
  const event = {
    type: 'event',
    eventName,
    timestamp: new Date().toISOString(),
    sessionId,
    userId: userId || 'anonymous',
    ...eventProps
  };
  
  // Log event
  analyticsEvents.push(event);
  
  // Log to console in development
  if (process.env.NODE_ENV !== 'production') {
    console.log('Analytics [Event]:', eventName, eventProps);
  }
  
  // In production: send to analytics service
  // analyticsProvider.trackEvent(eventName, eventProps);
};

/**
 * Track e-commerce events
 * 
 * @param {string} action E-commerce action (view_item, add_to_cart, purchase, etc.)
 * @param {Object} itemData Item data
 */
export const trackEcommerce = (action, itemData) => {
  const event = {
    type: 'ecommerce',
    action,
    timestamp: new Date().toISOString(),
    sessionId,
    userId: userId || 'anonymous',
    ...itemData
  };
  
  // Log event
  analyticsEvents.push(event);
  
  // Log to console in development
  if (process.env.NODE_ENV !== 'production') {
    console.log('Analytics [E-commerce]:', action, itemData);
  }
  
  // In production: send to analytics service
  // analyticsProvider.trackEcommerce(action, itemData);
};

/**
 * Track add to cart action
 * 
 * @param {Object} artwork Artwork data
 */
export const trackAddToCart = (artwork) => {
  trackEvent('add_to_cart', {
    artworkId: artwork.id,
    title: artwork.title,
    price: artwork.price,
    artist: artwork.artist
  });
  
  trackEcommerce('add_to_cart', {
    itemId: artwork.id,
    itemName: artwork.title, 
    price: artwork.price,
    currency: artwork.currency || 'USD',
    category: artwork.categories ? artwork.categories[0] : 'art',
    artist: artwork.artist
  });
};

/**
 * Track begin checkout action
 * 
 * @param {Array} items Cart items
 * @param {number} total Cart total
 */
export const trackBeginCheckout = (items, total) => {
  trackEvent('begin_checkout', {
    items: items.length,
    total
  });
  
  trackEcommerce('begin_checkout', {
    items: items.map(item => ({
      itemId: item.id,
      itemName: item.title,
      price: item.price,
      currency: item.currency || 'USD',
      artist: item.artist
    })),
    total
  });
};

/**
 * Track purchase completion
 * 
 * @param {string} transactionId Transaction identifier
 * @param {Array} items Purchased items
 * @param {number} total Purchase total
 * @param {Object} details Additional transaction details
 */
export const trackPurchase = (transactionId, items, total, details = {}) => {
  trackEvent('purchase', {
    transactionId,
    items: items.length,
    total,
    ...details
  });
  
  trackEcommerce('purchase', {
    transactionId,
    items: items.map(item => ({
      itemId: item.id,
      itemName: item.title,
      price: item.price,
      currency: item.currency || 'USD',
      artist: item.artist
    })),
    total,
    tax: details.tax || 0,
    shipping: details.shipping || 0,
    currency: details.currency || 'USD'
  });
};

/**
 * Track search action
 * 
 * @param {string} query Search query
 * @param {number} resultCount Number of results
 * @param {Array} filters Applied filters
 */
export const trackSearch = (query, resultCount, filters = {}) => {
  trackEvent('search', {
    query,
    resultCount,
    filters
  });
};

/**
 * Track user engagement time
 * Called before page unload
 */
export const trackEngagementTime = () => {
  const engagementTime = (new Date() - sessionStartTime) / 1000; // in seconds
  
  trackEvent('session_end', {
    engagementTime,
    engagementTimeFormatted: formatTime(engagementTime)
  });
};

/**
 * Format seconds into human-readable time
 * 
 * @param {number} seconds Time in seconds
 * @returns {string} Formatted time
 */
const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);
  
  if (minutes === 0) {
    return `${remainingSeconds}s`;
  }
  
  return `${minutes}m ${remainingSeconds}s`;
};

/**
 * Get session analytics data
 * For debugging and development
 * 
 * @returns {Object} Session analytics data
 */
export const getAnalyticsData = () => {
  return {
    sessionId,
    userId,
    sessionStart: sessionStartTime,
    eventCount: analyticsEvents.length,
    events: analyticsEvents
  };
};

/**
 * Track gallery interactions
 * 
 * @param {string} galleryId Gallery identifier
 * @param {string} interactionType Type of interaction
 * @param {Object} details Additional details
 */
export const trackGalleryInteraction = (galleryId, interactionType, details = {}) => {
  trackEvent('gallery_interaction', {
    galleryId,
    interactionType,
    ...details
  });
};

/**
 * Track artwork interactions
 * 
 * @param {string} artworkId Artwork identifier
 * @param {string} interactionType Type of interaction
 * @param {Object} details Additional details
 */
export const trackArtworkInteraction = (artworkId, interactionType, details = {}) => {
  trackEvent('artwork_interaction', {
    artworkId,
    interactionType,
    ...details
  });
};

/**
 * Track view of artwork details
 * 
 * @param {Object} artwork Artwork data
 */
export const trackArtworkView = (artwork) => {
  // Track as both an event and e-commerce item view
  trackEvent('artwork_view', {
    artworkId: artwork.id,
    title: artwork.title,
    artist: artwork.artist,
    price: artwork.price,
    categories: artwork.categories
  });
  
  // Track as e-commerce view
  if (artwork.forSale) {
    trackEcommerce('view_item', {
      itemId: artwork.id,
      itemName: artwork.title, 
      price: artwork.price,
      currency: artwork.currency || 'USD',
      category: artwork.categories ? artwork.categories[0] : 'art',
      artist: artwork.artist
    });
  }
};

// Set up session tracking
if (typeof window !== 'undefined') {
  // Track engagement time when page is unloaded
  window.addEventListener('beforeunload', () => {
    trackEngagementTime();
  });
}

// Create analytics service object
const analyticsService = {
  initAnalytics,
  identifyUser,
  clearUserIdentity,
  trackPageView,
  trackEvent,
  trackEcommerce,
  trackGalleryInteraction,
  trackArtworkInteraction,
  trackArtworkView,
  trackAddToCart,
  trackBeginCheckout,
  trackPurchase,
  trackSearch,
  getAnalyticsData
};

export default analyticsService;