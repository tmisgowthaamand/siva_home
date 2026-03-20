# Siva Electronics Backend API

Backend API for Siva Electronics with Paytm QR payment integration.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env` file (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

3. Add your Paytm credentials to `.env`:
   - PAYTM_MERCHANT_ID: oAqfaJ24295935325563
   - PAYTM_MERCHANT_KEY: WqZs7&tlq7h5Oasn

4. Start development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Generate QR Code for Payment
**POST** `/api/payment/qr`

Request body:
```json
{
  "orderId": "ORDER123",
  "amount": "9440",
  "description": "Electronics Purchase"
}
```

Response:
```json
{
  "success": true,
  "qrCode": "data:image/png;base64,...",
  "upiString": "upi://pay?pa=...",
  "amount": "9440",
  "orderId": "ORDER123"
}
```

### Initiate Payment
**POST** `/api/payment/initiate`

Request body:
```json
{
  "orderId": "ORDER123",
  "amount": "9440",
  "customerEmail": "customer@example.com",
  "customerPhone": "9876543210",
  "description": "Electronics Purchase"
}
```

### Verify Payment
**POST** `/api/payment/verify`

Request body:
```json
{
  "orderId": "ORDER123",
  "transactionId": "TXN123"
}
```

## Deployment on Render

1. Connect your GitHub repository to Render
2. Create two services:
   - **Backend**: Node.js service
   - **Frontend**: Static site service

3. Set environment variables in Render dashboard:
   - PAYTM_MERCHANT_ID
   - PAYTM_MERCHANT_KEY
   - CALLBACK_URL (your Render backend URL)
   - FRONTEND_URL (your Render frontend URL)

4. Deploy using `render.yaml` configuration

## Environment Variables

- `PAYTM_MERCHANT_ID` - Your Paytm Merchant ID
- `PAYTM_MERCHANT_KEY` - Your Paytm Merchant Key
- `PAYTM_WEBSITE` - Website identifier (DEFAULT)
- `PAYTM_CHANNEL_ID` - Channel ID (WEB)
- `PAYTM_INDUSTRY_TYPE` - Industry Type (Retail)
- `CALLBACK_URL` - Payment callback URL
- `FRONTEND_URL` - Frontend application URL

## Security Notes

⚠️ **IMPORTANT**: Never commit `.env` file with real credentials. Always use:
- `.env.example` for template
- Environment variable configuration in deployment platforms
- Merchant Key should be stored securely server-side only
