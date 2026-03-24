# Siva Electronics - QR Payment Integration Setup Guide

This guide helps you set up the Paytm QR payment system for Siva Electronics.

## Project Structure

```
siva_home/
├── src/                          # Frontend (React)
│   ├── pages/
│   │   ├── QRPayment.jsx        # QR Payment component
│   │   └── QRPayment.css        # QR Payment styles
│   └── ...
├── backend/                      # Backend (Node.js/Express)
│   ├── src/
│   │   ├── server.js            # Main server
│   │   ├── routes/
│   │   │   └── payment.js       # Payment routes
│   │   └── controllers/
│   │       └── paymentController.js  # Payment logic
│   ├── package.json
│   ├── .env.example
│   └── README.md
├── render.yaml                   # Render deployment config
└── vite.config.js               # Updated with API proxy
```

## Quick Start

### 1. Frontend Setup

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start development server (runs on http://localhost:5173)
npm run dev
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your Paytm credentials:
PAYTM_MERCHANT_ID=oAqfaJ24295935325563
PAYTM_MERCHANT_KEY=WqZs7&tlq7h5Oasn

# Start development server (runs on http://localhost:5000)
npm run dev
```

## Using QR Payment Component

### In your Cart/Checkout Page:

```jsx
import QRPayment from '../pages/QRPayment';
import { useState } from 'react';

export default function CheckoutPage() {
  const [showQRPayment, setShowQRPayment] = useState(false);
  const [orderData, setOrderData] = useState(null);

  const handlePayment = () => {
    const orderId = `ORD${Date.now()}`;
    const totalAmount = cartTotal;

    setOrderData({
      orderId,
      amount: totalAmount.toString(),
      description: 'Electronics Purchase'
    });
    setShowQRPayment(true);
  };

  if (showQRPayment && orderData) {
    return (
      <QRPayment
        orderId={orderData.orderId}
        amount={orderData.amount}
        description={orderData.description}
        onBack={() => setShowQRPayment(false)}
        onPaymentComplete={(result) => {
          console.log('Payment completed:', result);
          // Handle successful payment
          // Redirect to order confirmation
        }}
      />
    );
  }

  return (
    <div>
      {/* Your checkout UI */}
      <button onClick={handlePayment}>Pay with QR Code</button>
    </div>
  );
}
```

## Paytm Credentials

Your Siva Electronics Paytm credentials:

| Field | Value |
|-------|-------|
| Merchant ID | oAqfaJ24295935325563 |
| Merchant Key | WqZs7&tlq7h5Oasn |
| Website | DEFAULT |
| Industry Type | Retail |
| Channel ID (Website) | WEB |
| Channel ID (Mobile) | WAP |

⚠️ **IMPORTANT**: Never commit your merchant key to git. Use environment variables.

## Deployment on Render

### Step 1: Connect GitHub

1. Go to [Render.com](https://render.com)
2. Connect your GitHub repository
3. Render will auto-detect the `render.yaml` configuration

### Step 2: Set Environment Variables

In Render dashboard, add these environment variables:

**For Backend Service:**
- `NODE_ENV`: production
- `PAYTM_MERCHANT_ID`: oAqfaJ24295935325563
- `PAYTM_MERCHANT_KEY`: WqZs7&tlq7h5Oasn
- `CALLBACK_URL`: https://your-backend-domain.onrender.com/api/payment/callback
- `FRONTEND_URL`: https://your-frontend-domain.onrender.com

### Step 3: Deploy

Simply push to GitHub. Render will automatically:
1. Build the backend
2. Build the frontend
3. Deploy both services
4. Set up custom domains

## API Endpoints

### Generate QR Code
```
POST /api/payment/qr

Body:
{
  "orderId": "ORDER123",
  "amount": "9440",
  "description": "Electronics Purchase"
}

Response:
{
  "success": true,
  "qrCode": "data:image/png;base64,...",
  "upiString": "upi://pay?pa=...",
  "amount": "9440",
  "orderId": "ORDER123"
}
```

### Initiate Payment
```
POST /api/payment/initiate

Body:
{
  "orderId": "ORDER123",
  "amount": "9440",
  "customerEmail": "customer@example.com",
  "customerPhone": "9876543210",
  "description": "Electronics Purchase"
}

Response:
{
  "success": true,
  "paymentData": {...},
  "qrCode": "data:image/png;base64,...",
  "paymentUrl": "https://securegw.paytm.in/..."
}
```

### Verify Payment
```
POST /api/payment/verify

Body:
{
  "orderId": "ORDER123"
}

Response:
{
  "success": true,
  "message": "Payment verified successfully",
  "data": {...}
}
```

## Security Checklist

- ✅ Merchant Key stored only in server-side environment variables
- ✅ CORS configured to allow only your frontend domain
- ✅ HTTPS enforced in production
- ✅ Checksum validation implemented
- ✅ Payment verification on backend
- ✅ No sensitive data logged

## Testing QR Payment

1. Start both frontend and backend
2. Navigate to checkout
3. Click "Pay with QR Code"
4. Scan with any UPI app (Google Pay, Paytm, PhonePe)
5. Complete payment in UPI app
6. Payment verification happens automatically

## Features

✨ **QR Payment Features:**
- Generate UPI QR codes for any amount
- Auto-polling for payment verification (every 2 seconds)
- 100% Secure Paytm integration
- Mobile responsive UI
- Real-time status updates
- Order ID and amount display
- Security badge with Paytm branding

## Troubleshooting

### QR Code not generating?
- Check backend is running on port 5000
- Verify `API_BASE_URL` in frontend is correct
- Check browser console for errors

### Payment not verifying?
- Ensure order ID matches
- Check Paytm merchant credentials are correct
- Verify callback URL in .env

### CORS errors?
- Update `FRONTEND_URL` in backend .env
- Make sure frontend and backend have matching domains

## Support

For Paytm integration help: https://business.paytm.com/docs
