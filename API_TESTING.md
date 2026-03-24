# API Testing Guide

## Test Backend Health

```bash
curl http://localhost:5000/health
```

Expected response:
```json
{"status":"OK","message":"Backend is running"}
```

## Generate QR Payment Code

```bash
curl -X POST http://localhost:5000/api/payment/qr \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "ORDER123",
    "amount": "9440",
    "description": "Test Electronics Purchase"
  }'
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

## Initiate Full Payment

```bash
curl -X POST http://localhost:5000/api/payment/initiate \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "ORDER456",
    "amount": "15000",
    "customerEmail": "customer@example.com",
    "customerPhone": "9876543210",
    "description": "Electronics Purchase"
  }'
```

Response:
```json
{
  "success": true,
  "paymentData": {
    "MID": "oAqfaJ24295935325563",
    "WEBSITEID": "DEFAULT",
    "ORDER_ID": "ORDER456",
    ...
  },
  "qrCode": "data:image/png;base64,...",
  "paymentUrl": "https://securegw.paytm.in/theia/api/v1/..."
}
```

## Verify Payment

```bash
curl -X POST http://localhost:5000/api/payment/verify \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "ORDER123"
  }'
```

Response (when payment is verified):
```json
{
  "success": true,
  "message": "Payment verified successfully",
  "data": {
    "verified": true,
    ...
  }
}
```

## JavaScript/Fetch Examples

### Generate QR Code

```javascript
const generateQR = async (orderId, amount) => {
  const response = await fetch('/api/payment/qr', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      orderId,
      amount,
      description: 'Siva Electronics Payment'
    })
  });

  const data = await response.json();
  console.log('QR Code:', data.qrCode);
  return data;
};
```

### Verify Payment

```javascript
const verifyPayment = async (orderId) => {
  const response = await fetch('/api/payment/verify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ orderId })
  });

  const data = await response.json();
  if (data.success) {
    console.log('Payment verified!');
  }
  return data;
};
```

### Poll for Payment (Every 2 seconds)

```javascript
const pollPayment = (orderId, maxAttempts = 30) => {
  let attempts = 0;

  const interval = setInterval(async () => {
    attempts++;

    if (attempts > maxAttempts) {
      clearInterval(interval);
      console.log('Payment verification timeout');
      return;
    }

    const data = await verifyPayment(orderId);

    if (data.success && data.data?.verified) {
      clearInterval(interval);
      console.log('Payment successful!');
      // Handle success
    }
  }, 2000);
};
```

## Testing Payment Flow

1. **Frontend**: Navigate to Cart → Click "Pay with QR"
2. **Backend**: QR code is generated server-side
3. **QR Display**: Shows in payment modal
4. **User Scans**: With any UPI app
5. **Polling**: Frontend automatically checks payment status
6. **Verification**: Backend confirms with Paytm
7. **Success**: Payment page updates with confirmation

## Common Issues

### CORS Error
```
Access to XMLHttpRequest blocked by CORS
```
**Fix**: Check `FRONTEND_URL` in backend `.env`

### QR Not Generating
```
POST /api/payment/qr - 500 Internal Server Error
```
**Fix**: Check backend is running on port 5000

### Payment Not Verifying
```
"verified": false
```
**Fix**: Ensure merchant credentials are correct

### Network Error
```
fetch failed: Network error
```
**Fix**: Ensure backend URL in frontend config is correct

## Monitoring

### Backend Logs
```bash
# In backend directory
npm run dev
```
Watch console for request logs

### Frontend Console
```javascript
// Browser DevTools → Console
// Clear browser cache if needed
// Ctrl+Shift+Delete or Cmd+Shift+Delete
```

### Network Tab
- DevTools → Network
- Watch API calls to `/api/payment/*`
- Check request/response bodies

## Production Testing

Use Paytm Sandbox:
- Merchant ID: provided by Paytm
- Test Mode: Available in Paytm dashboard
- Test Cards: Available in Paytm documentation

## Next Steps

1. Test locally with curl commands
2. Test in browser console with fetch
3. Test QR payment component
4. Deploy to Render
5. Test on production with Paytm test credentials
