// src/components/artwork/PurchasePanel.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import '../../styles/PurchasePanel.css';

// In a production app, this would be imported from a payment service
// import { processPayment } from '../../services/payment';

const PurchasePanel = ({ artwork, onClose, onComplete }) => {
  const [currentStep, setCurrentStep] = useState('details');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: ''
  });
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  // Validate form fields
  const validateForm = () => {
    const newErrors = {};
    
    // Validate based on current step
    if (currentStep === 'details') {
      if (!formData.name.trim()) newErrors.name = 'Name is required';
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email is invalid';
      }
      if (!formData.address.trim()) newErrors.address = 'Address is required';
      if (!formData.city.trim()) newErrors.city = 'City is required';
      if (!formData.state.trim()) newErrors.state = 'State is required';
      if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    } else if (currentStep === 'payment') {
      if (!formData.cardNumber.trim()) {
        newErrors.cardNumber = 'Card number is required';
      } else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
        newErrors.cardNumber = 'Card number must be 16 digits';
      }
      
      if (!formData.cardExpiry.trim()) {
        newErrors.cardExpiry = 'Expiry date is required';
      } else if (!/^\d{2}\/\d{2}$/.test(formData.cardExpiry)) {
        newErrors.cardExpiry = 'Use format MM/YY';
      }
      
      if (!formData.cardCvc.trim()) {
        newErrors.cardCvc = 'CVC is required';
      } else if (!/^\d{3,4}$/.test(formData.cardCvc)) {
        newErrors.cardCvc = 'CVC must be 3 or 4 digits';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      if (currentStep === 'details') {
        // Move to next step
        setCurrentStep('payment');
      } else if (currentStep === 'payment') {
        // Process payment
        processPayment();
      } else if (currentStep === 'confirmation') {
        // Complete the process
        onComplete({ orderId: 'ORD' + Math.floor(Math.random() * 1000000) });
      }
    }
  };
  
  // Process payment (mock implementation)
  const processPayment = async () => {
    setIsProcessing(true);
    
    try {
      // In a real app, this would call a payment service
      // const result = await processPayment({
      //   amount: artwork.price,
      //   currency: 'USD',
      //   ...formData
      // });
      
      // Mock successful payment after 1.5 seconds
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Move to confirmation step
      setCurrentStep('confirmation');
      setIsProcessing(false);
    } catch (error) {
      setErrors({
        payment: 'Payment processing failed. Please try again.'
      });
      setIsProcessing(false);
    }
  };
  
  // Render based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 'details':
        return renderDetailsForm();
      case 'payment':
        return renderPaymentForm();
      case 'confirmation':
        return renderConfirmation();
      default:
        return renderDetailsForm();
    }
  };
  
  // Details form
  const renderDetailsForm = () => (
    <div className="form-container">
      <div className="form-group">
        <label htmlFor="name">Full Name</label>
        <input 
          type="text" 
          id="name" 
          name="name" 
          value={formData.name} 
          onChange={handleInputChange}
          className={errors.name ? 'error' : ''}
        />
        {errors.name && <span className="error-message">{errors.name}</span>}
      </div>
      
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input 
          type="email" 
          id="email" 
          name="email" 
          value={formData.email} 
          onChange={handleInputChange}
          className={errors.email ? 'error' : ''}
        />
        {errors.email && <span className="error-message">{errors.email}</span>}
      </div>
      
      <div className="form-group">
        <label htmlFor="address">Shipping Address</label>
        <input 
          type="text" 
          id="address" 
          name="address" 
          value={formData.address} 
          onChange={handleInputChange}
          className={errors.address ? 'error' : ''}
        />
        {errors.address && <span className="error-message">{errors.address}</span>}
      </div>
      
      <div className="form-row">
        <div className="form-group half">
          <label htmlFor="city">City</label>
          <input 
            type="text" 
            id="city" 
            name="city" 
            value={formData.city} 
            onChange={handleInputChange}
            className={errors.city ? 'error' : ''}
          />
          {errors.city && <span className="error-message">{errors.city}</span>}
        </div>
        
        <div className="form-group half">
          <label htmlFor="state">State</label>
          <input 
            type="text" 
            id="state" 
            name="state" 
            value={formData.state} 
            onChange={handleInputChange}
            className={errors.state ? 'error' : ''}
          />
          {errors.state && <span className="error-message">{errors.state}</span>}
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-group half">
          <label htmlFor="zipCode">ZIP Code</label>
          <input 
            type="text" 
            id="zipCode" 
            name="zipCode" 
            value={formData.zipCode} 
            onChange={handleInputChange}
            className={errors.zipCode ? 'error' : ''}
          />
          {errors.zipCode && <span className="error-message">{errors.zipCode}</span>}
        </div>
        
        <div className="form-group half">
          <label htmlFor="country">Country</label>
          <select 
            id="country" 
            name="country" 
            value={formData.country} 
            onChange={handleInputChange}
          >
            <option value="USA">United States</option>
            <option value="CAN">Canada</option>
            <option value="UK">United Kingdom</option>
            <option value="AUS">Australia</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>
    </div>
  );
  
  // Payment form
  const renderPaymentForm = () => (
    <div className="form-container">
      <div className="payment-summary">
        <h3>Order Summary</h3>
        <div className="summary-row">
          <span>Artwork:</span>
          <span>{artwork.title}</span>
        </div>
        <div className="summary-row">
          <span>Artist:</span>
          <span>{artwork.artist}</span>
        </div>
        <div className="summary-row total">
          <span>Total:</span>
          <span>${artwork.price}</span>
        </div>
      </div>
      
      <div className="form-group">
        <label htmlFor="cardNumber">Card Number</label>
        <input 
          type="text" 
          id="cardNumber" 
          name="cardNumber" 
          value={formData.cardNumber} 
          onChange={handleInputChange}
          placeholder="1234 5678 9012 3456"
          className={errors.cardNumber ? 'error' : ''}
          maxLength="19"
        />
        {errors.cardNumber && <span className="error-message">{errors.cardNumber}</span>}
      </div>
      
      <div className="form-row">
        <div className="form-group half">
          <label htmlFor="cardExpiry">Expiry Date</label>
          <input 
            type="text" 
            id="cardExpiry" 
            name="cardExpiry" 
            value={formData.cardExpiry} 
            onChange={handleInputChange}
            placeholder="MM/YY"
            className={errors.cardExpiry ? 'error' : ''}
            maxLength="5"
          />
          {errors.cardExpiry && <span className="error-message">{errors.cardExpiry}</span>}
        </div>
        
        <div className="form-group half">
          <label htmlFor="cardCvc">CVC</label>
          <input 
            type="text" 
            id="cardCvc" 
            name="cardCvc" 
            value={formData.cardCvc} 
            onChange={handleInputChange}
            placeholder="123"
            className={errors.cardCvc ? 'error' : ''}
            maxLength="4"
          />
          {errors.cardCvc && <span className="error-message">{errors.cardCvc}</span>}
        </div>
      </div>
      
      {errors.payment && (
        <div className="error-banner">
          {errors.payment}
        </div>
      )}
    </div>
  );
  
  // Confirmation screen
  const renderConfirmation = () => (
    <div className="confirmation-container">
      <div className="success-icon">✓</div>
      <h3>Payment Successful!</h3>
      <p>Your order for "{artwork.title}" has been processed.</p>
      <p>A confirmation email has been sent to {formData.email}</p>
      <p className="delivery-message">Our team will contact you shortly with shipping details.</p>
    </div>
  );
  
  return (
    <div className="purchase-panel">
      <div className="purchase-header">
        <h2 className="purchase-title">Purchase Artwork</h2>
        <button className="close-button" onClick={onClose}>×</button>
      </div>
      
      <div className="purchase-steps">
        <div className={`step-indicator ${currentStep === 'details' || currentStep === 'payment' || currentStep === 'confirmation' ? 'active' : ''}`}>
          Details
        </div>
        <div className={`step-indicator ${currentStep === 'payment' || currentStep === 'confirmation' ? 'active' : ''}`}>
          Payment
        </div>
        <div className={`step-indicator ${currentStep === 'confirmation' ? 'active' : ''}`}>
          Confirmation
        </div>
      </div>
      
      {renderStepContent()}
      
      <div className="button-container">
        {currentStep === 'payment' && (
          <button 
            className="back-button" 
            onClick={() => setCurrentStep('details')}
            disabled={isProcessing}
          >
            Back
          </button>
        )}
        
        {currentStep !== 'confirmation' && (
          <button 
            className="continue-button" 
            onClick={handleSubmit}
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : currentStep === 'details' ? 'Continue to Payment' : 'Complete Purchase'}
          </button>
        )}
        
        {currentStep === 'confirmation' && (
          <button 
            className="continue-button" 
            onClick={() => onComplete({ orderId: 'ORD' + Math.floor(Math.random() * 1000000) })}
          >
            Done
          </button>
        )}
      </div>
    </div>
  );
};

PurchasePanel.propTypes = {
  artwork: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    artist: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onComplete: PropTypes.func.isRequired
};

export default PurchasePanel;