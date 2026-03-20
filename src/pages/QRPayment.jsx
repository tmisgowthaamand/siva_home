import { useState, useEffect } from 'react';
import { ArrowLeft, Loader } from 'lucide-react';
import './QRPayment.css';

const QRPayment = ({ orderId, amount, description, onBack, onPaymentComplete }) => {
  const [qrCode, setQrCode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState('pending');
  const [pollCount, setPollCount] = useState(0);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    generateQRCode();
  }, [orderId, amount]);

  // Poll for payment verification
  useEffect(() => {
    if (verificationStatus === 'pending' && pollCount < 30) {
      const interval = setInterval(() => {
        verifyPayment();
        setPollCount(prev => prev + 1);
      }, 2000); // Check every 2 seconds

      return () => clearInterval(interval);
    }
  }, [verificationStatus, pollCount]);

  const generateQRCode = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/api/payment/qr`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          amount,
          description: description || 'Siva Electronics Payment'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate QR code');
      }

      const data = await response.json();
      setQrCode(data.qrCode);
    } catch (err) {
      setError(err.message);
      console.error('QR generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const verifyPayment = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/payment/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId })
      });

      const data = await response.json();

      if (data.success && data.data?.verified) {
        setVerificationStatus('success');
        if (onPaymentComplete) {
          onPaymentComplete({
            orderId,
            status: 'success',
            amount
          });
        }
      }
    } catch (err) {
      console.error('Verification error:', err);
    }
  };

  const retryQRGeneration = () => {
    setPollCount(0);
    setVerificationStatus('pending');
    generateQRCode();
  };

  return (
    <div className="qr-payment-container">
      <div className="qr-payment-card">
        {/* Header */}
        <div className="qr-payment-header">
          <button className="back-button" onClick={onBack} aria-label="Go back">
            <ArrowLeft size={24} />
          </button>
          <div className="merchant-info">
            <h2>Siva Electronics</h2>
            <p>₹{amount}</p>
          </div>
        </div>

        {/* QR Code Section */}
        {loading ? (
          <div className="qr-loading">
            <Loader className="spinner" size={40} />
            <p>Generating QR Code...</p>
          </div>
        ) : error ? (
          <div className="qr-error">
            <p>{error}</p>
            <button className="retry-button" onClick={retryQRGeneration}>
              Retry
            </button>
          </div>
        ) : (
          <div className="qr-section">
            {qrCode && (
              <div className="qr-code-wrapper">
                <img src={qrCode} alt="Payment QR Code" className="qr-code-image" />
              </div>
            )}

            <div className="scan-instructions">
              <p className="scan-text">Scan with any UPI App</p>
              <div className="upi-logos">
                <span>paytm</span>
                <span>•</span>
                <span>google pay</span>
                <span>•</span>
                <span>phonepe</span>
                <span>&</span>
                <span>more</span>
              </div>
            </div>
          </div>
        )}

        {/* Status Section */}
        <div className="payment-status">
          {verificationStatus === 'pending' && (
            <div className="status-pending">
              <Loader className="spinner-small" size={16} />
              <p>Waiting for payment confirmation...</p>
              <small>({pollCount}/30 checks)</small>
            </div>
          )}
          {verificationStatus === 'success' && (
            <div className="status-success">
              <p>✓ Payment Successful!</p>
            </div>
          )}
        </div>

        {/* Additional Info */}
        <div className="payment-info">
          <div className="info-row">
            <span>Order ID</span>
            <strong>{orderId}</strong>
          </div>
          <div className="info-row">
            <span>Amount</span>
            <strong>₹{amount}</strong>
          </div>
          {description && (
            <div className="info-row">
              <span>Description</span>
              <strong>{description}</strong>
            </div>
          )}
        </div>

        {/* Security Notice */}
        <div className="security-notice">
          <p>✓ 100% Secure Payments • Powered by Paytm</p>
        </div>
      </div>
    </div>
  );
};

export default QRPayment;
