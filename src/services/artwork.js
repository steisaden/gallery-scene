// src/services/artwork.js

/**
 * Artwork Service
 * 
 * Handles artwork data fetching, filtering, and management.
 * In a production environment, this would connect to a backend API.
 */

// Sample artwork data
const mockArtworks = [
    {
      id: "art1",
      title: "Cosmic Exploration",
      artist: "Alexandra Chen",
      description: "A vibrant abstract representation of space exploration, featuring nebulae and celestial bodies in rich blues and purples. This piece explores the relationship between human curiosity and the vast unknown of space, inviting viewers to contemplate their place in the universe.",
      year: "2023",
      medium: "Digital painting on canvas",
      dimensions: "24 × 36 inches",
      price: 1200,
      currency: "USD",
      forSale: true,
      limited: true,
      edition: "2/10",
      categories: ["abstract", "space", "digital"],
      tags: ["cosmic", "exploration", "nebula", "space"],
      imageUrl: "/assets/imgs/img1.jpg",
      artistBio: "Alexandra Chen is a digital artist known for her cosmic-themed works that blend science and art. Her background in astrophysics informs her artistic practice, creating scientifically accurate yet emotionally evocative depictions of space.",
      exhibitionHistory: ["Future Visions 2023", "Digital Horizons 2022"],
      reviews: [
        {
          author: "Art Today Magazine",
          text: "Chen's work transcends traditional space art, bringing emotional depth to scientific accuracy.",
          rating: 4.5
        }
      ]
    },
    // More artwork entries would follow...
  ];
  
  /**
   * Get all artworks
   * 
   * @returns {Promise<Array>} List of all artworks
   */
  export const getAllArtworks = async () => {
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return [...mockArtworks];
  };
  
  /**
   * Get artwork by ID
   * 
   * @param {string} id Artwork ID
   * @returns {Promise<Object>} Artwork details
   */
  export const getArtworkById = async (id) => {
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const artwork = mockArtworks.find(art => art.id === id);
    
    if (!artwork) {
      throw new Error('Artwork not found');
    }
    
    return { ...artwork };
  };
  
  /**
   * Search artworks by criteria
   * 
   * @param {Object} criteria Search criteria
   * @returns {Promise<Array>} List of matching artworks
   */
  export const searchArtworks = async (criteria = {}) => {
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    let results = [...mockArtworks];
    
    // Filter by title or description
    if (criteria.query) {
      const query = criteria.query.toLowerCase();
      results = results.filter(artwork => 
        artwork.title.toLowerCase().includes(query) ||
        artwork.description.toLowerCase().includes(query) ||
        artwork.artist.toLowerCase().includes(query)
      );
    }
    
    // Filter by artist
    if (criteria.artist) {
      results = results.filter(artwork => 
        artwork.artist.toLowerCase() === criteria.artist.toLowerCase()
      );
    }
    
    // Filter by category
    if (criteria.category) {
      results = results.filter(artwork => 
        artwork.categories.includes(criteria.category)
      );
    }
    
    // Filter by price range
    if (criteria.minPrice !== undefined) {
      results = results.filter(artwork => artwork.price >= criteria.minPrice);
    }
    
    if (criteria.maxPrice !== undefined) {
      results = results.filter(artwork => artwork.price <= criteria.maxPrice);
    }
    
    // Filter by available for sale
    if (criteria.forSale !== undefined) {
      results = results.filter(artwork => artwork.forSale === criteria.forSale);
    }
    
    // Sort results
    if (criteria.sortBy) {
      switch (criteria.sortBy) {
        case 'priceAsc':
          results.sort((a, b) => a.price - b.price);
          break;
        case 'priceDesc':
          results.sort((a, b) => b.price - a.price);
          break;
        case 'newest':
          results.sort((a, b) => new Date(b.year) - new Date(a.year));
          break;
        case 'title':
          results.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case 'artist':
          results.sort((a, b) => a.artist.localeCompare(b.artist));
          break;
        default:
          // Default sort by ID
          results.sort((a, b) => a.id.localeCompare(b.id));
      }
    }
    
    return results;
  };
  
  /**
   * Get featured artworks
   * 
   * @param {number} limit Number of artworks to return
   * @returns {Promise<Array>} List of featured artworks
   */
  export const getFeaturedArtworks = async (limit = 6) => {
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // In a real app, this would have a proper algorithm for featuring artworks
    // For now, just return a random selection
    const shuffled = [...mockArtworks].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, limit);
  };
  
  /**
   * Get artworks by artist
   * 
   * @param {string} artistName Artist name
   * @returns {Promise<Array>} List of artworks by the artist
   */
  export const getArtworksByArtist = async (artistName) => {
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 700));
    
    return mockArtworks.filter(
      artwork => artwork.artist.toLowerCase() === artistName.toLowerCase()
    );
  };
  
  /**
   * Get artworks by category
   * 
   * @param {string} category Category name
   * @returns {Promise<Array>} List of artworks in the category
   */
  export const getArtworksByCategory = async (category) => {
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 700));
    
    return mockArtworks.filter(
      artwork => artwork.categories.includes(category)
    );
  };
  
  /**
   * Get similar artworks
   * 
   * @param {string} artworkId Artwork ID to find similar items for
   * @param {number} limit Number of similar artworks to return
   * @returns {Promise<Array>} List of similar artworks
   */
  export const getSimilarArtworks = async (artworkId, limit = 4) => {
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Find the source artwork
    const sourceArtwork = mockArtworks.find(art => art.id === artworkId);
    
    if (!sourceArtwork) {
      throw new Error('Artwork not found');
    }
    
    // Calculate similarity score based on shared categories and tags
    const otherArtworks = mockArtworks.filter(art => art.id !== artworkId);
    
    const artworksWithScores = otherArtworks.map(artwork => {
      let score = 0;
      
      // Add points for same artist
      if (artwork.artist === sourceArtwork.artist) {
        score += 3;
      }
      
      // Add points for shared categories
      sourceArtwork.categories.forEach(category => {
        if (artwork.categories.includes(category)) {
          score += 2;
        }
      });
      
      // Add points for shared tags
      sourceArtwork.tags.forEach(tag => {
        if (artwork.tags.includes(tag)) {
          score += 1;
        }
      });
      
      return { artwork, score };
    });
    
    // Sort by similarity score and return top matches
    const sortedArtworks = artworksWithScores
      .sort((a, b) => b.score - a.score)
      .map(item => item.artwork)
      .slice(0, limit);
    
    return sortedArtworks;
  };
  
  /**
   * Get all available categories
   * 
   * @returns {Promise<Array>} List of all categories
   */
  export const getAllCategories = async () => {
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Extract unique categories from all artworks
    const categories = new Set();
    mockArtworks.forEach(artwork => {
      artwork.categories.forEach(category => {
        categories.add(category);
      });
    });
    
    return Array.from(categories).sort();
  };
  
  /**
   * Get all artists
   * 
   * @returns {Promise<Array>} List of all artists
   */
  export const getAllArtists = async () => {
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Extract unique artists and count their artworks
    const artistMap = new Map();
    
    mockArtworks.forEach(artwork => {
      if (artistMap.has(artwork.artist)) {
        artistMap.set(artwork.artist, artistMap.get(artwork.artist) + 1);
      } else {
        artistMap.set(artwork.artist, 1);
      }
    });
    
    // Convert to array of objects with name and artwork count
    return Array.from(artistMap).map(([name, count]) => ({
      name,
      artworkCount: count
    })).sort((a, b) => a.name.localeCompare(b.name));
  };
  
  // Create a service object
  const artworkService = {
    getAllArtworks,
    getArtworkById,
    searchArtworks,
    getFeaturedArtworks,
    getArtworksByArtist,
    getArtworksByCategory,
    getSimilarArtworks,
    getAllCategories,
    getAllArtists
  };
  
  export default artworkService;