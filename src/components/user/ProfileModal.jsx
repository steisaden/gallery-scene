// src/components/user/ProfileModal.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '../../contexts/AuthContext';
import { getUserPurchases } from '../../services/payment';
import '../../styles/ProfileModal.css';

const ProfileModal = ({ onClose }) => {
  const { user, logout, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [purchases, setPurchases] = useState([]);
  const [purchasesLoaded, setPurchasesLoaded] = useState(false);
  
  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    
    // Load purchase history when visiting the purchases tab
    if (tab === 'purchases' && !purchasesLoaded) {
      loadPurchaseHistory();
    }
  };
  
  // Load user purchase history
  const loadPurchaseHistory = async () => {
    setIsLoading(true);
    
    try {
      const userPurchases = await getUserPurchases();
      setPurchases(userPurchases);
      setPurchasesLoaded(true);
    } catch (err) {
      console.error('Error loading purchase history:', err);
      // Show error message
    } finally {
      setIsLoading(false);
    }
  };
  
  // Toggle edit mode
  const toggleEditMode = () => {
    if (isEditing) {
      // Cancel editing - reset form
      setFormData({
        name: user?.name || '',
        email: user?.email || ''
      });
      setErrors({});
    }
    
    setIsEditing(!isEditing);
    setSuccessMessage('');
  };
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear field-specific error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  // Validate profile form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle profile update
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setSuccessMessage('');
    
    try {
      await updateProfile({
        name: formData.name,
        email: formData.email
      });
      
      setIsEditing(false);
      setSuccessMessage('Profile updated successfully');
    } catch (err) {
      setErrors({
        ...errors,
        form: err.message || 'Profile update failed. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle logout
  const handleLogout = () => {
    logout();
    onClose();
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  return (
    <div className="modal-overlay">
      <div className="modal-container profile-modal">
        <div className="modal-header">
          <h2>My Account</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="profile-tabs">
          <button 
            className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => handleTabChange('profile')}
          >
            Profile
          </button>
          <button 
            className={`tab-button ${activeTab === 'purchases' ? 'active' : ''}`}
            onClick={() => handleTabChange('purchases')}
          >
            Purchases
          </button>
        </div>
        
        <div className="modal-content">
          {activeTab === 'profile' && (
            <div className="profile-tab">
              {successMessage && (
                <div className="success-message">
                  {successMessage}
                </div>
              )}
              
              {errors.form && (
                <div className="error-message">
                  {errors.form}
                </div>
              )}
              
              <div className="profile-info">
                <div className="profile-avatar">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
                
                <div className="profile-details">
                  {isEditing ? (
                    <form onSubmit={handleUpdateProfile}>
                      <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          disabled={isLoading}
                          className={errors.name ? 'error' : ''}
                        />
                        {errors.name && <span className="field-error">{errors.name}</span>}
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          disabled={isLoading}
                          className={errors.email ? 'error' : ''}
                        />
                        {errors.email && <span className="field-error">{errors.email}</span>}
                      </div>
                      
                      <div className="form-actions">
                        <button 
                          type="button" 
                          className="secondary-button"
                          onClick={toggleEditMode}
                          disabled={isLoading}
                        >
                          Cancel
                        </button>
                        <button 
                          type="submit" 
                          className="primary-button"
                          disabled={isLoading}
                        >
                          {isLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <h3 className="profile-name">{user?.name}</h3>
                      <p className="profile-email">{user?.email}</p>
                      <p className="profile-role">
                        Account Type: <span className="role-badge">{user?.role || 'User'}</span>
                      </p>
                      
                      <button 
                        className="secondary-button edit-profile-button" 
                        onClick={toggleEditMode}
                      >
                        Edit Profile
                      </button>
                    </>
                  )}
                </div>
              </div>
              
              <div className="logout-section">
                <button className="text-button logout-button" onClick={handleLogout}>
                  Log Out
                </button>
              </div>
            </div>
          )}
          
          {activeTab === 'purchases' && (
            <div className="purchases-tab">
              <h3 className="section-title">Purchase History</h3>
              
              {isLoading ? (
                <div className="loading-spinner">Loading purchase history...</div>
              ) : purchases.length > 0 ? (
                <div className="purchase-list">
                  {purchases.map(purchase => (
                    <div key={purchase.id} className="purchase-item">
                      <div className="purchase-header">
                        <div className="purchase-title">
                          {/* Ideally, fetch artwork title from the artwork service */}
                          <h4>Artwork Purchase</h4>
                          <span className="purchase-id">Order #{purchase.id}</span>
                        </div>
                        <div className="purchase-amount">${purchase.amount.toFixed(2)}</div>
                      </div>
                      
                      <div className="purchase-details">
                        <div className="purchase-info">
                          <p>Date: {formatDate(purchase.timestamp)}</p>
                          <p>Payment Method: {purchase.paymentMethod}</p>
                          {purchase.last4 && <p>Card: •••• {purchase.last4}</p>}
                        </div>
                        
                        <div className="purchase-status">
                          <span 
                            className={`status-badge ${
                              purchase.status === 'completed' ? 'completed' : 
                              purchase.status === 'failed' ? 'failed' : ''
                            }`}
                          >
                            {purchase.status.charAt(0).toUpperCase() + purchase.status.slice(1)}
                          </span>
                          
                          {purchase.refunded && (
                            <span className="status-badge refunded">Refunded</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="purchase-actions">
                        <button className="text-button">View Receipt</button>
                        {purchase.status === 'completed' && !purchase.refunded && (
                          <button className="text-button">Request Refund</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-purchases">
                  <p>You have not made any purchases yet.</p>
                  <p>Explore our gallery to find your next masterpiece!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

ProfileModal.propTypes = {
  onClose: PropTypes.func.isRequired
};

export default ProfileModal;