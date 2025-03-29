// src/components/ui/LoadingSpinner.jsx
import React from 'react';
import PropTypes from 'prop-types';
import '../../styles/LoadingSpinner.css';

const LoadingSpinner = ({ message, fullScreen = true }) => {
  return (
    <div className={`loading-container ${fullScreen ? 'fullscreen' : ''}`}>
      <div className="spinner">
        <div className="spinner-inner"></div>
      </div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  );
};

LoadingSpinner.propTypes = {
  message: PropTypes.string,
  fullScreen: PropTypes.bool
};

export default LoadingSpinner;