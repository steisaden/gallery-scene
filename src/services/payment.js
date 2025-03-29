// src/services/payment.js

/**
 * Payment Service
 * 
 * Handles payment processing for artwork purchases.
 * In a production environment, this would connect to a payment processor API
 * such as Stripe, PayPal, or another payment gateway.
 */

import { getCurrentUser } from './auth';

// Mock transaction database for development
const mockTransactions = [];

/**
 * Process a payment for artwork purchase
 * 
 * @param {Object} paymentData Payment data including artwork, amount, and payment method
 * @returns {Promise<Object>} Transaction details
 */
export const processPayment = async (paymentData) => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Get current user
  const user = getCurrentUser();
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  // Validate payment data
  if (!paymentData.artworkId) {
    throw new Error('Artwork ID is required');
  }
  
  if (!paymentData.amount || paymentData.amount <= 0) {
    throw new Error('Valid payment amount is required');
  }
  
  // Validate credit card (basic validation)
  if (paymentData.paymentMethod === 'creditCard') {
    if (!paymentData.cardNumber || !paymentData.cardExpiry || !paymentData.cardCvc) {
      throw new Error('Credit card information is required');
    }
    
    // Basic format validation
    if (!/^\d{16}$/.test(paymentData.cardNumber.replace(/\s/g, ''))) {
      throw new Error('Invalid card number');
    }
    
    if (!/^\d{2}\/\d{2}$/.test(paymentData.cardExpiry)) {
      throw new Error('Invalid expiry date format (MM/YY)');
    }
    
    if (!/^\d{3,4}$/.test(paymentData.cardCvc)) {
      throw new Error('Invalid CVC code');
    }
  }
  
  // In a real app, this would make an API call to a payment processor
  
  // Create transaction record
  const transaction = {
    id: 'txn_' + Math.random().toString(36).substr(2, 9),
    userId: user.id,
    artworkId: paymentData.artworkId,
    amount: paymentData.amount,
    currency: paymentData.currency || 'USD',
    paymentMethod: paymentData.paymentMethod,
    // Don't store complete card details in a real app!
    // Just for mock purposes:
    last4: paymentData.cardNumber ? paymentData.cardNumber.slice(-4) : null,
    status: 'completed',
    timestamp: new Date().toISOString()
  };
  
  // Add to mock database
  mockTransactions.push(transaction);
  
  // Simulate occasional payment failure for testing purposes (10% chance)
  if (Math.random() < 0.1) {
    transaction.status = 'failed';
    throw new Error('Payment processing failed. Please try again.');
  }
  
  // Return transaction details
  return transaction;
};

/**
 * Get purchase history for the current user
 * 
 * @returns {Promise<Array>} List of user transactions
 */
export const getUserPurchases = async () => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Get current user
  const user = getCurrentUser();
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  // Filter transactions for current user
  const userTransactions = mockTransactions.filter(
    transaction => transaction.userId === user.id
  );
  
  return userTransactions;
};

/**
 * Get transaction details 
 * 
 * @param {string} transactionId Transaction ID
 * @returns {Promise<Object>} Transaction details
 */
export const getTransactionDetails = async (transactionId) => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Get current user
  const user = getCurrentUser();
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  // Find transaction
  const transaction = mockTransactions.find(
    t => t.id === transactionId && t.userId === user.id
  );
  
  if (!transaction) {
    throw new Error('Transaction not found');
  }
  
  return transaction;
};

/**
 * Request refund for a purchase
 * 
 * @param {string} transactionId Transaction ID
 * @param {string} reason Refund reason
 * @returns {Promise<Object>} Updated transaction
 */
export const requestRefund = async (transactionId, reason) => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Get current user
  const user = getCurrentUser();
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  // Find transaction
  const transaction = mockTransactions.find(
    t => t.id === transactionId && t.userId === user.id
  );
  
  if (!transaction) {
    throw new Error('Transaction not found');
  }
  
  // Check if transaction is eligible for refund
  if (transaction.status !== 'completed') {
    throw new Error('Only completed transactions can be refunded');
  }
  
  // Check if transaction is already refunded
  if (transaction.refunded) {
    throw new Error('Transaction has already been refunded');
  }
  
  // Create refund record
  const refund = {
    id: 'ref_' + Math.random().toString(36).substr(2, 9),
    transactionId: transaction.id,
    amount: transaction.amount,
    reason,
    status: 'processing',
    timestamp: new Date().toISOString()
  };
  
  // Update transaction
  transaction.refunded = true;
  transaction.refundId = refund.id;
  
  return {
    transaction,
    refund
  };
};

// Create payment service object
const paymentService = {
  processPayment,
  getUserPurchases,
  getTransactionDetails,
  requestRefund
};

export default paymentService;