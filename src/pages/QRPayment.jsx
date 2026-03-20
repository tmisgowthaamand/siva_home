import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Loader, ChevronLeft, Shield } from 'lucide-react';
import './Checkout.css';

const QRPayment = ({ orderId, amount, description, onBack, onPaymentComplete }) => {
  const [qrCode, setQrCode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [apiUrl, setApiUrl] = useState('');

  useEffect(() => {
    const url = process.env.REACT_APP_API_URL || 'http://localhost:10000';
    setApiUrl(url);
    console.log('QR Payment Component - API URL:', url);
    generateQR();
  }, [orderId, amount]);

  const generateQR = async () => {
    try {
      setLoading(true);
      setError(null);

      const url = process.env.REACT_APP_API_URL || 'http://localhost:10000';
      const endpoint = `${url}/api/payment/qr`;

      console.log('Generating QR Code...');
      console.log('Endpoint:', endpoint);
      console.log('Payload:', { orderId, amount, description });

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          orderId: String(orderId),
          amount: String(amount),
          description: description || 'Siva Electronics Payment'
        })
      });

      console.log('Response Status:', response.status);
      console.log('Response OK:', response.ok);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error Response:', errorData);
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('QR Code Generated Successfully:', data);

      if (data.success && data.qrCode) {
        setQrCode(data.qrCode);
        setError(null);
      } else {
        throw new Error(data.error || 'Failed to generate QR code');
      }
    } catch (err) {
      console.error('QR Generation Error:', err);
      setError(err.message || 'Failed to generate QR code. Make sure the backend is running.');
      setQrCode(null);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    setPaymentStatus('success');
    setTimeout(() => {
      if (onPaymentComplete) {
        onPaymentComplete({ status: 'success' });
      }
    }, 2000);
  };

  return (
    <div className="qr-payment-overlay">
      <div className="qr-payment-modal">
        {/* Back Button */}
        <button onClick={onBack} className="modal-back-button">
          <ChevronLeft size={20} />
        </button>

        {/* Merchant Info Header */}
        <div className="merchant-header">
          <div className="merchant-info">
            <div className="merchant-icon">🏪</div>
            <div className="merchant-details">
              <h3>SIVA ELECTRONICS</h3>
              <p>Electronics & Gadgets</p>
            </div>
          </div>
        </div>

        {/* Amount Display */}
        <div className="amount-section">
          <p className="select-option-text">Select an option to pay</p>
          <p className="payment-amount">₹{amount}</p>
        </div>

        {/* QR Code Section */}
        {loading ? (
          <div className="qr-loading-modal">
            <Loader className="spinner" size={40} />
            <p>Generating QR Code...</p>
          </div>
        ) : error ? (
          <div className="qr-error-modal">
            <AlertCircle size={40} />
            <p>{error}</p>
            <small style={{ color: '#666', marginTop: '10px', display: 'block' }}>
              API URL: {apiUrl}
            </small>
            <button onClick={generateQR} className="btn btn-sm btn-primary">
              Try Again
            </button>
          </div>
        ) : qrCode ? (
          <div className="payment-options-section">
            <div className="qr-option-card">
              <img src={qrCode} alt="UPI QR Code" className="qr-code-large" />
              <div className="upi-info">
                <p className="scan-text">Scan with any UPI App</p>
                <div className="upi-apps-modal">
                  <span className="app-badge">Paytm</span>
                  <span className="app-badge">Google Pay</span>
                  <span className="app-badge">PhonePe</span>
                  <span className="app-badge more">& more</span>
                </div>
              </div>
            </div>

            {/* Payment Confirmation */}
            <div className="payment-confirm-section">
              <button
                onClick={handlePaymentSuccess}
                className="confirm-payment-btn"
              >
                ✓ I have completed the payment
              </button>
            </div>
          </div>
        ) : null}

        {/* More Options */}
        <div className="more-options-section">
          <h4>More Payment Options</h4>
          <div className="more-options-grid">
            <button className="more-option-btn">💳 Credit/Debit Card</button>
            <button className="more-option-btn">🏦 Net Banking</button>
            <button className="more-option-btn">📱 Wallet</button>
          </div>
        </div>

        {/* Security Badge */}
        <div className="security-badge-section">
          <Shield size={16} />
          <span>100% Secure Payments Powered by UPI</span>
        </div>

        {/* Success Overlay */}
        {paymentStatus === 'success' && (
          <div className="payment-success-overlay">
            <div className="success-popup">
              <CheckCircle size={60} className="success-icon" />
              <h3>Payment Successful!</h3>
              <p>Your order has been confirmed</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QRPayment;


  const handlePaymentSuccess = () => {
    setPaymentStatus('success');
    setTimeout(() => {
      if (onPaymentComplete) {
        onPaymentComplete({ status: 'success' });
      }
    }, 2000);
  };

  return (
    <div className="qr-payment-overlay">
      <div className="qr-payment-modal">
        {/* Back Button */}
        <button onClick={onBack} className="modal-back-button">
          <ChevronLeft size={20} />
        </button>

        {/* Merchant Info Header */}
        <div className="merchant-header">
          <div className="merchant-info">
            <div className="merchant-icon">🏪</div>
            <div className="merchant-details">
              <h3>SIVA ELECTRONICS</h3>
              <p>Electronics & Gadgets</p>
            </div>
          </div>
        </div>

        {/* Amount Display */}
        <div className="amount-section">
          <p className="select-option-text">Select an option to pay</p>
          <p className="payment-amount">₹{amount}</p>
        </div>

        {/* QR Code Section */}
        {loading ? (
          <div className="qr-loading-modal">
            <Loader className="spinner" size={40} />
            <p>Generating QR Code...</p>
          </div>
        ) : error ? (
          <div className="qr-error-modal">
            <AlertCircle size={40} />
            <p>{error}</p>
            <button onClick={generateQR} className="btn btn-sm btn-primary">
              Try Again
            </button>
          </div>
        ) : qrCode ? (
          <div className="payment-options-section">
            <div className="qr-option-card">
              <img src={qrCode} alt="UPI QR Code" className="qr-code-large" />
              <div className="upi-info">
                <p className="scan-text">Scan with any UPI App</p>
                <div className="upi-apps-modal">
                  <span className="app-badge">Paytm</span>
                  <span className="app-badge">Google Pay</span>
                  <span className="app-badge">PhonePe</span>
                  <span className="app-badge more">& more</span>
                </div>
              </div>
            </div>

            {/* Payment Confirmation */}
            <div className="payment-confirm-section">
              <button
                onClick={handlePaymentSuccess}
                className="confirm-payment-btn"
              >
                ✓ I have completed the payment
              </button>
            </div>
          </div>
        ) : null}

        {/* More Options */}
        <div className="more-options-section">
          <h4>More Payment Options</h4>
          <div className="more-options-grid">
            <button className="more-option-btn">💳 Credit/Debit Card</button>
            <button className="more-option-btn">🏦 Net Banking</button>
            <button className="more-option-btn">📱 Wallet</button>
          </div>
        </div>

        {/* Security Badge */}
        <div className="security-badge-section">
          <Shield size={16} />
          <span>100% Secure Payments Powered by UPI</span>
        </div>

        {/* Success Overlay */}
        {paymentStatus === 'success' && (
          <div className="payment-success-overlay">
            <div className="success-popup">
              <CheckCircle size={60} className="success-icon" />
              <h3>Payment Successful!</h3>
              <p>Your order has been confirmed</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QRPayment;
