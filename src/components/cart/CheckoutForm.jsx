// src/components/cart/CheckoutForm.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { processPayment } from '../../services/payment';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/CheckoutForm.css';

const CheckoutForm = ({ items, subtotal, tax, total, onCancel, onComplete }) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState('shipping');
  const [formData, setFormData] = useState({
    // Pre-fill with user data if available
    name: user?.name || '',
    email: user?.email || '',
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
    
    // Clear field-specific error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  // Format card number with spaces
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    
    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };
  
  // Format expiry date
  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    if (v.length > 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    
    return v;
  };
  
  // Handle special input formatting
  const handleSpecialInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;
    
    if (name === 'cardNumber') {
      formattedValue = formatCardNumber(value);
    } else if (name === 'cardExpiry') {
      formattedValue = formatExpiry(value);
    } else if (name === 'cardCvc') {
      formattedValue = value.replace(/\D/g, '').substring(0, 4);
    }
    
    setFormData({
      ...formData,
      [name]: formattedValue
    });
    
    // Clear field-specific error when user types
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
    if (currentStep === 'shipping') {
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
      } else if (formData.cardNumber.replace(/\s/g, '').length !== 16) {
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (currentStep === 'shipping') {
      // Move to payment step
      setCurrentStep('payment');
    } else if (currentStep === 'payment') {
      // Process payment
      setIsProcessing(true);
      
      try {
        // Prepare items for payment
        const paymentItems = items.map(item => ({
          id: item.id,
          title: item.title,
          price: item.price
        }));
        
        // Process payment
        await processPayment({
          artworkId: items[0].id, // If multiple items, we'd handle differently
          amount: total,
          currency: 'USD',
          paymentMethod: 'creditCard',
          cardNumber: formData.cardNumber.replace(/\s/g, ''),
          cardExpiry: formData.cardExpiry,
          cardCvc: formData.cardCvc,
          items: paymentItems,
          shippingAddress: {
            name: formData.name,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
            country: formData.country
          }
        });
        
        // Move to confirmation step
        setCurrentStep('confirmation');
        setIsProcessing(false);
      } catch (error) {
        setErrors({
          form: error.message || 'Payment processing failed. Please try again.'
        });
        setIsProcessing(false);
      }
    } else if (currentStep === 'confirmation') {
      // Complete the checkout process
      onComplete();
    }
  };
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
  
  // Render shipping form
  const renderShippingForm = () => (
    <div className="checkout-step">
      <h3 className="step-title">Shipping Information</h3>
      
      <div className="form-group">
        <label htmlFor="name">Full Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          disabled={isProcessing}
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
          disabled={isProcessing}
          className={errors.email ? 'error' : ''}
        />
        {errors.email && <span className="field-error">{errors.email}</span>}
      </div>
      
      <div className="form-group">
        <label htmlFor="address">Shipping Address</label>
        <input
          type="text"
          id="address"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          disabled={isProcessing}
          className={errors.address ? 'error' : ''}
        />
        {errors.address && <span className="field-error">{errors.address}</span>}
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
            disabled={isProcessing}
            className={errors.city ? 'error' : ''}
          />
          {errors.city && <span className="field-error">{errors.city}</span>}
        </div>
        
        <div className="form-group half">
          <label htmlFor="state">State</label>
          <input
            type="text"
            id="state"
            name="state"
            value={formData.state}
            onChange={handleInputChange}
            disabled={isProcessing}
            className={errors.state ? 'error' : ''}
          />
          {errors.state && <span className="field-error">{errors.state}</span>}
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
            disabled={isProcessing}
            className={errors.zipCode ? 'error' : ''}
          />
          {errors.zipCode && <span className="field-error">{errors.zipCode}</span>}
        </div>
        
        <div className="form-group half">
          <label htmlFor="country">Country</label>
          <select
            id="country"
            name="country"
            value={formData.country}
            onChange={handleInputChange}
            disabled={isProcessing}
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
  
  // Render payment form
  const renderPaymentForm = () => (
    <div className="checkout-step">
      <h3 className="step-title">Payment Information</h3>
      
      <div className="payment-summary">
        <h4>Order Summary</h4>
        <div className="summary-row">
          <span>Items ({items.length})</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="summary-row">
          <span>Tax</span>
          <span>{formatCurrency(tax)}</span>
        </div>
        <div className="summary-row total">
          <span>Total</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>
      
      <div className="form-group">
        <label htmlFor="cardNumber">Card Number</label>
        <input
          type="text"
          id="cardNumber"
          name="cardNumber"
          value={formData.cardNumber}
          onChange={handleSpecialInputChange}
          placeholder="1234 5678 9012 3456"
          maxLength="19"
          disabled={isProcessing}
          className={errors.cardNumber ? 'error' : ''}
        />
        {errors.cardNumber && <span className="field-error">{errors.cardNumber}</span>}
      </div>
      
      <div className="form-row">
        <div className="form-group half">
          <label htmlFor="cardExpiry">Expiry Date</label>
          <input
            type="text"
            id="cardExpiry"
            name="cardExpiry"
            value={formData.cardExpiry}
            onChange={handleSpecialInputChange}
            placeholder="MM/YY"
            maxLength="5"
            disabled={isProcessing}
            className={errors.cardExpiry ? 'error' : ''}
          />
          {errors.cardExpiry && <span className="field-error">{errors.cardExpiry}</span>}
        </div>
        
        <div className="form-group half">
          <label htmlFor="cardCvc">CVC</label>
          <input
            type="text"
            id="cardCvc"
            name="cardCvc"
            value={formData.cardCvc}
            onChange={handleSpecialInputChange}
            placeholder="123"
            maxLength="4"
            disabled={isProcessing}
            className={errors.cardCvc ? 'error' : ''}
          />
          {errors.cardCvc && <span className="field-error">{errors.cardCvc}</span>}
        </div>
      </div>
      
      {errors.form && (
        <div className="error-message">
          {errors.form}
        </div>
      )}
    </div>
  );
  
  // Render confirmation
  const renderConfirmation = () => (
    <div className="checkout-step confirmation">
      <div className="success-icon">✓</div>
      <h3>Payment Successful!</h3>
      <p className="confirmation-message">
        Thank you for your purchase! Your order has been processed successfully.
      </p>
      
      <div className="order-details">
        <h4>Order Summary</h4>
        <div className="order-items">
          {items.map(item => (
            <div key={item.id} className="order-item">
              <span>{item.title}</span>
              <span>{formatCurrency(item.price)}</span>
            </div>
          ))}
        </div>
        
        <div className="summary-row total">
          <span>Total</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>
      
      <div className="shipping-details">
        <h4>Shipping Information</h4>
        <p>{formData.name}</p>
        <p>{formData.address}</p>
        <p>{formData.city}, {formData.state} {formData.zipCode}</p>
        <p>{formData.country}</p>
      </div>
      
      <p className="order-confirmation">
        A confirmation email has been sent to {formData.email}
      </p>
    </div>
  );
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Checkout steps indicator */}
      <div className="checkout-steps-indicator">
        <div 
          className={`step-indicator ${
            currentStep === 'shipping' || currentStep === 'payment' || currentStep === 'confirmation' ? 'active' : ''
          }`}
        >
          Shipping
        </div>
        <div 
          className={`step-indicator ${
            currentStep === 'payment' || currentStep === 'confirmation' ? 'active' : ''
          }`}
        >
          Payment
        </div>
        <div 
          className={`step-indicator ${
            currentStep === 'confirmation' ? 'active' : ''
          }`}
        >
          Confirmation
        </div>
      </div>
      
      {/* Error message */}
      {errors.form && currentStep !== 'payment' && (
        <div className="error-message">
          {errors.form}
        </div>
      )}
      
      {/* Current step content */}
      {currentStep === 'shipping' && renderShippingForm()}
      {currentStep === 'payment' && renderPaymentForm()}
      {currentStep === 'confirmation' && renderConfirmation()}
      
      {/* Form actions */}
      <div className="form-actions">
        {currentStep === 'shipping' && (
          <button 
            type="button" 
            className="secondary-button"
            onClick={onCancel}
            disabled={isProcessing}
          >
            Back to Cart
          </button>
        )}
        
        {currentStep === 'payment' && (
          <button 
            type="button" 
            className="secondary-button"
            onClick={() => setCurrentStep('shipping')}
            disabled={isProcessing}
          >
            Back
          </button>
        )}
        
        {currentStep !== 'confirmation' && (
          <button 
            type="submit" 
            className="primary-button"
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : 
             currentStep === 'shipping' ? 'Continue to Payment' : 
             'Complete Purchase'}
          </button>
        )}
        
        {currentStep === 'confirmation' && (
          <button 
            type="submit" 
            className="primary-button"
          >
            Continue Shopping
          </button>
        )}
      </div>
    </form>
  );
};

CheckoutForm.propTypes = {
  items: PropTypes.array.isRequired,
  subtotal: PropTypes.number.isRequired,
  tax: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  onCancel: PropTypes.func.isRequired,
  onComplete: PropTypes.func.isRequired
};

export default CheckoutForm;