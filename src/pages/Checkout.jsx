import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Truck, MapPin, Phone, Mail, User, Lock } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './Checkout.css';

const Checkout = () => {
  const { items, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Shipping Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    
    // Payment Information
    paymentMethod: 'card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    
    // UPI
    upiId: ''
  });

  const [errors, setErrors] = useState({});

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      // Validate shipping information
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
      if (!formData.address.trim()) newErrors.address = 'Address is required';
      if (!formData.city.trim()) newErrors.city = 'City is required';
      if (!formData.state.trim()) newErrors.state = 'State is required';
      if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required';
      
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (formData.email && !emailRegex.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
      
      // Phone validation
      const phoneRegex = /^[6-9]\d{9}$/;
      if (formData.phone && !phoneRegex.test(formData.phone)) {
        newErrors.phone = 'Please enter a valid 10-digit phone number';
      }
      
      // Pincode validation
      const pincodeRegex = /^\d{6}$/;
      if (formData.pincode && !pincodeRegex.test(formData.pincode)) {
        newErrors.pincode = 'Please enter a valid 6-digit pincode';
      }
    }
    
    if (step === 2) {
      // Simplified payment validation - no card details required
      // Payment method selection is enough
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const generateOrderId = () => {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `SE${timestamp.slice(-6)}${random}`;
  };

  const handlePlaceOrder = () => {
    if (validateStep(2)) {
      // Generate unique order ID
      const orderId = generateOrderId();
      
      // Calculate final total with COD charges if applicable
      const finalTotal = total + (formData.paymentMethod === 'cod' ? 50 : 0);
      
      // Simulate order processing
      const orderData = {
        orderId,
        items,
        total: finalTotal,
        shippingInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode
        },
        paymentMethod: formData.paymentMethod,
        paymentStatus: 'confirmed',
        orderDate: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      };
      
      // Store order in localStorage
      localStorage.setItem('lastOrder', JSON.stringify(orderData));
      
      // Clear cart
      clearCart();
      
      // Navigate to order confirmation
      navigate('/order-confirmation');
    }
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const subtotal = getCartTotal();
  const shipping = subtotal > 2000 ? 0 : 99;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + tax;

  return (
    <div className="checkout-page">
      <div className="container">
        <div className="checkout-header">
          <h1>Checkout</h1>
          <div className="checkout-steps">
            <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
              <span className="step-number">1</span>
              <span className="step-label">Shipping</span>
            </div>
            <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
              <span className="step-number">2</span>
              <span className="step-label">Payment</span>
            </div>
            <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
              <span className="step-number">3</span>
              <span className="step-label">Review</span>
            </div>
          </div>
        </div>

        <div className="checkout-content">
          <div className="checkout-form">
            {/* Step 1: Shipping Information */}
            {currentStep === 1 && (
              <div className="form-section">
                <div className="section-header">
                  <Truck size={24} />
                  <h2>Shipping Information</h2>
                </div>
                
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">
                      <User size={16} />
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`form-input ${errors.firstName ? 'error' : ''}`}
                      placeholder="Enter your first name"
                    />
                    {errors.firstName && <span className="error-message">{errors.firstName}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`form-input ${errors.lastName ? 'error' : ''}`}
                      placeholder="Enter your last name"
                    />
                    {errors.lastName && <span className="error-message">{errors.lastName}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">
                      <Mail size={16} />
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`form-input ${errors.email ? 'error' : ''}`}
                      placeholder="Enter your email address"
                    />
                    {errors.email && <span className="error-message">{errors.email}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">
                      <Phone size={16} />
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`form-input ${errors.phone ? 'error' : ''}`}
                      placeholder="Enter your phone number"
                    />
                    {errors.phone && <span className="error-message">{errors.phone}</span>}
                  </div>
                  
                  <div className="form-group full-width">
                    <label className="form-label">
                      <MapPin size={16} />
                      Address *
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className={`form-input ${errors.address ? 'error' : ''}`}
                      placeholder="Enter your full address"
                      rows="3"
                    />
                    {errors.address && <span className="error-message">{errors.address}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">City *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={`form-input ${errors.city ? 'error' : ''}`}
                      placeholder="Enter your city"
                    />
                    {errors.city && <span className="error-message">{errors.city}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">State *</label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className={`form-input ${errors.state ? 'error' : ''}`}
                    >
                      <option value="">Select State</option>
                      <option value="Andhra Pradesh">Andhra Pradesh</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Kerala">Kerala</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="Telangana">Telangana</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Gujarat">Gujarat</option>
                      <option value="Rajasthan">Rajasthan</option>
                      <option value="Delhi">Delhi</option>
                      <option value="West Bengal">West Bengal</option>
                    </select>
                    {errors.state && <span className="error-message">{errors.state}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Pincode *</label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      className={`form-input ${errors.pincode ? 'error' : ''}`}
                      placeholder="Enter pincode"
                      maxLength="6"
                    />
                    {errors.pincode && <span className="error-message">{errors.pincode}</span>}
                  </div>
                </div>
                
                <div className="form-actions">
                  <button onClick={handleNextStep} className="btn btn-primary btn-lg">
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Payment Information */}
            {currentStep === 2 && (
              <div className="form-section">
                <div className="section-header">
                  <CreditCard size={24} />
                  <h2>Payment Information</h2>
                </div>
                
                <div className="payment-methods">
                  <label className="payment-method">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={formData.paymentMethod === 'card'}
                      onChange={handleInputChange}
                    />
                    <div className="payment-option">
                      <CreditCard size={20} />
                      <span>Credit/Debit Card</span>
                    </div>
                  </label>
                  
                  <label className="payment-method">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="upi"
                      checked={formData.paymentMethod === 'upi'}
                      onChange={handleInputChange}
                    />
                    <div className="payment-option">
                      <span>📱</span>
                      <span>UPI Payment</span>
                    </div>
                  </label>
                  
                  <label className="payment-method">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={handleInputChange}
                    />
                    <div className="payment-option">
                      <span>💰</span>
                      <span>Cash on Delivery</span>
                    </div>
                  </label>
                </div>

                {formData.paymentMethod === 'card' && (
                  <div className="payment-info">
                    <div className="payment-message">
                      <h4>💳 Credit/Debit Card Payment</h4>
                      <p>Your payment will be processed securely. Click "Proceed to Pay" to complete your order.</p>
                    </div>
                  </div>
                )}

                {formData.paymentMethod === 'upi' && (
                  <div className="payment-info">
                    <div className="payment-message">
                      <h4>📱 UPI Payment</h4>
                      <p>You will be redirected to your UPI app to complete the payment. Click "Proceed to Pay" to continue.</p>
                    </div>
                  </div>
                )}

                {formData.paymentMethod === 'cod' && (
                  <div className="cod-info">
                    <p>You will pay cash when your order is delivered to your address.</p>
                    <p><strong>Note:</strong> Additional charges of ₹50 may apply for Cash on Delivery.</p>
                  </div>
                )}
                
                <div className="form-actions">
                  <button onClick={handlePrevStep} className="btn btn-outline">
                    Back to Shipping
                  </button>
                  <button onClick={handleNextStep} className="btn btn-primary btn-lg">
                    Review Order
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Order Review */}
            {currentStep === 3 && (
              <div className="form-section">
                <div className="section-header">
                  <h2>Review Your Order</h2>
                </div>
                
                <div className="order-review">
                  <div className="review-section">
                    <h3>Shipping Address</h3>
                    <div className="address-display">
                      <p><strong>{formData.firstName} {formData.lastName}</strong></p>
                      <p>{formData.address}</p>
                      <p>{formData.city}, {formData.state} - {formData.pincode}</p>
                      <p>Phone: {formData.phone}</p>
                      <p>Email: {formData.email}</p>
                    </div>
                  </div>
                  
                  <div className="review-section">
                    <h3>Payment Method</h3>
                    <div className="payment-display">
                      {formData.paymentMethod === 'card' && (
                        <p>Credit/Debit Card ending in {formData.cardNumber.slice(-4)}</p>
                      )}
                      {formData.paymentMethod === 'upi' && (
                        <p>UPI Payment ({formData.upiId})</p>
                      )}
                      {formData.paymentMethod === 'cod' && (
                        <p>Cash on Delivery</p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="form-actions">
                  <button onClick={handlePrevStep} className="btn btn-outline">
                    Back to Payment
                  </button>
                  <button onClick={handlePlaceOrder} className="btn btn-primary btn-lg">
                    Place Order
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="order-summary">
            <div className="summary-card">
              <h3>Order Summary</h3>
              
              <div className="order-items">
                {items.map((item) => (
                  <div key={item.id} className="summary-item">
                    <img src={item.image} alt={item.name} />
                    <div className="item-info">
                      <h4>{item.name}</h4>
                      <p>Qty: {item.quantity}</p>
                    </div>
                    <div className="item-price">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="summary-calculations">
                <div className="summary-row">
                  <span>Subtotal ({items.length} items)</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                
                <div className="summary-row">
                  <span>Shipping</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="free-shipping">FREE</span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>
                
                <div className="summary-row">
                  <span>Tax (GST 18%)</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                
                {formData.paymentMethod === 'cod' && (
                  <div className="summary-row">
                    <span>COD Charges</span>
                    <span>₹50</span>
                  </div>
                )}
                
                <div className="summary-divider"></div>
                
                <div className="summary-row total-row">
                  <span>Total</span>
                  <span>{formatPrice(total + (formData.paymentMethod === 'cod' ? 50 : 0))}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
