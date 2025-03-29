// src/services/auth.js

/**
 * Authentication Service
 * 
 * Handles user authentication, registration, and session management.
 * In a production environment, this would connect to a backend API.
 */

// Mock user database for development
const mockUsers = [
    {
      id: 'user1',
      email: 'demo@example.com',
      password: 'password123', // In production, this would be hashed
      name: 'Demo User',
      role: 'user',
      createdAt: '2023-01-15T00:00:00Z'
    },
    {
      id: 'user2',
      email: 'artist@example.com',
      password: 'artist123',
      name: 'Demo Artist',
      role: 'artist',
      createdAt: '2023-02-20T00:00:00Z'
    },
    {
      id: 'admin1',
      email: 'admin@example.com',
      password: 'admin123',
      name: 'Admin User',
      role: 'admin',
      createdAt: '2022-12-01T00:00:00Z'
    }
  ];
  
  // Session storage key
  const TOKEN_KEY = 'gallery_auth_token';
  const USER_KEY = 'gallery_user';
  
  /**
   * Login user with email and password
   * 
   * @param {string} email User email
   * @param {string} password User password
   * @returns {Promise<Object>} User data and token
   */
  export const login = async (email, password) => {
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // In a real app, this would be a fetch call to your authentication API
    const user = mockUsers.find(u => 
      u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    // Create a mock token (in production this would come from your auth server)
    const token = btoa(JSON.stringify({
      userId: user.id,
      exp: new Date().getTime() + (7 * 24 * 60 * 60 * 1000) // 7 days
    }));
    
    // Strip the password before returning/storing user data
    const { password: _, ...userData } = user;
    
    // Store auth data in localStorage (in production, consider httpOnly cookies)
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    
    return {
      user: userData,
      token
    };
  };
  
  /**
   * Register a new user
   * 
   * @param {Object} userData User registration data
   * @returns {Promise<Object>} Created user and token
   */
  export const register = async (userData) => {
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if email already exists
    if (mockUsers.some(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
      throw new Error('Email already in use');
    }
    
    // Create new user (in a real app, this would be saved to your database)
    const newUser = {
      id: 'user' + (mockUsers.length + 1),
      email: userData.email,
      password: userData.password, // In production, this would be hashed
      name: userData.name,
      role: 'user', // Default role for new registrations
      createdAt: new Date().toISOString()
    };
    
    // Add to mock database
    mockUsers.push(newUser);
    
    // Log the user in after registration
    return login(userData.email, userData.password);
  };
  
  /**
   * Logout current user
   */
  export const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };
  
  /**
   * Get current user from storage
   * 
   * @returns {Object|null} Current user or null if not logged in
   */
  export const getCurrentUser = () => {
    const userJson = localStorage.getItem(USER_KEY);
    if (!userJson) return null;
    
    try {
      return JSON.parse(userJson);
    } catch (e) {
      console.error('Error parsing user data', e);
      return null;
    }
  };
  
  /**
   * Check if user is authenticated
   * 
   * @returns {boolean} True if user is authenticated
   */
  export const isAuthenticated = () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return false;
    
    try {
      // Parse token to check expiration
      const { exp } = JSON.parse(atob(token));
      return exp > new Date().getTime();
    } catch (e) {
      console.error('Error validating token', e);
      return false;
    }
  };
  
  /**
   * Get authentication token
   * 
   * @returns {string|null} Auth token or null if not authenticated
   */
  export const getToken = () => {
    return localStorage.getItem(TOKEN_KEY);
  };
  
  /**
   * Update user profile
   * 
   * @param {Object} userData Updated user data
   * @returns {Promise<Object>} Updated user
   */
  export const updateProfile = async (userData) => {
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const currentUser = getCurrentUser();
    if (!currentUser) {
      throw new Error('Not authenticated');
    }
    
    // Find user in mock database
    const userIndex = mockUsers.findIndex(u => u.id === currentUser.id);
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    // Update user data (except role and password)
    const updatedUser = {
      ...mockUsers[userIndex],
      name: userData.name || mockUsers[userIndex].name,
      email: userData.email || mockUsers[userIndex].email,
      // If updating password, would need additional verification
    };
    
    // Update in mock database
    mockUsers[userIndex] = updatedUser;
    
    // Strip password before returning
    const { password: _, ...cleanUserData } = updatedUser;
    
    // Update local storage
    localStorage.setItem(USER_KEY, JSON.stringify(cleanUserData));
    
    return cleanUserData;
  };
  
  /**
   * Password reset request (forgot password)
   * 
   * @param {string} email User email
   * @returns {Promise<boolean>} Success status
   */
  export const requestPasswordReset = async (email) => {
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Check if email exists
    const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      // For security, don't reveal if email exists or not
      return true;
    }
    
    // In a real app, this would send a password reset email
    console.log(`Password reset requested for ${email}`);
    
    return true;
  };
  
  const loginService = {
    login,
    register,
    logout,
    getCurrentUser,
    isAuthenticated,
    getToken,
    updateProfile,
    requestPasswordReset
  };

  export default loginService;
