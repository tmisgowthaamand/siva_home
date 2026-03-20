import crypto from 'crypto';
import axios from 'axios';
import QRCode from 'qrcode';

const MERCHANT_ID = process.env.PAYTM_MERCHANT_ID;
const MERCHANT_KEY = process.env.PAYTM_MERCHANT_KEY;
const PAYTM_API_URL = process.env.PAYTM_API_URL;

// Generate checksum for Paytm
function generateChecksum(data, salt) {
  const message = Object.keys(data)
    .sort()
    .map(key => {
      return `${key}=${data[key]}`;
    })
    .join('&');

  const hmac = crypto.createHmac('sha256', salt);
  hmac.update(message);
  return hmac.digest('hex');
}

// Initiate payment and generate QR
export async function initiatePayment(req, res) {
  try {
    const { orderId, amount, customerEmail, customerPhone, description } = req.body;

    if (!orderId || !amount || !customerEmail || !customerPhone) {
      return res.status(400).json({
        error: 'Missing required fields: orderId, amount, customerEmail, customerPhone'
      });
    }

    const paymentData = {
      MID: MERCHANT_ID,
      WEBSITEID: process.env.PAYTM_WEBSITE,
      ORDER_ID: orderId,
      CUST_ID: customerEmail,
      MOBILE_NO: customerPhone,
      EMAIL: customerEmail,
      TXN_AMOUNT: amount.toString(),
      CALLBACK_URL: process.env.CALLBACK_URL,
      CHANNEL_ID: process.env.PAYTM_CHANNEL_ID,
      INDUSTRY_TYPE: process.env.PAYTM_INDUSTRY_TYPE,
      PAYMENT_TYPE_ID: 'CCDC',
      PAYTM_PAYMENT_METHOD: 'UPI',
      PROMO_CODE: ''
    };

    const checksum = generateChecksum(paymentData, MERCHANT_KEY);
    paymentData.CHECKSUMHASH = checksum;

    // Generate QR code data
    const qrData = {
      orderId,
      amount,
      merchantId: MERCHANT_ID,
      description: description || 'Siva Electronics Payment'
    };

    const qrCode = await QRCode.toDataURL(JSON.stringify(qrData));

    res.json({
      success: true,
      paymentData,
      qrCode,
      paymentUrl: `${process.env.PAYTM_PAYMENT_URL}?${new URLSearchParams(paymentData).toString()}`
    });
  } catch (error) {
    console.error('Payment initiation error:', error);
    res.status(500).json({ error: error.message });
  }
}

// Generate QR code for UPI payment
export async function generateQRCode(req, res) {
  try {
    const { orderId, amount, description } = req.body;

    if (!orderId || !amount) {
      return res.status(400).json({
        error: 'Missing required fields: orderId, amount'
      });
    }

    // Create UPI string for QR
    // UPI format: upi://pay?pa=<UPI ID>&pn=<Name>&am=<Amount>&tn=<Description>&tr=<Transaction ID>
    const upiString = `upi://pay?pa=sivaelectronics@paytm&pn=SivaElectronics&am=${amount}&tn=${description || 'Order Payment'}&tr=${orderId}`;

    const qrCode = await QRCode.toDataURL(upiString);

    res.json({
      success: true,
      qrCode,
      upiString,
      amount,
      orderId
    });
  } catch (error) {
    console.error('QR generation error:', error);
    res.status(500).json({ error: error.message });
  }
}

// Verify payment
export async function verifyPayment(req, res) {
  try {
    const { orderId, transactionId } = req.body;

    if (!orderId) {
      return res.status(400).json({
        error: 'Order ID is required'
      });
    }

    const verifyData = {
      MID: MERCHANT_ID,
      ORDER_ID: orderId
    };

    const checksum = generateChecksum(verifyData, MERCHANT_KEY);
    verifyData.CHECKSUMHASH = checksum;

    // Call Paytm verify API
    const response = await axios.post(
      `${PAYTM_API_URL}/validateChecksum`,
      verifyData
    );

    if (response.data && response.data.verified) {
      res.json({
        success: true,
        message: 'Payment verified successfully',
        data: response.data
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment verification failed',
        data: response.data
      });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ error: error.message });
  }
}
