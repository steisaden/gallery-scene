// src/components/user/LoginModal.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/LoginModal.css';

const LoginModal = ({ onClose, onRegisterClick }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  
  const { login, requestPasswordReset } = useAuth();
  
  // Handle login form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      await login(email, password);
      onClose(); // Close modal on successful login
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle password reset request
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      await requestPasswordReset(email);
      setResetSent(true);
    } catch (err) {
      setError(err.message || 'Password reset failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Toggle between login and reset password modes
  const toggleResetMode = () => {
    setResetMode(!resetMode);
    setError('');
    setResetSent(false);
  };
  
  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>{resetMode ? 'Reset Password' : 'Login'}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-content">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          {resetSent ? (
            <div className="reset-success">
              <div className="success-icon">✓</div>
              <h3>Reset Email Sent</h3>
              <p>
                If an account exists with the email address {email}, you will receive password 
                reset instructions.
              </p>
              <button 
                className="primary-button full-width"
                onClick={() => { setResetMode(false); setResetSent(false); }}
              >
                Back to Login
              </button>
            </div>
          ) : resetMode ? (
            <form onSubmit={handlePasswordReset}>
              <div className="form-group">
                <label htmlFor="reset-email">Email Address</label>
                <input
                  type="email"
                  id="reset-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
              
              <div className="form-actions">
                <button 
                  type="button" 
                  className="secondary-button"
                  onClick={toggleResetMode}
                  disabled={isLoading}
                >
                  Back to Login
                </button>
                <button 
                  type="submit" 
                  className="primary-button"
                  disabled={isLoading}
                >
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
              
              <div className="password-reset-link">
                <button 
                  type="button" 
                  onClick={toggleResetMode}
                  className="text-button"
                >
                  Forgot your password?
                </button>
              </div>
              
              <div className="form-actions">
                <button 
                  type="submit" 
                  className="primary-button full-width"
                  disabled={isLoading}
                >
                  {isLoading ? 'Logging in...' : 'Login'}
                </button>
              </div>
            </form>
          )}
          
          {!resetMode && !resetSent && (
            <div className="modal-footer">
              <p>Don't have an account?</p>
              <button 
                className="text-button" 
                onClick={onRegisterClick}
                disabled={isLoading}
              >
                Register Now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

LoginModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onRegisterClick: PropTypes.func.isRequired
};

export default LoginModal;