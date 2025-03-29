// src/App.js
import React, { useState, useEffect } from 'react';
import GalleryScene from './GalleryScene';
import HomeScene from './components/home/HomeScene';
import AssetPreloader from './components/AssetPreloader';
import { AssetManager } from './components/utils/AssetManager';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import LoginModal from './components/user/LoginModal';
import RegisterModal from './components/user/RegisterModal';
import ProfileModal from './components/user/ProfileModal';
import CartModal from './components/cart/CartModal';
import NavBar from './components/ui/NavBar';
import WelcomeOverlay from './components/ui/WelcomeOverlay';
import LoadingSpinner from './components/ui/LoadingSpinner';
import artworkData from './data/artworkData';
import { initAnalytics } from './services/analytics';
import './styles/App.css';

function App() {
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('');
  const [showWelcome, setShowWelcome] = useState(true);
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentView, setCurrentView] = useState('home'); // 'home' or 'gallery'
  const [selectedGallery, setSelectedGallery] = useState('overview');
  
  // Auth modals
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  
  // Initialize analytics
  useEffect(() => {
    initAnalytics();
  }, []);
  
  // Handle preloader completion
  const handlePreloaderComplete = (success) => {
    setAssetsLoaded(true);
    setLoadingStatus(success ? 'All assets loaded successfully' : 'Some assets failed to load, using fallbacks');
  };
  
  // Load artwork data
  useEffect(() => {
    try {
      setLoading(true);
      setArtworks(artworkData);
      setError(null);
    } catch (err) {
      console.error('Error loading artworks:', err);
      setError('Failed to load artwork data. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Cleanup when component unmounts
  useEffect(() => {
    return () => {
      AssetManager.cleanupTextures();
    };
  }, []);
  
  // Handle closing the welcome overlay
  const handleWelcomeClose = () => {
    setShowWelcome(false);
  };
  
  // Toggle auth modals
  const toggleLoginModal = () => setShowLoginModal(!showLoginModal);
  const toggleRegisterModal = () => setShowRegisterModal(!showRegisterModal);
  const toggleProfileModal = () => setShowProfileModal(!showProfileModal);
  const toggleCartModal = () => setShowCartModal(!showCartModal);
  
  // Switch between login and register modals
  const switchToRegister = () => {
    setShowLoginModal(false);
    setShowRegisterModal(true);
  };
  
  const switchToLogin = () => {
    setShowRegisterModal(false);
    setShowLoginModal(true);
  };
  
  // Handle navigation from home to gallery
  const handleNavigateToGallery = (galleryType) => {
    setSelectedGallery(galleryType);
    setCurrentView('gallery');
  };
  
  // Handle navigation back to home
  const handleNavigateToHome = () => {
    setCurrentView('home');
  };

  return (
    <AuthProvider>
      <CartProvider>
        <div className="app-container">
          {/* Top Navigation Bar */}
          <NavBar 
            onLoginClick={toggleLoginModal}
            onProfileClick={toggleProfileModal}
            onCartClick={toggleCartModal}
            onHomeClick={handleNavigateToHome}
            currentView={currentView}
          />
          
          {/* Main Content */}
          <AssetPreloader onComplete={handlePreloaderComplete}>
            {loading ? (
              <LoadingSpinner message="Loading gallery data..." />
            ) : error ? (
              <div className="error-message">
                {error}
                <button onClick={() => window.location.reload()}>Retry</button>
              </div>
            ) : (
              <>
                {currentView === 'home' && (
                  <HomeScene 
                    onNavigateToGallery={handleNavigateToGallery} 
                    artworks={artworks}
                  />
                )}
                
                {currentView === 'gallery' && (
                  <GalleryScene 
                    artworks={artworks} 
                    initialGallery={selectedGallery}
                    onBackToHome={handleNavigateToHome}
                  />
                )}
              </>
            )}
            
            {/* Optional debug info */}
            {loadingStatus && (
              <div className="debug-info">
                {loadingStatus}
              </div>
            )}
          </AssetPreloader>
          
          {/* Welcome Overlay */}
          {showWelcome && <WelcomeOverlay onClose={handleWelcomeClose} />}
          
          {/* Auth Modals */}
          {showLoginModal && (
            <LoginModal 
              onClose={toggleLoginModal}
              onRegisterClick={switchToRegister}
            />
          )}
          
          {showRegisterModal && (
            <RegisterModal 
              onClose={toggleRegisterModal}
              onLoginClick={switchToLogin}
            />
          )}
          
          {showProfileModal && (
            <ProfileModal onClose={toggleProfileModal} />
          )}
          
          {/* Cart Modal */}
          {showCartModal && (
            <CartModal onClose={toggleCartModal} />
          )}
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;