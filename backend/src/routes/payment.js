import express from 'express';
import { initiatePayment, verifyPayment, generateQRCode } from '../controllers/paymentController.js';

const router = express.Router();

// Generate QR code for payment
router.post('/initiate', initiatePayment);

// Verify payment status
router.post('/verify', verifyPayment);

// Get QR code
router.post('/qr', generateQRCode);

// Paytm callback
router.post('/callback', async (req, res) => {
  try {
    const response = await verifyPayment(req.body);
    res.json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
